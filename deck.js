/*
 * Ember — deck.js  (v1.3.0 corpus)
 *
 * FOUR DECKS, TWO TABS. 286 cards.
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
 * ⛔ HARD EXCLUSIONS — what is still never written: a third person as an INVOLVED
 *    act, or anything requiring the other person to invent a scenario from
 *    nothing. Mouth on the BODY (neck, ears, throat, collarbone, chest, stomach,
 *    wrists, fingers) remains the default register.
 *
 * ⭐ ORAL AND ANAL ARE NOW CONTENT — RULE CHANGE (2026-10-28, by request).
 *    They were excluded outright. They are not any more. They exist as
 *    DIRECTIONAL cards, gated by four directional Limits acts — oral_give ·
 *    oral_receive · anal_give · anal_receive — evaluated PER PERSON at draw
 *    time. Giving and receiving are different limits, so a card is dealt only
 *    when the role EACH of you would play in it is not a hard no for that
 *    person. A card whose text matched globally would block both directions the
 *    moment either of you vetoed either, which is the wrong answer: not being
 *    willing to give says nothing about being willing to receive.
 *    ⚠️ Until both of you have rated those four acts, nothing here is blocked.
 *    The app has no opinion until you give it one — rate Limits before playing
 *    the top level.
 *
 * ⚠️ THIRD PERSON — the distinction (2026-10-28). A third person as an INVOLVED
 *    act is still excluded and always will be. Being SEEN is different: tier 4
 *    asks whether you would let someone watch, or post a film. Those are
 *    QUESTIONS about a want, not acts performed on anyone, and every one of them
 *    is covered by a Limits veto (`exhib` · `voyeur` · `cuck`) so a hard no
 *    removes it before it is dealt. A question you can refuse to be asked is not
 *    the same thing as an act done to you.
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
  /* ⭐ FOUR LEVELS ON THE GAMES (2026-10-28: "If you have to split blaze into 2
     to handle all the questions then so be it"). Blaze/Edge was doing two jobs —
     "hot" and "am I even allowed to want this" — and one bucket cannot hold both
     without the middle of it going soft. Tier 4 is the part that needs a beat
     before you answer. */
  truthdare:  { 1: 'Warming',  2: 'Heated',   3: 'Edge',    4: 'Inferno' },
  kindling:   { 1: 'Spark',    2: 'Flame',    3: 'Blaze',   4: 'Inferno' },
};

/* ⭐ 'Hard no' GATES, 'Not for me' DOES NOT (2026-10-28).
   "The menu card should remove if the answer is a hard no, not a not for me,
   which is soft." So there are two different refusals and they do different
   jobs: 'Not for me' is a preference that belongs to tonight, 'Hard no' is a
   limit that belongs to the deck. Only the hard one removes cards from the
   games. */
export const WOULD_OPTS = ['Yes', 'Maybe', 'Not for me', 'Ask me again later', 'Hard no'];
export const NOISH = new Set(['Not for me', 'Hard no']);

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
  /* ⭐ THIS CARD IS COMPATIBILITY, NOT AGREEMENT (2026-10-28: "A match is if I
     lead and she follows or vice versa, not if we both want to lead.").
     Two people both saying "I lead" is the FAILURE state, not the win. So the
     verdict is read off the PAIR of positions, never off equality. `map` names
     the position each option stands for; `pair` names the rule that reads it. */
  { t:2, a:'pick',  q:'When it comes to who leads, what do you actually want?',
    opts:['They lead and I follow','I lead and they follow','We trade it mid-scene','Whoever starts it, leads'],
    pair:'leadfollow',
    map:{ 'They lead and I follow':'follow', 'I lead and they follow':'lead',
          'We trade it mid-scene':'trade',  'Whoever starts it, leads':'flex' } },
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

  /* ═══════════ v1.3.8 — waking · risky · degrade · cuck ═══════════
     ⭐ These four had no way to be expressed (2026-10-28: "waking should have
     cards in the menu, same with cuck, degrade, waking and risky"). `risky` and
     `waking` had one or three cards each; `degrade` and `cuck` had nothing at all.
     Each carries its `gate`, so a Hard no here removes the theme from the games. */
  { t:2, a:'would', q:'Being woken up by their hands, before you are properly awake.', gate:'waking' },
  { t:3, a:'would', q:'Being woken up with their mouth on you, no warning.',           gate:'waking' },
  { t:2, a:'would', q:'Somewhere you would have to be quiet, or get caught.',          gate:'risky' },
  { t:3, a:'would', q:'Somewhere that is not a bed, and not your own house.',          gate:'risky' },
  { t:3, a:'would', q:'Being called something degrading, and made to answer to it.',   gate:'degrade' },
  { t:3, a:'would', q:'Being told what you are, in one word, and made to agree.',      gate:'degrade' },
  /* ⛔ CUCK — MENU ONLY, AND IT ALWAYS WILL BE. This is a WANT-RATING, not an act
     card: it records your position and gates the theme. A third person as an
     INVOLVED act stays excluded from the games, so no dare will ever require it.
     The rating exists because "is that a hard no for you" is worth knowing. */
  { t:3, a:'would', q:'Watching your partner with someone else.',                      gate:'cuck' },
  { t:3, a:'would', q:'Your partner telling you about someone else, in detail.',       gate:'cuck' },
];

/* ═══════════════════════════════════════════════════ 3 · TRUTH OR DARE (60)
 * Two buttons: TRUTH / DARE. The phone moves. Escalates by ROUND, not a picker:
 *   rounds 1–5 → tier 1 · 6–11 → tier 2 · 12+ → tier 3
 * ═══════════════════════════════════════════════════════════════════════════ */
const TRUTHS = [
  /* Warming — rounds 1–5.
     ⭐ RECENT, NOT NOSTALGIC (2026-10-28: "the warming were also Q's from way
     back, they need to be about more recent and a bit hotter for the first
     round"). Every card here points at this WEEK or TONIGHT. "What did you
     think the first time you saw me undressed" is a memory test, not a turn-on.
     ⚠️ Also written to be ANSWERABLE WITHOUT INVENTING: several are forced
     choices against two concrete things, because "tell me a fantasy" returns
     nothing from someone who does not build scenarios unprompted. */
  { t:1, q:'What did you think about me this week that you did not say out loud?' },
  { t:1, q:'When did you want me this week and not act on it — and what stopped you?' },
  { t:1, q:'What did I do in the last few days that you are still thinking about?' },
  { t:1, q:'Which gets you there faster — my mouth on your neck, or my hands on your hips? Say which, and why.' },
  { t:1, q:'What is the last thing I said to you that stayed with you after you left the room?' },
  { t:1, q:'When I walked past you recently, where were you looking?' },
  { t:1, q:'What do you want me to do the moment we are alone tonight?' },
  { t:1, q:'What have you thought about doing to me this week — and where were you when you thought it?' },
  { t:1, q:'What is one thing I could do tonight that would make you stop pretending to be tired?' },
  { t:1, q:'What is the most recent thing I did that you replayed afterwards?' },

  /* Heated — rounds 6–11 */
  { t:2, q:'What is the most turned on I have made you in the last month — what was I doing?' },
  { t:2, q:'Where do you want my mouth next, and what should I do when I get there?' },
  { t:2, q:'What do you want me to do to you that I have never done?' },
  { t:2, q:'Do you want me rougher, slower, or more deliberate — and be specific about what that looks like.' },
  { t:2, q:'What is one thing you want me to take off you, and how fast?' },
  { t:2, q:'When did you last touch yourself thinking about me, and what were you thinking about?' },
  { t:2, q:'What do you want me to say to you while I am moving inside you?' },
  { t:2, q:'What is something you want done to you that you have never asked for out loud?' },
  { t:2, q:'What do you want me to do to you that would make you lose the ability to speak?' },
  { t:2, q:'What is a sound you want to hear from me, and at what moment?' },

  /* Edge — rounds 12–17.
     ⭐ HIS LIST (2026-10-28). The register is "hot and sayable" — you can answer
     this one out loud without needing a minute first. The ones that need the
     minute are in Inferno. */
  { t:3, q:'What is a sexual act you want to discuss and then do?' },
  { t:3, q:'What is an act you wish I would surprise you with?' },
  { t:3, q:'Would you ever want to watch as your partner plays with themselves?' },
  { t:3, q:'Would you want to show your partner your orgasm — deliberately, while they watch?' },
  { t:3, q:'If you were to be punished, what with — a hand, a belt, a paddle, something else?' },
  { t:3, q:'Would you ever want a forced orgasm — made to come whether or not you were ready?' },
  { t:3, q:'What do you want denied to you — and for how long?' },
  { t:3, q:'What is the most exposed you would let me leave you, and for how long?' },
  { t:3, q:'What do you want me to do to you with my hands while you are not allowed to move?' },
  { t:3, q:'What do you want me to tell you to do that would make you obey without thinking?' },
  { t:3, q:'What is one thing you want that you would be ashamed to say in daylight?' },
  { t:3, q:'What is a line you have thought about crossing, and what would make you cross it?' },

  /* Inferno — rounds 18+.
     ⭐ THE TOP (2026-10-28). Three of these involve other people SEEING, which the
     corpus otherwise never requires. They are QUESTIONS, not acts — the standing
     exclusion on a third person as an INVOLVED act still stands, and every card
     here is covered by a Limits veto (`voyeur` · `exhib` · `cuck`) so a hard no
     removes it before it is ever dealt. A question you can refuse to be asked is
     not the same as an act performed on you. */
  { t:4, q:'What is one sexual act you want that you feel you are not allowed to want?' },
  { t:4, q:'Would you let someone watch us have sex?' },
  { t:4, q:'If faces were never shown, would you consider posting a film online?' },
  { t:4, q:'Would you want to be told what to do in front of someone else, or only when it is just us?' },
  { t:4, q:'What would you let me do to you if I did not ask first?' },
  { t:4, q:'If there were no consequences and nobody would ever know, what would you ask me for?' },
  { t:4, q:'What is something you want done to you that you would not want to explain afterwards?' },
  { t:4, q:'What do you want me to take from you, and how far does it go?' },
  { t:4, q:'If I gave you an hour and one rule, what is the rule you would keep?' },
  { t:4, q:'What is the one thing you have never said out loud that you would say now?' },

  /* ═══════════ v1.3.6 ADDITIONS — costumes and toys ═══════════
     Tier is on every line; order inside the array does not matter, the pool
     reads `c.tier`. ⛔ Still no oral–genital contact, no anal, no third person as
     an involved act, nothing that needs a scenario invented from nothing. */
  { t:1, q:'What is something of mine you want to wear with nothing else?' },
  { t:2, q:'What do you want me to wear tonight?' },
  { t:3, q:'What do you want to see me in, and what do you want to do about it?' },
  { t:4, q:'What are you hoping I will ask you to put on?' },
  { t:4, q:'What is something you want me to put on you, and then take off you?' },
  { t:4, q:'What is a toy you want me to use on you that you have never asked for?' },
  { t:4, q:'Would you want to be tied and used with a toy without being asked first?' },
  { t:4, q:'Would you want to beg for it out loud while it is happening?' },
];

/* Every dare carries `layer` when clothing comes off, so the engine can keep
   both players even. `who` is written from the HOLDER's point of view. */
const DARES = [
  /* Warming */
  { t:1, q:'Kiss your partner for thirty seconds without using your hands.', secs:30 },
  { t:1, q:'Say out loud one thing you want, in plain words.' },
  { t:1, q:'Give your partner one sincere compliment about their body. Specific, not general.' },
  { t:1, q:'Hold eye contact with your partner for twenty seconds without speaking.', secs:20 },
  { t:1, q:'Kiss your partner somewhere that is not their mouth. One kiss. You pick.' },
  { t:1, q:'Trace one line from their neck to their hand with one finger. Then stop.' },
  { t:1, q:'Tell your partner the first thing you noticed about them tonight.' },
  { t:1, q:'Hold their face in both hands and kiss them slowly for fifteen seconds.', secs:15 },
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
  { t:3, q:'Hold their wrists and use only your mouth for two minutes.', secs:120 },
  { t:3, q:'Tell them to do the thing you want, in plain words. Once.' },
  { t:3, q:'Take charge for five minutes. They do what you say.', as:'dom', secs:300 },
  { t:3, q:'Hand over the next five minutes. You do what you are told.', as:'sub', secs:300 },
  { t:3, q:'Remove one item, or tell them what you want done to you. One or the other.',     layer:{ who:'self', n:1 } },
  { t:3, q:'What is on now stays on until they say otherwise.' },

  /* ---- Inferno (2026-10-28) ----
     ⚠️ A dare that strips without a `layer` breaks the balance invariant — the
     engine can no longer keep the two of you level, and one of you ends up naked
     while the other is dressed. Every stripping dare here carries one. */
  { t:4, q:'Take them to the edge and stop. Three times. Then wait.' },
  { t:4, q:'Tell them what is coming, then make them wait a full minute. Do not touch them until it is up.', secs:60 },
  { t:4, q:'Blindfold them, then use your hands and nothing else for three minutes. They say nothing.', secs:180 },
  { t:4, q:'Spank them once — hand, belt, or something else. They do not see it coming.' },
  { t:4, q:'Put their hands above their head and use only your mouth for two minutes.', secs:120 },
  { t:4, q:'Make them watch as you touch yourself. They do not look away and they do not touch.' },
  { t:4, q:'Take charge for ten minutes and give one instruction every minute.', as:'dom', secs:600 },
  { t:4, q:'One instruction: do not move. Hold it for two minutes and one item of yours comes off.', layer:{ who:'self', n:1 }, secs:120 },
  { t:4, q:'Tell them to say out loud what they want, then give it to them.' },
  { t:4, q:'Decide what comes off them, and in what order. They do not choose.', layer:{ who:'partner', n:1 } },

  /* ═══════════ v1.3.6 ADDITIONS — costumes and toys ═══════════
     ⚠️ Cards NAME the toy (vibrator / insertable / clamp) so the right Limits veto
     matches. A card that just said "a toy" would fall through all three acts. */
  { t:1, q:'Put on one of their shirts. Nothing else. Then walk back in the room.' },
  { t:2, q:'Tell them what to put on, and wait until they have done it.' },
  { t:2, q:'Use the vibrator on them over the clothing until they tell you to stop.' },
  { t:3, q:'Give them one thing of yours to wear and nothing else. Then look at them.' },
  { t:3, q:'Use the vibrator on them for one minute, then stop. Do not explain.', secs:60 },
  { t:3, q:'Hand them a toy and tell them to use it on themselves while you watch.' },
  { t:4, q:'Bind their hands, then use your mouth everywhere except where they want it most.' },
  { t:4, q:'Tell them to choose a toy and use it on themselves while you watch and say nothing.' },
  { t:4, q:'Tie their hands above their head and use the vibrator until they ask you to stop.' },
  { t:4, q:'Put a clamp on them, then take your time with everything else first.', secs:120 },
  { t:4, q:'Dress them yourself, item by item, then take it all off again.' },

  /* ═══════════ v1.3.7 — oral and anal, BOTH DIRECTIONS ═══════════
     ⚠️ `acts` is what makes these safe. holder = the role the person drawing it
     plays; other = the role their partner plays. Each is checked against that
     person's own hard no, so one willingness never implies the other. */
  { t:3, q:'Go down on them and do not stop until they tell you to.', acts:{ holder:['oral_give'], other:['oral_receive'] } },
  { t:3, q:'Have them go down on you, and tell them when to stop.',   acts:{ holder:['oral_receive'], other:['oral_give'] } },
  { t:4, q:'Take them from behind, slowly, and do not let them move.', acts:{ holder:['anal_give'], other:['anal_receive'] } },
  { t:4, q:'Have them take you from behind and tell them exactly how.', acts:{ holder:['anal_receive'], other:['anal_give'] } },

  /* ═══════════ v1.3.8 — waking · risky · degrade ═══════════
     ⚠️ Without these the Menu gates for those themes would be inert: a gate can
     only remove a GAME card, and there were none to remove. */
  { t:2, q:'Wake them with your mouth on their neck, and do not stop when they stir.' },
  { t:3, q:'Call them something degrading, once, and watch what it does to them.' },
  { t:2, q:'Take one item off them somewhere you could be caught.' },
];

/* ═══════════════════════════════════════════════════ 4 · KINDLING (86)
 * Kissing, touching, erotic play. HIM / HER draw. Absorbs the old SYP, Strip and
 * Do It To Your Partner decks. Tiers are spiciness: Spark / Flame / Blaze /
 * Inferno — and they are EXACT, so moving up leaves the level below behind.
 * ═══════════════════════════════════════════════════════════════════════════ */
const KINDLING = [
  /* ---- Spark: clothing on, or barely disturbed ---- */
  { t:1, q:'Kiss your partner\'s neck once. Then walk away.' },
  { t:1, q:'Kiss your partner\'s neck and do not move on for at least ten seconds.', secs:10 },
  { t:1, q:'Take their earlobe between your lips, hold it, then let go.' },
  { t:1, q:'Kiss the inside of their wrist. Then turn their hand over and kiss the palm.' },
  { t:1, q:'Run your tongue once along their collarbone. Once.' },
  { t:1, q:'Kiss them behind the ear. Say nothing about it afterwards.' },
  { t:1, q:'Hold their face in both hands and kiss them slowly for fifteen seconds.', secs:15 },
  { t:1, q:'Take their bottom lip gently between your teeth and pull back.' },
  { t:1, q:'Kiss the back of their neck and let them feel you breathe there.' },
  { t:1, q:'Run your fingers through their hair and hold their head there.' },
  { t:1, q:'Kiss their chest once, over the clothing.' },
  { t:1, q:'Take their hand and put it flat on your own chest.' },
  { t:1, q:'Trace one finger slowly from their throat down to their waistband.' },
  { t:1, q:'Pull them in by the waist and hold for thirty seconds without speaking.', secs:30 },
  { t:1, q:'Kiss them once for every year you have been together.' },
  { t:1, q:'Look at them for ten seconds without saying anything. Do not explain why.', secs:10 },
  { t:1, q:'Take their hand and hold it. Say nothing for a full minute.', secs:60 },
  { t:1, q:'Tell them one thing about their body you love. Specific about where or what.' },
  { t:1, q:'Tell them one thing you want them to take off. Just say it.' },
  { t:1, q:'Kiss them once, properly, then tell them why.' },
  { t:1, q:'Take their hand and put it somewhere you want it. Say nothing.' },
  /* ⭐ THE CARD MUST SAY WHO (2026-10-28: "both close eyes and one of you touch
     the other. Card needs to designate who."). "One of you" is not a card — it
     is a negotiation with no owner, and both people wait for the other. The
     holder is now the toucher, explicitly. */
  { t:1, q:'Both close your eyes. You reach out and touch them once, then stop.', secs:20 },
  { t:1, q:'Both close your eyes and wait. They will touch you once, then stop.', secs:20 },
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
  { t:3, q:'Hold their wrists and use only your mouth for two minutes.', secs:120 },
  { t:3, q:'Take off everything on your top half and let them look as long as they like.' },
  { t:3, q:'Take off one item for every instruction they give you.' },
  { t:3, q:'Give them one instruction about what to remove. You cannot take it back.' },
  { t:3, q:'Both remove one item. You each decide what the other loses.',   as:'any' },
  { t:3, q:'Remove one item — and they decide where you are kissed next.' },
  { t:3, q:'Give them one instruction and wait as long as it takes.' },
  { t:3, q:'Blindfold them with something soft, then do nothing at all for thirty seconds.', secs:30 },
  { t:3, q:'Tell them no, once — then make them wait for it.' },
  { t:3, q:'Tell them to do the thing you want, in plain words. Once.' },
  { t:3, q:'Take charge for five minutes. They do what you say.',            as:'dom', secs:300 },
  { t:3, q:'Hand over the next five minutes. You do what you are told.',     as:'sub', secs:300 },
  { t:3, q:'Put their hand where you want it, and tell them not to move it.', as:'dom' },
  { t:3, q:'Tell them one thing they do that you want more of tonight — and make them do it.' },
  /* ⭐ WHO DECIDES (2026-10-28). "One of you decides how the next hour goes" had
     no owner — two people waiting to see if the other will take it. The holder
     now decides, and it is a DOM-perspective card so it does not land on someone
     who will not take it. */
  { t:3, q:'Decide how the next hour goes. They do not negotiate.',           as:'dom' },
  { t:3, q:'Remove one item, or tell them what you want done to you. One or the other.' },
  { t:3, q:'What is on now stays on until they say otherwise.',              as:'sub' },
  { t:3, q:'Be told what comes off next, and in what order.',                 as:'sub' },
  { t:3, q:'Choose what comes off them, and in what order.',                  as:'dom' },

  /* ---- Inferno (2026-10-28) ---- */
  { t:4, q:'Kiss down their stomach and stop at the waistband. Do not go further.' },
  { t:4, q:'Put their hands above their head and use only your mouth for two minutes.', secs:120 },
  { t:4, q:'Blindfold them and spend three minutes on their chest and stomach. Nowhere else.', secs:180 },
  { t:4, q:'Take them to the edge and stop. Then start again. Do not let them finish.' },
  { t:4, q:'Spank them once, with whatever you choose. They do not see it coming.' },
  { t:4, q:'Sit them down, take off what you choose, and let them watch without touching.' },
  { t:4, q:'Tell them exactly what you are going to do, then do only the first thing.' },
  { t:4, q:'Take charge for five minutes. Every instruction is a single word.', secs:300 },
  { t:4, q:'Make them ask for it out loud before you do anything.' },
  { t:4, q:'Hold them still and use only your mouth until they tell you to stop.', secs:180 },

  /* ═══════════ v1.3.6 ADDITIONS — costumes and toys ═══════════
     Inferno was the thinnest level in the app at ten cards; these are mostly
     tier 4 for that reason. ⛔ Same exclusions. Cards name the toy so the veto matches. */
  { t:1, q:'Take off what you have on and put on one of their shirts. Nothing else.' },
  { t:1, q:'Put on the tank top and boxer briefs they name, and let them look.' },
  { t:2, q:'Dress them in something of yours. Choose it. Say nothing about why.' },
  { t:2, q:'Put on what they tell you to, then stand there until they say something.' },
  { t:3, q:'Have them put on your shirt and nothing else, then undo the buttons yourself.' },
  { t:3, q:'Use the vibrator on them over the clothing until they tell you to stop.' },
  { t:3, q:'Put a clamp on them, then wait. Do not take it off until they ask twice.' },
  { t:3, q:'Tell them to choose a toy. Whatever they pick is what you use.' },
  { t:4, q:'Choose what they wear, make them put it on in front of you, then take it off again.' },
  { t:4, q:'Use the vibrator on them and stop the moment they get close. Three times.' },
  { t:4, q:'Make them hold the vibrator against themselves while you watch. They stop when you say.' },
  { t:4, q:'Use the insertable toy on them, slowly, and tell them exactly what you are doing.' },
  { t:4, q:'Blindfold them, put a clamp on, and leave the room for one minute.', secs:60 },
  { t:4, q:'Bind their hands, then use your mouth everywhere except where they want it most.' },
  { t:4, q:'Hand them the toy box and tell them to choose and use one on themselves while you watch.' },
  { t:4, q:'Use the vibrator on them until they beg, then stop and leave them there.' },

  /* ═══════════ v1.3.7 — oral and anal, BOTH DIRECTIONS ═══════════ */
  { t:3, q:'Go down on them and do not come up until they say so.', acts:{ holder:['oral_give'], other:['oral_receive'] } },
  { t:3, q:'Have them go down on you and hold their head there.',    acts:{ holder:['oral_receive'], other:['oral_give'] } },
  { t:4, q:'Take them from behind, slowly, and keep them still.',    acts:{ holder:['anal_give'], other:['anal_receive'] } },
  { t:4, q:'Have them take you from behind. Say nothing.',           acts:{ holder:['anal_receive'], other:['anal_give'] } },

  /* ═══════════ v1.3.8 — waking · risky · degrade ═══════════ */
  { t:2, q:'Wake them with your hands and keep going until they are awake enough to answer.' },
  { t:2, q:'Kiss them somewhere someone could walk in. Do not stop when you hear something.' },
  { t:3, q:'Tell them what they are, in one word, and make them repeat it back.' },
];

/* ═══════════════════════════════════════════════════════════ ASSEMBLY ═══ */
/* ⭐ CONTENT-DERIVED IDS (v1.3.3, 2026-10-28).
   Ids used to come from ONE GLOBAL COUNTER (`let n = 0; ++n`), which made them
   POSITIONAL: inserting a single card renumbered every card after it, so a
   stored Menu rating silently re-pointed at a different card and a "Not for me"
   you never gave could lock out a theme you never answered. An id must not move
   when the corpus is edited. It now hashes the deck and the question text, so
   only editing THAT card's own wording changes its id — and that loses one
   rating instead of corrupting all of them.
   ⛔ NEVER reintroduce a counter here. `check.sh` fails the build if ids are
   sequential again. */
function h32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(36);
}
const _ids = new Set();
function stableId(deck, q) {
  const base = `${deck}-${h32(deck + '|' + q)}`;
  let id = base, k = 0;
  while (_ids.has(id)) id = base + String.fromCharCode(98 + k++);
  _ids.add(id);
  return id;
}

const mk = (deck, c, extra = {}) => ({
  id: stableId(deck, c.q),
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
  secs: c.secs || null,
  acts: c.acts || null,
  pair: c.pair || null,
  map: c.map || null,
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

/* ⚠️ ONE-TIME MIGRATION (v1.3.3). Translates ids written under the old
   positional scheme into their content-derived ids, so anything rated on the
   1.3.x line survives this upgrade instead of silently vanishing. Computed from
   the shipped corpus order rather than stored as a blob.
   ⛔ It is only correct for the corpus that shipped in 1.3.2. Delete it once a
   full Menu round has been played on 1.3.3. */
export const LEGACY_IDS = Object.fromEntries(
  CARDS.map((c, i) => [`${c.deck}-${String(i + 1).padStart(3, '0')}`, c.id])
);

/** Round → tier for deck 3. Rounds 1–5 warming, 6–11 heated, 12–17 edge, 18+ inferno. */
export function stageForRound(round) {
  if (round <= 5) return 1;
  if (round <= 11) return 2;
  if (round <= 17) return 3;
  return 4;
}
