/**
 * GrooveCore — js/io/zip.js  (WS-B)
 *
 * Minimal STORE-only (no compression) ZIP builder with a CRC32 table.
 * Enough for stems export: local file headers + central directory + EOCD.
 * WAV/MIDI payloads don't benefit from deflate anyway.
 *
 * Deterministic: a fixed DOS timestamp is written for every entry, so the
 * same inputs always produce byte-identical archives.
 *
 * window.GCZip.buildZip([{ name, data }]) → Uint8Array
 *   name: forward-slash path inside the archive (UTF-8 flagged)
 *   data: Uint8Array | ArrayBuffer
 */

// ---- CRC32 (IEEE 802.3, table-driven) --------------------------------------

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c >>> 0;
    }
    return table;
})();

function crc32(data) {
    let crc = 0xffffffff;
    for (let i = 0; i < data.length; i++) {
        crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

// ---- helpers ----------------------------------------------------------------

// Fixed DOS date/time: 2026-01-01 00:00:00 — deterministic archives.
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

function toBytes(data) {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    throw new Error('GCZip: entry data must be Uint8Array or ArrayBuffer');
}

function encodeName(name) {
    const clean = String(name || 'file').replace(/\\/g, '/').replace(/^\/+/, '');
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(clean);
    const out = [];
    for (let i = 0; i < clean.length; i++) out.push(clean.charCodeAt(i) & 0xff);
    return new Uint8Array(out);
}

class ByteWriter {
    constructor() { this.parts = []; this.length = 0; }
    bytes(arr) { this.parts.push(arr); this.length += arr.length; }
    u16(v) { this.bytes(new Uint8Array([v & 0xff, (v >>> 8) & 0xff])); }
    u32(v) {
        this.bytes(new Uint8Array([
            v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff
        ]));
    }
    concat() {
        const out = new Uint8Array(this.length);
        let off = 0;
        for (const p of this.parts) { out.set(p, off); off += p.length; }
        return out;
    }
}

// ---- zip building -----------------------------------------------------------

/**
 * buildZip(entries) → Uint8Array
 * entries: [{ name: 'mix.wav', data: Uint8Array|ArrayBuffer }, ...]
 */
function buildZip(entries) {
    if (!Array.isArray(entries)) entries = [];
    const w = new ByteWriter();
    const central = [];

    for (const entry of entries) {
        if (!entry || entry.data == null) continue;
        const data = toBytes(entry.data);
        const nameBytes = encodeName(entry.name);
        const crc = crc32(data);
        const offset = w.length;

        // local file header
        w.u32(0x04034b50);
        w.u16(20);            // version needed
        w.u16(0x0800);        // flags: UTF-8 names
        w.u16(0);             // method: STORE
        w.u16(DOS_TIME);
        w.u16(DOS_DATE);
        w.u32(crc);
        w.u32(data.length);   // compressed size (= raw for STORE)
        w.u32(data.length);   // uncompressed size
        w.u16(nameBytes.length);
        w.u16(0);             // extra length
        w.bytes(nameBytes);
        w.bytes(data);

        central.push({ nameBytes, crc, size: data.length, offset });
    }

    // central directory
    const cdStart = w.length;
    for (const c of central) {
        w.u32(0x02014b50);
        w.u16(20);            // version made by
        w.u16(20);            // version needed
        w.u16(0x0800);        // flags: UTF-8
        w.u16(0);             // method: STORE
        w.u16(DOS_TIME);
        w.u16(DOS_DATE);
        w.u32(c.crc);
        w.u32(c.size);
        w.u32(c.size);
        w.u16(c.nameBytes.length);
        w.u16(0);             // extra
        w.u16(0);             // comment
        w.u16(0);             // disk number
        w.u16(0);             // internal attrs
        w.u32(0);             // external attrs
        w.u32(c.offset);
        w.bytes(c.nameBytes);
    }
    const cdSize = w.length - cdStart;

    // end of central directory
    w.u32(0x06054b50);
    w.u16(0);                 // disk
    w.u16(0);                 // cd start disk
    w.u16(central.length);
    w.u16(central.length);
    w.u32(cdSize);
    w.u32(cdStart);
    w.u16(0);                 // comment length

    return w.concat();
}

const GCZip = { buildZip, crc32 };

if (typeof window !== 'undefined') {
    window.GCZip = GCZip;
}

export { buildZip, crc32 };
export default GCZip;
