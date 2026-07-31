// =============================================================================
// GrooveCore TR-808 MIDI Mapping - Master Reference (v3.0)
// =============================================================================
//
// This is the authoritative MIDI mapping for all GrooveCore instruments.
// Based on General MIDI (GM) standard for maximum DAW compatibility.
//
// Reference: GM Percussion Map (Channel 10)
// https://en.wikipedia.org/wiki/General_MIDI#Percussion
//
// GOVERNING DECREE (see docs/UPGRADE-PLAN.md §3, Decree 1):
// "The audio engine is truth." What the user HEARS is what the UI says and
// what the MIDI file contains. Instrument codes are named for the SOUND the
// engine synthesizes, not for a stale label.
//
// =============================================================================
// CHANGELOG
// =============================================================================
//
// v3.0 (2026-07-28) - Instrument Identity Decree
//   - ch: 39 -> 42. `ch` synthesizes a CLOSED HI-HAT (it was mislabeled
//     "Clap" and exported as GM 39 Hand Clap). It is now honest: 42 Closed Hi-Hat.
//   - cp: NEW code -> 39 Hand Clap. The new dedicated 808 handclap voice takes
//     the Hand Clap note that `ch` wrongly occupied.
//   - hc/mc/lc: 42/44/46 -> 63/62/64. These voices synthesize CONGAS (they were
//     mislabeled hi-hats). Now Open Hi Conga / Mute Hi Conga / Low Conga.
//   - oh: stays 46 Open Hi-Hat -- the lc/oh collision on note 46 is gone.
//   - accent: 40 -> null. Accent is a per-step velocity tier, NEVER a note.
//     It must not appear as a note-on in any exported MIDI file.
//   - Unchanged: bd 36, sd 38, rim 37, lt 45, mt 47, ht 50, cr 49, cym 57,
//     cb 56, cl 75, ma 70.
//
// v2.0 - GM standard compliance pass (bd 35->36, master file created).
// v1.0 - Initial implementation with conflicts.
//
// =============================================================================

const GROOVECORE_MIDI_VERSION = '3.0';

/**
 * Master MIDI mapping for GrooveCore TR-808 instruments
 * Maps instrument codes to GM percussion MIDI note numbers (Channel 10).
 * `accent` is deliberately null: it is a velocity-only flag, not a voice.
 */
const GROOVECORE_MIDI_MAPPING = {
  // Core Rhythm Section
  bd: 36,        // Bass Drum → GM: Bass Drum 1 (C1)
  sd: 38,        // Snare Drum → GM: Acoustic Snare (D1)
  rim: 37,       // Rim Shot → GM: Side Stick (C#1)
  cp: 39,        // Hand Clap (NEW 808 clap voice) → GM: Hand Clap (D#1)

  // Hi-Hat Family
  ch: 42,        // Closed Hi-Hat (that is what it plays) → GM: Closed Hi-Hat (F#1)
  oh: 46,        // Open Hi-Hat → GM: Open Hi-Hat (A#1)

  // Tom Family (GM Standard)
  lt: 45,        // Low Tom → GM: Low Tom (A1)
  mt: 47,        // Mid Tom → GM: Low-Mid Tom (B1)
  ht: 50,        // High Tom → GM: High Tom (D2)

  // Conga Family (that is what hc/mc/lc synthesize)
  hc: 63,        // High Conga → GM: Open Hi Conga (D#3)
  mc: 62,        // Mid Conga → GM: Mute Hi Conga (D3)
  lc: 64,        // Low Conga → GM: Low Conga (E3)

  // Cymbal Family (GM Standard)
  cr: 49,        // Crash → GM: Crash Cymbal 1 (C#2)
  cym: 57,       // 808 CY Cymbal → GM: Crash Cymbal 2 (A2)

  // Percussion
  cb: 56,        // Cowbell → GM: Cowbell (G#2)
  cl: 75,        // Clave → GM: Claves (D#4)
  ma: 70,        // Maraca → GM: Maracas (A#3)

  // Special
  accent: null   // Accent → NO NOTE. Per-step velocity tier only (never exported as a note-on)
};

/**
 * Reverse mapping: MIDI note to instrument code(s)
 * Useful for importing MIDI files, Web MIDI note-in, or note-based operations.
 * `accent` (null note) is intentionally excluded.
 */
const MIDI_TO_INSTRUMENT_MAPPING = {};
Object.entries(GROOVECORE_MIDI_MAPPING).forEach(([instrument, midiNote]) => {
  if (midiNote === null || midiNote === undefined) return; // accent: velocity-only, no note
  if (!MIDI_TO_INSTRUMENT_MAPPING[midiNote]) {
    MIDI_TO_INSTRUMENT_MAPPING[midiNote] = [];
  }
  MIDI_TO_INSTRUMENT_MAPPING[midiNote].push(instrument);
});

/**
 * Human-readable instrument names for display (decree UI labels)
 */
const INSTRUMENT_DISPLAY_NAMES = {
  bd: 'Bass Drum (BD)',
  sd: 'Snare Drum (SD)',
  rim: 'Rimshot (RS)',
  cp: 'Clap (CP)',
  ch: 'Closed Hat (CH)',
  oh: 'Open Hat (OH)',
  lt: 'Low Tom (LT)',
  mt: 'Mid Tom (MT)',
  ht: 'High Tom (HT)',
  hc: 'High Conga (HC)',
  mc: 'Mid Conga (MC)',
  lc: 'Low Conga (LC)',
  cr: 'Crash (CR)',
  cym: 'Cymbal (CY)',
  cb: 'Cowbell (CB)',
  cl: 'Clave (CL)',
  ma: 'Maraca (MA)',
  accent: 'Accent (AC)'
};

/**
 * GM Percussion note names for reference
 */
const GM_NOTE_NAMES = {
  35: 'Acoustic Bass Drum',
  36: 'Bass Drum 1',
  37: 'Side Stick',
  38: 'Acoustic Snare',
  39: 'Hand Clap',
  40: 'Electric Snare',
  41: 'Low Floor Tom',
  42: 'Closed Hi-Hat',
  43: 'High Floor Tom',
  44: 'Pedal Hi-Hat',
  45: 'Low Tom',
  46: 'Open Hi-Hat',
  47: 'Low-Mid Tom',
  48: 'Hi-Mid Tom',
  49: 'Crash Cymbal 1',
  50: 'High Tom',
  51: 'Ride Cymbal 1',
  52: 'Chinese Cymbal',
  53: 'Ride Bell',
  54: 'Tambourine',
  55: 'Splash Cymbal',
  56: 'Cowbell',
  57: 'Crash Cymbal 2',
  58: 'Vibraslap',
  59: 'Ride Cymbal 2',
  60: 'Hi Bongo',
  61: 'Low Bongo',
  62: 'Mute Hi Conga',
  63: 'Open Hi Conga',
  64: 'Low Conga',
  70: 'Maracas',
  75: 'Claves'
};

/**
 * Validation function to check if instrument has valid MIDI mapping.
 * Note: `accent` is a known instrument code but carries NO note; use
 * hasMidiNote() to check whether a code should emit a note-on.
 */
function isValidInstrument(instrument) {
  return instrument in GROOVECORE_MIDI_MAPPING;
}

/**
 * True only for codes that emit an actual MIDI note (excludes accent).
 */
function hasMidiNote(instrument) {
  return typeof GROOVECORE_MIDI_MAPPING[instrument] === 'number';
}

/**
 * Get MIDI note for instrument.
 * Returns null for `accent` (velocity-only) and undefined for unknown codes.
 */
function getMidiNote(instrument) {
  return GROOVECORE_MIDI_MAPPING[instrument];
}

/**
 * Get GM percussion name for MIDI note
 */
function getGMPercussionName(midiNote) {
  return GM_NOTE_NAMES[midiNote] || `Unknown (${midiNote})`;
}

/**
 * Get display name for instrument
 */
function getInstrumentDisplayName(instrument) {
  return INSTRUMENT_DISPLAY_NAMES[instrument] || `Unknown (${instrument})`;
}

/**
 * Export mapping for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    GROOVECORE_MIDI_VERSION,
    GROOVECORE_MIDI_MAPPING,
    MIDI_TO_INSTRUMENT_MAPPING,
    INSTRUMENT_DISPLAY_NAMES,
    GM_NOTE_NAMES,
    isValidInstrument,
    hasMidiNote,
    getMidiNote,
    getGMPercussionName,
    getInstrumentDisplayName
  };
} else {
  // Browser environment - attach to window
  window.GrooveCoreMIDI = {
    GROOVECORE_MIDI_VERSION,
    GROOVECORE_MIDI_MAPPING,
    MIDI_TO_INSTRUMENT_MAPPING,
    INSTRUMENT_DISPLAY_NAMES,
    GM_NOTE_NAMES,
    isValidInstrument,
    hasMidiNote,
    getMidiNote,
    getGMPercussionName,
    getInstrumentDisplayName
  };
}

// =============================================================================
// Mapping Summary for Reference (v3.0 decree):
// =============================================================================
//
// BD  (Bass Drum)   → 36 (Bass Drum 1)
// SD  (Snare)       → 38 (Acoustic Snare)
// RS  (Rimshot)     → 37 (Side Stick)
// CP  (Clap)        → 39 (Hand Clap)          [NEW voice]
// CH  (Closed Hat)  → 42 (Closed Hi-Hat)      [was mislabeled Clap/39]
// OH  (Open Hat)    → 46 (Open Hi-Hat)        [collision with lc resolved]
// LT  (Low Tom)     → 45 (Low Tom)
// MT  (Mid Tom)     → 47 (Low-Mid Tom)
// HT  (High Tom)    → 50 (High Tom)
// HC  (High Conga)  → 63 (Open Hi Conga)      [was mislabeled hi-hat/42]
// MC  (Mid Conga)   → 62 (Mute Hi Conga)      [was mislabeled hi-hat/44]
// LC  (Low Conga)   → 64 (Low Conga)          [was mislabeled hi-hat/46]
// CR  (Crash)       → 49 (Crash Cymbal 1)
// CY  (Cymbal)      → 57 (Crash Cymbal 2)
// CB  (Cowbell)     → 56 (Cowbell)
// CL  (Clave)       → 75 (Claves)
// MA  (Maraca)      → 70 (Maracas)
// AC  (Accent)      → none (velocity tier only — never a note)
//
// =============================================================================
