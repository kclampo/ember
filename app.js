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

import { CARDS, DECKS, TIERS, TABS, WOULD_OPTS, stageForRound } from './deck.js';
import { APP_VERSION } from './version.js';
import { match, close, bothMaybe, scaleMatch, scaleClose } from './audio.js';
import * as L from './limits.js';

const $ = id => document.getElementById(id);
const LS = {
  names: 'ember.names', roles: 'ember.roles',
  qseen: 'ember.qseen', qdeck: 'ember.qdeck', qtier: 'ember.qtier',
  menu: 'ember.menu',
  session: 'ember.session', limits: 'ember.limits', tab: 'ember.tab',
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
};
state.qseen = { him: new Set(state.qseen.him || []), her: new Set(state.qseen.her || []) };

function nameOf(p) {
  const n = (state.names[p] || '').trim();
  return n || DEFAULT_NAME[p];
}
function roleOf(p) { return state.roles[p] || 'switch'; }

/* ══════════════════════════════════════════════════ view plumbing */
const VIEWS = ['setup', 'cardView', 'rateView', 'handoffView', 'resultView', 'limitsView', 'emptyView'];
function show(which) {
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

/* ⭐ THE MENU GATES THE GAMES (Kevin, 2026-10-28: "it is more about us and
   should be locked in questions that affect the other games").
   A Menu card carries a `gate` — a limit-act id. If EITHER of you answers
   "Not for me" on it, that whole theme stops being dealt in Truth or Dare and
   Kindling. It is a soft veto: persisted, not a session setting, and it moves
   with the answers rather than expiring in 12 hours. */
function menuGates() {
  const st = menuStore();
  const gates = new Set();
  for (const c of CARDS) {
    if (!c.gate) continue;
    if (st.ratings.him[c.id] === 'Not for me' || st.ratings.her[c.id] === 'Not for me') gates.add(c.gate);
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

/* ══════════════════════════════════════════════════ pool / draw */
const deckById = id => DECKS.find(d => d.id === id);

function tierPool(deckId, tier) {
  return CARDS.filter(c =>
    c.deck === deckId && c.tier <= tier && !BLOCKED.has(c.id)
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

function availableFor(deckId, tier, person, { persistent = false, kind = null, extraFilter = null } = {}) {
  const seen = persistent ? state.qseen[person] : seenSet(person);
  return tierPool(deckId, tier).filter(c =>
    !seen.has(c.id) &&
    (c.for === 'both' || c.for === person) &&
    perspectiveOk(c, person) &&
    (kind ? c.kind === kind : true) &&
    (extraFilter ? extraFilter(c) : true)
  );
}

/* ══════════════════════════════════════════════════ verdicts + sound */
const YES = 'Yes', MAYBE = 'Maybe';

function verdictOf(card, mine, theirs) {
  if (mine === undefined || theirs === undefined) return null;
  const A = String(mine), B = String(theirs);
  if (card.answer === 'would') {
    if (A === YES && B === YES) return 'match';
    if ((A === YES && B === MAYBE) || (A === MAYBE && B === YES)) return 'close';
    if (A === MAYBE && B === MAYBE) return 'bothMaybe';
    if ((A === YES && B === 'Not for me') || (A === 'Not for me' && B === YES)) return 'mismatch';
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

const SOUND = { match, close, bothMaybe, scaleMatch, scaleClose };

/* ⚠️ A verdict must not claim something that did not happen. A `pick` card both
   answered "Morning" is a match — nobody said yes. */
function verdictLabel(v, card) {
  if (v === 'match') return card.answer === 'would' ? 'Match — you both said yes' : 'Same answer';
  if (v === 'mismatch') return 'Mismatch — one yes, one not for me';
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
    $('ttdLine').textContent = `Round ${s.round} · ${TIERS.truthdare[t]}`;
    $('ttdLayers').textContent =
      `${nameOf('him')} ${s.layers.him} on · ${nameOf('her')} ${s.layers.her} on`;
    return;
  }
  $('ttdStatus').hidden = true;
  wrap.hidden = false;
  $('tierLabel').textContent = d === 'connection' ? 'Level' : 'Level';
  const labels = TIERS[d];
  for (let i = 1; i <= 3; i++) {
    const b = document.createElement('button');
    b.className = 'segbtn' + (i === state.qtier ? ' on' : '');
    b.dataset.tier = String(i);
    b.textContent = labels[i];
    seg.appendChild(b);
  }
  $('tierHint').textContent = 'Includes everything below it.';
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
  /* ⭐ THREE BUTTONS ON THE QUESTIONS TAB (Kevin, 2026-10-28). Pass throws the
     question back in the deck, Next consumes it and deals another, Done
     consumes it and stops. The games keep two — a game card you skip is a
     card you spent. */
  $('nextBtn').hidden = (state.tab !== 'questions');
  $('doneBtn').textContent = 'DONE';
  $('cardHint').textContent = state.tab === 'questions'
    ? 'Pass puts it back. Next keeps going. Done ends it.'
    : 'Pass costs nothing and needs no reason.';
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

/* ══════════════════════════════════════════════════ CONNECTION + KINDLING */
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

function simpleDone() {
  const d = currentDeck();
  const s = getSession(d);
  if (!s.card) return;
  if (s.revealed) { nextSimple(); return; }

  /* Connection and Kindling are both 100% `open` — the answer is spoken, so
     there is nothing to store and nothing to compare. No verdict, no sound.
     The only reveal available is that the other person already had this card. */
  const other = OTHER(s.person);
  let partnerText = null;
  if (d === 'kindling' && (s.seen[other] || []).includes(s.card.id)) {
    partnerText = `${nameOf(other)} drew this one too.`;
  }

  if (!partnerText) { nextSimple(); return; }

  const box = $('cardPartner');
  box.replaceChildren();
  const row = document.createElement('div');
  row.className = 'prow';
  row.textContent = partnerText;
  box.append(row);
  box.hidden = false;
  s.revealed = true;
  $('passBtn').hidden = true;
  $('doneBtn').textContent = 'NEXT';
  $('cardOpts').hidden = true;
  $('cardScale').hidden = true;
  persistSession();
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
  renderCard(card, s.holder, { tag: kind.toUpperCase(), tagClass: kind === 'truth' ? 'her' : 'him' });
  $('cardHint').textContent = kind === 'dare'
    ? 'Do it, or take the consequence. Passing costs nothing.'
    : 'Answer honestly, or pass.';
}

function tdDone() {
  const s = getSession('truthdare');
  if (!s.card) return;

  if (s.card.layer) {
    const { who, n } = s.card.layer;
    const me = s.holder, them = OTHER(me);
    if (who === 'self' || who === 'self-they-choose') s.layers[me] = Math.max(0, s.layers[me] - n);
    else if (who === 'partner' || who === 'partner-they-choose' || who === 'partner-you-choose') s.layers[them] = Math.max(0, s.layers[them] - n);
    else if (who === 'both') { s.layers[me] = Math.max(0, s.layers[me] - 1); s.layers[them] = Math.max(0, s.layers[them] - 1); }
  }
  if (!s.seen[s.holder].includes(s.card.id)) s.seen[s.holder].push(s.card.id);
  s.round += 1;
  s.holder = OTHER(s.holder);
  s.card = null; s.person = null; s.revealed = false;
  persistSession();
  show('setup');
  paintSetup();
}

function tdPass() {
  const s = getSession('truthdare');
  if (s.card) {
    if (!s.seen[s.holder].includes(s.card.id)) s.seen[s.holder].push(s.card.id);
  }
  s.round += 1;
  s.holder = OTHER(s.holder);
  s.card = null; s.person = null;
  persistSession();
  show('setup');
  paintSetup();
}

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
      f.textContent = verdictLabel(v, card);
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
  state.limitsStage = 'intro';
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
        paintLimits(); return;
      }
      state.limits = { him: { ...state.limitsDraft.him }, her: { ...state.limitsDraft.her } };
      save(LS.limits, state.limits);
      recomputeBlocked();
      state.limitsStage = 'table';
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

$('doneBtn').addEventListener('click', () => {
  const d = currentDeck();
  if (d === 'truthdare') { tdDone(); return; }
  if (state.tab === 'questions') { nextSimple(); return; }  // Done = consume and stop
  simpleDone();                                            // games: kindling reveal path
});
$('nextBtn').addEventListener('click', () => {
  if (state.tab === 'questions') nextQuestion();
});
$('passBtn').addEventListener('click', () => {
  const d = currentDeck();
  if (d === 'truthdare') { tdPass(); return; }
  if (state.tab === 'questions') { passQuestion(); return; }
  nextSimple();
});

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

export const __test = { state, verdictOf, LIMITS: L, drawSimple, drawTD, drawFor: drawSimple, currentTier, getSession, freshSession, startMenuRound, paintRate, paintResults, finishMenuRound, openLimits, paintLimits, recomputeBlocked, blockedSet: () => BLOCKED, nameOf, roleOf };
