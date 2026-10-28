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
  { id: 'restraint', label: 'Being held down or restrained',        test: /held down|restrained|hold them still|not to move it|your wrists|their wrists|hands above|hold their wrists/i },
  { id: 'blindfold', label: 'Being blindfolded',                    test: /blindfold/i },
  /* ⭐ 'made to come' belongs with denial — both are orgasm control, and a
     forced orgasm was previously unvetoeable because no word in it matched. */
  { id: 'denial',    label: 'Being denied, made to wait, or made to come', test: /denied|made to wait|make them wait|wait a full minute|told no|waiting for it|forced orgasm|made to come|whether or not you were ready|edge and stop|do not let them finish/i },
  { id: 'teasing',   label: 'Being teased for a long time',         test: /teased|hours with nothing|take far longer|stop at the waistband|do not go further/i },
  { id: 'watched',   label: 'Being watched',                        test: /being watched|watched the entire|watching your partner|watch as your partner|let them look|watch you do it|while they watch|let them watch/i },
  { id: 'orders',    label: 'Being told what to do',                test: /instruction|what you are told|what to wear|what to do for an evening|plain words/i },
  { id: 'incharge',  label: 'Being the one in charge',              test: /in charge|take charge|decides everything|decide what comes off|how the next hour|left to decide everything/i },
  { id: 'marking',   label: 'Being marked or bitten',               test: /until it marks|where only the two of you would know|bite down|bitten|suck on the soft/i },
  { id: 'risky',     label: 'Somewhere you could be caught',        test: /caught|being heard|keep quiet|outdoors|walk in/i },
  { id: 'dirtytalk', label: 'Dirty talk / being told in words',     test: /whisper|say out loud|out loud|says that you|say in the moment|exactly where|exactly what you are going to do/i },
  { id: 'heldrule',  label: 'Being held to one instruction',        test: /one instruction|stays on until/i },
  { id: 'waking',    label: 'Being woken up for it',                test: /woken up|wake them|awake enough|properly awake/i },
  { id: 'performing',label: 'Being made to perform or show',        test: /take your time with yourself|undressing for someone|top half|show your partner|show off|plays with themselves|touch yourself/i },
  /* ⭐ TOYS ARE TYPES, NOT ONE THING (2026-10-28: "expand toys to include
     different types of toys"). One `toys` row meant a hard no on clamps also
     killed every vibrator card — which is not what anyone means by "no clamps".
     ⚠️ Cards must NAME the toy for the right veto to match; a generic "toy" card
     would fall through all three.
     ⛔ Insertable = vaginal. There is no anal row and no anal card: it is a hard
     stop, not a preference, so it is not offered as a ratable option. */
  { id: 'toy_vibe',  label: 'Vibrator or wand',                     test: /vibrator|\bwand\b/i },
  { id: 'toy_insert',label: 'An insertable toy',                    test: /insertable|\bdildo\b|toy inside/i },
  /* ⚠️ 'squeeze' not 'clamp' (2026-10-28: "change clamp to squeeze"). A clamp is
     one implement; what someone objects to is the SQUEEZE — clamps, bands, grip,
     a hand closing. Naming it after the object makes the limit narrower than the
     thing people actually mean. */
  { id: 'toy_squeeze', label: 'Squeeze — clamps, bands, grip',      test: /clamp|squeeze|band|grip/i },
  /* ⭐ COSTUMES / DRESS-UP (2026-10-28: "there is no roleplay or costumes involved,
     like having her put on one of my dress shirts, or me put on a tank top and
     boxer briefs"). This is CLOTHING, and clothing is concrete — put it on, look,
     take it off. No script, no character, nothing to improvise.
     ⛔ ROLEPLAY IN THE SCENARIO SENSE IS STILL OUT. "Pretend you are a stranger"
     requires inventing a scene from nothing, which the corpus excludes and which
     is the exact thing that returns empty. Wear the shirt, yes. Be someone else,
     no.
     ⚠️ 'what to wear' also sits under `orders` — deliberate overlap, union fails safe. */
  { id: 'costume',   label: 'Dressing up — theirs, yours, or what they pick', test: /dress shirt|boxer briefs|tank top|costume|dressed as|put on one of|put on your shirt|put on what|what to put on|put on you|me to wear|see me in|what they wear|\bdress them\b|of yours to wear|something of mine|something of yours|ask you to put on|your shirt/i },
  /* ⭐ UNDRESSING (v1.3.6). The strip mechanic is the most-used action in the whole
     corpus — every Truth or Dare layer card and half of Blaze is built on it — and
     it had NO limit act. Someone who did not want to be undressed had no way to
     say so, and every stripping dare would still have been dealt to them.
     ⚠️ \bdress them\b vs "undress them": the word boundary matters. Put a bare
     "dress them" in `costume` and it swallows every undressing card too. */
  /* ⚠️ Named from HIS wording (2026-10-28: "undress should be undress before your
     partner"). The test still catches being-undressed cards too — deliberate
     over-coverage, because "I will not undress in front of you" and "I will not
     be undressed by you" are close enough that splitting them would offer a
     choice nobody would answer differently. */
  { id: 'undress',   label: 'Undressing in front of your partner, or being undressed by them', test: /take one item off|remove one item|one item each|undress|one item off|take two items|what comes off|remove something of theirs|reach inside their clothes|inside their|undo their trousers|undo one button|open their shirt|remove one item of|strip/i },
  /* ⭐ 'punish' / 'belt' / 'paddle' are in the test because the punishment card
     asks what WITH, and without them the card was unvetoeable. */
  { id: 'impact',    label: 'Spanking or impact',                   test: /spank|paddle|whip|flog|\bbelt\b|punish|\bimpact\b/i },
  { id: 'rope',      label: 'Rope, being tied, or a toy used to hold you', test: /rope|\btied\b|\bbound\b|\bbind\b|their hands above/i },
  { id: 'degrade',   label: 'Degradation or name-calling',          test: /degrad|humiliat|name-call|what they are|what you are/i },
  { id: 'photo',     label: 'Being photographed or filmed',         test: /photo|film|camera|recorded|posted/i },
  /* ⭐ THE KINK FAMILIES (v1.3.5). The table was 18 narrow ACTS with no umbrella
     for the three things people actually ask about, so a hard no had nothing to
     attach to. "Being watched" existed; "watching" did not. Nothing existed at
     all for being seen, for a third person, or for pain as a category.
     ⚠️ Overlap is deliberate — a veto on `pain` removes impact AND marking cards.
     Vetoes UNION, so over-matching fails SAFE. */
  { id: 'voyeur',    label: 'Watching — them, or watching others',  test: /watch as your partner|watching your partner|watch as you|watch you do it|let them watch|while they watch|watch me|watch them/i },
  { id: 'exhib',     label: 'Being seen — shown off, watched by others, filmed', test: /someone watch|watch us|in front of someone|someone else present|others present|posting a film|online|show your partner|show off|recorded|filmed/i },
  /* ⛔ NO CARDS. The corpus excludes a third person as an involved act, so this
     rating records a position and vetoes nothing — there is nothing to veto.
     It is here because "is that a hard no for you" is worth knowing even when
     the deck will never ask it. */
  /* ⚠️ Narrow ON PURPOSE. A loose /someone else/ matched "told what to do in
     front of someone else", which is exhibitionism, not cuckolding. A veto that
     mislabels what it removes teaches the wrong lesson about your own limits. */
  { id: 'cuck',      label: 'Your partner with someone else',       test: /your partner with someone|watch them with someone|someone else in bed with|another person involved/i },
  { id: 'pain',      label: 'Pain — impact, biting, clamps',        test: /spank|paddle|whip|flog|\bbelt\b|punish|bite|clamp|hurt|\bimpact\b/i },
  /* ⭐ DIRECTIONAL ACTS (2026-10-28: "they need to be asked both ways giving oral
     and receiving oral. same with anal"). Giving and receiving are DIFFERENT
     limits — someone who will not give may happily receive — so each gets its own
     row and its own hard no.
     ⚠️ These four drive the `acts` map on the oral/anal cards, which is evaluated
     PER PERSON at draw time, not by text. The regexes are for the audit and for
     any future card that does not carry a map. */
  { id: 'oral_give',    label: 'Giving oral',           test: /go down on them|use your mouth on them/i },
  { id: 'oral_receive', label: 'Receiving oral',        test: /have them go down on you|their mouth on you/i },
  { id: 'anal_give',    label: 'Anal — giving',         test: /take them from behind|in their arse/i },
  { id: 'anal_receive', label: 'Anal — receiving',      test: /take you from behind/i },
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

/** Cards that must never be dealt. A veto is absolute — the sum cannot outvote it.
 *  ⚠️ Cards carrying an `acts` map are SKIPPED here and evaluated per person at
 *  draw time instead (see blockedFor() in app.js). Their meaning flips with who
 *  is holding them, so a global text match would block both directions at once. */
export function blockedCards(cards, answers) {
  const vetoes = vetoedItems(answers);
  if (!vetoes.length) return [];
  const tests = vetoes.map(v => RULE[v].test).filter(Boolean);
  return cards.filter(c => !c.acts && tests.some(t => t.test(c.q || '') || t.test(c.pitch || '')));
}

/** Card ids to exclude from every draw. */
export function blockedIds(cards, answers) {
  return new Set(blockedCards(cards, answers).map(c => c.id));
}

/** Cards removed by a set of limit-act ids — used for the Menu gates as well as
 *  the hard vetoes, so both are enforced by identical machinery. */
export function blockedByRules(cards, ruleIds) {
  const tests = ruleIds.map(id => RULE[id] && RULE[id].test).filter(Boolean);
  if (!tests.length) return [];
  return cards.filter(c => tests.some(t => t.test(c.q || '') || t.test(c.pitch || '')));
}
export function blockedIdsFor(cards, ruleIds) {
  return blockedByRules(cards, ruleIds).map(c => c.id);
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
