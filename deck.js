/*
 * Ember — deck.js
 * Card corpus. Four decks, three heat tiers, five answer types.
 *
 * ANSWER TYPES (deliberate — see README):
 *   open      free answer, spoken out loud. No input box.
 *   pick      choose one from `opts`
 *   thisor    choose A or B from `opts` (exactly two)
 *   scale     rate 1–5
 *   would     I would / Maybe / Not for me / My partner would
 *
 * `would` is the important one. A blank "describe your fantasy" box is a dead
 * end for someone who does not generate fantasy unprompted. "I would / Maybe /
 * Not for me" is answerable, and it is a choice rather than a confession.
 *
 * ⚠️ BALANCE RULE: in the two QUESTION decks (admire, fantasy) and in the
 * truths, keep `open` at or below ~45%. Every `open` card is a blank stare for
 * a partner who does not volunteer. Task decks (doit, dares) are `open` by
 * nature — the instruction IS the content — and that is correct.
 *
 * `for`: 'both' | 'him' | 'her'   — 'him' = shown when HIM is pressed.
 *
 * ⛔ HARD EXCLUSIONS — never add a card containing:
 *    anal (any), oral (any, either direction), a third person as a required
 *    act, or anything requiring her to invent a scenario from nothing.
 *    These are standing limits, not preferences. See README § Excluded.
 */

export const HEAT = { 1: 'Warm', 2: 'Hot', 3: 'Hottest' };

export const DECKS = [
  { id: 'admire',    label: 'Connection — What I Notice',            blurb: 'Say the true thing you have not said.' },
  { id: 'fantasy',   label: 'Connection — If You Couldn\u2019t Get Caught', blurb: 'Answer with a choice, not a confession.' },
  { id: 'truthdare', label: 'Truth or Dare',                          blurb: 'Pick truth, or pick dare.' },
  { id: 'doit',      label: 'Do It To Your Partner',                  blurb: 'A thing to do — not a thing to say.' },
  { id: 'strip',     label: 'Strip',                                  blurb: 'Draw, comply, or forfeit. No arguing.' },
];

const OPTS = {
  noticeFirst: ['Face', 'Shoulders', 'The walk', 'Voice', 'Hands'],
  mostAttract: ['Confidence', 'Warmth', 'The way they move', 'Their mind', 'Their body'],
  looksAt:     ['Eyes', 'Mouth', 'Neck and shoulders', 'Arms', 'Hips', 'Legs', 'Hands'],
  wantWhen:    ['When they take charge', 'When they are soft with me', 'When they are focused on something', 'When they laugh', 'When they touch me in passing'],
  biggerTurn:  ['Hearing them say what they want', 'Feeling them want me without words', 'Being wanted in the middle of the day', 'Being undressed slowly'],
  feelsWanted: ['He notices me across a room', 'He reaches for me without asking', 'He says it out loud', 'He does something without being asked'],
  setting:     ['Somewhere new', 'Somewhere outdoors', 'A car', 'A hotel', 'Our own bed with no interruptions'],
  lands:       ['The surprise', 'The build-up', 'Being wanted', 'Giving up control', 'Taking control'],
  moreOf:      ['More touch that is not leading anywhere', 'More being told what to do', 'More time', 'More spontaneity', 'More of me starting it'],
  lastThought: ['At work', 'Driving', 'In the shower', 'In bed without them', 'Running errands'],
  when:        ['Morning', 'Middle of the day', 'Right before sleep', 'Woken up for it', 'When nobody is home'],
  pace:        ['Slow and deliberate', 'Fast and urgent', 'Teasing, on and off', 'Whatever happens'],
  honesty:     ['Never said it', 'Hinted at it', 'Thought about it but decided no', 'Said it and got a look'],
  whatFirst:   ['Their body', 'Their confidence', 'Their laugh', 'The way they looked at me', 'Their calm'],
  whatNow:     ['Want them more', 'Want them the same', 'Want them differently', 'Want more time with them'],
  describeYou:['Too much', 'Just right', 'Not enough', 'I want to be told'],
  regret:      ['No', 'Once', 'More than once', 'I would if they asked'],
};

// ---------------------------------------------------------------- ADMIRE
const ADMIRE = [
  { t:1, a:'open',   q:'What is one thing your partner did this week that you noticed and never mentioned?' },
  { t:1, a:'pick',   q:'What do you notice first when your partner walks into a room?', opts: OPTS.noticeFirst },
  { t:1, a:'pick',   q:'What did you notice first about them, honestly?', opts: OPTS.whatFirst },
  { t:1, a:'open',   q:'Name one thing your partner is better at than anyone else you know.' },
  { t:1, a:'thisor', q:'Which does more for you?', opts:['Their laugh', 'Their hands'] },
  { t:1, a:'thisor', q:'Which would you keep if you had to lose one?', opts:['The way they look at you', 'The way they touch you'] },
  { t:1, a:'scale',  q:'How seen do you feel by your partner this week?' },
  { t:1, a:'open',   q:'What is a small thing your partner does that you would miss if it stopped tomorrow?' },
  { t:1, a:'pick',   q:'What do you find most attractive in your partner right now?', opts: OPTS.mostAttract },
  { t:1, a:'open',   q:'What was your honest first impression of your partner?' },
  { t:1, a:'pick',   q:'What makes you feel most wanted by your partner?', for:'her', opts: OPTS.feelsWanted },
  { t:1, a:'pick',   q:'How do you want to be wanted?', for:'her', opts:['Told outright', 'Shown without words', 'Chased', 'Chosen over everything else'] },
  { t:1, a:'open',   q:'What is one thing about her that you wish she believed about herself?', for:'him' },
  { t:1, a:'pick',   q:'Where are you now, compared to a year ago?', opts: OPTS.whatNow },

  { t:2, a:'open',   q:'What is one thing your partner does with their body that you find sexy without them trying at all?' },
  { t:2, a:'pick',   q:'Which part of your partner do you catch yourself looking at most?', opts: OPTS.looksAt },
  { t:2, a:'open',   q:'When does your partner look most attractive to you — doing what, exactly?' },
  { t:2, a:'thisor', q:'Which is sexier?', opts:['Dressed up and out', 'Dressed down at home'] },
  { t:2, a:'open',   q:'What is something your partner wears that does something to you?' },
  { t:2, a:'pick',   q:'What makes you want your partner most?', opts: OPTS.wantWhen },
  { t:2, a:'pick',   q:'Which of these do you wish happened more often?', opts:['Being undressed by them', 'Being told what they want', 'Being caught off guard', 'Being made to wait'] },
  { t:2, a:'open',   q:'Tell your partner one thing about their body you genuinely admire. Be specific.' },
  { t:2, a:'scale',  q:'How physically desired do you feel by your partner lately?' },
  { t:2, a:'scale',  q:'How well does your partner read what you want without being told?' },
  { t:2, a:'open',   q:'What is one thing your partner does that makes you feel like a man?', for:'him' },
  { t:2, a:'open',   q:'When does he look most attractive to you?', for:'her' },
  { t:2, a:'thisor', q:'Which turns you on more?', opts:['Him deciding', 'Him asking'], for:'her' },
  { t:2, a:'pick',   q:'What do you wish he did more of?', for:'her', opts:['Told you what he wants', 'Touched you in passing', 'Looked at you a certain way', 'Took his time'] },

  { t:3, a:'open',   q:'What is one thing your partner does in bed that you never want them to stop doing?' },
  { t:3, a:'pick',   q:'What is the bigger turn-on?', opts: OPTS.biggerTurn },
  { t:3, a:'open',   q:'What is the last thing about your partner that made you actually catch your breath?' },
  { t:3, a:'open',   q:'Name something you have thought about your partner but never said out loud.' },
  { t:3, a:'pick',   q:'What pace actually works for you?', opts: OPTS.pace },
  { t:3, a:'pick',   q:'Honest answer — have you ever told anyone else what you want from them?', opts: OPTS.honesty },
  { t:3, a:'pick',   q:'Do you want to be told what to do, or left to decide?', for:'her', opts:['Told, clearly', 'Told, gently', 'Left to decide', 'Depends entirely on the day'] },
  { t:3, a:'open',   q:'What does she do that undoes you completely?', for:'her' },
];

// ---------------------------------------------------------------- FANTASY
const FANTASY = [
  { t:1, a:'would',  q:'Being wanted somewhere you would have to keep quiet.' },
  { t:1, a:'open',   q:'If you could not possibly get caught, where would you want it to happen?' },
  { t:1, a:'would',  q:'A hotel neither of you has been to, no plans, one night.' },
  { t:1, a:'pick',   q:'If you got to pick the time and nothing else, what would you pick?', opts: OPTS.when },
  { t:1, a:'would',  q:'A shower with the door locked and nobody calling for you.' },
  { t:1, a:'thisor', q:'Which would you rather have?', opts:['A whole night, unhurried', 'Ten stolen minutes, right now'] },
  { t:1, a:'would',  q:'Being woken up for it, before you are properly awake.' },
  { t:1, a:'thisor', q:'Which is the better fantasy?', opts:['Nobody knows where you are', 'Everybody knows and cannot say anything'] },

  { t:2, a:'would',  q:'Being told exactly what to do for an entire evening.' },
  { t:2, a:'would',  q:'Getting to be the one in charge for an entire evening.' },
  { t:2, a:'open',   q:'If you could not be caught, what is the first thing you would do?' },
  { t:2, a:'pick',   q:'Which setting actually does it for you?', opts: OPTS.setting },
  { t:2, a:'would',  q:'Taking your time with no clock running and nowhere to be.' },
  { t:2, a:'would',  q:'A whole day where you both say yes to each other.' },
  { t:2, a:'would',  q:'Watching your partner get ready for you, slowly, without helping.' },
  { t:2, a:'open',   q:'Where in this house have you thought about it?' },
  { t:2, a:'pick',   q:'What would make a night actually work for you?', opts:['No timeline', 'Being told what happens next', 'Being left alone to it', 'Being wanted first, before anything'] },
  { t:2, a:'would',  q:'Being undressed by someone who does not rush and does not explain.' },
  { t:2, a:'thisor', q:'Which would you actually choose?', opts:['Being surprised', 'Being told in advance and made to wait'] },

  { t:3, a:'would',  q:'Being blindfolded and not knowing what comes next.' },
  { t:3, a:'would',  q:'Being restrained — hands only, easy release, and you know it.' },
  { t:3, a:'would',  q:'A risk of being heard, but never seen.' },
  { t:3, a:'pick',   q:'What makes a fantasy actually land for you?', opts: OPTS.lands },
  { t:3, a:'would',  q:'Being told no, and made to wait for it.' },
  { t:3, a:'open',   q:'What is the fantasy you would actually want to happen — not just imagine?' },
  { t:3, a:'open',   q:'What is one thing you would want said out loud, in the moment?' },
  { t:3, a:'would',  q:'Giving up the decision entirely, once, and seeing what happens.' },
  { t:3, a:'pick',   q:'Where is your honest line right now?', opts:['He decides, I follow', 'We decide together', 'I get a veto, always', 'I do not know yet'] },
];

// ---------------------------------------------------------------- TRUTH OR DARE
const TRUTHS = [
  { t:1, q:'What is the first thing you noticed about me?', a:'open' },
  { t:1, q:'What is a small thing I do that turns you on?', a:'open' },
  { t:1, q:'The last time you thought about me during the day — where were you?', a:'pick', opts: OPTS.lastThought },
  { t:1, q:'What do you wish I understood about you that I keep missing?', a:'open' },
  { t:1, q:'When do you feel closest to me?', a:'pick', opts:['When we talk properly', 'When we are doing nothing together', 'In bed, after', 'When you handle something for me', 'When we are away from the house'] },
  { t:1, q:'What is the most romantic thing anyone has ever done for you?', a:'open' },
  { t:1, q:'Which do you want more of?', a:'thisor', opts:['Planned nights', 'Something unplanned'] },

  { t:2, q:'What is something you want me to do more of?', a:'pick', opts: OPTS.moreOf },
  { t:2, q:'Have you ever pretended to be more tired than you were? What was the real reason?', a:'open' },
  { t:2, q:'What is a place you have thought about us doing it?', a:'open' },
  { t:2, q:'What is something you want that you have never asked me for?', a:'open' },
  { t:2, q:'What do you want more of, honestly?', a:'pick', opts:['Being wanted out loud', 'Being left alone when you need it', 'Being chased', 'Being handled without discussion'] },
  { t:2, q:'What pace do you actually prefer?', a:'pick', opts: OPTS.pace },
  { t:2, q:'Which is harder for you to say?', a:'thisor', opts:['What you want', 'What you do not want'] },

  { t:3, q:'What is one thing you would want me to say in the moment that I have never said?', a:'open' },
  { t:3, q:'What is the last thing you thought about me that you decided not to say?', a:'open' },
  { t:3, q:'What would you want more of, if you were sure I would say yes?', a:'open' },
  { t:3, q:'Do you want to be told what to do?', a:'pick', opts: OPTS.describeYou },
  { t:3, q:'Honest — have you ever told me everything you want?', a:'pick', opts:['Everything', 'Most of it', 'About half', 'Not close'] },
  { t:3, q:'What would you rather have?', a:'thisor', opts:['Everything, all at once', 'The build-up, for days'] },
];

const DARES = [
  { t:1, owner:'both', q:'Kiss your partner for thirty seconds without using your hands.' },
  { t:1, owner:'both', q:'Say out loud one thing you want, in plain words.' },
  { t:1, owner:'both', q:'Give your partner one sincere compliment about their body. Specific, not general.' },
  { t:1, owner:'both', q:'Hold eye contact with your partner for twenty seconds without speaking.' },
  { t:1, owner:'both', q:'Tell your partner the first thing you noticed about them tonight.' },
  { t:1, owner:'both', q:'Describe your partner in three words. No repeats from last round.' },
  { t:2, owner:'both', q:'Slow-dance with your partner for one song with no talking.' },
  { t:2, owner:'both', q:'Describe one thing you want your partner to do to you. Out loud.' },
  { t:2, owner:'both', q:'Remove one item of your partner\u2019s clothing. Slowly. No explanation.' },
  { t:2, owner:'both', q:'Whisper something in your partner\u2019s ear that you would only say in private.' },
  { t:2, owner:'both', q:'Trace one line from your partner\u2019s neck to their hand with one finger. Then stop.' },
  { t:2, owner:'both', q:'Tell your partner one thing you want to do to them — and when.' },
  { t:3, owner:'both', q:'Put your partner\u2019s hands where you want them. Leave them there.' },
  { t:3, owner:'both', q:'Kiss your partner for a full minute, and be the one to end it.' },
  { t:3, owner:'both', q:'Pick one card from the Do It deck and actually do it.' },
  { t:3, owner:'both', q:'Say one instruction out loud and wait until it is done.' },
];

// ---------------------------------------------------------------- DO IT
const DOIT = [
  { t:1, owner:'him', q:'Kiss her neck once. Then walk away.' },
  { t:1, owner:'him', q:'Tell her one thing about her body you love. Be specific about where or what.' },
  { t:1, owner:'him', q:'Take her hand and hold it. Say nothing for a full minute.' },
  { t:1, owner:'him', q:'Look at her for ten seconds without saying anything. Do not explain why.' },
  { t:1, owner:'her', q:'Kiss him once, properly, then tell him why.' },
  { t:1, owner:'her', q:'Put your hand flat on his chest and leave it there.' },
  { t:1, owner:'her', q:'Tell him one thing he does that you like.' },
  { t:1, owner:'her', q:'Take his hand and put it somewhere you want it. Say nothing.' },
  { t:1, owner:'both', q:'Both close your eyes. One of you touch the other once, then stop.' },

  { t:2, owner:'him', q:'Undress her down to one item. Slowly. Say nothing.' },
  { t:2, owner:'him', q:'Put her hands where you want them, and keep them there.' },
  { t:2, owner:'him', q:'Kiss her for a full minute without letting her touch you.' },
  { t:2, owner:'him', q:'Tell her exactly what you are going to do, then do only the first part.' },
  { t:2, owner:'him', q:'Run your hands from her shoulders to her hips, over her clothes, once. Then stop.' },
  { t:2, owner:'her', q:'Take his hand and lead him somewhere private without saying a word.' },
  { t:2, owner:'her', q:'Tell him one thing you want him to do to you.' },
  { t:2, owner:'her', q:'Undo one button, then wait for him to notice.' },
  { t:2, owner:'her', q:'Kiss him the way you want to be kissed.' },
  { t:2, owner:'both', q:'Take turns saying one thing you want. No explaining, no justifying.' },
  { t:2, owner:'both', q:'Each of you says one word describing how you want the next hour to go. No discussion after.' },

  { t:3, owner:'him', q:'Blindfold her with something soft, then do nothing at all for thirty seconds.' },
  { t:3, owner:'him', q:'Give her one instruction and wait as long as it takes.' },
  { t:3, owner:'him', q:'Tell her no, once — then make her wait for it.' },
  { t:3, owner:'her', q:'Tell him to do the thing you want, in plain words. Once.' },
  { t:3, owner:'her', q:'Take charge for five minutes. He does what you say.' },
  { t:3, owner:'both', q:'One of you decides how the next hour goes. The other does not negotiate.' },
];

// ---------------------------------------------------------------- STRIP
/*
 * Strip is a COMPLY-OR-FORFEIT deck: every card is an instruction, and the
 * forfeit is always available and always cheaper than it sounds. Two rules
 * printed in the README and enforced by the card text:
 *   1. A forfeit is a real answer. Taking it is not losing.
 *   2. Whoever draws does not have to explain a forfeit.
 * Order escalates by tier: accessories → choice → imposed → both.
 */
const STRIP = [
  { t:1, owner:'both', q:'Remove one accessory. Watch, ring, hair tie — your call.' },
  { t:1, owner:'both', q:'Your partner names one item. Remove it.' },
  { t:1, owner:'both', q:'Remove one sock. Just one.' },
  { t:1, owner:'both', q:'Remove one item of your choosing. Nothing under it.' },
  { t:1, owner:'both', q:'Lose a round: remove one item, or answer one Warm truth.' },

  { t:2, owner:'both', q:'Remove one item — and your partner picks which, not you.' },
  { t:2, owner:'both', q:'Both remove one item. You each choose the other\u2019s.' },
  { t:2, owner:'both', q:'Remove two items, or take one instruction from your partner instead.' },
  { t:2, owner:'both', q:'Remove one item, but you cannot use your hands. Your partner helps or watches — they choose.' },
  { t:2, owner:'both', q:'Remove one item for every compliment your partner gives you. One item each.' },
  { t:2, owner:'both', q:'Turn around slowly. Your partner removes one item from you.' },

  { t:3, owner:'both', q:'Remove one item. Your partner decides what comes off last.' },
  { t:3, owner:'both', q:'Remove one item, or spend two minutes doing exactly what your partner says.' },
  { t:3, owner:'both', q:'Both remove one item. Whoever hesitates longest removes another.' },
  { t:3, owner:'both', q:'Give your partner one instruction about what to remove. You cannot take it back.' },
  { t:3, owner:'both', q:'Remove one item — or tell your partner one thing you want, out loud, in plain words.' },
];

// ---------------------------------------------------------------- ASSEMBLY
let n = 0;
const mk = (deck, c, extra = {}) => ({
  id: `${deck}-${String(++n).padStart(3, '0')}`,
  deck,
  tier: c.t,
  answer: c.a || 'open',
  for: c.for || c.owner || 'both',
  q: c.q,
  opts: c.opts || null,
  ...extra,
});

export const CARDS = [
  ...ADMIRE.map(c => mk('admire', c)),
  ...FANTASY.map(c => mk('fantasy', c)),
  ...TRUTHS.map(c => mk('truthdare', c, { kind: 'truth' })),
  ...DARES.map(c => mk('truthdare', c, { kind: 'dare' })),
  ...DOIT.map(c => mk('doit', c)),
  ...STRIP.map(c => mk('strip', c)),
];

export const COUNTS = CARDS.reduce((a, c) => (a[c.deck] = (a[c.deck] || 0) + 1, a), {});
