/*
 * Ember - positions.js   (v1.4.0)
 *
 * THE POSITION GRAPH. 156 nodes, 426 edges. Not a list - a map.
 *
 * PROVENANCE
 *   Node set and every edge are harvested from sexinfo101.com's published
 *   taxonomy and its per-position "Transitions" block (2026-11-06). Nothing
 *   here is invented adjacency: if an edge exists, it is because that page
 *   names that position as a transition.
 *   ⛔ No prose and no imagery is copied. Each node carries a deep LINK and the
 *   app opens their page. Names are generic (Kama Sutra, 2000 yr) and the
 *   attribute tags are facts, so what is reused is a taxonomy, not a work.
 *   Credit line lives in the README. Their content stays on their server.
 *
 * WHY A GRAPH
 *   A caller position is not "hotter" than another, it is a different stage
 *   that you can reach. sexinfo101 publishes 1-8 transitions per position and
 *   they cross families and cross into oral - Cowgirl -> The Usual,
 *   Missionary -> Eagle, Spoon -> Southern Headrest. That IS the entrance
 *   ramp behaviour. Median out-degree is 3, which is where "three ways out"
 *   comes from: it is the data, not a preference.
 *
 * THE ONE THING THIS FILE ADDS: `l` (load)
 *   Their tags say who is on top, entry angle, posture and access. They have
 *   NO comfort axis, so it is derived here from four mechanisms plus depth:
 *     depth   woman-on-top 0 | neither 1 | man-on-top 2   (who sets it)
 *     support woman-lying 0 | sitting/kneeling 1 | standing/bridged 2
 *     effort  woman-active or woman-on-top, not lying -> 1
 *     abd     twisted-entry -> 1
 *     flex    folded / tucked / butterfly / oystered / facedown / stacked -> 1
 *   l 1 raw<=1 | l 2 raw<=2 | l 3 raw>=3
 *   ⚠️ This is an ORDERING, not a measurement. No units, no clinical
 *   precision. Depth control dominates because when she sets it, she stops
 *   before it hurts.
 *
 * FILTERED SET
 *   Excluded by mechanism, not taste: aerial, standing, squatting, lunging,
 *   bridged, split, inverted, froggy, -180, twisted-, planted, pressed, pulled,
 *   and the amazon / wheelbarrow / pile-driver / dancer / hanger families.
 *   190 intercourse + 61 oral  ->  156 that work on a bed.
 *
 * ⛔ NO COUNTERS. No positions-tried, no streak, no score. The moment it counts
 *   anything it becomes a checklist somebody gets graded on.
 * DIRECTIONAL ACTS
 *   `a` is per person, not a flat list: { him:[...], her:[...] }. Oral is the
 *   reason. Cunnilingus requires HIM to give and HER to receive; fellatio the
 *   reverse; 69 needs both from both. A flat list would close cunnilingus for
 *   someone who only objected to GIVING, which is the wrong answer and the exact
 *   mistake the deck's `acts:{holder,other}` map was built to avoid.
 *   A position is shared, so one person's refusal is enough to withhold it.
 *
 * ⛔ NO NAMES, NO MEDICAL REASONING. This repo is public. `l` is a number.
 */

export const SRC = 'https://sexinfo101.com/positions/';

/* raw is kept so the load rule stays auditable without recomputing it */


export const NODES = {
  '69/69': { n:'69', f:'69', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:['fellatio/twisted-usual','rodeo/rodeo','cunnilingus/south-face','69/sideways-69','rodeo/lying-rodeo','cunnilingus/southern-guillotine','fellatio/southern-headrest','cunnilingus/cradled-clam'] },
  '69/bent-69': { n:'Bent 69', f:'69', l:3, r:[1, 2, 0, 0, 0], t:['man-kneeling','woman-standing'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:['cunnilingus/bent-butler','69/sitting-69'] },
  '69/kneeling-69': { n:'Kneeling 69', f:'69', l:1, r:[1, 0, 0, 0, 0], t:['athletic','man-kneeling'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:[] },
  '69/raised-69': { n:'Raised 69', f:'69', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-sitting'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:['cunnilingus/southern-guillotine','69/sitting-69'] },
  '69/reclined-69': { n:'Reclined 69', f:'69', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:['cunnilingus/north-face','cunnilingus/northern-guillotine'] },
  '69/sideways-69': { n:'Sideways 69', f:'69', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:['69/69','cunnilingus/southern-hospitality'] },
  '69/sitting-69': { n:'Sitting 69', f:'69', l:3, r:[1, 2, 0, 0, 0], t:['man-sitting','woman-standing'], a:{him:['oral_give','oral_receive'],her:['oral_give','oral_receive']}, x:['69/69','69/raised-69','69/bent-69'] },
  'bodyguard/bodyguard': { n:'Bodyguard', f:'bodyguard', l:3, r:[1, 2, 0, 0, 0], t:['breast-access','clit-access','face-to-face','man-active','man-standing','neither-on-top','rear-entry','woman-standing'], a:{}, x:['lap-dance/lap-dance','bodyguard/kneeling-bodyguard','cunnilingus/butler','bodyguard/sitting-bodyguard','bodyguard/raised-bodyguard'] },
  'bodyguard/kneeling-bodyguard': { n:'Kneeling Bodyguard', f:'bodyguard', l:2, r:[1, 1, 0, 0, 0], t:['breast-access','clit-access','face-to-face','man-active','man-kneeling','neither-on-top','rear-entry','woman-kneeling'], a:{}, x:['doggystyle/doggy','doggystyle/facedown-doggy','groundhog/lying-groundhog','groundhog/groundhog','bodyguard/bodyguard','doggystyle/lazy-doggy'] },
  'bodyguard/raised-bodyguard': { n:'Raised Bodyguard', f:'bodyguard', l:3, r:[1, 2, 0, 0, 0], t:['athletic','clit-access','man-active','man-standing','neither-on-top','rear-entry','spanking-access','woman-squatting'], a:{}, x:['bodyguard/bodyguard','doggystyle/raised-doggy'] },
  'bodyguard/sitting-bodyguard': { n:'Sitting Bodyguard', f:'bodyguard', l:2, r:[1, 1, 0, 0, 0], t:['breast-access','man-active','man-sitting','neither-on-top','rear-entry','woman-sitting'], a:{}, x:['bodyguard/bodyguard'] },
  'bull/bull': { n:'Bull', f:'bull', l:1, r:[1, 0, 0, 0, 0], t:['clit-access','front-entry','man-sitting','neither-on-top','woman-active','woman-lying'], a:{}, x:['bull/sitting-bull','bull/downward-bull','bull/folded-bull'] },
  'bull/bulldog': { n:'Bulldog', f:'bull', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','man-sitting','rear-entry','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['doggystyle/doggy','groundhog/groundhog','groundhog/crabby-groundhog'] },
  'bull/crabby-bull': { n:'Crabby Bull', f:'bull', l:3, r:[0, 2, 1, 0, 0], t:['athletic','breast-access','front-entry','man-sitting','woman-active','woman-bridged','woman-on-top'], a:{}, x:['lotus/crabby-lotus'] },
  'bull/downward-bull': { n:'Downward Bull', f:'bull', l:3, r:[1, 2, 0, 0, 0], t:['clit-access','front-entry','man-active','man-sitting','neither-on-top','woman-bridged'], a:{}, x:['bull/bull','cunnilingus/her-oral-waterfall'] },
  'bull/folded-bull': { n:'Folded Bull', f:'bull', l:3, r:[0, 1, 1, 0, 1], t:['breast-access','clit-access','face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['bull/bull','bull/sitting-bull','cowgirl/lazy-cowgirl'] },
  'bull/sitting-bull': { n:'Sitting Bull', f:'bull', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['bull/bull','bull/folded-bull'] },
  'bumpers/bumper-battle': { n:'Bumper Battle', f:'bumpers', l:1, r:[1, 0, 0, 0, 0], t:['athletic','front-entry','man-lying','neither-on-top','woman-active','woman-lying'], a:{}, x:['bumpers/closed-bumpers','bumpers/bumper-tower'] },
  'bumpers/bumper-tower': { n:'Bumper Tower', f:'bumpers', l:1, r:[1, 0, 0, 0, 0], t:['athletic','front-entry','man-lying','neither-on-top','woman-active','woman-lying'], a:{}, x:['bumpers/bumper-battle'] },
  'bumpers/bumpers': { n:'Bumpers', f:'bumpers', l:1, r:[1, 0, 0, 0, 0], t:['clit-access','front-entry','man-lying','neither-on-top','woman-active','woman-lying'], a:{}, x:['bumpers/wrapped-bumpers'] },
  'bumpers/closed-bumpers': { n:'Closed Bumpers', f:'bumpers', l:1, r:[1, 0, 0, 0, 0], t:['front-entry','man-lying','neither-on-top','woman-active','woman-lying'], a:{}, x:['bumpers/bumper-battle'] },
  'bumpers/wrapped-bumpers': { n:'Wrapped Bumpers', f:'bumpers', l:1, r:[1, 0, 0, 0, 0], t:['front-entry','man-lying','neither-on-top','woman-active','woman-lying'], a:{}, x:['bumpers/bumpers'] },
  'butterfly/butterfly': { n:'Butterfly', f:'butterfly', l:3, r:[1, 1, 0, 0, 1], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-sitting'], a:{}, x:['butterfly/folded-butterfly','butterfly/mixed-butterfly','butterfly/crossed-butterfly'] },
  'butterfly/crossed-butterfly': { n:'Crossed Butterfly', f:'butterfly', l:3, r:[1, 1, 0, 0, 1], t:['breast-access','face-to-face','front-entry','man-active','man-kneeling','neither-on-top','spanking-access','woman-sitting'], a:{}, x:['butterfly/folded-butterfly','butterfly/butterfly','butterfly/tucked-butterfly','butterfly/mixed-butterfly'] },
  'butterfly/folded-butterfly': { n:'Folded Butterfly', f:'butterfly', l:3, r:[1, 1, 0, 0, 1], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-sitting'], a:{}, x:['butterfly/butterfly','butterfly/tucked-butterfly','butterfly/mixed-butterfly','butterfly/crossed-butterfly'] },
  'butterfly/mixed-butterfly': { n:'Mixed Butterfly', f:'butterfly', l:3, r:[1, 1, 0, 0, 1], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-sitting'], a:{}, x:['butterfly/folded-butterfly','butterfly/butterfly','butterfly/tucked-butterfly','butterfly/wrapped-butterfly','butterfly/crossed-butterfly'] },
  'butterfly/tucked-butterfly': { n:'Tucked Butterfly', f:'butterfly', l:3, r:[1, 1, 0, 0, 1], t:['clit-access','front-entry','man-active','man-kneeling','neither-on-top','spanking-access','woman-sitting'], a:{}, x:['butterfly/folded-butterfly','cunnilingus/pie-in-the-sky','butterfly/mixed-butterfly','butterfly/crossed-butterfly'] },
  'butterfly/wrapped-butterfly': { n:'Wrapped Butterfly', f:'butterfly', l:3, r:[1, 1, 0, 0, 1], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-sitting'], a:{}, x:['cunnilingus/wrapped-servant','butterfly/mixed-butterfly','saint/wrapped-saint'] },
  'cowgirl/collapsed-cowgirl': { n:'Collapsed Cowgirl', f:'cowgirl', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-lying','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['cowgirl/cowgirl','cowgirl/lying-cowgirl'] },
  'cowgirl/cowgirl': { n:'Cowgirl', f:'cowgirl', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','clit-access','front-entry','man-lying','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['cowgirl/collapsed-cowgirl','fellatio/the-usual','fellatio/twisted-usual','cunnilingus/north-face','cowgirl/lying-cowgirl','cradle/kneeling-cradle','fellatio/oral-therapy'] },
  'cowgirl/lazy-cowgirl': { n:'Lazy Cowgirl', f:'cowgirl', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','front-entry','man-lying','woman-active','woman-on-top','woman-sitting'], a:{}, x:['bull/folded-bull'] },
  'cowgirl/lunging-cowgirl': { n:'Lunging Cowgirl', f:'cowgirl', l:3, r:[0, 2, 1, 0, 0], t:['athletic','breast-access','clit-access','front-entry','man-lying','spanking-access','woman-active','woman-on-top','woman-squatting'], a:{}, x:['cowgirl/cowgirl','cowgirl/scissored-cowgirl'] },
  'cowgirl/lying-cowgirl': { n:'Lying Cowgirl', f:'cowgirl', l:1, r:[0, 0, 0, 0, 0], t:['breast-access','face-to-face','front-entry','man-lying','spanking-access','woman-active','woman-lying','woman-on-top'], a:{}, x:['cowgirl/cowgirl','cowgirl/collapsed-cowgirl'] },
  'cowgirl/scissored-cowgirl': { n:'Scissored Cowgirl', f:'cowgirl', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','clit-access','front-entry','man-lying','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['cowgirl/lunging-cowgirl','scissors/scissors'] },
  'crab/crab': { n:'Crab', f:'crab', l:3, r:[0, 2, 1, 0, 0], t:['athletic','breast-access','man-lying','rear-entry','woman-active','woman-bridged','woman-on-top'], a:{}, x:['rodeo/rodeo','crab/tilted-crab'] },
  'crab/tilted-crab': { n:'Tilted Crab', f:'crab', l:3, r:[0, 2, 1, 1, 0], t:['breast-access','man-lying','rear-entry','twisted-entry','woman-active','woman-bridged','woman-on-top'], a:{}, x:['crab/crab'] },
  'cradle/crabby-cradle': { n:'Crabby Cradle', f:'cradle', l:3, r:[0, 2, 1, 0, 0], t:['athletic','front-entry','man-sitting','woman-active','woman-bridged','woman-on-top'], a:{}, x:['cradle/cradle','lotus/crabby-lotus'] },
  'cradle/cradle': { n:'Cradle', f:'cradle', l:2, r:[0, 1, 1, 0, 0], t:['face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['cradle/kneeling-cradle','cradle/folded-cradle','cradle/crabby-cradle'] },
  'cradle/folded-cradle': { n:'Folded Cradle', f:'cradle', l:3, r:[0, 1, 1, 0, 1], t:['athletic','face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['cradle/cradle','cradle/lazy-cradle','cradle/mixed-cradle'] },
  'cradle/kneeling-cradle': { n:'Kneeling Cradle', f:'cradle', l:2, r:[0, 1, 1, 0, 0], t:['face-to-face','front-entry','man-sitting','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['cowgirl/cowgirl','cradle/cradle','lotus/kneeling-lotus'] },
  'cradle/lazy-cradle': { n:'Lazy Cradle', f:'cradle', l:2, r:[0, 1, 1, 0, 0], t:['athletic','face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['cradle/wrapped-cradle','cradle/folded-cradle'] },
  'cradle/mixed-cradle': { n:'Mixed Cradle', f:'cradle', l:2, r:[0, 1, 1, 0, 0], t:['face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['cradle/folded-cradle'] },
  'cradle/wrapped-cradle': { n:'Wrapped Cradle', f:'cradle', l:2, r:[0, 1, 1, 0, 0], t:['face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['cradle/lazy-cradle'] },
  'cunnilingus/bent-butler': { n:'Bent Butler', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-kneeling','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/leaning-butler','69/bent-69'] },
  'cunnilingus/butler': { n:'Butler', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-kneeling','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/drive-thru','bodyguard/bodyguard','cunnilingus/leaning-butler'] },
  'cunnilingus/cradled-clam': { n:'Cradled Clam', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['69/69','cunnilingus/north-face','cunnilingus/northern-guillotine'] },
  'cunnilingus/drive-thru': { n:'Drive Thru', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-kneeling','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/under-the-sink','cunnilingus/butler','saint/kneeling-saint','saint/saint'] },
  'cunnilingus/eagle': { n:'Eagle', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['missionary/missionary','cunnilingus/wrapped-eagle','guard/guard','cunnilingus/grounded-feedbag','cunnilingus/folded-eagle','cunnilingus/northern-hospitality'] },
  'cunnilingus/feedbag': { n:'Feedbag', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-kneeling','woman-bridged'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/wrapped-eagle','cunnilingus/grounded-feedbag','cunnilingus/pie-in-the-sky','cunnilingus/her-oral-waterfall'] },
  'cunnilingus/folded-eagle': { n:'Folded Eagle', f:'cunnilingus', l:2, r:[1, 0, 0, 0, 1], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/eagle','missionary/folded-missionary','cunnilingus/wrapped-eagle','guard/folded-guard','cunnilingus/pie-in-the-sky'] },
  'cunnilingus/folded-servant': { n:'Folded Servant', f:'cunnilingus', l:3, r:[1, 1, 0, 0, 1], t:['man-kneeling','woman-sitting'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/servant','cunnilingus/wrapped-servant','cunnilingus/mixed-servant'] },
  'cunnilingus/grounded-feedbag': { n:'Grounded Feedbag', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/eagle','guard/arched-guard','cunnilingus/feedbag'] },
  'cunnilingus/her-oral-waterfall': { n:'Her Oral Waterfall', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-sitting','woman-bridged'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/feedbag','bull/downward-bull','cunnilingus/kneeling-feedbag'] },
  'cunnilingus/kneeling-feedbag': { n:'Kneeling Feedbag', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['athletic','man-kneeling'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/her-oral-waterfall'] },
  'cunnilingus/leaning-butler': { n:'Leaning Butler', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-kneeling','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/butler','cunnilingus/bent-butler'] },
  'cunnilingus/lying-butler': { n:'Lying Butler', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['groundhog/open-groundhog'] },
  'cunnilingus/mixed-servant': { n:'Mixed Servant', f:'cunnilingus', l:2, r:[1, 1, 0, 0, 0], t:['man-kneeling','woman-sitting'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/servant','cunnilingus/wrapped-servant','cunnilingus/folded-servant'] },
  'cunnilingus/north-face': { n:'North Face', f:'cunnilingus', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_give'],her:['oral_receive']}, x:['cowgirl/cowgirl','cunnilingus/south-face','cunnilingus/cradled-clam','69/reclined-69'] },
  'cunnilingus/northern-guillotine': { n:'Northern Guillotine', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-lying','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/southern-guillotine','cunnilingus/cradled-clam','69/reclined-69'] },
  'cunnilingus/northern-hospitality': { n:'Northern Hospitality', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/eagle'] },
  'cunnilingus/pie-in-the-sky': { n:'Pie in the Sky', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-kneeling','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['guard/folded-guard','cunnilingus/folded-eagle','cunnilingus/feedbag','butterfly/tucked-butterfly'] },
  'cunnilingus/servant': { n:'Servant', f:'cunnilingus', l:2, r:[1, 1, 0, 0, 0], t:['man-kneeling','woman-sitting'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/wrapped-servant','cunnilingus/mixed-servant','cunnilingus/folded-servant'] },
  'cunnilingus/south-face': { n:'South Face', f:'cunnilingus', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_give'],her:['oral_receive']}, x:['69/69','cunnilingus/north-face','cunnilingus/southern-guillotine'] },
  'cunnilingus/southern-guillotine': { n:'Southern Guillotine', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-lying','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['69/69','rodeo/rodeo','cunnilingus/south-face','cunnilingus/northern-guillotine','69/raised-69'] },
  'cunnilingus/southern-hospitality': { n:'Southern Hospitality', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['69/sideways-69'] },
  'cunnilingus/under-the-sink': { n:'Under the Sink', f:'cunnilingus', l:3, r:[1, 2, 0, 0, 0], t:['man-sitting','woman-standing'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/drive-thru'] },
  'cunnilingus/wrapped-eagle': { n:'Wrapped Eagle', f:'cunnilingus', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/eagle','missionary/wrapped-missionary','cunnilingus/folded-eagle','cunnilingus/feedbag','guard/wrapped-guard'] },
  'cunnilingus/wrapped-servant': { n:'Wrapped Servant', f:'cunnilingus', l:2, r:[1, 1, 0, 0, 0], t:['man-kneeling','woman-sitting'], a:{him:['oral_give'],her:['oral_receive']}, x:['cunnilingus/servant','cunnilingus/mixed-servant','butterfly/wrapped-butterfly','cunnilingus/folded-servant'] },
  'doggystyle/closed-doggy': { n:'Closed Doggy', f:'doggystyle', l:2, r:[1, 1, 0, 0, 0], t:['man-active','man-kneeling','neither-on-top','rear-entry','spanking-access','woman-kneeling'], a:{}, x:['doggystyle/doggy','groundhog/lying-groundhog'] },
  'doggystyle/doggy': { n:'Doggy', f:'doggystyle', l:2, r:[1, 1, 0, 0, 0], t:['man-active','man-kneeling','neither-on-top','rear-entry','spanking-access','woman-kneeling'], a:{}, x:['doggystyle/facedown-doggy','doggystyle/closed-doggy','doggystyle/lazy-doggy','bodyguard/kneeling-bodyguard','bull/bulldog'] },
  'doggystyle/downward-doggy': { n:'Downward Doggy', f:'doggystyle', l:3, r:[1, 2, 0, 0, 0], t:['man-active','man-standing','neither-on-top','rear-entry','spanking-access','woman-standing'], a:{}, x:['doggystyle/restrained-doggy'] },
  'doggystyle/facedown-doggy': { n:'Facedown Doggy', f:'doggystyle', l:3, r:[1, 1, 0, 0, 1], t:['clit-access','man-active','man-kneeling','neither-on-top','rear-entry','spanking-access','woman-kneeling'], a:{}, x:['doggystyle/doggy','groundhog/open-groundhog','bodyguard/kneeling-bodyguard'] },
  'doggystyle/lazy-doggy': { n:'Lazy Doggy', f:'doggystyle', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','man-kneeling','rear-entry','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['doggystyle/doggy','bodyguard/kneeling-bodyguard'] },
  'doggystyle/raised-doggy': { n:'Raised Doggy', f:'doggystyle', l:2, r:[1, 1, 0, 0, 0], t:['man-active','man-standing','neither-on-top','rear-entry','spanking-access','woman-kneeling'], a:{}, x:['bodyguard/raised-bodyguard'] },
  'doggystyle/restrained-doggy': { n:'Restrained Doggy', f:'doggystyle', l:3, r:[1, 2, 0, 0, 0], t:['man-active','man-standing','neither-on-top','rear-entry','spanking-access','woman-standing'], a:{him:['restraint'],her:['restraint']}, x:['doggystyle/downward-doggy'] },
  'fellatio/cradled-cock': { n:'Cradled Cock', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/north-pole'] },
  'fellatio/fuck-face': { n:'Fuck Face', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-kneeling','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/stand-and-blow'] },
  'fellatio/games-on': { n:'Game\'s On', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-sitting','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/sit-and-blow'] },
  'fellatio/his-oral-waterfall': { n:'His Oral Waterfall', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-bridged','woman-sitting'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/open-usual'] },
  'fellatio/jack-hammer': { n:'Jack Hammer', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-standing','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/stand-and-blow'] },
  'fellatio/north-pole': { n:'North Pole', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-kneeling','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/plumber','missionary/kneeling-missionary','missionary/upright-missionary','fellatio/cradled-cock'] },
  'fellatio/open-usual': { n:'Open Usual', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/the-usual','fellatio/southern-exposure','fellatio/his-oral-waterfall'] },
  'fellatio/oral-therapy': { n:'Oral Therapy', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['cowgirl/cowgirl','rodeo/rodeo'] },
  'fellatio/plumber': { n:'Plumber', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-kneeling','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['missionary/closed-missionary','fellatio/north-pole','missionary/upright-missionary'] },
  'fellatio/road-head': { n:'Road Head', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-sitting','woman-sitting'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/sit-and-blow','lap-dance/lap-dance'] },
  'fellatio/sit-and-blow': { n:'Sit &amp; Blow', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-sitting','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/the-usual','fellatio/stand-and-blow','fellatio/road-head','lap-dance/lap-dance','fellatio/games-on'] },
  'fellatio/southern-exposure': { n:'Southern Exposure', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/open-usual'] },
  'fellatio/southern-headrest': { n:'Southern Headrest', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-lying','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['69/69','spoons/spoon','fellatio/twisted-usual'] },
  'fellatio/stand-and-blow': { n:'Stand &amp; Blow', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-standing','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/sit-and-blow','fellatio/fuck-face','fellatio/jack-hammer'] },
  'fellatio/sword-swallower': { n:'Sword Swallower', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-standing','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/tea-bag'] },
  'fellatio/tea-bag': { n:'Tea Bag', f:'fellatio', l:1, r:[1, 0, 0, 0, 0], t:['man-standing','woman-lying'], a:{him:['oral_receive'],her:['oral_give']}, x:['fellatio/sword-swallower'] },
  'fellatio/the-usual': { n:'The Usual', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['cowgirl/cowgirl','fellatio/twisted-usual','fellatio/open-usual','fellatio/sit-and-blow'] },
  'fellatio/twisted-usual': { n:'Twisted Usual', f:'fellatio', l:2, r:[1, 1, 0, 0, 0], t:['man-lying','woman-kneeling'], a:{him:['oral_receive'],her:['oral_give']}, x:['cowgirl/cowgirl','fellatio/the-usual','69/69','rodeo/rodeo','fellatio/southern-headrest'] },
  'groundhog/crabby-groundhog': { n:'Crabby Groundhog', f:'groundhog', l:2, r:[2, 0, 0, 0, 0], t:['athletic','man-active','man-bridged','man-on-top','rear-entry','woman-lying'], a:{}, x:['bull/bulldog'] },
  'groundhog/groundhog': { n:'Groundhog', f:'groundhog', l:2, r:[2, 0, 0, 0, 0], t:['man-active','man-kneeling','man-on-top','rear-entry','woman-lying'], a:{}, x:['groundhog/mounted-groundhog','bodyguard/kneeling-bodyguard','groundhog/snared-groundhog','missionary/upright-missionary','bull/bulldog'] },
  'groundhog/lying-groundhog': { n:'Lying Groundhog', f:'groundhog', l:2, r:[2, 0, 0, 0, 0], t:['breast-access','man-active','man-lying','man-on-top','rear-entry','woman-lying'], a:{}, x:['spoons/spoon','doggystyle/closed-doggy','groundhog/mounted-groundhog','bodyguard/kneeling-bodyguard'] },
  'groundhog/mounted-groundhog': { n:'Mounted Groundhog', f:'groundhog', l:2, r:[2, 0, 0, 0, 0], t:['breast-access','man-active','man-kneeling','man-on-top','rear-entry','woman-lying'], a:{}, x:['groundhog/lying-groundhog','groundhog/open-groundhog','groundhog/groundhog'] },
  'groundhog/open-groundhog': { n:'Open Groundhog', f:'groundhog', l:2, r:[2, 0, 0, 0, 0], t:['breast-access','man-active','man-lying','man-on-top','rear-entry','woman-lying'], a:{}, x:['doggystyle/facedown-doggy','groundhog/mounted-groundhog','cunnilingus/lying-butler'] },
  'groundhog/snared-groundhog': { n:'Snared Groundhog', f:'groundhog', l:2, r:[2, 0, 0, 0, 0], t:['man-active','man-kneeling','man-on-top','rear-entry','woman-lying'], a:{}, x:['groundhog/groundhog'] },
  'guard/arched-guard': { n:'Arched Guard', f:'guard', l:1, r:[1, 0, 0, 0, 0], t:['front-entry','man-active','man-kneeling','neither-on-top','woman-lying'], a:{}, x:['guard/guard','cunnilingus/grounded-feedbag'] },
  'guard/folded-guard': { n:'Folded Guard', f:'guard', l:2, r:[1, 0, 0, 0, 1], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-lying'], a:{}, x:['cunnilingus/folded-eagle','guard/mixed-guard','cunnilingus/pie-in-the-sky','saint/folded-saint'] },
  'guard/guard': { n:'Guard', f:'guard', l:1, r:[1, 0, 0, 0, 0], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-lying'], a:{}, x:['missionary/missionary','cunnilingus/eagle','guard/arched-guard','guard/wrapped-guard','guard/mixed-guard'] },
  'guard/mixed-guard': { n:'Mixed Guard', f:'guard', l:1, r:[1, 0, 0, 0, 0], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-lying'], a:{}, x:['guard/guard','guard/folded-guard','guard/wrapped-guard'] },
  'guard/tilted-guard': { n:'Tilted Guard', f:'guard', l:1, r:[1, 0, 0, 0, 0], t:['front-entry','man-active','man-kneeling','neither-on-top','woman-lying'], a:{}, x:[] },
  'guard/wrapped-guard': { n:'Wrapped Guard', f:'guard', l:1, r:[1, 0, 0, 0, 0], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','neither-on-top','woman-lying'], a:{}, x:['cunnilingus/wrapped-eagle','guard/guard','guard/mixed-guard'] },
  'lap-dance/kneeling-lap-dance': { n:'Kneeling Lap Dance', f:'lap-dance', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','clit-access','man-sitting','rear-entry','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['lap-dance/lap-dance','lap-dance/open-lap-dance'] },
  'lap-dance/lap-dance': { n:'Lap Dance', f:'lap-dance', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','man-sitting','rear-entry','woman-active','woman-on-top','woman-sitting'], a:{}, x:['fellatio/sit-and-blow','fellatio/road-head','bodyguard/bodyguard','lap-dance/kneeling-lap-dance','lap-dance/tilted-lap-dance'] },
  'lap-dance/open-lap-dance': { n:'Open Lap Dance', f:'lap-dance', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','clit-access','man-sitting','rear-entry','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lap-dance/kneeling-lap-dance'] },
  'lap-dance/tilted-lap-dance': { n:'Tilted Lap Dance', f:'lap-dance', l:3, r:[0, 1, 1, 1, 0], t:['breast-access','clit-access','man-sitting','rear-entry','twisted-entry','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lap-dance/lap-dance'] },
  'lotus/crabby-lotus': { n:'Crabby Lotus', f:'lotus', l:3, r:[0, 2, 1, 0, 0], t:['athletic','breast-access','clit-access','front-entry','man-sitting','woman-active','woman-bridged','woman-on-top'], a:{}, x:['lotus/lotus','bull/crabby-bull','cradle/crabby-cradle'] },
  'lotus/folded-lotus': { n:'Folded Lotus', f:'lotus', l:3, r:[0, 1, 1, 0, 1], t:['face-to-face','front-entry','man-sitting','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lotus/lazy-lotus'] },
  'lotus/kneeling-lotus': { n:'Kneeling Lotus', f:'lotus', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-sitting','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['cradle/kneeling-cradle','lotus/lotus','lotus/mixed-lotus'] },
  'lotus/lazy-lotus': { n:'Lazy Lotus', f:'lotus', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-sitting','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lotus/lotus','lotus/wrapped-lotus','lotus/mixed-lotus','lotus/folded-lotus'] },
  'lotus/lotus': { n:'Lotus', f:'lotus', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-sitting','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lotus/kneeling-lotus','lotus/lazy-lotus','lotus/mixed-lotus','lotus/crabby-lotus'] },
  'lotus/mixed-lotus': { n:'Mixed Lotus', f:'lotus', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-sitting','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lotus/lotus','lotus/wrapped-lotus','lotus/kneeling-lotus','lotus/lazy-lotus'] },
  'lotus/wrapped-lotus': { n:'Wrapped Lotus', f:'lotus', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-sitting','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['lotus/lazy-lotus','lotus/mixed-lotus'] },
  'missionary/closed-missionary': { n:'Closed Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['missionary/missionary','fellatio/plumber','missionary/kneeling-missionary','missionary/upright-missionary'] },
  'missionary/folded-missionary': { n:'Folded Missionary', f:'missionary', l:3, r:[2, 0, 0, 0, 1], t:['face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['missionary/mixed-missionary','cunnilingus/folded-eagle','missionary/oystered-missionary'] },
  'missionary/kneeling-missionary': { n:'Kneeling Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['face-to-face','front-entry','man-active','man-kneeling','man-on-top','woman-lying'], a:{}, x:['missionary/closed-missionary','fellatio/north-pole','missionary/upright-missionary'] },
  'missionary/missionary': { n:'Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['clit-access','face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['cunnilingus/eagle','missionary/open-missionary','missionary/tucked-missionary','guard/guard','missionary/closed-missionary','missionary/tilted-missionary','scissors/kneeling-scissors'] },
  'missionary/mixed-missionary': { n:'Mixed Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['clit-access','face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['missionary/folded-missionary'] },
  'missionary/open-missionary': { n:'Open Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['clit-access','face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['missionary/missionary','missionary/tucked-missionary','missionary/wrapped-missionary'] },
  'missionary/oystered-missionary': { n:'Oystered Missionary', f:'missionary', l:1, r:[0, 0, 0, 0, 1], t:['clit-access','face-to-face','front-entry','man-active','man-lying','woman-lying','woman-on-top'], a:{}, x:['missionary/folded-missionary'] },
  'missionary/tilted-missionary': { n:'Tilted Missionary', f:'missionary', l:3, r:[2, 0, 0, 1, 0], t:['front-entry','man-active','man-lying','man-on-top','twisted-entry','woman-lying'], a:{}, x:['missionary/missionary'] },
  'missionary/tucked-missionary': { n:'Tucked Missionary', f:'missionary', l:3, r:[2, 0, 0, 0, 1], t:['clit-access','face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['missionary/missionary','missionary/open-missionary'] },
  'missionary/upright-missionary': { n:'Upright Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['breast-access','front-entry','man-active','man-kneeling','man-on-top','woman-lying'], a:{}, x:['groundhog/groundhog','fellatio/plumber','missionary/closed-missionary','fellatio/north-pole','missionary/kneeling-missionary'] },
  'missionary/wrapped-missionary': { n:'Wrapped Missionary', f:'missionary', l:2, r:[2, 0, 0, 0, 0], t:['clit-access','face-to-face','front-entry','man-active','man-lying','man-on-top','woman-lying'], a:{}, x:['missionary/open-missionary','cunnilingus/wrapped-eagle','saint/wrapped-saint'] },
  'rodeo/lazy-rodeo': { n:'Lazy Rodeo', f:'rodeo', l:2, r:[0, 1, 1, 0, 0], t:['clit-access','man-lying','rear-entry','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['sinner/sinner','rodeo/open-rodeo','sinner/tilted-sinner'] },
  'rodeo/lying-rodeo': { n:'Lying Rodeo', f:'rodeo', l:1, r:[0, 0, 0, 0, 0], t:['man-lying','rear-entry','spanking-access','woman-active','woman-lying','woman-on-top'], a:{}, x:['69/69','rodeo/rodeo'] },
  'rodeo/open-rodeo': { n:'Open Rodeo', f:'rodeo', l:2, r:[0, 1, 1, 0, 0], t:['man-lying','rear-entry','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['rodeo/lazy-rodeo'] },
  'rodeo/rodeo': { n:'Rodeo', f:'rodeo', l:2, r:[0, 1, 1, 0, 0], t:['clit-access','man-lying','rear-entry','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['69/69','fellatio/twisted-usual','fellatio/oral-therapy','rodeo/lying-rodeo','crab/crab','cunnilingus/southern-guillotine','sinner/kneeling-sinner'] },
  'saint/crabby-saint': { n:'Crabby Saint', f:'saint', l:3, r:[0, 2, 1, 0, 0], t:['athletic','breast-access','clit-access','front-entry','man-kneeling','woman-active','woman-bridged','woman-on-top'], a:{}, x:['saint/kneeling-saint','saint/lazy-saint','saint/folded-saint'] },
  'saint/folded-saint': { n:'Folded Saint', f:'saint', l:3, r:[0, 1, 1, 0, 1], t:['face-to-face','front-entry','man-kneeling','woman-active','woman-on-top','woman-sitting'], a:{}, x:['guard/folded-guard','saint/saint','saint/mixed-saint','saint/crabby-saint'] },
  'saint/kneeling-saint': { n:'Kneeling Saint', f:'saint', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-kneeling','spanking-access','woman-active','woman-kneeling','woman-on-top'], a:{}, x:['cunnilingus/drive-thru','saint/saint','saint/crabby-saint'] },
  'saint/lazy-saint': { n:'Lazy Saint', f:'saint', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-kneeling','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['saint/saint','saint/mixed-saint','saint/wrapped-saint','saint/crabby-saint'] },
  'saint/mixed-saint': { n:'Mixed Saint', f:'saint', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-kneeling','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['saint/lazy-saint','saint/folded-saint'] },
  'saint/saint': { n:'Saint', f:'saint', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-kneeling','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['cunnilingus/drive-thru','saint/kneeling-saint','saint/lazy-saint','saint/folded-saint'] },
  'saint/wrapped-saint': { n:'Wrapped Saint', f:'saint', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','face-to-face','front-entry','man-kneeling','spanking-access','woman-active','woman-on-top','woman-sitting'], a:{}, x:['missionary/wrapped-missionary','butterfly/wrapped-butterfly','saint/lazy-saint'] },
  'scissors/crabby-scissors': { n:'Crabby Scissors', f:'scissors', l:2, r:[1, 0, 0, 1, 0], t:['athletic','clit-access','man-active','man-bridged','neither-on-top','twisted-entry','woman-lying'], a:{}, x:['scissors/scissored-flagpole','scissors/kneeling-scissors','scissors/sitting-scissors'] },
  'scissors/kneeling-scissors': { n:'Kneeling Scissors', f:'scissors', l:3, r:[2, 0, 0, 1, 0], t:['breast-access','clit-access','front-entry','man-active','man-kneeling','man-on-top','twisted-entry','woman-lying'], a:{}, x:['missionary/missionary','scissors/scissored-flagpole','scissors/crabby-scissors'] },
  'scissors/scissored-flagpole': { n:'Scissored Flagpole', f:'scissors', l:3, r:[2, 0, 0, 1, 0], t:['breast-access','man-active','man-kneeling','man-on-top','twisted-entry','woman-lying'], a:{}, x:['scissors/kneeling-scissors','scissors/sitting-scissors','scissors/crabby-scissors'] },
  'scissors/scissors': { n:'Scissors', f:'scissors', l:2, r:[1, 0, 0, 1, 0], t:['clit-access','man-active','man-lying','neither-on-top','twisted-entry','woman-lying'], a:{}, x:['cowgirl/scissored-cowgirl','scissors/wrapped-scissors'] },
  'scissors/sitting-scissors': { n:'Sitting Scissors', f:'scissors', l:2, r:[1, 0, 0, 1, 0], t:['man-active','man-sitting','neither-on-top','twisted-entry','woman-lying'], a:{}, x:['scissors/scissored-flagpole','scissors/crabby-scissors'] },
  'scissors/wrapped-scissors': { n:'Wrapped Scissors', f:'scissors', l:2, r:[1, 0, 0, 1, 0], t:['clit-access','man-active','man-lying','neither-on-top','twisted-entry','woman-lying'], a:{}, x:['scissors/scissors'] },
  'sinner/closed-sinner': { n:'Closed Sinner', f:'sinner', l:1, r:[0, 0, 0, 0, 0], t:['face-to-face','man-active','man-lying','rear-entry','woman-lying','woman-on-top'], a:{}, x:['sinner/tilted-sinner'] },
  'sinner/folded-sinner': { n:'Folded Sinner', f:'sinner', l:1, r:[0, 0, 0, 0, 1], t:['breast-access','face-to-face','man-active','man-lying','rear-entry','spanking-access','woman-lying','woman-on-top'], a:{}, x:['sinner/tilted-sinner','sinner/tucked-sinner'] },
  'sinner/kneeling-sinner': { n:'Kneeling Sinner', f:'sinner', l:2, r:[0, 1, 1, 0, 0], t:['breast-access','clit-access','face-to-face','man-active','man-lying','rear-entry','woman-kneeling','woman-on-top'], a:{}, x:['rodeo/rodeo','sinner/sinner'] },
  'sinner/sinner': { n:'Sinner', f:'sinner', l:1, r:[0, 0, 0, 0, 0], t:['breast-access','clit-access','face-to-face','man-active','man-lying','rear-entry','woman-lying','woman-on-top'], a:{}, x:['spoons/spoon','sinner/kneeling-sinner','rodeo/lazy-rodeo','sinner/wrapped-sinner','sinner/tilted-sinner'] },
  'sinner/tilted-sinner': { n:'Tilted Sinner', f:'sinner', l:1, r:[0, 0, 0, 0, 0], t:['breast-access','clit-access','face-to-face','man-active','man-lying','rear-entry','woman-lying','woman-on-top'], a:{}, x:['spoons/spoon','sinner/sinner','sinner/closed-sinner','rodeo/lazy-rodeo','sinner/folded-sinner'] },
  'sinner/tucked-sinner': { n:'Tucked Sinner', f:'sinner', l:1, r:[0, 0, 0, 0, 1], t:['breast-access','clit-access','face-to-face','man-active','man-lying','rear-entry','spanking-access','woman-lying','woman-on-top'], a:{}, x:['sinner/wrapped-sinner','sinner/folded-sinner'] },
  'sinner/wrapped-sinner': { n:'Wrapped Sinner', f:'sinner', l:1, r:[0, 0, 0, 0, 0], t:['breast-access','clit-access','face-to-face','man-active','man-lying','rear-entry','woman-lying','woman-on-top'], a:{}, x:['spoons/wrapped-spoon','sinner/sinner','sinner/tucked-sinner'] },
  'spoons/bent-spoon': { n:'Bent Spoon', f:'spoons', l:1, r:[1, 0, 0, 0, 0], t:['breast-access','clit-access','man-active','man-lying','neither-on-top','rear-entry','spanking-access','woman-lying'], a:{}, x:['spoons/spoon','spoons/crossed-spoon','spoons/bipolar-spoon'] },
  'spoons/bipolar-spoon': { n:'Bipolar Spoon', f:'spoons', l:1, r:[1, 0, 0, 0, 0], t:['clit-access','man-active','man-lying','neither-on-top','rear-entry','woman-lying'], a:{}, x:['spoons/bent-spoon','spoons/crossed-spoon'] },
  'spoons/crossed-spoon': { n:'Crossed Spoon', f:'spoons', l:2, r:[1, 0, 0, 1, 0], t:['breast-access','clit-access','man-active','man-lying','neither-on-top','twisted-entry','woman-lying'], a:{}, x:['spoons/bent-spoon','spoons/bipolar-spoon'] },
  'spoons/spoon': { n:'Spoon', f:'spoons', l:1, r:[1, 0, 0, 0, 0], t:['breast-access','clit-access','man-active','man-lying','neither-on-top','rear-entry','woman-lying'], a:{}, x:['groundhog/lying-groundhog','spoons/wrapped-spoon','spoons/bent-spoon','sinner/sinner','fellatio/southern-headrest','sinner/tilted-sinner'] },
  'spoons/wrapped-spoon': { n:'Wrapped Spoon', f:'spoons', l:1, r:[1, 0, 0, 0, 0], t:['breast-access','clit-access','man-active','man-lying','neither-on-top','rear-entry','woman-lying'], a:{}, x:['spoons/spoon','sinner/wrapped-sinner'] }
};

/* Entry points: strongest inbound degree at load<=2, one per family.
   The map has no start, so it needs a door. These are the hinges. */
export const STARTERS = [
  '69/69','cowgirl/cowgirl','missionary/missionary','rodeo/rodeo','spoons/spoon','bodyguard/kneeling-bodyguard','cunnilingus/eagle','doggystyle/doggy','groundhog/groundhog'
];

export const COUNT = Object.keys(NODES).length;
export const EDGE_COUNT = Object.values(NODES).reduce((a, n) => a + n.x.length, 0);

export const node = id => NODES[id] || null;
export const urlOf = id => SRC + id;
export const nameOf = id => (NODES[id] ? NODES[id].n : id);

/* shared-tag similarity, used ONLY to backfill a thin exit list.
   It never creates an edge in the data; it picks the closest neighbours. */
export function similarity(a, b) {
  const A = NODES[a], B = NODES[b];
  if (!A || !B) return 0;
  let n = 0;
  for (const t of A.t) if (B.t.includes(t)) n++;
  if (A.f === B.f) n += 2;
  return n;
}
