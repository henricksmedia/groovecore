/**
 * GrooveCore — js/audio/params.js  (WS-A)
 *
 * window.GrooveParams — the single source of synth truth.
 *
 *  - INSTRUMENTS: the 17 canonical voices (accent is a per-step flag, NOT a voice)
 *  - DEFAULTS[inst]: every synth constant for every voice, in ONE reviewable table
 *  - mapKnob(inst, param, v0to10): 0–10 knob value → real units
 *  - KEYMAP: QWERTY pad layout (consumed by js/perf/pads.js)
 *
 * Pure data + math. No DOM, no Tone. Safe to load in any order.
 * See docs/UPGRADE-PLAN.md §5.2.
 */

const INSTRUMENTS = [
    'bd', 'sd', 'lt', 'mt', 'ht', 'rim', 'cp', 'hc', 'mc', 'lc',
    'cb', 'cl', 'ma', 'ch', 'oh', 'cym', 'cr'
];

/**
 * Per-voice constants.
 *
 *  gain        nominal output gain of the voice at level knob = 8 (internal mix balance)
 *  freq        fundamental / centre frequency in Hz (before Tune)
 *  tuneRange   ± semitones covered by the Tune knob (0–10 → −range…+range)
 *  decayRange  [min, max] seconds swept exponentially by the Decay knob
 *  decayDefault  seconds at knob = 5 is decayRange geometric midpoint unless noted
 *  toneRange   [min, max] Hz swept exponentially by the Tone knob (voice-specific meaning)
 *  knobs       default 0–10 knob positions for this voice
 */
const DEFAULTS = {
    bd: {
        gain: 0.95, freq: 50, tuneRange: 5,
        decayRange: [0.15, 2.5],          // Decay knob spec: 0.15–2.5 s
        toneRange: [200, 4000],           // Tone knob = click band-pass centre
        pitchEnvOctaves: 2, pitchEnvTime: 0.045,
        satAmount: 1.6,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    sd: {
        gain: 0.8, freq: 185, freq2: 330, tuneRange: 5,
        decayRange: [0.08, 0.4],          // body decay
        toneRange: [1200, 8000],          // noise brightness (high-pass corner)
        snappyMax: 1.2,                   // noise gain at snappy = 10
        satAmount: 1.2,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 6, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    lt: {
        gain: 0.75, freq: 80, tuneRange: 5,
        decayRange: [0.2, 1.2], toneRange: [400, 3000],
        pitchEnvRatio: 1.9, pitchEnvTime: 0.07, satAmount: 1.2,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    mt: {
        gain: 0.72, freq: 120, tuneRange: 5,
        decayRange: [0.18, 1.0], toneRange: [500, 3500],
        pitchEnvRatio: 1.9, pitchEnvTime: 0.06, satAmount: 1.2,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    ht: {
        gain: 0.7, freq: 160, tuneRange: 5,
        decayRange: [0.15, 0.8], toneRange: [600, 4000],
        pitchEnvRatio: 1.9, pitchEnvTime: 0.05, satAmount: 1.2,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    rim: {
        gain: 0.6, freq: 480, tuneRange: 5,
        decayRange: [0.02, 0.09], toneRange: [1800, 5000],
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    cp: {
        gain: 0.85, freq: 1100, tuneRange: 3,   // BPF-1100 noise clap
        decayRange: [0.08, 0.4],                // tail length; default midpoint ≈ 0.18 s
        toneRange: [700, 2200],                 // clap band-pass centre
        flamOffsets: [0, 0.010, 0.020],         // VCA retrigger points (s)
        tailStart: 0.026, tailDefault: 0.18,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    hc: {
        gain: 0.62, freq: 370, tuneRange: 5,    // congas retuned 370/250/165, noise burst deleted
        decayRange: [0.1, 0.5], toneRange: [500, 3000],
        pitchEnvRatio: 1.5, pitchEnvTime: 0.012, satAmount: 1.1,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    mc: {
        gain: 0.62, freq: 250, tuneRange: 5,
        decayRange: [0.1, 0.5], toneRange: [450, 2500],
        pitchEnvRatio: 1.5, pitchEnvTime: 0.012, satAmount: 1.1,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    lc: {
        gain: 0.65, freq: 165, tuneRange: 5,
        decayRange: [0.12, 0.6], toneRange: [400, 2200],
        pitchEnvRatio: 1.5, pitchEnvTime: 0.014, satAmount: 1.1,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    cb: {
        gain: 0.55, freq: 540, freq2: 845, tuneRange: 5,
        decayRange: [0.1, 0.6], toneRange: [700, 2000],   // BPF centre
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    cl: {
        gain: 0.55, freq: 2500, tuneRange: 5,
        decayRange: [0.02, 0.1], toneRange: [1500, 4500],
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    ma: {
        gain: 0.5, freq: 5200, tuneRange: 3,    // white noise (brown noise + LFO deleted)
        decayRange: [0.02, 0.12], toneRange: [3500, 9000],  // high-pass corner
        attack: 0.012,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    ch: {
        gain: 0.6, freq: 9000, tuneRange: 4,    // metallic bank voice; freq = band-pass centre
        decayRange: [0.025, 0.12], toneRange: [5500, 9500],  // high-pass corner
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    oh: {
        gain: 0.6, freq: 8500, tuneRange: 4,
        decayRange: [0.15, 0.9],                // OH Decay knob spec: 0.15–0.9 s
        toneRange: [5000, 9000],
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    cym: {
        gain: 0.6, freq: 5200, tuneRange: 4,
        decayRange: [0.5, 3.5], toneRange: [3000, 8000],
        pingDecay: 0.25,
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    },
    cr: {
        gain: 0.65, freq: 6000, tuneRange: 4,
        decayRange: [0.8, 3.0], toneRange: [4000, 9000],
        knobs: { level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0 }
    }
};

/**
 * QWERTY finger-drumming layout (consumed by js/perf/pads.js).
 * Bottom row = kit core, home row = percussion, top row = metals.
 */
const KEYMAP = {
    z: 'bd', x: 'sd', c: 'lt', v: 'mt', b: 'ht', n: 'rim', m: 'cp',
    a: 'hc', s: 'mc', d: 'lc', f: 'cb', g: 'cl', h: 'ma',
    q: 'ch', w: 'oh', e: 'cym', r: 'cr'
};

const PARAM_NAMES = [
    'level', 'tune', 'decay', 'tone', 'snappy', 'pan', 'drive', 'sendRev', 'sendDly',
    'attack', 'sustain', 'release', 'resonance', 'gain', 'compression', 'eqHigh', 'eqLow'
];

/** Envelope / strip knobs added after the original Decay/Tone/Drive set. */
const STRIP_KNOB_DEFAULTS = {
    attack: 5, sustain: 0, release: 0, resonance: 5, gain: 5,
    compression: 0, eqHigh: 5, eqLow: 5
};

for (const inst of Object.keys(DEFAULTS)) {
    DEFAULTS[inst].knobs = Object.assign({}, STRIP_KNOB_DEFAULTS, DEFAULTS[inst].knobs);
}

function clamp01to10(v) {
    v = Number(v);
    if (!isFinite(v)) return 5;
    return Math.min(10, Math.max(0, v));
}

/** Exponential interpolation across [min, max] driven by knob 0–10. */
function expMap(v, min, max) {
    return min * Math.pow(max / min, v / 10);
}

/**
 * mapKnob(inst, param, v0to10) → real units.
 *
 *  level        → linear gain (voice-balanced; knob 8 = nominal, squared taper)
 *  tune         → semitone offset (−range … +range, 0 at knob 5)
 *  decay        → seconds (exponential sweep of the voice's decayRange)
 *  tone         → Hz (exponential sweep of the voice's toneRange)
 *  snappy       → 0–1 noise amount (sd: scaled by snappyMax)
 *  pan          → −1 … +1
 *  drive        → 0 … 1 per-voice saturation amount
 *  sendRev/Dly  → 0 … 1 send gain (squared, perceptual)
 *  attack       → seconds (0.4 ms … 35 ms)
 *  sustain      → 0 … 1 envelope sustain level (0 = classic AD / one-shot)
 *  release      → seconds (0 at knob 0; else 10 ms … 1.5 s)
 *  resonance    → Q multiplier (1.0 at knob 5; 0.25× … 4×)
 *  gain         → strip multiplier (1.0 at knob 5; 0 … 2)
 *  compression  → 0 … 1 per-voice compressor amount
 *  eqHigh/Low   → dB (−12 … +12, 0 at knob 5)
 */
function mapKnob(inst, param, v0to10) {
    const d = DEFAULTS[inst] || DEFAULTS.bd;
    const v = clamp01to10(v0to10);
    switch (param) {
        case 'level':
            // squared taper; knob 8 → nominal voice gain, knob 10 → ×1.56 nominal
            return d.gain * Math.pow(v / 8, 2);
        case 'tune':
            return ((v - 5) / 5) * (d.tuneRange || 5);
        case 'decay':
            return expMap(v, d.decayRange[0], d.decayRange[1]);
        case 'tone':
            return expMap(v, d.toneRange[0], d.toneRange[1]);
        case 'snappy':
            return (v / 10) * (d.snappyMax || 1);
        case 'pan':
            return (v - 5) / 5;
        case 'drive':
            return v / 10;
        case 'sendRev':
        case 'sendDly':
            return Math.pow(v / 10, 2);
        case 'attack':
            return expMap(v, 0.0004, 0.035);
        case 'sustain':
            return v / 10;
        case 'release':
            return v <= 0.05 ? 0 : expMap(v, 0.01, 1.5);
        case 'resonance':
            return Math.pow(4, (v - 5) / 5); // 0.25× … 4×, unity at 5
        case 'gain':
            return v / 5; // 0 … 2×, unity at 5
        case 'compression':
            return v / 10;
        case 'eqHigh':
        case 'eqLow':
            return (v - 5) * 2.4; // ±12 dB
        default:
            return v;
    }
}

/** Semitone offset → frequency ratio. */
function tuneRatio(semitones) {
    return Math.pow(2, (semitones || 0) / 12);
}

/** Fresh copy of a voice's default 0–10 knob positions. */
function defaultKnobs(inst) {
    const d = DEFAULTS[inst];
    const fallback = Object.assign({
        level: 8, tune: 5, decay: 5, tone: 5, snappy: 5, pan: 5, drive: 0, sendRev: 0, sendDly: 0
    }, STRIP_KNOB_DEFAULTS);
    return d ? Object.assign({}, d.knobs) : fallback;
}

const GrooveParams = {
    INSTRUMENTS,
    DEFAULTS,
    KEYMAP,
    PARAM_NAMES,
    mapKnob,
    tuneRatio,
    defaultKnobs
};

if (typeof window !== 'undefined') {
    window.GrooveParams = GrooveParams;
}

export { INSTRUMENTS, DEFAULTS, KEYMAP, PARAM_NAMES, mapKnob, tuneRatio, defaultKnobs };
export default GrooveParams;
