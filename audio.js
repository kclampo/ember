/*
 * Ember — audio.js
 *
 * Synthesised on the device. No files, no network, no dependencies — WebAudio
 * oscillators only, so the PWA stays offline and the app has nothing to fetch.
 *
 * Three outcomes, and only three:
 *   match()      both said Yes            → bright rising arpeggio
 *   close()      Yes + Maybe             → warm two-note "almost"
 *   bothMaybe()  both said Maybe         → playful bounce
 *
 * Anything else is a plain reveal with no sound. Silence is an answer.
 *
 * ⚠️ iOS/Safari will not start an AudioContext without a user gesture. Every
 * entry point here is called from a tap handler, which satisfies that. If the
 * context is ever created outside a gesture it starts 'suspended' — hence the
 * resume() call in ctxNow().
 */

let _ctx = null;
let muted = false;

export function setMuted(v) { muted = !!v; }
export function isMuted() { return muted; }

function ctxNow() {
  if (muted) return null;
  try {
    if (!_ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      _ctx = new AC();
    }
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
  } catch {
    return null;
  }
}

function note(c, freq, at, dur, type = 'sine', peak = 0.16) {
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.03);
  return o;
}

/* ---- MATCH — both Yes. Bright, quick, unmistakable. ---- */
export function match() {
  const c = ctxNow(); if (!c) return false;
  const N = [523.25, 659.25, 783.99, 1046.50];   // C5 E5 G5 C6
  N.forEach((f, i) => note(c, f, i * 0.085, 0.30, 'triangle', 0.20));
  note(c, 2093.00, 0.255, 0.42, 'sine', 0.07);   // C7 shimmer
  note(c, 1046.50, 0.255, 0.55, 'triangle', 0.12);
  return true;
}

/* ---- CLOSE — Yes + Maybe. Warm, unresolved, one step short. ---- */
export function close() {
  const c = ctxNow(); if (!c) return false;
  note(c, 440.00, 0.00, 0.34, 'sine', 0.17);     // A4
  note(c, 587.33, 0.13, 0.46, 'sine', 0.15);     // D5 — a fourth, not a resolve
  note(c, 293.66, 0.13, 0.46, 'sine', 0.06);     // D4 under it
  return true;
}

/* ---- BOTH MAYBE — playful, cheeky little bounce. ---- */
export function bothMaybe() {
  const c = ctxNow(); if (!c) return false;
  note(c, 493.88, 0.00, 0.16, 'square', 0.09);   // B4
  note(c, 659.25, 0.10, 0.16, 'square', 0.09);   // E5
  note(c, 493.88, 0.20, 0.26, 'square', 0.09);   // back down — the shrug
  return true;
}

/* ---- SCALE CARDS — same number, or one apart ---- */
export function scaleMatch() { return match(); }
export function scaleClose() {
  const c = ctxNow(); if (!c) return false;
  note(c, 659.25, 0.00, 0.22, 'sine', 0.13);
  note(c, 783.99, 0.09, 0.30, 'sine', 0.11);
  return true;
}
