/**
 * GrooveCore — js/core/events.js  (WS-A)
 *
 * window.GrooveEvents — the canonical event-list generator (Decree 2).
 *
 * computePatternEvents(patternOrChain, opts) is the ONLY source of "which
 * hits happen when, how loud" — consumed identically by the live scheduler,
 * the MIDI exporter, and the WAV/stem renderer, so preview == export.
 *
 * Pure function: no DOM, no Tone, no globals mutated. Deterministic by
 * default — probability gating and (opt-in) humanize both draw from a
 * seeded mulberry32 PRNG, so the same inputs + seed always produce a
 * byte-identical event list.
 *
 * See docs/UPGRADE-PLAN.md §5.4 and §4 (data model v2).
 */

// Local copy of the canonical voice order — keeps this module dependency-free
// and the iteration order (hence PRNG consumption order) frozen forever.
const INSTRUMENTS = [
    'bd', 'sd', 'lt', 'mt', 'ht', 'rim', 'cp', 'hc', 'mc', 'lc',
    'cb', 'cl', 'ma', 'ch', 'oh', 'cym', 'cr'
];

/**
 * mulberry32 — tiny seeded PRNG. Returns a function yielding floats in [0, 1).
 * Same seed → same sequence, on every platform.
 */
function mulberry32(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Normalize a cell value to velocity 1–127 (legacy `true` = 100). */
function cellVelocity(value) {
    if (value === true) return 100;
    const v = Math.round(Number(value));
    if (!isFinite(v) || v < 1) return 0;   // 0 / false / garbage = no hit
    return Math.min(127, v);
}

/** Normalize patternOrChain to an array of bar objects { part1, length1, sfx1 }. */
function toBars(patternOrChain) {
    if (!patternOrChain) return [];
    if (Array.isArray(patternOrChain)) {
        return patternOrChain.filter(p => p && (Array.isArray(p.part1) || Array.isArray(p)));
    }
    return [patternOrChain];
}

/**
 * computePatternEvents(patternOrChain, opts)
 *   patternOrChain: one pattern object { part1: [cells], length1, sfx1 } or an
 *                   array of them (a chain — each element is one bar).
 *   opts = {
 *     swing: 0–10            (odd 16ths delayed swing/10 × 0.55 × stepTicks)
 *     shufflePerInst: {}     (per-instrument swing override, same 0–10 scale)
 *     ppq: 480
 *     bpm: 120               (used only to derive timeSec and ms→tick sizes)
 *     deterministic: true
 *     seed: 42
 *     humanize: 0            (0–10; opt-in timing/velocity jitter, seeded)
 *   }
 *
 * → sorted [{ step, barIndex, inst, velocity, accent, tick480, timeSec }]
 *
 * Expands per-step FX from pattern.sfx1 (key "step:inst"):
 *   { r: 2|3|4 }  ratchet — evenly-spaced sub-hits with decaying velocity
 *   { f: 1 }      flam — grace note at 55% velocity, min(28 ms, 25% of a 16th) early
 *   { p: 0–100 }  probability — seeded PRNG gate (absent = 100)
 *   { m: … }      micro-shift — schema-reserved, ignored in P0
 */
function computePatternEvents(patternOrChain, opts) {
    opts = opts || {};
    const ppq = (opts.ppq > 0) ? opts.ppq : 480;
    const bpm = (opts.bpm > 0) ? opts.bpm : 120;
    const swing = clampSwing(opts.swing);
    const shufflePerInst = opts.shufflePerInst || {};
    const deterministic = (opts.deterministic !== false);
    const seed = (opts.seed == null) ? 42 : (opts.seed | 0);
    const humanize = deterministic ? 0 : clampSwing(opts.humanize);

    const stepTicks = ppq / 4;                       // one 16th
    const ticksPerSec = (ppq * bpm) / 60;
    const flamTicks = Math.min(0.028 * ticksPerSec, 0.25 * stepTicks);
    const rng = mulberry32(seed);

    const bars = toBars(patternOrChain);
    const events = [];
    let seq = 0;               // insertion order — stable-sort tie-breaker
    let barOffsetTicks = 0;

    for (let barIndex = 0; barIndex < bars.length; barIndex++) {
        const bar = bars[barIndex];
        const cells = Array.isArray(bar.part1) ? bar.part1 : (Array.isArray(bar) ? bar : []);
        const length = (bar.length1 > 0) ? Math.min(bar.length1, cells.length || bar.length1)
            : (cells.length || 16);
        const sfx1 = bar.sfx1 || {};

        for (let step = 0; step < length; step++) {
            const cell = cells[step];
            if (!cell) continue;
            const stepAccent = !!cell.accent;

            for (const inst of INSTRUMENTS) {
                const velocity = cellVelocity(cell[inst]);
                if (!velocity) continue;

                const fx = sfx1[step + ':' + inst] || null;

                // probability gate (seeded — deterministic per seed)
                if (fx && fx.p != null && fx.p < 100) {
                    if (rng() * 100 >= fx.p) continue;
                }

                // swing: odd 16ths delayed by swing/10 × 0.55 × stepTicks
                const instSwing = (shufflePerInst[inst] != null)
                    ? clampSwing(shufflePerInst[inst]) : swing;
                const swingTicks = (step % 2 === 1)
                    ? (instSwing / 10) * 0.55 * stepTicks : 0;

                let baseTick = barOffsetTicks + step * stepTicks + swingTicks;

                if (humanize > 0) {
                    baseTick += (rng() * 2 - 1) * (humanize / 10) * 0.08 * stepTicks;
                    baseTick = Math.max(0, baseTick);
                }

                const ratchet = (fx && (fx.r === 2 || fx.r === 3 || fx.r === 4)) ? fx.r : 1;
                const flam = !!(fx && fx.f);

                // flam grace note: 55% velocity, ahead of the main hit
                if (flam) {
                    const graceTick = Math.max(0, baseTick - flamTicks);
                    push(events, step, barIndex, inst,
                        Math.max(1, Math.round(velocity * 0.55)), stepAccent,
                        graceTick, ticksPerSec, seq++);
                }

                // main hit + ratchet sub-hits (evenly spaced, decaying velocity)
                for (let r = 0; r < ratchet; r++) {
                    const subTick = baseTick + (r * stepTicks) / ratchet;
                    const subVel = (r === 0) ? velocity
                        : Math.max(1, Math.round(velocity * (1 - 0.15 * r)));
                    push(events, step, barIndex, inst, subVel, stepAccent,
                        subTick, ticksPerSec, seq++);
                }
            }
        }
        barOffsetTicks += length * stepTicks;
    }

    // sort by tick, then insertion order (stable and deterministic everywhere)
    events.sort((a, b) => (a.tick480 - b.tick480) || (a._seq - b._seq));
    for (const e of events) delete e._seq;
    return events;
}

function push(events, step, barIndex, inst, velocity, accent, tick, ticksPerSec, seq) {
    const tick480 = Math.round(tick);
    events.push({
        step,
        barIndex,
        inst,
        velocity,
        accent,
        tick480,
        timeSec: tick480 / ticksPerSec,
        _seq: seq
    });
}

function clampSwing(v) {
    v = Number(v);
    if (!isFinite(v) || v < 0) return 0;
    return Math.min(10, v);
}

const GrooveEvents = {
    computePatternEvents,
    mulberry32,
    INSTRUMENTS
};

if (typeof window !== 'undefined') {
    window.GrooveEvents = GrooveEvents;
}

export { computePatternEvents, mulberry32, INSTRUMENTS };
export default GrooveEvents;
