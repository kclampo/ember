/*
 * Ember — deck.js
 * Card corpus. Five decks, three heat tiers, five answer types.
 *
 * ANSWER TYPES
 *   open      an answer or an action, spoken out loud. No input box.
 *   pick      choose one from `opts`
 *   thisor    choose A or B from `opts`
 *   scale     rate 1–5
 *   would     Yes / Maybe / Not for me / Ask me again later
 *
 * ⭐ `pitch` — EVERY `would` CARD CARRIES ONE. A bare sentence fragment with no
 * question attached is not a card, it is a riddle. The pitch is the question
 * line, the `q` is the thing being asked about. 2026-10-27: Kevin said he could
 * not tell how these cards worked — the pitch is the fix.
 *
 * BALANCE RULE: in the question decks (admire, fantasy, truths) keep `open` at
 * or below ~45%. Task decks are `open` by nature — the instruction IS the
 * content.
 *
 * `for`: 'both' | 'him' | 'her'
 *
 * ⛔ HARD EXCLUSIONS — never add a card containing:
 *    oral–genital contact (any direction, "fluids gross her out"), anal (any),
 *    a third person as a required act, or anything requiring her to invent a
 *    scenario from nothing.
 *    ⇒ SYP is mouth-and-hands on the BODY: neck, ears, throat, chest, wrists,
 *      fingers, stomach, hands inside clothing. It is never mouth-on-genitals.
 */

export const HEAT = { 1: 'Warm', 2: 'Hot', 3: 'Hottest' };

export const DECKS = [
  { id: 'admire',    label: 'Connection — What I Notice',            blurb: 'Say the true thing you have not said.' },
  { id: 'fantasy',   label: 'Connection — If You Couldn\u2019t Get Caught', blurb: 'One question, four honest answers.' },
  { id: 'truthdare', label: 'Truth or Dare',                          blurb: 'Pick truth, or pick dare.' },
  { id: 'doit',      label: 'Do It To Your Partner',                  blurb: 'A thing to do — not a thing to say.' },
  { id: 'sypstrip',  label: 'SYP or Strip',                           blurb: 'Take a drink of them — or take something off.' },
];

const WOULD = ['Yes', 'Maybe', 'Not for me', 'Ask me again later'];

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
  { t:2, a:'thisor', q:'Which turns you on more?', for:'her', opts:['Him deciding', 'Him asking'] },
  { t:2, a:'pick',   q:'What do you wish he did more of?', for:'her', opts:['Told you what he wants', 'Touched you in passing', 'Looked at you a certain way', 'Took his time'] },

  { t:3, a:'open',   q:'What is one thing your partner does in bed that you never want them to stop doing?' },
  { t:3, a:'pick',   q:'What is the bigger turn-on?', opts: OPTS.biggerTurn },
  { t:3, a:'open',   q:'What is the last thing about your partner that made you actually catch your breath?' },
  { t:3, a:'open',   q:'Name something you have thought about your partner but never said out loud.' },
  { t:3, a:'pick',   q:'What pace actually works for you?', opts: OPTS.pace },
  { t:3, a:'pick',   q:'Honest answer — have you ever told anyone else what you want from them?', opts: OPTS.honesty },
  { t:3, a:'pick',   q:'Do you want to be told what to do, or left to decide?', for:'her', opts:['Told, clearly', 'Told, gently', 'Left to decide', 'Depends entirely on the day'] },
  { t:3, a:'pick',   q:'What do you want that you have never asked for?', for:'her', opts:['More of him deciding', 'More of him waiting for me', 'More being wanted first', 'More of me being in charge', 'I do not know yet'] },
  { t:3, a:'thisor', q:'Which would you rather he did tonight?', for:'her', opts:['Told you exactly what happens next', 'Said nothing and showed you'] },
  { t:3, a:'open',   q:'What does she do that undoes you completely?', for:'him' },
];

// ---------------------------------------------------------------- FANTASY
const FANTASY = [
  { t:1, a:'would', pitch:'Would you want this?', q:'Being wanted somewhere you would have to keep quiet.' },
  { t:1, a:'would', pitch:'Would you want this?', q:'A hotel neither of you has been to, no plans, one night.' },
  { t:1, a:'would', pitch:'Would you want this?', q:'A shower with the door locked and nobody calling for you.' },
  { t:1, a:'would', pitch:'Would you want this?', q:'Waking up to it, before you are properly awake.' },
  { t:1, a:'open',   q:'If you could not possibly get caught, where would you want it to happen?' },
  { t:1, a:'pick',   q:'If you got to pick the time and nothing else, what would you pick?', opts: OPTS.when },
  { t:1, a:'thisor', q:'Which would you rather have?', opts:['A whole night, unhurried', 'Ten stolen minutes, right now'] },
  { t:1, a:'thisor', q:'Which is the better fantasy?', opts:['Nobody knows where you are', 'Everybody knows and cannot say anything'] },

  { t:2, a:'would', pitch:'Would you want this?', q:'Being told exactly what to do for an entire evening.' },
  { t:2, a:'would', pitch:'Would you want this?', q:'Being the one in charge for an entire evening.' },
  { t:2, a:'would', pitch:'Would you want this?', q:'Taking your time with no clock running and nowhere to be.' },
  { t:2, a:'would', pitch:'Would you want this?', q:'A whole day where you both say yes to each other.' },
  { t:2, a:'would', pitch:'Would you want this?', q:'Watching your partner get ready for you, slowly, without helping.' },
  { t:2, a:'would', pitch:'Would you want this?', q:'Being undressed by someone who does not rush and does not explain.' },
  { t:2, a:'open',   q:'If you could not be caught, what is the first thing you would do?' },
  { t:2, a:'pick',   q:'Which setting actually does it for you?', opts: OPTS.setting },
  { t:2, a:'pick',   q:'What would make a night actually work for you?', opts:['No timeline', 'Being told what happens next', 'Being left alone to it', 'Being wanted first, before anything'] },
  { t:2, a:'thisor', q:'Which would you actually choose?', opts:['Being surprised', 'Being told in advance and made to wait'] },

  { t:3, a:'would', pitch:'Would you want this?', q:'Being blindfolded and not knowing what comes next.' },
  { t:3, a:'would', pitch:'Would you want this?', q:'Being held down — hands only, easy release, and you both know it.' },
  { t:3, a:'would', pitch:'Would you want this?', q:'A risk of being heard, but never seen.' },
  { t:3, a:'would', pitch:'Would you want this?', q:'Being told no, and made to wait for it.' },
  { t:3, a:'would', pitch:'Would you want this?', q:'Giving up the decision entirely, once, and seeing what happens.' },
  { t:3, a:'open',   q:'What is the fantasy you would actually want to happen — not just imagine?' },
  { t:3, a:'open',   q:'What is one thing you would want said out loud, in the moment?' },
  { t:3, a:'pick',   q:'Where is your honest line right now?', opts:['He decides, I follow', 'We decide together', 'I get a veto, always', 'I do not know yet'] },
];

// ---------------------------------------------------------------- TRUTH OR DARE
const TRUTHS = [
  { t:1, q:'What is the first thing you noticed about me?', a:'open' },
  { t:1, q:'What is a small thing I do that turns you on?', a:'open' },
  { t:1, q:'The last time you thought about me during the day — where were you?', a:'pick', opts: OPTS.lastThought },
  { t:1, q:'What do you wish I understood about you that I keep missing?', a:'open' },
  { t:1, q:'When do you feel closest to me?', a:'pick', opts:['When we talk properly', 'When we are doing nothing together', 'In bed, after', 'When you handle something for me', 'When we are away from the house'] },
  { t:1, q:'Which do you want more of?', a:'thisor', opts:['Planned nights', 'Something unplanned'] },
  { t:2, q:'What is something you want me to do more of?', a:'pick', opts: OPTS.moreOf },
  { t:2, q:'What is a place you have thought about us doing it?', a:'open' },
  { t:2, q:'What do you want more of, honestly?', a:'pick', opts:['Being wanted out loud', 'Being left alone when you need it', 'Being chased', 'Being handled without discussion'] },
  { t:2, q:'What pace do you actually prefer?', a:'pick', opts: OPTS.pace },
  { t:2, q:'Which is harder for you to say?', a:'thisor', opts:['What you want', 'What you do not want'] },
  { t:3, q:'What is one thing you would want me to say in the moment that I have never said?', a:'open' },
  { t:3, q:'What is the last thing you thought about me that you decided not to say?', a:'open' },
  { t:3, q:'Do you want to be told what to do?', a:'pick', opts: OPTS.describeYou },
  { t:3, q:'Honest — have you ever told me everything you want?', a:'pick', opts:['Everything', 'Most of it', 'About half', 'Not close'] },
  { t:3, q:'What would you rather have?', a:'thisor', opts:['Everything, all at once', 'The build-up, for days'] },
];

const DARES = [
  { t:1, q:'Kiss your partner for thirty seconds without using your hands.' },
  { t:1, q:'Say out loud one thing you want, in plain words.' },
  { t:1, q:'Give your partner one sincere compliment about their body. Specific, not general.' },
  { t:1, q:'Hold eye contact with your partner for twenty seconds without speaking.' },
  { t:1, q:'Tell your partner the first thing you noticed about them tonight.' },
  { t:1, q:'Describe your partner in three words. No repeats from last round.' },
  { t:2, q:'Slow-dance with your partner for one song with no talking.' },
  { t:2, q:'Describe one thing you want your partner to do to you. Out loud.' },
  { t:2, q:'Remove one item of your partner\u2019s clothing. Slowly. No explanation.' },
  { t:2, q:'Whisper something in your partner\u2019s ear that you would only say in private.' },
  { t:2, q:'Trace one line from your partner\u2019s neck to their hand with one finger. Then stop.' },
  { t:2, q:'Tell your partner one thing you want to do to them — and when.' },
  { t:3, q:'Put your partner\u2019s hands where you want them. Leave them there.' },
  { t:3, q:'Kiss your partner for a full minute, and be the one to end it.' },
  { t:3, q:'Pick one card from the SYP deck and actually do it.' },
  { t:3, q:'Say one instruction out loud and wait until it is done.' },
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
  { t:3, owner:'her', q:'Put his hand where you want it, and tell him not to move it.' },
  { t:3, owner:'her', q:'Tell him one thing he does that you want more of tonight — and make him do it.' },
  { t:3, owner:'both', q:'One of you decides how the next hour goes. The other does not negotiate.' },
];

// ---------------------------------------------------------------- SYP
/* SYP — "take a drink of your partner."
 * Mouth and hands on the BODY. Never mouth-on-genitals. Mouth goes to ears,
 * throat, neck, collarbone, chest, stomach, wrists, fingers. Hands go
 * everywhere. That is the whole deck, and the limit is what keeps it usable.
 */
const SYP = [
  { t:1, q:'Kiss your partner\u2019s neck and do not move on for at least ten seconds.' },
  { t:1, q:'Take their earlobe between your lips, hold it, then let go.' },
  { t:1, q:'Kiss the inside of their wrist. Then turn their hand over and kiss the palm.' },
  { t:1, q:'Run your tongue once along their collarbone. Once.' },
  { t:1, q:'Kiss them behind the ear. Say nothing about it afterwards.' },
  { t:1, q:'Hold their face in both hands and kiss them slowly for fifteen seconds.' },
  { t:1, q:'Take their bottom lip gently between your teeth and pull back.' },
  { t:1, q:'Kiss the back of their neck and let them feel you breathe there.' },

  { t:2, q:'Take a drink: kiss from their throat down to their collarbone, slowly, and stop at the shirt.' },
  { t:2, q:'Put your mouth on their shoulder and bite down just enough to be felt.' },
  { t:2, q:'Take their fingers into your mouth one at a time, and look at them while you do it.' },
  { t:2, q:'Put your hand inside their shirt and kiss them at the same time.' },
  { t:2, q:'Run your hand down the front of their trousers. Stop at the waistband. Wait.' },
  { t:2, q:'Kiss their chest over the clothing, and take far longer than necessary.' },
  { t:2, q:'Suck on their neck until they tell you to stop.' },
  { t:2, q:'Take their hand and put their fingers against your mouth. Let them decide what happens next.' },

  { t:3, q:'Take a drink: mouth on their chest, hands on their hips, and do not stop until they say so.' },
  { t:3, q:'Reach inside their clothes and do not explain what you are doing.' },
  { t:3, q:'Suck on the soft place where their neck meets their shoulder until it marks.' },
  { t:3, q:'Put your hand inside their trousers and leave it there. Say nothing at all.' },
  { t:3, q:'Kiss, bite and suck your way from their throat to their waistband. Then stop dead.' },
  { t:3, q:'Tell them exactly where you are going to put your mouth next. Then do it.' },
  { t:3, q:'Hold their wrists and use only your mouth for two minutes.' },
];

// ---------------------------------------------------------------- STRIP
/* STRIP — passionate and prelude. NOT literal undressing only.
 * Hair, chest, hands, held looks, and clothing as one tool among several.
 */
const STRIP = [
  { t:1, q:'Run your fingers through your partner\u2019s hair and hold their head there.' },
  { t:1, q:'Kiss your partner\u2019s chest, once, over the clothing.' },
  { t:1, q:'Take their hand and put it flat on your own chest.' },
  { t:1, q:'Trace one finger slowly from their throat down to their waistband.' },
  { t:1, q:'Pull them in by the waist and hold for thirty seconds without speaking.' },
  { t:1, q:'Kiss them once for every year you have been together.' },
  { t:1, q:'Tell them one thing you want them to take off. Just say it.' },
  { t:1, q:'Take one item off and hand it to them. Say nothing.' },

  { t:2, q:'Remove one item of your partner\u2019s clothing and put it where they would have to get up to fetch it.' },
  { t:2, q:'Take off one item. Let them watch you do it.' },
  { t:2, q:'Push their shirt up and kiss their stomach. Then pull it back down.' },
  { t:2, q:'Undo their trousers. Do nothing else.' },
  { t:2, q:'Have them remove one item while you watch, and say nothing the whole time.' },
  { t:2, q:'Sit them down, stand in front of them, and let them look as long as they want.' },
  { t:2, q:'Take off two items, or give one instruction instead. Your choice, and it is final.' },
  { t:2, q:'Remove something of theirs and put it on yourself.' },

  { t:3, q:'Both remove one item. You each decide what the other loses.' },
  { t:3, q:'Remove one item — and they decide where you kiss them next.' },
  { t:3, q:'Take off everything on your top half and let them look for as long as they like.' },
  { t:3, q:'Take off one item for every instruction they give you.' },
  { t:3, q:'Remove one item, or tell them what you want done to you. One or the other.' },
  { t:3, q:'What is on now stays on until they say otherwise.' },
  { t:3, q:'Give them one instruction about what to remove. You cannot take it back.' },
];

// ---------------------------------------------------------------- ASSEMBLY
let n = 0;
const mk = (deck, c, extra = {}) => ({
  id: `${deck}-${String(++n).padStart(3, '0')}`,
  deck,
  tier: c.t,
  answer: c.a || 'open',
  for: c.for || c.owner || 'both',
  pitch: c.pitch || null,
  q: c.q,
  opts: c.opts || (c.a === 'would' ? WOULD : null),
  ...extra,
});

export const CARDS = [
  ...ADMIRE.map(c => mk('admire', c)),
  ...FANTASY.map(c => mk('fantasy', c)),
  ...TRUTHS.map(c => mk('truthdare', c, { kind: 'truth' })),
  ...DARES.map(c => mk('truthdare', c, { kind: 'dare' })),
  ...DOIT.map(c => mk('doit', c)),
  ...SYP.map(c => mk('sypstrip', c, { kind: 'syp' })),
  ...STRIP.map(c => mk('sypstrip', c, { kind: 'strip' })),
];

export const COUNTS = CARDS.reduce((a, c) => (a[c.deck] = (a[c.deck] || 0) + 1, a), {});
export const WOULD_OPTS = WOULD;
