/*
 * Ember — deck.js  (v1.3.0 corpus)
 *
 * FOUR DECKS, TWO TABS. 249 cards.
 *
 *   tab 'questions' → connection        (persists forever, has a reset button)
 *   tab 'games'     → menu · truthdare · kindling   (12-hour session, resets)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SCHEMA
 *
 *   deck      'connection' | 'menu' | 'truthdare' | 'kindling'
 *   tier      1 | 2 | 3 — meaning is PER DECK (see TIERS). Never a global "heat".
 *   answer    'open' | 'pick' | 'thisor' | 'scale' | 'would'
 *   for       'both' | 'him' | 'her' — which player the card belongs to
 *   as        'any' | 'dom' | 'sub' — perspective. A DOM player draws 'dom'+'any';
 *             a SUB draws 'sub'+'any'; a SWITCH draws all three. Most cards are
 *             'any', because most acts are readable from either side. 'dom'/'sub'
 *             are reserved for the power-exchange cards where the direction is the
 *             content.
 *   pitch     every `would` card carries one. A bare fragment is not a card.
 *   kind      'truth' | 'dare' — deck 3 only
 *   layer     deck 3 dares only: { who, n }. Whose clothing comes off, and how many.
 *               who: 'self' | 'partner' | 'both' | 'self-they-choose' |
 *                    'partner-they-choose' | 'partner-you-choose'
 *             'both' removes one from each, so the gap cannot move at all — it is
 *             the engine's safety valve when the other dares would unbalance.
 *             The draw engine refuses any layer card that would open a gap wider
 *             than 1 between the two players. That is what stops one of you ending
 *             up naked while the other is still dressed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⛔ HARD EXCLUSIONS — never add a card containing: oral–genital contact in any
 *    direction, anal in any form, a third person as a required act, or anything
 *    requiring the other person to invent a scenario from nothing.
 *    Mouth goes on the BODY: neck, ears, throat, collarbone, chest, stomach,
 *    wrists, fingers. Never mouth-on-genitals. These outrank every card.
 *
 * ⛔ NO NAMES IN THIS FILE. The repo is public. Names are typed on the device.
 */

export const TABS = [
  { id: 'questions', label: 'Questions' },
  { id: 'games',     label: 'Games' },
];

export const DECKS = [
  { id: 'connection', tab: 'questions', label: 'Connection',
    blurb: 'Say the true thing you have not said. Every level asks more of you.' },
  { id: 'menu',       tab: 'questions', label: 'The Menu',
    blurb: 'You both answer privately. Then everything opens — and your answers lock in to the games.' },
  { id: 'truthdare',  tab: 'games',     label: 'Truth or Dare',
    blurb: 'Two buttons. The phone moves. It heats up as you go.' },
  { id: 'kindling',   tab: 'games',     label: 'Kindling',
    blurb: 'A thing to do, not a thing to say. Before anything else.' },
];

/* ⛔ Tier labels are PER DECK. "Warm/Hot/Hottest" described heat and only two of
   these four decks escalate on heat. Connection escalates on how hard the honest
   answer is; that is a different axis and needs different words. */
export const TIERS = {
  connection: { 1: 'Notice',   2: 'Consider', 3: 'Admit'  },
  menu:       { 1: 'Familiar', 2: 'Specific', 3: 'Edge'   },
  truthdare:  { 1: 'Warming',  2: 'Heated',   3: 'Edge'   },
  kindling:   { 1: 'Spark',    2: 'Flame',    3: 'Blaze'  },
};

export const WOULD_OPTS = ['Yes', 'Maybe', 'Not for me', 'Ask me again later'];

const P = 'Would you want this?';

/* ═══════════════════════════════════════════════════ 1 · CONNECTION (48)
 * 100% open. Nothing is stored, so nothing can be compared — this deck has no
 * sound by design. The tier is how much THINKING the honest answer costs.
 * ═══════════════════════════════════════════════════════════════════════════ */
const CONNECTION = [
  /* ---- Notice: answerable in three seconds, from memory ---- */
  { t:1, q:'What is the first thing you notice when your partner walks into a room?' },
  { t:1, q:'What sound does your partner make that you like?' },
  { t:1, q:'What is a small thing your partner does that you would miss if it stopped tomorrow?' },
  { t:1, q:'Name one thing your partner is better at than anyone else you know.' },
  { t:1, q:'What did your partner do this week that you noticed and never mentioned?' },
  { t:1, q:'What does your partner do with their hands that you watch?' },
  { t:1, q:'When in the last week did your partner look most attractive to you — and it was not when they were trying?' },
  { t:1, q:'What is a small thing your partner has done for you in the last month that you never thanked them for?' },
  { t:1, q:'What does your partner wear that does something to you?' },
  { t:1, q:'Tell your partner one thing about their body you genuinely admire right now. Be specific.' },
  { t:1, q:'What has your partner done this week that made you want them?' },
  { t:1, q:'What do you find most attractive in your partner at the moment?' },
  { t:1, q:'Which part of your partner do you catch yourself looking at most these days?' },
  { t:1, q:'What is a thing your partner has said recently that you keep thinking about?' },
  { t:1, q:'What habit of theirs have you found comforting this month?' },
  { t:1, q:'What does your partner do when they are happy that only you would recognise?' },

  /* ---- Consider: you have to think, compare, or admit something small ---- */
  { t:2, q:'What is something you used to do around your partner that you have stopped doing — and why did you stop?' },
  { t:2, q:'When did you last feel genuinely chosen by your partner — not loved, chosen?' },
  { t:2, q:'What is something you pretend not to need from them?' },
  { t:2, q:'What do you do that you know annoys them, and you do it anyway?' },
  { t:2, q:'What is a compliment you want from them that you have never asked for?' },
  { t:2, q:'If your partner described you to a stranger, what would you be afraid they would get right?' },
  { t:2, q:'How seen have you felt by your partner this week, and what moved that number?' },
  { t:2, q:'How well does your partner read what you want without being told?' },
  { t:2, q:'What is something you have decided not to bring up — and how long have you carried it?' },
  { t:2, q:'When do you feel closest to your partner, and does it happen often enough?' },
  { t:2, q:'What is the difference between how you love them and how they think you love them?' },
  { t:2, q:'What do you wish your partner understood about the way you say things?' },
  { t:2, q:'What is something you would like them to ask you about, that they never do?' },
  { t:2, q:'Which of your own habits would you defend, and which would you give up if they asked?' },
  { t:2, q:'What do you do differently when they are not there?' },
  { t:2, q:'What is something you have stopped expecting from them — did you decide that, or give up?' },

  /* ---- Admit: answering honestly costs you something ---- */
  { t:3, q:'What is something you need from your partner that you have never said out loud?' },
  { t:3, q:'What is a version of yourself you do not let them see?' },
  { t:3, q:'What is the loneliest you have felt in this relationship — and what were you doing that week?' },
  { t:3, q:'What have you forgiven them for that you have not actually let go of?' },
  { t:3, q:'What are you afraid they will figure out about you?' },
  { t:3, q:'If you could change one thing about how you love them, what would it be?' },
  { t:3, q:'What is something you have thought about them that you have never said out loud?' },
  { t:3, q:'What is the last thing about them that made you catch your breath?' },
  { t:3, q:'What do you want that you have never asked for?' },
  { t:3, q:'When were you last jealous, and what was it really about?' },
  { t:3, q:'What is a way you have been unfair to them that they do not know about?' },
  { t:3, q:'What would you want them to know if you knew they could never act on it?' },
  { t:3, q:'What is a fear about this relationship you have decided not to examine?' },
  { t:3, q:'What would you take back if you could — and what stops you saying so?' },
  { t:3, q:'What do you need to hear from them that you would never ask them to say?' },
  { t:3, q:'If the next year went exactly like the last one, what would you change first?' },
];

/* ═══════════════════════════════════════════════════ 2 · THE MENU (66)
 * Selection only. Both players answer a round BLIND (neither sees the other's
 * answers while answering), then EVERYTHING opens — mismatches included.
 * ═══════════════════════════════════════════════════════════════════════════ */
const MENU = [
  /* ---- Familiar ---- */
  { t:1, a:'would', q:'Being kissed somewhere you were not expecting.' },
  { t:1, a:'would', q:'Lights on, and them looking the whole time.', gate:'watched' },
  { t:1, a:'would', q:'A shower with the door locked and nobody calling for you.' },
  { t:1, a:'would', q:'Being wanted somewhere you would have to keep quiet.', gate:'risky' },
  { t:1, a:'would', q:'A hotel neither of you has been to, no plans, one night.' },
  { t:1, a:'would', q:'Waking up to it, before you are properly awake.', gate:'waking' },
  { t:1, a:'would', q:'Being told exactly what to do for an evening.', gate:'orders' },
  { t:1, a:'would', q:'Taking your time with no clock and nowhere to be.' },
  { t:1, a:'would', q:'Watching your partner get ready for you, slowly, without helping.', gate:'watched' },
  { t:1, a:'would', q:'Being undressed by someone who does not rush and does not explain.' },
  { t:1, a:'would', q:'Being wanted more often than you are.' },
  { t:1, a:'would', q:'Ten stolen minutes in the middle of the day.' },
  { t:1, a:'would', q:'A whole night with no interruptions.' },
  { t:1, a:'would', q:'Being kissed like they have not seen you in a week.' },
  { t:1, a:'would', q:'Someone reaching for you without asking.' },
  { t:1, a:'would', q:'Being told you look good, in specific words.' },
  { t:1, a:'pick',  q:'Where do you want to be touched first?', opts:['Neck','Mouth','Chest','Stomach','Hips','Somewhere else'] },
  { t:1, a:'pick',  q:'When do you want it most?', opts:['Morning','Middle of the day','Right before sleep','Woken up for it','When nobody is home'] },
  { t:1, a:'pick',  q:'Which setting actually does it for you?', opts:['Somewhere new','Somewhere outdoors','A car','A hotel','Home with no interruptions'] },
  { t:1, a:'thisor',q:'Which would you rather have this month?', opts:['One whole night, unhurried','Ten stolen minutes, right now'] },
  { t:1, a:'thisor',q:'How do you like it to move?', opts:['Slow and deliberate','Fast and urgent'] },
  { t:1, a:'scale', q:'How physically desired do you feel by your partner lately?',
    lo:'Not at all', hi:'Completely' },

  /* ---- Specific ---- */
  { t:2, a:'would', q:'Being held down — hands only, easy release, and you both know it.', gate:'restraint' },
  { t:2, a:'would', q:'Their mouth on your neck until you tell them to stop.' },
  { t:2, a:'would', q:'Being the one in charge for an entire evening.', as:'dom', gate:'incharge' },
  { t:2, a:'would', q:'Giving up the decision entirely, once, and seeing what happens.', as:'sub', gate:'incharge' },
  { t:2, a:'would', q:'Being told no, and made to wait for it.', gate:'denial' },
  { t:2, a:'would', q:'Being teased on and off for an hour.', gate:'teasing' },
  { t:2, a:'would', q:'Being watched while you take your time with yourself.', gate:'watched' },
  { t:2, a:'would', q:'Undressing for someone who does not touch you.', gate:'performing' },
  { t:2, a:'would', q:'Being told exactly what is going to happen next.', gate:'orders' },
  { t:2, a:'would', q:'Being left to decide everything for a night.', as:'dom', gate:'incharge' },
  { t:2, a:'would', q:'Being wanted in the middle of something that is not about sex.' },
  { t:2, a:'would', q:'Their hands in your hair, holding your head where they want it.' },
  { t:2, a:'would', q:'Being kissed somewhere other than your mouth, for a long time.' },
  { t:2, a:'would', q:'Being asked what you want, out loud, and made to answer.' },
  { t:2, a:'pick',  q:'What do you want more of?', opts:['Being wanted','Being told','Touch with no goal','Time'] },
  { t:2, a:'pick',  q:'What makes you want them most?', opts:['When they take charge','When they are soft with me','When they are focused on something','When they laugh','When they touch me in passing'] },
  { t:2, a:'pick',  q:'Which of these do you wish happened more often?', opts:['Being undressed by them','Being told what they want','Being caught off guard','Being made to wait'] },
  { t:2, a:'thisor',q:'Which do you want tonight?', opts:['To be surprised','To be told in advance and made to wait'] },
  { t:2, a:'thisor',q:'How do you want to be wanted?', opts:['Said out loud, in words','Shown without a word'] },
  { t:2, a:'pick',  q:'What pace actually works for you?', opts:['Slow and deliberate','Fast and urgent','Teasing, on and off','Whatever happens'] },
  { t:2, a:'pick',  q:'When it comes to who leads, what do you actually want?',
    opts:['They lead and I follow','I lead and they follow','We trade it mid-scene','Whoever starts it, leads'] },
  { t:2, a:'scale', q:'How honest have you been with them about what you want?',
    lo:'Not at all', hi:'Completely' },

  /* ---- Edge ---- */
  { t:3, a:'would', q:'Being blindfolded and not knowing what comes next.', gate:'blindfold' },
  { t:3, a:'would', q:'A risk of being heard, but never seen.', gate:'risky' },
  { t:3, a:'would', q:'Being restrained — cuffs, not hands.', gate:'restraint' },
  { t:3, a:'would', q:'Your partner deciding when you are allowed to finish.', gate:'denial' },
  { t:3, a:'would', q:'Being made to ask for it.', gate:'denial' },
  { t:3, a:'would', q:'Being watched the entire time, and not allowed to look away.', gate:'watched' },
  { t:3, a:'would', q:'Giving one instruction and having it obeyed exactly.', as:'dom', gate:'orders' },
  { t:3, a:'would', q:'Being told what to wear, and nothing else.', gate:'orders' },
  { t:3, a:'would', q:'Being denied, and made to wait until they decide.', gate:'denial' },
  { t:3, a:'would', q:'Somewhere you could be caught.', gate:'risky' },
  { t:3, a:'would', q:'Being told what to do in plain words, repeatedly, until it is done.', gate:'orders' },
  { t:3, a:'would', q:'Having your hands held above your head and not being able to move.', gate:'restraint' },
  { t:3, a:'would', q:'Being teased for hours with nothing following it.', gate:'teasing' },
  { t:3, a:'would', q:'Being the one who decides everything, and answerable for it.', as:'dom', gate:'incharge' },
  { t:3, a:'would', q:'Being marked where only the two of you would know.', gate:'marking' },
  { t:3, a:'would', q:'Being held to one instruction for an entire night.', as:'sub', gate:'heldrule' },
  { t:3, a:'pick',  q:'Where is your honest line right now?', opts:['They decide, I follow','We decide together','I get a veto, always','I do not know yet'] },
  { t:3, a:'pick',  q:'What do you want that you have never asked for?', opts:['More of them deciding','More of them waiting for me','More being wanted first','More of me in charge','I do not know yet'] },
  { t:3, a:'thisor',q:'Which do you want: all at once, or drawn out?', opts:['Everything, all at once','The build-up, for days'] },
  { t:3, a:'thisor',q:'How much do you want told to you beforehand?', opts:['Told exactly what happens next','Said nothing, shown everything'] },
  { t:3, a:'thisor',q:'Which end of it do you actually want?', opts:['Being in charge and answerable for it','Giving it up entirely'] },
  { t:3, a:'scale', q:'How far do you actually want to go, if nothing was in the way?',
    lo:'Nothing further', hi:'As far as it goes' },
];

/* ═══════════════════════════════════════════════════ 3 · TRUTH OR DARE (60)
 * Two buttons: TRUTH / DARE. The phone moves. Escalates by ROUND, not a picker:
 *   rounds 1–5 → tier 1 · 6–11 → tier 2 · 12+ → tier 3
 * ═══════════════════════════════════════════════════════════════════════════ */
const TRUTHS = [
  /* Warming */
  { t:1, q:'What is the first thing you noticed about me?' },
  { t:1, q:'What is a small thing I do that turns you on?' },
  { t:1, q:'When did you last think about me during the day — and where were you?' },
  { t:1, q:'What do I do that you wish I did more of?' },
  { t:1, q:'What is a compliment you want from me that you have never asked for?' },
  { t:1, q:'Which is harder for you to say — what you want, or what you do not want?' },
  { t:1, q:'What is something about my body you have never told me you noticed?' },
  { t:1, q:'When do you find me most attractive — doing what, exactly?' },
  { t:1, q:'What is a thing I wear that does something to you?' },
  { t:1, q:'What did you think the first time you saw me undressed?' },

  /* Heated */
  { t:2, q:'What is something you want me to do without asking first?' },
  { t:2, q:'What is a thing you would want me to say in the moment that I have never said?' },
  { t:2, q:'What do you want more of, honestly?' },
  { t:2, q:'What is a place you have thought about us doing it?' },
  { t:2, q:'What pace do you actually prefer — and do I do it?' },
  { t:2, q:'Have you ever pretended to be more tired than you were? What was the real reason?' },
  { t:2, q:'What is one thing I have done once that you want repeated?' },
  { t:2, q:'What do you think about when you are alone that you do not think about with me?' },
  { t:2, q:'Which is better for you — giving up control, or taking it?' },
  { t:2, q:'What is the last thing I did that you thought about afterwards?' },

  /* Edge */
  { t:3, q:'What is something you would want once, that you would not want to make a habit?' },
  { t:3, q:'What is a thing you have never told me you want?' },
  { t:3, q:'What is a sexual thing you might be ready for one day, but are not yet?' },
  { t:3, q:'Honest — have you ever told me everything you want?' },
  { t:3, q:'What is the last thing you thought about me and decided not to say?' },
  { t:3, q:'What is something you would want me to do that you would be embarrassed to ask for?' },
  { t:3, q:'Is there anything we have done that you would not do again? What, and why?' },
  { t:3, q:'What is a line you have thought about crossing, and what stopped you?' },
  { t:3, q:'What do you want said to you that you would never say to me first?' },
  { t:3, q:'If you could change one thing about how we do this, what would it be?' },
];

/* Every dare carries `layer` when clothing comes off, so the engine can keep
   both players even. `who` is written from the HOLDER's point of view. */
const DARES = [
  /* Warming */
  { t:1, q:'Kiss your partner for thirty seconds without using your hands.' },
  { t:1, q:'Say out loud one thing you want, in plain words.' },
  { t:1, q:'Give your partner one sincere compliment about their body. Specific, not general.' },
  { t:1, q:'Hold eye contact with your partner for twenty seconds without speaking.' },
  { t:1, q:'Kiss your partner somewhere that is not their mouth. One kiss. You pick.' },
  { t:1, q:'Trace one line from their neck to their hand with one finger. Then stop.' },
  { t:1, q:'Tell your partner the first thing you noticed about them tonight.' },
  { t:1, q:'Hold their face in both hands and kiss them slowly for fifteen seconds.' },
  { t:1, q:'Take one item off. Your partner chooses which.',  layer:{ who:'self-they-choose', n:1 } },
  { t:1, q:'Take one item off your partner. They do not get to pick which.', layer:{ who:'partner', n:1 } },
  { t:1, q:'Describe your partner in three words. No repeats from last round.' },

  /* Heated */
  { t:2, q:'Remove one item of your partner\'s clothing. Slowly. No explanation.', layer:{ who:'partner', n:1 } },
  { t:2, q:'Take one item off yourself. Let them watch.',                        layer:{ who:'self', n:1 } },
  { t:2, q:'Whisper something in their ear that you would only say in private.' },
  { t:2, q:'Give your partner one instruction. They follow it, or they take an item off.', layer:{ who:'partner', n:1 } },
  { t:2, q:'Put their hand where you want it, and tell them not to move it.' },
  { t:2, q:'Undress them down to one item. Slowly. Say nothing.', layer:{ who:'partner', n:2 } },
  { t:2, q:'Take off two items, or give one instruction instead. Your choice, and it is final.', layer:{ who:'self', n:2 } },
  { t:2, q:'One item each. You both remove something, and neither of you chooses for the other.', layer:{ who:'both', n:1 } },
  { t:2, q:'Tell your partner one thing you want to do to them — and when.' },
  { t:2, q:'Have them remove one item while you watch, and say nothing the whole time.', layer:{ who:'partner-they-choose', n:1 } },
  { t:2, q:'Sit them down, stand in front of them, and let them look as long as they want.' },

  /* Edge */
  { t:3, q:'Take off everything on your top half and let them look as long as they like.',   layer:{ who:'self', n:1 } },
  { t:3, q:'Give your partner one instruction and wait as long as it takes.' },
  { t:3, q:'Choose what your partner takes off. Say nothing about why you chose it.',        layer:{ who:'partner-you-choose', n:1 } },
  { t:3, q:'Take two items off your partner. They do not pick either one.',                  layer:{ who:'partner', n:2 } },
  { t:3, q:'One each, and you each choose for the other.',                                   layer:{ who:'both', n:1 } },
  { t:3, q:'Take one item off — and they decide where you are kissed next.',                 layer:{ who:'self', n:1 } },
  { t:3, q:'Hold their wrists and use only your mouth for two minutes.' },
  { t:3, q:'Tell them to do the thing you want, in plain words. Once.' },
  { t:3, q:'Take charge for five minutes. They do what you say.', as:'dom' },
  { t:3, q:'Hand over the next five minutes. You do what you are told.', as:'sub' },
  { t:3, q:'Remove one item, or tell them what you want done to you. One or the other.',     layer:{ who:'self', n:1 } },
  { t:3, q:'What is on now stays on until they say otherwise.' },
];

/* ═══════════════════════════════════════════════════ 4 · KINDLING (75)
 * Kissing, touching, erotic play. HIM / HER draw. Absorbs the old SYP, Strip and
 * Do It To Your Partner decks. Tiers are spiciness: Spark / Flame / Blaze.
 * ═══════════════════════════════════════════════════════════════════════════ */
const KINDLING = [
  /* ---- Spark: clothing on, or barely disturbed ---- */
  { t:1, q:'Kiss your partner\'s neck once. Then walk away.' },
  { t:1, q:'Kiss your partner\'s neck and do not move on for at least ten seconds.' },
  { t:1, q:'Take their earlobe between your lips, hold it, then let go.' },
  { t:1, q:'Kiss the inside of their wrist. Then turn their hand over and kiss the palm.' },
  { t:1, q:'Run your tongue once along their collarbone. Once.' },
  { t:1, q:'Kiss them behind the ear. Say nothing about it afterwards.' },
  { t:1, q:'Hold their face in both hands and kiss them slowly for fifteen seconds.' },
  { t:1, q:'Take their bottom lip gently between your teeth and pull back.' },
  { t:1, q:'Kiss the back of their neck and let them feel you breathe there.' },
  { t:1, q:'Run your fingers through their hair and hold their head there.' },
  { t:1, q:'Kiss their chest once, over the clothing.' },
  { t:1, q:'Take their hand and put it flat on your own chest.' },
  { t:1, q:'Trace one finger slowly from their throat down to their waistband.' },
  { t:1, q:'Pull them in by the waist and hold for thirty seconds without speaking.' },
  { t:1, q:'Kiss them once for every year you have been together.' },
  { t:1, q:'Look at them for ten seconds without saying anything. Do not explain why.' },
  { t:1, q:'Take their hand and hold it. Say nothing for a full minute.' },
  { t:1, q:'Tell them one thing about their body you love. Specific about where or what.' },
  { t:1, q:'Tell them one thing you want them to take off. Just say it.' },
  { t:1, q:'Kiss them once, properly, then tell them why.' },
  { t:1, q:'Take their hand and put it somewhere you want it. Say nothing.' },
  { t:1, q:'Both close your eyes. One of you touch the other once, then stop.', as:'any' },
  { t:1, q:'Be kissed wherever your partner decides. Then do not react.',      as:'sub' },
  { t:1, q:'Have your partner put your hand where they want it.',              as:'sub' },
  { t:1, q:'Give one instruction about where to be touched, and be obeyed.',  as:'dom' },

  /* ---- Flame: hands under clothing, deliberate ---- */
  { t:2, q:'Kiss from their throat down to their collarbone, slowly, and stop at the shirt.' },
  { t:2, q:'Put your mouth on their shoulder and bite down just enough to be felt.' },
  { t:2, q:'Take their fingers into your mouth one at a time, and look at them while you do it.' },
  { t:2, q:'Put your hand inside their shirt and kiss them at the same time.' },
  { t:2, q:'Run your hand down the front of their trousers. Stop at the waistband. Wait.' },
  { t:2, q:'Kiss their chest over the clothing, and take far longer than necessary.' },
  { t:2, q:'Suck on their neck until they tell you to stop.' },
  { t:2, q:'Take their hand and put their fingers against your mouth. Let them decide what happens next.' },
  { t:2, q:'Push their shirt up and kiss their stomach. Then pull it back down.' },
  { t:2, q:'Undo their trousers. Do nothing else.' },
  { t:2, q:'Sit them down, stand in front of them, and let them look as long as they want.' },
  { t:2, q:'Remove something of theirs and put it on yourself.' },
  { t:2, q:'Undress them down to one item. Slowly. Say nothing.' },
  { t:2, q:'Tell them exactly what you are going to do, then do only the first part.' },
  { t:2, q:'Run your hands from their shoulders to their hips, over the clothes, once. Then stop.' },
  { t:2, q:'Kiss them for a full minute without letting them touch you.' },
  { t:2, q:'Take their hand and lead them somewhere private without saying a word.' },
  { t:2, q:'Undo one button, then wait for them to notice.' },
  { t:2, q:'Kiss them the way you want to be kissed.' },
  { t:2, q:'Tell them one thing you want them to do to you.' },
  { t:2, q:'Take turns saying one thing you want. No explaining, no justifying.',    as:'any' },
  { t:2, q:'Have your shirt opened, and be told not to help.',                        as:'sub' },
  { t:2, q:'Have their hand inside your shirt while they kiss you.',                   as:'sub' },
  { t:2, q:'Open their shirt and leave it open. Then step back.',                     as:'dom' },
  { t:2, q:'Say one word for how you want the next hour to go. No discussion after.',  as:'any' },

  /* ---- Blaze: clothing off, or directed ---- */
  { t:3, q:'Take a drink: mouth on their chest, hands on their hips, and do not stop until they say so.' },
  { t:3, q:'Reach inside their clothes and do not explain what you are doing.' },
  { t:3, q:'Suck on the soft place where their neck meets their shoulder until it marks.' },
  { t:3, q:'Put your hand inside their trousers and leave it there. Say nothing at all.' },
  { t:3, q:'Kiss, bite and suck your way from their throat to their waistband. Then stop dead.' },
  { t:3, q:'Tell them exactly where you are going to put your mouth next. Then do it.' },
  { t:3, q:'Hold their wrists and use only your mouth for two minutes.' },
  { t:3, q:'Take off everything on your top half and let them look as long as they like.' },
  { t:3, q:'Take off one item for every instruction they give you.' },
  { t:3, q:'Give them one instruction about what to remove. You cannot take it back.' },
  { t:3, q:'Both remove one item. You each decide what the other loses.',   as:'any' },
  { t:3, q:'Remove one item — and they decide where you are kissed next.' },
  { t:3, q:'Give them one instruction and wait as long as it takes.' },
  { t:3, q:'Blindfold them with something soft, then do nothing at all for thirty seconds.' },
  { t:3, q:'Tell them no, once — then make them wait for it.' },
  { t:3, q:'Tell them to do the thing you want, in plain words. Once.' },
  { t:3, q:'Take charge for five minutes. They do what you say.',            as:'dom' },
  { t:3, q:'Hand over the next five minutes. You do what you are told.',     as:'sub' },
  { t:3, q:'Put their hand where you want it, and tell them not to move it.', as:'dom' },
  { t:3, q:'Tell them one thing they do that you want more of tonight — and make them do it.' },
  { t:3, q:'One of you decides how the next hour goes. The other does not negotiate.', as:'any' },
  { t:3, q:'Remove one item, or tell them what you want done to you. One or the other.' },
  { t:3, q:'What is on now stays on until they say otherwise.',              as:'sub' },
  { t:3, q:'Be told what comes off next, and in what order.',                 as:'sub' },
  { t:3, q:'Choose what comes off them, and in what order.',                  as:'dom' },
];

/* ═══════════════════════════════════════════════════════════ ASSEMBLY ═══ */
let n = 0;
const mk = (deck, c, extra = {}) => ({
  id: `${deck}-${String(++n).padStart(3, '0')}`,
  deck,
  tier: c.t,
  answer: c.a || 'open',
  for: c.for || 'both',
  as: c.as || 'any',
  pitch: c.a === 'would' ? (c.pitch || P) : null,
  q: c.q,
  opts: c.opts || (c.a === 'would' ? WOULD_OPTS : null),
  layer: c.layer || null,
  gate: c.gate || null,
  lo: c.lo || null,
  hi: c.hi || null,
  ...extra,
});

export const CARDS = [
  ...CONNECTION.map(c => mk('connection', c)),
  ...MENU.map(c => mk('menu', c)),
  ...TRUTHS.map(c => mk('truthdare', c, { kind: 'truth' })),
  ...DARES.map(c => mk('truthdare', c, { kind: 'dare' })),
  ...KINDLING.map(c => mk('kindling', c)),
];

export const COUNTS = CARDS.reduce((a, c) => (a[c.deck] = (a[c.deck] || 0) + 1, a), {});

/** Round → tier for deck 3. Rounds 1–5 warming, 6–11 heated, 12+ edge. */
export function stageForRound(round) {
  if (round <= 5) return 1;
  if (round <= 11) return 2;
  return 3;
}
