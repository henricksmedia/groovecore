/**
 * GrooveCore — js/audio/bus.js  (WS-A)
 *
 * Master bus + send effects + the public window.GrooveAudio surface.
 *
 *   voice strips (Gain → EQ3 → Compressor → Panner from voices.js kit)
 *        ├──────────────► master: Gain → Distortion(0.06, wet 0.3)
 *        │                        → Compressor(−14 dB, 3:1) → Limiter(−1) → Destination
 *        ├── sendRev ──► plate reverb bus ──► master
 *        └── sendDly ──► tape delay bus (hand-built loop: Delay → LPF → tanh → feedback) ──► master
 *
 * Public API (plan §5.3):
 *   await GrooveAudio.init()                     lazy, idempotent, post-gesture
 *   GrooveAudio.trigger(inst, { time, velocity = 100, accent = false, immediate = false })
 *   GrooveAudio.setParam(inst, param, v0to10)    stored, applied at next trigger
 *   GrooveAudio.master.set(param, v0to10)        volume · drive · glue · ceiling · accentAmount
 *   GrooveAudio.buildVoices(destination)         from voices.js (offline-capable)
 *
 * Fails soft: every entry point no-ops when Tone.js or GrooveParams is absent.
 */

function hasDeps() {
    return typeof window !== 'undefined'
        && typeof window.Tone !== 'undefined'
        && !!window.GrooveParams
        && !!(window.GrooveAudio && typeof window.GrooveAudio.buildVoices === 'function');
}

const state = {
    ready: false,
    initPromise: null,
    kit: null,
    strips: {},        // inst -> { panner, revSend, dlySend }
    nodes: null,       // { input, dist, comp, limiter, reverb, revBus, dlyBus, ... }
    pendingParams: [], // setParam calls made before init resolves
    master: {          // 0–10 knob space
        volume: 8,
        drive: 1.2,    // → Distortion 0.06
        glue: 4,       // → Compressor threshold −14 dB
        ceiling: 10,   // → Limiter −1 dB
        accentAmount: 5
    }
};

// ---- master knob maps (0–10 → real units) ----------------------------------

function masterVolumeGain(v) { return Math.pow(v / 10, 1.7) * 1.35; }   // knob 8 ≈ 0.93
function masterDriveAmount(v) { return (v / 10) * 0.5; }                // knob 1.2 → 0.06
function masterGlueThreshold(v) { return -6 - v * 2; }                  // knob 4 → −14 dB
function masterCeiling(v) { return -6 + (v / 10) * 5; }                 // knob 10 → −1 dB

/** Per-voice compressor: amount 0–1 → threshold / ratio (0 = transparent). */
function voiceCompSettings(amount01) {
    const a = Math.min(1, Math.max(0, Number(amount01) || 0));
    return {
        threshold: 0 - a * 36,   // 0 dB … −36 dB
        ratio: 1 + a * 11        // 1:1 … 12:1
    };
}

function clampKnob(v) {
    v = Number(v);
    if (!isFinite(v)) return 0;
    return Math.min(10, Math.max(0, v));
}

// ---- init -------------------------------------------------------------------

async function init() {
    if (!hasDeps()) return false;
    if (state.initPromise) return state.initPromise;
    state.initPromise = buildBus().catch(err => {
        state.initPromise = null; // allow retry after a failed init
        if (typeof console !== 'undefined') console.warn('[GrooveAudio] init failed', err);
        return false;
    });
    return state.initPromise;
}

async function buildBus() {
    const Tone = window.Tone;
    const P = window.GrooveParams;

    // post-gesture unlock (safe to call repeatedly)
    try { await Tone.start(); } catch (e) { /* context resumes on next gesture */ }

    // ---- master chain -------------------------------------------------------
    const input = new Tone.Gain(masterVolumeGain(state.master.volume));
    const dist = new Tone.Distortion(masterDriveAmount(state.master.drive));
    dist.wet.value = 0.3;
    const comp = new Tone.Compressor({
        threshold: masterGlueThreshold(state.master.glue),
        ratio: 3, attack: 0.01, release: 0.15, knee: 6
    });
    const limiter = new Tone.Limiter(masterCeiling(state.master.ceiling));
    input.connect(dist);
    dist.connect(comp);
    comp.connect(limiter);
    limiter.toDestination();

    // ---- plate reverb send bus ---------------------------------------------
    const revBus = new Tone.Gain(1);
    const revEQ = new Tone.Filter({ frequency: 350, type: 'highpass', Q: 0.5 });   // keep the plate out of the lows
    const reverb = new Tone.Reverb({ decay: 2.4, preDelay: 0.02 });
    reverb.wet.value = 1;
    revBus.connect(revEQ);
    revEQ.connect(reverb);
    reverb.connect(input);
    if (reverb.ready && typeof reverb.ready.then === 'function') {
        reverb.ready.catch(() => { /* impulse generation failed; bus stays silent */ });
    }

    // ---- tape delay send bus (hand-built loop: Delay → LPF → tanh → feedback)
    const dlyBus = new Tone.Gain(1);
    const delayNode = new Tone.Delay({ delayTime: 0.27, maxDelay: 2 });
    const dlyLPF = new Tone.Filter({ frequency: 3200, type: 'lowpass', Q: 0.7 });
    const dlySat = new Tone.WaveShaper(x => Math.tanh(1.4 * x) / Math.tanh(1.4), 1024);
    const feedback = new Tone.Gain(0.38);
    const dlyOut = new Tone.Gain(0.85);
    dlyBus.connect(delayNode);
    delayNode.connect(dlyLPF);
    dlyLPF.connect(dlySat);      // in-loop LPF + tanh = the tape character
    dlySat.connect(feedback);
    feedback.connect(delayNode); // regeneration
    dlySat.connect(dlyOut);
    dlyOut.connect(input);

    // ---- voice kit + channel strips ----------------------------------------
    const kit = window.GrooveAudio.buildVoices(null);
    if (!kit) throw new Error('buildVoices returned null');

    const strips = {};
    for (const inst of P.INSTRUMENTS) {
        const knobs = P.defaultKnobs(inst);
        const eq = new Tone.EQ3({
            low: P.mapKnob(inst, 'eqLow', knobs.eqLow),
            mid: 0,
            high: P.mapKnob(inst, 'eqHigh', knobs.eqHigh)
        });
        const compCfg = voiceCompSettings(P.mapKnob(inst, 'compression', knobs.compression));
        const comp = new Tone.Compressor({
            threshold: compCfg.threshold,
            ratio: compCfg.ratio,
            attack: 0.005,
            release: 0.12,
            knee: 8
        });
        const panner = new Tone.Panner(P.mapKnob(inst, 'pan', knobs.pan));
        const revSend = new Tone.Gain(P.mapKnob(inst, 'sendRev', knobs.sendRev));
        const dlySend = new Tone.Gain(P.mapKnob(inst, 'sendDly', knobs.sendDly));
        // voice → EQ → compressor → panner → master (+ sends)
        kit.outputs[inst].connect(eq);
        eq.connect(comp);
        comp.connect(panner);
        panner.connect(input);
        panner.connect(revSend);
        panner.connect(dlySend);
        revSend.connect(revBus);
        dlySend.connect(dlyBus);
        strips[inst] = { eq, comp, panner, revSend, dlySend };
    }

    state.kit = kit;
    state.strips = strips;
    state.nodes = { input, dist, comp, limiter, revBus, revEQ, reverb, dlyBus, delayNode, dlyLPF, dlySat, feedback, dlyOut };
    state.ready = true;

    // replay any setParam calls made before init
    const pending = state.pendingParams.splice(0);
    for (const [inst, param, v] of pending) applyParam(inst, param, v);

    return true;
}

// ---- per-voice params -------------------------------------------------------

function applyParam(inst, param, v0to10) {
    const P = window.GrooveParams;
    const v = clampKnob(v0to10);
    // kit stores everything (and applies level/gain immediately to the voice Gain)
    state.kit.setParam(inst, param, v);
    const strip = state.strips[inst];
    if (!strip) return;
    // strip FX apply immediately (never envelope-driven)
    try {
        if (param === 'pan') strip.panner.pan.rampTo(P.mapKnob(inst, 'pan', v), 0.02);
        else if (param === 'sendRev') strip.revSend.gain.rampTo(P.mapKnob(inst, 'sendRev', v), 0.02);
        else if (param === 'sendDly') strip.dlySend.gain.rampTo(P.mapKnob(inst, 'sendDly', v), 0.02);
        else if (param === 'eqHigh') strip.eq.high.value = P.mapKnob(inst, 'eqHigh', v);
        else if (param === 'eqLow') strip.eq.low.value = P.mapKnob(inst, 'eqLow', v);
        else if (param === 'compression') {
            const cfg = voiceCompSettings(P.mapKnob(inst, 'compression', v));
            strip.comp.threshold.value = cfg.threshold;
            strip.comp.ratio.value = cfg.ratio;
        }
    } catch (e) { /* node disposed mid-teardown */ }
}

function setParam(inst, param, v0to10) {
    if (!hasDeps()) return;
    const P = window.GrooveParams;
    if (P.INSTRUMENTS.indexOf(inst) === -1 || P.PARAM_NAMES.indexOf(param) === -1) return;
    if (!state.ready) {
        // keep only the latest value per (inst, param)
        state.pendingParams = state.pendingParams.filter(p => !(p[0] === inst && p[1] === param));
        state.pendingParams.push([inst, param, clampKnob(v0to10)]);
        return;
    }
    applyParam(inst, param, v0to10);
}

function getParam(inst, param) {
    if (state.ready && state.kit) return state.kit.getParam(inst, param);
    for (let i = state.pendingParams.length - 1; i >= 0; i--) {
        const p = state.pendingParams[i];
        if (p[0] === inst && p[1] === param) return p[2];
    }
    const P = window.GrooveParams;
    return P ? P.defaultKnobs(inst)[param] : undefined;
}

// ---- trigger ----------------------------------------------------------------

function trigger(inst, opts) {
    if (!hasDeps()) return;
    opts = opts || {};
    if (!state.ready) {
        // lazy: first (gesture-driven) trigger kicks off init; the hit itself
        // is dropped rather than firing into a suspended context.
        init();
        return;
    }
    const Tone = window.Tone;
    let t;
    if (opts.immediate) t = Tone.immediate();                    // pad path, no lookahead
    else if (typeof opts.time === 'number') t = opts.time;       // Transport callback time
    else t = Tone.now();

    state.kit.trigger(inst, {
        time: t,
        velocity: (opts.velocity == null) ? 100 : opts.velocity,
        accent: !!opts.accent,
        accentAmount: state.master.accentAmount,
        tuneOffset: (typeof opts.tuneOffset === 'number') ? opts.tuneOffset : 0
    });
}

// ---- master -----------------------------------------------------------------

const master = {
    /** volume · drive · glue · ceiling · accentAmount — all 0–10 knob space. */
    set(param, v0to10) {
        const v = clampKnob(v0to10);
        if (!(param in state.master)) return;
        state.master[param] = v;
        if (!state.ready || !state.nodes) return; // stored; applied when the bus builds
        const n = state.nodes;
        try {
            switch (param) {
                case 'volume': n.input.gain.rampTo(masterVolumeGain(v), 0.03); break;
                case 'drive': n.dist.distortion = masterDriveAmount(v); break;
                case 'glue': n.comp.threshold.value = masterGlueThreshold(v); break;
                case 'ceiling': n.limiter.threshold.value = masterCeiling(v); break;
                case 'accentAmount': break; // read per-hit in trigger()
            }
        } catch (e) { /* node disposed */ }
    },
    get(param) { return state.master[param]; }
};

// ---- attach public API ------------------------------------------------------

if (typeof window !== 'undefined') {
    window.GrooveAudio = Object.assign(window.GrooveAudio || {}, {
        init,
        trigger,
        setParam,
        getParam,
        master,
        /** internal — exposed for test pages and the stems exporter */
        _state: state
    });
    // live getter (Object.assign would snapshot the value, not the accessor)
    Object.defineProperty(window.GrooveAudio, 'ready', {
        configurable: true,
        get() { return state.ready; }
    });
}

export { init, trigger, setParam, getParam, master };
