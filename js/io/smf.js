/**
 * GrooveCore — js/io/smf.js  (WS-B)
 *
 * Hand-rolled Standard MIDI File writer. Zero dependencies.
 *
 * Replaces midi-writer-js entirely. That library's known bugs (velocities
 * collapsing to ~1 via a 0–1 value against a 1–100 API, a hard 128-PPQN
 * division stretching 480-PPQ tick math by 3.75×, and wait/duration
 * arithmetic that serializes chords) are structurally impossible here:
 *
 *  - The header division IS the requested PPQ (480 by default), verbatim.
 *  - Events are placed at ABSOLUTE ticks and converted to running delta
 *    times only at encode time — two notes at the same tick get delta 0
 *    (real chords), and nothing ever drifts.
 *  - Velocities 1–127 are written into the file verbatim.
 *  - Percussion goes to channel 10 via status byte 0x99 (note-on ch 9,
 *    zero-indexed), 0x89 for the paired note-offs.
 *
 * Supports format 0 (single track) and format 1 (conductor + parts).
 *
 * API (window.GrooveSMF):
 *   const t = GrooveSMF.createTrack();
 *   t.addName(tick, 'text'); t.addTempo(tick, bpm); t.addTimeSignature(tick, 4, 4);
 *   t.addProgramChange(tick, channel, program); t.addController(tick, channel, cc, value);
 *   t.addNote(tick, channel, note, velocity, durationTicks);
 *   const bytes = GrooveSMF.encodeFile([t], { format: 0, ppq: 480 }); // Uint8Array
 *
 * Deterministic: identical inputs always yield byte-identical files
 * (stable sort, no timestamps, no running-status heuristics).
 */

// Event ordering inside one tick (stable, deterministic):
// meta (0) → program/controller (1) → note-offs (2) → note-ons (3).
const ORDER_META = 0;
const ORDER_CTRL = 1;
const ORDER_NOTE_OFF = 2;
const ORDER_NOTE_ON = 3;

function clampByte(v, lo, hi) {
    v = Math.round(Number(v) || 0);
    return Math.min(hi, Math.max(lo, v));
}

function clampTick(tick) {
    tick = Math.round(Number(tick) || 0);
    return tick < 0 ? 0 : tick;
}

/** Variable-length quantity encoding (MIDI delta times / meta lengths). */
function vlq(value) {
    value = Math.max(0, Math.round(value)) >>> 0;
    const bytes = [value & 0x7f];
    value >>>= 7;
    while (value > 0) {
        bytes.unshift((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    return bytes;
}

/** ASCII-safe text bytes (SMF meta text is bytes; keep it 7-bit clean). */
function textBytes(text) {
    const s = String(text == null ? '' : text);
    const out = [];
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        out.push(c > 0 && c < 128 ? c : 0x3f); // '?' for non-ASCII
    }
    return out;
}

/**
 * createTrack() — one SMF track under construction.
 * All positions are ABSOLUTE ticks; deltas are computed at encode time.
 */
function createTrack() {
    const events = []; // { tick, order, seq, bytes }
    let seq = 0;

    function add(tick, order, bytes) {
        events.push({ tick: clampTick(tick), order, seq: seq++, bytes });
    }

    const track = {
        events,

        /** FF 03 — sequence/track name. */
        addName(tick, text) {
            const data = textBytes(text);
            add(tick, ORDER_META, [0xff, 0x03].concat(vlq(data.length), data));
            return track;
        },

        /** FF 51 03 — tempo meta (microseconds per quarter note). */
        addTempo(tick, bpm) {
            const b = Math.min(1000, Math.max(1, Number(bpm) || 120));
            const uspq = Math.round(60000000 / b);
            add(tick, ORDER_META, [
                0xff, 0x51, 0x03,
                (uspq >> 16) & 0xff, (uspq >> 8) & 0xff, uspq & 0xff
            ]);
            return track;
        },

        /** FF 58 04 — time signature (denominator must be a power of 2). */
        addTimeSignature(tick, numerator, denominator) {
            const num = clampByte(numerator || 4, 1, 32);
            let den = Number(denominator) || 4;
            let pow = 0;
            while (den > 1 && pow < 7) { den /= 2; pow++; }
            add(tick, ORDER_META, [0xff, 0x58, 0x04, num, pow, 24, 8]);
            return track;
        },

        /** Cn — program change. */
        addProgramChange(tick, channel, program) {
            add(tick, ORDER_CTRL, [
                0xc0 | (clampByte(channel, 0, 15)),
                clampByte(program, 0, 127)
            ]);
            return track;
        },

        /** Bn — control change (e.g. CC7 volume, CC10 pan). */
        addController(tick, channel, controller, value) {
            add(tick, ORDER_CTRL, [
                0xb0 | (clampByte(channel, 0, 15)),
                clampByte(controller, 0, 127),
                clampByte(value, 0, 127)
            ]);
            return track;
        },

        /**
         * Note-on + paired note-off. Channel 9 (0-indexed) yields the 0x99
         * percussion status byte. Velocity 1–127 is written verbatim.
         */
        addNote(tick, channel, note, velocity, durationTicks) {
            const ch = clampByte(channel, 0, 15);
            const n = clampByte(note, 0, 127);
            const vel = clampByte(velocity, 1, 127);
            const dur = Math.max(1, Math.round(Number(durationTicks) || 1));
            const at = clampTick(tick);
            add(at, ORDER_NOTE_ON, [0x90 | ch, n, vel]);
            add(at + dur, ORDER_NOTE_OFF, [0x80 | ch, n, 64]);
            return track;
        }
    };

    return track;
}

/** Encode one track chunk (MTrk) with running delta times + end-of-track. */
function encodeTrack(track) {
    const events = track.events.slice().sort((a, b) =>
        (a.tick - b.tick) || (a.order - b.order) || (a.seq - b.seq));

    const body = [];
    let prevTick = 0;
    for (const ev of events) {
        const delta = ev.tick - prevTick;
        prevTick = ev.tick;
        body.push.apply(body, vlq(delta));
        body.push.apply(body, ev.bytes);
    }
    // FF 2F 00 — end of track, delta 0 from the final event.
    body.push(0x00, 0xff, 0x2f, 0x00);

    const chunk = new Uint8Array(8 + body.length);
    chunk[0] = 0x4d; chunk[1] = 0x54; chunk[2] = 0x72; chunk[3] = 0x6b; // 'MTrk'
    const len = body.length;
    chunk[4] = (len >>> 24) & 0xff;
    chunk[5] = (len >>> 16) & 0xff;
    chunk[6] = (len >>> 8) & 0xff;
    chunk[7] = len & 0xff;
    chunk.set(body, 8);
    return chunk;
}

/**
 * encodeFile(tracks, { format, ppq }) → Uint8Array
 *   format: 0 (single track — exactly one track required) or 1.
 *   ppq: real ticks-per-quarter written verbatim into the header division.
 */
function encodeFile(tracks, opts) {
    opts = opts || {};
    if (!Array.isArray(tracks)) tracks = [tracks];
    tracks = tracks.filter(t => t && Array.isArray(t.events));
    if (!tracks.length) tracks = [createTrack()];

    let format = (opts.format === 1) ? 1 : 0;
    if (format === 0 && tracks.length > 1) format = 1; // never write invalid type-0
    const ppq = Math.min(0x7fff, Math.max(24, Math.round(opts.ppq || 480)));

    const chunks = tracks.map(encodeTrack);
    let total = 14;
    for (const c of chunks) total += c.length;

    const out = new Uint8Array(total);
    // MThd header
    out[0] = 0x4d; out[1] = 0x54; out[2] = 0x68; out[3] = 0x64; // 'MThd'
    out[4] = 0; out[5] = 0; out[6] = 0; out[7] = 6;             // length 6
    out[8] = 0; out[9] = format;                                 // format
    out[10] = (tracks.length >> 8) & 0xff;                       // ntrks
    out[11] = tracks.length & 0xff;
    out[12] = (ppq >> 8) & 0x7f;                                 // division = real PPQ
    out[13] = ppq & 0xff;

    let off = 14;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return out;
}

const GrooveSMF = { createTrack, encodeFile, vlq };

if (typeof window !== 'undefined') {
    window.GrooveSMF = GrooveSMF;
}

export { createTrack, encodeFile, vlq };
export default GrooveSMF;
