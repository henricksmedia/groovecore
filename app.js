// =============================================================================
// GrooveCore TR-808 Drum Machine - Main Application
// =============================================================================
//
// SECURITY ENHANCEMENTS IMPLEMENTED:
// 1. Content Security Policy (CSP) - Restricts resource loading and script execution
//    - Allows necessary web workers (worker-src blob:) for Tone.js
//    - Permits source map connections (connect-src) for debugging
//    - Restricts script sources to trusted CDNs only
// 2. File Size Validation - Limits uploaded files to 1MB maximum
// 3. File Type Validation - Ensures only JSON files are accepted
// 4. JSON Structure Validation - Validates save file format and structure
// 5. String Sanitization - Removes potentially dangerous characters/scripts
// 6. Input Validation - All user inputs are validated and constrained
//
// =============================================================================

// =============================================================================
// Audio Setup & Synthesis
// =============================================================================

// Simplified audio synthesis setup to prevent feedback
const masterVolume = new Tone.Volume(-6).toDestination(); // Reduced volume to prevent clipping

// Update master volume based on knob value
function updateMasterVolume() {
  const volumeDb = Tone.gainToDb(knobValues.masterVolume / 10);
  masterVolume.volume.value = volumeDb;
}

// =============================================================================
// Legacy Fallback Engine (lazy)
// =============================================================================
//
// When js/audio/*.js loads, window.GrooveAudio owns ALL synthesis and none of
// the Tone nodes below are ever constructed. The factories only run — lazily,
// once — if the module engine is missing at first trigger, so the app still
// makes sound when js/audio/* fails to load.

let synths = {};
let legacySynthsBuilt = false;

function ensureLegacySynths() {
  if (legacySynthsBuilt) return synths;
  legacySynthsBuilt = true;
  try {
    Object.assign(synths, buildLegacySynths());
    enhanceLegacySynthsWithEffects();
  } catch (error) {
    console.warn('[GrooveCore] legacy synth construction failed:', error);
  }
  return synths;
}

function buildLegacySynths() {
  return {
  // =============================================================================
  // TR-808 INSTRUMENTS - Analog Drum Machine Synthesis
  // =============================================================================
  
  // TR-808 Bass Drum: Master Analog Pitch-Decay Synthesis
  // Uses sine oscillator with exponential pitch decay and noise transient for punch
  bd: (() => {
    const gain = new Tone.Gain(0.6).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 1.0,
      sustain: 0,
      release: 0.05
    }).connect(gain);
    
    const osc = new Tone.Oscillator({ frequency: 50, type: 'sine', volume: -6 }).connect(envelope);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.15,
      baseFrequency: 50,
      octaves: 1
    }).connect(osc.frequency);
    
    const noiseFilt = new Tone.Filter({ frequency: 4500, type: 'highpass', Q: 1, rolloff: -12, gain: -12 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(noiseFilt);
    
    return { osc, envelope, pitchEnv, noise, gain };
  })(),


  // TR-808 Low Tom: Resonant low tone with pitch modulation
  lt: (() => {
    const gain = new Tone.Gain(0.35).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.45,
      sustain: 0,
      release: 0.1
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 80, type: 'bandpass', Q: 2.5, rolloff: -12 }).connect(envelope);
    const osc = new Tone.Oscillator({ frequency: 80, type: 'triangle' }).connect(filter);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0,
      baseFrequency: 80,
      octaves: 0.6
    }).connect(osc.frequency);
    
    return { osc, envelope, filter, pitchEnv, gain };
  })(),

  // TR-808 Mid Tom: Mid-range tone with pitch modulation
  mt: (() => {
    const gain = new Tone.Gain(0.35).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.45,
      sustain: 0,
      release: 0.1
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 120, type: 'bandpass', Q: 2.5, rolloff: -12 }).connect(envelope);
    const osc = new Tone.Oscillator({ frequency: 120, type: 'triangle' }).connect(filter);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0,
      baseFrequency: 120,
      octaves: 0.6
    }).connect(osc.frequency);
    
    return { osc, envelope, filter, pitchEnv, gain };
  })(),

  // TR-808 Hi Tom: Higher tone with pitch modulation
  ht: (() => {
    const gain = new Tone.Gain(0.35).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.45,
      sustain: 0,
      release: 0.1
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 160, type: 'bandpass', Q: 2.5, rolloff: -12 }).connect(envelope);
    const osc = new Tone.Oscillator({ frequency: 160, type: 'triangle' }).connect(filter);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0,
      baseFrequency: 160,
      octaves: 0.6
    }).connect(osc.frequency);
    
    return { osc, envelope, filter, pitchEnv, gain };
  })(),

  // TR-808 Rim Shot: Sharp high-frequency sound with tonal click
  rim: (() => {
    const gain = new Tone.Gain(0.3).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.025,
      sustain: 0,
      release: 0.01
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 3100, type: 'bandpass', Q: 6, rolloff: -24, gain: -10 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(filter);
    const sine = new Tone.Oscillator({ frequency: 1050, type: 'sine', volume: -10 }).connect(envelope);
    
    return { noise, sine, envelope, filter, gain };
  })(),

  // TR-808 Hi Conga: Warm tonal slap with transient
  hc: (() => {
    const gain = new Tone.Gain(0.35).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.32,
      sustain: 0,
      release: 0.05
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 4100, type: 'bandpass', Q: 6, rolloff: -24, gain: -14 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(filter);
    const osc = new Tone.Oscillator({ frequency: 200, type: 'triangle' }).connect(envelope);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.15,
      sustain: 0,
      release: 0,
      baseFrequency: 200,
      octaves: 0.4
    }).connect(osc.frequency);
    
    return { osc, noise, envelope, filter, pitchEnv, gain };
  })(),

  // TR-808 Mid Conga: Mid-range tonal slap with transient
  mc: (() => {
    const gain = new Tone.Gain(0.35).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.32,
      sustain: 0,
      release: 0.05
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 4100, type: 'bandpass', Q: 6, rolloff: -24, gain: -14 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(filter);
    const osc = new Tone.Oscillator({ frequency: 150, type: 'triangle' }).connect(envelope);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.15,
      sustain: 0,
      release: 0,
      baseFrequency: 150,
      octaves: 0.4
    }).connect(osc.frequency);
    
    return { osc, noise, envelope, filter, pitchEnv, gain };
  })(),

  // TR-808 Low Conga: Low tonal slap with transient
  lc: (() => {
    const gain = new Tone.Gain(0.35).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.32,
      sustain: 0,
      release: 0.05
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 4100, type: 'bandpass', Q: 6, rolloff: -24, gain: -14 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(filter);
    const osc = new Tone.Oscillator({ frequency: 100, type: 'triangle' }).connect(envelope);
    const pitchEnv = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.15,
      sustain: 0,
      release: 0,
      baseFrequency: 100,
      octaves: 0.4
    }).connect(osc.frequency);
    
    return { osc, noise, envelope, filter, pitchEnv, gain };
  })(),

  // TR-808 Cowbell: Metallic clangy tone with inharmonic partials
  cb: (() => {
    const gain = new Tone.Gain(0.3).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.55,
      sustain: 0,
      release: 0.1
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 1050, type: 'bandpass', Q: 3.5, rolloff: -12 }).connect(envelope);
    const osc1 = new Tone.Oscillator({ frequency: 540, type: 'square', detune: -5, volume: -8 }).connect(filter);
    const osc2 = new Tone.Oscillator({ frequency: 845, type: 'square', detune: 5, volume: -8 }).connect(filter);
    
    return { osc1, osc2, envelope, filter, gain };
  })(),


  // TR-808 Claves: Sharp high-pitched wooden click
  cl: (() => {
    const gain = new Tone.Gain(0.25).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.015,
      sustain: 0,
      release: 0.005
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 2600, type: 'bandpass', Q: 12, rolloff: -24 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(filter);
    const sine = new Tone.Oscillator({ frequency: 2600, type: 'sine', volume: -12 }).connect(envelope);
    
    return { noise, sine, envelope, filter, gain };
  })(),

  // TR-808 Maracas: Sustained rattling shaker sound
  ma: (() => {
    const gain = new Tone.Gain(0.3).connect(masterVolume);
    const lfoGain = new Tone.Gain(0.6).connect(gain);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.22,
      sustain: 0,
      release: 0.05
    }).connect(lfoGain);
    
    const filter = new Tone.Filter({ frequency: 5200, type: 'highpass', Q: 1, rolloff: -12 }).connect(envelope);
    const maraca = new Tone.Noise('brown').connect(filter);
    const lfo = new Tone.LFO({ frequency: 12, min: 0.3, max: 1 }).connect(lfoGain.gain);
    
    return { maraca, envelope, filter, lfo, lfoGain, gain };
  })(),

  // =============================================================================
  // TR-909 INSTRUMENTS - Hybrid Analog/Digital Drum Machine
  // =============================================================================

  // TR-909 Snare: Analog punch with digital clarity
  sd: (() => {
    const gain = new Tone.Gain(0.5).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.1
    }).connect(gain);
    
    const body = new Tone.Oscillator({ frequency: 200, type: 'sine', volume: -8 }).connect(envelope);
    const buzzFilt = new Tone.Filter({ frequency: 1500, type: 'bandpass', Q: 4, rolloff: -12 }).connect(envelope);
    const snapFilt = new Tone.Filter({ frequency: 6000, type: 'bandpass', Q: 6, gain: -10 }).connect(envelope);
    const noise = new Tone.Noise('white');
    noise.connect(buzzFilt);
    noise.connect(snapFilt);
    
    return { body, noise, envelope, buzzFilt, snapFilt, gain };
  })(),

  // TR-909 Closed Hi-Hat: Lo-Fi digital clarity
  ch: (() => {
    const gain = new Tone.Gain(0.4).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.02
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 7100, type: 'highpass', Q: 1, rolloff: -24 }).connect(envelope);
    const noise = new Tone.Noise('pink').connect(filter);
    
    return { noise, envelope, filter, gain };
  })(),

  // TR-909 Open Hi-Hat: Lo-Fi digital clarity with longer decay
  oh: (() => {
    const gain = new Tone.Gain(0.4).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.4,
      sustain: 0,
      release: 0.1
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 7100, type: 'highpass', Q: 1, rolloff: -24 }).connect(envelope);
    const noise = new Tone.Noise('pink').connect(filter);
    
    return { noise, envelope, filter, gain };
  })(),

  // TR-909 Cymbal: Bright sustained metallic crash
  cym: (() => {
    const gain = new Tone.Gain(0.25).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 1.6,
      sustain: 0,
      release: 0.5
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 7200, type: 'highpass', Q: 1, rolloff: -24 }).connect(envelope);
    const cymbal = new Tone.Noise('pink').connect(filter);
    const lfo = new Tone.LFO({ frequency: 1.2, min: 6600, max: 7800 }).connect(filter.frequency);
    
    return { cymbal, envelope, filter, lfo, gain };
  })(),

  // TR-808 Crash Cymbal: Explosive bright crash sound (GM Standard)
  cr: (() => {
    const gain = new Tone.Gain(0.3).connect(masterVolume);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 1.5,
      sustain: 0,
      release: 0.2
    }).connect(gain);
    
    const filter = new Tone.Filter({ frequency: 8000, type: 'highpass', Q: 2, rolloff: -24 }).connect(envelope);
    const noise = new Tone.Noise('white').connect(filter);
    
    return { noise, envelope, filter, gain };
  })(),

  };
}

// =============================================================================
// Enhance All Legacy Synths with Effects Chain (fallback path only)
// =============================================================================

// Enhance each legacy synth with effects chain for modal controls
function enhanceLegacySynthsWithEffects() {
Object.keys(synths).forEach(instrument => {
  const synth = synths[instrument];
  
  // Add effects chain for modal controls
  synth.effects = {
    reverb: new Tone.Reverb({ roomSize: 0.2, wet: 0 }),
    delay: new Tone.FeedbackDelay("8n", 0),
    distortion: new Tone.Distortion(0),
    compressor: new Tone.Compressor(-30, 3),
    eq: new Tone.EQ3()
  };
  
  // Create effects chain
  const effectsChain = synth.effects.distortion.chain(
    synth.effects.compressor,
    synth.effects.eq,
    synth.effects.reverb,
    synth.effects.delay
  );
  
  // Connect effects chain to existing signal path
  // For most synths, we'll insert the effects between the filter and envelope
  if (synth.filter && synth.envelope) {
    // Disconnect filter from envelope
    synth.filter.disconnect();
    // Connect filter → effects → envelope
    synth.filter.connect(effectsChain);
    effectsChain.connect(synth.envelope);
  } else if (synth.envelope) {
    // If no filter, connect effects directly to envelope
    effectsChain.connect(synth.envelope);
  }
  
  // Add disposal method for cleanup
  synth.dispose = function() {
    if (this.effects) {
      Object.values(this.effects).forEach(effect => effect.dispose());
    }
  };
});
}

// =============================================================================
// Modal Control Functions for Enhanced Audio
// =============================================================================

// Initialize modal controls with default values
function initializeModalControls(instrument) {
  // Get TRUE master defaults for this instrument
  const trueMasterDefaults = getTrueMasterDefaults(instrument);
  
  // Apply TRUE master default values to audio parameters
  const modalControls = ['modalAttack', 'modalDecay', 'modalSustain', 'modalRelease', 'modalFilter', 'modalResonance', 'modalReverb', 'modalDelay', 'modalDistortion', 'modalCompression', 'modalEqHigh', 'modalEqLow'];
  modalControls.forEach(param => {
    setModalKnob(instrument, param, trueMasterDefaults[param]);
    updateMainKnobValue(param, trueMasterDefaults[param]);
  });
}

// Fill only missing per-instrument modal keys (never clobber stored values)
function initializeModalControlsUI(instrument) {
  const trueMasterDefaults = getTrueMasterDefaults(instrument);
  const store = ensureModalInst(instrument);
  const modalControls = ['modalAttack', 'modalDecay', 'modalSustain', 'modalRelease', 'modalFilter', 'modalResonance', 'modalReverb', 'modalDelay', 'modalDistortion', 'modalCompression', 'modalEqHigh', 'modalEqLow'];
  modalControls.forEach(param => {
    if (store[param] === undefined) {
      store[param] = trueMasterDefaults[param];
    }
  });
}

// Enhanced envelope parameter mapping
function updateEnvelopeControls(instrument, paramType, value) {
  // Modern engine path handles decay via GrooveAudio.setParam (updateMainKnobValue)
  const synth = window.GrooveAudio ? null : ensureLegacySynths()[instrument];
  if (!synth || !synth.envelope) return;
  
  const normalizedValue = value / 10; // 0-10 to 0-1
  
  switch(paramType) {
    case 'attack':
      // Map 0-10 to 0.001-2.0 seconds (logarithmic)
      synth.envelope.attack = 0.001 + Math.pow(normalizedValue, 2) * 1.999;
      break;
    case 'decay':
      // Map 0-10 to 0.01-3.0 seconds
      synth.envelope.decay = 0.01 + normalizedValue * 2.99;
      break;
    case 'sustain':
      // Map 0-10 to 0-1 amplitude
      synth.envelope.sustain = normalizedValue;
      break;
    case 'release':
      // Map 0-10 to 0.01-5.0 seconds
      synth.envelope.release = 0.01 + normalizedValue * 4.99;
      break;
  }
}

// Filter parameter mapping with musical ranges
function updateFilterControls(instrument, paramType, value) {
  const synth = window.GrooveAudio ? null : ensureLegacySynths()[instrument];
  if (!synth || !synth.filter) return;
  
  const normalizedValue = value / 10;
  
  switch(paramType) {
    case 'filter':
      // Map 0-10 to 20Hz-20kHz (logarithmic)
      const minFreq = 20;
      const maxFreq = 20000;
      const frequency = minFreq * Math.pow(maxFreq / minFreq, normalizedValue);
      synth.filter.frequency.value = frequency;
      break;
    case 'resonance':
      // Map 0-10 to Q: 0.1-30 (exponential for musical feel)
      synth.filter.Q.value = 0.1 + Math.pow(normalizedValue, 2) * 29.9;
      break;
  }
}

// Effects parameter mapping
function updateEffectsControls(instrument, effectType, value) {
  // Modern engine path routes drive/sendRev/sendDly via GrooveAudio.setParam
  const synth = window.GrooveAudio ? null : ensureLegacySynths()[instrument];
  if (!synth || !synth.effects) return;
  
  const normalizedValue = value / 10;
  
  switch(effectType) {
    case 'reverb':
      // Control reverb wet/dry mix
      synth.effects.reverb.wet.value = normalizedValue;
      break;
    case 'delay':
      // Control delay feedback (0-0.8 to prevent runaway feedback)
      synth.effects.delay.feedback.value = normalizedValue * 0.8;
      break;
    case 'distortion':
      // Control distortion amount (0-1)
      synth.effects.distortion.distortion = normalizedValue;
      break;
    case 'compression':
      // Control compression ratio (1:1 to 20:1)
      synth.effects.compressor.ratio.value = 1 + normalizedValue * 19;
      break;
  }
}

// EQ parameter mapping
function updateEQControls(instrument, band, value) {
  const synth = window.GrooveAudio ? null : ensureLegacySynths()[instrument];
  if (!synth || !synth.effects || !synth.effects.eq) return;
  
  const gain = (value - 5) * 3; // Map 0-10 to -15dB to +15dB
  
  switch(band) {
    case 'eqHigh':
      synth.effects.eq.high.value = gain;
      break;
    case 'eqLow':
      synth.effects.eq.low.value = gain;
      break;
  }
}

// Pattern controls implementation
function updatePatternControls(instrument, controlType, value) {
  if (!instrument) return;
  
  // Store the pattern control value for this instrument
  patternControls[controlType][instrument] = value;
  refreshPatternFxBadges();
}

// =============================================================================
// Application State
// =============================================================================

// Main state variables - Separate patterns for A and B
let patterns = {
  a: Array(16).fill().map(() => ({
    part1: Array(16).fill().map(() => ({})),
    part2: Array(16).fill().map(() => ({})),
    length1: 16,
    length2: 0,
    sfx1: {}
  })),
  b: Array(16).fill().map(() => ({
    part1: Array(16).fill().map(() => ({})),
    part2: Array(16).fill().map(() => ({})),
    length1: 16,
    length2: 0,
    sfx1: {}
  }))
};

let currentPattern = 0;
let currentPart = "1stPart";
let currentInstrument = "bd";
let variation = "a";
let isPlaying = false;
let currentStep = 0;
let tempo = 120;

// Last loaded style/inspiration key — used by AI style prompt (and UI sync).
// null when the user is on a hand-built pattern with no preset identity.
let currentPresetSelection = null;
let isDraggingClear = false;

// Mute/Solo state tracking
const muteSoloState = {
  muted: new Set(),
  soloed: new Set()
};

// Knob parameters storage with better default levels
const knobValues = {
  tempo: 3, // 120 BPM = (120-60)/20 = 3 in knob scale (0-10 range)
  masterVolume: 7,
  // Master bus knobs (WS-J integration — routed via routeEngineKnob)
  masterDrive: 0, masterGlue: 0, accentAmount: 5,
  // CP clap voice (Decree 1 — new 17th voice row)
  levelCp: 7, gainCp: 5, panCp: 5, tuneCp: 5, shuffleCp: 0,
  // Level controls (existing)
  levelBd: 8, levelSd: 7, levelLt: 6, levelMt: 6, levelHt: 6, levelRim: 6,
  levelHc: 6, levelMc: 6, levelLc: 6, levelCb: 7, levelCr: 7, levelCym: 6, levelOh: 7,
  levelCh: 7, levelCl: 7, levelMa: 6,   // Gain controls (new)
  gainBd: 5, gainSd: 5, gainLt: 5, gainMt: 5, gainHt: 5, gainRim: 5,
  gainHc: 5, gainMc: 5, gainLc: 5, gainCb: 5, gainCr: 5, gainCym: 5, gainOh: 5,
  gainCh: 5, gainCl: 5, gainMa: 5,   // Pan controls (new)
  panBd: 5, panSd: 5, panLt: 5, panMt: 5, panHt: 5, panRim: 5,
  panHc: 5, panMc: 5, panLc: 5, panCb: 5, panCr: 5, panCym: 5, panOh: 5,
  panCh: 5, panCl: 5, panMa: 5,   // Tune controls (new)
  tuneBd: 5, tuneSd: 5, tuneLt: 5, tuneMt: 5, tuneHt: 5, tuneRim: 5,
  tuneHc: 5, tuneMc: 5, tuneLc: 5, tuneCb: 5, tuneCr: 5, tuneCym: 5, tuneOh: 5,
  tuneCh: 5, tuneCl: 5, tuneMa: 5,   // Shuffle controls (new)
  shuffleBd: 0, shuffleSd: 0, shuffleLt: 0, shuffleMt: 0, shuffleHt: 0, shuffleRim: 0,
  shuffleHc: 0, shuffleMc: 0, shuffleLc: 0, shuffleCb: 0, shuffleCr: 0, shuffleCym: 0, shuffleOh: 0,
  shuffleCh: 0, shuffleCl: 0, shuffleMa: 0,   // Global controls (existing)
  swing: 0, humanize: 0, polyrhythm: 0, syncopation: 0, displacement: 0, glitchRhythm: 0
};

// Shipped factory defaults, captured before any user mutation. Master reset
// restores from this snapshot instead of flattening every knob to one value.
const DEFAULT_KNOB_VALUES = JSON.parse(JSON.stringify(knobValues));

// =============================================================================
// Audio Engine Functions
// =============================================================================

// Universal instrument triggering function.
//
//   triggerInstrument(inst, volume 0–1, timeOffset s, opts)
//   opts = { time, velocity 1–127, accent, immediate }  (all optional)
//
// Mute/solo gate first (unchanged), then the modern per-hit engine
// (window.GrooveAudio) when it loaded; the legacy always-on synth graph is
// the else branch, built lazily on first use.
function triggerInstrument(inst, volume = 0.7, timeOffset = 0, opts = null) {
  // Check mute/solo states
  if (muteSoloState.muted.has(inst)) {
    return; // Don't play if muted
  }

  if (muteSoloState.soloed.size > 0 && !muteSoloState.soloed.has(inst)) {
    return; // Don't play if other instruments are soloed and this one isn't
  }

  // Modern engine path — sample-accurate, per-hit disposable graphs
  if (window.GrooveAudio && typeof window.GrooveAudio.trigger === 'function') {
    const o = opts || {};
    const velocity = (o.velocity != null)
      ? Math.max(1, Math.min(127, Math.round(o.velocity)))
      : Math.max(1, Math.min(127, Math.round(volume * 127)));
    const triggerOpts = { velocity, accent: !!o.accent };
    if (o.immediate) {
      triggerOpts.immediate = true;
    } else if (typeof o.time === 'number') {
      triggerOpts.time = o.time + timeOffset;
    } else if (timeOffset && typeof Tone !== 'undefined') {
      triggerOpts.time = Tone.now() + timeOffset;
    }
    // Pattern pitch-bend (±0.5 semitones) applied as per-hit tune offset
    const pitchBendAmount = patternControls.pitchBend[inst] ?? 5;
    triggerOpts.tuneOffset = ((pitchBendAmount - 5) / 5) * 0.5;
    window.GrooveAudio.trigger(inst, triggerOpts);
    return;
  }

  // Legacy fallback path
  const synth = ensureLegacySynths()[inst];
  if (!synth) return;
  const now = ((opts && typeof opts.time === 'number') ? opts.time : Tone.now()) + timeOffset;
  
  // Apply pattern controls - PITCH BEND
  const pitchBendAmount = patternControls.pitchBend[inst] || 5;
  const pitchBendRange = ((pitchBendAmount - 5) / 5) * 0.5; // -0.5 to +0.5 semitones
  
  try {
    // Apply gain control
    const gainValue = knobValues[`gain${inst.charAt(0).toUpperCase()}${inst.slice(1)}`] || 5;
    const gainMultiplier = gainValue / 5; // Convert 0-10 to 0-2 multiplier
    
    // Apply pan control
    const panValue = knobValues[`pan${inst.charAt(0).toUpperCase()}${inst.slice(1)}`] || 5;
    const panPosition = (panValue - 5) / 5; // Convert 0-10 to -1 to +1
    
    // Apply tune control
    const tuneValue = knobValues[`tune${inst.charAt(0).toUpperCase()}${inst.slice(1)}`] || 5;
    const tuneOffset = (tuneValue - 5) * 0.1; // Convert 0-10 to -0.5 to +0.5 semitones
    
    // Combine tune and pitch bend
    const totalPitchOffset = tuneOffset + pitchBendRange;
    
    // Apply volume scaling to gain
    if (synth.gain) {
      synth.gain.gain.setValueAtTime(volume * gainMultiplier, now);
    }
    
    // Apply panning if the synth supports it
    if (synth.pan) {
      synth.pan.pan.value = panPosition;
    }
    
    // Apply tuning and pitch bend if the synth supports it
    if (synth.osc && synth.osc.frequency) {
      const currentFreq = synth.osc.frequency.value;
      synth.osc.frequency.setValueAtTime(currentFreq * Math.pow(2, totalPitchOffset), now);
    }
    
    // TR-808 Bass Drum with pitch envelope and noise
    if (inst === 'bd') {
      synth.osc.start(now);
      synth.noise.start(now).stop(now + 0.02);
      synth.pitchEnv.triggerAttack(now);
      synth.envelope.triggerAttackRelease(1.0, now);
      synth.osc.stop(now + 1.0);
    }
    
    // TR-909 Snare with body oscillator and dual noise filters
    else if (inst === 'sd') {
      synth.body.start(now).stop(now + 0.3);
      synth.noise.start(now).stop(now + 0.3);
      synth.envelope.triggerAttackRelease(0.3, now);
    }
    
    // TR-808 Toms with pitch modulation
    else if (['lt', 'mt', 'ht'].includes(inst)) {
      synth.osc.start(now);
      synth.pitchEnv.triggerAttack(now);
      synth.envelope.triggerAttackRelease(0.45, now);
      synth.osc.stop(now + 0.55);
    }
    
    // TR-808 Rim Shot with noise and sine
    else if (inst === 'rim') {
      synth.sine.start(now).stop(now + 0.025);
      synth.noise.start(now).stop(now + 0.025);
      synth.envelope.triggerAttackRelease(0.025, now);
    }
    
    // TR-808 Congas with pitch modulation and transient noise
    else if (['hc', 'mc', 'lc'].includes(inst)) {
      synth.osc.start(now);
      synth.noise.start(now).stop(now + 0.02);
      synth.pitchEnv.triggerAttack(now);
      synth.envelope.triggerAttackRelease(0.32, now);
      synth.osc.stop(now + 0.37);
    }
    
    // TR-808 Cowbell with dual oscillators
    else if (inst === 'cb') {
      synth.osc1.start(now);
      synth.osc2.start(now);
      synth.envelope.triggerAttackRelease(0.55, now);
      synth.osc1.stop(now + 0.65);
      synth.osc2.stop(now + 0.65);
    }
    
    // TR-808 Claves with sine and noise
    else if (inst === 'cl') {
      synth.sine.start(now).stop(now + 0.015);
      synth.noise.start(now).stop(now + 0.015);
      synth.envelope.triggerAttackRelease(0.015, now);
    }
    
    // TR-808 Maracas with LFO modulation
    else if (inst === 'ma') {
      synth.maraca.start(now).stop(now + 0.27);
      synth.lfo.start(now).stop(now + 0.27);
      synth.envelope.triggerAttackRelease(0.22, now);
    }
    
    // TR-909 Hi-Hats (closed and open)
    else if (['ch', 'oh'].includes(inst)) {
      const duration = inst === 'ch' ? 0.12 : 0.5;
      synth.noise.start(now).stop(now + duration);
      synth.envelope.triggerAttackRelease(duration - 0.02, now);
    }
    
    // TR-909 Cymbal with LFO modulation
    else if (inst === 'cym') {
      synth.cymbal.start(now).stop(now + 2.1);
      synth.lfo.start(now).stop(now + 2.1);
      synth.envelope.triggerAttackRelease(1.6, now);
    }
    
    // TR-808 Crash Cymbal (GM Standard)
    else if (inst === 'cr') {
      synth.noise.start(now).stop(now + 1.5);
      synth.envelope.triggerAttackRelease(1.5, now);
    }
    
    
    // Fallback for any remaining simple synths
    else if (synth.triggerAttackRelease) {
      synth.volume.setValueAtTime(Tone.gainToDb(volume), now);
      synth.triggerAttackRelease("8n", now);
    }

  } catch (error) {
    console.warn(`[GrooveCore] legacy trigger failed for '${inst}':`, error);
  }
}

// Can this instrument make a sound right now (modern engine or legacy synth)?
function canTrigger(inst) {
  if (window.GrooveAudio && typeof window.GrooveAudio.trigger === 'function') return true;
  return !!ensureLegacySynths()[inst];
}

// -----------------------------------------------------------------------------
// Engine knob routing (plan §5.3): main-panel knob/slider ids follow the
// `<param><Inst>` knobValues convention; master ids route to the master bus.
// No-ops gracefully while the engine modules (or new DOM ids) are absent.
// -----------------------------------------------------------------------------
function routeEngineKnob(id, value) {
  const GA = window.GrooveAudio;
  if (!GA || !id) return;
  if (id === 'masterVolume') { if (GA.master) GA.master.set('volume', value); return; }
  if (id === 'masterDrive')  { if (GA.master) GA.master.set('drive', value); return; }
  if (id === 'masterGlue')   { if (GA.master) GA.master.set('glue', value); return; }
  if (id === 'accentAmount') { if (GA.master) GA.master.set('accentAmount', value); return; }
  const match = /^(level|tune|pan|gain)([A-Z][A-Za-z]*)$/.exec(id);
  if (match && typeof GA.setParam === 'function') {
    const inst = match[2].charAt(0).toLowerCase() + match[2].slice(1);
    GA.setParam(inst, match[1], value);
  }
}

// Push the app's current mixer/tuning state into the engine once it exists.
// GrooveAudio.setParam queues values made before init resolves, so this is
// safe to call the moment the modules have loaded.
let engineParamsSynced = false;

// Declared early so syncModalEngineParams can close over them safely.
// Keep in sync with the modal-helpers block further below / GrooveParams.INSTRUMENTS.
const MODAL_INSTRUMENT_IDS = [
  'bd', 'sd', 'lt', 'mt', 'ht', 'rim', 'cp', 'hc', 'mc', 'lc',
  'cb', 'cl', 'ma', 'ch', 'oh', 'cym', 'cr'
];
const ENGINE_MODAL_PARAM_MAP = {
  modalTune: 'tune',
  modalAttack: 'attack',
  modalDecay: 'decay',
  modalSustain: 'sustain',
  modalRelease: 'release',
  modalFilter: 'tone',       // Filter knob → engine tone (cutoff / brightness)
  modalTone: 'tone',
  modalResonance: 'resonance',
  modalSnappy: 'snappy',
  modalDistortion: 'drive',
  modalReverb: 'sendRev',
  modalDelay: 'sendDly',
  modalCompression: 'compression',
  modalEqHigh: 'eqHigh',
  modalEqLow: 'eqLow',
  modalPan: 'pan',
  modalGain: 'gain'
};

// Per-instrument modal store: modalKnobValues[inst][knobId] = 0..10
// Declared early for syncModalEngineParams / GC bridge consumers.
let modalKnobValues = {};

function syncModalEngineParams() {
  if (!window.GrooveAudio || typeof window.GrooveAudio.setParam !== 'function') return;
  const insts = (window.GrooveParams && window.GrooveParams.INSTRUMENTS) || MODAL_INSTRUMENT_IDS;
  try {
    insts.forEach(inst => {
      const store = modalKnobValues[inst];
      if (!store || typeof store !== 'object') return;
      Object.entries(ENGINE_MODAL_PARAM_MAP).forEach(([modalKey, engineKey]) => {
        if (store[modalKey] !== undefined && store[modalKey] !== null) {
          window.GrooveAudio.setParam(inst, engineKey, store[modalKey]);
        }
      });
    });
  } catch (error) {
    console.warn('[GrooveCore] modal engine param sync failed:', error);
  }
}

function syncEngineParams() {
  if (engineParamsSynced || !window.GrooveAudio || !window.GrooveParams) return;
  engineParamsSynced = true;
  try {
    window.GrooveParams.INSTRUMENTS.forEach(inst => {
      const key = inst.charAt(0).toUpperCase() + inst.slice(1);
      ['level', 'tune', 'pan', 'gain'].forEach(param => {
        const v = knobValues[`${param}${key}`];
        if (v !== undefined) window.GrooveAudio.setParam(inst, param, v);
      });
    });
    if (knobValues.masterVolume !== undefined) {
      window.GrooveAudio.master.set('volume', knobValues.masterVolume);
    }
    if (knobValues.masterDrive !== undefined) {
      window.GrooveAudio.master.set('drive', knobValues.masterDrive);
    }
    if (knobValues.masterGlue !== undefined) {
      window.GrooveAudio.master.set('glue', knobValues.masterGlue);
    }
    if (knobValues.accentAmount !== undefined) {
      window.GrooveAudio.master.set('accentAmount', knobValues.accentAmount);
    }
    syncModalEngineParams();
  } catch (error) {
    console.warn('[GrooveCore] engine param sync failed:', error);
  }
}

// =============================================================================
// Sequencer Functions
// =============================================================================

// Cached step-button lookups — the audio callback must never run
// querySelectorAll. The grid DOM is static, so the cache is built once on
// first use (after 'load') and reused for the life of the page.
let cachedStepRows = null;
let cachedStepButtons = null;

function getStepRowCache() {
  if (!cachedStepRows) {
    cachedStepRows = [];
    document.querySelectorAll('.instrument-row').forEach(row => {
      cachedStepRows.push(row.querySelectorAll('.step-button'));
    });
    cachedStepButtons = document.querySelectorAll('.step-button');
  }
  return cachedStepRows;
}

// Sequencer step callback. `time` is Tone.Transport's sample-accurate
// scheduling time — it is passed into every trigger so hits land exactly on
// the grid regardless of main-thread jitter.
function updateStep(time) {
  if (!isPlaying) return;

  const pattern = patterns[variation][currentPattern];
  const totalLength = pattern.length1 || 16; // Use actual pattern length or default to 16
  const currentPartStep = currentStep % totalLength;
  const t = (typeof time === 'number') ? time : Tone.now();

  // Playhead moves on the draw thread, synced to the audible step
  const rows = getStepRowCache();
  const paintPlayhead = () => {
    cachedStepButtons.forEach(s => s.classList.remove('blink'));
    rows.forEach(buttons => {
      if (buttons[currentPartStep]) {
        buttons[currentPartStep].classList.add('blink');
      }
    });
  };
  try {
    if (typeof Tone !== 'undefined' && Tone.Draw) {
      Tone.Draw.schedule(paintPlayhead, t);
    } else {
      paintPlayhead();
    }
  } catch (error) {
    console.warn('[GrooveCore] playhead paint failed:', error);
  }

  // Notify modules (playhead followers, live record, etc.)
  if (window.GC) window.GC.events.emit('step', currentStep);

  // Trigger this step's hits
  try {
    scheduleStepHits(pattern, currentPartStep, t);
  } catch (error) {
    console.warn('[GrooveCore] step scheduling failed:', error);
  }

  currentStep = (currentStep + 1) % totalLength;
}

// Compute and dispatch every hit on one step. Uses the canonical event list
// (GrooveEvents.computePatternEvents — Decree 2: preview == export) which
// expands per-step velocity, the accent row, and sfx1 ratchet/flam/probability
// with tempo-relative swing/shuffle. Falls back to a plain per-cell walk if
// js/core/events.js failed to load.
function scheduleStepHits(pattern, stepIndex, t) {
  const stepDur = Tone.Time('16n').toSeconds();

  if (window.GrooveEvents && typeof window.GrooveEvents.computePatternEvents === 'function') {
    // Per-instrument shuffle map from the shuffle sliders
    const shufflePerInst = {};
    Object.keys(knobValues).forEach(key => {
      const match = /^shuffle([A-Z][A-Za-z]*)$/.exec(key);
      if (match && knobValues[key] > 0) {
        const inst = match[1].charAt(0).toLowerCase() + match[1].slice(1);
        shufflePerInst[inst] = knobValues[key];
      }
    });

    const events = window.GrooveEvents.computePatternEvents(pattern, {
      swing: knobValues.swing,
      shufflePerInst,
      bpm: Tone.Transport.bpm.value,
      ppq: 480,
      deterministic: true,
      seed: (Math.random() * 0x7fffffff) | 0 // fresh probability roll per pass
    });

    for (const e of events) {
      if (e.step !== stepIndex) continue;
      // Offset within/around the step: tempo-relative swing + ratchet/flam
      const withinStep = e.timeSec - stepIndex * stepDur;
      dispatchHit(e.inst, e.velocity, e.accent, t + withinStep, stepIndex, stepDur);
    }
    return;
  }

  // Legacy fallback: walk the cell directly (no sfx1 expansion)
  const cell = pattern.part1[stepIndex];
  if (!cell) return;
  const stepAccent = !!cell.accent;
  Object.keys(cell).forEach(inst => {
    if (inst === 'accent' || !cell[inst]) return;
    const velocity = cell[inst] === true ? 100 : Math.min(127, Math.max(1, Number(cell[inst]) || 100));
    const shuffleValue = knobValues[`shuffle${inst.charAt(0).toUpperCase()}${inst.slice(1)}`] || 0;
    const instSwing = shuffleValue > 0 ? shuffleValue : (knobValues.swing || 0);
    const swingOffset = (stepIndex % 2 === 1) ? (instSwing / 10) * 0.55 * stepDur : 0;
    dispatchHit(inst, velocity, stepAccent, t + swingOffset, stepIndex, stepDur);
  });
}

// Apply the per-instrument pattern controls (modal knobs) and global groove
// knobs to one event, then trigger with an absolute time.
function dispatchHit(inst, velocity, accent, when, stepIndex, stepDur) {
  // Pattern controls - PROBABILITY CHECK (?? so 0 means never play)
  const probability = patternControls.probability[inst] ?? 10;
  if ((probability / 10) < Math.random()) return; // Skip this hit based on probability

  // Pattern controls - VELOCITY VARIATION (5 = neutral / no variation)
  let vel = velocity;
  const velocityVariation = patternControls.velocity[inst] ?? 5;
  const velocityRange = (velocityVariation - 5) / 5; // -1 to +1
  vel *= (1 + (Math.random() - 0.5) * velocityRange * 0.5);

  // Syncopation (emphasize off-beats)
  const syncopationAmount = knobValues.syncopation / 10;
  if (syncopationAmount > 0 && stepIndex % 2 === 1) {
    vel *= (1 + syncopationAmount * 0.3);
  }
  vel = Math.max(1, Math.min(127, Math.round(vel)));

  let offset = 0;

  // Humanize — tempo-relative: up to ±12% of a 16th at knob 10
  const humanizeAmount = knobValues.humanize / 10;
  if (humanizeAmount > 0) {
    offset += (Math.random() * 2 - 1) * humanizeAmount * 0.12 * stepDur;
  }

  // Pattern controls - TIMING ADJUSTMENT (-50ms to +50ms)
  const timingAdjustment = patternControls.timing[inst] ?? 5;
  offset += ((timingAdjustment - 5) / 5) * 0.05;

  // Polyrhythm (different timing per instrument)
  const polyrhythmAmount = knobValues.polyrhythm / 10;
  if (polyrhythmAmount > 0 && ['ch', 'oh', 'cl'].includes(inst)) {
    offset += (polyrhythmAmount * 0.05) * Math.sin(stepIndex * Math.PI / 3);
  }

  // Displacement
  const displacementAmount = knobValues.displacement / 10;
  if (displacementAmount > 0) {
    offset += displacementAmount * 0.03;
  }

  // Glitch rhythm (random timing variations)
  const glitchAmount = knobValues.glitchRhythm / 10;
  if (glitchAmount > 0 && Math.random() < glitchAmount * 0.3) {
    offset += (Math.random() - 0.5) * glitchAmount * 0.1;
  }

  const hitTime = when + offset;

  // Legacy-path volume (level slider × velocity); the modern engine ignores
  // this and applies the level slider as channel gain instead.
  const levelKey = `level${inst.charAt(0).toUpperCase()}${inst.slice(1)}`;
  const trig = (v, at) => {
    v = Math.max(1, Math.min(127, Math.round(v)));
    const legacyVolume = Math.min(1, ((knobValues[levelKey] || 7) / 10) * (v / 100));
    triggerInstrument(inst, legacyVolume, 0, { time: at, velocity: v, accent });
  };

  // Pattern controls - FLAM EFFECT (modal knob; distinct from per-step sfx1 flam)
  const flamAmount = patternControls.flam[inst] ?? 0;
  if (flamAmount > 0) {
    const flamDelay = (flamAmount / 10) * 0.02; // 0-20ms flam delay
    trig(vel * 0.7, hitTime);            // First hit (quieter)
    trig(vel, hitTime + flamDelay);      // Second hit (main)
  } else {
    trig(vel, hitTime);
  }

  // Pattern controls - ROLL EFFECT
  const rollAmount = patternControls.roll[inst] ?? 0;
  if (rollAmount > 3) { // Only roll if knob is above middle position
    const rollHits = Math.floor((rollAmount - 3) / 2) + 1; // 1-3 extra hits
    for (let i = 1; i <= rollHits; i++) {
      trig(vel * (0.8 - i * 0.1), hitTime + i * 0.03); // 30ms apart, decreasing
    }
  }
}

/** Manual step-click / pad preview with flam + roll from modal pattern knobs. */
function previewPatternHit(inst, velocity) {
  const level = (knobValues[`level${inst.charAt(0).toUpperCase()}${inst.slice(1)}`] || 7) / 10;
  let vel = Math.max(1, Math.min(127, Math.round(Number(velocity) || 100)));
  const velocityVariation = patternControls.velocity[inst] ?? 5;
  const velocityRange = (velocityVariation - 5) / 5;
  vel = Math.max(1, Math.min(127, Math.round(vel * (1 + (Math.random() - 0.5) * velocityRange * 0.5))));

  const flamAmount = patternControls.flam[inst] ?? 0;
  const rollAmount = patternControls.roll[inst] ?? 0;
  const now = (typeof Tone !== 'undefined' && Tone.now) ? Tone.now() : 0;

  const fire = (v, at) => {
    v = Math.max(1, Math.min(127, Math.round(v)));
    const opts = { velocity: v };
    if (at != null && typeof at === 'number') opts.time = at;
    else opts.immediate = true;
    triggerInstrument(inst, Math.min(1, level * (v / 100)), 0, opts);
  };

  if (flamAmount > 0) {
    const flamDelay = (flamAmount / 10) * 0.02;
    fire(vel * 0.7, now);
    fire(vel, now + flamDelay);
  } else {
    fire(vel, null);
  }

  if (rollAmount > 3) {
    const rollHits = Math.floor((rollAmount - 3) / 2) + 1;
    const base = (flamAmount > 0) ? (now + (flamAmount / 10) * 0.02) : now;
    for (let i = 1; i <= rollHits; i++) {
      fire(vel * (0.8 - i * 0.1), base + i * 0.03);
    }
  }
}

// Update step display based on current state
function updateStepDisplay() {
  const pattern = patterns[variation][currentPattern];
  const part = currentPart === "1stPart" ? pattern.part1 : pattern.part2;
  const patternLength = pattern.length1 || 16;
  
  // Update all step buttons for each instrument
  document.querySelectorAll('.instrument-row').forEach(row => {
    // Get instrument code from the first step button (which already has correct data-instrument)
    const firstStepButton = row.querySelector('.step-button[data-instrument]');
    const instrumentCode = firstStepButton ? firstStepButton.dataset.instrument : '';
    
    if (instrumentCode === '') {
    }
    const steps = row.querySelectorAll('.step-button');
  
  steps.forEach((step, index) => {
    step.classList.remove('active', 'disabled');
      const cellValue = part[index] ? part[index][instrumentCode] : undefined;
      if (cellValue) {
      step.classList.add('active');
      // Expose the per-step velocity (true = legacy 100) for CSS tiering
      step.dataset.vel = cellValue === true ? 100 : Number(cellValue) || 100;
    } else {
      delete step.dataset.vel;
    }

    // Disable steps beyond pattern length
    if (index >= patternLength) {
      step.classList.add('disabled');
    }
    });
  });
}

// =============================================================================
// Inspiration Sequence Functions
// =============================================================================

// Map inspiration sequence instrument names to app instrument codes
function mapInstrumentName(instrumentName) {
  const mapping = {
    'bass_drum': 'bd',
    'snare_drum': 'sd', 
    'closed_hihat': 'ch',
    'open_hihat': 'oh',
    'cowbell': 'cb',
    'claves': 'cl',
    'cym': 'cym',
    'tom_low': 'lt',
    'mt': 'mt', 
    'ht': 'ht',
    'conga_high': 'hc',
    'conga_mid': 'mc',
    'conga_low': 'lc',
    'ma': 'ma',
    'rimshot': 'rim',
    // Extended aliases used by the inspiration library (previously dropped hits)
    'crash_cymbal': 'cr',
    'maracas': 'ma',
    'cymbal': 'cym',
    'low_tom': 'lt',
    'mid_tom': 'mt',
    'high_tom': 'ht',
    'tom_mid': 'mt',
    'tom_high': 'ht',
    'high_conga': 'hc',
    'mid_conga': 'mc',
    'low_conga': 'lc',
    'open_hi_hat': 'oh',
    'closed_hi_hat': 'ch'
  };
  return mapping[instrumentName] || instrumentName;
}

// Convert velocity (0-127) to knob scale (0-10)
function velocityToKnobValue(velocity) {
  return Math.max(0, Math.min(10, (velocity / 127) * 10));
}

// Apply the canonical rotary-knob rotation for a 0-10 value (same math as setupKnobs)
function applyKnobRotation(el, value) {
  if (!el) return;
  // Google icon naturally points to ~11 o'clock (330 deg); knobs sweep 7 o'clock
  // (210 deg, value 0) clockwise to 5 o'clock (510 deg, value 10).
  const iconOffset = 330;
  const minPosition = 210;
  const maxPosition = 510;
  const targetAngle = minPosition + (value / 10) * (maxPosition - minPosition);
  el.style.setProperty('--rotation', `${targetAngle - iconOffset}deg`);
}

// Update volume slider visual position programmatically
function updateSliderVisual(sliderId, value) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    const percentage = (value / 10) * 100; // Convert 0-10 to 0-100%
    slider.style.setProperty('--slider-width', `${percentage}%`);
  }
}

// Load inspiration sequence
function loadInspirationSequence(sequenceId) {
  const sequence = inspirationSequences[sequenceId];
  if (!sequence) return;

  rememberPresetSelection('groove', sequenceId);
  
  // Apply sequence-specific BPM if available
  if (sequence.bpm) {
    tempo = sequence.bpm;
    // Convert to knob scale (60-260 BPM range) and clamp to valid range
    knobValues.tempo = Math.max(0, Math.min(10, (sequence.bpm - 60) / 20));
    
    const tempoKnob = document.querySelector('#tempo');
    if (tempoKnob) {
      // Use the same rotation calculation as the main knob function
      const iconOffset = 330;
      const minPosition = 210;
      const maxPosition = 510;
      const targetAngle = minPosition + (knobValues.tempo / 10) * (maxPosition - minPosition);
      const rotation = targetAngle - iconOffset;
      tempoKnob.style.setProperty('--rotation', `${rotation}deg`);
    }
    
    // Update Tone.js transport BPM
    Tone.Transport.bpm.value = tempo;
    
    // Update nixie tube BPM display
    updateNixieBPMDisplay(tempo);
  }
  
  // Clear current pattern first
  const pattern = patterns[variation][currentPattern];
  pattern.part1 = Array(16).fill().map(() => ({}));
  pattern.length1 = 16;
  pattern.length2 = 0;
  pattern.sfx1 = {};

  // Clear all visual highlighting
  document.querySelectorAll('.column-highlight').forEach(el => {
    el.classList.remove('column-highlight');
  });

  // Convert sequence to pattern format
  sequence.sequence.forEach(hit => {
    const instrument = mapInstrumentName(hit.instrument);
    const beat = hit.beat;
    const velocity = hit.velocity;

    // Convert beat to step index (1-based to 0-based, supporting fractional beats)
    let stepIndex;
    if (beat === 0.5) {
      stepIndex = 0; // Special case for beat 0.5 -> step 1
    } else if (beat >= 1 && beat <= 4) {
      // For beats 1-4, map to steps based on quarter notes and subdivisions
      const baseBeat = Math.floor(beat);
      const fraction = beat - baseBeat;
      
      if (fraction === 0) {
        // On the beat: 1->0, 2->4, 3->8, 4->12
        stepIndex = (baseBeat - 1) * 4;
      } else if (fraction === 0.25) {
        // 16th note after beat: 1.25->1, 2.25->5, etc
        stepIndex = (baseBeat - 1) * 4 + 1;
      } else if (fraction === 0.5) {
        // 8th note after beat: 1.5->2, 2.5->6, etc
        stepIndex = (baseBeat - 1) * 4 + 2;
      } else if (fraction === 0.75) {
        // 16th note before next beat: 1.75->3, 2.75->7, etc
        stepIndex = (baseBeat - 1) * 4 + 3;
      } else {
        // For other fractions, approximate to nearest 16th note
        stepIndex = Math.round((beat - 1) * 4);
      }
    } else {
      // Fallback for beats outside 1-4 range
      stepIndex = Math.max(0, Math.min(15, Math.round((beat - 1) * 4)));
    }
    
    // Ensure step exists and write the authored per-step velocity (1-127).
    // The user's mixer (level sliders) is deliberately left untouched.
    if (stepIndex >= 0 && stepIndex < 16) {
      if (!pattern.part1[stepIndex]) {
        pattern.part1[stepIndex] = {};
      }
      if (instrument === 'accent') {
        // Accent hits are the per-step accent flag, not a voice
        pattern.part1[stepIndex].accent = true;
      } else {
        pattern.part1[stepIndex][instrument] = Math.max(1, Math.min(127, Math.round(velocity) || 100));
      }
    }
  });

  // Force update display
  updateStepDisplay();
  
  // Show confirmation
}

// =============================================================================
// Style Preset Functions
// =============================================================================

// Get all available style preset names
function getAvailableStylePresets() {
  return Object.keys(stylePresets);
}

// Get all available inspiration sequence IDs
function getAvailableInspirationSequences() {
  return Object.keys(inspirationSequences);
}

// Select a random style preset
function selectRandomStyle() {
  const availableStyles = getAvailableStylePresets();
  const randomIndex = Math.floor(Math.random() * availableStyles.length);
  const randomStyle = availableStyles[randomIndex];
  
  loadStylePreset(randomStyle);
  
  // Update the style preset selector to show the selected style
  const styleSelect = document.getElementById('stylePreset');
  if (styleSelect) {
    styleSelect.value = randomStyle;
  }
}

// Select a random inspiration sequence
function selectRandomInspiration() {
  const availableInspirations = getAvailableInspirationSequences();
  const randomIndex = Math.floor(Math.random() * availableInspirations.length);
  const randomInspiration = availableInspirations[randomIndex];
  
  loadInspirationSequence(randomInspiration);
  
  // Update the inspiration sequence selector to show the selected sequence
  const inspirationSelect = document.getElementById('inspirationSequence');
  if (inspirationSelect) {
    inspirationSelect.value = randomInspiration;
  }
}

// Handle mutual exclusion between style and inspiration selectors
function handleMutualExclusion(selectedType, selectedValue) {
  const styleSelect = document.getElementById('stylePreset');
  const inspirationSelect = document.getElementById('inspirationSequence');
  
  if (selectedType === 'style' && selectedValue === 'random') {
    // If random style is selected, clear inspiration selection
    if (inspirationSelect) {
      inspirationSelect.value = '';
    }
  } else if (selectedType === 'inspiration' && selectedValue === 'random') {
    // If random inspiration is selected, clear style selection
    if (styleSelect) {
      styleSelect.value = '';
    }
  } else if (selectedType === 'style' && selectedValue !== 'random' && selectedValue !== '') {
    // If a specific style is selected, clear inspiration selection
    if (inspirationSelect) {
      inspirationSelect.value = '';
    }
  } else if (selectedType === 'inspiration' && selectedValue !== 'random' && selectedValue !== '') {
    // If a specific inspiration is selected, clear style selection
    if (styleSelect) {
      styleSelect.value = '';
    }
  }
}

function rememberPresetSelection(kind, key) {
  currentPresetSelection = (kind && key) ? { kind, key } : null;
  const styleSelect = document.getElementById('stylePreset');
  const inspSelect = document.getElementById('inspirationSequence');
  if (kind === 'style') {
    if (styleSelect) styleSelect.value = key;
    if (inspSelect) inspSelect.value = '';
  } else if (kind === 'groove') {
    if (inspSelect) inspSelect.value = key;
    if (styleSelect) styleSelect.value = '';
  } else {
    if (styleSelect) styleSelect.value = '';
    if (inspSelect) inspSelect.value = '';
  }
  try {
    if (window.GC && window.GC.events && typeof window.GC.events.emit === 'function') {
      window.GC.events.emit('preset:changed', currentPresetSelection);
    }
  } catch (e) { /* noop */ }
}

// Load style preset
function loadStylePreset(styleName) {
  const preset = stylePresets[styleName];
  if (!preset) return;

  rememberPresetSelection('style', styleName);
  
  tempo = preset.bpm;
  // Convert to knob scale (60-260 BPM range) and clamp to valid range
  knobValues.tempo = Math.max(0, Math.min(10, (preset.bpm - 60) / 20));
  
  const tempoKnob = document.querySelector('#tempo');
  if (tempoKnob) {
    // Use the same rotation calculation as the main knob function
    const iconOffset = 330;
    const minPosition = 210;
    const maxPosition = 510;
    const targetAngle = minPosition + (knobValues.tempo / 10) * (maxPosition - minPosition);
    const rotation = targetAngle - iconOffset;
    tempoKnob.style.setProperty('--rotation', `${rotation}deg`);
  }
  
  // Update Tone.js transport BPM (whether playing or not)
  Tone.Transport.bpm.value = tempo;
  
  // Update nixie tube BPM display
  updateNixieBPMDisplay(tempo);
  
  
  // Clear current pattern first
  const pattern = patterns[variation][currentPattern];
  pattern.part1 = Array(16).fill().map(() => ({}));
  pattern.length1 = 16; // Ensure length is set
  pattern.length2 = 0;  // No second part for presets
  pattern.sfx1 = {};
  
  // Clear all visual highlighting from previous row/column selections
  document.querySelectorAll('.column-highlight').forEach(el => {
    el.classList.remove('column-highlight');
  });
  document.querySelectorAll('.row-highlight').forEach(el => {
    el.classList.remove('row-highlight');
  });
  
  
  // Load preset patterns - Fixed logic for A/B structure
  Object.entries(preset.patterns).forEach(([instrument, patternArray]) => {
    patternArray.forEach((hit, stepIndex) => {
      if (hit === 1 && stepIndex < 16) {
        // Ensure the step object exists
        if (!pattern.part1[stepIndex]) {
          pattern.part1[stepIndex] = {};
        }
        pattern.part1[stepIndex][instrument] = true;
      }
    });
  });
  
  // Force update display
  updateStepDisplay();
  
  // Show confirmation
}


// =============================================================================
// MIDI Export Functions
// =============================================================================
//
// ⚠️ CRITICAL: Before modifying ANY MIDI functionality, read:
// docs/MIDI_MAPPING_MASTER_REFERENCE.md - SINGLE SOURCE OF TRUTH
//
// This section handles all MIDI export functionality including:
// - Pattern to MIDI conversion
// - GM-compliant instrument mapping
// - DAW compatibility
// - JSON export with MIDI data
//
// ⚠️ DO NOT modify MIDI mappings here - update master reference first!
// =============================================================================

// Debug function to create a test pattern for MIDI export
function createTestPattern() {
  console.log('🧪 Creating test pattern...');
  
  // Clear current pattern
  const pattern = patterns[variation][currentPattern];
  pattern.part1 = Array(16).fill().map(() => ({}));
  
  // Add some basic drum hits
  pattern.part1[0] = { bd: true }; // Kick on 1
  pattern.part1[4] = { sd: true }; // Snare on 2
  pattern.part1[8] = { bd: true }; // Kick on 3
  pattern.part1[12] = { sd: true }; // Snare on 4
  
  // Add hi-hats
  pattern.part1[2] = { ch: true };
  pattern.part1[6] = { ch: true };
  pattern.part1[10] = { ch: true };
  pattern.part1[14] = { ch: true };
  
  console.log('✅ Test pattern created');
  updateStepDisplay();
  
  return pattern;
}
//
// MIDI Export Features:
// - Exports current pattern to Standard MIDI File (.mid)
// - Maps instruments to General MIDI percussion on channel 10
// - Supports multiple export formats and resolutions
// - Compatible with all major DAWs (Ableton Live, Logic Pro, Pro Tools, etc.)
//
// Usage:
// - Click MIDI button: Export current pattern (single loop)
// - Shift+Click MIDI button: Advanced export options
// - Volume sliders are mapped to MIDI velocities (0-127)
// - All 16 instruments are mapped to standard GM drum sounds
//
// MIDI Note Mapping (General MIDI Percussion):
// BD (Bass Drum) → 36, SD (Snare) → 38, CH (Hand Clap) → 39,
// OH (Open Hi-Hat) → 46, CB (Cowbell) → 56, CL (Claves) → 75,
// CR (Crash) → 49, CYM (Crash 2) → 57, HC (Closed Hi-Hat) → 42,
// MC (Pedal Hi-Hat) → 44, LC (Open Hi-Hat) → 46, MA (Maracas) → 70,
// LT/MT/HT (Toms) → 45/47/50, RIM (Side Stick) → 37
//
// =============================================================================

// Import master MIDI mapping (fallback to inline if module not available)
let instrumentToMidiMap;
if (typeof window !== 'undefined' && window.GrooveCoreMIDI) {
  instrumentToMidiMap = window.GrooveCoreMIDI.GROOVECORE_MIDI_MAPPING;
} else {
  // Fallback: Inline master mapping (GM Standard)
  instrumentToMidiMap = {
    bd: 36,        // Bass Drum → GM: Bass Drum 1 (C1)
    sd: 38,        // Snare Drum → GM: Acoustic Snare (D1)
    rim: 37,       // Rim Shot → GM: Side Stick (C#1)
    hc: 42,        // Hi-Hat Closed → GM: Closed Hi-Hat (F#1)
    mc: 44,        // Hi-Hat Mid → GM: Pedal Hi-Hat (G#1)
    lc: 46,        // Hi-Hat Open (LC) → GM: Open Hi-Hat (A#1)
    oh: 46,        // Open Hat (OH) → GM: Open Hi-Hat (A#1)
    lt: 45,        // Low Tom → GM: Low Tom (A1)
    mt: 47,        // Mid Tom → GM: Low-Mid Tom (B1)
    ht: 50,        // High Tom → GM: High Tom (D2)
    cr: 49,        // Crash → GM: Crash Cymbal 1 (C#2)
    cym: 57,       // Cymbal → GM: Crash Cymbal 2 (A2)
    ch: 39,        // Clap → GM: Hand Clap (D#1)
    cb: 56,        // Cowbell → GM: Cowbell (G#2)
    cl: 75,        // Clave → GM: Claves (D#4)
    ma: 70,        // Maraca → GM: Maracas (A#3)
  };
}

// Convert current pattern to MIDI-compatible sequence data
function getCurrentPatternAsMidiData() {
  console.log('🔄 Converting pattern to MIDI data...');
  const pattern = patterns[variation][currentPattern];
  const part = pattern.part1; // Use part1 for MIDI export
  const sequence = [];
  
  console.log(`📋 Current pattern: ${currentPattern + 1}, variation: ${variation}`);
  console.log('🎹 Pattern part1:', part);
  
  // RCA: Track all instruments found vs mapped
  const instrumentsFound = new Set();
  const instrumentsMapped = new Set();
  const instrumentsSkipped = new Set();
  
  console.log('🔍 MIDI MAPPING VALIDATION:');
  console.log('Available instrument mappings:', Object.keys(instrumentToMidiMap));
  
  // Convert pattern data to sequence format
  for (let step = 0; step < 16; step++) {
    if (part[step] && Object.keys(part[step]).length > 0) {
      console.log(`Step ${step + 1}:`, part[step]);
      Object.keys(part[step]).forEach(instrument => {
        instrumentsFound.add(instrument);
        
        if (part[step][instrument] && instrumentToMidiMap[instrument]) {
          instrumentsMapped.add(instrument);
          
          // Convert step index (0-15) to beat position (1-4 with subdivisions)
          const beat = (step / 4) + 1; // Convert to 1-4 range
          
          // Get instrument volume level for velocity
          let volumeKnobName;
          volumeKnobName = `level${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`;
          
          const knobValue = knobValues[volumeKnobName] || 7;
          const velocity = Math.round((knobValue / 10) * 127); // Convert 0-10 to 0-127
          
          const event = {
            instrument: instrument,
            beat: beat,
            velocity: Math.max(1, Math.min(127, velocity)),
            midiNote: instrumentToMidiMap[instrument]
          };
          
          console.log(`🎵 Adding event: ${instrument} → MIDI ${instrumentToMidiMap[instrument]} at beat ${beat} with velocity ${velocity}`);
          sequence.push(event);
        } else if (part[step][instrument]) {
          instrumentsSkipped.add(instrument);
          console.warn(`⚠️ MISSING MAPPING: ${instrument} is active but not in instrumentToMidiMap!`);
        }
      });
    }
  }
  
  // RCA Summary
  console.log('📊 RCA SUMMARY:');
  console.log('✅ Instruments found in pattern:', Array.from(instrumentsFound));
  console.log('✅ Instruments successfully mapped:', Array.from(instrumentsMapped));
  console.log('❌ Instruments skipped (missing mapping):', Array.from(instrumentsSkipped));
  console.log(`📈 Export success rate: ${instrumentsMapped.size}/${instrumentsFound.size} instruments (${Math.round(instrumentsMapped.size/instrumentsFound.size*100)}%)`);
  
  const result = {
    name: `GrooveCore Pattern ${currentPattern + 1}`,
    sequence: sequence,
    rca: {
      instrumentsFound: Array.from(instrumentsFound),
      instrumentsMapped: Array.from(instrumentsMapped),
      instrumentsSkipped: Array.from(instrumentsSkipped),
      successRate: instrumentsFound.size > 0 ? Math.round(instrumentsMapped.size/instrumentsFound.size*100) : 0
    }
  };
  
  console.log('🎼 Final pattern data:', result);
  return result;
}

// Export current pattern to MIDI file with multiple format support
function exportPatternToMidi(exportOptions = {}) {
  try {
    console.log('🎵 Starting MIDI export...');
    console.log('MidiWriter available:', typeof MidiWriter !== 'undefined');
    console.log('Library status:', {
      midiWriterUnavailable: window.midiWriterUnavailable,
      midiWriterLoaded: window.midiWriterLoaded
    });
    
    // Check if MidiWriter is available
    if (!window.MidiWriter) {
      console.error('❌ MidiWriter library not loaded');
      
      if (window.midiWriterUnavailable) {
        alert('MIDI export library failed to load. This may be due to browser compatibility or network issues.\n\nPlease refresh the page and try again.');
      } else {
        alert('MIDI export library is still loading. Please wait a moment and try again.\n\nIf the problem persists, refresh the page.');
      }
      return;
    }
    
    const MidiWriterLib = window.MidiWriter;
    
    console.log('✅ MidiWriter library is available');
    
    
    // Get current pattern data
    const patternData = getCurrentPatternAsMidiData();
    console.log('📊 Pattern data:', patternData);
    
    if (patternData.sequence.length === 0) {
      console.warn('⚠️ No pattern data to export');
      alert('No pattern to export. Please create a pattern first.');
      return;
    }
    
    console.log(`🎼 Exporting ${patternData.sequence.length} events from pattern "${patternData.name}"`);
    
    
    // Create main track first
    const track = new MidiWriterLib.Track();
    
    // Add track metadata using v3.1.1 API
    track.addTrackName(patternData.name);
    // Note: setTempo might not be available in v3.1.1, skip for now
    track.setTimeSignature(4, 4); // 4/4 time signature
    
    // Set drum kit on channel 10 (GM percussion)
    track.addEvent(new MidiWriterLib.ProgramChangeEvent({
      instrument: 0, // GM Drum Kit
      channel: 9 // Channel 10 (0-indexed)
    }));
    
    // Sort events by beat time for proper sequencing
    const sortedSequence = patternData.sequence.sort((a, b) => a.beat - b.beat);
    
    // Add note events
    let currentTick = 0;
    const ticksPerBeat = exportOptions.resolution || 480; // Standard MIDI resolution, can be 96, 192, 384, 480, 960
    const loopCount = exportOptions.loops || 1; // Number of pattern repetitions
    
    // Add pattern loops
    for (let loop = 0; loop < loopCount; loop++) {
      const loopOffsetTicks = loop * 4 * ticksPerBeat; // 4 beats per pattern
      
      sortedSequence.forEach((event, index) => {
        const midiNote = instrumentToMidiMap[event.instrument];
        const velocity = Math.min(127, Math.max(1, event.velocity));
        
        // Calculate timing with loop offset
        const eventTick = Math.round((event.beat - 1) * ticksPerBeat) + loopOffsetTicks;
        const deltaTime = eventTick - currentTick;
        
        // Create note event with short duration (16th note)
        const noteEvent = new MidiWriterLib.NoteEvent({
          pitch: [midiNote],
          duration: '16', // 16th note duration
          velocity: velocity,
          channel: 9     // Drum channel (0-indexed)
        });
        
        track.addEvent(noteEvent);
        currentTick = eventTick;
        
      });
    }
    
    // End of track is automatically added by the library in v3.1.1
    
    // Create writer with track (v3.1.1 API)
    const writer = new MidiWriterLib.Writer(track);
    
    // Generate MIDI file
    const midiData = writer.buildFile();
    
    // Create download
    const blob = new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groovecore-pattern-${currentPattern + 1}-${tempo}bpm.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ MIDI export successful! File: ${a.download}`);
    alert(`MIDI pattern exported successfully!\nFile: ${a.download}`);
    
  } catch (error) {
    console.error('❌ MIDI export error:', error);
    alert(`Error exporting MIDI file: ${error.message}\n\nCheck the console for details.`);
  }
}

// Export inspiration sequence to MIDI (if one is loaded)
function exportInspirationSequenceToMidi() {
  try {
    // Check if MidiWriter is available
    if (typeof MidiWriter === 'undefined') {
      alert('MIDI export library not loaded. Please refresh the page and try again.');
      return;
    }
    
    // We'll use the current pattern data since inspiration sequences 
    // are loaded into the current pattern
    const patternData = getCurrentPatternAsMidiData();
    
    if (patternData.sequence.length === 0) {
      alert('No sequence to export. Please load an inspiration sequence first.');
      return;
    }
    
    
    // Create MIDI file using same logic as pattern export
    const writer = new MidiWriter.Writer();
    const track = new MidiWriter.Track();
    
    // Add metadata
    track.addEvent(new MidiWriter.MetaEvent({
      type: 'trackName',
      text: patternData.name + ' (Inspiration)'
    }));
    
    track.addEvent(new MidiWriter.MetaEvent({
      type: 'setTempo',
      tempo: tempo
    }));
    
    track.addEvent(new MidiWriter.MetaEvent({
      type: 'timeSignature',
      numerator: 4,
      denominator: 4,
      clocksPerClick: 24,
      thirtySecondNotesPerBeat: 8
    }));
    
    track.addEvent(new MidiWriter.ProgramChangeEvent({
      instrument: 0,
      channel: 9
    }));
    
    // Add note events
    const sortedSequence = patternData.sequence.sort((a, b) => a.beat - b.beat);
    let currentTick = 0;
    const ticksPerBeat = 480;
    
    sortedSequence.forEach(event => {
      const midiNote = instrumentToMidiMap[event.instrument];
      if (midiNote) {
        const eventTick = Math.round((event.beat - 1) * ticksPerBeat);
        const deltaTime = eventTick - currentTick;
        
        const noteEvent = new MidiWriter.NoteEvent({
          pitch: [midiNote],
          duration: '16',
          velocity: Math.min(127, Math.max(1, event.velocity)),
          channel: 9,
          wait: deltaTime > 0 ? deltaTime : 0
        });
        
        track.addEvent(noteEvent);
        currentTick = eventTick;
      }
    });
    
    track.addEvent(new MidiWriter.MetaEvent({ type: 'endOfTrack' }));
    writer.addTrack(track);
    
    // Generate and download
    const midiData = writer.buildFile();
    const blob = new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groovecore-inspiration-${tempo}bpm.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert(`Inspiration sequence exported to MIDI!\nFile: ${a.download}`);
    
  } catch (error) {
    alert('Error exporting inspiration sequence to MIDI. Please check the console for details.');
  }
}

// Export pattern with advanced MIDI options
function exportAdvancedMidi() {
  const options = {
    resolution: 480,   // Standard resolution
    loops: 4,          // 4 repetitions for a full loop
    noteDuration: '16' // 16th note duration
  };
  
  exportPatternToMidi(options);
}

// Export pattern optimized for popular DAWs
function exportForDAW(dawType = 'ableton') {
  let options = {};
  
  switch (dawType.toLowerCase()) {
    case 'ableton':
    case 'live':
      options = {
        resolution: 480,
        loops: 4,
        noteDuration: '16'
      };
      break;
    case 'logic':
    case 'pro':
      options = {
        resolution: 480,
        loops: 2,
        noteDuration: '8n'
      };
      break;
    case 'protools':
    case 'pt':
      options = {
        resolution: 960,
        loops: 1,
        noteDuration: '16'
      };
      break;
    case 'cubase':
    case 'nuendo':
      options = {
        resolution: 480,
        loops: 4,
        noteDuration: '16'
      };
      break;
    default:
      options = {
        resolution: 480,
        loops: 2,
        noteDuration: '16'
      };
  }
  
  exportPatternToMidi(options);
}

// Fallback MIDI export function (basic implementation without external library)
function exportPatternToMidiBasic() {
  try {
    const patternData = getCurrentPatternAsMidiData();
    
    if (patternData.sequence.length === 0) {
      alert('No pattern to export. Please create a pattern first.');
      return;
    }
    
    // Create JSON representation that can be converted to MIDI later
    const midiData = {
      format: 'GrooveCore MIDI Export Data',
      version: '1.0',
      pattern: patternData,
      tempo: tempo,
      instrumentMapping: instrumentToMidiMap,
      exportTime: new Date().toISOString()
    };
    
    // Export as JSON with instructions
    const jsonString = JSON.stringify(midiData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groovecore-pattern-${currentPattern + 1}-${tempo}bpm-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Pattern exported as JSON data!\n\nThis file contains your pattern in a format that can be converted to MIDI.\nYou can use online converters or import this into compatible software.');
    
    
  } catch (error) {
    alert('Error exporting pattern data. Please check the console for details.');
  }
}

// =============================================================================
// Pattern Management Functions
// =============================================================================

function setPatternLength(length) {
  const pattern = patterns[variation][currentPattern];
  if (currentPart === "1stPart") {
    pattern.length1 = length;
    pattern.length2 = 0; // Reset 2nd part when setting 1st part length
  } else if (currentPart === "2ndPart") {
    pattern.length2 = length;
  }
  updateStepDisplay();
}

function clearPattern() {
  const pattern = patterns[variation][currentPattern];
  if (currentPart === "patternClear" || currentPart === "1stPart") {
    pattern.part1 = Array(16).fill().map(() => ({}));
    pattern.sfx1 = {};
  }
  if (currentPart === "patternClear" || currentPart === "2ndPart") {
    pattern.part2 = Array(16).fill().map(() => ({}));
  }
  
  // Clear all visual highlighting when clearing pattern
  document.querySelectorAll('.column-highlight').forEach(el => {
    el.classList.remove('column-highlight');
  });
  document.querySelectorAll('.row-highlight').forEach(el => {
    el.classList.remove('row-highlight');
  });
  
  updateStepDisplay();
}

// Pattern selection in manual play mode
function selectPattern(patternIndex) {
  if (currentPart === "manualPlay") {
    if (patternIndex < 12) {
      // Basic rhythm pattern
      currentPattern = patternIndex;
    } else {
      // Fill pattern - trigger and return to basic rhythm
      // TODO: Implement fill pattern logic
    }
    updateStepDisplay();
  }
}

// =============================================================================
// UI Control Functions
// =============================================================================

// Enhanced knob rotation functionality with proper UX
// Shared onChange body for main-panel knobs (used by both the GCKnobs path
// and the legacy fallback). Tempo routes through GC.setBpm — the single
// canonical tempo setter (plan §5.1).
function handleMainKnobChange(knobId, newValue) {
  knobValues[knobId] = newValue;

  if (knobId === 'tempo') {
    const bpm = 60 + (newValue * 20); // 60-260 BPM range
    if (window.GC && typeof window.GC.setBpm === 'function') {
      window.GC.setBpm(bpm);
    } else {
      tempo = bpm;
      if (typeof Tone !== 'undefined') Tone.Transport.bpm.value = tempo;
      updateNixieBPMDisplay(tempo);
    }
    knobValues.tempo = (tempo - 60) / 20;
  }

  if (knobId === 'masterVolume') {
    updateMasterVolume();
  }

  // Route to the modern engine when present (masterVolume/masterDrive/
  // masterGlue/accentAmount and any level/tune/pan<Inst> knob ids)
  routeEngineKnob(knobId, newValue);
}

function setupKnobs() {
  // Modern path: one pointer-driven engine for every knob (mouse/touch/pen)
  if (window.GCKnobs) {
    document.querySelectorAll('.knob').forEach(knob => {
      const knobId = knob.id;
      // Modal knobs are bound by setupModalControls (dataset.value store)
      if (!knobId || knob.closest('#instrumentModal')) return;
      let defaultValue = 5;
      if (knobId === 'tempo') defaultValue = 3; // 120 BPM — fixes the 160-BPM dblclick bug
      if (knobId === 'masterVolume') defaultValue = 7;
      if (knobId === 'masterDrive' || knobId === 'masterGlue') defaultValue = 0;
      const initialValue = knobValues[knobId] !== undefined ? knobValues[knobId] : defaultValue;
      knobValues[knobId] = initialValue;
      window.GCKnobs.bind(knob, {
        min: 0,
        max: 10,
        default: defaultValue,
        value: initialValue,
        getValue: () => (knobValues[knobId] !== undefined ? knobValues[knobId] : defaultValue),
        onChange: (v) => handleMainKnobChange(knobId, v)
      });
    });
    return;
  }

  // Legacy fallback binding (mouse-only) — kept so the app still works if
  // js/ui/knob-engine.js fails to load.
  document.querySelectorAll('.knob').forEach(knob => {
    let isDragging = false;
    let startMousePos = { x: 0, y: 0 };
    let startValue = 0;
    let knobCenter = { x: 0, y: 0 };
    
    const knobId = knob.id;
    // Use specific defaults for different knobs, tempo should start at 3 (120 BPM)
    let defaultValue = 7; // Default for most knobs
    if (knobId === 'tempo') defaultValue = 3; // 120 BPM = (120-60)/20 = 3
    if (knobId === 'masterVolume') defaultValue = 7;
    if (knobId === 'masterDrive' || knobId === 'masterGlue') defaultValue = 0;
    
    const initialValue = knobValues[knobId] !== undefined ? knobValues[knobId] : defaultValue;
    
    function updateKnobRotation(value) {
      // Google icon naturally points to ~11 o'clock (330°)
      // For normal knob behavior: 7 o'clock (min) to 5 o'clock (max)
      // CLOCKWISE rotation increases value (like normal knobs)
      const iconOffset = 330; // Google icon's natural pointing direction
      const minPosition = 210; // 7 o'clock position for minimum (value = 0)
      const maxPosition = 510; // 5 o'clock position for maximum (150° + 360° = 510°)
      
      // Calculate the rotation needed from icon's natural position
      // Going clockwise from 210° to 510° (which is 150° + full circle)
      const targetAngle = minPosition + (value / 10) * (maxPosition - minPosition);
      const rotation = targetAngle - iconOffset;
      
      knob.style.setProperty('--rotation', `${rotation}deg`);
    }
    
    function getKnobCenter() {
      const rect = knob.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    
    function calculateAngleFromMouse(mouseX, mouseY) {
      const deltaX = mouseX - knobCenter.x;
      const deltaY = mouseY - knobCenter.y;
      let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      // Normalize to 0-360 degrees
      angle = (angle + 360) % 360;
      return angle;
    }
    
    // Double-click to reset to center value
    knob.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const centerValue = 5;
      knobValues[knobId] = centerValue;
      updateKnobRotation(centerValue);
      
      if (knobId === 'tempo') {
        tempo = 60 + (centerValue * 20);
        if (isPlaying) {
          Tone.Transport.bpm.value = tempo;
        }
        updateNixieBPMDisplay(tempo);
      }
      
      if (knobId === 'masterVolume') {
        updateMasterVolume();
      }
    });
    
    knob.addEventListener('mousedown', (e) => {
      isDragging = true;
      startMousePos = { x: e.clientX, y: e.clientY };
      startValue = knobValues[knobId] || 5;
      knobCenter = getKnobCenter();
      
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Calculate sensitivity based on modifier keys
      let sensitivity = 0.05; // Base sensitivity (increased for better responsiveness)
      if (e.shiftKey) sensitivity *= 0.1; // Fine control with Shift
      if (e.ctrlKey) sensitivity *= 3; // Coarse control with Ctrl
      
      // Use vertical mouse movement for intuitive control
      const deltaY = startMousePos.y - e.clientY;
      let newValue = startValue + (deltaY * sensitivity);
      
      // Alternative: Use circular mouse tracking for more natural feel
      if (e.altKey) {
        const currentAngle = calculateAngleFromMouse(e.clientX, e.clientY);
        const startAngle = calculateAngleFromMouse(startMousePos.x, startMousePos.y);
        let angleDelta = currentAngle - startAngle;
        
        // Handle angle wrapping
        if (angleDelta > 180) angleDelta -= 360;
        if (angleDelta < -180) angleDelta += 360;
        
        newValue = startValue + (angleDelta / 36); // 360° = 10 units
      }
      
      // Clamp value to valid range
      newValue = Math.max(0, Math.min(10, newValue));
      
      knobValues[knobId] = newValue;
      updateKnobRotation(newValue);
      
      if (knobId === 'tempo') {
        tempo = 60 + (newValue * 20); // 60-260 BPM range
        if (isPlaying) {
          Tone.Transport.bpm.value = tempo;
        }
        updateNixieBPMDisplay(tempo);
      }
      
      // Update master volume if it's the master volume knob
      if (knobId === 'masterVolume') {
        updateMasterVolume();
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
      }
    });
    
    // Mouse wheel support for fine adjustment
    knob.addEventListener('wheel', (e) => {
      e.preventDefault();
      const currentValue = knobValues[knobId] || 5;
      let sensitivity = 0.3; // Increased wheel sensitivity
      if (e.shiftKey) sensitivity *= 0.1; // Fine control with Shift
      
      const delta = e.deltaY > 0 ? -sensitivity : sensitivity;
      let newValue = currentValue + delta;
      newValue = Math.max(0, Math.min(10, newValue));
      
      knobValues[knobId] = newValue;
      updateKnobRotation(newValue);
      
      if (knobId === 'tempo') {
        tempo = 60 + (newValue * 20);
        if (isPlaying) {
          Tone.Transport.bpm.value = tempo;
        }
        updateNixieBPMDisplay(tempo);
      }
      
      if (knobId === 'masterVolume') {
        updateMasterVolume();
      }
    });
    
    // Initialize knob position
    updateKnobRotation(initialValue);
  });
}

// Shuffle slider functionality
function setupShuffleSliders() {
  // Modern path: pointer-driven slider engine (horizontal drag, wheel, dbl-tap)
  if (window.GCKnobs) {
    document.querySelectorAll('.shuffle-slider').forEach(slider => {
      const sliderId = slider.id;
      if (!sliderId || slider.closest('#instrumentModal')) return;
      const initialValue = knobValues[sliderId] !== undefined ? knobValues[sliderId] : 0;
      knobValues[sliderId] = initialValue;
      window.GCKnobs.bind(slider, {
        min: 0,
        max: 10,
        default: 0,
        value: initialValue,
        getValue: () => (knobValues[sliderId] !== undefined ? knobValues[sliderId] : 0),
        onChange: (v) => { knobValues[sliderId] = v; }
      });
    });
    return;
  }

  // Legacy fallback binding (mouse-only)
  document.querySelectorAll('.shuffle-slider').forEach(slider => {
    let isDragging = false;
    let startX = 0;
    let startValue = 0;
    
    const sliderId = slider.id;
    const initialValue = knobValues[sliderId] || 0;
    
    function updateSliderPosition(value) {
      const percentage = (value / 10) * 100; // Convert 0-10 to 0-100%
      slider.style.setProperty('--slider-width', `${percentage}%`);
    }
    
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startValue = knobValues[sliderId] || 0;
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const sensitivity = 0.05;
      let newValue = startValue + (deltaX * sensitivity);
      newValue = Math.max(0, Math.min(10, newValue));
      
      knobValues[sliderId] = newValue;
      updateSliderPosition(newValue);
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    });
    
    // Initialize slider position
    updateSliderPosition(initialValue);
  });
}

// Close controls button functionality
function setupCloseControlsButtons() {
  document.querySelectorAll('.close-controls-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      const instrument = btn.dataset.instrument;
      
      // Close the controls panel
      const controls = document.querySelector(`.instrument-controls[data-instrument="${instrument}"]`);
      const arrow = document.querySelector(`.instrument-row[data-instrument="${instrument}"] .expand-arrow`);
      
      if (controls) {
        controls.classList.remove('expanded', 'positioned-above');
      }
      if (arrow) {
        arrow.classList.remove('expanded');
      }
      
      // Reset the expanded instrument tracking
      expandedInstrument = null;
    });
  });
}

// Mute/Solo button functionality
function setupMuteSoloButtons() {
  document.querySelectorAll('.mute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling to instrument name
      const instrument = btn.dataset.instrument;
      
      if (muteSoloState.muted.has(instrument)) {
        muteSoloState.muted.delete(instrument);
        btn.classList.remove('active');
      } else {
        muteSoloState.muted.add(instrument);
        btn.classList.add('active');
        // If muting, remove from solo
        muteSoloState.soloed.delete(instrument);
        document.querySelector(`.solo-btn[data-instrument="${instrument}"]`).classList.remove('active');
      }
    });
  });
  
  document.querySelectorAll('.solo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling to instrument name
      const instrument = btn.dataset.instrument;
      
      if (muteSoloState.soloed.has(instrument)) {
        muteSoloState.soloed.delete(instrument);
        btn.classList.remove('active');
      } else {
        muteSoloState.soloed.add(instrument);
        btn.classList.add('active');
        // If soloing, remove from mute
        muteSoloState.muted.delete(instrument);
        document.querySelector(`.mute-btn[data-instrument="${instrument}"]`).classList.remove('active');
      }
    });
  });
}

// Track expanded controls
let expandedInstrument = null;
let currentModalInstrument = null;

const PATTERN_CONTROL_NEUTRALS = {
  probability: 10,
  velocity: 5,
  timing: 5,
  flam: 0,
  roll: 0,
  pitchBend: 5
};

function isFlatModalKnobMap(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (!keys.length) return false;
  return keys.some(k => k.startsWith('modal'));
}

function normalizeModalKnobValues(raw) {
  if (window.GCSchema && typeof window.GCSchema.normalizeModalKnobValues === 'function') {
    return window.GCSchema.normalizeModalKnobValues(raw);
  }
  const out = {};
  MODAL_INSTRUMENT_IDS.forEach(inst => { out[inst] = {}; });
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const parkToOff = { modalSustain: 0, modalRelease: 0, modalCompression: 0 };
  const migrate = (bucket) => {
    Object.keys(parkToOff).forEach(k => { if (bucket[k] === 5) bucket[k] = parkToOff[k]; });
    return bucket;
  };
  if (isFlatModalKnobMap(raw)) {
    const flat = {};
    Object.keys(raw).forEach(k => {
      if (k.startsWith('modal') && typeof raw[k] === 'number' && isFinite(raw[k])) {
        flat[k] = raw[k];
      }
    });
    migrate(flat);
    MODAL_INSTRUMENT_IDS.forEach(inst => { out[inst] = Object.assign({}, flat); });
    return out;
  }
  Object.keys(raw).forEach(inst => {
    const bucket = raw[inst];
    if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) return;
    if (!out[inst]) out[inst] = {};
    Object.keys(bucket).forEach(k => {
      if (typeof bucket[k] === 'number' && isFinite(bucket[k])) out[inst][k] = bucket[k];
    });
    migrate(out[inst]);
  });
  return out;
}

function ensureModalInst(inst) {
  if (!inst) return {};
  if (!modalKnobValues[inst] || typeof modalKnobValues[inst] !== 'object') {
    modalKnobValues[inst] = {};
  }
  return modalKnobValues[inst];
}

function getModalKnob(inst, key, fallback) {
  const map = modalKnobValues[inst];
  if (map && map[key] !== undefined && map[key] !== null) return map[key];
  return fallback;
}

function setModalKnob(inst, key, value) {
  if (!inst) return;
  ensureModalInst(inst)[key] = value;
}

function instrumentHasActivePatternFx(inst) {
  if (!inst || !patternControls) return false;
  return Object.keys(PATTERN_CONTROL_NEUTRALS).some(type => {
    const v = patternControls[type][inst];
    if (v === undefined || v === null) return false;
    return v !== PATTERN_CONTROL_NEUTRALS[type];
  });
}

function refreshPatternFxBadges() {
  document.querySelectorAll('.instrument-row[data-instrument]').forEach(row => {
    const inst = row.dataset.instrument;
    const nameEl = row.querySelector('.instrument-name');
    if (!nameEl) return;
    let badge = nameEl.querySelector('.pattern-fx-badge');
    const active = instrumentHasActivePatternFx(inst);
    if (active) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'pattern-fx-badge';
        badge.textContent = 'FX';
        badge.title = 'Pattern controls active on this instrument';
        const muteSolo = nameEl.querySelector('.mute-solo-controls');
        if (muteSolo) nameEl.insertBefore(badge, muteSolo);
        else nameEl.appendChild(badge);
      }
      badge.hidden = false;
    } else if (badge) {
      badge.hidden = true;
    }
  });
}

// Pattern controls storage - per instrument pattern effects
let patternControls = {
  probability: {}, // Instrument hit probability (0-100%)
  velocity: {},    // Dynamic velocity scaling
  timing: {},      // Micro-timing adjustments (-50ms to +50ms)
  flam: {},        // Flam effect (rapid double hits)
  roll: {},        // Roll effect (subdivided hits)
  pitchBend: {}    // Pitch bend effects
};

// Track if modal controls have been set up
let modalControlsInitialized = false;

// Instrument Modal Functions
function openInstrumentModal(instrument) {
  const modal = document.getElementById('instrumentModal');
  const title = document.getElementById('modalInstrumentTitle');
  const description = document.getElementById('modalInstrumentDescription');
  
  // Set current instrument
  currentModalInstrument = instrument;
  
  // Get instrument info
  const instrumentInfo = getInstrumentInfo(instrument);
  title.textContent = instrumentInfo.name;
  description.textContent = instrumentInfo.description;
  
  // Fill only missing per-instrument keys, then paint UI from that instrument's store
  initializeModalControlsUI(instrument);
  loadInstrumentValuesIntoModal(instrument);
  
  // Read-only BPM nixie (tempo is edited on the main panel only)
  updateNixieBPMDisplay(tempo);
  
  // Show modal with modern animation
  modal.classList.remove('hidden');
  const modalContent = document.getElementById('modalContent');
  
  // Force reflow to ensure classes are applied
  modal.offsetHeight;
  
  // Animate in
  requestAnimationFrame(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  });
  
  // Setup modal controls only once
  if (!modalControlsInitialized) {
    setupModalControls();
    modalControlsInitialized = true;
  }
  
  // Focus management for accessibility
  const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

function closeInstrumentModal() {
  const modal = document.getElementById('instrumentModal');
  const modalContent = document.getElementById('modalContent');
  
  // Animate out
  modalContent.classList.remove('scale-100', 'opacity-100');
  modalContent.classList.add('scale-95', 'opacity-0');
  
  // Store the instrument before clearing it
  const instrumentToFocus = currentModalInstrument;
  
  // Hide modal after animation
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
  
  // Clear current modal instrument
  currentModalInstrument = null;
  refreshPatternFxBadges();
  
  // Return focus to the element that opened the modal
  if (instrumentToFocus) {
    const triggerElement = document.querySelector(`[data-instrument="${instrumentToFocus}"]`);
    if (triggerElement) {
      triggerElement.focus();
    }
  }
}

function getInstrumentInfo(instrument) {
  const instrumentMap = {
    'bd': { name: 'Bass Drum (BD)', description: 'Bass Drum - The foundation of rhythm. Deep, punchy low-frequency sound that provides the kick and drive. Typically tuned 50-100Hz with quick attack and controlled decay.' },
    'sd': { name: 'Snare Drum (SD)', description: 'Snare Drum - The backbone of the beat. Sharp, crisp sound that cuts through the mix. Typically tuned 200-300Hz with snappy attack and controlled sustain.' },
    'lt': { name: 'Low Tom (LT)', description: 'Low Tom - Deep, resonant tom sound. Provides low-end punch and fills. Typically tuned 80-120Hz with warm, round character.' },
    'mt': { name: 'Mid Tom (MT)', description: 'Mid Tom - Medium-pitched tom sound. Versatile for fills and accents. Typically tuned 120-180Hz with balanced attack and decay.' },
    'ht': { name: 'High Tom (HT)', description: 'High Tom - Bright, punchy tom sound. Perfect for fills and accents. Typically tuned 180-250Hz with sharp attack and quick decay.' },
    'rim': { name: 'Rim Shot (RS)', description: 'Rim Shot - Sharp, percussive sound. Created by hitting the rim and head simultaneously. Typically tuned 300-500Hz with sharp attack.' },
    'hc': { name: 'Hi Conga (HC)', description: 'Hi Conga - The 808 high conga: a short, tuned percussive tone. Bright, woody attack around 370Hz with a fast natural decay. GM Standard MIDI note 63.' },
    'mc': { name: 'Mid Conga (MC)', description: 'Mid Conga - The 808 mid conga: a round, tuned percussive tone near 250Hz. Warm attack with a controlled decay, great for Latin grooves. GM Standard MIDI note 62.' },
    'lc': { name: 'Low Conga (LC)', description: 'Low Conga - The 808 low conga: a deep, tuned percussive tone near 165Hz. Full-bodied attack with a smooth decay that anchors percussion lines. GM Standard MIDI note 64.' },
    'cb': { name: 'Cowbell (CB)', description: 'Cowbell - Metallic percussion with distinctive clang sound. Essential for Latin rhythms and funk. GM Standard MIDI note 56. Typically tuned 800Hz-2kHz with sharp attack and medium decay.' },
    'cr': { name: 'Crash (CR)', description: 'Crash Cymbal - Explosive, bright cymbal sound for accents and transitions. GM Standard MIDI note 49. Typically tuned 2-6kHz with sharp attack and long decay.' },
    'cym': { name: 'Cymbal (CY)', description: 'Cymbal - Bright, shimmering cymbal sound. Adds sparkle and texture. Typically tuned 3-8kHz with sharp attack and long sustain.' },
    'oh': { name: 'Open Hat (OH)', description: 'Open Hat - Open hi-hat sound with more sustain. Adds groove and variation. Typically tuned 5-9kHz with longer decay and shimmer.' },
    'ch': { name: 'Closed Hat (CH)', description: 'Closed Hat - Tight, metallic closed hi-hat from the 808 six-oscillator bank. Keeps time and adds drive. Sits around 8kHz with sharp attack and very quick decay; chokes the open hat when both play. GM Standard MIDI note 42.' },
    'cp': { name: 'Clap (CP)', description: 'Clap - The classic 808 handclap. Three fast noise bursts (the flam) into a filtered tail. Sits around 1kHz with sharp attack and a short reverberant decay. GM Standard MIDI note 39.' },
    'cl': { name: 'Clave (CL)', description: 'Clave - Wooden percussion sound. Essential for Latin and Afro-Cuban rhythms. Typically tuned 800Hz-2kHz with sharp attack and quick decay.' },
    'ma': { name: 'Maraca (MA)', description: 'Maraca - Shaker percussion sound. Adds texture and movement. Typically tuned 2-6kHz with sharp attack and quick decay.' }
  };
  
  return instrumentMap[instrument] || { name: 'Unknown Instrument', description: 'No description available.' };
}

function loadInstrumentValuesIntoModal(instrument) {
  // Load basic controls
  const levelValue = knobValues[`level${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 7;
  const gainValue = knobValues[`gain${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 5;
  const panValue = knobValues[`pan${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 5;
  const tuneValue = knobValues[`tune${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 5;
  const shuffleValue = knobValues[`shuffle${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 0;
  
  // Set slider values
  const levelSlider = document.getElementById('modalLevel');
  if (levelSlider) {
    levelSlider.style.setProperty('--slider-width', `${(levelValue / 10) * 100}%`);
    levelSlider.dataset.instrument = instrument;
  }
  
  const shuffleSlider = document.getElementById('modalShuffle');
  if (shuffleSlider) {
    shuffleSlider.style.setProperty('--slider-width', `${(shuffleValue / 10) * 100}%`);
    shuffleSlider.dataset.instrument = instrument;
  }
  
  // Advanced/effects from per-instrument store; pattern knobs from patternControls
  const knobs = [
    { id: 'modalGain', value: gainValue },
    { id: 'modalPan', value: panValue },
    { id: 'modalTune', value: tuneValue },
    { id: 'modalAttack', value: getModalKnob(instrument, 'modalAttack', 5) },
    { id: 'modalDecay', value: getModalKnob(instrument, 'modalDecay', 5) },
    { id: 'modalSustain', value: getModalKnob(instrument, 'modalSustain', 0) },
    { id: 'modalRelease', value: getModalKnob(instrument, 'modalRelease', 0) },
    { id: 'modalFilter', value: getModalKnob(instrument, 'modalFilter', 5) },
    { id: 'modalResonance', value: getModalKnob(instrument, 'modalResonance', 5) },
    { id: 'modalReverb', value: getModalKnob(instrument, 'modalReverb', 0) },
    { id: 'modalDelay', value: getModalKnob(instrument, 'modalDelay', 0) },
    { id: 'modalDistortion', value: getModalKnob(instrument, 'modalDistortion', 0) },
    { id: 'modalCompression', value: getModalKnob(instrument, 'modalCompression', 0) },
    { id: 'modalEqHigh', value: getModalKnob(instrument, 'modalEqHigh', 5) },
    { id: 'modalEqLow', value: getModalKnob(instrument, 'modalEqLow', 5) },
    { id: 'modalProbability', value: patternControls.probability[instrument] ?? 10 },
    { id: 'modalVelocity', value: patternControls.velocity[instrument] ?? 5 },
    { id: 'modalTiming', value: patternControls.timing[instrument] ?? 5 },
    { id: 'modalFlam', value: patternControls.flam[instrument] ?? 0 },
    { id: 'modalRoll', value: patternControls.roll[instrument] ?? 0 },
    { id: 'modalPitchBend', value: patternControls.pitchBend[instrument] ?? 5 }
  ];
  
  knobs.forEach(knob => {
    const element = document.getElementById(knob.id);
    if (element) {
      element.dataset.value = knob.value;
      element.dataset.instrument = instrument;
      // The one canonical rotation formula (matches GCKnobs / setupKnobs)
      applyKnobRotation(element, knob.value);
      element.setAttribute('aria-valuenow', String(Math.round(knob.value * 10) / 10));
    }
  });
}

function setupModalControls() {
  // Modern path: pointer-driven engine for every modal knob and slider.
  // Values live in each knob's dataset.value (per-instrument reload sets it),
  // so GCKnobs reads it back through getValue at every gesture start.
  if (window.GCKnobs) {
    document.querySelectorAll('#instrumentModal .knob').forEach(knob => {
      const defaultValue = 5;
      window.GCKnobs.bind(knob, {
        min: 0,
        max: 10,
        default: defaultValue,
        value: parseFloat(knob.dataset.value) || defaultValue,
        getValue: () => {
          const v = parseFloat(knob.dataset.value);
          return isFinite(v) ? v : defaultValue;
        },
        onChange: (v) => {
          knob.dataset.value = v;
          updateMainKnobValue(knob.id, v);
        }
      });
    });

    document.querySelectorAll('#instrumentModal .volume-slider, #instrumentModal .shuffle-slider').forEach(slider => {
      const defaultValue = slider.classList.contains('shuffle-slider') ? 0 : 7;
      window.GCKnobs.bind(slider, {
        min: 0,
        max: 10,
        default: defaultValue,
        getValue: () => {
          const width = parseFloat(slider.style.getPropertyValue('--slider-width'));
          return isFinite(width) ? width / 10 : defaultValue;
        },
        value: (() => {
          const width = parseFloat(slider.style.getPropertyValue('--slider-width'));
          return isFinite(width) ? width / 10 : defaultValue;
        })(),
        onChange: (v) => updateMainSliderValue(slider.id, v)
      });
    });
    return;
  }

  // Legacy fallback binding (mouse-only)
  // Setup modal knobs with enhanced UX
  document.querySelectorAll('#instrumentModal .knob').forEach(knob => {
    // Remove any existing event listeners to avoid duplicates
    if (knob._modalMouseDown) knob.removeEventListener('mousedown', knob._modalMouseDown);
    if (knob._modalWheel) knob.removeEventListener('wheel', knob._modalWheel);
    if (knob._modalDblClick) knob.removeEventListener('dblclick', knob._modalDblClick);
    
    let isDragging = false;
    let startMousePos = { x: 0, y: 0 };
    let startValue = 0;
    let knobCenter = { x: 0, y: 0 };
    
    function updateModalKnobRotation(value, targetKnob = knob) {
      // Google icon naturally points to ~11 o'clock (330°)
      // For normal knob behavior: 7 o'clock (min) to 5 o'clock (max)
      // CLOCKWISE rotation increases value (like normal knobs)
      const iconOffset = 330; // Google icon's natural pointing direction
      const minPosition = 210; // 7 o'clock position for minimum (value = 0)
      const maxPosition = 510; // 5 o'clock position for maximum (150° + 360° = 510°)
      
      // Calculate the rotation needed from icon's natural position
      // Going clockwise from 210° to 510° (which is 150° + full circle)
      const targetAngle = minPosition + (value / 10) * (maxPosition - minPosition);
      const rotation = targetAngle - iconOffset;
      
      targetKnob.style.setProperty('--rotation', `${rotation}deg`);
    }
    
    function getKnobCenter() {
      const rect = knob.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    
    function calculateAngleFromMouse(mouseX, mouseY) {
      const deltaX = mouseX - knobCenter.x;
      const deltaY = mouseY - knobCenter.y;
      let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      // Normalize to 0-360 degrees
      angle = (angle + 360) % 360;
      return angle;
    }
    
    // Double-click to reset to center value
    const handleDblClick = (e) => {
      e.preventDefault();
      const centerValue = 5;
      knob.dataset.value = centerValue;
      updateModalKnobRotation(centerValue);
      updateMainKnobValue(knob.id, centerValue);
    };
    
    const handleMouseDown = (e) => {
      isDragging = true;
      startMousePos = { x: e.clientX, y: e.clientY };
      startValue = parseFloat(knob.dataset.value) || 5;
      knobCenter = getKnobCenter();
      
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging || !knob.closest('#instrumentModal')) return;
      
      // Calculate sensitivity based on modifier keys
      let sensitivity = 0.05; // Base sensitivity (increased for better responsiveness)
      if (e.shiftKey) sensitivity *= 0.1; // Fine control with Shift
      if (e.ctrlKey) sensitivity *= 3; // Coarse control with Ctrl
      
      // Use vertical mouse movement for intuitive control
      const deltaY = startMousePos.y - e.clientY;
      let newValue = startValue + (deltaY * sensitivity);
      
      // Alternative: Use circular mouse tracking for more natural feel
      if (e.altKey) {
        const currentAngle = calculateAngleFromMouse(e.clientX, e.clientY);
        const startAngle = calculateAngleFromMouse(startMousePos.x, startMousePos.y);
        let angleDelta = currentAngle - startAngle;
        
        // Handle angle wrapping
        if (angleDelta > 180) angleDelta -= 360;
        if (angleDelta < -180) angleDelta += 360;
        
        newValue = startValue + (angleDelta / 36); // 360° = 10 units
      }
      
      // Clamp value to valid range
      newValue = Math.max(0, Math.min(10, newValue));
      
      knob.dataset.value = newValue;
      updateModalKnobRotation(newValue);
      
      // Update the corresponding main knob value
      updateMainKnobValue(knob.id, newValue);
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
      }
    };
    
    // Mouse wheel support for fine adjustment
    const handleWheel = (e) => {
      e.preventDefault();
      const currentValue = parseFloat(knob.dataset.value) || 5;
      let sensitivity = 0.3; // Increased wheel sensitivity
      if (e.shiftKey) sensitivity *= 0.1; // Fine control with Shift
      
      const delta = e.deltaY > 0 ? -sensitivity : sensitivity;
      let newValue = currentValue + delta;
      newValue = Math.max(0, Math.min(10, newValue));
      
      knob.dataset.value = newValue;
      updateModalKnobRotation(newValue);
      updateMainKnobValue(knob.id, newValue);
    };
    
    // Store references to handlers for potential cleanup
    knob._modalMouseDown = handleMouseDown;
    knob._modalMouseMove = handleMouseMove;
    knob._modalMouseUp = handleMouseUp;
    knob._modalWheel = handleWheel;
    knob._modalDblClick = handleDblClick;
    
    knob.addEventListener('mousedown', handleMouseDown);
    knob.addEventListener('wheel', handleWheel);
    knob.addEventListener('dblclick', handleDblClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
  
  // Setup modal sliders
  document.querySelectorAll('#instrumentModal .volume-slider, #instrumentModal .shuffle-slider').forEach(slider => {
    // Remove any existing event listeners to avoid duplicates
    slider.removeEventListener('mousedown', slider._modalMouseDown);
    
    let isDragging = false;
    let startX = 0;
    let startValue = 0;
    
    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      const currentWidth = slider.style.getPropertyValue('--slider-width');
      startValue = parseFloat(currentWidth) / 10 || 7; // Convert percentage back to 0-10
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging || !slider.closest('#instrumentModal')) return;
      
      const deltaX = e.clientX - startX;
      const sensitivity = 0.05;
      let newValue = startValue + (deltaX * sensitivity);
      newValue = Math.max(0, Math.min(10, newValue));
      
      const percentage = (newValue / 10) * 100;
      slider.style.setProperty('--slider-width', `${percentage}%`);
      
      // Update the corresponding main slider value
      updateMainSliderValue(slider.id, newValue);
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    };
    
    // Store reference to the handler for potential cleanup
    slider._modalMouseDown = handleMouseDown;
    slider._modalMouseMove = handleMouseMove;
    slider._modalMouseUp = handleMouseUp;
    
    slider.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
}

function updateMainKnobValue(modalKnobId, value) {
  if (!currentModalInstrument) return;
  
  const knobMapping = {
    'modalGain': `gain${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`,
    'modalPan': `pan${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`,
    'modalTune': `tune${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`
  };
  
  const mainKnobKey = knobMapping[modalKnobId];
  if (mainKnobKey) {
    knobValues[mainKnobKey] = value;
  }
  
  // Store modal-specific values per instrument
  setModalKnob(currentModalInstrument, modalKnobId, value);

  // Modern engine routing (plan §5.3): stored in the engine's param table and
  // applied at the next trigger — the permanent fix for the dead-Tune bug.
  if (window.GrooveAudio && typeof window.GrooveAudio.setParam === 'function'
      && ENGINE_MODAL_PARAM_MAP[modalKnobId]) {
    window.GrooveAudio.setParam(currentModalInstrument, ENGINE_MODAL_PARAM_MAP[modalKnobId], value);
  }

  // Handle enhanced audio controls
  switch(modalKnobId) {
    // Envelope controls
    case 'modalAttack':
      updateEnvelopeControls(currentModalInstrument, 'attack', value);
      break;
    case 'modalDecay':
      updateEnvelopeControls(currentModalInstrument, 'decay', value);
      break;
    case 'modalSustain':
      updateEnvelopeControls(currentModalInstrument, 'sustain', value);
      break;
    case 'modalRelease':
      updateEnvelopeControls(currentModalInstrument, 'release', value);
      break;
    
    // Filter controls
    case 'modalFilter':
      updateFilterControls(currentModalInstrument, 'filter', value);
      break;
    case 'modalResonance':
      updateFilterControls(currentModalInstrument, 'resonance', value);
      break;
    
    // Effects controls
    case 'modalReverb':
      updateEffectsControls(currentModalInstrument, 'reverb', value);
      break;
    case 'modalDelay':
      updateEffectsControls(currentModalInstrument, 'delay', value);
      break;
    case 'modalDistortion':
      updateEffectsControls(currentModalInstrument, 'distortion', value);
      break;
    case 'modalCompression':
      updateEffectsControls(currentModalInstrument, 'compression', value);
      break;
    
    // EQ controls
    case 'modalEqHigh':
      updateEQControls(currentModalInstrument, 'eqHigh', value);
      break;
    case 'modalEqLow':
      updateEQControls(currentModalInstrument, 'eqLow', value);
      break;
    
    // Pattern controls
    case 'modalProbability':
      updatePatternControls(currentModalInstrument, 'probability', value);
      break;
    case 'modalVelocity':
      updatePatternControls(currentModalInstrument, 'velocity', value);
      break;
    case 'modalTiming':
      updatePatternControls(currentModalInstrument, 'timing', value);
      break;
    case 'modalFlam':
      updatePatternControls(currentModalInstrument, 'flam', value);
      break;
    case 'modalRoll':
      updatePatternControls(currentModalInstrument, 'roll', value);
      break;
    case 'modalPitchBend':
      updatePatternControls(currentModalInstrument, 'pitchBend', value);
      break;
  }
}

function updateMainSliderValue(modalSliderId, value) {
  if (!currentModalInstrument) return;
  
  const sliderMapping = {
    'modalLevel': `level${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`,
    'modalShuffle': `shuffle${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`
  };
  
  const mainSliderKey = sliderMapping[modalSliderId];
  if (mainSliderKey) {
    knobValues[mainSliderKey] = value;

    // Update the main slider visual
    const mainSlider = document.getElementById(mainSliderKey);
    if (mainSlider) {
      const percentage = (value / 10) * 100;
      mainSlider.style.setProperty('--slider-width', `${percentage}%`);
    }

    // level<Inst> drives engine channel gain when the engine is present
    routeEngineKnob(mainSliderKey, value);
  }
}

// Modal action functions
let copiedInstrumentSettings = null;

// Function to restore original synth parameters (before any modal modifications)
function restoreOriginalSynthParameters(instrument) {
  // Modern engine: reset every stored voice param to its factory default via
  // GrooveAudio.setParam — applied at the next trigger, never mid-envelope.
  if (window.GrooveAudio && typeof window.GrooveAudio.setParam === 'function'
      && window.GrooveParams && typeof window.GrooveParams.defaultKnobs === 'function') {
    const defaults = window.GrooveParams.defaultKnobs(instrument);
    Object.keys(defaults).forEach(param => {
      window.GrooveAudio.setParam(instrument, param, defaults[param]);
    });
    return;
  }

  const synth = synths[instrument];
  if (!synth) return;
  
  // Restore original envelope parameters based on synth type
  if (synth.envelope) {
    switch(instrument) {
      case 'bd':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 1.0;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.05;
        break;
      case 'ht':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.45;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.1;
        break;
      case 'lt':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.45;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.1;
        break;
      case 'mt':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.45;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.1;
        break;
      case 'sd':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.3;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.1;
        break;
      case 'rim':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.025;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.01;
        break;
      case 'hc':
      case 'mc':
      case 'lc':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.32;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.05;
        break;
      case 'cb':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.55;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.1;
        break;
      case 'cr':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 1.5;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.2;
        break;
      case 'cl':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.015;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.005;
        break;
      case 'ma':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.22;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.05;
        break;
      case 'ch':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.1;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.02;
        break;
      case 'oh':
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.4;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.1;
        break;
      case 'cym':
        synth.envelope.attack = 0.01;
        synth.envelope.decay = 1.6;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.5;
        break;
        synth.envelope.attack = 0.001;
        synth.envelope.decay = 0.02;
        synth.envelope.sustain = 0;
        synth.envelope.release = 0.01;
        break;
    }
  }
  
  // Restore original filter parameters based on synth type
  if (synth.filter) {
    switch(instrument) {
      case 'ht':
        synth.filter.frequency.value = 160;
        synth.filter.Q.value = 2.5;
        break;
      case 'lt':
        synth.filter.frequency.value = 80;
        synth.filter.Q.value = 2.5;
        break;
      case 'mt':
        synth.filter.frequency.value = 120;
        synth.filter.Q.value = 2.5;
        break;
      case 'rim':
        synth.filter.frequency.value = 3100;
        synth.filter.Q.value = 6;
        break;
      case 'hc':
        synth.filter.frequency.value = 4100;
        synth.filter.Q.value = 6;
        break;
      case 'mc':
        synth.filter.frequency.value = 4100;
        synth.filter.Q.value = 6;
        break;
      case 'lc':
        synth.filter.frequency.value = 4100;
        synth.filter.Q.value = 6;
        break;
      case 'cb':
        synth.filter.frequency.value = 1050;
        synth.filter.Q.value = 3.5;
        break;
      case 'cr':
        synth.filter.frequency.value = 8000;
        synth.filter.Q.value = 2;
        break;
      case 'cl':
        synth.filter.frequency.value = 2600;
        synth.filter.Q.value = 12;
        break;
      case 'ma':
        synth.filter.frequency.value = 5200;
        synth.filter.Q.value = 1;
        break;
      case 'ch':
        synth.filter.frequency.value = 7100;
        synth.filter.Q.value = 1;
        break;
      case 'oh':
        synth.filter.frequency.value = 7100;
        synth.filter.Q.value = 1;
        break;
      case 'cym':
        synth.filter.frequency.value = 7200;
        synth.filter.Q.value = 1;
        break;
        synth.filter.frequency.value = 3600;
        synth.filter.Q.value = 6;
        break;
    }
  }
  
  // Reset effects to off/neutral states
  if (synth.effects) {
    if (synth.effects.reverb) synth.effects.reverb.wet.value = 0;
    if (synth.effects.delay) synth.effects.delay.feedback.value = 0;
    if (synth.effects.distortion) synth.effects.distortion.distortion = 0;
    if (synth.effects.compressor) synth.effects.compressor.ratio.value = 1;
    if (synth.effects.eq) {
      synth.effects.eq.high.value = 0;
      synth.effects.eq.low.value = 0;
    }
  }
}

// Function to get TRUE master defaults from the original knobValues and synth parameters
function getTrueMasterDefaults(instrument) {
  const trueMasterDefaults = {};
  
  // Get BASIC CONTROLS from the original knobValues object
  const instrumentKey = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  
  // These are the TRUE master defaults from the knobValues initialization
  const originalKnobValues = {
    // Level controls (original master defaults)
    levelBd: 8, levelSd: 7, levelLt: 6, levelMt: 6, levelHt: 6, levelRim: 6,
    levelHc: 6, levelMc: 6, levelLc: 6, levelCb: 7, levelCr: 7, levelCym: 6, levelOh: 7,
    levelCh: 7, levelCl: 7, levelMa: 6,     // Gain controls (all 5)
    gainBd: 5, gainSd: 5, gainLt: 5, gainMt: 5, gainHt: 5, gainRim: 5,
    gainHc: 5, gainMc: 5, gainLc: 5, gainCb: 5, gainCr: 5, gainCym: 5, gainOh: 5,
    gainCh: 5, gainCl: 5, gainMa: 5,     // Pan controls (all 5)
    panBd: 5, panSd: 5, panLt: 5, panMt: 5, panHt: 5, panRim: 5,
    panHc: 5, panMc: 5, panLc: 5, panCb: 5, panCr: 5, panCym: 5, panOh: 5,
    panCh: 5, panCl: 5, panMa: 5,     // Tune controls (all 5)
    tuneBd: 5, tuneSd: 5, tuneLt: 5, tuneMt: 5, tuneHt: 5, tuneRim: 5,
    tuneHc: 5, tuneMc: 5, tuneLc: 5, tuneCb: 5, tuneCr: 5, tuneCym: 5, tuneOh: 5,
    tuneCh: 5, tuneCl: 5, tuneMa: 5,     // Shuffle controls (all 0)
    shuffleBd: 0, shuffleSd: 0, shuffleLt: 0, shuffleMt: 0, shuffleHt: 0, shuffleRim: 0,
    shuffleHc: 0, shuffleMc: 0, shuffleLc: 0, shuffleCb: 0, shuffleCr: 0, shuffleCym: 0, shuffleOh: 0,
    shuffleCh: 0, shuffleCl: 0, shuffleMa: 0
  };
  
  // Copy basic controls
  trueMasterDefaults[`level${instrumentKey}`] = originalKnobValues[`level${instrumentKey}`];
  trueMasterDefaults[`gain${instrumentKey}`] = originalKnobValues[`gain${instrumentKey}`];
  trueMasterDefaults[`pan${instrumentKey}`] = originalKnobValues[`pan${instrumentKey}`];
  trueMasterDefaults[`tune${instrumentKey}`] = originalKnobValues[`tune${instrumentKey}`];
  trueMasterDefaults[`shuffle${instrumentKey}`] = originalKnobValues[`shuffle${instrumentKey}`];
  
  // For ADVANCED/EFFECTS CONTROLS - set to neutral UI positions but don't apply them
  // These will be set in modalKnobValues for UI display but won't modify the synth
  trueMasterDefaults.modalAttack = 5;      // ~4 ms attack (engine default)
  trueMasterDefaults.modalDecay = 5;       // Mid decay
  trueMasterDefaults.modalSustain = 0;     // Off = classic one-shot AD
  trueMasterDefaults.modalRelease = 0;     // Off unless sustain is raised
  trueMasterDefaults.modalFilter = 5;      // Tone / filter centre
  trueMasterDefaults.modalResonance = 5;   // Unity Q multiplier
  trueMasterDefaults.modalReverb = 0;      // Off
  trueMasterDefaults.modalDelay = 0;       // Off
  trueMasterDefaults.modalDistortion = 0;  // Off
  trueMasterDefaults.modalCompression = 0; // Off (transparent)
  trueMasterDefaults.modalEqHigh = 5;      // Flat
  trueMasterDefaults.modalEqLow = 5;       // Flat
  
  return trueMasterDefaults;
}

/** Push every mapped modal knob for one instrument into GrooveAudio. */
function syncInstrumentModalToEngine(instrument) {
  if (!window.GrooveAudio || typeof window.GrooveAudio.setParam !== 'function' || !instrument) return;
  const defaults = getTrueMasterDefaults(instrument);
  Object.entries(ENGINE_MODAL_PARAM_MAP).forEach(([modalKey, engineKey]) => {
    const v = getModalKnob(instrument, modalKey, defaults[modalKey]);
    if (v !== undefined && v !== null) {
      window.GrooveAudio.setParam(instrument, engineKey, v);
    }
  });
  const key = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  ['level', 'tune', 'pan', 'gain'].forEach(param => {
    const v = knobValues[`${param}${key}`];
    if (v !== undefined) window.GrooveAudio.setParam(instrument, param, v);
  });
}

function resetInstrumentToDefaults(instrument) {
  // Get TRUE master defaults for this instrument
  const trueMasterDefaults = getTrueMasterDefaults(instrument);
  const instrumentKey = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  
  // Reset BASIC CONTROLS to TRUE master defaults
  knobValues[`level${instrumentKey}`] = trueMasterDefaults[`level${instrumentKey}`];
  knobValues[`gain${instrumentKey}`] = trueMasterDefaults[`gain${instrumentKey}`];
  knobValues[`pan${instrumentKey}`] = trueMasterDefaults[`pan${instrumentKey}`];
  knobValues[`tune${instrumentKey}`] = trueMasterDefaults[`tune${instrumentKey}`];
  knobValues[`shuffle${instrumentKey}`] = trueMasterDefaults[`shuffle${instrumentKey}`];
  
  // RESTORE ORIGINAL SYNTH PARAMETERS directly (bypass modal control system)
  restoreOriginalSynthParameters(instrument);
  
  // Set modal UI values to neutral positions (per instrument)
  const modalControls = ['modalAttack', 'modalDecay', 'modalSustain', 'modalRelease', 'modalFilter', 'modalResonance', 'modalReverb', 'modalDelay', 'modalDistortion', 'modalCompression', 'modalEqHigh', 'modalEqLow'];
  modalControls.forEach(param => {
    setModalKnob(instrument, param, trueMasterDefaults[param]);
  });
  syncInstrumentModalToEngine(instrument);
  
  // Reload values into modal
  loadInstrumentValuesIntoModal(instrument);
  
  // Update main interface
  updateMainInterfaceFromModal();
}

// Note: resetAllModalControls function removed - using single resetInstrumentToDefaults

// Reset BASIC CONTROLS only
function resetBasicControls(instrument) {
  // Get TRUE master defaults for this instrument
  const trueMasterDefaults = getTrueMasterDefaults(instrument);
  const instrumentKey = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  
  // Reset basic controls to TRUE master defaults
  knobValues[`level${instrumentKey}`] = trueMasterDefaults[`level${instrumentKey}`];
  knobValues[`gain${instrumentKey}`] = trueMasterDefaults[`gain${instrumentKey}`];
  knobValues[`pan${instrumentKey}`] = trueMasterDefaults[`pan${instrumentKey}`];
  knobValues[`tune${instrumentKey}`] = trueMasterDefaults[`tune${instrumentKey}`];
  knobValues[`shuffle${instrumentKey}`] = trueMasterDefaults[`shuffle${instrumentKey}`];
  
  // Update modal values
  setModalKnob(instrument, 'modalGain', trueMasterDefaults[`gain${instrumentKey}`]);
  setModalKnob(instrument, 'modalPan', trueMasterDefaults[`pan${instrumentKey}`]);
  setModalKnob(instrument, 'modalTune', trueMasterDefaults[`tune${instrumentKey}`]);
  setModalKnob(instrument, 'modalShuffle', trueMasterDefaults[`shuffle${instrumentKey}`]);
  if (window.GrooveAudio) {
    window.GrooveAudio.setParam(instrument, 'pan', trueMasterDefaults[`pan${instrumentKey}`]);
    window.GrooveAudio.setParam(instrument, 'tune', trueMasterDefaults[`tune${instrumentKey}`]);
    window.GrooveAudio.setParam(instrument, 'gain', trueMasterDefaults[`gain${instrumentKey}`]);
    window.GrooveAudio.setParam(instrument, 'level', trueMasterDefaults[`level${instrumentKey}`]);
  }
  
  // Update ONLY basic controls UI in modal
  updateBasicControlsUI(instrument);
  
  // Update main interface
  updateMainInterfaceFromModal();
}

// Reset ADVANCED CONTROLS only
function resetAdvancedControls(instrument) {
  // Get TRUE master defaults for this instrument
  const trueMasterDefaults = getTrueMasterDefaults(instrument);
  
  // RESTORE ORIGINAL SYNTH ENVELOPE AND FILTER PARAMETERS directly
  restoreOriginalSynthParameters(instrument);
  
  // Set modal UI values to neutral positions (per instrument)
  const advancedControls = ['modalAttack', 'modalDecay', 'modalSustain', 'modalRelease', 'modalFilter', 'modalResonance'];
  advancedControls.forEach(param => {
    setModalKnob(instrument, param, trueMasterDefaults[param]);
  });
  if (window.GrooveAudio) {
    ['modalAttack', 'modalDecay', 'modalSustain', 'modalRelease', 'modalFilter', 'modalResonance'].forEach(param => {
      window.GrooveAudio.setParam(instrument, ENGINE_MODAL_PARAM_MAP[param], trueMasterDefaults[param]);
    });
  }
  
  // Update ONLY advanced controls UI in modal
  updateAdvancedControlsUI();
}

// Reset EFFECTS CONTROLS only
function resetEffectsControls(instrument) {
  // Get TRUE master defaults for this instrument
  const trueMasterDefaults = getTrueMasterDefaults(instrument);
  
  // RESTORE ORIGINAL EFFECTS PARAMETERS directly (reset to off/neutral)
  const synth = synths[instrument];
  if (synth && synth.effects) {
    if (synth.effects.reverb) synth.effects.reverb.wet.value = 0;
    if (synth.effects.delay) synth.effects.delay.feedback.value = 0;
    if (synth.effects.distortion) synth.effects.distortion.distortion = 0;
    if (synth.effects.compressor) synth.effects.compressor.ratio.value = 1;
    if (synth.effects.eq) {
      synth.effects.eq.high.value = 0;
      synth.effects.eq.low.value = 0;
    }
  }
  
  // Set modal UI values to neutral positions (per instrument)
  const effectsControls = ['modalReverb', 'modalDelay', 'modalDistortion', 'modalCompression', 'modalEqHigh', 'modalEqLow'];
  effectsControls.forEach(param => {
    setModalKnob(instrument, param, trueMasterDefaults[param]);
  });
  if (window.GrooveAudio) {
    effectsControls.forEach(param => {
      window.GrooveAudio.setParam(instrument, ENGINE_MODAL_PARAM_MAP[param], trueMasterDefaults[param]);
    });
  }
  
  // Update ONLY effects controls UI in modal
  updateEffectsControlsUI();
}

function randomizeInstrumentValues(instrument) {
  // Randomize live sound controls only — never pattern-chaos knobs
  const instrumentKey = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  
  // BASIC CONTROLS
  const randomBasicValues = {
    level: Math.random() * 10,
    gain: Math.random() * 10,
    pan: Math.random() * 10,
    tune: 2 + Math.random() * 6, // Keep tune closer to center
    shuffle: Math.random() * 5 // Keep shuffle moderate
  };
  
  Object.entries(randomBasicValues).forEach(([param, value]) => {
    const key = `${param}${instrumentKey}`;
    knobValues[key] = value;
  });
  setModalKnob(instrument, 'modalGain', randomBasicValues.gain);
  setModalKnob(instrument, 'modalPan', randomBasicValues.pan);
  setModalKnob(instrument, 'modalTune', randomBasicValues.tune);
  setModalKnob(instrument, 'modalShuffle', randomBasicValues.shuffle);
  if (window.GrooveAudio) {
    window.GrooveAudio.setParam(instrument, 'pan', randomBasicValues.pan);
    window.GrooveAudio.setParam(instrument, 'tune', randomBasicValues.tune);
    window.GrooveAudio.setParam(instrument, 'level', randomBasicValues.level);
    window.GrooveAudio.setParam(instrument, 'gain', randomBasicValues.gain);
  }
  
  const randomAdvancedValues = {
    modalAttack: Math.random() * 4,
    modalDecay: 2 + Math.random() * 6,
    modalSustain: Math.random() * 4,
    modalRelease: Math.random() * 5,
    modalFilter: 2 + Math.random() * 6,
    modalResonance: 2 + Math.random() * 6
  };
  
  Object.entries(randomAdvancedValues).forEach(([param, value]) => {
    setModalKnob(instrument, param, value);
    updateMainKnobValue(param, value);
  });
  
  const randomEffectsValues = {
    modalReverb: Math.random() * 4,
    modalDelay: Math.random() * 3,
    modalDistortion: Math.random() * 3,
    modalCompression: Math.random() * 6,
    modalEqHigh: 3 + Math.random() * 4,
    modalEqLow: 3 + Math.random() * 4
  };
  
  Object.entries(randomEffectsValues).forEach(([param, value]) => {
    setModalKnob(instrument, param, value);
    updateMainKnobValue(param, value);
  });
  
  // Pattern-chaos knobs intentionally untouched by full RANDOMIZE
  
  // Reload values into modal
  loadInstrumentValuesIntoModal(instrument);
  
  // Update main interface
  updateMainInterfaceFromModal();
}

// Randomize BASIC CONTROLS only
function randomizeBasicControls(instrument) {
  const instrumentKey = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  
  const randomBasicValues = {
    level: Math.random() * 10,
    gain: Math.random() * 10,
    pan: Math.random() * 10,
    tune: 2 + Math.random() * 6, // Keep tune closer to center
    shuffle: Math.random() * 5 // Keep shuffle moderate
  };
  
  Object.entries(randomBasicValues).forEach(([param, value]) => {
    const key = `${param}${instrumentKey}`;
    knobValues[key] = value;
  });
  
  // Update modal values
  setModalKnob(instrument, 'modalGain', randomBasicValues.gain);
  setModalKnob(instrument, 'modalPan', randomBasicValues.pan);
  setModalKnob(instrument, 'modalTune', randomBasicValues.tune);
  setModalKnob(instrument, 'modalShuffle', randomBasicValues.shuffle);
  if (window.GrooveAudio) {
    window.GrooveAudio.setParam(instrument, 'pan', randomBasicValues.pan);
    window.GrooveAudio.setParam(instrument, 'tune', randomBasicValues.tune);
    window.GrooveAudio.setParam(instrument, 'level', randomBasicValues.level);
    window.GrooveAudio.setParam(instrument, 'gain', randomBasicValues.gain);
  }
  
  // Update ONLY basic controls UI in modal
  updateBasicControlsUI(instrument);
  
  // Update main interface
  updateMainInterfaceFromModal();
}

// Randomize ADVANCED CONTROLS only
function randomizeAdvancedControls(instrument) {
  const randomAdvancedValues = {
    modalAttack: Math.random() * 4,
    modalDecay: 2 + Math.random() * 6,
    modalSustain: Math.random() * 4,
    modalRelease: Math.random() * 5,
    modalFilter: 2 + Math.random() * 6,
    modalResonance: 2 + Math.random() * 6
  };
  
  Object.entries(randomAdvancedValues).forEach(([param, value]) => {
    setModalKnob(instrument, param, value);
    updateMainKnobValue(param, value);
  });
  
  // Update ONLY advanced controls UI in modal
  updateAdvancedControlsUI();
}

// Randomize EFFECTS CONTROLS only
function randomizeEffectsControls(instrument) {
  const randomEffectsValues = {
    modalReverb: Math.random() * 4,
    modalDelay: Math.random() * 3,
    modalDistortion: Math.random() * 3,
    modalCompression: Math.random() * 6,
    modalEqHigh: 3 + Math.random() * 4,
    modalEqLow: 3 + Math.random() * 4
  };
  
  Object.entries(randomEffectsValues).forEach(([param, value]) => {
    setModalKnob(instrument, param, value);
    updateMainKnobValue(param, value);
  });
  
  // Update ONLY effects controls UI in modal
  updateEffectsControlsUI();
}

// Reset PATTERN CONTROLS only
function resetPatternControls(instrument) {
  const patternDefaults = {
    modalProbability: 10,
    modalVelocity: 5,
    modalTiming: 5,
    modalFlam: 0,
    modalRoll: 0,
    modalPitchBend: 5
  };
  
  Object.entries(patternDefaults).forEach(([param, value]) => {
    setModalKnob(instrument, param, value);
    updateMainKnobValue(param, value);
  });
  
  // Update ONLY pattern controls UI in modal
  updatePatternControlsUI();
  refreshPatternFxBadges();
}

// Randomize PATTERN CONTROLS — audible ranges (must be heard while Play is running)
function randomizePatternControls(instrument) {
  const randomPatternValues = {
    modalProbability: 5 + Math.random() * 5,   // 5–10 (50–100% hit chance)
    modalVelocity: Math.random() * 10,         // full swing / ghost range
    modalTiming: Math.random() * 10,           // ±50 ms around center
    modalFlam: Math.random() < 0.55 ? (2 + Math.random() * 8) : 0,
    modalRoll: Math.random() < 0.45 ? (4 + Math.random() * 6) : 0, // >3 enables rolls
    modalPitchBend: 2 + Math.random() * 6      // clear detune either side of 5
  };
  
  Object.entries(randomPatternValues).forEach(([param, value]) => {
    setModalKnob(instrument, param, value);
    updateMainKnobValue(param, value);
  });
  
  // Update ONLY pattern controls UI in modal
  updatePatternControlsUI();
  refreshPatternFxBadges();
}

function copyInstrumentSettings(instrument) {
  copiedInstrumentSettings = {
    level: knobValues[`level${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 7,
    gain: knobValues[`gain${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 5,
    pan: knobValues[`pan${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 5,
    tune: knobValues[`tune${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 5,
    shuffle: knobValues[`shuffle${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 0
  };
  
}

function pasteInstrumentSettings(instrument) {
  if (!copiedInstrumentSettings) {
    return;
  }
  
  // Apply copied settings
  Object.entries(copiedInstrumentSettings).forEach(([param, value]) => {
    const key = `${param}${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`;
    knobValues[key] = value;
  });
  
  // Reload values into modal
  loadInstrumentValuesIntoModal(instrument);
  
  // Update main interface
  updateMainInterfaceFromModal();
  
}

function updateMainInterfaceFromModal() {
  if (!currentModalInstrument) return;
  
  // Update main sliders visual
  const levelKey = `level${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`;
  const shuffleKey = `shuffle${currentModalInstrument.charAt(0).toUpperCase()}${currentModalInstrument.slice(1)}`;
  
  const levelSlider = document.getElementById(levelKey);
  const shuffleSlider = document.getElementById(shuffleKey);
  
  if (levelSlider) {
    const percentage = (knobValues[levelKey] / 10) * 100;
    levelSlider.style.setProperty('--slider-width', `${percentage}%`);
  }
  
  if (shuffleSlider) {
    const percentage = (knobValues[shuffleKey] / 10) * 100;
    shuffleSlider.style.setProperty('--slider-width', `${percentage}%`);
  }
}

// Global modal knob rotation function
function updateModalKnobRotationGlobal(value, targetKnob) {
  if (!targetKnob) return;
  
  // Google icon naturally points to ~11 o'clock (330°)
  // For normal knob behavior: 7 o'clock (min) to 5 o'clock (max)
  // CLOCKWISE rotation increases value (like normal knobs)
  const iconOffset = 330; // Google icon's natural pointing direction
  const minPosition = 210; // 7 o'clock position for minimum (value = 0)
  const maxPosition = 510; // 5 o'clock position for maximum (150° + 360° = 510°)
  
  // Calculate the rotation needed from icon's natural position
  // Going clockwise from 210° to 510° (which is 150° + full circle)
  const targetAngle = minPosition + (value / 10) * (maxPosition - minPosition);
  const rotation = targetAngle - iconOffset;
  
  targetKnob.style.setProperty('--rotation', `${rotation}deg`);
}

// Section-specific UI update functions to prevent cross-section interference
function updateBasicControlsUI(instrument) {
  // Load basic controls only
  const levelValue = knobValues[`level${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 7;
  const gainValue = getModalKnob(instrument, 'modalGain', knobValues[`gain${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] ?? 5);
  const panValue = getModalKnob(instrument, 'modalPan', knobValues[`pan${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] ?? 5);
  const tuneValue = getModalKnob(instrument, 'modalTune', knobValues[`tune${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] ?? 5);
  const shuffleValue = knobValues[`shuffle${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`] || 0;
  
  // Set slider values
  const levelSlider = document.getElementById('modalLevel');
  if (levelSlider) {
    levelSlider.style.setProperty('--slider-width', `${(levelValue / 10) * 100}%`);
    levelSlider.dataset.instrument = instrument;
  }
  
  const shuffleSlider = document.getElementById('modalShuffle');
  if (shuffleSlider) {
    shuffleSlider.style.setProperty('--slider-width', `${(shuffleValue / 10) * 100}%`);
    shuffleSlider.dataset.instrument = instrument;
  }
  
  // Set basic control knobs
  const basicKnobs = [
    { id: 'modalGain', value: gainValue },
    { id: 'modalPan', value: panValue },
    { id: 'modalTune', value: tuneValue }
  ];
  
  basicKnobs.forEach(knob => {
    const element = document.getElementById(knob.id);
    if (element) {
      element.dataset.value = knob.value;
      element.dataset.instrument = instrument;
      updateModalKnobRotationGlobal(knob.value, element);
    }
  });
}

function updateAdvancedControlsUI() {
  const inst = currentModalInstrument;
  if (!inst) return;
  const advancedKnobs = [
    { id: 'modalAttack', value: getModalKnob(inst, 'modalAttack', 5) },
    { id: 'modalDecay', value: getModalKnob(inst, 'modalDecay', 5) },
    { id: 'modalSustain', value: getModalKnob(inst, 'modalSustain', 0) },
    { id: 'modalRelease', value: getModalKnob(inst, 'modalRelease', 0) },
    { id: 'modalFilter', value: getModalKnob(inst, 'modalFilter', 5) },
    { id: 'modalResonance', value: getModalKnob(inst, 'modalResonance', 5) }
  ];
  
  advancedKnobs.forEach(knob => {
    const element = document.getElementById(knob.id);
    if (element) {
      element.dataset.value = knob.value;
      updateModalKnobRotationGlobal(knob.value, element);
    }
  });
}

function updateEffectsControlsUI() {
  const inst = currentModalInstrument;
  if (!inst) return;
  const effectsKnobs = [
    { id: 'modalReverb', value: getModalKnob(inst, 'modalReverb', 0) },
    { id: 'modalDelay', value: getModalKnob(inst, 'modalDelay', 0) },
    { id: 'modalDistortion', value: getModalKnob(inst, 'modalDistortion', 0) },
    { id: 'modalCompression', value: getModalKnob(inst, 'modalCompression', 0) },
    { id: 'modalEqHigh', value: getModalKnob(inst, 'modalEqHigh', 5) },
    { id: 'modalEqLow', value: getModalKnob(inst, 'modalEqLow', 5) }
  ];
  
  effectsKnobs.forEach(knob => {
    const element = document.getElementById(knob.id);
    if (element) {
      element.dataset.value = knob.value;
      updateModalKnobRotationGlobal(knob.value, element);
    }
  });
}

function updatePatternControlsUI() {
  const inst = currentModalInstrument;
  if (!inst) return;
  const patternKnobs = [
    { id: 'modalProbability', value: patternControls.probability[inst] ?? 10 },
    { id: 'modalVelocity', value: patternControls.velocity[inst] ?? 5 },
    { id: 'modalTiming', value: patternControls.timing[inst] ?? 5 },
    { id: 'modalFlam', value: patternControls.flam[inst] ?? 0 },
    { id: 'modalRoll', value: patternControls.roll[inst] ?? 0 },
    { id: 'modalPitchBend', value: patternControls.pitchBend[inst] ?? 5 }
  ];
  
  patternKnobs.forEach(knob => {
    const element = document.getElementById(knob.id);
    if (!element) return;
    element.dataset.value = knob.value;
    if (window.GCKnobs && typeof window.GCKnobs.set === 'function') {
      window.GCKnobs.set(knob.id, knob.value, { silent: true });
    } else {
      updateModalKnobRotationGlobal(knob.value, element);
    }
  });
}

// Setup click-to-open modal controls
function setupControlInteractionTracking() {
  // Track clicks on instrument names to open modal
  document.querySelectorAll('.instrument-name').forEach(nameElement => {
    nameElement.addEventListener('click', (e) => {
      e.preventDefault();
      const instrument = nameElement.closest('.instrument-row').dataset.instrument;
      openInstrumentModal(instrument);
    });
  });
  
  // Close controls when clicking outside the sequencer area
  document.addEventListener('click', (e) => {
    // Only close if clicking completely outside the sequencer panel
    if (!e.target.closest('.step-sequencer-panel')) {
      if (expandedInstrument) {
        const controls = document.querySelector(`.instrument-controls[data-instrument="${expandedInstrument}"]`);
        const arrow = document.querySelector(`.instrument-row[data-instrument="${expandedInstrument}"] .expand-arrow`);
        if (controls) controls.classList.remove('expanded', 'positioned-above');
        if (arrow) arrow.classList.remove('expanded');
        expandedInstrument = null;
      }
    }
  });
  
  // Recalculate positioning on window resize
  window.addEventListener('resize', () => {
    if (expandedInstrument) {
      const controls = document.querySelector(`.instrument-controls[data-instrument="${expandedInstrument}"]`);
      const row = document.querySelector(`.instrument-row[data-instrument="${expandedInstrument}"]`);
      if (controls && row) {
        const rowRect = row.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const controlsHeight = 150;
        const spaceBelow = viewportHeight - rowRect.bottom;
        const spaceAbove = rowRect.top;
        
        if (spaceBelow < controlsHeight && spaceAbove > controlsHeight) {
          controls.classList.add('positioned-above');
        } else {
          controls.classList.remove('positioned-above');
        }
      }
    }
  });
}

// Volume slider functionality
function setupSliders() {
  // Modern path: pointer-driven slider engine (horizontal drag, wheel, dbl-tap)
  if (window.GCKnobs) {
    document.querySelectorAll('.volume-slider').forEach(slider => {
      const sliderId = slider.id;
      if (!sliderId || slider.closest('#instrumentModal')) return;
      const initialValue = knobValues[sliderId] !== undefined ? knobValues[sliderId] : 7;
      knobValues[sliderId] = initialValue;
      window.GCKnobs.bind(slider, {
        min: 0,
        max: 10,
        default: 7,
        value: initialValue,
        getValue: () => (knobValues[sliderId] !== undefined ? knobValues[sliderId] : 7),
        onChange: (v) => {
          knobValues[sliderId] = v;
          // level<Inst> sliders drive engine channel gain when present
          routeEngineKnob(sliderId, v);
        }
      });
    });
    return;
  }

  // Legacy fallback binding (mouse-only)
  document.querySelectorAll('.volume-slider').forEach(slider => {
    let isDragging = false;
    let startX = 0;
    let startValue = 0;
    
    const sliderId = slider.id;
    const initialValue = knobValues[sliderId] || 7;
    
    function updateSliderPosition(value) {
      const percentage = (value / 10) * 100; // Convert 0-10 to 0-100%
      slider.style.setProperty('--slider-width', `${percentage}%`);
    }
    
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startValue = knobValues[sliderId] || 7;
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const sensitivity = 0.05;
      let newValue = startValue + (deltaX * sensitivity);
      newValue = Math.max(0, Math.min(10, newValue));
      
      knobValues[sliderId] = newValue;
      updateSliderPosition(newValue);
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    });
    
    // Initialize slider position
    updateSliderPosition(initialValue);
  });
}

// Update pattern indicators
function updatePatternIndicators() {
  const patternDisplay = document.getElementById('patternDisplay');
  const sequencerPanel = document.querySelector('.step-sequencer-panel');
  
  if (patternDisplay) {
    patternDisplay.textContent = variation.toUpperCase();
  }
  
  // Update sequencer panel styling
  if (sequencerPanel) {
    sequencerPanel.classList.remove('pattern-a', 'pattern-b');
    sequencerPanel.classList.add(`pattern-${variation}`);
  }
}

// Variation switch functionality
function setupVariationSwitch() {
  document.querySelectorAll('.variation-btn').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.variation-btn').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      variation = option.dataset.variation.toLowerCase();
      
      // Update visual indicators
      updatePatternIndicators();
      
      // Update the step display to show the new pattern
      updateStepDisplay();
      
      // Show brief feedback
    });
  });
}

// Clear button drag functionality
function setupClearButton() {
  const clearBtn = document.getElementById('clearButton');
  
  clearBtn.addEventListener('mousedown', (e) => {
    isDraggingClear = true;
    clearBtn.style.background = 'linear-gradient(145deg, #ff6500, #ff4500)';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDraggingClear) return;
    
    const stepButtons = document.querySelectorAll('.step-button');
    const hoveredStep = document.elementFromPoint(e.clientX, e.clientY);
    
    stepButtons.forEach(step => step.classList.remove('highlight'));
    
    if (hoveredStep && hoveredStep.classList.contains('step-button')) {
      hoveredStep.classList.add('highlight');
    }
  });
  
  document.addEventListener('mouseup', (e) => {
    if (!isDraggingClear) return;
    
    isDraggingClear = false;
    clearBtn.style.background = '';
    
    const hoveredStep = document.elementFromPoint(e.clientX, e.clientY);
    if (hoveredStep && hoveredStep.classList.contains('step-button')) {
      const stepNum = parseInt(hoveredStep.dataset.step);
      setPatternLength(stepNum);
    }
    
    document.querySelectorAll('.step-button').forEach(step => step.classList.remove('highlight'));
  });
  
  // Click to clear pattern
  clearBtn.addEventListener('click', (e) => {
    if (!isDraggingClear) {
      clearPattern();
    }
  });
}

// Add row controls to all instrument rows
function addRowControls() {
  const instrumentRows = document.querySelectorAll('.instrument-row');
  instrumentRows.forEach(row => {
    // Skip if already has row controls
    if (row.querySelector('.row-controls')) return;
    
    // Get instrument code from the first step button (which already has correct data-instrument)
    const firstStepButton = row.querySelector('.step-button[data-instrument]');
    const instrumentCode = firstStepButton ? firstStepButton.dataset.instrument : '';
    const instrumentName = instrumentCode; // Use the code as the name for display
    
    
    const rowControls = document.createElement('div');
    rowControls.className = 'row-controls flex flex-row items-center gap-0.5';
    rowControls.innerHTML = `
      <div class="control-icon" data-action="add-row" data-instrument="${instrumentCode}" title="Add all steps for ${instrumentName}">
        <span class="material-icons">add</span>
      </div>
      <div class="control-icon" data-action="remove-row" data-instrument="${instrumentCode}" title="Remove all steps for ${instrumentName}">
        <span class="material-icons">remove</span>
      </div>
    `;
    
    row.appendChild(rowControls);
  });
}

// Get instrument code from display name
function getInstrumentCode(displayName) {
  const mapping = {
    'bd': 'bd', 'sd': 'sd', 'ch': 'ch', 'oh': 'oh', 'cb': 'cb', 'cl': 'cl', 
    'cym': 'cym', 'lt': 'lt', 'mt': 'mt', 'ht': 'ht', 'hc': 'hc', 'mc': 'mc', 
    'lc': 'lc', 'ma': 'ma', 'rim': 'rim'
  };
  return mapping[displayName.toLowerCase()] || displayName.toLowerCase();
}

// =============================================================================
// UI Update Functions
// =============================================================================

// Update nixie tube BPM display with smooth digit transitions
function updateNixieBPMDisplay(bpm) {
  // Main BPM display
  const digit1 = document.getElementById('bpmDigit1');
  const digit2 = document.getElementById('bpmDigit2');
  const digit3 = document.getElementById('bpmDigit3');
  
  // Modal BPM display
  const modalDigit1 = document.getElementById('modalBpmDigit1');
  const modalDigit2 = document.getElementById('modalBpmDigit2');
  const modalDigit3 = document.getElementById('modalBpmDigit3');
  
  // Convert BPM to string and pad with leading zeros if needed
  const bpmStr = Math.round(bpm).toString().padStart(3, '0');
  
  // Update main display digits if they exist
  if (digit1 && digit2 && digit3) {
    updateDigitWithTransition(digit1, bpmStr[0]);
    updateDigitWithTransition(digit2, bpmStr[1]);
    updateDigitWithTransition(digit3, bpmStr[2]);
  }
  
  // Update modal display digits if they exist
  if (modalDigit1 && modalDigit2 && modalDigit3) {
    updateDigitWithTransition(modalDigit1, bpmStr[0]);
    updateDigitWithTransition(modalDigit2, bpmStr[1]);
    updateDigitWithTransition(modalDigit3, bpmStr[2]);
  }
}

// Helper function to update individual nixie digits with transition
function updateDigitWithTransition(digitElement, newValue) {
  if (digitElement.textContent !== newValue) {
    // Add a brief flicker effect when changing
    digitElement.style.animation = 'none';
    digitElement.style.opacity = '0.6';
    
    setTimeout(() => {
      digitElement.textContent = newValue;
      digitElement.style.opacity = '1';
      digitElement.style.animation = 'nixie-flicker 3s ease-in-out infinite';
    }, 50);
  }
}

// Update play/pause button based on current state
function updatePlayButton() {
  const playButton = document.getElementById("playButton");
  const icon = playButton.querySelector('.play-icon');
  const text = playButton.querySelector('.play-text');
  
  if (isPlaying) {
    // Show pause state
    icon.textContent = 'pause';
    text.textContent = 'PAUSE';
    playButton.classList.add('playing');
  } else {
    // Show play state
    icon.textContent = 'play_arrow';
    text.textContent = 'PLAY';
    playButton.classList.remove('playing');
  }
}

// =============================================================================
// Event Listeners Setup
// =============================================================================

function setupEventListeners() {
  // Start/Stop button
  document.getElementById("playButton").addEventListener("click", async () => {
    try {
      document.getElementById("loader").classList.add("done");
      document.getElementById("root").classList.remove("rendering");
      
      if (!isPlaying) {
        // Starting playback
        await Tone.start(); // Ensure audio context is started
        if (window.GrooveAudio && typeof window.GrooveAudio.init === 'function') {
          await window.GrooveAudio.init(); // lazy, idempotent engine boot
          syncEngineParams();
        }
        isPlaying = true;
        currentStep = 0; // Reset to beginning

        Tone.Transport.bpm.value = tempo;
        Tone.Transport.cancel(); // Clear any existing events
    // The Transport's `time` argument flows through the entire trigger path
    Tone.Transport.scheduleRepeat((time) => updateStep(time), "16n");
    Tone.Transport.start();
        
        // Update button to show PAUSE
        updatePlayButton();

        if (window.GC) window.GC.events.emit('play');

      } else {
        // Stopping playback
        isPlaying = false;
        Tone.Transport.stop();
        Tone.Transport.cancel();
        currentStep = 0;
        
        // Stop all synths to prevent hanging notes
        Object.values(synths).forEach(synth => {
          if (synth && synth.releaseAll) {
            synth.releaseAll();
          }
        });
        
        // Clear visual indicators
        document.querySelectorAll('.step-button').forEach(s => s.classList.remove('blink'));
        
        // Update button to show PLAY
        updatePlayButton();

        if (window.GC) window.GC.events.emit('stop');

      }
    } catch (error) {
      console.warn('[GrooveCore] playback toggle failed:', error);
      isPlaying = false;
      updatePlayButton();
    }
  });

  // Step button clicks
  document.querySelectorAll('.step-button').forEach((step) => {
    step.addEventListener("click", (e) => {
      const stepNum = parseInt(step.dataset.step) - 1;
      const instrumentType = step.dataset.instrument; // Get instrument from button
      const pattern = patterns[variation][currentPattern];
      const patternLength = pattern.length1 || 16;

      // Don't allow programming beyond pattern length
      if (stepNum >= patternLength && currentPart !== "manualPlay" && currentPart !== "patternClear") {
        return;
      }

      if (currentPart === "manualPlay") {
        selectPattern(stepNum);
      } else if (currentPart === "patternClear") {
        clearPattern();
      } else {
        // Programming mode (1st PART or 2nd PART)
        const part = currentPart === "1stPart" ? pattern.part1 : pattern.part2;

        if (!part[stepNum]) part[stepNum] = {};
        const cell = part[stepNum];

        if (instrumentType === 'accent') {
          // AC row: per-step accent flag, not a voice
          if (cell.accent) {
            delete cell.accent;
          } else {
            cell.accent = true;
          }
          updateStepDisplay();
          return;
        }

        // Data model v2 velocity tiers: Shift = accent 127, Alt = ghost 45,
        // plain click toggles normal 100 / off
        if (e.shiftKey) {
          cell[instrumentType] = 127;
        } else if (e.altKey) {
          cell[instrumentType] = 45;
        } else if (cell[instrumentType]) {
          delete cell[instrumentType];
        } else {
          cell[instrumentType] = 100;
        }

        updateStepDisplay();

        // Play sound when programming — apply modal flam/roll/pitch so pattern
        // knobs are audible without needing Transport Play.
        if (cell[instrumentType] && canTrigger(instrumentType)) {
          const cellVelocity = cell[instrumentType] === true ? 100 : Number(cell[instrumentType]) || 100;
          previewPatternHit(instrumentType, cellVelocity);
        }
      }
    });
  });

  // Mode selector
  document.getElementById("mode").addEventListener("change", (e) => {
    currentPart = e.target.value;
    updateStepDisplay();
  });

  // Instrument selector
  document.getElementById("instrument").addEventListener("change", (e) => {
    currentInstrument = e.target.value;
    updateStepDisplay();
  });

  // Save/Load/Reset functions
document.getElementById("save").addEventListener("click", () => {
    const saveData = {
      version: 2,
      patterns: patterns,
      knobValues: knobValues,
      tempo: tempo,
      // Additional state variables for complete restore
      currentPattern: currentPattern,
      currentPart: currentPart,
      currentInstrument: currentInstrument,
      variation: variation,
      muteSoloState: {
        muted: Array.from(muteSoloState.muted),
        soloed: Array.from(muteSoloState.soloed)
      },
      // Modal and pattern control settings for each instrument
      modalKnobValues: modalKnobValues,
      patternControls: patternControls
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "groovecore-save.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  
  console.log(`💾 Save complete: Pattern ${currentPattern + 1}, ${Object.keys(patterns.a).length + Object.keys(patterns.b).length} total patterns, ${Object.keys(knobValues).length} knob settings, ${Object.keys(modalKnobValues).length} modal controls, ${Object.keys(patternControls.probability).length} instruments with pattern effects`);
});

// Security enhancement: Sanitize string input to prevent potential issues
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  // Remove any potential script tags or dangerous characters
  return str
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// Security enhancement: JSON structure validation function
function validateSaveData(data) {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid save data: not an object');
    return false;
  }
  
  // Check for new format (object with patterns property)
  if (data.patterns && typeof data.patterns === 'object') {
    const patterns = data.patterns;
    
    // Validate patterns structure
    if (!patterns.a || !patterns.b) {
      console.warn('Invalid save data: missing pattern A or B');
      return false;
    }
    
    // Basic validation of pattern arrays
    if (!Array.isArray(patterns.a) || !Array.isArray(patterns.b)) {
      console.warn('Invalid save data: patterns must be arrays');
      return false;
    }
    
    // Check pattern length (should be 16 or less)
    if (patterns.a.length > 16 || patterns.b.length > 16) {
      console.warn('Invalid save data: pattern length exceeds maximum');
      return false;
    }
    
    return true;
  }
  
  // Check for old format (direct array)
  if (Array.isArray(data)) {
    if (data.length > 16) {
      console.warn('Invalid save data: array length exceeds maximum');
      return false;
    }
    return true;
  }
  
  console.warn('Invalid save data: unknown format');
  return false;
}

document.getElementById("load").addEventListener("click", () => {
  const input = document.createElement('input');
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    
    // Security enhancement: File size validation (1MB limit)
    if (file.size > 1024 * 1024) {
      alert('File too large. Please select a JSON file under 1MB.');
      return;
    }
    
    // Security enhancement: File type validation
    if (!file.name.toLowerCase().endsWith('.json')) {
      alert('Invalid file type. Please select a JSON file.');
      return;
    }
    
    const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          
          // Security enhancement: Validate JSON structure
          if (!validateSaveData(saveData)) {
            throw new Error('Invalid save file format or structure');
          }
          
          if (saveData.patterns) {
            // New format with A/B patterns (v1 `true` cells and v2 integer
            // velocity cells are both accepted — truthiness-compatible)
            patterns = saveData.patterns;
          } else if (Array.isArray(saveData)) {
            // Old format - convert to new format
            patterns = {
              a: saveData,
              b: Array(16).fill().map(() => ({
                part1: Array(16).fill().map(() => ({})),
                part2: Array(16).fill().map(() => ({})),
                length1: 16,
                length2: 0,
                sfx1: {}
              }))
            };
          }
          // Normalize: every pattern carries an sfx1 bag (v1 files lack it)
          ['a', 'b'].forEach(key => {
            (patterns[key] || []).forEach(p => {
              if (p && !p.sfx1) p.sfx1 = {};
            });
          });
          if (saveData.knobValues) Object.assign(knobValues, saveData.knobValues);
          if (saveData.tempo) tempo = saveData.tempo;
          
          // Restore additional state variables
          if (saveData.currentPattern !== undefined) currentPattern = saveData.currentPattern;
          if (saveData.currentPart) currentPart = saveData.currentPart;
          if (saveData.currentInstrument) currentInstrument = saveData.currentInstrument;
          if (saveData.variation) variation = saveData.variation;
          
          // Restore mute/solo state
          if (saveData.muteSoloState) {
            muteSoloState.muted.clear();
            muteSoloState.soloed.clear();
            if (saveData.muteSoloState.muted) {
              saveData.muteSoloState.muted.forEach(inst => muteSoloState.muted.add(inst));
            }
            if (saveData.muteSoloState.soloed) {
              saveData.muteSoloState.soloed.forEach(inst => muteSoloState.soloed.add(inst));
            }
          }
          
          // Restore modal knob values (per-instrument; migrate flat → nested)
          if (saveData.modalKnobValues) {
            modalKnobValues = normalizeModalKnobValues(saveData.modalKnobValues);
          }
          
          // Restore pattern controls (per-instrument effects)
          if (saveData.patternControls) {
            patternControls = {
              probability: Object.assign({}, saveData.patternControls.probability || {}),
              velocity: Object.assign({}, saveData.patternControls.velocity || {}),
              timing: Object.assign({}, saveData.patternControls.timing || {}),
              flam: Object.assign({}, saveData.patternControls.flam || {}),
              roll: Object.assign({}, saveData.patternControls.roll || {}),
              pitchBend: Object.assign({}, saveData.patternControls.pitchBend || {})
            };
          }
          
          // Update UI to reflect loaded state
          updateStepDisplay();
          updateUIFromState();
          syncModalEngineParams();
          refreshPatternFxBadges();
          
          console.log(`📁 Load complete: Pattern ${currentPattern + 1}, Part ${currentPart}, Instrument ${currentInstrument}, Variation ${variation.toUpperCase()}, ${muteSoloState.muted.size} muted, ${muteSoloState.soloed.size} soloed, ${Object.keys(modalKnobValues).length} instruments with modal controls, ${Object.keys(patternControls.probability).length} instruments with effects`);
        } catch (error) {
          console.error('Failed to load save file:', error);
          alert('Failed to load save file. Please check the file format.');
        }
      };
    reader.readAsText(file);
  };
  input.click();
});

  document.getElementById("reset").addEventListener("click", () => {
    // Stop playback if running
    if (isPlaying) {
      isPlaying = false;
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      // Stop all synths to prevent hanging notes
      Object.values(synths).forEach(synth => {
        if (synth && synth.releaseAll) {
          synth.releaseAll();
        }
      });
      
      // Clear visual indicators
      document.querySelectorAll('.step-button').forEach(s => s.classList.remove('blink'));
      
      // Update button to show PLAY
      updatePlayButton();
    }
    
    // Reset all pattern data
    patterns = {
      a: Array(16).fill().map(() => ({
        part1: Array(16).fill().map(() => ({})),
        part2: Array(16).fill().map(() => ({})),
        length1: 16,
        length2: 0,
        sfx1: {}
      })),
      b: Array(16).fill().map(() => ({
        part1: Array(16).fill().map(() => ({})),
        part2: Array(16).fill().map(() => ({})),
        length1: 16,
        length2: 0,
        sfx1: {}
      }))
    };
    
    // Reset global state variables
    currentPattern = 0;
    currentPart = "1stPart";
    currentInstrument = "bd";
    variation = "a";
    currentStep = 0;
    tempo = 120;
    isDraggingClear = false;
    
    // Reset all knob values to the shipped factory defaults
    // (tempo = 3 on the 0-10 knob scale = 120 BPM)
    Object.keys(knobValues).forEach(key => {
      knobValues[key] = DEFAULT_KNOB_VALUES.hasOwnProperty(key) ? DEFAULT_KNOB_VALUES[key] : 5;
    });
    
    // Clear modal knob values and pattern controls
    modalKnobValues = normalizeModalKnobValues({});
    patternControls = {
      probability: {},
      velocity: {},
      timing: {},
      flam: {},
      roll: {},
      pitchBend: {}
    };
    refreshPatternFxBadges();
    
    // Clear mute/solo state
    muteSoloState.muted.clear();
    muteSoloState.soloed.clear();
    
    // Reset all instrument controls to master defaults
    const instruments = ['bd', 'sd', 'cp', 'ch', 'oh', 'cb', 'cr', 'cl', 'cym', 'ht', 'mt', 'lt', 'hc', 'mc', 'lc', 'ma', 'rim'];
    instruments.forEach(instrument => {
      // Restore original synth parameters for each instrument
      // (per-instrument knob values already restored from DEFAULT_KNOB_VALUES above)
      restoreOriginalSynthParameters(instrument);
    });
    
    // Reset UI selectors to default state
    rememberPresetSelection(null, null);
    const stylePresetSelect = document.getElementById('stylePreset');
    if (stylePresetSelect) {
      stylePresetSelect.value = '';
    }
    
    const inspirationSelect = document.getElementById('inspirationSequence');
    if (inspirationSelect) {
      inspirationSelect.value = '';
    }
    
    // Reset variation buttons to Pattern A
    document.querySelectorAll('.variation-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('.variation-btn[data-variation="A"]')?.classList.add('active');
    
    // Clear all visual highlighting when resetting
    document.querySelectorAll('.column-highlight').forEach(el => {
      el.classList.remove('column-highlight');
    });
    
    // Clear any expanded instrument controls
    document.querySelectorAll('.instrument-controls.expanded').forEach(controls => {
      controls.classList.remove('expanded');
    });
    
    // Clear any row highlighting
    document.querySelectorAll('.instrument-row.row-highlight').forEach(row => {
      row.classList.remove('row-highlight');
    });
    
    // Update mute/solo button states
    document.querySelectorAll('.mute-btn, .solo-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Update the display
    updateStepDisplay();
    updateUIFromState();
    
    console.log('Master reset completed - all patterns, settings, and controls restored to defaults');
  });

  // MIDI Export button with options
  document.getElementById("exportMidi").addEventListener("click", (e) => {
    // Hard guard against library not being ready
    if (typeof window.MidiWriter === 'undefined') {
      alert('MIDI library not ready yet. Please try again in a moment.');
      return;
    }
    
    if (e.shiftKey) {
      // Advanced export options
      const choice = prompt(
        "🎵 Enhanced MIDI Export Options:\n\n" +
        "1 = Standard Export (Single Track)\n" +
        "2 = Multi-Track Export (Better for mixing)\n" +
        "3 = Enhanced Export (Includes volume/pan CCs)\n" +
        "4 = Cancel\n\n" +
        "Enter choice (1-4):", "1"
      );
      
      switch(choice) {
        case "1":
          if (typeof exportPatternToMidiEnhanced === 'function') {
            exportPatternToMidiEnhanced();
          } else {
            exportPatternToMidi(); // Fallback to original
          }
          break;
        case "2":
          if (typeof exportPatternToMidiMultiTrack === 'function') {
            exportPatternToMidiMultiTrack();
          } else {
            alert("Multi-track export not available. Using standard export.");
            exportPatternToMidi();
          }
          break;
        case "3":
          if (typeof exportPatternToMidiEnhanced === 'function') {
            exportPatternToMidiEnhanced({ includeMixData: true });
          } else {
            exportPatternToMidi(); // Fallback
          }
          break;
        case "4":
        case null:
          // Cancelled
          break;
        default:
          alert("Invalid choice. Using standard export.");
          exportPatternToMidi();
      }
    } else {
      // Normal click - use enhanced export if available, fallback to original
      if (typeof exportPatternToMidiEnhanced === 'function') {
        exportPatternToMidiEnhanced();
      } else {
        exportPatternToMidi();
      }
    }
  });

  // TAP button for manual play mode
document.getElementById("tap").addEventListener("click", () => {
    if (currentPart === "manualPlay") {
      // Trigger fill pattern or other tap functionality
    }
  });

  // Style preset selector
  document.getElementById("stylePreset").addEventListener("change", (e) => {
    if (e.target.value) {
      // Handle mutual exclusion
      handleMutualExclusion('style', e.target.value);
      
      if (e.target.value === 'random') {
        selectRandomStyle();
      } else {
        loadStylePreset(e.target.value);
      }
    }
  });

  // Inspiration sequence selector
  document.getElementById("inspirationSequence").addEventListener("change", (e) => {
    if (e.target.value) {
      // Handle mutual exclusion
      handleMutualExclusion('inspiration', e.target.value);
      
      if (e.target.value === 'random') {
        selectRandomInspiration();
      } else {
        loadInspirationSequence(e.target.value);
      }
    }
  });

  // Asymmetrical time signature toggle
  document.getElementById("asymmetrical").addEventListener("click", () => {
    const pattern = patterns[variation][currentPattern];
    // Toggle between 16 and 15 step pattern for asymmetrical feel
    if (pattern.length1 === 16) {
      pattern.length1 = 15;
    } else if (pattern.length1 === 15) {
      pattern.length1 = 13; // 13/8 feel
    } else {
      pattern.length1 = 16; // Back to standard
    }
    updateStepDisplay();
  });

  // Cross-rhythm generator
  document.getElementById("crossrhythm").addEventListener("click", () => {
    const pattern = patterns[variation][currentPattern];
    const part = currentPart === "1stPart" ? pattern.part1 : pattern.part2;
    
    // Generate 3-against-4 cross rhythm on multiple instruments
    // Primary pattern on claves (traditional Latin cross rhythm)
    [2, 5, 8, 11, 14].forEach(step => {
      if (!part[step]) part[step] = {};
      part[step]['cl'] = !part[step]['cl'];
    });
    
    // Complementary pattern on closed hi-hat (offset cross rhythm)
    [3, 6, 9, 12, 15].forEach(step => {
      if (!part[step]) part[step] = {};
      part[step]['ch'] = !part[step]['ch'];
    });
    
    updateStepDisplay();
  });

  // Help modal functionality
  document.getElementById("helpButton").addEventListener("click", () => {
    const modal = document.getElementById("helpModal");
    modal.classList.add("show");
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("helpModal");
    modal.classList.remove("show");
  });

  // Close modal when clicking outside
  document.getElementById("helpModal").addEventListener("click", (e) => {
    if (e.target.id === "helpModal") {
      const modal = document.getElementById("helpModal");
      modal.classList.remove("show");
    }
  });

  // Tab switching functionality for help modal
  document.querySelectorAll('.modal .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Remove active class from all tabs and content
      document.querySelectorAll('.modal .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.modal .tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      btn.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });

  // Tab switching functionality for bottom section
  document.querySelectorAll('.sticky-bottom-section .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Remove active class from all tabs and content
      document.querySelectorAll('.sticky-bottom-section .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.sticky-bottom-section .tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      btn.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const helpModal = document.getElementById("helpModal");
      const instrumentModal = document.getElementById("instrumentModal");
      
      if (helpModal.classList.contains('show')) {
        helpModal.classList.remove('show');
      }
      if (!instrumentModal.classList.contains('hidden')) {
        closeInstrumentModal();
      }
    }
  });

  // Instrument modal close button
  document.getElementById("closeInstrumentModal").addEventListener("click", () => {
    closeInstrumentModal();
  });

  // Close modal when clicking outside - updated for Tailwind structure
  document.getElementById("instrumentModal").addEventListener("click", (e) => {
    if (e.target.id === "instrumentModal") {
      closeInstrumentModal();
    }
  });


  // Modal reset button - resets THIS instrument to master defaults
  document.getElementById("resetInstrument").addEventListener("click", () => {
    if (currentModalInstrument) {
      // Reset THIS instrument completely to master defaults
      resetInstrumentToDefaults(currentModalInstrument);
    }
  });

  // Remove the redundant "Reset All" button event listener
  // (The button should be removed from HTML as well)

  // Section reset buttons
  document.getElementById("resetBasicControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      resetBasicControls(currentModalInstrument);
    }
  });

  document.getElementById("resetAdvancedControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      resetAdvancedControls(currentModalInstrument);
    }
  });

  document.getElementById("resetEffectsControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      resetEffectsControls(currentModalInstrument);
    }
  });

  document.getElementById("randomizeInstrument").addEventListener("click", () => {
    if (currentModalInstrument) {
      // Randomize ALL instrument values
      randomizeInstrumentValues(currentModalInstrument);
    }
  });

  // Section randomize buttons
  document.getElementById("randomizeBasicControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      randomizeBasicControls(currentModalInstrument);
    }
  });

  document.getElementById("randomizeAdvancedControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      randomizeAdvancedControls(currentModalInstrument);
    }
  });

  document.getElementById("randomizeEffectsControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      randomizeEffectsControls(currentModalInstrument);
    }
  });

  document.getElementById("resetPatternControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      resetPatternControls(currentModalInstrument);
    }
  });

  document.getElementById("randomizePatternControls").addEventListener("click", () => {
    if (currentModalInstrument) {
      randomizePatternControls(currentModalInstrument);
    }
  });

  document.getElementById("copyInstrument").addEventListener("click", () => {
    if (currentModalInstrument) {
      // Copy instrument settings
      copyInstrumentSettings(currentModalInstrument);
    }
  });

  document.getElementById("pasteInstrument").addEventListener("click", () => {
    if (currentModalInstrument) {
      // Paste instrument settings
      pasteInstrumentSettings(currentModalInstrument);
    }
  });


  // Pattern label click handlers (toggle column)
  document.addEventListener('click', (e) => {
    // Handle pattern label clicks (toggle column)
    if (e.target.closest('.pattern-label[data-action="add-column"]')) {
      console.log('Pattern label clicked');
      const patternLabel = e.target.closest('.pattern-label');
      const action = patternLabel.dataset.action;
      const column = parseInt(patternLabel.dataset.column) - 1;
      
      console.log('Toggling column:', column + 1, 'Action:', action);
      
      const pattern = patterns[variation][currentPattern];
      const part = currentPart === "1stPart" ? pattern.part1 : pattern.part2;
      
      if (action === 'add-column') {
        const instruments = ['bd', 'sd', 'cp', 'ch', 'oh', 'cb', 'cl', 'cym', 'lt', 'mt', 'ht', 'hc', 'mc', 'lc', 'ma', 'rim'];
        
        // Check if all instruments are currently on for this column
        let allInstrumentsOn = true;
        if (!part[column]) {
          allInstrumentsOn = false;
        } else {
          instruments.forEach(inst => {
            if (!part[column][inst]) {
              allInstrumentsOn = false;
            }
          });
        }
        
        if (allInstrumentsOn) {
          // Turn all OFF
          if (part[column]) {
            instruments.forEach(inst => {
              delete part[column][inst];
            });
          }
          console.log('Column cleared (all off)');
          
          // Visual feedback - red for OFF
          patternLabel.style.backgroundColor = '#dc2626';
          setTimeout(() => {
            patternLabel.style.backgroundColor = '';
          }, 200);
          
        } else {
          // Turn all ON
          if (!part[column]) part[column] = {};
          instruments.forEach(inst => {
            part[column][inst] = true;
          });
          console.log('Column filled (all on)');
          
          // Visual feedback - green for ON
          patternLabel.style.backgroundColor = '#16a34a';
          setTimeout(() => {
            patternLabel.style.backgroundColor = '';
          }, 200);
        }
        
        updateStepDisplay();
      }
      
      e.preventDefault();
      e.stopPropagation();
    }
  }, true); // Use capture phase to handle before other click handlers

  // Row control box handlers (toggle all on/off)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.row-control-box')) {
      const rowControlBox = e.target.closest('.row-control-box');
      const action = rowControlBox.dataset.action;
      const instrument = rowControlBox.dataset.instrument;
      
      console.log('Row control box clicked:', instrument);
      
      const pattern = patterns[variation][currentPattern];
      const part = currentPart === "1stPart" ? pattern.part1 : pattern.part2;
      
      if (action === 'add-row') {
        // Check if all steps are currently on for this instrument
        let allStepsOn = true;
        for (let step = 0; step < 16; step++) {
          if (!part[step] || !part[step][instrument]) {
            allStepsOn = false;
            break;
          }
        }
        
        // Toggle: if all on, turn all off; if not all on, turn all on
        const toggleIcon = rowControlBox.querySelector('.material-icons');
        
        if (allStepsOn) {
          // Turn all OFF
          for (let step = 0; step < 16; step++) {
            if (part[step] && part[step][instrument]) {
              delete part[step][instrument];
            }
          }
          console.log('Row cleared (all off)');
          toggleIcon.textContent = 'toggle_off';
          
          // Visual feedback - red for OFF
          rowControlBox.style.backgroundColor = '#dc2626'; // Red flash
          setTimeout(() => {
            rowControlBox.style.backgroundColor = '';
            toggleIcon.textContent = 'toggle_on';
          }, 200);
          
        } else {
          // Turn all ON
          for (let step = 0; step < 16; step++) {
            if (!part[step]) part[step] = {};
            part[step][instrument] = true;
          }
          console.log('Row filled (all on)');
          toggleIcon.textContent = 'toggle_on';
          
          // Visual feedback - green for ON
          rowControlBox.style.backgroundColor = '#16a34a'; // Green flash
          setTimeout(() => {
            rowControlBox.style.backgroundColor = '';
          }, 200);
        }
        
        updateStepDisplay();
      }
      
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Column and Row control handlers (legacy)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.control-icon')) {
      const controlIcon = e.target.closest('.control-icon');
      const action = controlIcon.dataset.action;
      const pattern = patterns[variation][currentPattern];
      const part = currentPart === "1stPart" ? pattern.part1 : pattern.part2;
      
      if (action === 'add-column') {
        const column = parseInt(controlIcon.dataset.column) - 1;
        const instruments = ['bd', 'sd', 'cp', 'ch', 'oh', 'cb', 'cl', 'cym', 'lt', 'mt', 'ht', 'hc', 'mc', 'lc', 'ma', 'rim'];
        
        if (!part[column]) part[column] = {};
        instruments.forEach(inst => {
          part[column][inst] = true;
        });
        
        // Add column highlighting to show it's selected
        document.querySelectorAll('.instrument-row').forEach(row => {
          const stepButtons = row.querySelectorAll('.step-button');
          if (stepButtons[column]) {
            stepButtons[column].classList.add('column-highlight');
          }
        });
        
        // Play a representative sound when adding column (bass drum)
        if (canTrigger('bd')) {
          const volume = (knobValues['levelBd'] || 7) / 10;
          triggerInstrument('bd', volume, 0);
        }
        
        updateStepDisplay();
      } else if (action === 'remove-column') {
        const column = parseInt(controlIcon.dataset.column) - 1;
        if (part[column]) {
          part[column] = {};
        }
        
        // Remove column highlighting
        document.querySelectorAll('.instrument-row').forEach(row => {
          const stepButtons = row.querySelectorAll('.step-button');
          if (stepButtons[column]) {
            stepButtons[column].classList.remove('column-highlight');
          }
        });
        
        updateStepDisplay();
      } else if (action === 'add-row') {
        const instrument = controlIcon.dataset.instrument;
        
        for (let step = 0; step < 16; step++) {
          if (!part[step]) part[step] = {};
          part[step][instrument] = true;
        }
        
        // Add row highlighting to show it's selected
        const instrumentRow = document.querySelector(`.instrument-row[data-instrument="${instrument}"]`);
        if (instrumentRow) {
          instrumentRow.classList.add('row-highlight');
        }
        
        // Play sound when adding row
        if (canTrigger(instrument)) {
          // Create proper knob name
          let volumeKnobName;
          volumeKnobName = `level${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`;
          
          const volume = (knobValues[volumeKnobName] || 7) / 10;
          triggerInstrument(instrument, volume, 0);
        }
        
        updateStepDisplay();
      } else if (action === 'remove-row') {
        const instrument = controlIcon.dataset.instrument;
        for (let step = 0; step < 16; step++) {
          if (part[step] && part[step][instrument]) {
            delete part[step][instrument];
          }
        }
        
        // Remove row highlighting
        const instrumentRow = document.querySelector(`.instrument-row[data-instrument="${instrument}"]`);
        if (instrumentRow) {
          instrumentRow.classList.remove('row-highlight');
        }
        
        updateStepDisplay();
      }
    }
  });
}

// =============================================================================
// UI State Restoration
// =============================================================================

function updateUIFromState() {
  refreshPatternFxBadges();
  // Update pattern selectors
  const modeSelect = document.getElementById("mode");
  if (modeSelect && modeSelect.value !== currentPart) {
    modeSelect.value = currentPart;
  }
  
  // Update instrument selector
  const instrumentSelect = document.getElementById("instrument");
  if (instrumentSelect && instrumentSelect.value !== currentInstrument) {
    instrumentSelect.value = currentInstrument;
  }
  
  // Update variation buttons
  document.querySelectorAll('.variation-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.variation.toLowerCase() === variation) {
      btn.classList.add('active');
    }
  });
  
  // Update pattern indicators
  updatePatternIndicators();
  
  // Update mute/solo button states
  document.querySelectorAll('.mute-btn').forEach(btn => {
    const instrument = btn.dataset.instrument;
    if (muteSoloState.muted.has(instrument)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  document.querySelectorAll('.solo-btn').forEach(btn => {
    const instrument = btn.dataset.instrument;
    if (muteSoloState.soloed.has(instrument)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update tempo display if exists
  const tempoDisplay = document.getElementById('tempoDisplay');
  if (tempoDisplay) {
    tempoDisplay.textContent = tempo;
  }
  
  // Update nixie tube BPM display
  updateNixieBPMDisplay(tempo);
  
  // Update knob visual states
  updateAllKnobVisuals();
  
  console.log(`🔄 UI updated from loaded state: Pattern ${currentPattern + 1}, Part ${currentPart}, Instrument ${currentInstrument}, Variation ${variation.toUpperCase()}`);
}

function updateAllKnobVisuals() {
  // Update all knob visuals to match loaded knobValues
  Object.keys(knobValues).forEach(knobKey => {
    const knobElement = document.getElementById(knobKey);
    if (knobElement) {
      const value = knobValues[knobKey];
      if (knobElement.classList.contains('knob')) {
        // Rotary knobs use the --rotation formula, not --slider-width
        applyKnobRotation(knobElement, value);
      } else {
        const percentage = (value / 10) * 100;
        knobElement.style.setProperty('--slider-width', `${percentage}%`);
      }

      // Update value display if it exists
      const valueDisplay = knobElement.querySelector('.knob-value');
      if (valueDisplay) {
        valueDisplay.textContent = value;
      }
    }
  });

  // Keep the audio transport in sync with restored tempo state
  if (typeof Tone !== 'undefined' && Tone.Transport) {
    Tone.Transport.bpm.value = tempo;
  }
}

// =============================================================================
// Application Initialization
// =============================================================================

function init() {
  try {
    setupKnobs();
    setupSliders();
    setupShuffleSliders();
    setupMuteSoloButtons();
    setupCloseControlsButtons();
    setupControlInteractionTracking();
    setupVariationSwitch();
    setupClearButton();
    setupEventListeners();
    // addRowControls(); // Disabled - now using orange toggle boxes
    updateStepDisplay();
    refreshPatternFxBadges();
    
    // Initialize pattern indicators
    updatePatternIndicators();
    
    // Initialize play button state
    updatePlayButton();
    
    // Initialize master volume
    updateMasterVolume();
    
    // Initialize BPM display
    updateNixieBPMDisplay(tempo);
    
    // Check MIDI library status
    checkMidiLibraryStatus();
    
    // Make debug functions available globally for console testing
    window.createTestPattern = createTestPattern;
    window.exportPatternToMidi = exportPatternToMidi;
    window.getCurrentPatternAsMidiData = getCurrentPatternAsMidiData;
    
    console.log('🎛️ GrooveCore initialized');
    console.log('🧪 Debug functions available: createTestPattern(), exportPatternToMidi(), getCurrentPatternAsMidiData()');
    
    // Remove loader after short delay
    setTimeout(() => {
  document.getElementById("loader").classList.add("done");
  document.getElementById("root").classList.remove("rendering");
}, 1000);
  } catch (error) {
    // Still remove loader even if there's an error
    setTimeout(() => {
      document.getElementById("loader").classList.add("done");
      document.getElementById("root").classList.remove("rendering");
    }, 1000);
  }
}

// Neutered: the legacy MidiWriter CDN polling loop is obsolete —
// js/io/smf.js replaces the MidiWriter library entirely.
function checkMidiLibraryStatus() {}

// =============================================================================
// Audio Unlock
// =============================================================================

// One-time capture-phase unlock: the very first pointer gesture anywhere on the
// page starts the audio context AND boots the modern engine (lazy, idempotent)
// so the first step-tap already makes sound through GrooveAudio.
document.addEventListener('pointerdown', async () => {
  try {
    if (typeof Tone !== 'undefined' && Tone.start) {
      await Tone.start();
    }
    if (window.GrooveAudio && typeof window.GrooveAudio.init === 'function') {
      await window.GrooveAudio.init();
      syncEngineParams();
    }
  } catch (error) {
    // Best-effort: the play button repeats Tone.start() + GrooveAudio.init()
    console.warn('[GrooveCore] first-gesture audio unlock failed:', error);
  }
}, { once: true, capture: true });

// =============================================================================
// window.GC — the app.js bridge (frozen API, UPGRADE-PLAN section 5.1)
// =============================================================================
//
// app.js is a classic script, so its top-level `let` bindings are NOT on
// window. ES modules touch app state ONLY through this bridge.

window.GC = {
  version: 1,
  dataVersion: 2,
  flags: {},

  get patterns()        { return patterns },        set patterns(v)        { patterns = v },
  get knobValues()      { return knobValues },
  get patternControls() { return patternControls }, set patternControls(v) { patternControls = v },
  get modalKnobValues() { return modalKnobValues },
  set modalKnobValues(v) { modalKnobValues = normalizeModalKnobValues(v); },
  get muteSoloState()   { return muteSoloState },
  get tempo()           { return tempo },
  get variation()       { return variation },
  get currentPattern()  { return currentPattern },
  get isPlaying()       { return isPlaying },
  get currentStep()     { return currentStep },
  get currentPresetSelection() { return currentPresetSelection },
  set currentPresetSelection(v) {
    if (!v || typeof v !== 'object') { currentPresetSelection = null; return; }
    const kind = (v.kind === 'groove') ? 'groove' : (v.kind === 'style' ? 'style' : null);
    const key = (typeof v.key === 'string' && v.key) ? v.key : null;
    currentPresetSelection = (kind && key) ? { kind, key } : null;
  },

  fns: {
    updateStepDisplay,
    updateUIFromState,
    updateAllKnobVisuals,
    updateNixieBPMDisplay,
    updatePatternIndicators,
    loadStylePreset,
    loadInspirationSequence,
    clearPattern,
    triggerInstrument,
    updateMasterVolume,
    updatePlayButton
  },

  // The single canonical tempo setter (replaces 3 divergent code paths)
  setBpm(bpm) {
    bpm = Math.min(260, Math.max(40, Math.round(bpm)));
    tempo = bpm;
    knobValues.tempo = (bpm - 60) / 20;
    if (typeof Tone !== 'undefined') Tone.Transport.bpm.rampTo(bpm, 0.1);
    updateNixieBPMDisplay(tempo);
    updateAllKnobVisuals();
  },

  // Select a pattern slot by variation ('a'|'b') and index (0-15)
  selectPattern(variationKey, index) {
    if (variationKey === 'a' || variationKey === 'b') {
      variation = variationKey;
    }
    if (Number.isInteger(index)) {
      currentPattern = Math.min(15, Math.max(0, index));
    }
    updatePatternIndicators();
    updateStepDisplay();
  },

  // Deep-copy a pattern slot; refs are { v: 'a'|'b', i: 0-15 }
  duplicatePattern(fromRef, toRef) {
    if (!fromRef || !toRef) return;
    const src = patterns[fromRef.v] && patterns[fromRef.v][fromRef.i];
    const dstBank = patterns[toRef.v];
    if (!src || !dstBank || toRef.i < 0 || toRef.i >= dstBank.length) return;
    dstBank[toRef.i] = structuredClone({
      part1: src.part1,
      part2: src.part2,
      length1: src.length1,
      length2: src.length2,
      sfx1: src.sfx1 || {}
    });
    updateStepDisplay();
  },

  // Deep-copied plain-object snapshot of all bridged state (Sets -> arrays)
  getState() {
    return {
      tempo: tempo,
      knobValues: JSON.parse(JSON.stringify(knobValues)),
      patternControls: JSON.parse(JSON.stringify(patternControls)),
      modalKnobValues: JSON.parse(JSON.stringify(modalKnobValues)),
      muteSolo: {
        muted: Array.from(muteSoloState.muted),
        soloed: Array.from(muteSoloState.soloed)
      },
      patterns: structuredClone(patterns),
      sel: { variation: variation, currentPattern: currentPattern }
    };
  },

  // Write a snapshot back into app state and refresh audio + UI
  applyState(s) {
    if (!s || typeof s !== 'object') return;
    if (s.patterns && s.patterns.a && s.patterns.b) {
      patterns = structuredClone(s.patterns);
      ['a', 'b'].forEach(key => {
        (patterns[key] || []).forEach(p => {
          if (p && !p.sfx1) p.sfx1 = {};
        });
      });
    }
    if (s.knobValues) Object.assign(knobValues, s.knobValues);
    if (typeof s.tempo === 'number' && isFinite(s.tempo)) {
      tempo = Math.min(260, Math.max(40, Math.round(s.tempo)));
    }
    if (s.patternControls) patternControls = structuredClone(s.patternControls);
    if (s.modalKnobValues) modalKnobValues = normalizeModalKnobValues(s.modalKnobValues);
    const ms = s.muteSolo || s.muteSoloState;
    if (ms) {
      muteSoloState.muted.clear();
      muteSoloState.soloed.clear();
      (ms.muted || []).forEach(inst => muteSoloState.muted.add(inst));
      (ms.soloed || []).forEach(inst => muteSoloState.soloed.add(inst));
    }
    if (s.sel) {
      if (s.sel.variation === 'a' || s.sel.variation === 'b') {
        variation = s.sel.variation;
      }
      if (Number.isInteger(s.sel.currentPattern)) {
        currentPattern = Math.min(15, Math.max(0, s.sel.currentPattern));
      }
    }
    if (typeof Tone !== 'undefined') Tone.Transport.bpm.value = tempo;
    updateStepDisplay();
    updateUIFromState();
    syncModalEngineParams();
    refreshPatternFxBadges();
  },

  // Tiny try/caught event emitter
  events: (() => {
    const handlers = {};
    return {
      on(event, fn) {
        (handlers[event] = handlers[event] || []).push(fn);
      },
      off(event, fn) {
        const list = handlers[event];
        if (!list) return;
        const idx = list.indexOf(fn);
        if (idx !== -1) list.splice(idx, 1);
      },
      emit(event, data) {
        const list = handlers[event];
        if (!list) return;
        list.slice().forEach(fn => {
          try {
            fn(data);
          } catch (error) {
            console.warn(`[GC.events] handler for '${event}' threw:`, error);
          }
        });
      }
    };
  })()
};

// Start when page loads
window.addEventListener('load', init);
