# Ember

A deck for two. Five games, three heat tiers, on-device only.

**Product name:** Ember · **Version:** 1.1.0 · **170 cards**

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

## ⭐ The overlap mechanic

`seen` is tracked **per person**. A card answered by one partner stays live for
the other — and when the second person draws it, the app shows what the first
one said:

> **DENISE**
> **WOULD YOU WANT THIS?**
> Being told no, and made to wait for it.
> 💗 *Kevin already answered this: Maybe*

**This is the payoff.** Individually the answers are just answers; the reason to
play is the comparison. A card is only fully spent once both people have seen
it.

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
cd ember-deck
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
4. Push, wait ~30 s, grep the **live** URL — not the local file

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

- **Card count 170.** Comfortable, but still a first corpus.
- **No way to add your own cards yet** — every custom card means editing
  `deck.js`. A "write your own" screen is the obvious next feature.
- **Two devices would need a sync layer.** Today it is one phone passed back
  and forth, which is what the overlap mechanic assumes.
