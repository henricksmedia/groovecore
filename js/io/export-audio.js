/**
 * GrooveCore — js/io/export-audio.js  (WS-B)
 *
 * Offline WAV rendering: full mix + per-instrument stems, via
 * Tone.Offline + GrooveAudio.buildVoices (the engine's offline-capable
 * kit factory — zero engine changes needed, plan §5.3).
 *
 * Decree 2 holds here too: the schedule comes from
 * window.GrooveEvents.computePatternEvents — the SAME event list the live
 * scheduler and the MIDI exporter consume, so what you hear is what renders.
 * Swing/shuffle knobs are always audible (they are part of the sound);
 * humanize follows the shared seeded export options (GCExportMIDI).
 *
 * Stems strategy: one offline render per active instrument plus one for the
 * full mix. Every render fires the COMPLETE event list — a stem simply zeroes
 * every other voice's level/strip gain — so cross-voice behavior (CH-chokes-OH)
 * is identical in stems and mix, and every file is sample-aligned: bar 1
 * starts exactly at t = 0. Offline rendering runs far faster than realtime,
 * keeping a 4-pattern chain within the ≤10 s budget.
 *
 * renderMix()   → tiled ~24s AI-ready mix by default (asHeard for one cycle)
 * renderStems() → groovecore-<name>-stems.zip
 *                 (one WAV per active instrument + mix.wav + the .mid)
 * renderAI()    → same tiling as renderMix, AI-oriented filename
 *
 * Honors mute/solo, level/gain/tune/pan knobs, per-step velocity/accent/sfx.
 * Progress via window.GCToast when present. ES module; exports init(GC);
 * attaches window.GCExportAudio. Fails soft when dependencies are missing.
 */

// Own dependencies (WS-J integration fix): nothing else imports these, and
// both attach their window globals (GCWavEncode / GCZip) on load.
import './wav-encode.js';
import './zip.js';
import { exportStem } from './export-name.js';

const SAMPLE_RATE = 44100;
const RENDER_TAIL = 1.5; // seconds of decay tail after the last bar (dry)

/** Wet renders carry the send FX: the plate's 2.4s decay + delay regeneration
 *  need a longer tail than dry voice envelopes. */
function tailSec(dry) { return dry ? RENDER_TAIL : RENDER_TAIL + 2; }

const KNOB_SUFFIX = {
    bd: 'Bd', sd: 'Sd', lt: 'Lt', mt: 'Mt', ht: 'Ht', rim: 'Rim', cp: 'Cp',
    hc: 'Hc', mc: 'Mc', lc: 'Lc', cb: 'Cb', cl: 'Cl', ma: 'Ma',
    ch: 'Ch', oh: 'Oh', cym: 'Cym', cr: 'Cr'
};

let GCRef = null;
let rendering = false;

function gc() { return GCRef || (typeof window !== 'undefined' ? window.GC : null); }

function deps() {
    if (typeof window === 'undefined') return null;
    if (typeof window.Tone === 'undefined') return null;
    const audio = window.GrooveAudio;
    const ev = window.GrooveEvents;
    const wav = window.GCWavEncode;
    if (!audio || typeof audio.buildVoices !== 'function') return null;
    if (!ev || typeof ev.computePatternEvents !== 'function') return null;
    if (!wav || typeof wav.encodeWav !== 'function') return null;
    return { Tone: window.Tone, audio, ev, wav };
}

function toast(msg, type) {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
        return window.GCToast.show(msg, { type: type || 'info' });
    }
    console.log('[gc-export-audio] ' + msg);
    return null;
}

/** Long-lived progress toast whose text we update in place. */
function progressToast(msg) {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
        const t = window.GCToast.show(msg, { type: 'info', duration: 0 });
        return {
            update(text) {
                try {
                    const el = t && t.el && t.el.querySelector('.gc-toast-msg');
                    if (el) el.textContent = text;
                } catch (e) { /* noop */ }
            },
            close() { try { if (t && t.close) t.close(); } catch (e) { /* noop */ } }
        };
    }
    console.log('[gc-export-audio] ' + msg);
    return { update(text) { console.log('[gc-export-audio] ' + text); }, close() {} };
}

// ---------------------------------------------------------------------------
// State readers (mirrors export-midi so both exports agree)
// ---------------------------------------------------------------------------

function tempoBpm() {
    const g = gc();
    const t = g && Number(g.tempo);
    return (isFinite(t) && t > 0) ? t : 120;
}

function knob(name) {
    const g = gc();
    const v = g && g.knobValues ? Number(g.knobValues[name]) : NaN;
    return isFinite(v) ? v : null;
}

function audible(inst) {
    const g = gc();
    const ms = g && g.muteSoloState;
    if (!ms) return true;
    if (ms.muted && typeof ms.muted.has === 'function' && ms.muted.has(inst)) return false;
    if (ms.soloed && typeof ms.soloed.has === 'function' && ms.soloed.size > 0 && !ms.soloed.has(inst)) return false;
    return true;
}

/** Source bars: the chain when it is active and filled, else the current pattern. */
function resolveSource(mode) {
    const g = gc();
    if (!g || !g.patterns) return null;

    let chain = null;
    if (window.GCChain && window.GCChain.state) chain = window.GCChain.state;

    const wantChain = (mode === 'chain') ||
        (mode !== 'pattern' && chain && chain.mode === 'chain');

    if (wantChain && chain && Array.isArray(chain.slots)) {
        const bars = [];
        for (const slot of chain.slots) {
            if (!slot) continue;
            const bank = g.patterns[slot.v];
            if (bank && bank[slot.i]) bars.push(bank[slot.i]);
        }
        if (bars.length) return { bars, name: exportStem('chain'), midiMode: 'chain' };
        if (mode === 'chain') return null; // chain explicitly requested but empty
    }

    const bank = g.patterns[g.variation];
    const p = bank && bank[g.currentPattern];
    if (!p) return null;
    return { bars: [p], name: exportStem('pattern'), midiMode: 'pattern' };
}

function buildEvents(bars) {
    const d = deps();
    const shufflePerInst = {};
    for (const inst of Object.keys(KNOB_SUFFIX)) {
        const s = knob('shuffle' + KNOB_SUFFIX[inst]);
        if (s != null && s > 0) shufflePerInst[inst] = s;
    }
    // Humanize follows the shared seeded export options so MIDI + WAV agree.
    const midiOpts = (window.GCExportMIDI && typeof window.GCExportMIDI.getOptions === 'function')
        ? window.GCExportMIDI.getOptions()
        : { humanize: false, seed: 42 };
    const humanizeAmt = midiOpts.humanize ? (knob('humanize') || 5) : 0;

    const events = d.ev.computePatternEvents(bars, {
        swing: knob('swing') || 0,
        shufflePerInst,
        ppq: 480,
        bpm: tempoBpm(),
        deterministic: !(midiOpts.humanize && humanizeAmt > 0),
        seed: midiOpts.seed,
        humanize: humanizeAmt
    });
    return events.filter(e => audible(e.inst));
}

function sourceSteps(bars) {
    let steps = 0;
    for (const bar of bars) {
        const cells = Array.isArray(bar.part1) ? bar.part1 : [];
        steps += (bar.length1 > 0) ? Math.min(bar.length1, cells.length || bar.length1) : (cells.length || 16);
    }
    return steps;
}

function totalDuration(bars, dry) {
    const stepSec = 60 / tempoBpm() / 4;
    return sourceSteps(bars) * stepSec + tailSec(dry);
}

/**
 * Tile a rendered single pass into `sets` seamless repetitions by summing the
 * pass at each bar-aligned offset. The pass is deterministic, so this is
 * sample-exact vs. scheduling every repetition — at a fraction of the render
 * cost (one offline pass instead of hundreds of live voice graphs). Overlap
 * regions (a pass's decay tail under the next pass's start) sum linearly,
 * exactly like overlapping voices do inside one render.
 */
function tilePass(pass, baseSec, sets, tailSec) {
    const sr = pass.sampleRate;
    const baseLen = Math.round(baseSec * sr);
    const totalLen = baseLen * sets + Math.round(tailSec * sr);
    const left = new Float32Array(totalLen);
    const right = new Float32Array(totalLen);
    for (let s = 0; s < sets; s++) {
        const off = s * baseLen;
        const n = Math.min(pass.left.length, totalLen - off);
        for (let i = 0; i < n; i++) {
            left[off + i] += pass.left[i];
            right[off + i] += pass.right[i];
        }
    }
    return { sampleRate: sr, left, right };
}

// ---------------------------------------------------------------------------
// Offline rendering
// ---------------------------------------------------------------------------

/** Master volume knob (0–10) → linear gain, matching js/audio/bus.js. */
function masterGain() {
    const v = knob('masterVolume');
    const k = (v == null) ? 8 : Math.min(10, Math.max(0, v));
    return Math.pow(k / 10, 1.7) * 1.35;
}

/** Live master-knob value (0–10) from the engine, with a bus.js default. */
function masterKnob(name, fallback) {
    const audio = window.GrooveAudio;
    if (audio && audio.master && typeof audio.master.get === 'function') {
        const v = Number(audio.master.get(name));
        if (isFinite(v)) return Math.min(10, Math.max(0, v));
    }
    return fallback;
}

/**
 * Offline replica of the bus.js master chain:
 * Gain(volume) → Distortion(drive, wet 0.3) → Compressor(glue) → Limiter(ceiling).
 * Without it, hot mixes would clip in the WAV that never clip live.
 * Returns the chain's INPUT node (already connected through to `dest`).
 */
function buildOfflineMaster(Tone, dest) {
    // Engine master volume first (what is heard); legacy knobValues fallback.
    const vol = masterKnob('volume', null);
    const input = new Tone.Gain(vol != null ? Math.pow(vol / 10, 1.7) * 1.35 : masterGain());
    const dist = new Tone.Distortion((masterKnob('drive', 1.2) / 10) * 0.5);
    dist.wet.value = 0.3;
    const comp = new Tone.Compressor({
        threshold: -6 - masterKnob('glue', 4) * 2,
        ratio: 3, attack: 0.01, release: 0.15, knee: 6
    });
    const limiter = new Tone.Limiter(-6 + (masterKnob('ceiling', 10) / 10) * 5);
    input.connect(dist);
    dist.connect(comp);
    comp.connect(limiter);
    limiter.connect(dest);
    return input;
}

/**
 * One offline render of the full event list.
 * soloInst: null → the mix; an instrument code → that stem (every other
 * voice's level is zeroed, but ALL events still fire so cross-voice behavior
 * like CH-chokes-OH is preserved sample-for-sample).
 */
async function renderOne(events, durationSec, soloInst, renderOpts) {
    const d = deps();
    const Tone = d.Tone;
    const live = d.audio;
    const dry = !!(renderOpts && renderOpts.dry);
    const accentAmount = (live.master && typeof live.master.get === 'function')
        ? live.master.get('accentAmount') : 5;
    const P = window.GrooveParams;

    /** Live engine knob value (0-10) — the single authority for what is heard. */
    const liveParam = (inst, param, fallback) => {
        if (typeof live.getParam === 'function') {
            const v = Number(live.getParam(inst, param));
            if (isFinite(v)) return Math.min(10, Math.max(0, v));
        }
        return fallback;
    };

    const buffer = await Tone.Offline(async () => {
        const dest = Tone.getDestination();
        const master = buildOfflineMaster(Tone, dest);

        // ---- send buses: replica of the live bus.js graph (skipped when dry).
        let revBus = null;
        let dlyBus = null;
        if (!dry) {
            try {
                revBus = new Tone.Gain(1);
                const revEQ = new Tone.Filter({ frequency: 350, type: 'highpass', Q: 0.5 });
                const reverb = new Tone.Reverb({ decay: 2.4, preDelay: 0.02 });
                reverb.wet.value = 1;
                revBus.connect(revEQ);
                revEQ.connect(reverb);
                reverb.connect(master);
                if (reverb.ready && typeof reverb.ready.then === 'function') await reverb.ready;
            } catch (e) {
                // Convolution IR generation can fail inside an offline context —
                // fall back to an algorithmic plate so wet exports never silently
                // lose their reverb sends.
                try {
                    revBus = new Tone.Gain(1);
                    const fv = new Tone.Freeverb({ roomSize: 0.85, dampening: 3000 });
                    fv.wet.value = 1;
                    revBus.connect(fv);
                    fv.connect(master);
                } catch (e2) { revBus = null; }
            }

            dlyBus = new Tone.Gain(1);
            const delayNode = new Tone.Delay({ delayTime: 0.27, maxDelay: 2 });
            const dlyLPF = new Tone.Filter({ frequency: 3200, type: 'lowpass', Q: 0.7 });
            const dlySat = new Tone.WaveShaper(x => Math.tanh(1.4 * x) / Math.tanh(1.4), 1024);
            const feedback = new Tone.Gain(0.38);
            const dlyOut = new Tone.Gain(0.85);
            dlyBus.connect(delayNode);
            delayNode.connect(dlyLPF);
            dlyLPF.connect(dlySat);
            dlySat.connect(feedback);
            feedback.connect(delayNode);
            dlySat.connect(dlyOut);
            dlyOut.connect(master);
        }

        const kit = d.audio.buildVoices(null);
        if (!kit) return;

        const insts = (P && P.INSTRUMENTS) ? P.INSTRUMENTS : Object.keys(KNOB_SUFFIX);
        const params = (P && P.PARAM_NAMES)
            ? P.PARAM_NAMES
            : ['level', 'tune', 'decay', 'tone', 'snappy', 'pan', 'drive', 'sendRev', 'sendDly'];

        for (const inst of insts) {
            // Mirror EVERY stored engine param (level/tune/decay/tone/snappy/
            // drive/attack/…/eq) so the offline voice is shaped like the live one.
            for (const param of params) {
                const v = liveParam(inst, param, null);
                if (v != null) kit.setParam(inst, param, v);
            }
            if (soloInst && inst !== soloInst) {
                kit.setParam(inst, 'level', 0); // silent, but still triggers (chokes intact)
            }

            // strip: EQ → compressor → panner → master (+ sends), same as live bus
            const eqHighV = liveParam(inst, 'eqHigh', 5);
            const eqLowV = liveParam(inst, 'eqLow', 5);
            const compV = liveParam(inst, 'compression', 0);
            const eq = new Tone.EQ3({
                low: P ? P.mapKnob(inst, 'eqLow', eqLowV) : (eqLowV - 5) * 2.4,
                mid: 0,
                high: P ? P.mapKnob(inst, 'eqHigh', eqHighV) : (eqHighV - 5) * 2.4
            });
            const compAmt = P ? P.mapKnob(inst, 'compression', compV) : (compV / 10);
            const comp = new Tone.Compressor({
                threshold: 0 - compAmt * 36,
                ratio: 1 + compAmt * 11,
                attack: 0.005,
                release: 0.12,
                knee: 8
            });
            const panV = liveParam(inst, 'pan', 5);
            const panner = new Tone.Panner(P ? P.mapKnob(inst, 'pan', panV) : (panV - 5) / 5);
            kit.outputs[inst].connect(eq);
            eq.connect(comp);
            comp.connect(panner);
            panner.connect(master);
            if (!dry) {
                const revV = liveParam(inst, 'sendRev', 0);
                const dlyV = liveParam(inst, 'sendDly', 0);
                if (revBus && revV > 0) {
                    const revSend = new Tone.Gain(P ? P.mapKnob(inst, 'sendRev', revV) : revV / 10);
                    panner.connect(revSend);
                    revSend.connect(revBus);
                }
                if (dlyBus && dlyV > 0) {
                    const dlySend = new Tone.Gain(P ? P.mapKnob(inst, 'sendDly', dlyV) : dlyV / 10);
                    panner.connect(dlySend);
                    dlySend.connect(dlyBus);
                }
            }
        }

        // Schedule every hit up front, inside the Offline setup callback. This
        // MUST NOT move into transport callbacks: those fire during rendering,
        // after Tone has restored the live context, so voices created there
        // connect to the live graph and the offline buffer renders silent.
        const g = gc();
        const pitchBendMap = (g && g.patternControls && g.patternControls.pitchBend) || {};
        for (const ev of events) {
            const bendKnob = Number(pitchBendMap[ev.inst]);
            const tuneOffset = isFinite(bendKnob) ? ((bendKnob - 5) / 5) * 0.5 : 0;
            kit.trigger(ev.inst, {
                time: ev.timeSec,
                velocity: ev.velocity,
                accent: ev.accent,
                accentAmount,
                tuneOffset
            });
        }
    }, durationSec, 2, SAMPLE_RATE);

    // Plain stereo Float32 copies — scaled + encoded by the caller.
    const native = (typeof buffer.get === 'function') ? buffer.get() : buffer;
    return {
        sampleRate: native.sampleRate,
        left: native.getChannelData(0),
        right: native.numberOfChannels > 1 ? native.getChannelData(1) : native.getChannelData(0)
    };
}

/** Peak absolute sample across both channels. */
function bufferPeak(b) {
    let peak = 0;
    for (const ch of [b.left, b.right]) {
        for (let i = 0; i < ch.length; i++) {
            const a = Math.abs(ch[i]);
            if (a > peak) peak = a;
        }
    }
    return peak;
}

/**
 * Encode to 16-bit WAV with a uniform gain scale. Tone.Limiter is not
 * brickwall (transients overshoot), so the caller derives ONE scale from the
 * mix peak and applies it to the mix AND every stem — no clipping, and the
 * stems keep their exact level relationship to the mix. Deterministic.
 */
function encodeScaled(b, scale) {
    const d = deps();
    if (scale === 1) return d.wav.encodeWav(b);
    const left = new Float32Array(b.left.length);
    const right = new Float32Array(b.right.length);
    for (let i = 0; i < b.left.length; i++) left[i] = b.left[i] * scale;
    for (let i = 0; i < b.right.length; i++) right[i] = b.right[i] * scale;
    return d.wav.encodeWav({ sampleRate: b.sampleRate, left, right });
}

/** Uniform downward-only safety scale from the mix peak. */
function safetyScale(peak) {
    return (peak > 0.999) ? 0.999 / peak : 1;
}

// ---------------------------------------------------------------------------
// Download plumbing
// ---------------------------------------------------------------------------

function download(bytes, filename, mime) {
    const blob = new Blob([bytes], { type: mime || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

/**
 * renderMix(mode, opts) — stereo WAV of the mix.
 * mode: 'pattern' | 'chain' | undefined (auto: chain when the chain is active)
 * opts.dry      — omit send FX (reverb/delay)
 * opts.asHeard  — export a single pattern/chain cycle only (no tiling)
 * opts.loopTo   — target music length in seconds when tiling (default 24;
 *                 Suno/Udio-ready). Ignored when asHeard is true.
 *
 * Default (wet, no asHeard) tiles the groove on bar boundaries to ~24s so
 * AI music generators get a usable reference — not a 2-second one-bar clip.
 */
async function renderMix(mode, opts) {
    if (rendering) { toast('A render is already in progress', 'error'); return; }
    if (!deps()) { toast('WAV export unavailable: audio engine modules missing', 'error'); return; }
    const dry = !!(opts && opts.dry);
    const asHeard = !!(opts && opts.asHeard);
    const loopTo = (!asHeard && opts && typeof opts.loopTo === 'number' && opts.loopTo > 0)
        ? opts.loopTo
        : (asHeard ? 0 : 24);

    const source = resolveSource(mode);
    if (!source) { toast(mode === 'chain' ? 'No chain slots to render — fill the chain bar first' : 'No pattern to render', 'error'); return; }
    const events = buildEvents(source.bars);
    if (!events.length) { toast('Nothing to render: the pattern is empty (or fully muted)', 'error'); return; }

    const steps = sourceSteps(source.bars);
    const baseSec = steps * (60 / tempoBpm() / 4);
    const tail = tailSec(dry);

    rendering = true;
    const progress = progressToast(
        loopTo > 0
            ? ((dry ? 'Rendering dry WAV mix' : 'Rendering WAV mix') + '…')
            : (dry ? 'Rendering dry WAV mix…' : 'Rendering WAV mix…')
    );
    try {
        let buf;
        let filename;
        let sets = 1;
        let musicSec = baseSec;

        if (loopTo > 0 && baseSec > 0) {
            const maxSets = Math.max(1, Math.floor(58 / baseSec));
            sets = Math.max(1, Math.min(Math.ceil(loopTo / baseSec), maxSets));
            musicSec = sets * baseSec;
            progress.update(
                (dry ? 'Rendering dry WAV mix' : 'Rendering WAV mix') +
                ' (' + Math.round(musicSec) + 's)…'
            );
            const pass = await renderOne(events, baseSec + tail, null, { dry });
            buf = tilePass(pass, baseSec, sets, tail);
            filename = 'groovecore-' + source.name + '-' + Math.round(tempoBpm()) + 'bpm' +
                (dry ? '-mix-dry-' : '-mix-') + Math.round(musicSec + tail) + 's.wav';
        } else {
            buf = await renderOne(events, totalDuration(source.bars, dry), null, { dry });
            filename = 'groovecore-' + source.name + (dry ? '-mix-dry.wav' : '-mix.wav');
        }

        const wavBytes = encodeScaled(buf, safetyScale(bufferPeak(buf)));
        download(wavBytes, filename, 'audio/wav');
        progress.close();
        if (loopTo > 0 && musicSec < 6) {
            toast('Exported ' + filename + ' — under 6s even looped; Suno needs at least 6s', 'error');
        } else if (loopTo > 0) {
            toast('WAV exported: ' + filename + ' (' + sets + '× loop)', 'success');
        } else {
            toast('WAV exported: ' + filename, 'success');
        }
    } catch (e) {
        progress.close();
        console.warn('[gc-export-audio] mix render failed', e);
        toast('WAV render failed: ' + (e && e.message ? e.message : e), 'error');
    } finally {
        rendering = false;
    }
}

/**
 * renderStems(mode) — groovecore-<name>-stems.zip:
 * one WAV per active instrument + mix.wav + the matching .mid.
 */
async function renderStems(mode) {
    if (rendering) { toast('A render is already in progress', 'error'); return; }
    if (!deps()) { toast('Stems export unavailable: audio engine modules missing', 'error'); return; }
    if (!window.GCZip || typeof window.GCZip.buildZip !== 'function') {
        toast('Stems export unavailable: zip module missing', 'error'); return;
    }

    const source = resolveSource(mode);
    if (!source) { toast('No pattern to render', 'error'); return; }
    const events = buildEvents(source.bars);
    if (!events.length) { toast('Nothing to render: the pattern is empty (or fully muted)', 'error'); return; }

    // Active instruments, in canonical order
    const present = new Set(events.map(e => e.inst));
    const order = (window.GrooveParams && window.GrooveParams.INSTRUMENTS) || Object.keys(KNOB_SUFFIX);
    const activeInsts = order.filter(i => present.has(i));

    rendering = true;
    const total = activeInsts.length + 1;
    const progress = progressToast('Rendering stems 0/' + total + '…');
    const duration = totalDuration(source.bars, false);
    const files = [];

    try {
        // full mix first — its peak sets the ONE safety scale shared by every file
        progress.update('Rendering stems 1/' + total + ': mix…');
        const mixBuf = await renderOne(events, duration, null);
        const scale = safetyScale(bufferPeak(mixBuf));
        files.push({ name: 'mix.wav', data: encodeScaled(mixBuf, scale) });

        // one solo render per active instrument (same scale — levels stay relative)
        for (let i = 0; i < activeInsts.length; i++) {
            const inst = activeInsts[i];
            progress.update('Rendering stems ' + (i + 2) + '/' + total + ': ' + inst + '…');
            const stemBuf = await renderOne(events, duration, inst);
            files.push({ name: inst + '.wav', data: encodeScaled(stemBuf, scale) });
        }

        // the matching MIDI file rides along in the zip
        if (window.GCExportMIDI && typeof window.GCExportMIDI.buildBytes === 'function') {
            const mid = window.GCExportMIDI.buildBytes(source.midiMode);
            if (mid && mid.bytes) files.push({ name: mid.filename, data: mid.bytes });
        }

        progress.update('Packing zip…');
        const zipBytes = window.GCZip.buildZip(files);
        const filename = 'groovecore-' + source.name + '-stems.zip';
        download(zipBytes, filename, 'application/zip');
        progress.close();
        toast('Stems exported: ' + filename + ' (' + files.length + ' files)', 'success');
    } catch (e) {
        progress.close();
        console.warn('[gc-export-audio] stems render failed', e);
        toast('Stems render failed: ' + (e && e.message ? e.message : e), 'error');
    } finally {
        rendering = false;
    }
}

/**
 * renderAI(targetSec) — one WAV sized for AI music tools (Suno, Udio, …):
 * the current pattern (or active chain) looped seamlessly on bar boundaries
 * until it reaches ~targetSec (default 24 s; Suno accepts 6–60 s references),
 * capped so the total never exceeds ~58 s, plus the normal decay tail.
 */
async function renderAI(targetSec) {
    if (rendering) { toast('A render is already in progress', 'error'); return; }
    if (!deps()) { toast('WAV export unavailable: audio engine modules missing', 'error'); return; }

    const source = resolveSource();
    if (!source) { toast('No pattern to render', 'error'); return; }
    const events = buildEvents(source.bars);
    if (!events.length) { toast('Nothing to render: the pattern is empty (or fully muted)', 'error'); return; }

    const steps = sourceSteps(source.bars);
    const baseSec = steps * (60 / tempoBpm() / 4);
    const target = (isFinite(targetSec) && targetSec > 0) ? targetSec : 24;
    const maxSets = Math.max(1, Math.floor(58 / baseSec));
    const sets = Math.max(1, Math.min(Math.ceil(target / baseSec), maxSets));
    const musicSec = sets * baseSec;

    rendering = true;
    const progress = progressToast('Rendering AI-ready WAV (' + Math.round(musicSec) + 's)…');
    try {
        const pass = await renderOne(events, baseSec + tailSec(false), null, { dry: false });
        const buf = tilePass(pass, baseSec, sets, tailSec(false));
        const wavBytes = encodeScaled(buf, safetyScale(bufferPeak(buf)));
        const filename = 'groovecore-' + source.name + '-' + Math.round(tempoBpm()) + 'bpm-ai-' + Math.round(musicSec + tailSec(false)) + 's.wav';
        download(wavBytes, filename, 'audio/wav');
        progress.close();
        if (musicSec < 6) {
            toast('Exported ' + filename + ' — under 6s even looped; Suno needs at least 6s', 'error');
        } else {
            toast('AI-ready WAV exported: ' + filename + ' (' + sets + '× loop, Suno/Udio-ready)', 'success');
        }
    } catch (e) {
        progress.close();
        console.warn('[gc-export-audio] AI render failed', e);
        toast('WAV render failed: ' + (e && e.message ? e.message : e), 'error');
    } finally {
        rendering = false;
    }
}

// ---------------------------------------------------------------------------
// init + global attach
// ---------------------------------------------------------------------------

const api = { renderMix, renderStems, renderAI };

export function init(GC) {
    GCRef = GC || (typeof window !== 'undefined' ? window.GC : null) || null;
    window.GCExportAudio = api;
    return api;
}

if (typeof window !== 'undefined') {
    window.GCExportAudio = api;
}

export { renderMix, renderStems };
export default api;
