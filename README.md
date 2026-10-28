# Ember

A deck for two. On-device only — no accounts, no network, no analytics.

**Version:** 1.3.8 · **343 cards** · **repo:** `kclampo/ember`
**Live:** https://kclampo.github.io/ember/

---

## ⛔ Privacy — there are no names in this repository

This repo is public and every file is fetchable from the live site, so nothing
identifying is committed — not in the code, not in the comments, not here.

Names are typed on the device and stored in `localStorage` (`ember.names`). Never
sent, never cached into the service worker, never committed. Blank falls back to the
roles: **Him / Her**.

> **What v1.2.1 fixed:** v1.2.0 shipped two real first names hardcoded in `app.js`,
> the button labels and this README. Every instance is gone.
>
> **⛔ What this does not fix:** the cards themselves are still publicly readable.
> Removing the names removes the *identities*, not the *content*. Private pages need
> a private repo, and GitHub Pages from a private repo needs a paid plan.

---

## ⭐ Two tabs, and they remember differently

| Tab | Decks | Persistence |
|---|---|---|
| **Questions** | Connection · **The Menu** | **kept forever** + a Reset button |
| **Games** | Truth or Dare · Kindling | **12-hour session** + a New game button |

A connection question is **spent** the moment it is answered — re-asking it later is a
replay with a contaminated answer. A game card is **not spent**; it is as good the
tenth time. One needs memory, the other needs amnesia. Do not unify them.

**Three buttons on Questions:** **Pass** puts the question *back* in the deck (not
consumed — it can return), **Next** consumes it and deals another for the same person,
**Done** consumes it and stops. Games keep two — a game card you skip is a card you
spent.

---

## The four decks

| Deck | Tab | Cards | Tiers |
|---|---|---|---|
| **Connection** | Questions | 48 | Notice → Consider → Admit |
| **The Menu** | Questions | 74 | Familiar → Specific → Edge |
| **Truth or Dare** | Games | 109 | rounds 1–5 / 6–11 / 12–17 / 18+ |
| **Kindling** | Games | 106 | Spark → Flame → Blaze → Inferno |

### Tier labels are per-deck

There is no global "heat" scale. Connection escalates on **how hard the honest answer
is** — labeling *"what do you need from me that you've never said out loud"* as
"Hottest" would put it on the same axis as "blindfolded", which is a different axis
and sets the wrong expectation. Truth or Dare has **no picker at all**: rounds 1–5 are
Warming, 6–11 Heated, 12–17 Edge, 18+ Inferno, shown as a status line.

**⭐ Why four game levels, not three.** Blaze/Edge was doing two jobs — "hot" and *"am I
even allowed to want this"* — and one bucket cannot hold both without the middle of it
going soft. The split keeps the hot-and-sayable register at level 3 and gives the
questions that need a beat before you answer their own level.

### What lives where

- **Connection** — 100% open-ended, spoken aloud. No comparison, no sound: nothing is
  stored, so nothing can be matched. Do not "fix" this with multiple-choice cards.
- **The Menu** — selection only. Both players answer a round of ten **blind** (neither
  sees the other's answers while answering), then **everything opens**, mismatches
  included. Blind is about stopping *anchoring*, not about hiding: an answer given
  after seeing your partner's measures courtesy, not preference.
  **⭐ Its answers are permanent and they GATE the games** — see below.
- **Truth or Dare** — two buttons, the phone moves. ⭐ **The layer balance mechanic:**
  both start with the same number of items on; every strip dare names *whose* clothing
  comes off; the engine refuses any dare that would open a gap wider than 1, and
  prefers whoever is currently ahead. Some dares cost the holder. **Net: you both
  arrive at the same place at the same time, or nobody does.**
- **Kindling** — kissing, touching, erotic play. A thing to do, not a thing to say.

---

## ⭐ How The Menu gates the games

The Menu lives under **Questions** because it is about the two of you, not a game you
play — and its answers **lock in**. Each Menu card carries a `gate` (a limit-act id).
If **either** of you answers **"Hard no"** on it, that whole theme stops being dealt in
Truth or Dare and Kindling.

> **⛔ ONLY "HARD NO" GATES.** The answer list is
> `Yes · Maybe · Not for me · Ask me again later · Hard no`, and those two refusals are
> not the same thing. **"Not for me" is soft** — it is a preference that belongs to
> tonight and it changes *nothing* in the games. **"Hard no" is a limit** — it belongs
> to the deck and it removes the theme. A soft answer that silently deleted a theme
> would be the app overriding you with a mood.

It is a **persisted veto**: permanent, and driven by your answers rather than expiring
with the 12-hour session. The hard veto in Limits is also absolute; the Menu gate is
you telling the app what you don't want, once, and having it remember.

Both are enforced by the same code path, and **neither ever touches the Connection
deck** — a hard no on "being watched" must not delete a conversation question.

---

## ⭐ Compatibility cards — a match is not always agreement

Most cards resolve by equality: two identical answers. **One does not.**

*"When it comes to who leads, what do you actually want?"* — if he says **"I lead and
they follow"** and she says **"They lead and I follow"**, that is the outcome you want,
and scoring it as a mismatch would be exactly backwards. Two people both answering
**"I lead"** is the *failure* state, not the win.

So the card declares a `pair` rule and a `map` from each option to a **position**
(`lead` / `follow` / `trade` / `flex`), and the verdict is read off the **pair**:

| Him | Her | Verdict |
|---|---|---|
| lead | follow | **Match — the lead and the follow fit each other** |
| trade | trade | **Match** |
| flex | anything | **Match** — no preference |
| lead | lead | **Clash — you both want to lead** |
| follow | follow | **Clash — neither of you wants to lead** |
| trade | lead | **Talk — you want different shapes** |

Only `complement` carries the match sound. A clash is silent, because it is information,
not a win. Any card can opt in by declaring `pair` + `map`; everything else keeps
ordinary equality scoring.

---

## ⭐ The games

### One button set, both tabs

**PASS · NEXT · DONE**, everywhere.

| Button | The card | Who goes next |
|---|---|---|
| **PASS** | **not spent** — it goes back in the pool | turn moves on |
| **NEXT** | spent | **the same person goes again** |
| **DONE** | spent | turn passes, back to the board |

`NEXT` and `DONE` are only distinguishable because NEXT does **not** cost the turn.
If they both handed the turn over the third button would be decoration.

### ⛔ Tiers are EXACT on the games, and were not

`tierPool()` used to test `c.tier <= tier`. On a game deck that means **Blaze dealt
Spark and Flame cards** — the ladder never got hotter, it only got longer, and the odds
of a cold card went *up* the higher you climbed. Game decks now deal **only their own
tier**. Connection and The Menu stay cumulative on purpose: their tiers are levels of
*honesty*, not temperature, and a deep question is not spoiled by a shallow one existing.

### Truth or Dare says whose turn it is

The board reads **"`<name>` is up — choose Truth or Dare"**, and every card carries a line
naming who it is put to (`Him answers`, `Her does it`). The `HIM`/`HER` tag names the turn;
the line names the **recipient** — those are not the same question, which is why
*"what is a small thing I do that turns you on"* was ambiguous.

### Timed cards have a clock

Cards with a duration carry `secs` and show a **Start 10s / 30s / 1:00 / 5:00** button that
counts down and gives three flat pulses at zero. The countdown belongs to one card: leaving
the card kills it. It is a stopwatch, not a verdict, so it deliberately does not borrow the
match/close harmonics.

### Kindling asks every ten

After **10 completed activities** it stops and asks: *"10 done. Stay at Spark for another
10, or move up?"* Moving up raises the level and nothing below it comes back. At Blaze there
is nowhere up, so it offers STAY only. `NEXT` and `DONE` both count; `PASS` does not, because
a passed card was not an activity.

---

## ⭐ Role — DOM / SUB / SWITCH

Set per person, next to the name. It is not a label: cards carry a **perspective**
(`dom` / `sub` / `any`) and your role decides which pool you draw from. *"Hold their
wrists and use only your mouth"* is a DOM card; *"have your wrists held"* is the SUB
card. Without it, the corpus can only ever be written from one side — which is why
half of the old deck read wrong for one person.

---

## ⭐ Tonight — the daily switchboard

**A second panel, next to Limits, and deliberately not the same thing.** Limits are
permanent and take a sitting to set. Tonight is the two-minute thing you flip because
of what today actually is.

Open it from the **TONIGHT** button in the header:

| Switch | Takes off |
|---|---|
| **Period night** | oral both ways, anal both ways, insertable toys |
| **No toys tonight** | vibrator, insertable, squeeze |
| **No pain tonight** | pain, impact, squeeze |
| **No tying** | rope, restraint |
| **No blindfold** | blindfold |
| **No dressing up** | costume |

### ⛔ It can only ever SUBTRACT

**Nothing here can grant what a Limit has withheld.** A nightly mood must never be able to
overrule a hard no — so *"the toy box is open tonight"* is the **default state** (no
switches flipped), not a switch you turn on. Every toggle removes; none adds. If it could
add, "she's in the mood tonight" would quietly undo a limit she set on purpose, and the
limit would stop meaning anything.

**It expires at midnight.** A record from another date is discarded on read, so a toggle
from Tuesday cannot silently govern Saturday. Verified: a stored `{date:'2020-01-01'}` is
thrown away and the board comes up clear.

Switches ride the **same machinery as a hard no** — one code path, both directions, and
they respect the per-person directional rule too.

---

## ⭐ Limits — two different jobs wearing one word

**The list** — both players rate every act on a five-word scale, **sequentially and
hidden** (he answers, answers hide, she answers). Each act is scored as the **sum:**

| Answer | Points |
|---|---|
| Yes now | 5 |
| Yes | 4 |
| Interested | 3 |
| Not really | 2 |
| Hard No | 1 |

**Sum ≤ 4 → hidden. Sum ≥ 5 → shown.** Two Hard Nos (2), two Not-reallys (4) and every
Hard No + Not really (3) combination all fall below the line. The result is **two
columns with each of your names as the header.** Reset button wipes both.

**The veto** — a Hard No is *not* the bottom of a preference scale. It is absolute.
A Hard No removes every matching card from **both game decks** and **cannot be outvoted**.
So `Hard No + Yes now = 6` is *shown on the list* — you see the clash — but the card
is never dealt. That is the point: you learn what you each want, and nothing lands on
a hard limit at round eleven.

**Vetoes apply to actions, not questions.** The Connection deck is conversation and is
never filtered.

### ⭐ The four families (v1.3.5)

The table was 18 narrow **acts** with no umbrella for the three things people actually ask
about. `Being watched` existed; **`watching`** did not. Nothing existed at all for being
seen, for a third person, or for **pain as a category**. Four families were added:

| Act | What it covers |
|---|---|
| `voyeur` | watching them, or watching anything |
| `exhib` | being seen — shown off, watched by someone else, filmed, posted |
| `cuck` | your partner with someone else — **no cards exist and none will** |
| `pain` | impact, biting, clamps — an umbrella over `impact` + `marking` |
| `toy_vibe` | vibrator or wand |
| `toy_insert` | an insertable toy (vaginal) |
| `toy_squeeze` | squeeze — clamps, bands, grip |
| `costume` | dressing up — yours, theirs, or what they pick |
| `undress` | undressing in front of your partner, or being undressed by them |
| `oral_give` | giving oral |
| `oral_receive` | receiving oral |
| `anal_give` | anal — giving |
| `anal_receive` | anal — receiving |

### ⭐ Directional vetoes — giving is not receiving

`oral_give` and `oral_receive` are **separate limits**, and so are `anal_give` and
`anal_receive`. Someone who will not give may happily receive; a single "oral" row would
force one answer to cover two different questions.

**This needed a real engine change, not a wider regex.** A card like *"Go down on them"*
means **giving** for whoever draws it and **receiving** for their partner — the same
sentence is two different acts depending on the hand holding it. The old veto matched
card *text* globally, so the moment either of you vetoed either direction it would have
deleted **both** cards, including the one you would have loved.

So those cards carry an `acts` map and are evaluated **per person at draw time**:

```js
{ q:'Go down on them and do not stop until they tell you to.',
  acts:{ holder:['oral_give'], other:['oral_receive'] } }
```

The global text veto is skipped for any card with a map. Verified: if she hard-nos
**giving**, *"Go down on them"* is withdrawn from **her** and still dealt to **him**,
while *"Have them go down on you"* is withheld from **him** and still dealt to **her** —
which is the correct asymmetry, and the thing a text filter cannot express.

> ⚠️ **Until both of you have rated those four acts, nothing about them is blocked.**
> The app has no opinion until you give it one. Rate Limits before playing at Edge or
> above.

**Toys are three acts, not one.** A single `toys` row meant a hard no on *clamps*
also killed every *vibrator* card, which is not what "no clamps" means. Cards
therefore **name the toy** — a card that just said "a toy" would fall through all
three. The exception is the *choose-your-own* cards ("hand them the toy box"), which
have no veto by design because the person doing it picks.

**Costumes is clothing, not roleplay.** *Put on one of my shirts* is concrete — put it
on, look, take it off. *Pretend you are a stranger* asks someone to invent a scene from
nothing, which the corpus excludes and which returns empty for a partner who does not
build scenarios unprompted. Wear the shirt. Do not be someone else.

> ⛔ **`undress` closed the largest hole in the table.** The strip mechanic is the
> most-used action in the corpus — every Truth or Dare layer card and half of Blaze
> is built on it — and **nothing could veto it.** Someone who did not want to be
> undressed had no way to say so, and every stripping dare was still dealt to them.

**Overlap is deliberate.** A Hard No on `pain` removes the spanking cards *and* the biting
ones. A Hard No on `costume` also removes the "what to wear" cards, which sit under
`orders` too. Vetoes **union**, so over-matching fails **safe**.

> ⛔ **The bug this fixed.** Six of the eighteen acts matched **zero** cards, including
> `impact` and `photo`. Adding punishment or camera content would have dealt it to someone
> who had hard-no'd exactly that, because the veto had nothing to match on. Every
> punishment, forced-orgasm, voyeur and exhibition card now has a working Hard No.

**The cost, stated plainly:** the list is **30 acts**, so the rating round is **30
questions per person**. Four of them (`risky`, `waking`, `degrade`, `cuck`) filter nothing
today — they record a position. **This is the most likely thing to annoy you:** 30 taps a
side is a long sitting. A "leave it unrated" option would fix it; there isn't one yet.

---

## ⭐ Nothing you answered is lost on a refresh or a new version

Three separate mechanisms, because there were three separate ways to lose data.

**1. Ids are content-derived, not positional.** Until v1.3.3 card ids came from one
global counter (`let n = 0; ++n`), which made them **positional**: inserting a single
card renumbered every card after it, so a stored rating silently re-pointed at a
*different* question — and a gate could fire on a theme nobody ever answered. That is
worse than a reset, because nothing looks wrong. Ids now hash the deck and the card's
own wording, so editing the corpus never moves an existing id. `check.sh` fails the
build if they ever go sequential again.

**2. Ratings written by 1.3.x are migrated, not dropped.** `LEGACY_IDS` in `deck.js`
translates old positional ids to their content-derived equivalents on first boot. Ids
that still cannot be resolved are **kept**, never deleted — an unknown key is inert
(the gate logic only ever walks `CARDS`), and silent deletion is how data disappears.

**3. An interrupted Limits round survives.** Finished answers were always saved; the
round *in progress* was memory-only, so a reload lost every rating given so far and
restarted at question one without saying so. Stage, speaker, position and the draft now
persist on every answer. Tapping **LIMITS** resumes the round where it stopped; once
both of you have finished it shows what you said instead of inviting you to overwrite it.

A Menu round mid-flight also resumes into the rating view on reload.

---

## The sounds — three, and only three

| Outcome | Sound |
|---|---|
| Yes + Yes | **match** — bright rising arpeggio |
| Yes + Maybe | **close** — warm, unresolved |
| Maybe + Maybe | **both maybe** — playful bounce |
| lead + follow (*compatibility*) | **match** |
| Yes + Not for me, or Yes + Hard no | **silence**, with a plain *"Mismatch"* label |
| anything else, including a clash | silence |

**A sound for everything is a sound for nothing.** A mismatch is information, not a
win. `pick` / `thisor` matches say **"Same answer"**, never "you both said yes".

---

## ⛔ Excluded, permanently

**Standing limits, not preferences.** No card contains any of them and none may be
added: oral–genital contact in any direction · anal in any form · a third person as a
required act · anything requiring the other person to invent a scenario from nothing.
Mouth on the **body** only — ears, throat, neck, collarbone, chest, stomach, wrists,
fingers. These outrank every card.

---

## Running it

No build step. No dependencies.

```bash
cd /config/pwa/ember
python3 -m http.server 8791
```

State lives in `localStorage`: seen-lists, session, answers, names, roles, limits.

### Verifying before a push

```bash
bash check.sh
```

Validates every `.js` **as ESM**, scans for glued punctuation, checks required files,
asserts card ids are content-derived and unique, checks `version.js` matches
`version.json`, and greps every tracked file for the private words in `.privatewords`
(git-ignored, so the guard never commits what it guards against).

> `node --check app.js` returns **exit 0** on broken module code — the `import` makes
> Node bail as CommonJS before reaching the real error. `.mjs` or nothing.

### Deploy

1. `bash check.sh` → must print `PASS`
2. Bump `CACHE` in `sw.js` **every** deploy
3. Bump `version.js` **and** `version.json` together
4. Push `main`, wait ~60 s, fetch the **live** URL

Hosting is **Pages → Deploy from a branch → `main` → `/ (root)`**. A workflow's
`GITHUB_TOKEN` can *deploy* to an existing Pages site but **cannot create one** —
`configure-pages` with `enablement: true` fails with `Resource not accessible by
integration`. Enabling Pages is a one-time human click; `check.yml` runs the gate
independently so a gate failure never looks like a deploy failure.

---

## Adding cards

```js
{ t:2, a:'would', q:'Being held down — hands only, easy release.' }
{ t:2, a:'pick',  q:'Where first?', opts:['Neck','Mouth','Chest'] }
{ t:3, q:'Hold their wrists.', as:'dom' }
{ t:2, q:'Remove one item.', layer:{ who:'partner', n:1 } }
/* compatibility card — verdict read off the PAIR, not equality */
{ t:2, a:'pick', q:'Who leads?', opts:['They lead','I lead'], pair:'leadfollow',
  map:{ 'They lead':'follow', 'I lead':'lead' } }
```

`as` is `'any'` unless the card's direction is the content. `layer.who` is one of
`self` · `partner` · `both` · `self-they-choose` · `partner-they-choose` ·
`partner-you-choose`, written from the holder's point of view. `pair` + `map` are
optional and only for cards where agreement is not the win condition.

**⛔ Never reword a card you have already answered unless you mean to retire that
answer** — a card's id is a hash of its own text, so changing the wording starts it
fresh. Every other card keeps its id and its stored answer.

Then re-run `check.sh`.

---

## Open

- **30 limit acts.** Every one now has content somewhere — the audit reports **no act with
  nothing anywhere**. `cuck` is the only one whose gate can remove nothing, because a third
  person as an **involved** act stays excluded from the games: its two Menu cards record a
  position and gate a theme that has no cards to remove. That is deliberate, not an
  oversight. Auditable: `L.verify(CARDS)` prints the match count per act.
- **History of holes this closed:** six acts vetoed nothing in 1.3.5 (including `impact`
  and `photo`); `undress` did not exist at all until 1.3.6, so the strip mechanic had no
  veto; `degrade` and `cuck` had no card of any kind until 1.3.8.
- **Limit matching is regex over card text**, not an explicit tag. A reworded card can
  silently stop matching. Explicit per-card tags would be sturdier; the regex is the
  reason a card can be added that no veto covers, so run `verify()` when you add one.
- **No sync.** One phone passed back and forth. "Blind" means *they didn't look*, which
  is trust, not cryptography.
