/**
 * GrooveCore — js/io/export-midi.js  (WS-B)
 *
 * The new MIDI export, built on the three frozen authorities:
 *   - window.GrooveEvents.computePatternEvents  (Decree 2 — one event list)
 *   - window.GrooveCoreMIDI.GROOVECORE_MIDI_MAPPING (Decree 1 — the single
 *     mapping authority; notes are NEVER hardcoded here)
 *   - window.GrooveSMF (js/io/smf.js — real 480 PPQ, absolute ticks)
 *
 * Modes:
 *   exportPattern()     — current pattern, single track, channel 10 (0x99)
 *   exportChain()       — chain/song export from window.GC state incl. ext.chain
 *   exportMultiTrack()  — format 1, one track per active instrument, optional
 *                         CC7 volume / CC10 pan per TRACK so mix data survives
 *
 * Deterministic by default: two consecutive exports of the same state are
 * byte-identical. 'Bake swing' and 'seeded humanize' are explicit opt-ins
 * (seeded PRNG — re-exports with the same seed are still reproducible).
 *
 * Accent = velocity tier 127, never a note (`accent` maps to null in the
 * mapping and is excluded by hasMidiNote()).
 *
 * After load this module overwrites window.exportPatternToMidiEnhanced and
 * window.exportPatternToMidiMultiTrack so even legacy button paths land here.
 *
 * ES module; exports init(GC); attaches window.GCExportMIDI. Fails soft when
 * dependencies are absent.
 */

// Own dependencies (WS-J integration fix): nothing else imports these, and
// both attach their window globals on load. The events.js URL resolves to the
// same module instance as the index.html <script type="module"> tag, so this
// is a cached no-op in the app and makes this module self-sufficient in test
// harnesses.
import './smf.js';
import '../core/events.js';
import { exportStem } from './export-name.js';

const PPQ = 480;
const CHANNEL = 9;             // channel 10, 0-indexed → status byte 0x99
const NOTE_TICKS = PPQ / 8;    // 60-tick (32nd) drum hits — short and clean

// Knob-id suffixes in app.js knobValues (element ids ARE the keys).
const KNOB_SUFFIX = {
    bd: 'Bd', sd: 'Sd', lt: 'Lt', mt: 'Mt', ht: 'Ht', rim: 'Rim', cp: 'Cp',
    hc: 'Hc', mc: 'Mc', lc: 'Lc', cb: 'Cb', cl: 'Cl', ma: 'Ma',
    ch: 'Ch', oh: 'Oh', cym: 'Cym', cr: 'Cr'
};

let GCRef = null;

// User-facing export options (mutated by the export menu's options panel).
const options = {
    bakeSwing: false,       // bake the swing/shuffle knobs into exported ticks
    humanize: false,        // seeded humanize (deterministic per seed)
    seed: 42,
    includeMixData: true    // CC7/CC10 per track in multi-track mode
};

function gc() { return GCRef || (typeof window !== 'undefined' ? window.GC : null); }

function deps() {
    if (typeof window === 'undefined') return null;
    const ev = window.GrooveEvents;
    const map = window.GrooveCoreMIDI;
    const smf = window.GrooveSMF;
    if (!ev || typeof ev.computePatternEvents !== 'function') return null;
    if (!map || !map.GROOVECORE_MIDI_MAPPING) return null;
    if (!smf || typeof smf.encodeFile !== 'function') return null;
    return { ev, map, smf };
}

function toast(msg, type) {
    if (window.GCToast && typeof window.GCToast.show === 'function') {
        window.GCToast.show(msg, { type: type || 'info' });
    } else {
        console.log('[gc-export-midi] ' + msg);
    }
}

// ---------------------------------------------------------------------------
// State readers
// ---------------------------------------------------------------------------

function currentPattern() {
    const g = gc();
    if (!g || !g.patterns) return null;
    const bank = g.patterns[g.variation];
    return (bank && bank[g.currentPattern]) || null;
}

/** Chain bars from ext.chain (GCChain preferred, schema snapshot fallback). */
function chainBars() {
    const g = gc();
    if (!g || !g.patterns) return [];
    let chain = null;
    if (window.GCChain && window.GCChain.state) chain = window.GCChain.state;
    else if (window.GCSchema && typeof window.GCSchema.snapshot === 'function') {
        try { chain = (window.GCSchema.snapshot().ext || {}).chain || null; } catch (e) { chain = null; }
    }
    if (!chain || !Array.isArray(chain.slots)) return [];
    const bars = [];
    for (const slot of chain.slots) {
        if (!slot) continue;
        const bank = g.patterns[slot.v];
        const p = bank && bank[slot.i];
        if (p) bars.push(p);
    }
    return bars;
}

/** Mute/solo audibility — the sacred contract: what you hear is what exports. */
function audible(inst) {
    const g = gc();
    const ms = g && g.muteSoloState;
    if (!ms) return true;
    if (ms.muted && typeof ms.muted.has === 'function' && ms.muted.has(inst)) return false;
    if (ms.soloed && typeof ms.soloed.has === 'function' && ms.soloed.size > 0 && !ms.soloed.has(inst)) return false;
    return true;
}

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

// ---------------------------------------------------------------------------
// Event building (Decree 2)
// ---------------------------------------------------------------------------

function buildEvents(patternOrChain) {
    const d = deps();
    if (!d) return null;

    let swing = 0;
    const shufflePerInst = {};
    if (options.bakeSwing) {
        swing = knob('swing') || 0;
        for (const inst of Object.keys(KNOB_SUFFIX)) {
            const s = knob('shuffle' + KNOB_SUFFIX[inst]);
            if (s != null && s > 0) shufflePerInst[inst] = s;
        }
    }

    const humanizeAmt = options.humanize ? (knob('humanize') || 5) : 0;

    const events = d.ev.computePatternEvents(patternOrChain, {
        swing,
        shufflePerInst,
        ppq: PPQ,
        bpm: tempoBpm(),
        deterministic: !(options.humanize && humanizeAmt > 0),
        seed: options.seed,
        humanize: humanizeAmt
    });

    return events.filter(e => audible(e.inst));
}

/** Accent = velocity tier 127 (ghost 45 / normal 100 / accent 127 verbatim). */
function outVelocity(ev) {
    if (!ev.accent) return Math.min(127, Math.max(1, Math.round(ev.velocity)));
    return Math.min(127, Math.max(1, Math.round(ev.velocity * 1.27)));
}

/**
 * Per-event note durations: default a 32nd, clamped so a note never overlaps
 * the next hit of the same instrument (ratchets stay clean note pairs).
 */
function noteDurations(events) {
    const lastIndexByInst = {};
    const durs = new Array(events.length).fill(NOTE_TICKS);
    for (let i = 0; i < events.length; i++) {
        const inst = events[i].inst;
        const prev = lastIndexByInst[inst];
        if (prev !== undefined) {
            const gap = events[i].tick480 - events[prev].tick480;
            if (gap > 0 && gap < durs[prev]) durs[prev] = Math.max(1, gap - 1);
        }
        lastIndexByInst[inst] = i;
    }
    return durs;
}

// ---------------------------------------------------------------------------
// SMF assembly
// ---------------------------------------------------------------------------

function addNotes(track, events, mapApi) {
    const durs = noteDurations(events);
    for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        if (!mapApi.hasMidiNote(ev.inst)) continue;   // accent / unknown: never a note
        const note = mapApi.GROOVECORE_MIDI_MAPPING[ev.inst];
        track.addNote(ev.tick480, CHANNEL, note, outVelocity(ev), durs[i]);
    }
}

function buildSingleTrackFile(events, name) {
    const d = deps();
    const t = d.smf.createTrack();
    t.addName(0, name);
    t.addTempo(0, tempoBpm());
    t.addTimeSignature(0, 4, 4);
    t.addProgramChange(0, CHANNEL, 0);
    addNotes(t, events, d.map);
    return d.smf.encodeFile([t], { format: 0, ppq: PPQ });
}

function buildMultiTrackFile(events, name, includeMixData) {
    const d = deps();
    const instOrder = (window.GrooveParams && window.GrooveParams.INSTRUMENTS)
        || d.ev.INSTRUMENTS
        || Object.keys(KNOB_SUFFIX);

    // conductor track: name + tempo + time signature
    const conductor = d.smf.createTrack();
    conductor.addName(0, name);
    conductor.addTempo(0, tempoBpm());
    conductor.addTimeSignature(0, 4, 4);

    const tracks = [conductor];
    for (const inst of instOrder) {
        const instEvents = events.filter(e => e.inst === inst);
        if (!instEvents.length || !d.map.hasMidiNote(inst)) continue;

        const t = d.smf.createTrack();
        const label = (typeof d.map.getInstrumentDisplayName === 'function')
            ? d.map.getInstrumentDisplayName(inst) : inst.toUpperCase();
        t.addName(0, label);

        if (includeMixData) {
            // CC7 volume from the level knob, CC10 pan from the pan knob
            // (0–10 knob space → 0–127; missing knobs fall back to sane middles).
            const suf = KNOB_SUFFIX[inst] || '';
            const level = knob('level' + suf);
            const pan = knob('pan' + suf);
            t.addController(0, CHANNEL, 7, level == null ? 100 : Math.round((level / 10) * 127));
            t.addController(0, CHANNEL, 10, pan == null ? 64 : Math.round((pan / 10) * 127));
        }

        addNotes(t, instEvents, d.map);
        tracks.push(t);
    }

    return d.smf.encodeFile(tracks, { format: 1, ppq: PPQ });
}

// ---------------------------------------------------------------------------
// Download plumbing + public entry points
// ---------------------------------------------------------------------------

function download(bytes, filename) {
    const blob = new Blob([bytes], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * buildBytes(mode) → { bytes, filename } or null.
 * mode: 'pattern' | 'chain' | 'multi' | 'chain-multi'
 * Shared by the download entry points AND the stems exporter (the zip's .mid).
 */
function buildBytes(mode, opts) {
    if (!deps()) { toast('MIDI export unavailable: engine modules missing', 'error'); return null; }
    opts = opts || {};
    const bpm = tempoBpm();
    const stem = exportStem(mode);
    let source, name, filename, multi = false;

    if (mode === 'chain' || mode === 'chain-multi') {
        const bars = chainBars();
        if (!bars.length) { toast('No chain slots to export — fill the chain bar first', 'error'); return null; }
        source = bars;
        name = 'GrooveCore ' + stem;
        filename = 'groovecore-' + stem + '-' + bpm + 'bpm' + (mode === 'chain-multi' ? '-multitrack' : '') + '.mid';
        multi = (mode === 'chain-multi');
    } else {
        const p = currentPattern();
        if (!p) { toast('No pattern to export', 'error'); return null; }
        source = p;
        name = 'GrooveCore ' + stem.toUpperCase();
        filename = 'groovecore-' + stem + '-' + bpm + 'bpm' + (mode === 'multi' ? '-multitrack' : '') + '.mid';
        multi = (mode === 'multi');
    }

    const events = buildEvents(source);
    if (!events) return null;
    if (!events.length) { toast('Nothing to export: the pattern is empty (or fully muted)', 'error'); return null; }

    const includeMix = (opts.includeMixData !== undefined) ? !!opts.includeMixData : options.includeMixData;
    const bytes = multi
        ? buildMultiTrackFile(events, name, includeMix)
        : buildSingleTrackFile(events, name);
    return { bytes, filename, eventCount: events.length };
}

function exportPattern() {
    const out = buildBytes('pattern');
    if (!out) return;
    download(out.bytes, out.filename);
    toast('MIDI exported: ' + out.filename, 'success');
}

function exportChain() {
    const out = buildBytes('chain');
    if (!out) return;
    download(out.bytes, out.filename);
    toast('Chain MIDI exported: ' + out.filename, 'success');
}

function exportMultiTrack(legacyOpts) {
    const out = buildBytes('multi', legacyOpts);
    if (!out) return;
    download(out.bytes, out.filename);
    toast('Multi-track MIDI exported: ' + out.filename, 'success');
}

function setOptions(patch) {
    if (!patch || typeof patch !== 'object') return;
    if (typeof patch.bakeSwing === 'boolean') options.bakeSwing = patch.bakeSwing;
    if (typeof patch.humanize === 'boolean') options.humanize = patch.humanize;
    if (typeof patch.includeMixData === 'boolean') options.includeMixData = patch.includeMixData;
    if (patch.seed != null && isFinite(Number(patch.seed))) options.seed = Number(patch.seed) | 0;
}

function getOptions() {
    return { bakeSwing: options.bakeSwing, humanize: options.humanize, seed: options.seed, includeMixData: options.includeMixData };
}

// ---------------------------------------------------------------------------
// Legacy path capture — belt and braces (plan §6.2)
// ---------------------------------------------------------------------------

function captureLegacyPaths() {
    // Even if the export menu fails to load, the old #exportMidi handler's
    // "enhanced" calls land on the new exporter.
    window.exportPatternToMidiEnhanced = function (legacyOpts) {
        if (legacyOpts && legacyOpts.includeMixData) exportMultiTrack(legacyOpts);
        else exportPattern();
    };
    window.exportPatternToMidiMultiTrack = function () { exportMultiTrack(); };
    // The legacy click handler hard-guards on window.MidiWriter before calling
    // the enhanced functions; midi-writer-js is gone, so satisfy the guard.
    if (typeof window.MidiWriter === 'undefined') {
        window.MidiWriter = { __gcShim: true };
    }
}

/**
 * exportPatternToBytes(pattern, opts) → Uint8Array | null.
 *
 * Pure byte-level export of an explicit pattern object — no app state is
 * consulted (tempo, seed, ppq all come from opts). Used by the byte-level
 * regression harness (test-scripts/test_smf_bytes.html) and safe for any
 * caller that wants SMF bytes without touching window.GC.
 */
export function exportPatternToBytes(pattern, opts) {
    const d = deps();
    if (!d || !pattern) return null;
    opts = opts || {};
    const bpm = Number(opts.bpm || opts.tempo) || 120;
    const ppq = Number(opts.ppq) || PPQ;
    const events = d.ev.computePatternEvents(pattern, {
        swing: opts.swing || 0,
        shufflePerInst: opts.shufflePerInst || {},
        ppq,
        bpm,
        deterministic: opts.deterministic !== false,
        seed: (opts.seed != null) ? opts.seed : 42,
        humanize: opts.humanize || 0
    });
    const t = d.smf.createTrack();
    t.addName(0, opts.name || 'GrooveCore pattern');
    t.addTempo(0, bpm);
    t.addTimeSignature(0, 4, 4);
    t.addProgramChange(0, CHANNEL, 0);
    addNotes(t, events, d.map);
    return d.smf.encodeFile([t], { format: 0, ppq });
}

// ---------------------------------------------------------------------------
// init + global attach
// ---------------------------------------------------------------------------

const api = {
    exportPattern,
    exportChain,
    exportMultiTrack,
    buildBytes,
    exportPatternToBytes,
    setOptions,
    getOptions
};

export function init(GC) {
    GCRef = GC || (typeof window !== 'undefined' ? window.GC : null) || null;
    captureLegacyPaths();
    window.GCExportMIDI = api;
    return api;
}

if (typeof window !== 'undefined') {
    // Attach eagerly too — export-audio / export-menu may load in any order.
    window.GCExportMIDI = api;
    captureLegacyPaths();
}

export { exportPattern, exportChain, exportMultiTrack, buildBytes, setOptions, getOptions };
export default api;
