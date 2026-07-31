// =============================================================================
// Enhanced MIDI Export Function for GrooveCore
// =============================================================================
// 
// This is a drop-in replacement for exportPatternToMidi() that addresses
// all common DAW import issues, especially for Cakewalk compatibility.
//
// Features:
// - Proper GM drum mapping on Channel 10
// - Tempo and time signature meta events
// - Swing/shuffle timing baked into delta times
// - Velocity from level sliders + accent boost
// - Probability and timing jitter support
// - Part1 + Part2 concatenation
// - Defensive programming against undefined data
// - Library loading guards
// =============================================================================

function cap(x) { 
  return x.charAt(0).toUpperCase() + x.slice(1); 
}

// GM Drum mapping - Channel 10 standard
const GM_DRUM_MAP = {
  bd: 36,        // Bass Drum 1
  sd: 38,        // Acoustic Snare
  rim: 37,       // Side Stick
  ch: 39,        // Hand Clap (fixed from 42)
  hc: 42,        // Closed Hi-Hat (fixed from 63)
  mc: 44,        // Pedal Hi-Hat (fixed from 62)
  lc: 46,        // Open Hi-Hat (fixed from 61)
  oh: 46,        // Open Hi-Hat (alternative)
  lt: 45,        // Low Tom
  mt: 47,        // Low-Mid Tom
  ht: 50,        // High Tom
  cr: 49,        // Crash Cymbal 1
  cym: 57,       // Crash Cymbal 2
  cb: 56,        // Cowbell
  cl: 75,        // Claves
  ma: 70,        // Maracas
  accent: null   // Handled as velocity boost, not a note
};

// Calculate velocity from level slider + accent + optional jitter
function velocityFor(instrument, isAccented) {
  // Base velocity from row level slider (0-10) → map to 30-110
  const levelKnobName = instrument === 'accent' ? 'levelAccent' : `level${cap(instrument)}`;
  const baseLevel = knobValues[levelKnobName] ?? 7;
  let velocity = Math.round(30 + (baseLevel / 10) * 80);
  
  // Accent boost
  if (isAccented) {
    velocity = Math.min(127, velocity + 20);
  }
  
  // Optional velocity randomization from per-instrument pattern controls (5 = neutral)
  const velocityVariation = (patternControls && patternControls.velocity && patternControls.velocity[instrument] != null)
    ? patternControls.velocity[instrument]
    : 5;
  const velocityRange = (velocityVariation - 5) / 5;
  velocity *= (1 + (Math.random() - 0.5) * velocityRange * 0.5);
  
  // Clamp to MIDI range
  return Math.max(1, Math.min(127, Math.round(velocity)));
}

// Calculate swing offset for timing
function swingTicks(stepIndex, instrument, ticksPerStep) {
  // Get shuffle amount (0-10) - can be per-instrument or global
  const shuffleKnobName = `shuffle${cap(instrument)}`;
  const shuffleAmount = knobValues[shuffleKnobName] ?? knobValues.shuffle ?? 0;
  
  // Apply swing to off-beats (steps 1, 3, 5, 7, 9, 11, 13, 15)
  const isOffBeat = (stepIndex % 2) === 1;
  if (!isOffBeat) return 0;
  
  // Convert shuffle amount (0-10) to timing offset (up to 55% of step)
  const swingAmount = (shuffleAmount / 10) * 0.55;
  return Math.round(ticksPerStep * swingAmount);
}

// Apply timing jitter for humanization (per-instrument pattern control; 5 = neutral)
function applyTimingJitter(baseTicks, ticksPerStep, instrument) {
  const jitterAmount = (patternControls && patternControls.timing && instrument != null
    && patternControls.timing[instrument] != null)
    ? patternControls.timing[instrument]
    : 5;
  if (jitterAmount === 5) return baseTicks;
  const offset = ((jitterAmount - 5) / 5) * 0.05; // ±50ms at extremes (same as dispatchHit)
  const ticksPerSecond = (typeof tempo === 'number' && tempo > 0)
    ? (tempo / 60) * (ticksPerStep * 4)
    : ticksPerStep * 8;
  return baseTicks + Math.round(offset * ticksPerSecond);
}

// Enhanced MIDI export function
function exportPatternToMidiEnhanced(exportOptions = {}) {
  console.log('🎵 Starting Enhanced MIDI Export...');
  
  // 1) Library guard - hard gate the export
  if (typeof window.MidiWriter === 'undefined') {
    console.error('❌ MidiWriter library not loaded');
    alert('MIDI library not ready yet. Please try again in a moment.');
    return;
  }
  
  console.log('✅ MidiWriter library available');
  
  try {
    // Get current pattern data
    const pattern = patterns[variation][currentPattern];
    if (!pattern) {
      alert('No pattern selected. Please create or select a pattern first.');
      return;
    }
    
    // Get tempo (fallback to 120 if not set)
    const tempoValue = typeof tempo === 'number' && tempo > 0 ? tempo : 120;
    
    // MIDI settings
    const PPQ = exportOptions.resolution || 480; // Ticks per quarter note
    const DRUM_CHANNEL = 10; // GM percussion channel (1-indexed, will be 9 in code)
    const TICKS_PER_STEP = PPQ / 4; // 16th note duration
    
    console.log(`📊 Export settings: Tempo=${tempoValue}, PPQ=${PPQ}, Pattern=${currentPattern + 1}`);
    
    // 2) Create MIDI track with proper meta events
    const track = new window.MidiWriter.Track();
    
    // Essential meta events for DAW compatibility
    track.setTempo(tempoValue);
    track.setTimeSignature(4, 4); // Standard 4/4 time
    
    // Set GM drum kit on channel 10 with explicit bank selection
    track.addEvent(new window.MidiWriter.ControllerChangeEvent({
      controllerNumber: 0, // Bank Select MSB
      controllerValue: 0,   // GM Bank 0
      channel: DRUM_CHANNEL - 1
    }));
    
    track.addEvent(new window.MidiWriter.ControllerChangeEvent({
      controllerNumber: 32, // Bank Select LSB  
      controllerValue: 0,   // GM Bank 0
      channel: DRUM_CHANNEL - 1
    }));
    
    track.addEvent(new window.MidiWriter.ProgramChangeEvent({
      instrument: 0, // GM Standard Drum Kit (Program 1)
      channel: DRUM_CHANNEL - 1 // 0-indexed (channel 9 = channel 10)
    }));
    
    // Add track name with GM identification
    track.addTrackName(`GrooveCore Pattern ${currentPattern + 1} (GM Drums Ch.10)`);
    
    console.log('✅ Track created with tempo and time signature');
    
    // 3) Collect all MIDI events with absolute timing
    const midiEvents = [];
    let absoluteTicks = 0;
    
    // Process both parts in sequence
    const parts = [
      { name: 'part1', data: pattern.part1, length: pattern.length1 ?? 16 },
      { name: 'part2', data: pattern.part2, length: pattern.length2 ?? 0 }
    ];
    
    parts.forEach(part => {
      if (part.length === 0) return; // Skip empty parts
      
      console.log(`🎼 Processing ${part.name}: ${part.length} steps`);
      
      for (let step = 0; step < part.length; step++) {
        const stepData = part.data[step] || {}; // Defensive read
        const stepBaseTicks = absoluteTicks;
        
        // Check each instrument at this step
        Object.keys(stepData).forEach(instrument => {
          if (!stepData[instrument]) return; // Skip inactive instruments
          if (instrument === 'accent') return; // Accent handled separately
          
          // 4) Probability gate - per-instrument pattern control (?? so 0 means never)
          const probability = (patternControls && patternControls.probability
            && patternControls.probability[instrument] != null)
            ? patternControls.probability[instrument]
            : 10;
          if ((probability / 10) < Math.random()) {
            console.log(`🎲 Skipped ${instrument} at step ${step + 1} due to probability`);
            return;
          }
          
          // Get GM note number
          const midiNote = GM_DRUM_MAP[instrument];
          if (!midiNote) {
            console.warn(`⚠️ No GM mapping for instrument: ${instrument}`);
            return;
          }
          
          // Check if this step has accent
          const isAccented = stepData.accent || false;
          
          // 5) Calculate timing with swing
          let noteTicks = stepBaseTicks;
          const swingOffset = swingTicks(step, instrument, TICKS_PER_STEP);
          noteTicks += swingOffset;
          
          // 6) Apply timing jitter for humanization
          noteTicks = applyTimingJitter(noteTicks, TICKS_PER_STEP, instrument);
          
          // 7) Calculate velocity from sliders + accent
          const velocity = velocityFor(instrument, isAccented);
          
          // Add event to collection
          midiEvents.push({
            ticks: Math.max(0, noteTicks), // Ensure non-negative
            pitch: midiNote,
            velocity: velocity,
            duration: TICKS_PER_STEP, // 16th note duration
            instrument: instrument
          });
          
          console.log(`🎵 ${instrument} → MIDI ${midiNote} at tick ${noteTicks} (step ${step + 1}) vel=${velocity}${isAccented ? ' +ACCENT' : ''}`);
        });
        
        // Advance to next step
        absoluteTicks += TICKS_PER_STEP;
      }
    });
    
    if (midiEvents.length === 0) {
      alert('No notes to export. Please create a pattern with some active steps.');
      return;
    }
    
    console.log(`📊 Total events collected: ${midiEvents.length}`);
    
    // 8) Sort events by timing and convert to MIDI delta times
    midiEvents.sort((a, b) => a.ticks - b.ticks);
    
    let lastTicks = 0;
    midiEvents.forEach(event => {
      const deltaTime = Math.max(0, event.ticks - lastTicks);
      
      // Create MIDI note event
      const noteEvent = new window.MidiWriter.NoteEvent({
        pitch: [event.pitch],
        duration: 'T' + event.duration, // Raw ticks duration
        wait: 'T' + deltaTime,          // Raw ticks wait time
        velocity: event.velocity / 127,  // Normalize to 0-1 range
        channel: DRUM_CHANNEL - 1        // 0-indexed channel
      });
      
      track.addEvent(noteEvent);
      lastTicks = event.ticks;
    });
    
    console.log('✅ All events added to track');
    
    // 9) Optional: Add CC events for level/pan recall
    if (exportOptions.includeMixData) {
      // Add volume and pan CC events at the start
      Object.keys(GM_DRUM_MAP).forEach(instrument => {
        if (!GM_DRUM_MAP[instrument]) return;
        
        // Volume CC (CC7)
        const levelKnobName = instrument === 'accent' ? 'levelAccent' : `level${cap(instrument)}`;
        const level = knobValues[levelKnobName] ?? 7;
        const ccVolume = Math.round((level / 10) * 127);
        
        track.addEvent(new window.MidiWriter.ControllerChangeEvent({
          controllerNumber: 7,  // Volume
          controllerValue: ccVolume,
          channel: DRUM_CHANNEL - 1
        }));
        
        // Pan CC (CC10) - if pan knobs exist
        const panKnobName = `pan${cap(instrument)}`;
        if (knobValues[panKnobName] !== undefined) {
          const pan = knobValues[panKnobName] ?? 5; // 0-10 range
          const ccPan = Math.round((pan / 10) * 127);
          
          track.addEvent(new window.MidiWriter.ControllerChangeEvent({
            controllerNumber: 10, // Pan
            controllerValue: ccPan,
            channel: DRUM_CHANNEL - 1
          }));
        }
      });
      
      console.log('✅ Mix data (CC events) added');
    }
    
    // 10) Create writer and generate MIDI file
    const writer = new window.MidiWriter.Writer([track], {
      tempo: tempoValue,
      timeSignature: [4, 4],
      ppq: PPQ
    });
    
    const midiData = writer.buildFile();
    
    // 11) Download the file
    const blob = new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Generate descriptive filename
    const filename = `groovecore-${variation.toLowerCase()}-pattern${currentPattern + 1}-${tempoValue}bpm-enhanced.mid`;
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ Enhanced MIDI export successful! File: ${filename}`);
    console.log(`📊 Export summary: ${midiEvents.length} notes, ${tempoValue} BPM, ${PPQ} PPQ`);
    
    // Show success message with details
    alert(`Enhanced MIDI export successful!
    
File: ${filename}
Notes: ${midiEvents.length}
Tempo: ${tempoValue} BPM
Format: GM Drums (Channel 10)
Features: Swing timing, velocity curves, accent boost

Ready for import into Cakewalk or any DAW!`);
    
  } catch (error) {
    console.error('❌ Enhanced MIDI export error:', error);
    alert(`Error during MIDI export: ${error.message}\n\nCheck the console for details.`);
  }
}

// Alternative export with one track per instrument (better for mixing in DAWs)
function exportPatternToMidiMultiTrack(exportOptions = {}) {
  console.log('🎵 Starting Multi-Track MIDI Export...');
  
  // Library guard
  if (typeof window.MidiWriter === 'undefined') {
    alert('MIDI library not ready yet. Please try again in a moment.');
    return;
  }
  
  try {
    const pattern = patterns[variation][currentPattern];
    if (!pattern) {
      alert('No pattern selected. Please create or select a pattern first.');
      return;
    }
    
    const tempoValue = typeof tempo === 'number' && tempo > 0 ? tempo : 120;
    const PPQ = exportOptions.resolution || 480;
    const DRUM_CHANNEL = 10;
    
    // Create separate track for each instrument
    const tracks = [];
    const activeInstruments = new Set();
    
    // First pass: identify active instruments
    [pattern.part1, pattern.part2].forEach(part => {
      if (!part) return;
      part.forEach(step => {
        if (!step) return;
        Object.keys(step).forEach(inst => {
          if (step[inst] && GM_DRUM_MAP[inst]) {
            activeInstruments.add(inst);
          }
        });
      });
    });
    
    console.log(`🎼 Creating tracks for instruments: ${Array.from(activeInstruments).join(', ')}`);
    
    // Create a track for each active instrument
    activeInstruments.forEach(instrument => {
      const track = new window.MidiWriter.Track();
      track.addTrackName(`${cap(instrument)} (${instrument.toUpperCase()})`);
      track.setTempo(tempoValue);
      track.setTimeSignature(4, 4);
      
      // Set GM drum kit with explicit bank selection
      track.addEvent(new window.MidiWriter.ControllerChangeEvent({
        controllerNumber: 0, // Bank Select MSB
        controllerValue: 0,   // GM Bank 0
        channel: DRUM_CHANNEL - 1
      }));
      
      track.addEvent(new window.MidiWriter.ControllerChangeEvent({
        controllerNumber: 32, // Bank Select LSB
        controllerValue: 0,   // GM Bank 0  
        channel: DRUM_CHANNEL - 1
      }));
      
      track.addEvent(new window.MidiWriter.ProgramChangeEvent({
        instrument: 0, // GM Standard Drum Kit
        channel: DRUM_CHANNEL - 1
      }));
      
      // Collect events for this instrument only
      const instrumentEvents = [];
      let absoluteTicks = 0;
      
      const parts = [
        { data: pattern.part1, length: pattern.length1 ?? 16 },
        { data: pattern.part2, length: pattern.length2 ?? 0 }
      ];
      
      parts.forEach(part => {
        if (part.length === 0) return;
        
        for (let step = 0; step < part.length; step++) {
          const stepData = part.data[step] || {};
          
          if (stepData[instrument]) {
            // Apply per-instrument probability
            const probability = (patternControls && patternControls.probability
              && patternControls.probability[instrument] != null)
              ? patternControls.probability[instrument]
              : 10;
            if ((probability / 10) >= Math.random()) {
              const midiNote = GM_DRUM_MAP[instrument];
              const isAccented = stepData.accent || false;
              
              let noteTicks = absoluteTicks;
              noteTicks += swingTicks(step, instrument, PPQ / 4);
              noteTicks = applyTimingJitter(noteTicks, PPQ / 4, instrument);
              
              const velocity = velocityFor(instrument, isAccented);
              
              instrumentEvents.push({
                ticks: Math.max(0, noteTicks),
                pitch: midiNote,
                velocity: velocity,
                duration: PPQ / 4
              });
            }
          }
          
          absoluteTicks += PPQ / 4;
        }
      });
      
      // Add events to track
      instrumentEvents.sort((a, b) => a.ticks - b.ticks);
      let lastTicks = 0;
      
      instrumentEvents.forEach(event => {
        const deltaTime = Math.max(0, event.ticks - lastTicks);
        
        track.addEvent(new window.MidiWriter.NoteEvent({
          pitch: [event.pitch],
          duration: 'T' + event.duration,
          wait: 'T' + deltaTime,
          velocity: event.velocity / 127,
          channel: DRUM_CHANNEL - 1
        }));
        
        lastTicks = event.ticks;
      });
      
      tracks.push(track);
    });
    
    // Create writer with all tracks
    const writer = new window.MidiWriter.Writer(tracks, {
      tempo: tempoValue,
      timeSignature: [4, 4],
      ppq: PPQ
    });
    
    const midiData = writer.buildFile();
    
    // Download
    const blob = new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const filename = `groovecore-${variation.toLowerCase()}-pattern${currentPattern + 1}-${tempoValue}bpm-multitrack.mid`;
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`✅ Multi-track MIDI export successful! File: ${filename}`);
    alert(`Multi-track MIDI export successful!

File: ${filename}
Tracks: ${tracks.length} (one per instrument)
Tempo: ${tempoValue} BPM
Format: Separate tracks for easier mixing

Perfect for detailed editing in your DAW!`);
    
  } catch (error) {
    console.error('❌ Multi-track MIDI export error:', error);
    alert(`Error during multi-track export: ${error.message}`);
  }
}

// Export functions for global access
if (typeof window !== 'undefined') {
  window.exportPatternToMidiEnhanced = exportPatternToMidiEnhanced;
  window.exportPatternToMidiMultiTrack = exportPatternToMidiMultiTrack;
  
  console.log('✅ Enhanced MIDI export functions loaded');
  console.log('🎛️ Available: exportPatternToMidiEnhanced(), exportPatternToMidiMultiTrack()');
}
