# Ember

A deck for two. Five games, three heat tiers, on-device only.

**Repo:** `ember-deck` · **Product name:** Ember · **Version:** 1.0.0

---

## Why it is called Ember

Short, warm, and **deliberately unremarkable on a home screen.** Nobody who
glances at a phone asks what "Ember" is. That is a feature.

---

## The five games

| Deck | What it is | Answer shape |
|---|---|---|
| **Connection — What I Notice** | Say the true thing you have not said | Mixed |
| **Connection — If You Couldn't Get Caught** | Fantasy, as a choice rather than a confession | Mostly `would` |
| **Truth or Dare** | Truth, dare, or mix | Mixed |
| **Do It To Your Partner** | A thing to do, not a thing to say | Instructions |
| **Strip** | Comply or forfeit | Instructions |

---

## The design decision that matters

**A blank "describe your fantasy" box is a dead end.**

Most couples card decks write free-answer prompts. That works for a talker and
fails completely for a partner who does not volunteer — who then faces a blank
and reads their own silence as a verdict on themselves.

So every card carries an **answer type**:

| Type | What the partner gets |
|---|---|
| `open` | Answer out loud. No input box, no scoring |
| `pick` | Choose one from a short list |
| `thisor` | A or B |
| `scale` | 1–5 |
| `would` | **I would / Maybe / Not for me / My partner would** |

`would` is the important one. It converts a confession into a **selection** —
and selection is answerable when invention is not.

> "I would" meeting "My partner would" is not a mismatch. It is one person
> wanting to give and the other wanting to receive.

**Balance rule, enforced in `deck.js`:** in the question decks (`admire`,
`fantasy`, truths) `open` must stay at or below ~45%. It currently sits at
**36%** (30 of 84). Task decks (`doit`, dares, `strip`) are `open` by nature —
the instruction *is* the content.

---

## ⛔ Excluded, permanently

These are **standing limits, not preferences.** No card in this repo contains
any of them, and none may be added:

- **anal** — any act, either direction
- **oral** — any act, either direction
- **a third person** as a required act
- **anything requiring her to invent a scenario from nothing** — the
  `would`/`pick` types exist precisely so this never has to happen

If a future card needs a limit list, the limit wins and the card is cut.

---

## Rules the app enforces

1. **PASS costs nothing and needs no reason.** There is no score, no loser, no
   tally. Nothing is stored about who passed.
2. **Heat is a ceiling, not a target.** Pressing *Hot* includes Warm and Hot.
   Nothing above the selected tier can appear.
3. **A card is scoped to a person or to both.** `for:'him'` cards can never be
   drawn by HER and vice versa — verified in test, 0 leaks.
4. **Cards do not repeat** until the deck is spent, then the app says so and
   offers a reset.

---

## Heat tiers

| Tier | Label | What lives there |
|---|---|---|
| 1 | **Warm** | Notices, compliments, hands, first impressions |
| 2 | **Hot** | Body, wanting, undressing, deliberate touch |
| 3 | **Hottest** | Being told, control, blindfolds, restraint, waiting |

---

## Running it

No build step. No dependencies. No network calls. No analytics. No accounts.

```bash
cd ember-deck
python3 -m http.server 8791
# open http://127.0.0.1:8791/
```

**State lives in `localStorage` only** — the seen-list, last deck, heat, and
truth/dare filter. Nothing leaves the device. There is no server to leak.

---

## Verifying before a push

```bash
bash check.sh
```

`check.sh` validates every `.js` file **as ESM** (`cp f /tmp/x.mjs && node --check`)
and scans for glued punctuation.

> ⚠️ **Why it exists:** on 2026-10-27 a patch ate a newline in a sibling project,
> gluing a comment rule onto a closing brace. The module failed to parse, no
> event listeners attached, and the app's start button looked dead.
> `node --check app.js` returned **exit 0** on that broken file, because the
> `import` makes Node bail as CommonJS before it reaches the syntax error.
> Every earlier "SYNTAX OK" came from a check that could not see the bug.

**⛔ Never push without a green `check.sh`.**

### Deploy checklist

1. `bash check.sh` → must print `PASS`
2. Bump `CACHE` in `sw.js` on **every** deploy — a cache-first service worker
   with an unchanged cache name serves the old app forever
3. Bump `version.js` **and** `version.json` together (`check.sh` verifies match)
4. Push, wait ~30 s, then grep the **live** URL — not the local file

---

## Adding cards

Append to the relevant array in `deck.js`:

```js
{ t:2, a:'would', q:'Your prompt here.' }
{ t:3, a:'pick', q:'Your prompt here.', opts:['A','B','C'] }
{ t:2, a:'open', q:'Your prompt here.', for:'her' }
```

Then re-run `check.sh` and re-check the question-deck open percentage.

**⚠️ Adding `open` cards dilutes the answer-type balance. Prefer `would`,
`pick`, or `thisor`.**

---

## Open questions

- **"SYP"** — Kevin mentioned a game called *syp or strip*. Strip is built.
  **SYP is unidentified** — if it is a real game he wants modelled, it needs a
  description before it can be built. *Do not guess at what it stands for.*
- Card count is **142**. Comfortable for months at a few rounds a night, but it
  is a first corpus, not a finished one.

---

*Built 2026-10-27.*
