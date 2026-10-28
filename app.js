/*
 * Ember — app.js  (v1.2.0)
 *
 * Flow: pick deck → pick round type (when the deck has one) → pick heat →
 * press HIM or HER → card reveals → answer → DONE → comparison.
 *
 * FIVE THINGS THAT ARE NOT OBVIOUS:
 *
 * 1. `pitch` is the question line; `q` is the thing being asked about. A
 *    "would" card with no pitch is a riddle — Kevin could not tell how they
 *    worked (2026-10-27). The pitch is rendered above the card text.
 *
 * 2. `seen` is tracked PER PERSON. A card answered by one partner stays live
 *    for the other.
 *
 * 3. ⭐ THE REVEAL IS GATED (Kevin, 2026-10-27 #65359 — "the reveal should only
 *    be after we both answer a card"). The partner's answer is NEVER shown at
 *    draw time. Seeing her answer before you commit yours does not reveal a
 *    comparison, it manufactures one — you answer into her answer. The reveal
 *    fires only once YOU have pressed DONE.
 *
 * 4. ⭐ SOUND IS THE PAYOFF, AND SILENCE IS AN ANSWER. Three outcomes only:
 *      match      both said Yes            → bright arpeggio
 *      close      Yes + Maybe              → warm, unresolved
 *      bothMaybe  both said Maybe          → playful bounce
 *    Everything else — Not for me, Ask me again later, a mismatch on a pick
 *    card, any open card — reveals in silence. Do not "fill" it; a sound for
 *    everything is a sound for nothing.
 *
 * 5. ⭐ WAITING COMPARISONS DRAW FIRST. With 170 cards and a random draw, two
 *    people essentially never land on the same card, so the whole comparison
 *    mechanic would be dead on arrival. A card one partner has already
 *    answered is promoted to the front of the other partner's draw queue.
 *    That is what makes the deck a shared game instead of two solitaires.
 *
 * ⚠️ VALIDATE AS ESM BEFORE EVERY PUSH:
 *     bash check.sh
 * `node --check app.js` returns exit 0 on broken module code because the
 * import makes Node bail as CommonJS before it reaches the real error.
 */

import { CARDS, DECKS, HEAT, WOULD_OPTS } from './deck.js';
import { APP_VERSION } from './version.js';
import { match, close, bothMaybe, scaleMatch, scaleClose } from './audio.js';

const $ = id => document.getElementById(id);
const LS = {
  seen: 'ember.seen', deck: 'ember.deck', heat: 'ember.heat',
  sub: 'ember.sub', ans: 'ember.answers',
};

const load = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const OTHER = p => (p === 'him' ? 'her' : 'him');
const NAME = { him: 'Kevin', her: 'Denise' };

/* decks that carry a round-type switch */
const SUBS = {
  truthdare: { label: 'Round type', opts: [['mix', 'Mix'], ['truth', 'Truth'], ['dare', 'Dare']] },
  sypstrip:  { label: 'Round type', opts: [['mix', 'Mix'], ['syp', 'SYP'], ['strip', 'Strip']] },
};

const storedSeen = load(LS.seen, { him: [], her: [] });
const state = {
  deck: load(LS.deck, 'admire'),
  heat: load(LS.heat, 2),
  sub: load(LS.sub, { truthdare: 'mix', sypstrip: 'mix' }),
  seen: { him: new Set(storedSeen.him || []), her: new Set(storedSeen.her || []) },
  answers: load(LS.ans, {}),
  card: null,
  person: null,
  revealed: false,
};

/* ------------------------------------------------------- comparison engine */

const YES = 'Yes', MAYBE = 'Maybe';

/* Returns 'match' | 'close' | 'bothMaybe' | 'scaleMatch' | 'scaleClose' | null.
   null means: nothing worth a sound. Silence is an answer. */
function verdictOf(card, mine, theirs) {
  if (mine === undefined || theirs === undefined) return null;
  const A = String(mine), B = String(theirs);

  if (card.answer === 'would') {
    if (A === YES && B === YES) return 'match';
    if ((A === YES && B === MAYBE) || (A === MAYBE && B === YES)) return 'close';
    if (A === MAYBE && B === MAYBE) return 'bothMaybe';
    return null;
  }
  if (card.answer === 'scale') {
    const d = Math.abs(Number(A) - Number(B));
    if (!Number.isFinite(d)) return null;
    return d === 0 ? 'scaleMatch' : d === 1 ? 'scaleClose' : null;
  }
  if (card.answer === 'pick' || card.answer === 'thisor') {
    return A === B ? 'match' : null;
  }
  return null;
}

const SOUND = { match, close, bothMaybe, scaleMatch, scaleClose };

/* ⚠️ The verdict line must not claim something that did not happen. A `pick`
   card that both partners answered "Morning" is a match, but nobody said yes
   — so it says "Same answer". Only `would` cards get the yes/yes wording. */
function verdictLabel(v, card) {
  if (v === 'match') {
    return card.answer === 'would' ? 'Match — you both said yes' : 'Same answer';
  }
  return {
    close: 'Close — one yes, one maybe',
    bothMaybe: 'Both said maybe',
    scaleMatch: 'Same number',
    scaleClose: 'One apart',
  }[v];
}

/* ------------------------------------------------------------ setup UI */
$('version').textContent = 'v' + APP_VERSION;

const selDeck = $('deckSel');
for (const d of DECKS) {
  const o = document.createElement('option');
  o.value = d.id;
  o.textContent = d.label;
  selDeck.appendChild(o);
}
selDeck.value = state.deck;

function buildSub() {
  const cfg = SUBS[state.deck];
  const wrap = $('subWrap');
  const seg = $('subSeg');
  seg.replaceChildren();
  if (!cfg) { wrap.hidden = true; return; }
  wrap.hidden = false;
  $('subLabel').textContent = cfg.label;
  const active = state.sub[state.deck] || 'mix';
  for (const [val, text] of cfg.opts) {
    const b = document.createElement('button');
    b.className = 'segbtn' + (val === active ? ' on' : '');
    b.dataset.sub = val;
    b.textContent = text;
    seg.appendChild(b);
  }
}

function currentSub() { return SUBS[state.deck] ? (state.sub[state.deck] || 'mix') : null; }

function pool() {
  const sub = currentSub();
  return CARDS.filter(c =>
    c.deck === state.deck &&
    c.tier <= state.heat &&
    (sub && sub !== 'mix' ? c.kind === sub : true)
  );
}

/* draw buckets for one person */
function candidatesFor(person) {
  const other = OTHER(person);
  const avail = pool().filter(c =>
    !state.seen[person].has(c.id) && (c.for === 'both' || c.for === person)
  );
  // a card the partner already committed an answer to — the comparison is owed
  const waiting = avail.filter(c =>
    c.for === 'both' && state.answers[c.id] && state.answers[c.id][other] !== undefined
  );
  // a card the partner drew but that has no comparable answer (open cards)
  const pairish = avail.filter(c =>
    c.for === 'both' && !waiting.includes(c) && state.seen[other].has(c.id)
  );
  return { avail, waiting, pairish };
}

function syncSegs() {
  for (const b of $('heatSeg').children) b.classList.toggle('on', +b.dataset.heat === state.heat);
  const d = DECKS.find(x => x.id === state.deck);
  $('deckBlurb').textContent = d ? d.blurb : '';
  buildSub();
  remain();
}

function remain() {
  const p = pool();
  const fresh = p.filter(c => !state.seen.him.has(c.id) && !state.seen.her.has(c.id)).length;
  const owed = ['him', 'her'].reduce((n, person) => {
    const other = OTHER(person);
    return n + p.filter(c =>
      !state.seen[person].has(c.id) &&
      (c.for === 'both' || c.for === person) &&
      c.for === 'both' &&
      state.answers[c.id] && state.answers[c.id][other] !== undefined
    ).length;
  }, 0);
  $('remain').textContent = `${fresh} fresh of ${p.length}` + (owed ? ` · ${owed} waiting on a comparison` : '');
}

/* ------------------------------------------------------------ draw */
function drawFor(person) {
  const { avail, waiting, pairish } = candidatesFor(person);

  if (!avail.length) {
    $('setup').hidden = true;
    $('cardView').hidden = true;
    $('emptyView').hidden = false;
    return;
  }

  let chosen;
  if (waiting.length) {
    // close the open loop first — this is the reason to play
    chosen = waiting[Math.floor(Math.random() * waiting.length)];
  } else if (pairish.length && Math.random() < 0.5) {
    chosen = pairish[Math.floor(Math.random() * pairish.length)];
  } else {
    // prefer a card written for this person, when both kinds remain
    const scoped = avail.filter(c => c.for === person);
    chosen = scoped.length && Math.random() < 0.55
      ? scoped[Math.floor(Math.random() * scoped.length)]
      : avail[Math.floor(Math.random() * avail.length)];
  }

  state.card = chosen;
  state.person = person;
  render(chosen, person);
}

function render(card, person) {
  $('setup').hidden = true;
  $('emptyView').hidden = true;
  $('cardView').hidden = false;

  const tag = $('cardWho');
  tag.textContent = person === 'him' ? 'HIM' : 'HER';
  tag.className = 'whoTag ' + person;

  $('cardTier').textContent = HEAT[card.tier] + (card.kind ? ' · ' + card.kind : '');

  // ---- the question line. Without this a `would` card is a riddle.
  const pitch = $('cardPitch');
  if (card.pitch) { pitch.hidden = false; pitch.textContent = card.pitch; }
  else { pitch.hidden = true; pitch.textContent = ''; }

  $('cardQ').textContent = card.q;

  // ---- NOTHING from the partner yet. The reveal is gated behind your DONE.
  const partnerEl = $('cardPartner');
  partnerEl.hidden = true;
  partnerEl.className = 'partner';
  partnerEl.replaceChildren();

  // ---- state for this card
  state.revealed = false;
  $('passBtn').hidden = false;
  $('doneBtn').textContent = 'DONE';

  // ---- answer affordances
  const optWrap = $('cardOpts');
  const scaleWrap = $('cardScale');
  optWrap.hidden = true; scaleWrap.hidden = true;
  optWrap.replaceChildren(); scaleWrap.replaceChildren();

  const mine = state.answers[card.id] ? state.answers[card.id][person] : undefined;

  if (card.answer === 'pick' || card.answer === 'thisor' || card.answer === 'would') {
    optWrap.hidden = false;
    const list = card.answer === 'would' ? WOULD_OPTS : card.opts;
    for (const o of list) optWrap.appendChild(mkOpt(card, person, o, o === mine));
  } else if (card.answer === 'scale') {
    scaleWrap.hidden = false;
    for (let i = 1; i <= 5; i++) scaleWrap.appendChild(mkOpt(card, person, String(i), String(i) === mine));
  }
}

function mkOpt(card, person, text, selected) {
  const b = document.createElement('button');
  b.className = 'opt' + (selected ? ' on' : '');
  b.textContent = text;
  b.addEventListener('click', () => {
    const already = b.classList.contains('on');
    for (const x of b.parentElement.children) x.classList.remove('on');
    if (!already) {
      b.classList.add('on');
      record(card, person, text);
    } else {
      clearAnswer(card, person);
    }
  });
  return b;
}

/* ------------------------------------------------------------ answers */
function record(card, person, value) {
  state.answers[card.id] = { ...(state.answers[card.id] || {}), [person]: value };
  save(LS.ans, state.answers);
}

function clearAnswer(card, person) {
  const a = state.answers[card.id];
  if (!a) return;
  delete a[person];
  if (!Object.keys(a).length) delete state.answers[card.id];
  save(LS.ans, state.answers);
}

function selectedValue() {
  const on = $('cardView').querySelector('.opt.on');
  return on ? on.textContent : undefined;
}

/* ------------------------------------------------------------ the reveal */
/* Returns true when there is something to show. */
function reveal(card, person) {
  const other = OTHER(person);
  const theirs = state.answers[card.id] ? state.answers[card.id][other] : undefined;
  const theyDrew = state.seen[other].has(card.id);

  if (theirs === undefined && !theyDrew) return false;

  const box = $('cardPartner');
  box.replaceChildren();
  box.className = 'partner';

  const row = (label, text) => {
    const d = document.createElement('div');
    d.className = 'prow';
    const s = document.createElement('span');
    s.className = 'plbl';
    s.textContent = label;
    const t = document.createElement('span');
    t.className = 'ptxt';
    t.textContent = text;
    d.append(s, t);
    return d;
  };

  if (theirs !== undefined) {
    const mine = state.answers[card.id] ? state.answers[card.id][person] : undefined;
    if (mine !== undefined) box.append(row('You', mine));
    box.append(row(NAME[other], theirs));

    const v = verdictOf(card, mine, theirs);
    if (v) {
      const f = document.createElement('div');
      f.className = 'verdict ' + v;
      f.textContent = verdictLabel(v, card);
      box.append(f);
      const play = SOUND[v];
      if (play) play();
    }
  } else {
    const d = document.createElement('div');
    d.className = 'prow';
    d.textContent = `${NAME[other]} drew this one too.`;
    box.append(d);
  }

  box.hidden = false;
  return true;
}

/* ------------------------------------------------------------ advance */
function advance() {
  if (state.card && state.person) {
    state.seen[state.person].add(state.card.id);
    save(LS.seen, { him: [...state.seen.him], her: [...state.seen.her] });
  }
  state.card = null; state.person = null; state.revealed = false;
  $('cardView').hidden = true;
  $('emptyView').hidden = true;
  $('setup').hidden = false;
  remain();
}

/* DONE is the commit. Tap once to answer, once more to move on. */
function onDone() {
  const { card, person } = state;
  if (!card || !person) return;

  if (state.revealed) { advance(); return; }

  const sel = selectedValue();
  if (sel !== undefined) record(card, person, sel);

  if (!reveal(card, person)) { advance(); return; }

  state.revealed = true;
  $('passBtn').hidden = true;
  $('doneBtn').textContent = 'NEXT';
  $('cardOpts').hidden = true;
  $('cardScale').hidden = true;
}

/* PASS withdraws whatever you selected. Passing costs nothing and leaves no
   trace — a card you passed is not a card you answered. */
function onPass() {
  if (state.card && state.person) clearAnswer(state.card, state.person);
  advance();
}

/* ------------------------------------------------------------ wiring */
selDeck.addEventListener('change', () => {
  state.deck = selDeck.value;
  save(LS.deck, state.deck);
  syncSegs();
});

$('heatSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-heat]');
  if (!b) return;
  state.heat = +b.dataset.heat;
  save(LS.heat, state.heat);
  syncSegs();
});

$('subSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-sub]');
  if (!b) return;
  state.sub[state.deck] = b.dataset.sub;
  save(LS.sub, state.sub);
  syncSegs();
});

$('himBtn').addEventListener('click', () => drawFor('him'));
$('herBtn').addEventListener('click', () => drawFor('her'));
$('passBtn').addEventListener('click', onPass);
$('doneBtn').addEventListener('click', onDone);

function resetAll() {
  state.seen = { him: new Set(), her: new Set() };
  state.answers = {};
  state.card = null; state.person = null; state.revealed = false;
  save(LS.seen, { him: [], her: [] });
  save(LS.ans, {});
  $('emptyView').hidden = true;
  $('cardView').hidden = true;
  $('setup').hidden = false;
  remain();
}

$('resetBtn').addEventListener('click', resetAll);
$('againBtn').addEventListener('click', resetAll);

syncSegs();

/* ------------------------------------------------------------ service worker */
/* ⚠️ sw.js shipped in v1.0.0 and v1.1.0 but was NEVER REGISTERED — nothing
   called navigator.serviceWorker.register(). The app therefore had no offline
   cache and, because installability requires a service worker with a fetch
   handler, it could not be added to a home screen. The cache-bump discipline
   in sw.js was policing a cache that was never created.
   Registered after `load` so it never competes with first paint. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

/* exposed for the headless verification pass — not used by the UI */
export const __test = { verdictOf, state, drawFor, onDone, onPass, reveal, remain, candidatesFor };
