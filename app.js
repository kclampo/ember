/*
 * Ember — app.js  (v1.3.0)
 *
 * TWO TABS
 *   Questions → connection. Seen-list PERSISTS forever, with a reset button.
 *   Games     → menu · truthdare · kindling. Session-based, 12-hour expiry,
 *               New game button.
 *
 * Why they differ: a connection question is SPENT the moment it is answered —
 * re-asking it later is a replay with a contaminated answer. A game card is not
 * spent; it is as good the tenth time. So one needs memory and the other needs
 * amnesia. Do not unify them.
 *
 * ⚠️ VALIDATE AS ESM BEFORE EVERY PUSH:  bash check.sh
 * `node --check app.js` exits 0 on broken module code — the import makes Node
 * bail as CommonJS before it reaches the real error.
 */

import { CARDS, DECKS, TIERS, TABS, WOULD_OPTS, NOISH, LEGACY_IDS, stageForRound } from './deck.js';
import { APP_VERSION } from './version.js';
import { match, close, bothMaybe, scaleMatch, scaleClose, ding } from './audio.js';
import * as L from './limits.js';

const $ = id => document.getElementById(id);
const LS = {
  names: 'ember.names', roles: 'ember.roles',
  qseen: 'ember.qseen', qdeck: 'ember.qdeck', qtier: 'ember.qtier',
  menu: 'ember.menu',
  session: 'ember.session', limits: 'ember.limits', tab: 'ember.tab',
  limitsrt: 'ember.limitsrt',
};

const load = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const OTHER = p => (p === 'him' ? 'her' : 'him');

/* ⛔ NO NAMES IN THIS FILE. Typed on the device, stored in localStorage only. */
const DEFAULT_NAME = { him: 'Him', her: 'Her' };
const DEFAULT_ROLE = { him: 'switch', her: 'switch' };
const ROLE_LABEL = { dom: 'DOM', sub: 'SUB', switch: 'SWITCH' };

const SESSION_TTL = 12 * 60 * 60 * 1000;   // 12 hours

const state = {
  tab: load(LS.tab, 'questions'),
  names: load(LS.names, { him: '', her: '' }),
  roles: load(LS.roles, { ...DEFAULT_ROLE }),
  qseen: load(LS.qseen, { him: [], her: [] }),
  qdeck: load(LS.qdeck, 'connection'),
  qtier: load(LS.qtier, 1),
  menu: load(LS.menu, { seen: { him: [], her: [] }, ratings: { him: {}, her: {} } }),
  session: null,
  limits: load(LS.limits, { him: {}, her: {} }),
  limitsStage: 'idle',
  limitsWho: 'him',
  limitIdx: 0,
  limitsDraft: { him: {}, her: {} },
};
state.qseen = { him: new Set(state.qseen.him || []), her: new Set(state.qseen.her || []) };

/* ⭐ A LIMITS ROUND INTERRUPTED BY A REFRESH MUST SURVIVE IT (2026-10-28:
   "make sure the limits and menu do not reset when the app is refreshed or a
   new version is pushed"). The finished answers were always persisted; the
   ROUND IN PROGRESS was memory-only, so a reload lost every rating given so
   far and silently restarted at question one. Stage, speaker, position and the
   draft now persist on every answer. */
const LRT = load(LS.limitsrt, null);
if (LRT && (LRT.stage === 'rate' || LRT.stage === 'handoff')) {
  state.limitsStage = LRT.stage;
  state.limitsWho = LRT.who || 'him';
  state.limitIdx = LRT.idx || 0;
  state.limitsDraft = LRT.draft || { him: {}, her: {} };
}
function saveLimitsRt() {
  save(LS.limitsrt, {
    stage: state.limitsStage, who: state.limitsWho,
    idx: state.limitIdx, draft: state.limitsDraft,
  });
}
function clearLimitsRt() { try { localStorage.removeItem(LS.limitsrt); } catch {} }

function nameOf(p) {
  const n = (state.names[p] || '').trim();
  return n || DEFAULT_NAME[p];
}
function roleOf(p) { return state.roles[p] || 'switch'; }

/* ══════════════════════════════════════════════════ view plumbing */
const VIEWS = ['setup', 'cardView', 'rateView', 'handoffView', 'resultView', 'limitsView', 'stageView', 'emptyView'];
function show(which) {
  stopTimer();          // a timer must never outlive the card that started it
  for (const v of VIEWS) $(v).hidden = (v !== which);
}

/* ══════════════════════════════════════════════════ session (games only) */
function freshSession(deck) {
  return {
    startedAt: Date.now(),
    deck,
    round: 1,
    holder: 'him',
    layers: { him: 4, her: 4 },
    seen: { him: [], her: [] },
    done: 0,              // ⭐ activities completed this session — drives the ten-and-ask prompt
    menu: null,           // { ids, ratings:{him,her}, stage:'rate'|'handoff'|'reveal', who, idx }
    card: null, person: null, revealed: false,
  };
}

function getSession(deck) {
  const s = state.session;
  if (!s || s.deck !== deck) { state.session = freshSession(deck); save(LS.session, state.session); return state.session; }
  if (Date.now() - s.startedAt > SESSION_TTL) { state.session = freshSession(deck); save(LS.session, state.session); return state.session; }
  return s;
}

function persistSession() { if (state.session) save(LS.session, state.session); }

/* restore a session that has not expired */
(function restore() {
  const s = load(LS.session, null);
  if (s && s.startedAt && Date.now() - s.startedAt <= SESSION_TTL) state.session = s;
})();

/* ══════════════════════════════════════════════════ veto filter */
let BLOCKED = new Set();
let timerH = null;          // the card timer's interval handle — exactly one may exist

/* ⛔ A VETO APPLIES TO ACTIONS, NOT TO QUESTIONS. The Connection deck is
   conversation — a hard no on "being watched" must not delete "what's a thing
   your partner says that you could listen to all day". So the veto filters the
   game decks only. (Caught in test: connection cards were being excluded.) */
function gameCards() {
  return CARDS.filter(c => {
    const d = DECKS.find(x => x.id === c.deck);
    return d && d.tab === 'games';
  });
}

/* ⭐ THE MENU GATES THE GAMES (2026-10-28: "it is more about us and
   should be locked in questions that affect the other games").
   A Menu card carries a `gate` — a limit-act id. If EITHER of you answers
   "Hard no" on it, that whole theme stops being dealt in Truth or Dare and
   Kindling. It is persisted and permanent, not a session setting.
   ⚠️ ONLY "HARD NO" GATES. "Not for me" is the soft refusal and must change
   nothing in the games — otherwise a mild preference quietly deletes a whole
   theme and nobody is told. (2026-10-28: "The menu card should remove if the
   answer is a hard no, not a not for me, which is soft.") */
function menuGates() {
  const st = menuStore();
  const gates = new Set();
  for (const c of CARDS) {
    if (!c.gate) continue;
    if (st.ratings.him[c.id] === 'Hard no' || st.ratings.her[c.id] === 'Hard no') gates.add(c.gate);
  }
  return gates;
}

function recomputeBlocked() {
  const games = gameCards();
  BLOCKED = L.blockedIds(games, state.limits);
  const g = menuGates();
  if (g.size) for (const id of L.blockedIdsFor(games, [...g])) BLOCKED.add(id);
}

/* ══════════════════════════════════════════════════ The Menu store (persistent) */
function menuStore() {
  if (!state.menu || !state.menu.seen || !state.menu.ratings) {
    state.menu = { seen: { him: [], her: [] }, ratings: { him: {}, her: {} } };
  }
  return state.menu;
}
function saveMenu() { save(LS.menu, menuStore()); }

/* ⭐ NOTHING RATED ON AN OLDER BUILD MAY VANISH (2026-10-28: "make sure the
   limits and menu do not reset when the app is refreshed or a new version is
   pushed"). Ids became content-derived in 1.3.3, so ids written by 1.3.x are
   translated here. Anything that still cannot be resolved is KEPT, never
   deleted — an unknown key is inert (menuGates only ever walks CARDS) and
   silent deletion is exactly how data disappears. */
const KNOWN_IDS = new Set(CARDS.map(c => c.id));
const remapId = id => KNOWN_IDS.has(id) ? id : (LEGACY_IDS[id] || id);

function migrateStoredIds() {
  const st = menuStore();
  for (const who of ['him', 'her']) {
    const out = {};
    for (const [k, v] of Object.entries(st.ratings[who] || {})) out[remapId(k)] = v;
    st.ratings[who] = out;
    st.seen[who] = [...new Set((st.seen[who] || []).map(remapId))];
    if (st.round && st.round.ratings) {
      const rr = {};
      for (const [k, v] of Object.entries(st.round.ratings[who] || {})) rr[remapId(k)] = v;
      st.round.ratings[who] = rr;
    }
  }
  if (st.round) st.round.ids = st.round.ids.map(remapId);

  const q = { him: new Set(), her: new Set() };
  for (const who of ['him', 'her']) for (const id of state.qseen[who]) q[who].add(remapId(id));
  state.qseen = q;

  saveMenu();
  save(LS.qseen, { him: [...q.him], her: [...q.her] });
}

/* ══════════════════════════════════════════════════ pool / draw */
const deckById = id => DECKS.find(d => d.id === id);

function tierPool(deckId, tier) {
  const d = deckById(deckId);
  /* ⭐ EXACT TIER ON THE GAMES DECKS (2026-10-28: "as I move from spark to flame
     to blaze the card count increases. does this mean if I am at blaze I will
     get spark level questions? ... the q pools should be limited to the area").
     Yes — it did. The old test was `c.tier <= tier`, so Blaze dealt Spark and
     Flame cards and the ladder never actually got hotter; it just got longer,
     and the odds of a cold card went UP the further you climbed.
     ⚠️ Connection and The Menu stay cumulative on purpose: their tiers are
     levels of HONESTY, not temperature, and a deep question is not spoiled by
     having a shallower one available. */
  const exact = d && d.tab === 'games';
  return CARDS.filter(c =>
    c.deck === deckId &&
    (exact ? c.tier === tier : c.tier <= tier) &&
    !BLOCKED.has(c.id)
  );
}

/* a person can draw cards whose perspective is 'any' or matches their role */
function perspectiveOk(card, person) {
  const r = roleOf(person);
  if (r === 'switch') return true;
  return card.as === 'any' || card.as === r;
}

function seenSet(person) {
  const s = state.session;
  if (!s) return new Set();
  return new Set(s.seen[person] || []);
}

/* ⭐ A DIRECTIONAL VETO IS EVALUATED PER PERSON (2026-10-28).
   "Go down on them" is GIVING oral for whoever holds it and RECEIVING oral for
   their partner. One global text match would block BOTH directions the moment
   either of you vetoed either — which is the wrong answer, because not being
   willing to give says nothing about being willing to receive. So a card
   carrying an `acts` map is checked against the role each person would actually
   play in it: `holder` for the drawer, `other` for their partner. */
function blockedFor(card, person) {
  if (BLOCKED.has(card.id)) return true;      // global text vetoes still win
  const a = card.acts;
  if (!a) return false;
  const them = OTHER(person);
  const no = (who, list) => (list || []).some(k => state.limits[who] && state.limits[who][k] === 'hardno');
  return no(person, a.holder) || no(them, a.other);
}

function availableFor(deckId, tier, person, { persistent = false, kind = null, extraFilter = null } = {}) {
  const seen = persistent ? state.qseen[person] : seenSet(person);
  return tierPool(deckId, tier).filter(c =>
    !blockedFor(c, person) &&
    !seen.has(c.id) &&
    (c.for === 'both' || c.for === person) &&
    perspectiveOk(c, person) &&
    (kind ? c.kind === kind : true) &&
    (extraFilter ? extraFilter(c) : true)
  );
}

/* ══════════════════════════════════════════════════ verdicts + sound */
const YES = 'Yes', MAYBE = 'Maybe';

/* ⭐ COMPATIBILITY CARDS: the verdict is read off the PAIR of positions, not
   from equality. "I lead" + "they follow" is a match; "I lead" + "I lead" is a
   clash. The card supplies `pair` (which rule) and `map` (option → position). */
function pairVerdict(card, A, B) {
  const m = card.map || {};
  const a = m[A], b = m[B];
  if (!a || !b) return null;
  if (a === 'flex' || b === 'flex') return 'complement';   // one of you has no preference
  if ((a === 'lead' && b === 'follow') || (a === 'follow' && b === 'lead')) return 'complement';
  if (a === 'trade' && b === 'trade') return 'complement';
  if (a === b) return a === 'lead' ? 'bothLead' : 'neitherLead';
  return 'talk';
}

function verdictOf(card, mine, theirs) {
  if (mine === undefined || theirs === undefined) return null;
  const A = String(mine), B = String(theirs);
  if (card.pair && card.map) return pairVerdict(card, A, B);
  if (card.answer === 'would') {
    if (A === YES && B === YES) return 'match';
    if ((A === YES && B === MAYBE) || (A === MAYBE && B === YES)) return 'close';
    if (A === MAYBE && B === MAYBE) return 'bothMaybe';
    if ((A === YES && NOISH.has(B)) || (NOISH.has(A) && B === YES)) return 'mismatch';
    return null;
  }
  if (card.answer === 'scale') {
    const d = Math.abs(Number(A) - Number(B));
    if (!Number.isFinite(d)) return null;
    return d === 0 ? 'scaleMatch' : d === 1 ? 'scaleClose' : null;
  }
  if (card.answer === 'pick' || card.answer === 'thisor') return A === B ? 'match' : null;
  if (card.answer === 'open') return null;
  return null;
}

const SOUND = { match, close, bothMaybe, scaleMatch, scaleClose, complement: match };

/* ⚠️ A verdict must not claim something that did not happen. A `pick` card both
   answered "Morning" is a match — nobody said yes. */
function verdictLabel(v, card, mine, theirs) {
  if (v === 'match') return card.answer === 'would' ? 'Match — you both said yes' : 'Same answer';
  if (v === 'mismatch') {
    const refusal = [String(mine), String(theirs)].find(x => NOISH.has(x));
    return refusal === 'Hard no'
      ? 'Mismatch — one yes, one hard no'
      : 'Mismatch — one yes, one not for me';
  }
  /* ⭐ complementarity, not agreement — see pairVerdict() */
  if (v === 'complement')  return 'Match — the lead and the follow fit each other';
  if (v === 'bothLead')    return 'Clash — you both want to lead';
  if (v === 'neitherLead') return 'Clash — neither of you wants to lead';
  if (v === 'talk')        return 'Talk — you want different shapes';
  return { close:'Close — one yes, one maybe', bothMaybe:'Both said maybe',
           scaleMatch:'Same number', scaleClose:'One apart' }[v] || '';
}

/* ══════════════════════════════════════════════════ header / tabs */
$('version').textContent = 'v' + APP_VERSION;

function paintTabs() {
  $('tabQuestions').classList.toggle('on', state.tab === 'questions');
  $('tabGames').classList.toggle('on', state.tab === 'games');
}
$('tabQuestions').addEventListener('click', () => setTab('questions'));
$('tabGames').addEventListener('click', () => setTab('games'));
function setTab(t) {
  state.tab = t; save(LS.tab, t); paintTabs();
  const decks = DECKS.filter(d => d.tab === t);
  state.qdeck = (t === 'questions') ? 'connection' : (state.qdeck && DECKS.find(d => d.id === state.qdeck && d.tab === 'games') ? state.qdeck : decks[0].id);
  buildDeckSel();
  show('setup');
  paintSetup();
}

/* ══════════════════════════════════════════════════ setup */
function buildDeckSel() {
  const sel = $('deckSel');
  sel.replaceChildren();
  for (const d of DECKS.filter(x => x.tab === state.tab)) {
    const o = document.createElement('option');
    o.value = d.id; o.textContent = d.label;
    sel.appendChild(o);
  }
  sel.value = state.qdeck;
}

function currentDeck() { return state.qdeck || (state.tab === 'questions' ? 'connection' : 'menu'); }
function currentTier() {
  const d = currentDeck();
  return d === 'truthdare' ? stageForRound(getSession('truthdare').round) : state.qtier;
}

function buildTierSeg() {
  const d = currentDeck();
  const wrap = $('tierWrap');
  const seg = $('tierSeg');
  seg.replaceChildren();

  if (d === 'truthdare') {
    /* no picker — it escalates by round. Show the stage line instead. */
    wrap.hidden = true;
    $('ttdStatus').hidden = false;
    const s = getSession('truthdare');
    const t = stageForRound(s.round);
    /* ⭐ WHOSE TURN IT IS (2026-10-28: "the screen needs to indicate who is up to
       decide who's turn it is to press a button"). In this deck the holder is the
       one who chooses Truth or Dare AND answers, so it is said first and plainly. */
    $('tdTurn').textContent = `${nameOf(s.holder)} is up — choose Truth or Dare`;
    $('ttdLine').textContent = `Round ${s.round} · ${TIERS.truthdare[t]}`;
    $('ttdLayers').textContent =
      `${nameOf('him')} ${s.layers.him} on · ${nameOf('her')} ${s.layers.her} on`;
    return;
  }
  $('ttdStatus').hidden = true;
  wrap.hidden = false;
  $('tierLabel').textContent = d === 'connection' ? 'Level' : 'Level';
  const labels = TIERS[d];
  /* ⭐ DERIVED, NOT HARD-CODED (2026-10-28). This loop said `i <= 3`, so adding a
     fourth game level would have rendered three buttons and silently made the
     top tier unreachable. The picker now follows the TIERS table. */
  const levels = Object.keys(labels).map(Number).sort((a, b) => a - b);
  for (const i of levels) {
    const b = document.createElement('button');
    b.className = 'segbtn' + (i === state.qtier ? ' on' : '');
    b.dataset.tier = String(i);
    b.textContent = labels[i];
    seg.appendChild(b);
  }
  $('tierHint').textContent = (deckById(d) && deckById(d).tab === 'games')
    ? 'Only this level — moving up leaves the one below behind.'
    : 'Includes everything below it.';
}

function paintSetup() {
  const d = currentDeck();
  const deck = deckById(d);
  $('deckBlurb').textContent = deck ? deck.blurb : '';
  buildTierSeg();

  const isWho = (d === 'connection' || d === 'kindling');
  const isTD = (d === 'truthdare');
  $('whoWrap').hidden = !isWho;
  $('tdWrap').hidden = !isTD;
  $('menuWrap').hidden = (d !== 'menu');

  $('himSub').textContent = 'draw for ' + nameOf('him');
  $('herSub').textContent = 'draw for ' + nameOf('her');

  $('resetQBtn').hidden = (state.tab !== 'questions');
  $('newGameBtn').hidden = (state.tab !== 'games');

  remain();
}

function remain() {
  const d = currentDeck();
  const tier = currentTier();
  let txt = '';
  if (d === 'connection') {
    const p = tierPool(d, tier);
    const fresh = p.filter(c => !state.qseen.him.has(c.id) && !state.qseen.her.has(c.id)).length;
    txt = `${fresh} fresh of ${p.length} · kept forever`;
  } else if (d === 'menu') {
    const st = menuStore();
    const p = tierPool(d, tier);
    const both = p.filter(c => st.ratings.him[c.id] !== undefined && st.ratings.her[c.id] !== undefined).length;
    txt = `${both} of ${p.length} answered by you both · kept`;
  } else {
    const p = tierPool(d, tier);
    const s = getSession(d);
    const fresh = p.filter(c => !s.seen.him.includes(c.id) && !s.seen.her.includes(c.id)).length;
    txt = `${fresh} fresh of ${p.length} · this session`;
  }
  $('remain').textContent = txt;
}

$('deckSel').addEventListener('change', () => {
  state.qdeck = $('deckSel').value;
  save(LS.qdeck, state.qdeck);
  paintSetup();
});

$('tierSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-tier]');
  if (!b) return;
  state.qtier = +b.dataset.tier;
  save(LS.qtier, state.qtier);
  paintSetup();
});

/* ══════════════════════════════════════════════════ names + roles */
for (const p of ['him', 'her']) {
  const nameIn = $(p + 'Name');
  const roleIn = $(p + 'Role');
  nameIn.value = state.names[p] || '';
  roleIn.value = roleOf(p);
  nameIn.addEventListener('input', () => {
    state.names[p] = nameIn.value.slice(0, 24);
    save(LS.names, state.names);
    paintSetup();
  });
  roleIn.addEventListener('change', () => {
    state.roles[p] = roleIn.value;
    save(LS.roles, state.roles);
    paintSetup();
  });
}

/* ══════════════════════════════════════════════════ card rendering */
function renderCard(card, person, opts = {}) {
  show('cardView');
  const tag = $('cardWho');
  tag.textContent = opts.tag || (person === 'him' ? 'HIM' : 'HER');
  tag.className = 'whoTag ' + (opts.tagClass || person);
  $('cardTier').textContent = (TIERS[card.deck] || {})[card.tier] || '';

  const pitch = $('cardPitch');
  if (card.pitch) { pitch.hidden = false; pitch.textContent = card.pitch; }
  else { pitch.hidden = true; pitch.textContent = ''; }

  $('cardQ').textContent = card.q;

  const box = $('cardPartner');
  box.hidden = true; box.className = 'partner'; box.replaceChildren();

  const oW = $('cardOpts'), sW = $('cardScale');
  oW.hidden = true; sW.hidden = true; oW.replaceChildren(); sW.replaceChildren();

  if (card.answer === 'pick' || card.answer === 'thisor' || card.answer === 'would') {
    oW.hidden = false;
    for (const o of card.opts) oW.appendChild(mkOpt(o));
  } else if (card.answer === 'scale') {
    sW.hidden = false;
    for (let i = 1; i <= 5; i++) sW.appendChild(mkOpt(String(i)));
    const anch = scaleAnchors(card);
    if (anch) sW.appendChild(anch);
  }
  $('passBtn').hidden = false;
  /* ⭐ THE SAME THREE BUTTONS EVERYWHERE (2026-10-28: "the buttons should be the
     same pass next done").
       PASS — not spent. The card goes back in the pool and the turn moves on.
       NEXT — spent. The same person goes again.
       DONE — spent. The turn passes and you are back at the board. */
  $('nextBtn').hidden = false;
  $('doneBtn').textContent = 'DONE';
  $('cardHint').textContent = 'Pass puts it back. Next keeps you going. Done hands it over.';

  /* ⭐ WHO ANSWERS THIS (2026-10-28: "is that for me to answer or the partner?
     It's ambiguous as to the recipient"). The HIM/HER tag names the turn; this
     line names the person the question is put to, in a sentence. */
  $('cardAsked').textContent = opts.asked || `${nameOf(person)} answers`;

  paintTimer(card);
}

/* 1 and 5 were unlabelled — you could not tell which end was which. Every
   `scale` card now carries its own anchor words. */
function scaleAnchors(card) {
  if (!card || !card.lo || !card.hi) return null;
  const d = document.createElement('div');
  d.className = 'scaleAnchors';
  const l = document.createElement('span'); l.textContent = '1 · ' + card.lo;
  const r = document.createElement('span'); r.textContent = '5 · ' + card.hi;
  d.append(l, r);
  return d;
}

function mkOpt(text) {
  const b = document.createElement('button');
  b.className = 'opt';
  b.textContent = text;
  b.addEventListener('click', () => {
    const on = b.classList.contains('on');
    for (const x of b.parentElement.children) x.classList.remove('on');
    if (!on) b.classList.add('on');
  });
  return b;
}

function selectedValue() {
  const on = $('cardView').querySelector('.opt.on');
  return on ? on.textContent : undefined;
}

/* ══════════════════════════════════════════════════ the card timer */
/* ⭐ A TIMED CARD NEEDS A CLOCK (2026-10-28: "for cards that have a time have a
   timer button that you can press that makes it easy to know when 20 seconds or
   a minute"). Cards carry `secs`; the button is shown only when they do.
   ⚠️ The countdown belongs to ONE card. Every view change and every clearCard()
   kills it, because an interval that survives its card fires a beep minutes
   later with nothing on screen to explain it. */
function fmtSecs(s) {
  /* ⚠️ Built with concatenation, NOT a template literal that closes a
     substitution against a bare letter — that form trips the glued-punctuation
     gate in check.sh, which cannot tell a swallowed newline from legitimate
     code. See the note in check.sh. */
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : s + 's';
}
function stopTimer() {
  if (timerH) { clearInterval(timerH); timerH = null; }
  /* ⚠️ The interval and the BUTTON STATE are two different things. Clearing only
     the interval leaves a frozen "running" button on screen when you come back
     to the card, which reads as a clock that is still going. */
  const b = document.getElementById('timerBtn');
  if (b) b.classList.remove('running');
}
function paintTimer(card) {
  stopTimer();
  if (!card || !card.secs) { $('timerWrap').hidden = true; $('timerText').textContent = ''; return; }
  $('timerWrap').hidden = false;
  $('timerBtn').textContent = `Start ${fmtSecs(card.secs)}`;
  $('timerBtn').classList.remove('running');
  $('timerText').textContent = '';
  $('timerText').classList.remove('up');
}
$('timerBtn').addEventListener('click', () => {
  const card = getSession(currentDeck()).card;
  if (!card || !card.secs) return;
  stopTimer();
  let left = card.secs;
  $('timerText').classList.remove('up');
  $('timerText').textContent = fmtSecs(left);
  $('timerBtn').classList.add('running');
  timerH = setInterval(() => {
    left -= 1;
    if (left > 0) { $('timerText').textContent = fmtSecs(left); return; }
    stopTimer();
    $('timerBtn').classList.remove('running');
    $('timerText').textContent = "Time";
    $('timerText').classList.add('up');
    ding();
  }, 1000);
});

let excludeOnce = new Set();   // just-passed cards, skipped for the NEXT draw only

function drawSimple(person) {
  const d = currentDeck();
  const persistent = (d === 'connection');
  const tier = currentTier();
  let pool = availableFor(d, tier, person, { persistent }).filter(c => !excludeOnce.has(c.id));
  /* a PASS must never dead-end the deck — if the exclusion empties the pool,
     ignore it and deal anyway */
  if (!pool.length) pool = availableFor(d, tier, person, { persistent });
  excludeOnce = new Set();

  if (!pool.length) { show('emptyView'); $('emptyMsg').textContent = 'That deck is spent at this level.'; return; }

  const scoped = pool.filter(c => c.for === person);
  const card = scoped.length && Math.random() < 0.5
    ? scoped[Math.floor(Math.random() * scoped.length)]
    : pool[Math.floor(Math.random() * pool.length)];

  const s = getSession(d);
  s.card = card; s.person = person; s.revealed = false;
  persistSession();
  renderCard(card, person);
}

/* ⭐ TEN ACTIVITIES, THEN ASK (2026-10-28: "After doing 10 activities in
   kindling, it should ask if we want to move up a notch or stay where we are for
   another 10"). Tiers are exact now, so without this prompt you would climb by
   guesswork and could sit at Spark all night. */
const KINDLING_BLOCK = 10;

function kindlingTick() {
  if (currentDeck() !== 'kindling') return false;
  const s = getSession('kindling');
  s.done = (s.done || 0) + 1;
  persistSession();
  if (s.done % KINDLING_BLOCK !== 0) return false;
  paintStagePrompt();
  return true;
}

function paintStagePrompt() {
  const s = getSession('kindling');
  const t = state.qtier;
  const labels = TIERS.kindling;
  $('stageMsg').textContent =
    `${s.done} done. Stay at ${labels[t]} for another ${KINDLING_BLOCK}, or move up?`;
  if (t < 3) {
    $('stageUpBtn').hidden = false;
    $('stageUpBtn').textContent = `MOVE UP TO ${labels[t + 1].toUpperCase()}`;
    $('stageSub').textContent =
      `Moving up means the next ${KINDLING_BLOCK} are all ${labels[t + 1]} — nothing below it comes back.`;
  } else {
    $('stageUpBtn').hidden = true;
    $('stageSub').textContent = 'This is the top level. Staying means another ten at Blaze.';
  }
  show('stageView');
}

$('stageStayBtn').addEventListener('click', () => { show('setup'); paintSetup(); });
$('stageUpBtn').addEventListener('click', () => {
  state.qtier = Math.min(3, state.qtier + 1);
  save(LS.qtier, state.qtier);
  show('setup'); paintSetup();
});

/* DONE — the card is spent and the turn passes back to the board. */
function gameDone() {
  const d = currentDeck();
  if (d === 'truthdare') { tdFinish({ advance: true }); return; }
  if (state.tab === 'questions') { nextSimple(); return; }

  const s = getSession(d);
  if (!s.card) return;

  /* a kindling card the other person already drew gets one reveal, then BACK */
  if (!s.revealed) {
    const other = OTHER(s.person);
    if ((s.seen[other] || []).includes(s.card.id)) {
      const box = $('cardPartner');
      box.replaceChildren();
      const row = document.createElement('div');
      row.className = 'prow';
      row.textContent = `${nameOf(other)} drew this one too.`;
      box.append(row);
      box.hidden = false;
      s.revealed = true;
      $('passBtn').hidden = true;
      $('nextBtn').hidden = true;
      $('doneBtn').textContent = 'BACK';
      $('cardOpts').hidden = true;
      $('cardScale').hidden = true;
      stopTimer();
      persistSession();
      return;
    }
  }

  consumeCard();
  clearCard();
  if (kindlingTick()) return;
  show('setup');
  paintSetup();
}

/* NEXT — the card is spent and the SAME person goes again. */
function gameNext() {
  const d = currentDeck();
  if (d === 'truthdare') { tdFinish({ advance: false }); return; }
  if (state.tab === 'questions') { nextQuestion(); return; }

  const s = getSession(d);
  const person = s.person;
  consumeCard();
  clearCard();
  if (kindlingTick()) return;
  if (person) drawSimple(person);
  else { show('setup'); paintSetup(); }
}

/* PASS — the card is NOT spent. It goes back in the pool and the turn moves on. */
function gamePass() {
  const d = currentDeck();
  if (d === 'truthdare') { tdFinish({ advance: true, keep: true }); return; }
  if (state.tab === 'questions') { passQuestion(); return; }

  const s = getSession(d);
  if (s.card) excludeOnce.add(s.card.id);
  clearCard();
  show('setup');
  paintSetup();
}

/* ⭐ THREE BUTTONS on the Questions tab.
   PASS  — the question goes back in the deck. Not consumed, so it can return.
   NEXT  — answered. Consumed. Deal another for the same person.
   DONE  — answered. Consumed. Back to setup. */
function consumeCard() {
  const d = currentDeck();
  const s = getSession(d);
  if (!s.card || !s.person) return;
  if (d === 'connection') {
    state.qseen[s.person].add(s.card.id);
    save(LS.qseen, { him: [...state.qseen.him], her: [...state.qseen.her] });
  } else {
    if (!s.seen[s.person].includes(s.card.id)) s.seen[s.person].push(s.card.id);
  }
}

function clearCard() {
  const s = getSession(currentDeck());
  s.card = null; s.person = null; s.revealed = false;
  persistSession();
}

function nextSimple() {
  consumeCard();
  clearCard();
  show('setup');
  paintSetup();
}

function nextQuestion() {
  const s = getSession(currentDeck());
  const person = s.person;
  consumeCard();
  clearCard();
  if (person) drawSimple(person);
  else { show('setup'); paintSetup(); }
}

function passQuestion() {
  const s = getSession(currentDeck());
  const person = s.person;
  if (s.card) excludeOnce.add(s.card.id);
  clearCard();
  if (person) drawSimple(person);
  else { show('setup'); paintSetup(); }
}

/* ══════════════════════════════════════════════════ TRUTH OR DARE */
function drawTD(kind) {
  const s = getSession('truthdare');
  const tier = stageForRound(s.round);

  /* layer dares must never open a gap wider than 1, and never go below 0 */
  const layerOk = card => {
    if (!card.layer) return true;
    const after = { ...s.layers };
    const me = s.holder, them = OTHER(me);
    const { who, n } = card.layer;
    if (who === 'self' || who === 'self-they-choose') after[me] -= n;
    else if (who === 'partner' || who === 'partner-they-choose' || who === 'partner-you-choose') after[them] -= n;
    else if (who === 'both') { after[me] -= 1; after[them] -= 1; }
    if (after.him < 0 || after.her < 0) return false;
    if (Math.abs(after.him - after.her) > 1) return false;
    return true;
  };

  const pool = availableFor('truthdare', tier, s.holder, { kind, extraFilter: layerOk });
  if (!pool.length) {
    /* stage is exhausted for this kind — fall back to any tier this kind allows */
    show('emptyView');
    $('emptyMsg').textContent = `No ${kind} cards left at this level. Start a new game.`;
    return;
  }
  const card = pool[Math.floor(Math.random() * pool.length)];
  s.card = card; s.person = s.holder;
  persistSession();
  renderCard(card, s.holder, {
    tag: kind.toUpperCase(),
    tagClass: kind === 'truth' ? 'her' : 'him',
    asked: `${nameOf(s.holder)} ${kind === 'truth' ? 'answers' : 'does it'}`,
  });
  $('cardHint').textContent = kind === 'dare'
    ? 'Do it, or pass. Passing costs nothing and the card goes back.'
    : 'Answer honestly, or pass. Passing costs nothing.';
}

/* ⭐ ONE EXIT, THREE WAYS OUT (2026-10-28).
   finish(advance, keep):
     advance:true,  keep:true   → PASS  — card NOT spent, turn moves on
     advance:false, keep:false  → NEXT  — card spent, SAME holder goes again
     advance:true,  keep:false  → DONE  — card spent, turn passes
   ⚠️ NEXT must not cost the turn, or it would be indistinguishable from DONE and
   the third button would be decoration. */
function tdFinish({ advance, keep }) {
  const s = getSession('truthdare');
  if (!s.card) return;

  if (!keep) {
    if (s.card.layer) {
      const { who, n } = s.card.layer;
      const me = s.holder, them = OTHER(me);
      if (who === 'self' || who === 'self-they-choose') s.layers[me] = Math.max(0, s.layers[me] - n);
      else if (who === 'partner' || who === 'partner-they-choose' || who === 'partner-you-choose') s.layers[them] = Math.max(0, s.layers[them] - n);
      else if (who === 'both') { s.layers[me] = Math.max(0, s.layers[me] - 1); s.layers[them] = Math.max(0, s.layers[them] - 1); }
    }
    if (!s.seen[s.holder].includes(s.card.id)) s.seen[s.holder].push(s.card.id);
  }

  s.round += 1;
  if (advance) s.holder = OTHER(s.holder);
  s.card = null; s.person = null; s.revealed = false;
  persistSession();
  show('setup');
  paintSetup();
}

/* kept as thin aliases so no older call site can silently do nothing */
function tdDone() { tdFinish({ advance: true }); }
function tdPass() { tdFinish({ advance: true, keep: true }); }

/* ══════════════════════════════════════════════════ THE MENU (blind round) */
const MENU_N = 10;

function startMenuRound() {
  const st = menuStore();
  const tier = state.qtier;
  /* Both players must rate the SAME cards, so the pool ignores per-person
     perspective and takes anything either role could be given. Cards BOTH have
     already rated are done forever; a card only one of you rated comes back so
     the other can catch up. */
  const pool = tierPool('menu', tier).filter(c => {
    const ratedBoth = st.ratings.him[c.id] !== undefined && st.ratings.her[c.id] !== undefined;
    if (ratedBoth) return false;
    return c.as === 'any' || roleOf('him') === 'switch' || roleOf('her') === 'switch' ||
           c.as === roleOf('him') || c.as === roleOf('her');
  });
  if (pool.length < 1) {
    show('emptyView');
    $('emptyMsg').textContent = 'You have both answered every card at this level.';
    return;
  }
  const halfDone = pool.filter(c =>
    (st.ratings.him[c.id] !== undefined) !== (st.ratings.her[c.id] !== undefined));
  const fresh = pool.filter(c =>
    st.ratings.him[c.id] === undefined && st.ratings.her[c.id] === undefined);
  const ordered = [...shuffle(halfDone), ...shuffle(fresh)];
  const ids = ordered.slice(0, MENU_N).map(c => c.id);

  st.round = { ids, who: 'him', idx: 0, ratings: { him: {}, her: {} } };
  saveMenu();
  paintRate();
}

function shuffle(a) { return a.slice().sort(() => Math.random() - 0.5); }
function persistMenuRound() { saveMenu(); }

function menuWho() {
  const st = menuStore();
  if (!st.round) return null;
  const who = st.round.who, other = OTHER(who);
  /* advance past anything this person already answered in a previous round */
  while (st.round.idx < st.round.ids.length &&
         st.ratings[who][st.round.ids[st.round.idx]] !== undefined) {
    st.round.idx += 1;
  }
  if (st.round.idx >= st.round.ids.length) {
    if (who === 'him') { st.round.who = 'her'; st.round.idx = 0; saveMenu(); return 'handoff'; }
    return 'reveal';
  }
  return 'rate';
}

function paintRate() {
  const st = menuStore();
  if (!st.round) { show('setup'); return; }
  const stage = menuWho();
  if (stage === 'handoff') {
    $('handoffMsg').textContent = `Pass the phone to ${nameOf('her')}.`;
    show('handoffView');
    return;
  }
  if (stage === 'reveal') { paintResults(); return; }

  const who = st.round.who;
  const card = CARDS.find(c => c.id === st.round.ids[st.round.idx]);
  show('rateView');
  $('rateWho').textContent = nameOf(who);
  $('rateProgress').textContent = `${st.round.idx + 1} of ${st.round.ids.length}`;
  const p = $('ratePitch');
  if (card.pitch) { p.hidden = false; p.textContent = card.pitch; } else { p.hidden = true; p.textContent = ''; }
  $('rateQ').textContent = card.q;

  const w = $('rateOpts');
  w.replaceChildren();
  const list = card.answer === 'scale' ? ['1','2','3','4','5'] : (card.opts || WOULD_OPTS);
  for (const o of list) {
    const b = document.createElement('button');
    b.className = 'opt';
    b.textContent = o;
    b.addEventListener('click', () => {
      /* ⭐ these ratings are PERMANENT. They drive the gates. */
      st.ratings[who][card.id] = o;
      st.round.idx += 1;
      saveMenu();
      recomputeBlocked();
      paintRate();
    });
    w.appendChild(b);
  }
  if (card.answer === 'scale') {
    const anch = scaleAnchors(card);
    if (anch) w.appendChild(anch);
  }
}

function paintResults() {
  const st = menuStore();
  const r = st.round;
  const list = $('resultList');
  list.replaceChildren();
  for (const id of r.ids) {
    const card = CARDS.find(c => c.id === id);
    const mine = st.ratings.him[id], theirs = st.ratings.her[id];
    const v = verdictOf(card, mine, theirs);
    const row = document.createElement('div');
    row.className = 'resRow' + (v ? ' ' + v : '');
    const q = document.createElement('p');
    q.className = 'resQ';
    q.textContent = card.q;
    row.append(q);
    for (const [label, val] of [[nameOf('him'), mine], [nameOf('her'), theirs]]) {
      const d = document.createElement('div');
      d.className = 'prow';
      const s1 = document.createElement('span'); s1.className = 'plbl'; s1.textContent = label;
      const s2 = document.createElement('span'); s2.className = 'ptxt'; s2.textContent = val || '—';
      d.append(s1, s2); row.append(d);
    }
    if (v) {
      const f = document.createElement('div');
      f.className = 'verdict ' + v;
      f.textContent = verdictLabel(v, card, mine, theirs);
      row.append(f);
      const play = SOUND[v];
      if (play) play();
    }
    list.appendChild(row);
  }
  const g = menuGates();
  $('resultSub').textContent = `${r.ids.length} cards · nobody saw the other's answers until now` +
    (g.size ? ` · ${g.size} theme${g.size === 1 ? '' : 's'} locked out of the games` : '');
  show('resultView');
}

function finishMenuRound() {
  const st = menuStore();
  st.round = null;
  saveMenu();
  recomputeBlocked();
  show('setup');
  paintSetup();
}

/* ══════════════════════════════════════════════════ LIMITS */
function openLimits() {
  recomputeBlocked();
  /* an in-flight round resumes; a finished one shows what you said rather than
     inviting you to overwrite it */
  const answered = k => Object.keys(state.limits[k] || {}).length > 0;
  if (state.limitsStage !== 'rate' && state.limitsStage !== 'handoff') {
    state.limitsStage = (answered('him') && answered('her')) ? 'table' : 'intro';
  }
  paintLimits();
}

function paintLimits() {
  show('limitsView');
  const host = $('limitsBody');
  host.replaceChildren();

  if (state.limitsStage === 'intro') {
    const p = document.createElement('p');
    p.className = 'q';
    p.textContent = 'Limits';
    host.append(p);
    const t = document.createElement('p');
    t.className = 'hint';
    t.textContent = 'Each of you rates every act. Nobody sees the other\'s answers until you are both done. A Hard No from either of you removes that card from every game — it cannot be outvoted.';
    host.append(t);
    const b = btn('Start — ' + nameOf('him') + ' first', 'done wide', () => {
      state.limitsStage = 'rate'; state.limitsWho = 'him'; state.limitIdx = 0;
      state.limitsDraft = { him: {}, her: {} };
      saveLimitsRt();
      paintLimits();
    });
    host.append(b);
    return;
  }

  if (state.limitsStage === 'rate') {
    const items = L.LIMIT_ITEMS;
    if (state.limitIdx >= items.length) {
      if (state.limitsWho === 'him') {
        state.limitsDraft.him = { ...state.limitsDraft.him };
        state.limitsStage = 'handoff';
        saveLimitsRt();
        paintLimits(); return;
      }
      state.limits = { him: { ...state.limitsDraft.him }, her: { ...state.limitsDraft.her } };
      save(LS.limits, state.limits);
      recomputeBlocked();
      state.limitsStage = 'table';
      clearLimitsRt();
      paintLimits(); return;
    }
    const item = items[state.limitIdx];
    const top = document.createElement('p');
    top.className = 'rateTop';
    top.textContent = `${nameOf(state.limitsWho)} · ${state.limitIdx + 1} of ${items.length}`;
    host.append(top);
    const q = document.createElement('p');
    q.className = 'q';
    q.textContent = item.label;
    host.append(q);
    const wrap = document.createElement('div');
    wrap.className = 'opts';
    for (const s of L.SCALE) {
      const b = document.createElement('button');
      b.className = 'opt' + (state.limitsDraft[state.limitsWho][item.id] === s.id ? ' on' : '');
      b.textContent = s.label;
      b.addEventListener('click', () => {
        state.limitsDraft[state.limitsWho][item.id] = s.id;
        state.limitIdx += 1;
        saveLimitsRt();
        paintLimits();
      });
      wrap.append(b);
    }
    host.append(wrap);
    const h = document.createElement('p');
    h.className = 'hint2';
    h.textContent = 'One answer is enough. You will never be asked why.';
    host.append(h);
    return;
  }

  if (state.limitsStage === 'handoff') {
    const p = document.createElement('p');
    p.className = 'q';
    p.textContent = `Pass the phone to ${nameOf('her')}.`;
    host.append(p);
    const t = document.createElement('p');
    t.className = 'hint';
    t.textContent = `${nameOf('him')}'s answers are hidden.`;
    host.append(t);
    host.append(btn('Continue', 'done wide', () => {
      state.limitsStage = 'rate'; state.limitsWho = 'her'; state.limitIdx = 0;
      saveLimitsRt();
      paintLimits();
    }));
    return;
  }

  /* the table: two columns, the name is the header */
  const view = L.listView(state.limits, nameOf);
  const table = document.createElement('table');
  table.className = 'limitsTable';
  /* ⭐ TWO COLUMNS, THE NAME IS THE HEADER. The act is the row label, not a
     column. No sum column — the scoring is the mechanism, not the readout. */
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  const th0 = document.createElement('th'); th0.textContent = ''; hr.append(th0);
  for (const h of view.head) { const th = document.createElement('th'); th.textContent = h; hr.append(th); }
  thead.append(hr); table.append(thead);

  const tb = document.createElement('tbody');
  for (const row of view.rows) {
    const tr = document.createElement('tr');
    if (row.veto) tr.className = 'veto';
    const td0 = document.createElement('td');
    td0.textContent = row.label;
    if (row.veto) {
      const b = document.createElement('span');
      b.className = 'vetoTag';
      b.textContent = 'veto';
      td0.append(' ', b);
    }
    tr.append(td0);
    const td1 = document.createElement('td'); td1.textContent = row.him; tr.append(td1);
    const td2 = document.createElement('td'); td2.textContent = row.her; tr.append(td2);
    tb.append(tr);
  }
  table.append(tb);
  host.append(table);

  const blockedN = BLOCKED.size;
  const foot = document.createElement('p');
  foot.className = 'hint';
  foot.textContent = `${blockedN} card${blockedN === 1 ? '' : 's'} removed from every game by your hard noes. Anything scoring 4 or less is hidden.`;
  host.append(foot);

  host.append(btn('Reset list', 'link wide', () => {
    state.limits = L.blankAnswers();
    save(LS.limits, state.limits);
    state.limitsDraft = { him: {}, her: {} };
    clearLimitsRt();
    recomputeBlocked();
    state.limitsStage = 'intro';
    paintLimits();
  }));
  host.append(btn('Back', 'done wide', () => { show('setup'); paintSetup(); }));
}

function btn(text, cls, fn) {
  const b = document.createElement('button');
  b.className = cls; b.textContent = text;
  b.addEventListener('click', fn);
  return b;
}

/* ══════════════════════════════════════════════════ wiring */
$('himBtn').addEventListener('click', () => drawSimple('him'));
$('herBtn').addEventListener('click', () => drawSimple('her'));
$('truthBtn').addEventListener('click', () => drawTD('truth'));
$('dareBtn').addEventListener('click', () => drawTD('dare'));
$('startRoundBtn').addEventListener('click', startMenuRound);
/* The handoff transition ALREADY happened inside menuWho() — it flipped the
   round to the second person before showing this screen. This handler must not
   touch state; it only re-renders. (v1.3.1 shipped this pointing at the retired
   session-based menu, so it did nothing and the round silently corrupted.) */
$('handoffBtn').addEventListener('click', () => paintRate());
$('resultDone').addEventListener('click', finishMenuRound);
$('limitsBtn').addEventListener('click', openLimits);
$('limitsClose').addEventListener('click', () => { show('setup'); paintSetup(); });

/* ⭐ ONE WIRING FOR BOTH TABS (2026-10-28: "the buttons should be the same pass
   next done"). Each handler dispatches on the deck and on the tab; there is no
   second button set to drift out of sync. Older versions hid NEXT on the games
   tab, which is exactly how the two tabs ended up behaving differently. */
$('doneBtn').addEventListener('click', gameDone);
$('nextBtn').addEventListener('click', gameNext);
$('passBtn').addEventListener('click', gamePass);

$('newGameBtn').addEventListener('click', () => {
  state.session = freshSession(currentDeck());
  persistSession();
  paintSetup();
});

$('resetQBtn').addEventListener('click', () => {
  /* the Questions tab reset clears BOTH: the Connection seen-list and every
     Menu rating. Both are questions, both are permanent, so one button. */
  state.qseen = { him: new Set(), her: new Set() };
  save(LS.qseen, { him: [], her: [] });
  state.menu = { seen: { him: [], her: [] }, ratings: { him: {}, her: {} } };
  saveMenu();
  recomputeBlocked();
  paintSetup();
});

$('againBtn').addEventListener('click', () => {
  state.session = freshSession(currentDeck());
  persistSession();
  show('setup'); paintSetup();
});

/* ══════════════════════════════════════════════════ boot */
migrateStoredIds();          // translate pre-1.3.3 ids BEFORE anything reads BLOCKED
recomputeBlocked();
paintTabs();
buildDeckSel();
paintSetup();

/* resume a Menu round that was mid-flight — it lives in its own store now */
if (state.menu && state.menu.round) {
  state.qdeck = 'menu';
  setTab('questions');
  paintRate();
}

/* ══════════════════════════════════════════════════ service worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

export const __test = { state, verdictOf, LIMITS: L, drawSimple, drawTD, drawFor: drawSimple, currentTier, getSession, freshSession, startMenuRound, paintRate, paintResults, finishMenuRound, openLimits, paintLimits, recomputeBlocked, blockedSet: () => BLOCKED, nameOf, roleOf, gameDone, gameNext, gamePass, tdFinish, kindlingTick, paintStagePrompt, paintTimer, stopTimer, tierPool, renderCard, currentDeck, blockedFor, availableFor };
