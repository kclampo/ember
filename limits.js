/*
 * Ember — limits.js  (v1.3.0)
 *
 * THE LIMITS LIST. Two jobs, and they are not the same job:
 *
 *   1. THE LIST  — "what does this house think of X?" Both players rate every
 *      act on a five-word scale. The scores are SUMMED and anything totalling
 *      4 or less is hidden, because the dull middle is noise.
 *
 *   2. THE VETO  — "what must the deck never deal?" A Hard No is not the bottom
 *      of a preference scale, it is an absolute. Arithmetic cannot outvote it,
 *      so a Hard No removes every matching card from all three games.
 *
 * ⛔ THE PROCESS IS SEQUENTIAL AND HIDDEN. Player one answers, their answers are
 *    hidden, player two answers. Neither sees the other's ratings while rating —
 *    a rating given after seeing your partner's measures courtesy, not preference.
 *    (Same anti-anchoring rule as The Menu's blind round.)
 *
 * ⛔ THE LIST NEVER ASKS WHY. A rating is a complete answer.
 */

/* ─────────────────────────────────────────────── the scale */
export const SCALE = [
  { id: 'now',        label: 'Yes now',   points: 5 },
  { id: 'yes',        label: 'Yes',       points: 4 },
  { id: 'interested', label: 'Interested', points: 3 },
  { id: 'notreally',  label: 'Not really', points: 2 },
  { id: 'hardno',     label: 'Hard No',   points: 1 },
];

export const POINTS = SCALE.reduce((a, s) => (a[s.id] = s.points, a), {});
export const HARD_NO = 'hardno';
export const MAX_SUM = 10;

/** Sum ≤ 4 is hidden; ≥ 5 is shown. Two Hard Nos (2), two Not-reallys (4) and
 *  every Hard No + Not really (3) combination all fall below the line. */
export const HIDE_AT_OR_BELOW = 4;
export const isVisible = sum => sum > HIDE_AT_OR_BELOW;

/* ─────────────────────────────────────────────── the acts
 * `test` is how a veto finds cards. It is a regex over card text on purpose:
 * the mapping lives in one place and can be audited (see verify() at the
 * bottom). A rule matching zero cards is not an error — it just means that
 * act has no card yet, and the veto is inert until it does.
 */
export const LIMIT_ITEMS = [
  { id: 'restraint', label: 'Being held down or restrained',        test: /held down|restrained|your wrists|their wrists|hands above|hold their wrists/i },
  { id: 'blindfold', label: 'Being blindfolded',                    test: /blindfold/i },
  { id: 'denial',    label: 'Being denied or made to wait',         test: /denied|made to wait|told no|waiting for it/i },
  { id: 'teasing',   label: 'Being teased for a long time',         test: /teased|hours with nothing|take far longer/i },
  { id: 'watched',   label: 'Being watched',                        test: /being watched|watched the entire|watching your partner|let them look|watch you do it/i },
  { id: 'orders',    label: 'Being told what to do',                test: /instruction|what you are told|what to wear|what to do for an evening|plain words/i },
  { id: 'incharge',  label: 'Being the one in charge',              test: /in charge|take charge|decides everything|left to decide everything/i },
  { id: 'marking',   label: 'Being marked or bitten',               test: /until it marks|where only the two of you would know|bite down|bitten|suck on the soft/i },
  { id: 'risky',     label: 'Somewhere you could be caught',        test: /caught|being heard|keep quiet|outdoors/i },
  { id: 'dirtytalk', label: 'Dirty talk / being told in words',     test: /whisper|say out loud|says that you|say in the moment|exactly where/i },
  { id: 'heldrule',  label: 'Being held to one instruction',        test: /one instruction|stays on until/i },
  { id: 'waking',    label: 'Being woken up for it',                test: /woken up|properly awake/i },
  { id: 'performing',label: 'Being made to perform or show',        test: /take your time with yourself|undressing for someone|top half/i },
  { id: 'toys',      label: 'Toys',                                 test: /toy|vibrator/i },
  { id: 'impact',    label: 'Spanking or impact',                   test: /spank|paddle|whip|flog|\bimpact\b/i },
  { id: 'rope',      label: 'Rope or being tied',                   test: /rope|\btied\b|\bbound\b/i },
  { id: 'degrade',   label: 'Degradation or name-calling',          test: /degrad|humiliat|name-call/i },
  { id: 'photo',     label: 'Being photographed or filmed',         test: /photo|film|camera/i },
];

const RULE = LIMIT_ITEMS.reduce((a, r) => (a[r.id] = r, a), {});

/* ─────────────────────────────────────────────── the model
 * answers = { him: { [itemId]: scaleId }, her: { [itemId]: scaleId } }
 */

export function blankAnswers() { return { him: {}, her: {} }; }

/** true once BOTH players have rated every act — the point at which the list
 *  may be revealed. Until then nothing is shown, to either of them. */
export function bothDone(answers, names) {
  const need = LIMIT_ITEMS.length;
  return Object.keys(answers.him).length >= need &&
         Object.keys(answers.her).length >= need;
}

/** Ratings for one act, from both sides. */
export function actRow(itemId, answers) {
  const him = answers.him[itemId];
  const her = answers.her[itemId];
  const himPts = him ? POINTS[him] : null;
  const herPts = her ? POINTS[her] : null;
  const sum = (himPts || 0) + (herPts || 0);
  return {
    id: itemId,
    label: RULE[itemId] ? RULE[itemId].label : itemId,
    him, her, himPts, herPts, sum,
    visible: himPts != null && herPts != null && isVisible(sum),
    veto: him === HARD_NO || her === HARD_NO,
  };
}

/** The visible two-column table: every act scoring 5+, worst first.
 *  Two columns, the NAME is the header, one row per act. */
export function listView(answers, nameOf) {
  const rows = LIMIT_ITEMS
    .map(i => actRow(i.id, answers))
    .filter(r => r.visible || r.veto)
    .sort((a, b) => b.sum - a.sum);
  return {
    head: [nameOf('him'), nameOf('her')],
    rows: rows.map(r => ({
      label: r.label,
      him: r.him ? labelFor(r.him) : '—',
      her: r.her ? labelFor(r.her) : '—',
      sum: r.sum,
      veto: r.veto,
    })),
  };
}

export function labelFor(scaleId) {
  const s = SCALE.find(x => x.id === scaleId);
  return s ? s.label : '—';
}

/** Act ids either player called a Hard No. */
export function vetoedItems(answers) {
  return LIMIT_ITEMS
    .filter(i => answers.him[i.id] === HARD_NO || answers.her[i.id] === HARD_NO)
    .map(i => i.id);
}

/** Cards that must never be dealt. A veto is absolute — the sum cannot outvote it. */
export function blockedCards(cards, answers) {
  const vetoes = vetoedItems(answers);
  if (!vetoes.length) return [];
  const tests = vetoes.map(v => RULE[v].test).filter(Boolean);
  return cards.filter(c => tests.some(t => t.test(c.q || '') || t.test(c.pitch || '')));
}

/** Card ids to exclude from every draw. */
export function blockedIds(cards, answers) {
  return new Set(blockedCards(cards, answers).map(c => c.id));
}

/** How many cards each rule would remove — for auditing the regexes. */
export function verify(cards) {
  return LIMIT_ITEMS.map(item => ({
    id: item.id,
    label: item.label,
    matches: cards.filter(c => item.test.test(c.q || '') || item.test.test(c.pitch || '')).length,
  }));
}

export function resetAnswers() { return blankAnswers(); }
