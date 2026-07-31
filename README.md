# TR-808 Drum Machine

A web-based recreation of the iconic Roland TR-808 drum machine with modern browser audio synthesis.

## Project Structure

The application follows coding best practices with a clean separation of concerns:

```
808/
├── index.html      # HTML structure and layout
├── styles.css      # All styling and visual design
├── app.js          # Application logic and functionality
└── README.md       # This documentation
```

### File Organization

- **`index.html`** - Clean HTML structure containing only semantic markup and element structure
- **`styles.css`** - Complete CSS styling including TR-808 themed design, responsive layout, and animations  
- **`app.js`** - Well-organized JavaScript with clear sections:
  - Audio synthesis and Tone.js setup
  - Application state management
  - Style presets with genre-appropriate instrument selections
  - Audio engine and sequencer functions
  - UI controls and event handlers
  - Initialization logic

## Features

- 16-step sequencer with 17 instruments
- Genre-specific style presets (Trap, Drill, Afrobeats, etc.)
- Real-time groove controls (Swing, Humanization, Polyrhythm)
- Pattern save/load functionality
- **MIDI Export** - Export patterns to Standard MIDI Files (.mid)
- Authentic TR-808 sound synthesis
- Responsive design with TR-808 aesthetic
- 100+ inspiration sequences across 10 genres

### MIDI Export Features

The app now supports exporting your drum patterns to MIDI format for use in any Digital Audio Workstation (DAW):

- **Standard MIDI File Export** - Compatible with all major DAWs
- **General MIDI Percussion Mapping** - All instruments mapped to standard GM drum sounds
- **Velocity Preservation** - Volume slider positions become MIDI velocities (0-127)
- **Tempo Accuracy** - Exports with current project tempo
- **Multiple Formats** - Optimized presets for different DAWs
- **Loop Support** - Option to export multiple pattern repetitions

#### MIDI Instrument Mapping (v3.0)

| Instrument | Code | MIDI Note | GM Percussion |
|------------|------|-----------|---------------|
| Bass Drum | `bd` | 36 | Bass Drum 1 |
| Snare Drum | `sd` | 38 | Acoustic Snare |
| Rimshot | `rim` | 37 | Side Stick |
| Hand Clap | `cp` | 39 | Hand Clap |
| Closed Hi-Hat | `ch` | 42 | Closed Hi-Hat |
| Open Hi-Hat | `oh` | 46 | Open Hi-Hat |
| Low Tom | `lt` | 45 | Low Tom |
| Mid Tom | `mt` | 47 | Low-Mid Tom |
| High Tom | `ht` | 50 | High Tom |
| High Conga | `hc` | 63 | Open Hi Conga |
| Mid Conga | `mc` | 62 | Mute Hi Conga |
| Low Conga | `lc` | 64 | Low Conga |
| Crash | `cr` | 49 | Crash Cymbal 1 |
| Cymbal | `cym` | 57 | Crash Cymbal 2 |
| Cowbell | `cb` | 56 | Cowbell |
| Claves | `cl` | 75 | Claves |
| Maracas | `ma` | 70 | Maracas |
| Accent | `accent` | — | No note — per-step velocity tier only |

The `accent` row never emits a MIDI note: it raises the velocity of the other hits on its step (velocity tiers: ghost 45 / normal 100 / accent 127). The authoritative mapping lives in `midi-mapping.js` (v3.0); see `docs/MIDI_MAPPING_MASTER_REFERENCE.md` for full details.

#### How to Export MIDI

1. **Create or load a pattern** using the step sequencer or inspiration sequences
2. **Adjust volume sliders** to set desired velocities for each instrument
3. **Set your tempo** using the tempo knob
4. **Click the MIDI button** to export current pattern
5. **Shift+Click MIDI button** for advanced export options

The exported `.mid` file will be downloaded automatically and can be imported into any DAW for further production work.

## Usage

Simply open `index.html` in a modern web browser. No build process required - this is a pure client-side application using native web technologies.

## Dependencies

- **Tone.js** (v14.8.49) - Audio synthesis and scheduling
- **midi-writer-js** (v3.1.1) - MIDI file generation and export
- **Material Icons** - UI iconography
- **Custom fonts** - Helvetica LT W04 for authentic feel

## Browser Compatibility

Requires a modern browser with Web Audio API support (Chrome, Firefox, Safari, Edge).
