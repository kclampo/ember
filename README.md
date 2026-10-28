# Ember

A deck for two. Five games, three heat tiers, on-device only.

**Product name:** Ember · **Version:** 1.2.0 · **170 cards** · **repo:** `kclampo/ember`

---

## Why it is called Ember

Short, warm, and **deliberately unremarkable on a home screen.** Nobody who
glances at a phone asks what "Ember" is. That is a feature.

---

## The five games

| Deck | What it is | Cards |
|---|---|---|
| **Connection — What I Notice** | Say the true thing you have not said | 38 |
| **Connection — If You Couldn't Get Caught** | Fantasy, one question, four answers | 26 |
| **Truth or Dare** | Truth, dare, or mix | 32 |
| **Do It To Your Partner** | A thing to do, not a thing to say | 28 |
| **SYP or Strip** | Two round types, chosen per round | 46 |

---

## SYP and Strip — two round types of one game

They are presented as **a paired choice**, like truth-or-dare. You pick which
one you are playing this round.

**SYP — "take a drink of your partner."**
Physical contact with the mouth and hands. *Kiss their neck and do not move on
for ten seconds. Take their earlobe between your lips. Run your tongue along
their collarbone. Take their fingers into your mouth. Put your hand inside
their trousers and leave it there.*
23 cards, tiers rising from one kiss to a held instruction.

> ⛔ **Mouth on the BODY only** — ears, throat, neck, collarbone, chest,
> stomach, wrists, fingers. **Never mouth-on-genitals.** That is a standing
> limit, not a preference, and it is what keeps the deck usable rather than a
> thing that gets skipped.

**Strip — passionate and prelude. Not literal undressing.**
*Run your fingers through their hair and hold their head there. Kiss their
chest over the clothing. Trace one finger from throat to waistband. Undo their
trousers and do nothing else. Let them look as long as they want.*
Clothing is one tool among several, not the mechanic.
23 cards.

---

## ⭐ Answer types — and `pitch`, which makes them work

| Type | What the partner gets |
|---|---|
| `open` | Answer out loud. No input box |
| `pick` | Choose one from a short list |
| `thisor` | A or B |
| `scale` | 1–5 |
| `would` | **Yes / Maybe / Not for me / Ask me again later** |

**Why `would` exists:** a blank "describe your fantasy" box is a dead end for a
partner who does not volunteer. A choice is answerable; invention is not.

**⭐ Every `would` card carries a `pitch` — the question line.**
Rendered small and orange above the card text:

> **WOULD YOU WANT THIS?**
> Being told no, and made to wait for it.
> *( Yes · Maybe · Not for me · Ask me again later )*

> ⚠️ **Why this is mandatory:** the first build shipped these cards as bare
> sentence fragments with no question attached. Kevin could not tell how they
> worked. *A card you have to have explained is not a card.* All 15 `would`
> cards now carry a pitch, and the test suite asserts the pitch renders.

**Balance rule:** in the question decks (`admire`, `fantasy`, truths) `open`
stays at or below ~45%. **Currently 31%.** Task decks are `open` by nature —
the instruction *is* the content.

---

## ⭐ The overlap mechanic — and the reveal gate

`seen` and `answers` are tracked **per person**. A card answered by one partner
stays live for the other, and **a card one of you has already answered is
promoted to the front of the other's draw queue.** With 170 cards a purely
random draw would almost never put both of you on the same card, and the
comparison — the entire point — would never fire.

> ⛔ **The reveal is gated.** You never see your partner's answer until you have
> pressed **DONE** on your own answer. Showing her answer at draw time does not
> reveal a comparison, it manufactures one — you would be answering *into* her
> answer. (Kevin, 2026-10-27: *"the reveal should only be after we both answer a
> card."*)

So the flow is:

**HIM** draws → answers → **DONE** → **HER** draws the same card → answers →
**DONE** → both answers appear side by side.

### The four outcomes

| Outcome | When | Sound |
|---|---|---|
| **Match — you both said yes** | `would` · Yes + Yes | bright rising arpeggio |
| **Close — one yes, one maybe** | `would` · Yes + Maybe | warm, unresolved |
| **Both said maybe** | `would` · Maybe + Maybe | playful bounce |
| *silence* | Not for me · Ask me again later · a mismatched `pick` · any `open` card | none |

> **Silence is an answer.** A sound for everything is a sound for nothing.
>
> `pick` / `thisor` cards that match say **"Same answer"** — never "you both said
> yes", because nobody did. `scale` cards match on the same number and come
> close one apart.

**`open` cards cannot be compared** — there is no stored answer, the reply is
spoken aloud. So the second person is told *"Kevin drew this one too"* and the
card passes without sound.

**That is the payoff.** Individually the answers are just answers; the reason to
play is the comparison. A card is only fully spent once both people have seen
it.

**Sound is synthesised on the device** (`audio.js`) — WebAudio oscillators only.
No audio files, no network, nothing to download, works offline. iOS/Safari will
not start an audio context outside a tap, and every sound fires from the DONE
tap, so that constraint is satisfied by construction.

---

## ⛔ Excluded, permanently

**Standing limits, not preferences.** No card contains any of them and none may
be added:

- **oral–genital contact**, any direction — including inside the SYP deck
- **anal**, any act
- **a third person** as a required act
- **anything requiring her to invent a scenario from nothing**

If a future card needs a limit list, the limit wins and the card is cut.

---

## Rules the app enforces

1. **PASS costs nothing and needs no reason.** No score, no tally, nothing
   recorded about who passed.
2. **Heat is a ceiling, not a target.** *Hot* includes Warm and Hot. Nothing
   above the chosen tier can appear.
3. **Person-scoped cards never leak.** `for:'him'` cannot be drawn by HER and
   vice versa — verified, 0 leaks across the full sweep.
4. **Cards do not repeat for the same person** until the deck is spent.
5. **PASS withdraws your answer.** Passing a card after selecting an option
   deletes it — a card you passed is not a card you answered, and it will not
   show up in someone else's comparison.
6. **The reveal waits for DONE.** Nothing from your partner appears on screen
   until you have committed.
7. **Sound only on the three outcomes above.** A mismatch, a *Not for me*, or an
   open card reveals in silence.

---

## Heat tiers

| Tier | Label | What lives there |
|---|---|---|
| 1 | **Warm** | Notices, compliments, first kisses, hands, hair |
| 2 | **Hot** | Body, wanting, undressing, deliberate touch, hands inside clothing |
| 3 | **Hottest** | Being told, control, blindfolds, held wrists, waiting |

---

## Running it

No build step. No dependencies. No network calls. No analytics. No accounts.

```bash
cd /config/pwa/ember
python3 -m http.server 8791
# open http://127.0.0.1:8791/
```

State lives in `localStorage` only — seen-lists, answers, last deck, heat,
round type. Nothing leaves the device.

---

## Verifying before a push

```bash
bash check.sh
```

Validates every `.js` **as ESM** and scans for glued punctuation.

> ⚠️ **Why it exists:** on 2026-10-27 a patch ate a newline in a sibling project,
> gluing a comment rule onto a closing brace. The module failed to parse, no
> event listeners attached, and the start button looked dead. `node --check
> app.js` returned **exit 0** on that broken file, because the `import` makes
> Node bail as CommonJS before reaching the syntax error.

It also **verifies `version.js` matches `version.json`** — it caught a live
mismatch on 2026-10-27 during this build.

### Deploy checklist

1. `bash check.sh` → must print `PASS`
2. Bump `CACHE` in `sw.js` on **every** deploy
3. Bump `version.js` **and** `version.json` together
4. Push, wait ~60 s, fetch the **live** URL — not the local file

**Live at:** `https://kclampo.github.io/ember/` · **repo:** `kclampo/ember`

Hosting is **Pages, "Deploy from a branch" → `main` → `/ (root)`.** Every push
to `main` goes live; there is no build step and nothing to configure.

> ⚠️ **Why branch-deploy and not a Pages workflow:** a workflow's `GITHUB_TOKEN`
> can *deploy* to an existing Pages site but **cannot create one** — GitHub
> returns `Resource not accessible by integration`, and `configure-pages` with
> `enablement: true` fails at that exact step. The local PAT has no `pages`
> scope either (403 on `PUT /repos/.../pages`). Enabling Pages is therefore a
> one-time human click, and `check.yml` runs the gate independently so a gate
> failure is never confused with a deploy failure.

---

## Adding cards

```js
{ t:2, a:'would', pitch:'Would you want this?', q:'Your prompt here.' }
{ t:3, a:'pick', q:'Your prompt here.', opts:['A','B','C'] }
{ t:2, a:'open', q:'Your prompt here.', for:'her' }
```

Re-run `check.sh` and re-check the question-deck open percentage.
**⚠️ Prefer `would` / `pick` / `thisor` over `open`.**

---

## Open questions

- **⛔ Only 55 of 170 cards can be compared.** The comparison — and therefore
  every sound — only fires on `would` (15), `pick` (26), `thisor` (11) and
  `scale` (3). The other **115 are `open`**, answered out loud, with nothing to
  store and nothing to compare. So most draws end in silence by design. This is
  the single biggest product gap: *the game's payoff is reachable on a third of
  the deck.* The fix is not more cards, it is more `would`/`pick` — and it is a
  corpus change, not a code change, so it can happen any time.
- **No mute.** Sound is on and there is no toggle. `audio.js` already exposes
  `setMuted()` / `isMuted()`; wiring a button is a ten-minute job if it is ever
  wanted.
- **No way to add your own cards yet** — every custom card means editing
  `deck.js`. A "write your own" screen is the obvious next feature.
- **Two devices would need a sync layer.** Today it is one phone passed back
  and forth, which is what the overlap mechanic assumes. A comparison that
  needs both people on one phone is fine at a kitchen table and useless if one
  of you is travelling.
