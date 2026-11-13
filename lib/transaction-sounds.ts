/**
 * Transaction sounds: a bright rising chime when money comes in, a softer
 * falling one when it goes out. Generated with the Web Audio API, so there
 * are no audio files to load or license.
 *
 * Browsers only allow audio after the user has interacted with the page, so
 * the audio context is created (or resumed) on the first tap, click or key
 * press; a chime before that is silently skipped.
 */

export type ChimeKind = "in" | "out";

type BalanceChange = { balance: number; previousBalance: number | null };

/**
 * The chime for a burst of balance changes. One that moves money both ways
 * at once (converting naira to crypto, a swap) is something the user just
 * received, so it gets the "in" chime, once.
 */
export const chimeFor = (changes: readonly BalanceChange[]): ChimeKind | null => {
  let up = false;
  let down = false;
  for (const { balance, previousBalance } of changes) {
    if (previousBalance == null) continue;
    if (balance > previousBalance) up = true;
    else if (balance < previousBalance) down = true;
  }
  if (up) return "in";
  if (down) return "out";
  return null;
};

/** Balance events arriving this close together are one transaction. */
export const CHIME_BATCH_MS = 600;

/**
 * Collects balance events and plays one chime per burst. `isEnabled` is read
 * when the burst ends, so switching sounds off takes effect at once.
 */
export const createChimeQueue = ({
  play,
  isEnabled,
  delayMs = CHIME_BATCH_MS,
}: {
  play: (kind: ChimeKind) => void;
  isEnabled: () => boolean;
  delayMs?: number;
}) => {
  let pending: BalanceChange[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    timer = null;
    const kind = chimeFor(pending);
    pending = [];
    if (kind && isEnabled()) play(kind);
  };

  return {
    add(change: BalanceChange) {
      pending.push(change);
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, delayMs);
    },
    dispose() {
      if (timer) clearTimeout(timer);
      timer = null;
      pending = [];
    },
  };
};

/* ---------- playback (browser only) ---------- */

type Note = { freq: number; at: number; length: number; volume: number };

/** Notes in Hz; `at` and `length` in seconds. */
const CHIMES: Record<ChimeKind, Note[]> = {
  // E5 then B5: an upward fifth, bright and short, like a coin landing.
  in: [
    { freq: 659.25, at: 0, length: 0.32, volume: 0.22 },
    { freq: 987.77, at: 0.09, length: 0.55, volume: 0.2 },
  ],
  // A5 down to E5, quieter and quicker: noticeable without sounding alarming.
  out: [
    { freq: 880, at: 0, length: 0.22, volume: 0.13 },
    { freq: 659.25, at: 0.08, length: 0.36, volume: 0.12 },
  ],
};

let context: AudioContext | null = null;
let unlockListening = false;

const audioContextClass = () =>
  typeof window === "undefined"
    ? null
    : (window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext ??
      null);

/** Creates or resumes the audio context on the user's first interaction. */
export const unlockTransactionSounds = () => {
  if (unlockListening || typeof window === "undefined") return;
  unlockListening = true;
  const unlock = () => {
    const Ctor = audioContextClass();
    if (!Ctor) return;
    context ??= new Ctor();
    if (context.state === "suspended") void context.resume();
    if (context.state === "running") {
      for (const type of ["pointerdown", "keydown", "touchend"] as const) {
        window.removeEventListener(type, unlock, true);
      }
    }
  };
  for (const type of ["pointerdown", "keydown", "touchend"] as const) {
    window.addEventListener(type, unlock, true);
  }
};

const playNote = (ctx: AudioContext, start: number, { freq, at, length, volume }: Note) => {
  const t = start + at;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
  gain.connect(ctx.destination);

  // A sine for the body plus a quiet octave above for a bell-like edge.
  for (const [ratio, level] of [
    [1, 1],
    [2, 0.18],
  ] as const) {
    const osc = ctx.createOscillator();
    const partial = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * ratio, t);
    partial.gain.value = level;
    osc.connect(partial).connect(gain);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }
};

/** Plays a chime now, if the browser has let us start audio. */
export const playChime = (kind: ChimeKind) => {
  if (!context || context.state !== "running") return;
  const start = context.currentTime + 0.01;
  for (const note of CHIMES[kind]) playNote(context, start, note);
};

/** Plays a chime in response to a click (e.g. a Settings preview), starting
 *  audio first if this is the user's first interaction. */
export const previewChime = (kind: ChimeKind) => {
  const Ctor = audioContextClass();
  if (!Ctor) return;
  context ??= new Ctor();
  if (context.state === "running") playChime(kind);
  else void context.resume().then(() => playChime(kind));
};
