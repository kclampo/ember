/*
 * Ember — app.js  (v1.0.0)
 *
 * Flow: pick deck → pick heat → press HIM or HER → card reveals.
 *
 * ⚠️ VALIDATE AS ESM BEFORE EVERY PUSH:
 *     cp app.js /tmp/chk.mjs && node --check /tmp/chk.mjs
 * `node --check app.js` returns exit 0 on broken module code because the
 * import makes Node bail as CommonJS before it reaches the real error.
 * That exact mistake shipped a dead build on PosePro (2026-10-27).
 */

import { CARDS, DECKS, HEAT } from './deck.js';
import { APP_VERSION } from './version.js';

const $ = id => document.getElementById(id);
const LS = {
  seen: 'ember.seen',
  deck: 'ember.deck',
  heat: 'ember.heat',
  td: 'ember.td',
};

const load = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const state = {
  deck: load(LS.deck, 'admire'),
  heat: load(LS.heat, 2),
  td: load(LS.td, 'mix'),
  seen: new Set(load(LS.seen, [])),
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

function deckBlurb() {
  const d = DECKS.find(x => x.id === state.deck);
  $('deckBlurb').textContent = d ? d.blurb : '';
  $('tdWrap').hidden = state.deck !== 'truthdare';
}

function syncSegs() {
  for (const b of $('heatSeg').children) b.classList.toggle('on', +b.dataset.heat === state.heat);
  for (const b of $('tdSeg').children) b.classList.toggle('on', b.dataset.td === state.td);
  deckBlurb();
  remain();
}

function pool() {
  return CARDS.filter(c =>
    c.deck === state.deck &&
    c.tier <= state.heat &&
    (state.deck === 'truthdare' ? (state.td === 'mix' || c.kind === state.td) : true)
  );
}

function unrseen() { return pool().filter(c => !state.seen.has(c.id)); }

function remain() {
  const p = unrseen().length, t = pool().length;
  $('remain').textContent = `${p} of ${t} left in this deck`;
}

/* ------------------------------------------------------------ draw */
function drawFor(person) {
  if (state.deck !== 'doit') {
    // admire/fantasy/truthdare: everybody can draw everything, except cards
    // explicitly scoped to one person.
  }
  let candidates = unrseen().filter(c => c.for === 'both' || c.for === person);

  if (!candidates.length) {
    // exhausted for this person — offer a reset rather than silently repeating
    $('setup').hidden = true;
    $('cardView').hidden = true;
    $('emptyView').hidden = false;
    return;
  }

  // prefer a card written FOR this person over a shared one when both remain
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
  $('cardQ').textContent = card.q;

  // ---- answer affordances
  const optWrap = $('cardOpts');
  const scaleWrap = $('cardScale');
  optWrap.hidden = true;
  scaleWrap.hidden = true;
  optWrap.replaceChildren();
  scaleWrap.replaceChildren();

  if (card.answer === 'pick' || card.answer === 'thisor') {
    optWrap.hidden = false;
    for (const o of card.opts) optWrap.appendChild(mkOpt(o));
  } else if (card.answer === 'would') {
    optWrap.hidden = false;
    for (const o of ['I would', 'Maybe', 'Not for me', 'My partner would']) optWrap.appendChild(mkOpt(o));
  } else if (card.answer === 'scale') {
    scaleWrap.hidden = false;
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement('button');
      b.textContent = String(i);
      b.addEventListener('click', () => {
        for (const x of scaleWrap.children) x.classList.remove('on');
        b.classList.add('on');
      });
      scaleWrap.appendChild(b);
    }
  }
}

function mkOpt(text) {
  const b = document.createElement('button');
  b.className = 'opt';
  b.textContent = text;
  b.addEventListener('click', () => {
    const already = b.classList.contains('on');
    for (const x of b.parentElement.children) x.classList.remove('on');
    if (!already) b.classList.add('on');
  });
  return b;
}

/* ------------------------------------------------------------ advance */
function advance(wasPass) {
  if (state.card) {
    state.seen.add(state.card.id);
    save(LS.seen, [...state.seen]);
  }
  state.card = null;
  $('cardView').hidden = true;
  $('emptyView').hidden = true;
  $('setup').hidden = false;
  remain();
  void wasPass;
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

$('tdSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-td]');
  if (!b) return;
  state.td = b.dataset.td;
  save(LS.td, state.td);
  syncSegs();
});

$('himBtn').addEventListener('click', () => drawFor('him'));
$('herBtn').addEventListener('click', () => drawFor('her'));

$('passBtn').addEventListener('click', () => advance(true));
$('doneBtn').addEventListener('click', () => advance(false));

$('resetBtn').addEventListener('click', () => {
  state.seen.clear();
  save(LS.seen, []);
  $('emptyView').hidden = true;
  $('cardView').hidden = true;
  $('setup').hidden = false;
  remain();
});

$('againBtn').addEventListener('click', () => $('resetBtn').click());

syncSegs();
