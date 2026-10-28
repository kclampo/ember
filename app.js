/*
 * Ember — app.js  (v1.1.0)
 *
 * Flow: pick deck → pick round type (when the deck has one) → pick heat →
 * press HIM or HER → card reveals.
 *
 * TWO THINGS THAT ARE NOT OBVIOUS:
 *
 * 1. `pitch` is the question line; `q` is the thing being asked about. A
 *    "would" card with no pitch is a riddle — Kevin could not tell how they
 *    worked (2026-10-27). The pitch is rendered above the card text.
 *
 * 2. `seen` is tracked PER PERSON. A card answered by one partner stays live
 *    for the other, and when the second person draws it the app shows what the
 *    first one said. That is the whole point of the format: the overlap is the
 *    payoff, not the individual answers.
 *
 * ⚠️ VALIDATE AS ESM BEFORE EVERY PUSH:
 *     bash check.sh
 * `node --check app.js` returns exit 0 on broken module code because the
 * import makes Node bail as CommonJS before it reaches the real error.
 */

import { CARDS, DECKS, HEAT, WOULD_OPTS } from './deck.js';
import { APP_VERSION } from './version.js';

const $ = id => document.getElementById(id);
const LS = { seen: 'ember.seen', deck: 'ember.deck', heat: 'ember.heat', sub: 'ember.sub', ans: 'ember.answers' };

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
};

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

function availableFor(person) {
  return pool().filter(c =>
    !state.seen[person].has(c.id) &&
    (c.for === 'both' || c.for === person)
  );
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
  $('remain').textContent = `${fresh} fresh of ${p.length} left`;
}

/* ------------------------------------------------------------ draw */
function drawFor(person) {
  const candidates = availableFor(person);
  if (!candidates.length) {
    $('setup').hidden = true;
    $('cardView').hidden = true;
    $('emptyView').hidden = false;
    return;
  }
  // prefer a card written for this person, when both kinds remain
  const scoped = candidates.filter(c => c.for === person);
  const chosen = scoped.length && Math.random() < 0.55
    ? scoped[Math.floor(Math.random() * scoped.length)]
    : candidates[Math.floor(Math.random() * candidates.length)];

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

  // ---- what the OTHER person already said about this same card
  const partnerEl = $('cardPartner');
  const prev = state.answers[card.id];
  const theirs = prev && prev[OTHER(person)];
  if (theirs) {
    partnerEl.hidden = false;
    partnerEl.textContent = `${NAME[OTHER(person)]} already answered this: ${theirs}`;
  } else {
    partnerEl.hidden = true;
    partnerEl.textContent = '';
  }

  // ---- answer affordances
  const optWrap = $('cardOpts');
  const scaleWrap = $('cardScale');
  optWrap.hidden = true; scaleWrap.hidden = true;
  optWrap.replaceChildren(); scaleWrap.replaceChildren();

  if (card.answer === 'pick' || card.answer === 'thisor' || card.answer === 'would') {
    optWrap.hidden = false;
    const list = card.answer === 'would' ? WOULD_OPTS : card.opts;
    for (const o of list) optWrap.appendChild(mkOpt(card, person, o));
  } else if (card.answer === 'scale') {
    scaleWrap.hidden = false;
    for (let i = 1; i <= 5; i++) scaleWrap.appendChild(mkOpt(card, person, String(i)));
  }
}

function mkOpt(card, person, text) {
  const b = document.createElement('button');
  b.className = 'opt';
  b.textContent = text;
  b.addEventListener('click', () => {
    const already = b.classList.contains('on');
    for (const x of b.parentElement.children) x.classList.remove('on');
    if (!already) {
      b.classList.add('on');
      state.answers[card.id] = { ...(state.answers[card.id] || {}), [person]: text };
      save(LS.ans, state.answers);
    }
  });
  return b;
}

/* ------------------------------------------------------------ advance */
function advance() {
  if (state.card && state.person) {
    state.seen[state.person].add(state.card.id);
    save(LS.seen, { him: [...state.seen.him], her: [...state.seen.her] });
  }
  state.card = null; state.person = null;
  $('cardView').hidden = true;
  $('emptyView').hidden = true;
  $('setup').hidden = false;
  remain();
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
$('passBtn').addEventListener('click', () => advance());
$('doneBtn').addEventListener('click', () => advance());

function resetAll() {
  state.seen = { him: new Set(), her: new Set() };
  state.answers = {};
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
