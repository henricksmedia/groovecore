# GrooveCore MIDI Mapping - Master Reference (v3.0)

**This document is the SINGLE SOURCE OF TRUTH for all MIDI-related functionality in GrooveCore. Any changes to MIDI mappings, exports, imports, or instrument codes MUST be updated here first, then in `midi-mapping.js`, and propagated to all other files.**

Governing decree (docs/UPGRADE-PLAN.md §3, Decree 1): **the audio engine is truth**. Every instrument code is named for the sound the engine actually synthesizes, the UI label says the same thing, and the exported MIDI note is the GM note for that sound. Zero change to how existing patterns sound — only labels and exports became honest in v3.0.

---

## Master MIDI Mapping Table (v3.0 — the decree)

Runtime implementation: `midi-mapping.js` (`window.GrooveCoreMIDI`, `GROOVECORE_MIDI_VERSION = '3.0'`).
SMF byte writer: **`js/io/smf.js`** (hand-rolled 480-PPQ type-0/1 writer) used by `js/io/export-midi.js`. The legacy midi-writer-js path is retired.

| Instrument | Code | MIDI Note | GM Name | Engine Sound |
|------------|------|-----------|---------|--------------|
| Bass Drum | `bd` | **36** | Bass Drum 1 (C1) | 808 kick |
| Snare Drum | `sd` | **38** | Acoustic Snare (D1) | 808/909 snare |
| Rimshot | `rim` | **37** | Side Stick (C#1) | 808 rimshot |
| Hand Clap | `cp` | **39** | Hand Clap (D#1) | **NEW 808 handclap voice** |
| Closed Hi-Hat | `ch` | **42** | Closed Hi-Hat (F#1) | Closed hat (that is what it plays) |
| Open Hi-Hat | `oh` | **46** | Open Hi-Hat (A#1) | Open hat |
| Low Tom | `lt` | **45** | Low Tom (A1) | 808 low tom |
| Mid Tom | `mt` | **47** | Low-Mid Tom (B1) | 808 mid tom |
| High Tom | `ht` | **50** | High Tom (D2) | 808 high tom |
| High Conga | `hc` | **63** | Open Hi Conga (D#3) | Conga (that is what it synthesizes) |
| Mid Conga | `mc` | **62** | Mute Hi Conga (D3) | Conga |
| Low Conga | `lc` | **64** | Low Conga (E3) | Conga |
| Crash | `cr` | **49** | Crash Cymbal 1 (C#2) | Crash |
| Cymbal | `cym` | **57** | Crash Cymbal 2 (A2) | 808 CY cymbal (note-51 ride option is P1) |
| Cowbell | `cb` | **56** | Cowbell (G#2) | 808 cowbell |
| Claves | `cl` | **75** | Claves (D#4) | 808 claves |
| Maracas | `ma` | **70** | Maracas (A#3) | 808 maracas |
| Accent | `accent` | **none** | — | **Not a voice. Per-step velocity tier only.** |

17 voices + `accent` = the 18 canonical pattern codes. No note collisions remain (the old `lc`/`oh` clash on 46 is gone).

---

## Accent semantics — velocity, never a note

`accent` is a per-step flag (the AC grid row), NOT an instrument:

- It must **never** appear as a note-on in any exported MIDI file. `GROOVECORE_MIDI_MAPPING.accent === null`; use `GrooveCoreMIDI.hasMidiNote(code)` to filter before writing notes.
- An accented step raises the velocity of every hit on that step. Velocity tiers used across UI, playback, and export: **ghost 45 / normal 100 / accent 127**.
- In the audio engine, accent also multiplies the per-hit gain (master `accentAmount`) — the MIDI file expresses the same emphasis purely through velocity.
- Per-hit velocities (data model v2, cells `1–127`, legacy `true` = 100) are written **verbatim** into the MIDI file.

---

## What changed in v3.0 (identity corrections)

| Code | Old (v2.0) | New (v3.0) | Why |
|------|------------|------------|-----|
| `ch` | 39 Hand Clap | **42 Closed Hi-Hat** | `ch` sounds like a closed hat; it was mislabeled "Clap" |
| `cp` | (did not exist) | **39 Hand Clap** | New dedicated 808 handclap voice |
| `hc` | 42 Closed Hi-Hat | **63 Open Hi Conga** | `hc` synthesizes a conga; it was mislabeled a hi-hat |
| `mc` | 44 Pedal Hi-Hat | **62 Mute Hi Conga** | Same — it is a conga |
| `lc` | 46 Open Hi-Hat | **64 Low Conga** | Same — it is a conga; also removes the collision with `oh` (46) |
| `accent` | 40 Electric Snare | **null (no note)** | Accent is emphasis, not a drum; note-40 hits polluted exports |
| all others | — | unchanged | bd 36, sd 38, rim 37, lt 45, mt 47, ht 50, oh 46, cr 49, cym 57, cb 56, cl 75, ma 70 |

---

## File locations

### Primary implementation
- **`/midi-mapping.js`** — master mapping object (`window.GrooveCoreMIDI`), v3.0. SINGLE SOURCE OF TRUTH at runtime.
- **`/js/io/smf.js`** — the SMF byte writer (480 PPQ, absolute ticks, deterministic).
- **`/js/io/export-midi.js`** — MIDI export built on `GrooveEvents` + `smf.js` + this mapping.
- **`/js/core/events.js`** — `computePatternEvents()`, the one source of hits/velocities for playback AND export.

### Consumers
- **`/app.js`** — reads the mapping via `window.GrooveCoreMIDI` (inline fallbacks are legacy, off the hot path).
- **`/js/perf/midi-in.js`** — Web MIDI input via `MIDI_TO_INSTRUMENT_MAPPING` (reverse map; `accent` excluded).
- **`/presets.js`** — pattern data; every key must be one of the 18 canonical codes above.

### Tests
- **`/test-scripts/test_smf_bytes.html`** — byte-level export regression (PPQ 480, tempo meta, exact ticks, verbatim velocities, channel 10, determinism).
- **`/test-scripts/test_state_roundtrip.html`** — snapshot/share/autosave round-trips.

### Legacy (kept on disk, off the hot path)
- **`/midi_export_enhanced.js`** — superseded by `js/io/export-midi.js`; its internal `GM_DRUM_MAP` is no longer authoritative.

---

## Implementation rules

1. **Always read the master mapping** — `window.GrooveCoreMIDI.GROOVECORE_MIDI_MAPPING`. Never hardcode note numbers.
2. **Filter accent before writing notes**:
   ```javascript
   if (!window.GrooveCoreMIDI.hasMidiNote(inst)) continue; // skips accent + unknowns
   const note = window.GrooveCoreMIDI.getMidiNote(inst);
   ```
3. **Channel 10** (status nibble 9, channel index 9) for all percussion; velocities 1–127 written verbatim; 480 PPQ; absolute-tick math (chords share the exact same tick).
4. **Determinism**: exporting the same pattern twice must produce byte-identical files. Humanize is an explicit opt-in with a seeded PRNG.
5. **Validate patterns**: every pattern key must be one of the 18 canonical codes. Unknown codes are a data bug — fix the data, do not silently drop hits.

---

## GM standard compliance

- **Channel**: 10 (GM percussion channel; status byte `0x99` for note-on)
- **Division**: 480 PPQ
- **Note range used**: 36–75
- **Velocity**: 1–127 (ghost 45 / normal 100 / accent 127 tiers; per-hit values verbatim)

---

## Change log

### v3.0 (2026-07-28) — Instrument Identity Decree
- `ch` 39 → 42 (it is a closed hat, not a clap)
- `cp` added → 39 Hand Clap (new 808 clap voice)
- `hc`/`mc`/`lc` 42/44/46 → 63/62/64 (they are congas, not hi-hats)
- `lc`/`oh` note-46 collision eliminated
- `accent` 40 → null (velocity tier only, never a note)
- Writer moved to hand-rolled `js/io/smf.js` (480 PPQ, deterministic)
- Preset data de-duplicated; stray `conga_low`/`conga_mid` keys renamed to `lc`/`mc`

### v2.0 — GM standard compliance pass
- bd 35 → 36; master mapping file created; test files aligned

### v1.0 — Initial implementation
- Basic mapping with conflicts, inconsistent across files

---

**Remember: `midi-mapping.js` v3.0 + this document define MIDI truth. `js/io/smf.js` writes the bytes. When in doubt, consult this document first.**
