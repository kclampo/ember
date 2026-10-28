# Ember

A deck for two. On-device only — no accounts, no network, no analytics.

**Version:** 1.3.2 · **253 cards** · **repo:** `kclampo/ember`
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
| **The Menu** | Questions | 66 | Familiar → Specific → Edge |
| **Truth or Dare** | Games | 64 | escalates by round |
| **Kindling** | Games | 75 | Spark → Flame → Blaze |

### Tier labels are per-deck

There is no global "heat" scale. Connection escalates on **how hard the honest answer
is** — labeling *"what do you need from me that you've never said out loud"* as
"Hottest" would put it on the same axis as "blindfolded", which is a different axis
and sets the wrong expectation. Truth or Dare has **no picker at all**: rounds 1–5 are
Warming, 6–11 Heated, 12+ Edge, shown as a status line.

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
If **either** of you answers **"Not for me"** on it, that whole theme stops being dealt
in Truth or Dare and Kindling.

It is a **soft veto**: persisted, permanent, and driven by your answers rather than
expiring with the 12-hour session. The hard veto in Limits is absolute and cannot be
outvoted; the Menu gate is you telling the app what you don't want, once, and having it
remember.

Both are enforced by the same code path, and **neither ever touches the Connection
deck** — a hard no on "being watched" must not delete a conversation question.

---

## ⭐ Role — DOM / SUB / SWITCH

Set per person, next to the name. It is not a label: cards carry a **perspective**
(`dom` / `sub` / `any`) and your role decides which pool you draw from. *"Hold their
wrists and use only your mouth"* is a DOM card; *"have your wrists held"* is the SUB
card. Without it, the corpus can only ever be written from one side — which is why
half of the old deck read wrong for one person.

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
A Hard No removes every matching card from all three games and **cannot be outvoted**.
So `Hard No + Yes now = 6` is *shown on the list* — you see the clash — but the card
is never dealt. That is the point: you learn what you each want, and nothing lands on
a hard limit at round eleven.

**Vetoes apply to actions, not questions.** The Connection deck is conversation and is
never filtered.

---

## The sounds — three, and only three

| Outcome | Sound |
|---|---|
| Yes + Yes | **match** — bright rising arpeggio |
| Yes + Maybe | **close** — warm, unresolved |
| Maybe + Maybe | **both maybe** — playful bounce |
| Yes + Not for me | **silence**, with a plain *"Mismatch"* label |
| anything else | silence |

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
and asserts `version.js` matches `version.json`.

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
```

`as` is `'any'` unless the card's direction is the content. `layer.who` is one of
`self` · `partner` · `both` · `self-they-choose` · `partner-they-choose` ·
`partner-you-choose`, written from the holder's point of view.

Then re-run `check.sh`.

---

## Open

- **18 limit acts, 4 with no card yet** (toys, impact, degradation, photo). The veto is
  inert for those until cards exist.
- **Limit matching is regex over card text**, not an explicit tag. It is auditable —
  `L.verify(CARDS)` prints the match count per act — but a reworded card can silently
  stop matching. Explicit tags on cards would be sturdier.
- **No sync.** One phone passed back and forth. "Blind" means *they didn't look*, which
  is trust, not cryptography.
