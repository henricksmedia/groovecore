const inspirationSequences = {
  // ===== POP CATEGORY (13 sequences) =====
  "pop_1": {
    name: "Catchy Hook (Authentic TR-808/909 Pop Anthem)",
    category: "Pop",
    bpm: 122,
    sequence: [
      // TR-808 Bass Drum - punchy pop foundation with syncopated hits
      {"instrument": "bass_drum", "beat": 1, "velocity": 115},
      {"instrument": "bass_drum", "beat": 2.5, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3, "velocity": 105},
      {"instrument": "bass_drum", "beat": 4.25, "velocity": 85},
      
      // TR-909 Snare - crisp backbeat with ghost notes for groove
      {"instrument": "snare_drum", "beat": 2, "velocity": 110},
      {"instrument": "snare_drum", "beat": 4, "velocity": 115},
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 50}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 45}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 40}, // Ghost note
      
      // TR-909 Hi-Hat pattern - driving 16th notes with dynamics
      {"instrument": "closed_hihat", "beat": 1, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 60},
      
      // TR-909 Open Hi-Hat - strategic openings for pop energy
      {"instrument": "open_hihat", "beat": 2, "velocity": 95},
      {"instrument": "open_hihat", "beat": 4, "velocity": 100},
      {"instrument": "open_hihat", "beat": 3, "velocity": 85},
      
      // TR-808 Rimshot - percussive pop accents
      {"instrument": "rimshot", "beat": 1.75, "velocity": 75},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 70},
      {"instrument": "rimshot", "beat": 3.25, "velocity": 80},
      
      // TR-808 Cowbell - signature pop hook element
      {"instrument": "cowbell", "beat": 1.5, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 80},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 90},
      
      // TR-808 Claves - rhythmic pop texture
      {"instrument": "claves", "beat": 2.25, "velocity": 75},
      {"instrument": "claves", "beat": 4.25, "velocity": 70},
      
      // TR-808 Toms - melodic pop fills and transitions
      {"instrument": "ht", "beat": 1.25, "velocity": 85},
      {"instrument": "mt", "beat": 2.75, "velocity": 90},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 95},
      {"instrument": "ht", "beat": 4.5, "velocity": 80},
      
      // TR-808 Congas - pop groove enhancement
      {"instrument": "conga_high", "beat": 1, "velocity": 80},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 75},
      {"instrument": "conga_low", "beat": 3.25, "velocity": 85},
      {"instrument": "conga_high", "beat": 4.25, "velocity": 70},
      
      // TR-808 Maracas - subtle pop texture
      {"instrument": "ma", "beat": 1.75, "velocity": 65},
      {"instrument": "ma", "beat": 3.25, "velocity": 70},
      {"instrument": "ma", "beat": 4.75, "velocity": 60},
      
      // TR-909 Crash Cymbal - section emphasis and energy
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 105},
      {"instrument": "cym", "beat": 3, "velocity": 90},
      
      // TR-808 Accent - dynamic pop emphasis
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 3.5, "velocity": 85}
    ]
  },
  "pop_2": {
    name: "Upbeat Anthem (Authentic TR-808/909 Festival Energy)",
    category: "Pop",
    bpm: 125,
    sequence: [
      // TR-808 Bass Drum - powerful anthem foundation with bounce
      {"instrument": "bass_drum", "beat": 1, "velocity": 120},
      {"instrument": "bass_drum", "beat": 2, "velocity": 105},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "bass_drum", "beat": 4, "velocity": 100},
      {"instrument": "bass_drum", "beat": 2.25, "velocity": 90}, // Syncopated bounce
      {"instrument": "bass_drum", "beat": 4.5, "velocity": 95}, // Syncopated bounce
      
      // TR-909 Snare - anthemic backbeat with power
      {"instrument": "snare_drum", "beat": 2, "velocity": 120},
      {"instrument": "snare_drum", "beat": 4, "velocity": 125},
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 55}, // Ghost note
      {"instrument": "snare_drum", "beat": 2.75, "velocity": 50}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 60}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 65}, // Roll buildup
      {"instrument": "snare_drum", "beat": 4.85, "velocity": 50}, // Roll buildup
      
      // TR-909 Hi-Hat - energetic anthem pattern
      {"instrument": "closed_hihat", "beat": 1, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 60},
      
      // TR-909 Open Hi-Hat - anthem energy peaks
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 100},
      {"instrument": "open_hihat", "beat": 2, "velocity": 110},
      {"instrument": "open_hihat", "beat": 3, "velocity": 95},
      {"instrument": "open_hihat", "beat": 4, "velocity": 115},
      
      // TR-808 Cowbell - signature anthem hook
      {"instrument": "cowbell", "beat": 1.25, "velocity": 95},
      {"instrument": "cowbell", "beat": 2.5, "velocity": 90},
      {"instrument": "cowbell", "beat": 3.75, "velocity": 100},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 85},
      
      // TR-808 Claves - rhythmic anthem texture
      {"instrument": "claves", "beat": 1.75, "velocity": 85},
      {"instrument": "claves", "beat": 2.25, "velocity": 80},
      {"instrument": "claves", "beat": 3.25, "velocity": 90},
      {"instrument": "claves", "beat": 4.75, "velocity": 75},
      
      // TR-808 Toms - powerful anthem fills
      {"instrument": "ht", "beat": 1, "velocity": 95},
      {"instrument": "ht", "beat": 2.75, "velocity": 90},
      {"instrument": "ht", "beat": 4.25, "velocity": 100},
      {"instrument": "mt", "beat": 1.5, "velocity": 100},
      {"instrument": "mt", "beat": 3.25, "velocity": 95},
      {"instrument": "mt", "beat": 4.5, "velocity": 105},
      {"instrument": "tom_low", "beat": 2.25, "velocity": 110},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 105},
      
      // TR-808 Rimshot - anthem percussion drive
      {"instrument": "rimshot", "beat": 1.5, "velocity": 85},
      {"instrument": "rimshot", "beat": 2.25, "velocity": 80},
      {"instrument": "rimshot", "beat": 3.5, "velocity": 90},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 75},
      
      // TR-808 Congas - anthem groove layers
      {"instrument": "conga_high", "beat": 1.25, "velocity": 90},
      {"instrument": "conga_high", "beat": 3.5, "velocity": 85},
      {"instrument": "conga_mid", "beat": 1.75, "velocity": 80},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 95},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 90},
      {"instrument": "conga_low", "beat": 2, "velocity": 100},
      {"instrument": "conga_low", "beat": 3.25, "velocity": 95},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 105},
      
      // TR-808 Maracas - anthem energy texture
      {"instrument": "ma", "beat": 1.5, "velocity": 75},
      {"instrument": "ma", "beat": 2.25, "velocity": 80},
      {"instrument": "ma", "beat": 3, "velocity": 70},
      {"instrument": "ma", "beat": 4.5, "velocity": 85},
      
      // TR-909 Cymbals - anthem section markers
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 110},
      {"instrument": "cym", "beat": 2.5, "velocity": 100},
      {"instrument": "cym", "beat": 4.25, "velocity": 95},
      
      // TR-808 Accent - anthem dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 120}
    ]
  },
  "pop_3": {
    name: "Emotional Ballad (Authentic TR-808/909 Heartfelt Groove)",
    category: "Pop",
    bpm: 75,
    sequence: [
      // TR-808 Bass Drum - sparse emotional foundation with gentle power
      {"instrument": "bass_drum", "beat": 1, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3, "velocity": 90},
      {"instrument": "bass_drum", "beat": 4.5, "velocity": 80}, // Emotional emphasis
      
      // TR-909 Snare - tender backbeat with subtle ghost notes
      {"instrument": "snare_drum", "beat": 2, "velocity": 85},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 35}, // Soft ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 40}, // Soft ghost note
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 30}, // Whisper ghost note
      
      // TR-909 Hi-Hat - gentle emotional texture
      {"instrument": "closed_hihat", "beat": 1, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 45},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 50},
      
      // TR-909 Open Hi-Hat - emotional breathing spaces
      {"instrument": "open_hihat", "beat": 2.25, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 80},
      {"instrument": "open_hihat", "beat": 3.75, "velocity": 65},
      
      // TR-808 Rimshot - subtle emotional accents
      {"instrument": "rimshot", "beat": 1.5, "velocity": 60},
      {"instrument": "rimshot", "beat": 3.25, "velocity": 65},
      {"instrument": "rimshot", "beat": 4.75, "velocity": 55},
      
      // TR-808 Cowbell - gentle emotional texture
      {"instrument": "cowbell", "beat": 2.5, "velocity": 65},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 70},
      
      // TR-808 Claves - soft rhythmic emotion
      {"instrument": "claves", "beat": 1.25, "velocity": 60},
      {"instrument": "claves", "beat": 3.75, "velocity": 55},
      
      // TR-808 Toms - emotional melodic fills
      {"instrument": "ht", "beat": 2.75, "velocity": 70},
      {"instrument": "ht", "beat": 4.5, "velocity": 65},
      {"instrument": "mt", "beat": 1.25, "velocity": 75},
      {"instrument": "mt", "beat": 3.25, "velocity": 80},
      {"instrument": "tom_low", "beat": 2.25, "velocity": 85},
      {"instrument": "tom_low", "beat": 4.75, "velocity": 75},
      
      // TR-808 Congas - emotional warmth and depth
      {"instrument": "conga_high", "beat": 1.75, "velocity": 70},
      {"instrument": "conga_high", "beat": 3.5, "velocity": 65},
      {"instrument": "conga_mid", "beat": 2, "velocity": 75},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 80},
      {"instrument": "conga_low", "beat": 1.5, "velocity": 85},
      {"instrument": "conga_low", "beat": 3.75, "velocity": 80},
      
      // TR-808 Maracas - gentle emotional shimmer
      {"instrument": "ma", "beat": 1.25, "velocity": 55},
      {"instrument": "ma", "beat": 2.75, "velocity": 60},
      {"instrument": "ma", "beat": 4.25, "velocity": 50},
      
      // TR-909 Cymbals - emotional crescendo markers
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 90},
      {"instrument": "crash_cymbal", "beat": 4, "velocity": 100},
      {"instrument": "cym", "beat": 2.5, "velocity": 75},
      
      // TR-808 Accent - emotional dynamic peaks
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 85},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 3.5, "velocity": 70}
    ]
  },
  "pop_4": {
    name: "Dancefloor Pop (Authentic TR-808/909 Club Energy)",
    category: "Pop",
    bpm: 126,
    sequence: [
      // TR-808 Bass Drum - driving dancefloor foundation with club punch
      {"instrument": "bass_drum", "beat": 1, "velocity": 118},
      {"instrument": "bass_drum", "beat": 2, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "bass_drum", "beat": 4, "velocity": 108},
      {"instrument": "bass_drum", "beat": 1.25, "velocity": 95}, // Dancefloor kick variation
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 100}, // Dancefloor kick variation
      
      // TR-909 Snare - crisp dancefloor backbeat with club snap
      {"instrument": "snare_drum", "beat": 2, "velocity": 115},
      {"instrument": "snare_drum", "beat": 4, "velocity": 120},
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 55}, // Ghost note
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 50}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 60}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.25, "velocity": 45}, // Ghost note
      
      // TR-909 Hi-Hat - dancefloor 16th note groove with club dynamics
      {"instrument": "closed_hihat", "beat": 1, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 75},
      
      // TR-909 Open Hi-Hat - dancefloor energy release
      {"instrument": "open_hihat", "beat": 2, "velocity": 100},
      {"instrument": "open_hihat", "beat": 2.5, "velocity": 90},
      {"instrument": "open_hihat", "beat": 4, "velocity": 110},
      {"instrument": "open_hihat", "beat": 3.25, "velocity": 85},
      
      // TR-808 Cowbell - dancefloor hook signature
      {"instrument": "cowbell", "beat": 1.5, "velocity": 90},
      {"instrument": "cowbell", "beat": 2.75, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 95},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 80},
      
      // TR-808 Claves - dancefloor rhythmic texture
      {"instrument": "claves", "beat": 1.75, "velocity": 80},
      {"instrument": "claves", "beat": 2.25, "velocity": 85},
      {"instrument": "claves", "beat": 3.25, "velocity": 75},
      {"instrument": "claves", "beat": 4.75, "velocity": 90},
      
      // TR-808 Toms - dancefloor fill sequences
      {"instrument": "ht", "beat": 1.25, "velocity": 90},
      {"instrument": "ht", "beat": 3, "velocity": 95},
      {"instrument": "ht", "beat": 4.5, "velocity": 85},
      {"instrument": "mt", "beat": 1.75, "velocity": 95},
      {"instrument": "mt", "beat": 2.5, "velocity": 100},
      {"instrument": "mt", "beat": 4.25, "velocity": 90},
      {"instrument": "tom_low", "beat": 2.25, "velocity": 105},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 100},
      
      // TR-808 Rimshot - dancefloor percussion accents
      {"instrument": "rimshot", "beat": 1.5, "velocity": 85},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 80},
      {"instrument": "rimshot", "beat": 3.5, "velocity": 90},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 75},
      
      // TR-808 Congas - dancefloor groove layers
      {"instrument": "conga_high", "beat": 1.25, "velocity": 85},
      {"instrument": "conga_high", "beat": 2.5, "velocity": 90},
      {"instrument": "conga_high", "beat": 4.25, "velocity": 80},
      {"instrument": "conga_mid", "beat": 1.75, "velocity": 80},
      {"instrument": "conga_mid", "beat": 3.25, "velocity": 95},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 85},
      {"instrument": "conga_low", "beat": 2, "velocity": 100},
      {"instrument": "conga_low", "beat": 3.5, "velocity": 95},
      
      // TR-808 Maracas - dancefloor energy shimmer
      {"instrument": "ma", "beat": 1.5, "velocity": 70},
      {"instrument": "ma", "beat": 2.25, "velocity": 75},
      {"instrument": "ma", "beat": 3.75, "velocity": 65},
      {"instrument": "ma", "beat": 4.5, "velocity": 80},
      
      // TR-909 Cymbals - dancefloor section emphasis
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 105},
      {"instrument": "cym", "beat": 2.5, "velocity": 95},
      {"instrument": "cym", "beat": 4.5, "velocity": 100},
      
      // TR-808 Accent - dancefloor dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 115}
    ]
  },
  "pop_5": {
    name: "Viral Hit Groove (Authentic TR-808/909 TikTok Ready)",
    category: "Pop",
    bpm: 105,
    sequence: [
      // TR-808 Bass Drum - viral hook foundation with off-kilter bounce
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 95},
      {"instrument": "bass_drum", "beat": 4.5, "velocity": 85},
      
      // TR-909 Snare - viral backbeat with experimental timing
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 105},
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 85}, // Off-beat snare
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 80}, // Off-beat snare
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 40}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 35}, // Ghost note
      
      // TR-909 Hi-Hat - viral groove pattern with experimental gaps
      {"instrument": "closed_hihat", "beat": 1, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 70},
      
      // TR-909 Open Hi-Hat - viral accent placement
      {"instrument": "open_hihat", "beat": 1.75, "velocity": 90},
      {"instrument": "open_hihat", "beat": 3, "velocity": 95},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 85},
      
      // TR-808 Cowbell - viral hook signature element
      {"instrument": "cowbell", "beat": 1.25, "velocity": 80},
      {"instrument": "cowbell", "beat": 2.5, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.75, "velocity": 75},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 90},
      
      // TR-808 Claves - viral percussive hook
      {"instrument": "claves", "beat": 1.5, "velocity": 75},
      {"instrument": "claves", "beat": 3.25, "velocity": 80},
      {"instrument": "claves", "beat": 4.5, "velocity": 70},
      
      // TR-808 Toms - viral melodic fills
      {"instrument": "ht", "beat": 2.25, "velocity": 85},
      {"instrument": "ht", "beat": 4.25, "velocity": 80},
      {"instrument": "mt", "beat": 1.75, "velocity": 90},
      {"instrument": "mt", "beat": 3.5, "velocity": 95},
      {"instrument": "tom_low", "beat": 2.5, "velocity": 100},
      {"instrument": "tom_low", "beat": 4.75, "velocity": 85},
      
      // TR-808 Rimshot - viral percussive texture
      {"instrument": "rimshot", "beat": 1, "velocity": 80},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 75},
      {"instrument": "rimshot", "beat": 4, "velocity": 85},
      
      // TR-808 Congas - viral groove depth
      {"instrument": "conga_high", "beat": 1.25, "velocity": 85},
      {"instrument": "conga_high", "beat": 3.75, "velocity": 80},
      {"instrument": "conga_mid", "beat": 2, "velocity": 90},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 85},
      {"instrument": "conga_low", "beat": 1.5, "velocity": 95},
      {"instrument": "conga_low", "beat": 3.25, "velocity": 90},
      
      // TR-808 Maracas - viral texture shimmer
      {"instrument": "ma", "beat": 1.75, "velocity": 65},
      {"instrument": "ma", "beat": 3, "velocity": 70},
      {"instrument": "ma", "beat": 4.5, "velocity": 60},
      
      // TR-909 Cymbals - viral impact moments
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 100},
      {"instrument": "crash_cymbal", "beat": 3.5, "velocity": 95},
      {"instrument": "cym", "beat": 2.25, "velocity": 85},
      {"instrument": "cym", "beat": 4.75, "velocity": 90},
      
      // TR-808 Accent - viral dynamic peaks
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 3.25, "velocity": 85}
    ]
  },
  "pop_6": {
    name: "Synth-Pop Fusion (Authentic TR-808/909 Retro-Future)",
    category: "Pop",
    bpm: 118,
    sequence: [
      // TR-808 Bass Drum - synth-pop foundation with retro punch
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "bass_drum", "beat": 2, "velocity": 100},
      {"instrument": "bass_drum", "beat": 3, "velocity": 105},
      {"instrument": "bass_drum", "beat": 4, "velocity": 95},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 85}, // Synth-pop syncopation
      
      // TR-909 Snare - crisp digital backbeat with synthetic character
      {"instrument": "snare_drum", "beat": 2, "velocity": 115},
      {"instrument": "snare_drum", "beat": 4, "velocity": 120},
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 45}, // Digital ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 50}, // Digital ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 40}, // Digital ghost note
      
      // TR-909 Hi-Hat - synthetic 16th note patterns
      {"instrument": "closed_hihat", "beat": 1, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
      
      // TR-909 Open Hi-Hat - retro-future atmosphere
      {"instrument": "open_hihat", "beat": 1.75, "velocity": 95},
      {"instrument": "open_hihat", "beat": 2, "velocity": 105},
      {"instrument": "open_hihat", "beat": 3, "velocity": 90},
      {"instrument": "open_hihat", "beat": 4, "velocity": 110},
      
      // TR-808 Cowbell - signature synth-pop metallic element
      {"instrument": "cowbell", "beat": 1.5, "velocity": 90},
      {"instrument": "cowbell", "beat": 2.25, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 95},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 80},
      
      // TR-808 Claves - synthetic percussive texture
      {"instrument": "claves", "beat": 1.25, "velocity": 80},
      {"instrument": "claves", "beat": 2.75, "velocity": 75},
      {"instrument": "claves", "beat": 4.25, "velocity": 85},
      
      // TR-808 Toms - synth-pop melodic sequences
      {"instrument": "ht", "beat": 1.75, "velocity": 90},
      {"instrument": "ht", "beat": 3.25, "velocity": 85},
      {"instrument": "ht", "beat": 4.75, "velocity": 95},
      {"instrument": "mt", "beat": 1.25, "velocity": 95},
      {"instrument": "mt", "beat": 2.5, "velocity": 100},
      {"instrument": "mt", "beat": 4.25, "velocity": 90},
      {"instrument": "tom_low", "beat": 2.75, "velocity": 105},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 100},
      
      // TR-808 Rimshot - digital percussion accents
      {"instrument": "rimshot", "beat": 1, "velocity": 85},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 80},
      {"instrument": "rimshot", "beat": 3.75, "velocity": 90},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 75},
      
      // TR-808 Congas - warm analog contrast to digital elements
      {"instrument": "conga_high", "beat": 1.5, "velocity": 85},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 80},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 90},
      {"instrument": "conga_mid", "beat": 4, "velocity": 95},
      {"instrument": "conga_low", "beat": 1.75, "velocity": 100},
      {"instrument": "conga_low", "beat": 3.5, "velocity": 95},
      
      // TR-808 Maracas - retro-future shimmer
      {"instrument": "ma", "beat": 1.25, "velocity": 70},
      {"instrument": "ma", "beat": 2.75, "velocity": 75},
      {"instrument": "ma", "beat": 4.25, "velocity": 65},
      
      // TR-909 Cymbals - synthetic impact and atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 105},
      {"instrument": "cym", "beat": 2.5, "velocity": 95},
      {"instrument": "cym", "beat": 4.5, "velocity": 100},
      
      // TR-808 Accent - synthetic dynamic emphasis
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 110}
    ]
  },
  "pop_7": {
    name: "Empowering Chorus (Authentic TR-808/909 Inspirational Drive)",
    category: "Pop",
    bpm: 115,
    sequence: [
      // TR-808 Bass Drum - empowering foundation with motivational punch
      {"instrument": "bass_drum", "beat": 1, "velocity": 115},
      {"instrument": "bass_drum", "beat": 2, "velocity": 105},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "bass_drum", "beat": 4, "velocity": 100},
      {"instrument": "bass_drum", "beat": 1.75, "velocity": 90}, // Empowering accent
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 95}, // Empowering accent
      
      // TR-909 Snare - powerful empowering backbeat
      {"instrument": "snare_drum", "beat": 2, "velocity": 118},
      {"instrument": "snare_drum", "beat": 4, "velocity": 122},
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 55}, // Building ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 60}, // Building ghost note
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 70}, // Power buildup
      
      // TR-909 Hi-Hat - empowering drive pattern
      {"instrument": "closed_hihat", "beat": 1, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 95},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 85},
      
      // TR-909 Open Hi-Hat - empowering crescendo moments
      {"instrument": "open_hihat", "beat": 2, "velocity": 100},
      {"instrument": "open_hihat", "beat": 4, "velocity": 110},
      {"instrument": "open_hihat", "beat": 3.5, "velocity": 95},
      
      // TR-808 Cowbell - empowering signature hook
      {"instrument": "cowbell", "beat": 1.5, "velocity": 90},
      {"instrument": "cowbell", "beat": 2.75, "velocity": 95},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 85},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 100},
      
      // TR-808 Claves - empowering rhythmic drive
      {"instrument": "claves", "beat": 1.25, "velocity": 85},
      {"instrument": "claves", "beat": 2.5, "velocity": 80},
      {"instrument": "claves", "beat": 3.75, "velocity": 90},
      
      // TR-808 Toms - empowering melodic builds
      {"instrument": "ht", "beat": 1.75, "velocity": 95},
      {"instrument": "ht", "beat": 3.25, "velocity": 100},
      {"instrument": "ht", "beat": 4.5, "velocity": 90},
      {"instrument": "mt", "beat": 1.5, "velocity": 100},
      {"instrument": "mt", "beat": 2.25, "velocity": 105},
      {"instrument": "mt", "beat": 4, "velocity": 95},
      {"instrument": "tom_low", "beat": 2.75, "velocity": 110},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 105},
      
      // TR-808 Rimshot - empowering percussion power
      {"instrument": "rimshot", "beat": 1.25, "velocity": 85},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 90},
      {"instrument": "rimshot", "beat": 3.75, "velocity": 80},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 95},
      
      // TR-808 Congas - empowering groove layers
      {"instrument": "conga_high", "beat": 1, "velocity": 90},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 85},
      {"instrument": "conga_mid", "beat": 1.75, "velocity": 95},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 100},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 90},
      {"instrument": "conga_low", "beat": 2, "velocity": 105},
      {"instrument": "conga_low", "beat": 3.5, "velocity": 100},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 110},
      
      // TR-808 Maracas - empowering energy texture
      {"instrument": "ma", "beat": 1.25, "velocity": 75},
      {"instrument": "ma", "beat": 2.75, "velocity": 80},
      {"instrument": "ma", "beat": 4.25, "velocity": 70},
      
      // TR-909 Cymbals - empowering climax markers
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 110},
      {"instrument": "crash_cymbal", "beat": 4.5, "velocity": 120},
      {"instrument": "cym", "beat": 2.25, "velocity": 100},
      {"instrument": "cym", "beat": 4.75, "velocity": 105},
      
      // TR-808 Accent - empowering dynamic peaks
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 120}
    ]
  },
  "pop_8": {
    name: "Retro Vibes (Authentic TR-808/909 Nostalgic Groove)",
    category: "Pop",
    bpm: 108,
    sequence: [
      // TR-808 Bass Drum - nostalgic foundation with retro spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "bass_drum", "beat": 3, "velocity": 95},
      {"instrument": "bass_drum", "beat": 4.25, "velocity": 85},
      
      // TR-909 Snare - retro backbeat with vintage character
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4, "velocity": 100},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 45}, // Vintage ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 40}, // Vintage ghost note
      
      // TR-909 Hi-Hat - retro pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 75},
      
      // TR-909 Open Hi-Hat - nostalgic accents with space
      {"instrument": "open_hihat", "beat": 2, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4, "velocity": 90},
      
      // TR-808 Cowbell - retro signature element
      {"instrument": "cowbell", "beat": 1.25, "velocity": 80},
      {"instrument": "cowbell", "beat": 3.75, "velocity": 85},
      
      // TR-808 Claves - vintage percussive texture
      {"instrument": "claves", "beat": 2.25, "velocity": 70},
      {"instrument": "claves", "beat": 4.75, "velocity": 75},
      
      // TR-808 Toms - retro melodic fills with space
      {"instrument": "ht", "beat": 2.75, "velocity": 85},
      {"instrument": "mt", "beat": 1.25, "velocity": 90},
      {"instrument": "mt", "beat": 3.75, "velocity": 85},
      {"instrument": "tom_low", "beat": 4.5, "velocity": 95},
      
      // TR-808 Rimshot - vintage percussion accents
      {"instrument": "rimshot", "beat": 1.5, "velocity": 75},
      {"instrument": "rimshot", "beat": 3.25, "velocity": 80},
      
      // TR-808 Congas - retro warmth and depth
      {"instrument": "conga_high", "beat": 1.75, "velocity": 80},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 85},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 80},
      {"instrument": "conga_low", "beat": 3, "velocity": 90},
      
      // TR-808 Maracas - nostalgic shimmer with breathing room
      {"instrument": "ma", "beat": 2.25, "velocity": 65},
      {"instrument": "ma", "beat": 4.75, "velocity": 70},
      
      // TR-909 Cymbals - retro impact with vintage spacing
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 105},
      {"instrument": "cym", "beat": 3.5, "velocity": 90},
      
      // TR-808 Accent - nostalgic dynamic emphasis
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 100}
    ]
  },
  "pop_9": {
    name: "Heartbreak Pulse (Authentic TR-808/909 Melancholic Beat)",
    category: "Pop",
    bpm: 95,
    sequence: [
      // TR-808 Bass Drum - melancholic foundation with emotional spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 85},
      
      // TR-909 Snare - heartbreak backbeat with vulnerable character
      {"instrument": "snare_drum", "beat": 2, "velocity": 85},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 35}, // Vulnerable ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 30}, // Vulnerable ghost note
      
      // TR-909 Hi-Hat - melancholic pattern with emotional gaps
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 55},
      
      // TR-909 Open Hi-Hat - heartbreak breathing spaces
      {"instrument": "open_hihat", "beat": 2.5, "velocity": 75},
      {"instrument": "open_hihat", "beat": 4.75, "velocity": 80},
      
      // TR-808 Cowbell - subtle melancholic texture
      {"instrument": "cowbell", "beat": 3.5, "velocity": 70},
      
      // TR-808 Claves - sparse emotional accents
      {"instrument": "claves", "beat": 2.25, "velocity": 65},
      {"instrument": "claves", "beat": 4.5, "velocity": 60},
      
      // TR-808 Toms - heartbreak melodic fills with space
      {"instrument": "ht", "beat": 1.75, "velocity": 75},
      {"instrument": "mt", "beat": 3.5, "velocity": 80},
      {"instrument": "tom_low", "beat": 4.25, "velocity": 85},
      
      // TR-808 Rimshot - melancholic percussion touches
      {"instrument": "rimshot", "beat": 1.25, "velocity": 70},
      {"instrument": "rimshot", "beat": 3.75, "velocity": 65},
      
      // TR-808 Congas - heartbreak warmth with emotional depth
      {"instrument": "conga_high", "beat": 2.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 1.5, "velocity": 80},
      {"instrument": "conga_mid", "beat": 4, "velocity": 85},
      {"instrument": "conga_low", "beat": 3.25, "velocity": 90},
      
      // TR-808 Maracas - gentle melancholic shimmer
      {"instrument": "ma", "beat": 2.5, "velocity": 55},
      {"instrument": "ma", "beat": 4.75, "velocity": 60},
      
      // TR-909 Cymbals - heartbreak impact with emotional spacing
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 95},
      {"instrument": "cym", "beat": 4, "velocity": 85},
      
      // TR-808 Accent - melancholic dynamic emphasis
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 80},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 90}
    ]
  },
  "pop_10": {
    name: "Summer Jam (Authentic TR-808/909 Summer Groove)",
    category: "Pop",
    bpm: 108,
    sequence: [
      // TR-808 Bass Drum foundation - syncopated summer feel
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 95},
      
      // TR-909 Snare - backbeat with ghost notes
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 105},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 45}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 40}, // Ghost note
      
      // TR-909 Closed Hi-Hat - driving 16th note pattern
      {"instrument": "closed_hihat", "beat": 1, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 55},
      
      // TR-909 Open Hi-Hat - strategic openings for groove
      {"instrument": "open_hihat", "beat": 2, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4, "velocity": 90},
      {"instrument": "open_hihat", "beat": 3.5, "velocity": 70},
      
      // TR-808 Cowbell - authentic summer funk element
      {"instrument": "cowbell", "beat": 1.5, "velocity": 80},
      {"instrument": "cowbell", "beat": 2.5, "velocity": 75},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 85},
      
      // TR-808 Claves - Latin summer percussion
      {"instrument": "claves", "beat": 2.25, "velocity": 70},
      {"instrument": "claves", "beat": 3.75, "velocity": 65},
      
      // TR-808 Maracas - continuous summer shake
      {"instrument": "ma", "beat": 1.25, "velocity": 60},
      {"instrument": "ma", "beat": 2.75, "velocity": 65},
      {"instrument": "ma", "beat": 4.25, "velocity": 70},
      
      // TR-808 Toms - melodic fills
      {"instrument": "ht", "beat": 3.75, "velocity": 80},
      {"instrument": "mt", "beat": 4, "velocity": 75},
      {"instrument": "tom_low", "beat": 4.25, "velocity": 85},
      
      // TR-808 Rimshot - percussive accents
      {"instrument": "rimshot", "beat": 1.25, "velocity": 65},
      {"instrument": "rimshot", "beat": 3.25, "velocity": 70},
      
      // TR-909 Crash Cymbal - section emphasis
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 95},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 85},
      
      // TR-808 Congas - tropical summer flavor
      {"instrument": "conga_high", "beat": 1.5, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2.75, "velocity": 70},
      {"instrument": "conga_low", "beat": 4.5, "velocity": 80},
      
      // TR-808 Accent - dynamic emphasis
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 90},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
    ]
  },

  "pop_11": {
    name: "Summer Jam Variation (TR-808/909 Tropical Groove)",
    category: "Pop", 
    bpm: 115,
    sequence: [
      // TR-808 Bass Drum - four-on-the-floor with syncopation
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "bass_drum", "beat": 2, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},
      {"instrument": "bass_drum", "beat": 4, "velocity": 90},
      {"instrument": "bass_drum", "beat": 2.5, "velocity": 75}, // Syncopated kick
      
      // TR-909 Snare - crisp backbeat with flams
      {"instrument": "snare_drum", "beat": 2, "velocity": 110},
      {"instrument": "snare_drum", "beat": 4, "velocity": 115},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 60}, // Flam
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 65}, // Flam
      
      // TR-909 Hi-Hat pattern - alternating closed/open
      {"instrument": "closed_hihat", "beat": 1, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 70},
      
      {"instrument": "open_hihat", "beat": 1.25, "velocity": 80},
      {"instrument": "open_hihat", "beat": 2.75, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 75},
      
      // TR-808 Percussion ensemble - tropical flavor
      {"instrument": "cowbell", "beat": 1, "velocity": 85},
      {"instrument": "cowbell", "beat": 2.25, "velocity": 70},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 80},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 75},
      
      {"instrument": "claves", "beat": 1.75, "velocity": 75},
      {"instrument": "claves", "beat": 3.25, "velocity": 70},
      {"instrument": "claves", "beat": 4.25, "velocity": 80},
      
      // TR-808 Maracas - rhythmic shaker pattern
      {"instrument": "ma", "beat": 1.5, "velocity": 65},
      {"instrument": "ma", "beat": 2, "velocity": 70},
      {"instrument": "ma", "beat": 3, "velocity": 60},
      {"instrument": "ma", "beat": 4, "velocity": 75},
      
      // TR-808 Tom sequence - melodic percussion
      {"instrument": "ht", "beat": 1.5, "velocity": 85},
      {"instrument": "mt", "beat": 2.25, "velocity": 80},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 90},
      
      // TR-808 Congas - authentic Latin percussion
      {"instrument": "conga_high", "beat": 1.25, "velocity": 80},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2, "velocity": 70},
      {"instrument": "conga_mid", "beat": 4, "velocity": 85},
      {"instrument": "conga_low", "beat": 1.75, "velocity": 90},
      {"instrument": "conga_low", "beat": 3.5, "velocity": 85},
      
      // TR-808 Rimshot - percussive texture
      {"instrument": "rimshot", "beat": 2.5, "velocity": 70},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 75},
      
      // TR-909 Cymbal - section markers
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 100},
      {"instrument": "cym", "beat": 3, "velocity": 85},
      
      // TR-808 Accent - dynamic peaks
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 100}
    ]
  },

  "pop_12": {
    name: "Catchy Hook Variation (TR-808/909 Dance Pop)",
    category: "Pop",
    bpm: 128,
    sequence: [
      // TR-808 Bass Drum - dance-pop four-on-the-floor with accents
      {"instrument": "bass_drum", "beat": 1, "velocity": 120},
      {"instrument": "bass_drum", "beat": 2, "velocity": 100},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "bass_drum", "beat": 4, "velocity": 95},
      {"instrument": "bass_drum", "beat": 1.75, "velocity": 80}, // Syncopated accent
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 85}, // Syncopated accent
      
      // TR-909 Snare - dance backbeat with rolls
      {"instrument": "snare_drum", "beat": 2, "velocity": 115},
      {"instrument": "snare_drum", "beat": 4, "velocity": 120},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 55}, // Ghost note
      {"instrument": "snare_drum", "beat": 2.75, "velocity": 50}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 60}, // Roll effect
      {"instrument": "snare_drum", "beat": 4.85, "velocity": 45}, // Roll effect
      
      // TR-909 Hi-Hat - complex dance pattern
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
      
      // TR-909 Open Hi-Hat - dance energy bursts
      {"instrument": "open_hihat", "beat": 1, "velocity": 90},
      {"instrument": "open_hihat", "beat": 2.5, "velocity": 100},
      {"instrument": "open_hihat", "beat": 3, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 95},
      
      // TR-808 Cowbell - dance hook signature
      {"instrument": "cowbell", "beat": 1.25, "velocity": 90},
      {"instrument": "cowbell", "beat": 2.75, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.75, "velocity": 95},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 80},
      
      // TR-808 Claves - percussive dance texture
      {"instrument": "claves", "beat": 1.5, "velocity": 80},
      {"instrument": "claves", "beat": 2.25, "velocity": 75},
      {"instrument": "claves", "beat": 3.5, "velocity": 85},
      {"instrument": "claves", "beat": 4.75, "velocity": 70},
      
      // TR-808 Toms - dance fill sequences
      {"instrument": "ht", "beat": 1.5, "velocity": 90},
      {"instrument": "ht", "beat": 2.25, "velocity": 85},
      {"instrument": "mt", "beat": 3.25, "velocity": 95},
      {"instrument": "mt", "beat": 4.25, "velocity": 80},
      {"instrument": "tom_low", "beat": 2.75, "velocity": 100},
      {"instrument": "tom_low", "beat": 4.5, "velocity": 90},
      
      // TR-808 Rimshot - dance percussion accents
      {"instrument": "rimshot", "beat": 1.25, "velocity": 80},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 75},
      {"instrument": "rimshot", "beat": 3.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4.25, "velocity": 70},
      
      // TR-808 Congas - dance groove layers
      {"instrument": "conga_high", "beat": 1.75, "velocity": 85},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 80},
      {"instrument": "conga_mid", "beat": 1.5, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2.75, "velocity": 90},
      {"instrument": "conga_mid", "beat": 4.5, "velocity": 85},
      {"instrument": "conga_low", "beat": 2.25, "velocity": 95},
      {"instrument": "conga_low", "beat": 3.75, "velocity": 90},
      
      // TR-808 Maracas - dance shimmer
      {"instrument": "ma", "beat": 1.25, "velocity": 70},
      {"instrument": "ma", "beat": 2.5, "velocity": 75},
      {"instrument": "ma", "beat": 3.25, "velocity": 65},
      {"instrument": "ma", "beat": 4.75, "velocity": 80},
      
      // TR-909 Cymbals - dance section markers
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 100},
      {"instrument": "cym", "beat": 2.5, "velocity": 95},
      {"instrument": "cym", "beat": 4.25, "velocity": 90},
      
      // TR-808 Accent - dance dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 115}
    ]
  },

  "pop_13": {
    name: "Upbeat Anthem Variation (TR-808/909 Stadium Energy)",
    category: "Pop",
    bpm: 130,
    sequence: [
      // TR-808 Bass Drum - stadium four-on-the-floor with power hits
      {"instrument": "bass_drum", "beat": 1, "velocity": 125},
      {"instrument": "bass_drum", "beat": 2, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3, "velocity": 120},
      {"instrument": "bass_drum", "beat": 4, "velocity": 105},
      {"instrument": "bass_drum", "beat": 1.5, "velocity": 95}, // Stadium bounce
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 100}, // Stadium bounce
      
      // TR-909 Snare - stadium backbeat with explosive power
      {"instrument": "snare_drum", "beat": 2, "velocity": 125},
      {"instrument": "snare_drum", "beat": 4, "velocity": 127},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 60}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 55}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 70}, // Power roll
      {"instrument": "snare_drum", "beat": 4.65, "velocity": 60}, // Power roll
      {"instrument": "snare_drum", "beat": 4.8, "velocity": 50}, // Power roll
      
      // TR-909 Hi-Hat - stadium crowd energy pattern
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
      
      // TR-909 Open Hi-Hat - stadium atmosphere
      {"instrument": "open_hihat", "beat": 1, "velocity": 105},
      {"instrument": "open_hihat", "beat": 2.5, "velocity": 115},
      {"instrument": "open_hihat", "beat": 3, "velocity": 100},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 120},
      
      // TR-808 Cowbell - stadium anthem signature
      {"instrument": "cowbell", "beat": 1.5, "velocity": 100},
      {"instrument": "cowbell", "beat": 2.25, "velocity": 95},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 105},
      {"instrument": "cowbell", "beat": 4, "velocity": 90},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 110},
      
      // TR-808 Claves - stadium rhythmic drive
      {"instrument": "claves", "beat": 1.25, "velocity": 90},
      {"instrument": "claves", "beat": 2.75, "velocity": 85},
      {"instrument": "claves", "beat": 3.75, "velocity": 95},
      {"instrument": "claves", "beat": 4.5, "velocity": 80},
      
      // TR-808 Toms - stadium fill explosions
      {"instrument": "ht", "beat": 1.75, "velocity": 100},
      {"instrument": "ht", "beat": 3.25, "velocity": 105},
      {"instrument": "ht", "beat": 4.25, "velocity": 95},
      {"instrument": "mt", "beat": 1.25, "velocity": 105},
      {"instrument": "mt", "beat": 2.5, "velocity": 110},
      {"instrument": "mt", "beat": 4, "velocity": 100},
      {"instrument": "tom_low", "beat": 1.5, "velocity": 115},
      {"instrument": "tom_low", "beat": 2.75, "velocity": 110},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 120},
      
      // TR-808 Rimshot - stadium percussion power
      {"instrument": "rimshot", "beat": 1, "velocity": 90},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 85},
      {"instrument": "rimshot", "beat": 3.75, "velocity": 95},
      {"instrument": "rimshot", "beat": 4.25, "velocity": 80},
      
      // TR-808 Congas - stadium groove complexity
      {"instrument": "conga_high", "beat": 1.5, "velocity": 95},
      {"instrument": "conga_high", "beat": 2.75, "velocity": 90},
      {"instrument": "conga_high", "beat": 4.5, "velocity": 100},
      {"instrument": "conga_mid", "beat": 1.25, "velocity": 85},
      {"instrument": "conga_mid", "beat": 3, "velocity": 100},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 95},
      {"instrument": "conga_low", "beat": 1.75, "velocity": 110},
      {"instrument": "conga_low", "beat": 2.25, "velocity": 105},
      {"instrument": "conga_low", "beat": 3.5, "velocity": 115},
      
      // TR-808 Maracas - stadium energy shimmer
      {"instrument": "ma", "beat": 1, "velocity": 80},
      {"instrument": "ma", "beat": 2, "velocity": 85},
      {"instrument": "ma", "beat": 3, "velocity": 75},
      {"instrument": "ma", "beat": 4, "velocity": 90},
      
      // TR-909 Cymbals - stadium climax markers
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 120},
      {"instrument": "crash_cymbal", "beat": 2.5, "velocity": 115},
      {"instrument": "crash_cymbal", "beat": 4, "velocity": 125},
      {"instrument": "cym", "beat": 1.5, "velocity": 105},
      {"instrument": "cym", "beat": 3.25, "velocity": 100},
      
      // TR-808 Accent - stadium dynamics explosion
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 120},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
    ]
  },

  // ===== HIP-HOP CATEGORY (10 sequences) =====
  "hiphop_1": {
    name: "Boom-Bap Bounce (Authentic TR-808/909 Golden Era)",
    category: "Hip-Hop",
    bpm: 88,
    sequence: [
      // TR-808 Bass Drum - classic boom-bap foundation with breathing room
      {"instrument": "bass_drum", "beat": 1, "velocity": 115},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 95}, // Bounce accent
      
      // TR-909 Snare - crisp boom-bap backbeat with space
      {"instrument": "snare_drum", "beat": 2, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 110},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 40}, // Classic ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 45}, // Classic ghost note
      
      // TR-909 Hi-Hat - lo-fi boom-bap texture with gaps
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 65},
      
      // TR-909 Open Hi-Hat - boom-bap accents with space
      {"instrument": "open_hihat", "beat": 2.75, "velocity": 80},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 85},
      
      // TR-808 Cowbell - boom-bap flavor with breathing room
      {"instrument": "cowbell", "beat": 2.5, "velocity": 75},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 70},
      
      // TR-808 Claves - Latin boom-bap influence with space
      {"instrument": "claves", "beat": 1.25, "velocity": 80},
      {"instrument": "claves", "beat": 3.25, "velocity": 75},
      
      // TR-808 Toms - boom-bap fills with classic spacing
      {"instrument": "ht", "beat": 2.25, "velocity": 85},
      {"instrument": "mt", "beat": 1.75, "velocity": 90},
      {"instrument": "mt", "beat": 4.25, "velocity": 80},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 95},
      
      // TR-808 Rimshot - boom-bap percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 85},
      {"instrument": "rimshot", "beat": 3, "velocity": 80},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 90},
      
      // TR-808 Congas - boom-bap percussion depth
      {"instrument": "conga_high", "beat": 1.5, "velocity": 75},
      {"instrument": "conga_high", "beat": 4, "velocity": 70},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 80},
      {"instrument": "conga_low", "beat": 3.5, "velocity": 85},
      
      // TR-808 Maracas - boom-bap texture with space
      {"instrument": "ma", "beat": 2, "velocity": 60},
      {"instrument": "ma", "beat": 4.75, "velocity": 65},
      
      // TR-909 Cymbals - boom-bap impact with classic spacing
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 100},
      {"instrument": "cym", "beat": 3, "velocity": 90},
      
      // TR-808 Accent - boom-bap dynamics with breathing room
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 85},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
    ]
  },
  "hiphop_2": {
    name: "Trap Snap (Inspired by PARTYNEXTDOOR, Drake & Cash Cobain - 'Somebody Loves Me' energy)",
    category: "Hip-Hop",
    bpm: 135,
    sequence: [
      // TR-808 Bass Drum - half-time trap foundation (beats renumbered into the 1-bar grid)
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 100},

      // TR-909 Snare - trap backbeat
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},

      // TR-909 Closed Hi-Hat - continuous 8th-note trap pulse with 16th pickup
      {"instrument": "closed_hihat", "beat": 1, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 55},

      // TR-909 Open Hi-Hat - splash with the backbeat (authored: oh on every snare count)
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},

      // TR-808 Rimshot - odd-count accents (authored: rim on odd counts)
      {"instrument": "rimshot", "beat": 1, "velocity": 85},
      {"instrument": "rimshot", "beat": 3, "velocity": 80},

      // TR-808 Percussion color (collapsed from 4-bar positions, thinned to avoid downbeat pile-up)
      {"instrument": "cowbell", "beat": 3.25, "velocity": 70},
      {"instrument": "claves", "beat": 2.25, "velocity": 80},
      {"instrument": "high_conga", "beat": 1.5, "velocity": 70},
      {"instrument": "mid_conga", "beat": 3.5, "velocity": 75},
      {"instrument": "low_conga", "beat": 4.25, "velocity": 80},
      {"instrument": "high_tom", "beat": 4.5, "velocity": 85},
      {"instrument": "low_tom", "beat": 4.75, "velocity": 80},

      // TR-808 Maracas - quarter pulse (authored: constant count pulse)
      {"instrument": "maracas", "beat": 1.25, "velocity": 60},
      {"instrument": "maracas", "beat": 2.25, "velocity": 65},
      {"instrument": "maracas", "beat": 3.25, "velocity": 60},
      {"instrument": "maracas", "beat": 4.25, "velocity": 65},

      // TR-909 Crash - downbeat impact (cym-doubling-crash removed; cym is the ride)
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 110}
    ]
  },
  "hiphop_3": {
    name: "Melodic Flow (Inspired by Justin Bieber - 'Yukon' rhythm)",
    category: "Hip-Hop",
    bpm: 98,
    sequence: [
      // TR-808 Bass Drum - melodic hip-hop foundation (beats renumbered into the 1-bar grid)
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},

      // TR-909 Snare - smooth backbeat with ghost
      {"instrument": "snare_drum", "beat": 2, "velocity": 90},
      {"instrument": "snare_drum", "beat": 4, "velocity": 85},
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 40},

      // TR-909 Closed Hi-Hat - continuous 8th-note pulse
      {"instrument": "closed_hihat", "beat": 1, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 65},

      // TR-909 Open Hi-Hat - lift on the backbeats
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},

      // TR-808 Rimshot - melodic accents
      {"instrument": "rimshot", "beat": 1, "velocity": 85},
      {"instrument": "rimshot", "beat": 3, "velocity": 80},

      // TR-808 Percussion color (collapsed from 4-bar positions)
      {"instrument": "claves", "beat": 2.25, "velocity": 80},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 70},
      {"instrument": "high_conga", "beat": 1.5, "velocity": 70},
      {"instrument": "mid_conga", "beat": 3.5, "velocity": 75},
      {"instrument": "low_conga", "beat": 4.25, "velocity": 80},

      // TR-808 Maracas - offbeat quarter pulse
      {"instrument": "maracas", "beat": 1.25, "velocity": 60},
      {"instrument": "maracas", "beat": 2.25, "velocity": 65},
      {"instrument": "maracas", "beat": 3.25, "velocity": 60},
      {"instrument": "maracas", "beat": 4.25, "velocity": 65},

      // TR-909 Crash - downbeat impact
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 105}
    ]
  },
  "hiphop_4": {
    name: "Southern Trap (Inspired by Gunna - 'The Last Wun' beat)",
    category: "Hip-Hop",
    bpm: 133,
    sequence: [
      // TR-808 Bass Drum - southern trap foundation with heavy spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 120},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 105}, // Southern trap bounce
      
      // TR-909 Snare - southern trap backbeat with digital edge
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 105},
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 90}, // Trap accent
      {"instrument": "snare_drum", "beat": 4.25, "velocity": 85}, // Trap accent
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 45}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 40}, // Ghost note
      
      // TR-909 Hi-Hat - southern trap pattern with breathing room
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 55},
      
      // TR-909 Open Hi-Hat - southern trap atmosphere with space
      {"instrument": "open_hihat", "beat": 2, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4, "velocity": 90},
      {"instrument": "open_hihat", "beat": 3.75, "velocity": 80},
      
      // TR-808 Cowbell - southern trap signature element
      {"instrument": "cowbell", "beat": 1.5, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 80},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 90},
      
      // TR-808 Claves - southern trap percussive texture
      {"instrument": "claves", "beat": 2.25, "velocity": 75},
      {"instrument": "claves", "beat": 4.5, "velocity": 80},
      
      // TR-808 Toms - southern trap fills with character
      {"instrument": "ht", "beat": 1.75, "velocity": 85},
      {"instrument": "ht", "beat": 4.25, "velocity": 90},
      {"instrument": "mt", "beat": 2.5, "velocity": 95},
      {"instrument": "mt", "beat": 3.75, "velocity": 85},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 100},
      
      // TR-808 Rimshot - southern trap percussion accents
      {"instrument": "rimshot", "beat": 1, "velocity": 90},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4, "velocity": 95},
      
      // TR-808 Congas - southern trap groove depth
      {"instrument": "conga_high", "beat": 1.25, "velocity": 80},
      {"instrument": "conga_high", "beat": 3.5, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2, "velocity": 85},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 80},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 90},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 95},
      
      // TR-808 Maracas - southern trap high-frequency texture
      {"instrument": "ma", "beat": 1.75, "velocity": 65},
      {"instrument": "ma", "beat": 3.25, "velocity": 70},
      {"instrument": "ma", "beat": 4.5, "velocity": 60},
      
      // TR-909 Cymbals - southern trap impact with space
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 105},
      {"instrument": "cym", "beat": 2.5, "velocity": 95},
      {"instrument": "cym", "beat": 4.5, "velocity": 100},
      
      // TR-808 Accent - southern trap dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 110}
    ]
  },
  "hiphop_5": {
    name: "Drill Edge (Authentic TR-808/909 Street Energy)",
    category: "Hip-Hop",
    bpm: 130,
    sequence: [
      // TR-808 Bass Drum - drill foundation with aggressive spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 120},
      {"instrument": "bass_drum", "beat": 2.5, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 115},
      
      // TR-909 Snare - sharp drill backbeat with digital edge
      {"instrument": "snare_drum", "beat": 2, "velocity": 110},
      {"instrument": "snare_drum", "beat": 4, "velocity": 115},
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 95}, // Drill accent
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 85}, // Drill accent
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 50}, // Ghost note
      
      // TR-909 Hi-Hat - drill pattern with strategic gaps
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 60},
      
      // TR-909 Open Hi-Hat - drill atmosphere with breathing room
      {"instrument": "open_hihat", "beat": 2.25, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4.75, "velocity": 90},
      
      // TR-808 Cowbell - drill metallic texture
      {"instrument": "cowbell", "beat": 1.5, "velocity": 80},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 85},
      
      // TR-808 Claves - drill percussive edge
      {"instrument": "claves", "beat": 2.5, "velocity": 85},
      {"instrument": "claves", "beat": 4.25, "velocity": 80},
      
      // TR-808 Toms - drill fills with aggressive spacing
      {"instrument": "ht", "beat": 1.25, "velocity": 95},
      {"instrument": "ht", "beat": 3.75, "velocity": 90},
      {"instrument": "mt", "beat": 2.25, "velocity": 100},
      {"instrument": "mt", "beat": 4.5, "velocity": 85},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 105},
      
      // TR-808 Rimshot - drill percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 90},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4, "velocity": 95},
      
      // TR-808 Congas - drill texture with space
      {"instrument": "conga_high", "beat": 1.75, "velocity": 80},
      {"instrument": "conga_high", "beat": 4.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2, "velocity": 85},
      {"instrument": "conga_low", "beat": 3.25, "velocity": 90},
      
      // TR-808 Maracas - drill high-frequency texture with gaps
      {"instrument": "ma", "beat": 2.5, "velocity": 65},
      {"instrument": "ma", "beat": 4.75, "velocity": 70},
      
      // TR-909 Cymbals - drill impact with strategic placement
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "cym", "beat": 3.5, "velocity": 100},
      
      // TR-808 Accent - drill dynamics with breathing room
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 110}
    ]
  },
  "hiphop_6": {
    name: "Melodic Rap (Inspired by Future feat. Drake & Tems - 'WAIT FOR U' groove)",
    category: "Hip-Hop",
    bpm: 91,
    sequence: [
      // TR-808 Bass Drum - melodic rap foundation with smooth spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 112},
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 105},
      {"instrument": "bass_drum", "beat": 4.75, "velocity": 98},
      
      // TR-909 Snare - melodic rap backbeat with flowing character
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 96},
      {"instrument": "snare_drum", "beat": 4, "velocity": 102},
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 38}, // Melodic ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 35}, // Melodic ghost note
      
      // TR-909 Hi-Hat - melodic rap pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 62},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 68},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 65},
      
      // TR-909 Open Hi-Hat - melodic rap atmosphere
      {"instrument": "open_hihat", "beat": 2, "velocity": 78},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 85},
      
      // TR-808 Cowbell - melodic rap texture
      {"instrument": "cowbell", "beat": 2.75, "velocity": 72},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 76},
      
      // TR-808 Toms - melodic rap fills
      {"instrument": "ht", "beat": 1.5, "velocity": 82},
      {"instrument": "mt", "beat": 3.25, "velocity": 88},
      {"instrument": "tom_low", "beat": 4.75, "velocity": 92},
      
      // TR-808 Congas - melodic rap groove depth
      {"instrument": "conga_high", "beat": 1.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2.75, "velocity": 82},
      {"instrument": "conga_low", "beat": 4.25, "velocity": 88},
      
      // TR-808 Maracas - melodic rap texture
      {"instrument": "ma", "beat": 2, "velocity": 62},
      {"instrument": "ma", "beat": 3.75, "velocity": 68},
      
      // TR-909 Cymbals - melodic rap atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "cym", "beat": 3.5, "velocity": 105},
      
      // TR-808 Accent - melodic rap dynamics
      // Removed accent: {"instrument": "accent", "beat": 2.5, "velocity": 88},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
    ]
  },
  "hiphop_7": {
    name: "Old-School Revival (Inspired by Playboi Carti - 'Evil J0rdan' beat)",
    category: "Hip-Hop",
    bpm: 130,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "snare_drum", "beat": 2, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},
      {"instrument": "rimshot", "beat": 4, "velocity": 80},
      {"instrument": "tom_high", "beat": 3.5, "velocity": 75}
    ]
  },
  "hiphop_8": {
    name: "Cloud Rap Drift (Inspired by Playboi Carti & The Weeknd - 'Rather Lie' style)",
    category: "Hip-Hop",
    bpm: 85,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 95},
      {"instrument": "snare_drum", "beat": 2, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 3.5, "velocity": 75}
    ]
  },
  "hiphop_9": {
    name: "Funk Bounce (Inspired by Leon Thomas - 'Mutt' rhythm)",
    category: "Hip-Hop",
    bpm: 96,
    sequence: [
      // TR-808 Bass Drum - funk foundation with syncopated bounce
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 105},
      {"instrument": "bass_drum", "beat": 4.5, "velocity": 90},
      
      // TR-909 Snare - funk backbeat with ghost note groove
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 105},
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 45}, // Funk ghost note
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 40}, // Funk ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 50}, // Funk ghost note
      
      // TR-909 Hi-Hat - funk pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
      
      // TR-909 Open Hi-Hat - funk accents with space
      {"instrument": "open_hihat", "beat": 2.75, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 80},
      
      // TR-808 Cowbell - funk signature element
      {"instrument": "cowbell", "beat": 1.75, "velocity": 85},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 80},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 90},
      
      // TR-808 Claves - funk percussive bounce
      {"instrument": "claves", "beat": 2.5, "velocity": 75},
      {"instrument": "claves", "beat": 4.75, "velocity": 70},
      
      // TR-808 Toms - funk melodic fills
      {"instrument": "ht", "beat": 1.25, "velocity": 85},
      {"instrument": "ht", "beat": 3.75, "velocity": 80},
      {"instrument": "mt", "beat": 2.25, "velocity": 90},
      {"instrument": "mt", "beat": 4.25, "velocity": 85},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 95},
      
      // TR-808 Rimshot - funk percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 80},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4, "velocity": 90},
      
      // TR-808 Congas - funk groove depth
      {"instrument": "conga_high", "beat": 1.5, "velocity": 80},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 85},
      {"instrument": "conga_mid", "beat": 4.5, "velocity": 80},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 90},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 95},
      
      // TR-808 Maracas - funk texture with breathing room
      {"instrument": "ma", "beat": 2, "velocity": 65},
      {"instrument": "ma", "beat": 3.75, "velocity": 70},
      
      // TR-909 Cymbals - funk impact with space
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 100},
      {"instrument": "cym", "beat": 3.5, "velocity": 90},
      
      // TR-808 Accent - funk dynamics
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 90},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
    ]
  },
  "hiphop_10": {
    name: "East Coast Grit (Inspired by Kehlani - 'Folded' flow)",
    category: "Hip-Hop",
    bpm: 92,
    sequence: [
      // TR-808 Bass Drum - east coast foundation with gritty spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 115},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "bass_drum", "beat": 4.25, "velocity": 100}, // East coast accent
      
      // TR-909 Snare - gritty backbeat with street character
      {"instrument": "snare_drum", "beat": 2, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 110},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 50}, // Gritty ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 45}, // Gritty ghost note
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 40}, // Street ghost note
      
      // TR-909 Hi-Hat - east coast pattern with breathing room
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 65},
      
      // TR-909 Open Hi-Hat - gritty accents with space
      {"instrument": "open_hihat", "beat": 2.25, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 90},
      
      // TR-808 Cowbell - east coast metallic texture
      {"instrument": "cowbell", "beat": 1.5, "velocity": 80},
      {"instrument": "cowbell", "beat": 3.75, "velocity": 75},
      
      // TR-808 Claves - street percussion grit
      {"instrument": "claves", "beat": 2.5, "velocity": 70},
      {"instrument": "claves", "beat": 4.25, "velocity": 75},
      
      // TR-808 Toms - east coast fills with character
      {"instrument": "ht", "beat": 1.75, "velocity": 85},
      {"instrument": "ht", "beat": 4, "velocity": 90},
      {"instrument": "mt", "beat": 2.25, "velocity": 90},
      {"instrument": "mt", "beat": 3.25, "velocity": 85},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 95},
      
      // TR-808 Rimshot - east coast percussion signature
      {"instrument": "rimshot", "beat": 1, "velocity": 90},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4.25, "velocity": 95},
      
      // TR-808 Congas - street groove depth
      {"instrument": "conga_high", "beat": 1.25, "velocity": 80},
      {"instrument": "conga_high", "beat": 3.5, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2, "velocity": 85},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 80},
      {"instrument": "conga_low", "beat": 2.5, "velocity": 90},
      {"instrument": "conga_low", "beat": 4, "velocity": 95},
      
      // TR-808 Maracas - gritty texture with space
      {"instrument": "ma", "beat": 1.75, "velocity": 65},
      {"instrument": "ma", "beat": 3.25, "velocity": 70},
      
      // TR-909 Cymbals - east coast impact with grit
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "cym", "beat": 3.75, "velocity": 100},
      
      // TR-808 Accent - east coast dynamics
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 95},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 105}
    ]
  },

  // ===== EDM CATEGORY (10 sequences) =====
  "edm_1": {
    name: "Progressive Build (Inspired by Disco Lines & Tinashe - 'No Broke Boys' minimalism)",
    category: "EDM",
    bpm: 126,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 115},
      {"instrument": "bass_drum", "beat": 2, "velocity": 115},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "bass_drum", "beat": 4, "velocity": 115},
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 100},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 50},
      {"instrument": "open_hihat", "beat": 2, "velocity": 60},
      {"instrument": "open_hihat", "beat": 4, "velocity": 60},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 80}
    ]
  },
  "edm_2": {
    name: "Festival Drop (Inspired by Marshmello & Kane Brown - 'Miles On It' energy)",
    category: "EDM",
    bpm: 132,
    sequence: [
      // TR-808 Bass Drum - festival drop foundation with massive power
      {"instrument": "bass_drum", "beat": 1, "velocity": 125},
      {"instrument": "bass_drum", "beat": 2, "velocity": 120},
      {"instrument": "bass_drum", "beat": 3, "velocity": 127},
      {"instrument": "bass_drum", "beat": 4, "velocity": 118},
      {"instrument": "bass_drum", "beat": 1.25, "velocity": 108}, // Festival double kick
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 112}, // Festival accent
      
      // TR-909 Snare - festival drop backbeat with explosive power
      {"instrument": "snare_drum", "beat": 2, "velocity": 115},
      {"instrument": "snare_drum", "beat": 4, "velocity": 120},
      {"instrument": "snare_drum", "beat": 2.25, "velocity": 95}, // Festival roll
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 100}, // Festival buildup
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 52}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 48}, // Ghost note
      
      // TR-909 Hi-Hat - festival drop pattern with energy spacing
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 68},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 72},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 75},
      
      // TR-909 Open Hi-Hat - festival drop atmosphere
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 92},
      {"instrument": "open_hihat", "beat": 2, "velocity": 98},
      {"instrument": "open_hihat", "beat": 4, "velocity": 105},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 88},
      
      // TR-808 Cowbell - festival drop metallic energy
      {"instrument": "cowbell", "beat": 2.75, "velocity": 92},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 98},
      
      // TR-808 Claves - festival drop percussive drive
      {"instrument": "claves", "beat": 1.25, "velocity": 85},
      {"instrument": "claves", "beat": 3.5, "velocity": 90},
      
      // TR-808 Toms - festival drop explosive fills
      {"instrument": "ht", "beat": 1.75, "velocity": 98},
      {"instrument": "ht", "beat": 3.25, "velocity": 102},
      {"instrument": "mt", "beat": 2.5, "velocity": 108},
      {"instrument": "mt", "beat": 4.75, "velocity": 95},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 115},
      
      // TR-808 Rimshot - festival drop percussion power
      {"instrument": "rimshot", "beat": 1, "velocity": 95},
      {"instrument": "rimshot", "beat": 2.25, "velocity": 90},
      {"instrument": "rimshot", "beat": 4, "velocity": 102},
      
      // TR-808 Congas - festival drop groove complexity
      {"instrument": "conga_high", "beat": 1.25, "velocity": 88},
      {"instrument": "conga_high", "beat": 3.75, "velocity": 85},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 95},
      {"instrument": "conga_mid", "beat": 4.25, "velocity": 92},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 102},
      {"instrument": "conga_low", "beat": 4.5, "velocity": 108},
      
      // TR-808 Maracas - festival drop high-frequency energy
      {"instrument": "ma", "beat": 1.5, "velocity": 75},
      {"instrument": "ma", "beat": 3.25, "velocity": 80},
      
      // TR-909 Cymbals - festival drop climax explosion
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 127},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 125},
      {"instrument": "cym", "beat": 2.25, "velocity": 112},
      {"instrument": "cym", "beat": 4.75, "velocity": 118},
      
      // TR-808 Accent - festival drop explosive dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 118},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 112},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 122},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
    ]
  },
  "edm_3": {
    name: "House Groove (Inspired by Fred again.. & Skepta - 'Victory Lap' pulse)",
    category: "EDM",
    bpm: 122,
    sequence: [
      // TR-808 Bass Drum - house four-on-the-floor with subtle variations
      {"instrument": "bass_drum", "beat": 1, "velocity": 116},
      {"instrument": "bass_drum", "beat": 2, "velocity": 112},
      {"instrument": "bass_drum", "beat": 3, "velocity": 118},
      {"instrument": "bass_drum", "beat": 4, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 95}, // House groove accent
      
      // TR-909 Snare - house backbeat with breathing space
      {"instrument": "snare_drum", "beat": 2, "velocity": 102},
      {"instrument": "snare_drum", "beat": 4, "velocity": 108},
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 48}, // Subtle ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 42}, // Subtle ghost note
      
      // TR-909 Hi-Hat - house groove with selective placement
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 68},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 72},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 75},
      
      // TR-909 Open Hi-Hat - house energy with space
      {"instrument": "open_hihat", "beat": 2.25, "velocity": 82},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 88},
      
      // TR-808 Cowbell - house metallic groove element
      {"instrument": "cowbell", "beat": 1.75, "velocity": 78},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 82},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 74},
      
      // TR-808 Claves - house percussive texture
      {"instrument": "claves", "beat": 2.5, "velocity": 72},
      {"instrument": "claves", "beat": 4.5, "velocity": 76},
      
      // TR-808 Toms - house melodic fills
      {"instrument": "ht", "beat": 1.25, "velocity": 82},
      {"instrument": "ht", "beat": 3.75, "velocity": 78},
      {"instrument": "mt", "beat": 2.25, "velocity": 88},
      {"instrument": "mt", "beat": 4.25, "velocity": 84},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 92},
      
      // TR-808 Rimshot - house percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 84},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 80},
      {"instrument": "rimshot", "beat": 4, "velocity": 88},
      
      // TR-808 Congas - house groove depth
      {"instrument": "conga_high", "beat": 1.5, "velocity": 78},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 74},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 82},
      {"instrument": "conga_mid", "beat": 4.5, "velocity": 78},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 88},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 92},
      
      // TR-808 Maracas - house high-frequency texture
      {"instrument": "ma", "beat": 1.75, "velocity": 62},
      {"instrument": "ma", "beat": 3.5, "velocity": 68},
      
      // TR-909 Cymbals - house impact and atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 104},
      {"instrument": "cym", "beat": 2.5, "velocity": 92},
      {"instrument": "cym", "beat": 4.75, "velocity": 96},
      
      // TR-808 Accent - house dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 98},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 94},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 102},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 106}
    ]
  },
  "edm_4": {
    name: "Tech House Roll (Inspired by Mau P - 'Like I Like It' build)",
    category: "EDM",
    bpm: 124,
    sequence: [
      // TR-808 Bass Drum - tech house roll foundation with rolling power
      {"instrument": "bass_drum", "beat": 1, "velocity": 120},
      {"instrument": "bass_drum", "beat": 2, "velocity": 116},
      {"instrument": "bass_drum", "beat": 3, "velocity": 118},
      {"instrument": "bass_drum", "beat": 4, "velocity": 114},
      {"instrument": "bass_drum", "beat": 2.25, "velocity": 105}, // Tech house roll accent
      {"instrument": "bass_drum", "beat": 4.75, "velocity": 108}, // Tech house roll accent
      
      // TR-909 Snare - tech house roll backbeat with building tension
      {"instrument": "snare_drum", "beat": 2, "velocity": 102},
      {"instrument": "snare_drum", "beat": 4, "velocity": 106},
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 95}, // Roll buildup
      {"instrument": "snare_drum", "beat": 4.25, "velocity": 88}, // Roll buildup
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 44}, // Ghost note
      
      // TR-909 Hi-Hat - tech house roll pattern with selective placement
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 72},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 58},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 68},
      
      // TR-909 Open Hi-Hat - tech house roll atmosphere
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 82},
      {"instrument": "open_hihat", "beat": 3, "velocity": 88},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 75},
      
      // TR-808 Rimshot - tech house roll percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 88},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 84},
      {"instrument": "rimshot", "beat": 4, "velocity": 92},
      
      // TR-808 Toms - tech house roll fills
      {"instrument": "ht", "beat": 1.75, "velocity": 85},
      {"instrument": "mt", "beat": 3.25, "velocity": 92},
      {"instrument": "tom_low", "beat": 4.5, "velocity": 98},
      
      // TR-808 Congas - tech house roll groove depth
      {"instrument": "conga_high", "beat": 1.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2.75, "velocity": 82},
      {"instrument": "conga_low", "beat": 4.25, "velocity": 88},
      
      // TR-909 Cymbals - tech house roll impact
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 118},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 115},
      {"instrument": "cym", "beat": 2.5, "velocity": 105},
      
      // TR-808 Accent - tech house roll dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 98},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 112},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 118}
    ]
  },
  "edm_5": {
    name: "Future Bass Drop (Inspired by FISHER & bbyclose - 'Blackberries' fusion)",
    category: "EDM",
    bpm: 140,
    sequence: [
      // TR-808 Bass Drum - future bass drop foundation with powerful spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 125},
      {"instrument": "bass_drum", "beat": 2.25, "velocity": 118},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 122},
      {"instrument": "bass_drum", "beat": 4.75, "velocity": 115},
      
      // TR-909 Snare - future bass drop backbeat with explosive character
      {"instrument": "snare_drum", "beat": 2, "velocity": 112},
      {"instrument": "snare_drum", "beat": 4, "velocity": 118},
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 105}, // Drop buildup
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 52}, // Ghost note
      
      // TR-909 Hi-Hat - future bass drop pattern with dynamic spacing
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 82},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 68},
      
      // TR-909 Open Hi-Hat - future bass drop atmosphere
      {"instrument": "open_hihat", "beat": 1.25, "velocity": 92},
      {"instrument": "open_hihat", "beat": 3, "velocity": 98},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 85},
      
      // TR-808 Cowbell - future bass drop metallic texture
      {"instrument": "cowbell", "beat": 2.75, "velocity": 88},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 95},
      
      // TR-808 Toms - future bass drop explosive fills
      {"instrument": "ht", "beat": 1.5, "velocity": 102},
      {"instrument": "mt", "beat": 2.75, "velocity": 108},
      {"instrument": "tom_low", "beat": 3.25, "velocity": 115},
      
      // TR-808 Rimshot - future bass drop percussion power
      {"instrument": "rimshot", "beat": 1, "velocity": 95},
      {"instrument": "rimshot", "beat": 3.5, "velocity": 102},
      
      // TR-808 Congas - future bass drop groove complexity
      {"instrument": "conga_high", "beat": 1.75, "velocity": 88},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 95},
      {"instrument": "conga_low", "beat": 4, "velocity": 105},
      
      // TR-909 Cymbals - future bass drop explosive climax
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 127},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 125},
      {"instrument": "cym", "beat": 2.5, "velocity": 118},
      
      // TR-808 Accent - future bass drop explosive dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 122},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 127},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
    ]
  },
  "edm_6": {
    name: "Big Room Anthem (Inspired by PAWSA - 'DOUBLE C' style)",
    category: "EDM",
    bpm: 128,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 125},
      {"instrument": "bass_drum", "beat": 2, "velocity": 125},
      {"instrument": "bass_drum", "beat": 3, "velocity": 125},
      {"instrument": "bass_drum", "beat": 4, "velocity": 125},
      {"instrument": "snare_drum", "beat": 2, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 105},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 75},
      {"instrument": "open_hihat", "beat": 4, "velocity": 75},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 127}
    ]
  },
  "edm_7": {
    name: "Bass House Wobble (Inspired by Anabel Englund - 'Get Busy' drop)",
    category: "EDM",
    bpm: 128,
    sequence: [
      // TR-808 Bass Drum - house foundation with bass house punch
      {"instrument": "bass_drum", "beat": 1, "velocity": 118},
      {"instrument": "bass_drum", "beat": 2, "velocity": 115},
      {"instrument": "bass_drum", "beat": 3, "velocity": 120},
      {"instrument": "bass_drum", "beat": 4, "velocity": 112},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 95}, // Bass house syncopation
      
      // TR-909 Snare - crisp house backbeat with wobble accents
      {"instrument": "snare_drum", "beat": 2, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 110},
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 50}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 45}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 55}, // Wobble accent
      
      // TR-909 Hi-Hat - bass house groove pattern
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 70},
      
      // TR-909 Open Hi-Hat - bass house energy release
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 85},
      {"instrument": "open_hihat", "beat": 2.5, "velocity": 90},
      {"instrument": "open_hihat", "beat": 4, "velocity": 95},
      
      // TR-808 Cowbell - bass house metallic texture
      {"instrument": "cowbell", "beat": 1.75, "velocity": 80},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 85},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 75},
      
      // TR-808 Claves - bass house percussive drive
      {"instrument": "claves", "beat": 2.25, "velocity": 75},
      {"instrument": "claves", "beat": 3.75, "velocity": 80},
      
      // TR-808 Toms - bass house wobble fills
      {"instrument": "ht", "beat": 1.25, "velocity": 85},
      {"instrument": "ht", "beat": 3.25, "velocity": 90},
      {"instrument": "mt", "beat": 2.5, "velocity": 95},
      {"instrument": "mt", "beat": 4.25, "velocity": 85},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 100},
      
      // TR-808 Rimshot - bass house percussion accents
      {"instrument": "rimshot", "beat": 1, "velocity": 85},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 80},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 90},
      
      // TR-808 Congas - bass house groove layers
      {"instrument": "conga_high", "beat": 1.5, "velocity": 80},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 75},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 85},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 80},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 90},
      {"instrument": "conga_low", "beat": 4, "velocity": 95},
      
      // TR-808 Maracas - bass house high-frequency wobble
      {"instrument": "ma", "beat": 1.75, "velocity": 65},
      {"instrument": "ma", "beat": 2.5, "velocity": 70},
      {"instrument": "ma", "beat": 4.25, "velocity": 60},
      
      // TR-909 Cymbals - bass house impact and atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 105},
      {"instrument": "cym", "beat": 2.5, "velocity": 95},
      {"instrument": "cym", "beat": 4.5, "velocity": 100},
      
      // TR-808 Accent - bass house wobble dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 115}
    ]
  },
  "edm_8": {
    name: "Melodic Techno (Inspired by Benny Benassi and Oaks - 'Never Been Yours' pulse)",
    category: "EDM",
    bpm: 126,
    sequence: [
      // TR-808 Bass Drum - melodic techno foundation with hypnotic pulse
      {"instrument": "bass_drum", "beat": 1, "velocity": 112},
      {"instrument": "bass_drum", "beat": 2, "velocity": 108},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "bass_drum", "beat": 4, "velocity": 106},
      {"instrument": "bass_drum", "beat": 2.25, "velocity": 98}, // Melodic techno syncopation
      
      // TR-909 Snare - melodic techno backbeat with atmospheric space
      {"instrument": "snare_drum", "beat": 2, "velocity": 98},
      {"instrument": "snare_drum", "beat": 4, "velocity": 102},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 42}, // Atmospheric ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 38}, // Atmospheric ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 45}, // Melodic accent
      
      // TR-909 Hi-Hat - melodic techno pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 52},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 58},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 48},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 55},
      
      // TR-909 Open Hi-Hat - melodic techno atmosphere
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 72},
      {"instrument": "open_hihat", "beat": 3, "velocity": 78},
      {"instrument": "open_hihat", "beat": 4.75, "velocity": 68},
      
      // TR-808 Cowbell - melodic techno metallic texture
      {"instrument": "cowbell", "beat": 2.5, "velocity": 76},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 82},
      
      // TR-808 Claves - melodic techno percussive elements
      {"instrument": "claves", "beat": 1.75, "velocity": 68},
      {"instrument": "claves", "beat": 3.75, "velocity": 72},
      
      // TR-808 Toms - melodic techno fills with space
      {"instrument": "ht", "beat": 2.25, "velocity": 78},
      {"instrument": "ht", "beat": 4.5, "velocity": 82},
      {"instrument": "mt", "beat": 1.5, "velocity": 85},
      {"instrument": "mt", "beat": 3.5, "velocity": 88},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 92},
      
      // TR-808 Rimshot - melodic techno percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 82},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 78},
      {"instrument": "rimshot", "beat": 4, "velocity": 86},
      
      // TR-808 Congas - melodic techno groove depth
      {"instrument": "conga_high", "beat": 1.25, "velocity": 74},
      {"instrument": "conga_high", "beat": 3.5, "velocity": 70},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 78},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 76},
      {"instrument": "conga_low", "beat": 2, "velocity": 84},
      {"instrument": "conga_low", "beat": 4.25, "velocity": 88},
      
      // TR-808 Maracas - melodic techno high-frequency texture
      {"instrument": "ma", "beat": 1.75, "velocity": 58},
      {"instrument": "ma", "beat": 3.25, "velocity": 62},
      
      // TR-909 Cymbals - melodic techno atmosphere and impact
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 102},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 98},
      {"instrument": "cym", "beat": 2.25, "velocity": 88},
      {"instrument": "cym", "beat": 4.5, "velocity": 92},
      
      // TR-808 Accent - melodic techno dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 92},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 88},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 96},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 100}
    ]
  },
  "edm_9": {
    name: "Drum & Bass Break (Inspired by David Guetta, Alphaville & Ava Max - 'Forever Young' fusion)",
    category: "EDM",
    bpm: 170,
    sequence: [
      // TR-808 Bass Drum - drum & bass foundation with breakbeat spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 122},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 108},
      {"instrument": "bass_drum", "beat": 4.25, "velocity": 118},
      
      // TR-909 Snare - drum & bass breakbeat pattern with digital edge
      {"instrument": "snare_drum", "beat": 2, "velocity": 110},
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 115},
      {"instrument": "snare_drum", "beat": 4, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 100}, // Breakbeat accent
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 48}, // Ghost note
      {"instrument": "snare_drum", "beat": 2.25, "velocity": 52}, // Ghost note
      
      // TR-909 Hi-Hat - drum & bass rapid pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.125, "velocity": 58},
      {"instrument": "closed_hihat", "beat": 1.375, "velocity": 62},
      {"instrument": "closed_hihat", "beat": 1.625, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2.125, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.875, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.125, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.375, "velocity": 58},
      {"instrument": "closed_hihat", "beat": 4.125, "velocity": 52},
      {"instrument": "closed_hihat", "beat": 4.625, "velocity": 68},
      
      // TR-909 Open Hi-Hat - drum & bass atmosphere with space
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 88},
      {"instrument": "open_hihat", "beat": 3, "velocity": 95},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 82},
      
      // TR-808 Cowbell - drum & bass metallic breakbeat element
      {"instrument": "cowbell", "beat": 2.5, "velocity": 85},
      {"instrument": "cowbell", "beat": 4.75, "velocity": 90},
      
      // TR-808 Claves - drum & bass percussive texture
      {"instrument": "claves", "beat": 1.75, "velocity": 78},
      {"instrument": "claves", "beat": 3.25, "velocity": 82},
      
      // TR-808 Toms - drum & bass breakbeat fills
      {"instrument": "ht", "beat": 1.25, "velocity": 88},
      {"instrument": "ht", "beat": 3.75, "velocity": 92},
      {"instrument": "mt", "beat": 2.25, "velocity": 95},
      {"instrument": "mt", "beat": 4.25, "velocity": 90},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 102},
      
      // TR-808 Rimshot - drum & bass percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 90},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4, "velocity": 95},
      
      // TR-808 Congas - drum & bass groove complexity
      {"instrument": "conga_high", "beat": 1.5, "velocity": 82},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 78},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 88},
      {"instrument": "conga_mid", "beat": 4.5, "velocity": 85},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 95},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 100},
      
      // TR-808 Maracas - drum & bass high-frequency breakbeat texture
      {"instrument": "ma", "beat": 1.75, "velocity": 68},
      {"instrument": "ma", "beat": 3.5, "velocity": 72},
      
      // TR-909 Cymbals - drum & bass impact and atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 118},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 112},
      {"instrument": "cym", "beat": 2.5, "velocity": 98},
      {"instrument": "cym", "beat": 4.25, "velocity": 105},
      
      // TR-808 Accent - drum & bass breakbeat dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 108},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 102},
      // Removed accent: {"instrument": "accent", "beat": 3.5, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 120}
    ]
  },
  "edm_10": {
    name: "Hardstyle Surge (Inspired by CHRYSTAL - 'The Days' build)",
    category: "EDM",
    bpm: 148,
    sequence: [
      // TR-808 Bass Drum - hardstyle foundation with massive power
      {"instrument": "bass_drum", "beat": 1, "velocity": 127},
      {"instrument": "bass_drum", "beat": 2, "velocity": 122},
      {"instrument": "bass_drum", "beat": 3, "velocity": 125},
      {"instrument": "bass_drum", "beat": 4, "velocity": 120},
      {"instrument": "bass_drum", "beat": 1.5, "velocity": 110}, // Hardstyle double kick
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 105}, // Hardstyle accent
      
      // TR-909 Snare - hardstyle backbeat with surge power
      {"instrument": "snare_drum", "beat": 2, "velocity": 118},
      {"instrument": "snare_drum", "beat": 4, "velocity": 122},
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 100}, // Hardstyle roll
      {"instrument": "snare_drum", "beat": 4.75, "velocity": 95}, // Hardstyle roll
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 55}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 50}, // Ghost note
      
      // TR-909 Hi-Hat - hardstyle pattern with surge spacing
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 52},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 48},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 45},
      
      // TR-909 Open Hi-Hat - hardstyle surge atmosphere
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 95},
      {"instrument": "open_hihat", "beat": 2, "velocity": 100},
      {"instrument": "open_hihat", "beat": 4, "velocity": 105},
      
      // TR-808 Cowbell - hardstyle metallic surge
      {"instrument": "cowbell", "beat": 2.25, "velocity": 95},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 100},
      
      // TR-808 Claves - hardstyle percussive power
      {"instrument": "claves", "beat": 1.75, "velocity": 88},
      {"instrument": "claves", "beat": 3.75, "velocity": 92},
      
      // TR-808 Toms - hardstyle surge fills
      {"instrument": "ht", "beat": 1.25, "velocity": 100},
      {"instrument": "ht", "beat": 3.5, "velocity": 105},
      {"instrument": "mt", "beat": 2.25, "velocity": 110},
      {"instrument": "mt", "beat": 4.5, "velocity": 95},
      {"instrument": "tom_low", "beat": 3.25, "velocity": 115},
      
      // TR-808 Rimshot - hardstyle percussion surge
      {"instrument": "rimshot", "beat": 1, "velocity": 100},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 95},
      {"instrument": "rimshot", "beat": 4, "velocity": 105},
      
      // TR-808 Congas - hardstyle groove complexity
      {"instrument": "conga_high", "beat": 1.5, "velocity": 92},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 88},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 98},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 95},
      {"instrument": "conga_low", "beat": 2.5, "velocity": 105},
      {"instrument": "conga_low", "beat": 4.25, "velocity": 110},
      
      // TR-808 Maracas - hardstyle high-frequency surge
      {"instrument": "ma", "beat": 1.75, "velocity": 78},
      {"instrument": "ma", "beat": 3.5, "velocity": 82},
      
      // TR-909 Cymbals - hardstyle surge climax
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 127},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 122},
      {"instrument": "cym", "beat": 2.5, "velocity": 115},
      {"instrument": "cym", "beat": 4.5, "velocity": 120},
      
      // TR-808 Accent - hardstyle surge dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 120},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 110},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
    ]
  },

  // ===== ROCK CATEGORY (10 sequences) =====
  "rock_1": {
    name: "Classic Riff (Inspired by Billie Eilish - 'Birds Of A Feather' revival)",
    category: "Rock",
    bpm: 130,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "snare_drum", "beat": 4, "velocity": 100},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 70},
      {"instrument": "open_hihat", "beat": 2, "velocity": 80},
      {"instrument": "open_hihat", "beat": 4, "velocity": 80},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 120},
      {"instrument": "rimshot", "beat": 4, "velocity": 85},
      {"instrument": "tom_high", "beat": 3.5, "velocity": 75}
    ]
  },
  "rock_2": {
    name: "Alt Anthem (Inspired by Hozier - 'Too Sweet' style)",
    category: "Rock",
    bpm: 121,
    sequence: [
      // TR-808 Bass Drum - alt anthem foundation with anthemic power
      {"instrument": "bass_drum", "beat": 1, "velocity": 108},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 102},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 106},
      {"instrument": "bass_drum", "beat": 4.25, "velocity": 98},
      
      // TR-909 Snare - alt anthem backbeat with soaring character
      {"instrument": "snare_drum", "beat": 2, "velocity": 98},
      {"instrument": "snare_drum", "beat": 4, "velocity": 104},
      {"instrument": "snare_drum", "beat": 2.25, "velocity": 88}, // Anthem accent
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 42}, // Ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 38}, // Ghost note
      
      // TR-909 Hi-Hat - alt anthem pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 72},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 58},
      
      // TR-909 Open Hi-Hat - alt anthem atmosphere
      {"instrument": "open_hihat", "beat": 1.75, "velocity": 82},
      {"instrument": "open_hihat", "beat": 3.25, "velocity": 88},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 75},
      
      // TR-808 Cowbell - alt anthem texture
      {"instrument": "cowbell", "beat": 2.5, "velocity": 78},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 85},
      
      // TR-808 Toms - alt anthem melodic fills
      {"instrument": "ht", "beat": 1.75, "velocity": 88},
      {"instrument": "mt", "beat": 2.25, "velocity": 95},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 102},
      
      // TR-808 Rimshot - alt anthem percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 88},
      {"instrument": "rimshot", "beat": 2.75, "velocity": 85},
      {"instrument": "rimshot", "beat": 4, "velocity": 92},
      
      // TR-808 Congas - alt anthem groove depth
      {"instrument": "conga_high", "beat": 1.5, "velocity": 82},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 88},
      {"instrument": "conga_low", "beat": 4.5, "velocity": 95},
      
      // TR-909 Cymbals - alt anthem soaring impact
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 112},
      {"instrument": "cym", "beat": 2.25, "velocity": 105},
      
      // TR-808 Accent - alt anthem dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 98},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 112}
    ]
  },
  "rock_3": {
    name: "Punk Drive (Inspired by Myles Smith - 'Stargazing' energy)",
    category: "Rock",
    bpm: 148,
    sequence: [
      // TR-808 Bass Drum - punk drive foundation with aggressive power
      {"instrument": "bass_drum", "beat": 1, "velocity": 118},
      {"instrument": "bass_drum", "beat": 2.25, "velocity": 112},
      {"instrument": "bass_drum", "beat": 3, "velocity": 120},
      {"instrument": "bass_drum", "beat": 4.5, "velocity": 108},
      
      // TR-909 Snare - punk drive backbeat with explosive energy
      {"instrument": "snare_drum", "beat": 2, "velocity": 110},
      {"instrument": "snare_drum", "beat": 4, "velocity": 115},
      {"instrument": "snare_drum", "beat": 2.75, "velocity": 98}, // Punk accent
      {"instrument": "snare_drum", "beat": 4.25, "velocity": 95}, // Punk accent
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 48}, // Ghost note
      
      // TR-909 Hi-Hat - punk drive pattern with aggressive spacing
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 72},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 78},
      {"instrument": "closed_hihat", "beat": 3.75, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 68},
      
      // TR-909 Open Hi-Hat - punk drive atmosphere
      {"instrument": "open_hihat", "beat": 1.5, "velocity": 88},
      {"instrument": "open_hihat", "beat": 3.25, "velocity": 95},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 82},
      
      // TR-808 Rimshot - punk drive percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 92},
      {"instrument": "rimshot", "beat": 2.25, "velocity": 88},
      {"instrument": "rimshot", "beat": 4, "velocity": 98},
      
      // TR-808 Toms - punk drive explosive fills
      {"instrument": "ht", "beat": 1.75, "velocity": 95},
      {"instrument": "mt", "beat": 2.75, "velocity": 102},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 108},
      
      // TR-808 Congas - punk drive groove intensity
      {"instrument": "conga_high", "beat": 1.25, "velocity": 85},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 92},
      {"instrument": "conga_low", "beat": 4.75, "velocity": 98},
      
      // TR-909 Cymbals - punk drive explosive impact
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 125},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 122},
      {"instrument": "cym", "beat": 2.25, "velocity": 118},
      
      // TR-808 Accent - punk drive aggressive dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 115},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 108},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 122},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 125}
    ]
  },
  "rock_4": {
    name: "Grunge Revival (Inspired by Falling In Reverse feat. Saraya - 'Bad Guy' groove)",
    category: "Rock",
    bpm: 135,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "snare_drum", "beat": 2, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 55},
      {"instrument": "open_hihat", "beat": 2, "velocity": 65},
      {"instrument": "open_hihat", "beat": 4, "velocity": 65},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 105},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 75}
    ]
  },
  "rock_5": {
    name: "Indie Rock Steady (Inspired by Bad Omens - 'Specter' style)",
    category: "Rock",
    bpm: 128,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 95},
      {"instrument": "snare_drum", "beat": 2, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 50},
      {"instrument": "open_hihat", "beat": 2, "velocity": 60},
      {"instrument": "open_hihat", "beat": 4, "velocity": 60},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 70},
      {"instrument": "tom_mid", "beat": 3.5, "velocity": 75}
    ]
  },
  "rock_6": {
    name: "Hard Rock Riff (Inspired by Måneskin - 'HONEY (ARE U COMING?)' rhythm)",
    category: "Rock",
    bpm: 145,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 120},
      {"instrument": "snare_drum", "beat": 2, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3, "velocity": 120},
      {"instrument": "snare_drum", "beat": 4, "velocity": 110},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 75},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 75},
      {"instrument": "open_hihat", "beat": 2, "velocity": 85},
      {"instrument": "open_hihat", "beat": 4, "velocity": 85},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 127},
      {"instrument": "tom_high", "beat": 3.5, "velocity": 85}
    ]
  },
  "rock_7": {
    name: "Post-Punk (Inspired by Three Days Grace - 'Mayday' edge)",
    category: "Rock",
    bpm: 140,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 90},
      {"instrument": "snare_drum", "beat": 2, "velocity": 80},
      {"instrument": "bass_drum", "beat": 3, "velocity": 90},
      {"instrument": "snare_drum", "beat": 4, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},
      {"instrument": "rimshot", "beat": 3.5, "velocity": 85},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 100}
    ]
  },
  "rock_8": {
    name: "Garage Revival (Inspired by Hurricane on Saturn - 'Rescue Light' beat)",
    category: "Rock",
    bpm: 132,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "snare_drum", "beat": 2, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 70},
      {"instrument": "rimshot", "beat": 4, "velocity": 80}
    ]
  },
  "rock_9": {
    name: "Emo Revival (Inspired by sombr - 'Undressed' influence)",
    category: "Rock",
    bpm: 138,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 95},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 65},
      {"instrument": "open_hihat", "beat": 2, "velocity": 75},
      {"instrument": "open_hihat", "beat": 4, "velocity": 75},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
      {"instrument": "rimshot", "beat": 4, "velocity": 85},
      {"instrument": "tom_mid", "beat": 3.5, "velocity": 75}
    ]
  },
  "rock_10": {
    name: "Stadium Rock (Inspired by Poppy, Amy Lee & Courtney LaPlante - 'End Of You' style)",
    category: "Rock",
    bpm: 135,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "snare_drum", "beat": 4, "velocity": 100},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 70},
      {"instrument": "open_hihat", "beat": 2, "velocity": 80},
      {"instrument": "open_hihat", "beat": 4, "velocity": 80},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 120},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 80}
    ]
  },

  // ===== COUNTRY CATEGORY (10 sequences) =====
  "country_1": {
    name: "Honky-Tonk Stomp (Inspired by Morgan Wallen - 'I'm The Problem' vibe)",
    category: "Country",
    bpm: 108,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 95},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 80},
      {"instrument": "rimshot", "beat": 4, "velocity": 75}
    ]
  },
  "country_2": {
    name: "Barroom Ballad (Inspired by Morgan Wallen - 'One Thing At A Time' groove)",
    category: "Country",
    bpm: 82,
    sequence: [
      // TR-808 Bass Drum - barroom ballad foundation with intimate spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 92},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 86},
      
      // TR-909 Snare - barroom ballad backbeat with tender character
      {"instrument": "snare_drum", "beat": 2, "velocity": 82},
      {"instrument": "snare_drum", "beat": 4, "velocity": 88},
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 28}, // Intimate ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 25}, // Intimate ghost note
      
      // TR-909 Hi-Hat - barroom ballad pattern with emotional space
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 48},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 52},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 45},
      
      // TR-909 Open Hi-Hat - barroom ballad atmosphere
      {"instrument": "open_hihat", "beat": 2, "velocity": 62},
      {"instrument": "open_hihat", "beat": 4, "velocity": 68},
      
      // TR-808 Cowbell - barroom ballad texture
      {"instrument": "cowbell", "beat": 2.75, "velocity": 65},
      
      // TR-808 Claves - barroom ballad percussive elements
      {"instrument": "claves", "beat": 3.5, "velocity": 58},
      {"instrument": "claves", "beat": 4.5, "velocity": 62},
      
      // TR-808 Toms - barroom ballad melodic fills
      {"instrument": "ht", "beat": 1.75, "velocity": 68},
      {"instrument": "mt", "beat": 3.25, "velocity": 72},
      {"instrument": "tom_low", "beat": 4.5, "velocity": 78},
      
      // TR-808 Maracas - barroom ballad texture with space
      {"instrument": "ma", "beat": 2.25, "velocity": 55},
      {"instrument": "ma", "beat": 4.75, "velocity": 58},
      
      // TR-909 Cymbals - barroom ballad atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 95},
      {"instrument": "cym", "beat": 3.75, "velocity": 82},
      
      // TR-808 Accent - barroom ballad dynamics
      // Removed accent: {"instrument": "accent", "beat": 2.5, "velocity": 75},
      // Removed accent: {"instrument": "accent", "beat": 4.25, "velocity": 82}
    ]
  },
  "country_3": {
    name: "Twangy Upbeat (Inspired by Post Malone - 'I Hope You're Happy' rhythm)",
    category: "Country",
    bpm: 106,
    sequence: [
      // TR-808 Bass Drum - twangy country foundation with upbeat bounce
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "bass_drum", "beat": 2.5, "velocity": 98},
      {"instrument": "bass_drum", "beat": 3.75, "velocity": 102},
      
      // TR-909 Snare - twangy country backbeat with upbeat snap
      {"instrument": "snare_drum", "beat": 2, "velocity": 92},
      {"instrument": "snare_drum", "beat": 4, "velocity": 96},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 38}, // Twangy ghost note
      {"instrument": "snare_drum", "beat": 3.25, "velocity": 35}, // Twangy ghost note
      
      // TR-909 Hi-Hat - twangy country pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 62},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 68},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 58},
      
      // TR-909 Open Hi-Hat - twangy country atmosphere
      {"instrument": "open_hihat", "beat": 2.25, "velocity": 75},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 82},
      
      // TR-808 Cowbell - twangy country signature element
      {"instrument": "cowbell", "beat": 1.5, "velocity": 78},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 85},
      
      // TR-808 Claves - twangy country percussive texture
      {"instrument": "claves", "beat": 2.5, "velocity": 72},
      {"instrument": "claves", "beat": 4.75, "velocity": 68},
      
      // TR-808 Toms - twangy country fills
      {"instrument": "ht", "beat": 2.25, "velocity": 82},
      {"instrument": "mt", "beat": 3.25, "velocity": 88},
      {"instrument": "tom_low", "beat": 4.5, "velocity": 92},
      
      // TR-808 Maracas - twangy country texture
      {"instrument": "ma", "beat": 1.75, "velocity": 65},
      {"instrument": "ma", "beat": 3.75, "velocity": 72},
      
      // TR-909 Cymbals - twangy country atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
      {"instrument": "cym", "beat": 3.5, "velocity": 95},
      
      // TR-808 Accent - twangy country dynamics
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 88},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
    ]
  },
  "country_4": {
    name: "Southern Rock (Inspired by Shaboozey - 'Where I've Been, Isn't Where I'm Going' style)",
    category: "Country",
    bpm: 90,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 95},
      {"instrument": "snare_drum", "beat": 2, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 70},
      {"instrument": "open_hihat", "beat": 4, "velocity": 70},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 75},
      {"instrument": "maracas", "beat": 4, "velocity": 65}
    ]
  },
  "country_5": {
    name: "Acoustic Folk (Inspired by Morgan Wallen feat. Tate McRae - 'What I Want' groove)",
    category: "Country",
    bpm: 88,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 80},
      {"instrument": "snare_drum", "beat": 2, "velocity": 70},
      {"instrument": "bass_drum", "beat": 3, "velocity": 80},
      {"instrument": "snare_drum", "beat": 4, "velocity": 70},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 45},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 45},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 45},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 45},
      {"instrument": "open_hihat", "beat": 2, "velocity": 55},
      {"instrument": "open_hihat", "beat": 4, "velocity": 55},
      {"instrument": "claves", "beat": 3.5, "velocity": 60},
      {"instrument": "maracas", "beat": 4, "velocity": 55}
    ]
  },
  "country_6": {
    name: "Party Country (Inspired by Morgan Wallen - 'I Got Better' rhythm)",
    category: "Country",
    bpm: 106,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 95},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 65},
      {"instrument": "open_hihat", "beat": 4, "velocity": 65},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 70},
      {"instrument": "maracas", "beat": 4, "velocity": 65}
    ]
  },
  "country_7": {
    name: "Heartland Ballad (Inspired by Morgan Wallen - 'Just In Case' style)",
    category: "Country",
    bpm: 82,
    sequence: [
      {"instrument": "bass_drum", "beat": 1.5, "velocity": 85},
      {"instrument": "snare_drum", "beat": 3, "velocity": 75},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
      {"instrument": "open_hihat", "beat": 4, "velocity": 65},
      // Removed accent: {"instrument": "accent", "beat": 4.5, "velocity": 60}
    ]
  },
  "country_8": {
    name: "Outlaw Twang (Inspired by Shaboozey - 'Good News' beat)",
    category: "Country",
    bpm: 95,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "snare_drum", "beat": 2, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 55},
      {"instrument": "cowbell", "beat": 3.5, "velocity": 70}
    ]
  },
  "country_9": {
    name: "Neon Nights (Inspired by Shaboozey - 'A Bar Song (Tipsy)' groove)",
    category: "Country",
    bpm: 104,
    sequence: [
      // TR-808 Bass Drum - neon country foundation with honky-tonk spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 98},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 92},
      
      // TR-909 Snare - neon country backbeat with bar room character
      {"instrument": "snare_drum", "beat": 2.25, "velocity": 88},
      {"instrument": "snare_drum", "beat": 4, "velocity": 94},
      {"instrument": "snare_drum", "beat": 1.5, "velocity": 32}, // Subtle ghost note
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 28}, // Subtle ghost note
      
      // TR-909 Hi-Hat - neon country pattern with breathing space
      {"instrument": "closed_hihat", "beat": 2, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 62},
      
      // TR-909 Open Hi-Hat - neon country atmosphere
      {"instrument": "open_hihat", "beat": 2.75, "velocity": 68},
      {"instrument": "open_hihat", "beat": 4.75, "velocity": 72},
      
      // TR-808 Cowbell - neon country signature element
      {"instrument": "cowbell", "beat": 1.25, "velocity": 78},
      {"instrument": "cowbell", "beat": 3.25, "velocity": 82},
      {"instrument": "cowbell", "beat": 4.25, "velocity": 75},
      
      // TR-808 Claves - neon country percussive texture
      {"instrument": "claves", "beat": 2.5, "velocity": 65},
      {"instrument": "claves", "beat": 4.75, "velocity": 70},
      
      // TR-808 Toms - neon country fills
      {"instrument": "ht", "beat": 1.75, "velocity": 72},
      {"instrument": "mt", "beat": 3.75, "velocity": 78},
      {"instrument": "tom_low", "beat": 4.5, "velocity": 82},
      
      // TR-808 Maracas - neon country texture with space
      {"instrument": "ma", "beat": 1.5, "velocity": 58},
      {"instrument": "ma", "beat": 3.25, "velocity": 62},
      
      // TR-909 Cymbals - neon country atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 102},
      {"instrument": "cym", "beat": 3.5, "velocity": 88},
      
      // TR-808 Accent - neon country dynamics
      // Removed accent: {"instrument": "accent", "beat": 2.25, "velocity": 82},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 88}
    ]
  },
  "country_10": {
    name: "Traditional Stomp (Inspired by Koe Wetzel & Jessie Murph - 'High Road' rhythm)",
    category: "Country",
    bpm: 96,
    sequence: [
      // TR-808 Bass Drum - traditional country stomp foundation with authentic spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 108},
      {"instrument": "bass_drum", "beat": 2.75, "velocity": 102},
      {"instrument": "bass_drum", "beat": 4.25, "velocity": 98},
      
      // TR-909 Snare - traditional country stomp backbeat with character
      {"instrument": "snare_drum", "beat": 2, "velocity": 96},
      {"instrument": "snare_drum", "beat": 4, "velocity": 100},
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 36}, // Traditional ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 32}, // Traditional ghost note
      
      // TR-909 Hi-Hat - traditional country stomp pattern with space
      {"instrument": "closed_hihat", "beat": 1.75, "velocity": 58},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 62},
      
      // TR-909 Open Hi-Hat - traditional country stomp atmosphere
      {"instrument": "open_hihat", "beat": 2.5, "velocity": 72},
      {"instrument": "open_hihat", "beat": 4.75, "velocity": 76},
      
      // TR-808 Cowbell - traditional country stomp signature
      {"instrument": "cowbell", "beat": 1.5, "velocity": 75},
      {"instrument": "cowbell", "beat": 3.75, "velocity": 82},
      
      // TR-808 Claves - traditional country stomp percussive character
      {"instrument": "claves", "beat": 2.25, "velocity": 68},
      {"instrument": "claves", "beat": 4.5, "velocity": 72},
      
      // TR-808 Toms - traditional country stomp fills
      {"instrument": "ht", "beat": 2.75, "velocity": 78},
      {"instrument": "mt", "beat": 4.25, "velocity": 82},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 88},
      
      // TR-808 Rimshot - traditional country stomp percussion
      {"instrument": "rimshot", "beat": 1, "velocity": 85},
      {"instrument": "rimshot", "beat": 3, "velocity": 82},
      
      // TR-808 Congas - traditional country stomp groove depth
      {"instrument": "conga_high", "beat": 1.75, "velocity": 68},
      {"instrument": "conga_mid", "beat": 2.5, "velocity": 75},
      {"instrument": "conga_low", "beat": 4, "velocity": 82},
      
      // TR-909 Cymbals - traditional country stomp atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 105},
      {"instrument": "cym", "beat": 3.25, "velocity": 92},
      
      // TR-808 Accent - traditional country stomp dynamics
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 88},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
    ]
  },

  // ===== R&B CATEGORY (10 sequences) =====
  "rnb_1": {
    name: "Smooth Groove (Inspired by Leon Thomas - 'Mutt' vibe)",
    category: "R&B",
    bpm: 95,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 90},
      {"instrument": "snare_drum", "beat": 3, "velocity": 80},
      {"instrument": "bass_drum", "beat": 3, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
      {"instrument": "maracas", "beat": 2, "velocity": 60},
      {"instrument": "claves", "beat": 4, "velocity": 65},
      // Removed accent: {"instrument": "accent", "beat": 4.5, "velocity": 70},
      {"instrument": "rimshot", "beat": 4, "velocity": 75}
    ]
  },
  "rnb_2": {
    name: "Soulful Build (Inspired by PARTYNEXTDOOR, Drake & Cash Cobain - 'Somebody Loves Me' groove)",
    category: "R&B",
    bpm: 98,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 95},
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 60},
      {"instrument": "rimshot", "beat": 4.5, "velocity": 75}
    ]
  },
  "rnb_3": {
    name: "Neo-Soul (Inspired by Justin Bieber - 'Yukon' style)",
    category: "R&B",
    bpm: 90,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 85},
      {"instrument": "snare_drum", "beat": 3, "velocity": 75},
      {"instrument": "bass_drum", "beat": 3, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
      {"instrument": "maracas", "beat": 2, "velocity": 60},
      {"instrument": "claves", "beat": 4, "velocity": 65},
      // Removed accent: {"instrument": "accent", "beat": 4.5, "velocity": 70},
      {"instrument": "tom_low", "beat": 4, "velocity": 55}
    ]
  },
  "rnb_4": {
    name: "Trap R&B (Inspired by Kehlani - 'Folded' beat)",
    category: "R&B",
    bpm: 105,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 100},
      {"instrument": "snare_drum", "beat": 3, "velocity": 90},
      {"instrument": "bass_drum", "beat": 3, "velocity": 100},
      {"instrument": "open_hihat", "beat": 1, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 60},
      {"instrument": "open_hihat", "beat": 3, "velocity": 60},
      {"instrument": "open_hihat", "beat": 4, "velocity": 60},
      // Removed accent: {"instrument": "accent", "beat": 2.5, "velocity": 75},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 105}
    ]
  },
  "rnb_5": {
    name: "Vocal Layers (Inspired by Kendrick Lamar & SZA - 'Luther' rhythm)",
    category: "R&B",
    bpm: 93,
    sequence: [
      {"instrument": "bass_drum", "beat": 1.5, "velocity": 85},
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 75},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 85},
      {"instrument": "rimshot", "beat": 2, "velocity": 80},
      {"instrument": "closed_hihat", "beat": 1, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 50},
      {"instrument": "crash_cymbal", "beat": 4.5, "velocity": 90},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 65}
    ]
  },
  "rnb_6": {
    name: "Alternative R&B (Inspired by Playboi Carti - 'Evil J0rdan' groove)",
    category: "R&B",
    bpm: 130,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 95},
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4, "velocity": 55},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 70}
    ]
  },
  "rnb_7": {
    name: "Funk Revival (Inspired by Playboi Carti & The Weeknd - 'Rather Lie' style)",
    category: "R&B",
    bpm: 100,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 105},
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "bass_drum", "beat": 3, "velocity": 105},
      {"instrument": "snare_drum", "beat": 4, "velocity": 95},
      {"instrument": "closed_hihat", "beat": 1, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3, "velocity": 65},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 65},
      {"instrument": "cowbell", "beat": 2, "velocity": 70}
    ]
  },
  "rnb_8": {
    name: "Emotional Soul (Inspired by The Weeknd & Playboi Carti - 'Timeless' rhythm)",
    category: "R&B",
    bpm: 97,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 90},
      {"instrument": "snare_drum", "beat": 3, "velocity": 80},
      {"instrument": "bass_drum", "beat": 3, "velocity": 90},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
      {"instrument": "maracas", "beat": 2, "velocity": 60},
      {"instrument": "claves", "beat": 4, "velocity": 65},
      // Removed accent: {"instrument": "accent", "beat": 4.5, "velocity": 70},
      {"instrument": "rimshot", "beat": 4, "velocity": 75}
    ]
  },
  "rnb_9": {
    name: "Retro Smooth (Inspired by Chris Brown - 'Residuals' groove)",
    category: "R&B",
    bpm: 103,
    sequence: [
      {"instrument": "bass_drum", "beat": 1.5, "velocity": 95},
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 85},
      {"instrument": "bass_drum", "beat": 3.5, "velocity": 95},
      {"instrument": "open_hihat", "beat": 1, "velocity": 60},
      {"instrument": "open_hihat", "beat": 2, "velocity": 60},
      {"instrument": "open_hihat", "beat": 4, "velocity": 60},
      {"instrument": "crash_cymbal", "beat": 4.5, "velocity": 100},
      // Removed accent: {"instrument": "accent", "beat": 2.5, "velocity": 75},
      {"instrument": "cowbell", "beat": 3, "velocity": 70}
    ]
  },
  "rnb_10": {
    name: "Vulnerable Flow (Inspired by Mariah the Scientist - 'Burning Blue' style)",
    category: "R&B",
    bpm: 89,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 85},
      {"instrument": "snare_drum", "beat": 3, "velocity": 75},
      {"instrument": "bass_drum", "beat": 3, "velocity": 85},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 50},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 50},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 60},
      {"instrument": "tom_mid", "beat": 4.5, "velocity": 65}
    ]
  },

  // ===== TRANCE CATEGORY (10 sequences) =====
  "trance_1": {
    name: "Uplifting Build (Armin van Buuren style)",
    category: "Trance",
    bpm: 134,
    sequence: [
      // TR-808 Bass Drum - trance uplifting build foundation with progressive power
      {"instrument": "bass_drum", "beat": 1, "velocity": 114},
      {"instrument": "bass_drum", "beat": 2, "velocity": 118},
      {"instrument": "bass_drum", "beat": 3, "velocity": 122},
      {"instrument": "bass_drum", "beat": 4, "velocity": 116},
      {"instrument": "bass_drum", "beat": 2.5, "velocity": 105}, // Uplifting syncopation
      
      // TR-909 Snare - trance uplifting build backbeat with progressive energy
      {"instrument": "snare_drum", "beat": 2, "velocity": 98},
      {"instrument": "snare_drum", "beat": 4, "velocity": 102},
      {"instrument": "snare_drum", "beat": 3.75, "velocity": 88}, // Build accent
      {"instrument": "snare_drum", "beat": 1.25, "velocity": 44}, // Ghost note
      {"instrument": "snare_drum", "beat": 4.5, "velocity": 48}, // Ghost note
      
      // TR-909 Hi-Hat - trance uplifting build pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 62},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 68},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 58},
      {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
      
      // TR-909 Open Hi-Hat - trance uplifting build atmosphere
      {"instrument": "open_hihat", "beat": 1.75, "velocity": 82},
      {"instrument": "open_hihat", "beat": 3, "velocity": 88},
      {"instrument": "open_hihat", "beat": 4.25, "velocity": 78},
      
      // TR-808 Cowbell - trance uplifting build metallic texture
      {"instrument": "cowbell", "beat": 2.75, "velocity": 76},
      {"instrument": "cowbell", "beat": 4.5, "velocity": 82},
      
      // TR-808 Claves - trance uplifting build percussive elements
      {"instrument": "claves", "beat": 1.25, "velocity": 72},
      {"instrument": "claves", "beat": 3.25, "velocity": 78},
      
      // TR-808 Toms - trance uplifting build progressive fills
      {"instrument": "ht", "beat": 1.75, "velocity": 88},
      {"instrument": "ht", "beat": 3.5, "velocity": 92},
      {"instrument": "mt", "beat": 2.25, "velocity": 95},
      {"instrument": "mt", "beat": 4.25, "velocity": 85},
      {"instrument": "tom_low", "beat": 3.75, "velocity": 98},
      
      // TR-808 Rimshot - trance uplifting build percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 86},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 82},
      {"instrument": "rimshot", "beat": 4, "velocity": 90},
      
      // TR-808 Congas - trance uplifting build groove depth
      {"instrument": "conga_high", "beat": 1.5, "velocity": 78},
      {"instrument": "conga_high", "beat": 3.25, "velocity": 74},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 84},
      {"instrument": "conga_mid", "beat": 4.75, "velocity": 80},
      {"instrument": "conga_low", "beat": 2.75, "velocity": 90},
      {"instrument": "conga_low", "beat": 4.25, "velocity": 94},
      
      // TR-808 Maracas - trance uplifting build high-frequency texture
      {"instrument": "ma", "beat": 1.25, "velocity": 64},
      {"instrument": "ma", "beat": 3.5, "velocity": 68},
      
      // TR-909 Cymbals - trance uplifting build climax and atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 112},
      {"instrument": "crash_cymbal", "beat": 3, "velocity": 108},
      {"instrument": "cym", "beat": 2.5, "velocity": 96},
      {"instrument": "cym", "beat": 4.5, "velocity": 102},
      
      // TR-808 Accent - trance uplifting build progressive dynamics
      // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 96},
      // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 92},
      // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 104},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 108}
    ]
  },
  "trance_2": {
    name: "Progressive Pulse (Above & Beyond style)",
    category: "Trance",
    bpm: 132,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 115},
      {"instrument": "bass_drum", "beat": 3, "velocity": 115},
      {"instrument": "snare_drum", "beat": 2, "velocity": 100},
      {"instrument": "snare_drum", "beat": 4, "velocity": 100},
      {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 2.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 3.25, "velocity": 55},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 55},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 75}
    ]
  },
  "trance_3": {
    name: "Vocal Trance (Ferry Corsten style)",
    category: "Trance",
    bpm: 136,
    sequence: [
      {"instrument": "bass_drum", "beat": 1, "velocity": 110},
      {"instrument": "bass_drum", "beat": 2, "velocity": 110},
      {"instrument": "bass_drum", "beat": 3, "velocity": 110},
      {"instrument": "bass_drum", "beat": 4, "velocity": 110},
      {"instrument": "snare_drum", "beat": 2, "velocity": 95},
      {"instrument": "snare_drum", "beat": 4, "velocity": 95},
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
      {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 115}
    ]
  },
  "trance_4": {
      name: "Psy-Trance Fusion (Infected Mushroom style)",
      category: "Trance",
      bpm: 140,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 115},
        {"instrument": "bass_drum", "beat": 2, "velocity": 115},
        {"instrument": "bass_drum", "beat": 3, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4, "velocity": 115},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 70}
      ]
    },
    "trance_5": {
      name: "Euphoric Rise (Gareth Emery style)",
      category: "Trance",
      bpm: 136,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 120},
        {"instrument": "bass_drum", "beat": 2, "velocity": 120},
        {"instrument": "bass_drum", "beat": 3, "velocity": 120},
        {"instrument": "bass_drum", "beat": 4, "velocity": 120},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 75},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 110}
      ]
    },
    "trance_6": {
      name: "Dreamy Layers (Paul van Dyk style)",
      category: "Trance",
      bpm: 134,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 3, "velocity": 110},
        {"instrument": "snare_drum", "beat": 2, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4, "velocity": 95},
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 50},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 105}
      ]
    },
    "trance_7": {
      name: "High-Energy Peak (Aly & Fila style)",
      category: "Trance",
      bpm: 142,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 120},
        {"instrument": "bass_drum", "beat": 2, "velocity": 120},
        {"instrument": "bass_drum", "beat": 3, "velocity": 120},
        {"instrument": "bass_drum", "beat": 4, "velocity": 120},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 80},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 115}
      ]
    },
    "trance_8": {
      name: "Melodic Break (Giuseppe Ottaviani style)",
      category: "Trance",
      bpm: 138,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 3, "velocity": 110},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 90},
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 90},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 55},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 70}
      ]
    },
    "trance_9": {
      name: "Psy Fusion (Infected Mushroom style)",
      category: "Trance",
      bpm: 145,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 115},
        {"instrument": "bass_drum", "beat": 2, "velocity": 115},
        {"instrument": "bass_drum", "beat": 3, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4, "velocity": 115},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 60},
        {"instrument": "open_hihat", "beat": 3.5, "velocity": 75},
        {"instrument": "rimshot", "beat": 4.5, "velocity": 80}
      ]
    },
    "trance_10": {
      name: "Vocal Harmony (Cosmic Gate style)",
      category: "Trance",
      bpm: 136,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 3, "velocity": 110},
        {"instrument": "snare_drum", "beat": 2, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4, "velocity": 95},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 70},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 110}
      ]
    },

    // ===== K-POP CATEGORY (10 sequences) =====
    "kpop_1": {
      name: "Syncopated Beat (BTS style)",
      category: "K-Pop",
      bpm: 116,
      sequence: [
        // TR-808 Bass Drum - K-pop syncopated foundation with dynamic spacing
        {"instrument": "bass_drum", "beat": 1, "velocity": 108},
        {"instrument": "bass_drum", "beat": 2.75, "velocity": 95},
        {"instrument": "bass_drum", "beat": 3.25, "velocity": 102},
        {"instrument": "bass_drum", "beat": 4.5, "velocity": 88},
        
        // TR-909 Snare - K-pop syncopated backbeat with precision
        {"instrument": "snare_drum", "beat": 2, "velocity": 96},
        {"instrument": "snare_drum", "beat": 4, "velocity": 100},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 85}, // Syncopated accent
        {"instrument": "snare_drum", "beat": 4.25, "velocity": 82}, // Syncopated accent
        {"instrument": "snare_drum", "beat": 1.5, "velocity": 42}, // Ghost note
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 38}, // Ghost note
        
        // TR-909 Hi-Hat - K-pop syncopated pattern with breathing space
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
        
        // TR-909 Open Hi-Hat - K-pop syncopated atmosphere
        {"instrument": "open_hihat", "beat": 1.75, "velocity": 78},
        {"instrument": "open_hihat", "beat": 3, "velocity": 82},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 75},
        
        // TR-808 Cowbell - K-pop syncopated metallic texture
        {"instrument": "cowbell", "beat": 2.25, "velocity": 72},
        {"instrument": "cowbell", "beat": 4.25, "velocity": 76},
        
        // TR-808 Claves - K-pop syncopated percussive elements
        {"instrument": "claves", "beat": 1.75, "velocity": 68},
        {"instrument": "claves", "beat": 3.25, "velocity": 72},
        
        // TR-808 Toms - K-pop syncopated melodic fills
        {"instrument": "ht", "beat": 1.5, "velocity": 82},
        {"instrument": "ht", "beat": 3.75, "velocity": 78},
        {"instrument": "mt", "beat": 2.5, "velocity": 88},
        {"instrument": "mt", "beat": 4.5, "velocity": 85},
        {"instrument": "tom_low", "beat": 3.5, "velocity": 92},
        
        // TR-808 Rimshot - K-pop syncopated percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 82},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 78},
        {"instrument": "rimshot", "beat": 4, "velocity": 86},
        
        // TR-808 Congas - K-pop syncopated groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 75},
        {"instrument": "conga_high", "beat": 3.5, "velocity": 72},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 80},
        {"instrument": "conga_mid", "beat": 4.75, "velocity": 78},
        {"instrument": "conga_low", "beat": 2.75, "velocity": 85},
        {"instrument": "conga_low", "beat": 4.25, "velocity": 88},
        
        // TR-808 Maracas - K-pop syncopated high-frequency texture
        {"instrument": "ma", "beat": 1.75, "velocity": 62},
        {"instrument": "ma", "beat": 3.25, "velocity": 66},
        
        // TR-909 Cymbals - K-pop syncopated impact and atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 98},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 95},
        {"instrument": "cym", "beat": 2.5, "velocity": 88},
        {"instrument": "cym", "beat": 4.5, "velocity": 92},
        
        // TR-808 Accent - K-pop syncopated dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 92},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 88},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 96},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 100}
      ]
    },
    "kpop_2": {
      name: "High-Energy Drop (Stray Kids style)",
      category: "K-Pop",
      bpm: 130,
      sequence: [
        // TR-808 Bass Drum - K-pop high-energy drop foundation with explosive power
        {"instrument": "bass_drum", "beat": 1, "velocity": 118},
        {"instrument": "bass_drum", "beat": 2, "velocity": 112},
        {"instrument": "bass_drum", "beat": 3, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4, "velocity": 108},
        {"instrument": "bass_drum", "beat": 1.5, "velocity": 100}, // High-energy double kick
        {"instrument": "bass_drum", "beat": 3.75, "velocity": 105}, // Drop accent
        
        // TR-909 Snare - K-pop high-energy drop backbeat with explosive snap
        {"instrument": "snare_drum", "beat": 2, "velocity": 110},
        {"instrument": "snare_drum", "beat": 4, "velocity": 115},
        {"instrument": "snare_drum", "beat": 2.25, "velocity": 92}, // Drop roll
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 95}, // Drop buildup
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 48}, // Ghost note
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 45}, // Ghost note
        
        // TR-909 Hi-Hat - K-pop high-energy drop pattern with explosive spacing
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 75},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 62},
        
        // TR-909 Open Hi-Hat - K-pop high-energy drop atmosphere
        {"instrument": "open_hihat", "beat": 1.5, "velocity": 88},
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 92},
        {"instrument": "open_hihat", "beat": 4, "velocity": 95},
        {"instrument": "open_hihat", "beat": 4.75, "velocity": 82},
        
        // TR-808 Cowbell - K-pop high-energy drop metallic power
        {"instrument": "cowbell", "beat": 2.25, "velocity": 85},
        {"instrument": "cowbell", "beat": 4.5, "velocity": 90},
        
        // TR-808 Claves - K-pop high-energy drop percussive drive
        {"instrument": "claves", "beat": 1.75, "velocity": 78},
        {"instrument": "claves", "beat": 3.75, "velocity": 82},
        
        // TR-808 Toms - K-pop high-energy drop explosive fills
        {"instrument": "ht", "beat": 1.25, "velocity": 95},
        {"instrument": "ht", "beat": 3.25, "velocity": 98},
        {"instrument": "mt", "beat": 2.5, "velocity": 102},
        {"instrument": "mt", "beat": 4.25, "velocity": 88},
        {"instrument": "tom_low", "beat": 3.5, "velocity": 108},
        
        // TR-808 Rimshot - K-pop high-energy drop percussion power
        {"instrument": "rimshot", "beat": 1, "velocity": 92},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 88},
        {"instrument": "rimshot", "beat": 4, "velocity": 98},
        
        // TR-808 Congas - K-pop high-energy drop groove complexity
        {"instrument": "conga_high", "beat": 1.5, "velocity": 85},
        {"instrument": "conga_high", "beat": 3.25, "velocity": 82},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 92},
        {"instrument": "conga_mid", "beat": 4.75, "velocity": 88},
        {"instrument": "conga_low", "beat": 2.75, "velocity": 98},
        {"instrument": "conga_low", "beat": 4.25, "velocity": 102},
        
        // TR-808 Maracas - K-pop high-energy drop high-frequency explosion
        {"instrument": "ma", "beat": 1.75, "velocity": 72},
        {"instrument": "ma", "beat": 3.5, "velocity": 76},
        
        // TR-909 Cymbals - K-pop high-energy drop explosive climax
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 120},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 115},
        {"instrument": "cym", "beat": 2.5, "velocity": 105},
        {"instrument": "cym", "beat": 4.5, "velocity": 110},
        
        // TR-808 Accent - K-pop high-energy drop explosive dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 108},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 102},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 112},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 118}
      ]
    },
    "kpop_3": {
      name: "Melodic Sync (BLACKPINK style)",
      category: "K-Pop",
      bpm: 114,
      sequence: [
        // TR-808 Bass Drum - K-pop melodic sync foundation with synchronized power
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 2.5, "velocity": 102},
        {"instrument": "bass_drum", "beat": 3.75, "velocity": 108},
        
        // TR-909 Snare - K-pop melodic sync backbeat with synchronized snap
        {"instrument": "snare_drum", "beat": 2, "velocity": 94},
        {"instrument": "snare_drum", "beat": 4, "velocity": 100},
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 88}, // Sync accent
        {"instrument": "snare_drum", "beat": 1.5, "velocity": 38}, // Ghost note
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 42}, // Ghost note
        
        // TR-909 Hi-Hat - K-pop melodic sync pattern with breathing space
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 52},
        
        // TR-909 Open Hi-Hat - K-pop melodic sync atmosphere
        {"instrument": "open_hihat", "beat": 1.75, "velocity": 75},
        {"instrument": "open_hihat", "beat": 3.5, "velocity": 82},
        {"instrument": "open_hihat", "beat": 4.75, "velocity": 68},
        
        // TR-808 Cowbell - K-pop melodic sync texture
        {"instrument": "cowbell", "beat": 2.25, "velocity": 72},
        {"instrument": "cowbell", "beat": 4.5, "velocity": 78},
        
        // TR-808 Claves - K-pop melodic sync percussive elements
        {"instrument": "claves", "beat": 1.5, "velocity": 68},
        {"instrument": "claves", "beat": 3.75, "velocity": 72},
        
        // TR-808 Toms - K-pop melodic sync fills
        {"instrument": "ht", "beat": 2.5, "velocity": 85},
        {"instrument": "mt", "beat": 3.25, "velocity": 92},
        {"instrument": "tom_low", "beat": 4.25, "velocity": 98},
        
        // TR-808 Rimshot - K-pop melodic sync percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 85},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 82},
        {"instrument": "rimshot", "beat": 4, "velocity": 88},
        
        // TR-808 Congas - K-pop melodic sync groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 75},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 82},
        {"instrument": "conga_low", "beat": 3.5, "velocity": 88},
        
        // TR-909 Cymbals - K-pop melodic sync impact
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 105},
        {"instrument": "cym", "beat": 3.25, "velocity": 98},
        
        // TR-808 Accent - K-pop melodic sync dynamics
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 88},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 95}
      ]
    },
    "kpop_4": {
      name: "Bubblegum Pop (NewJeans style)",
      category: "K-Pop",
      bpm: 112,
      sequence: [
        // TR-808 Bass Drum - bubblegum K-pop foundation with playful bounce
        {"instrument": "bass_drum", "beat": 1, "velocity": 103},
        {"instrument": "bass_drum", "beat": 2.25, "velocity": 96},
        {"instrument": "bass_drum", "beat": 3.5, "velocity": 100},
        
        // TR-909 Snare - bubblegum K-pop backbeat with sweet snap
        {"instrument": "snare_drum", "beat": 2, "velocity": 88},
        {"instrument": "snare_drum", "beat": 4, "velocity": 92},
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 35}, // Bubbly ghost note
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 32}, // Bubbly ghost note
        
        // TR-909 Hi-Hat - bubblegum K-pop pattern with playful spacing
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 55},
        
        // TR-909 Open Hi-Hat - bubblegum K-pop atmosphere
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 75},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 82},
        
        // TR-808 Cowbell - bubblegum K-pop playful texture
        {"instrument": "cowbell", "beat": 1.25, "velocity": 68},
        {"instrument": "cowbell", "beat": 3.75, "velocity": 72},
        
        // TR-808 Toms - bubblegum K-pop melodic fills
        {"instrument": "ht", "beat": 2.25, "velocity": 78},
        {"instrument": "mt", "beat": 3.5, "velocity": 85},
        {"instrument": "tom_low", "beat": 4.75, "velocity": 88},
        
        // TR-808 Congas - bubblegum K-pop groove sweetness
        {"instrument": "conga_high", "beat": 1.75, "velocity": 72},
        {"instrument": "conga_mid", "beat": 2.5, "velocity": 78},
        {"instrument": "conga_low", "beat": 4, "velocity": 85},
        
        // TR-808 Maracas - bubblegum K-pop sparkle
        {"instrument": "ma", "beat": 1.5, "velocity": 58},
        {"instrument": "ma", "beat": 3.25, "velocity": 62},
        
        // TR-909 Cymbals - bubblegum K-pop sparkle
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
        {"instrument": "cym", "beat": 3.5, "velocity": 95},
        
        // TR-808 Accent - bubblegum K-pop sweet dynamics
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 85},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 92}
      ]
    },
    "kpop_5": {
      name: "Boy Band Sync (SEVENTEEN style)",
      category: "K-Pop",
      bpm: 122,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 105},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 90},
        {"instrument": "bass_drum", "beat": 3, "velocity": 105},
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 90},
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 55},
        {"instrument": "open_hihat", "beat": 4, "velocity": 70},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 105}
      ]
    },
    "kpop_6": {
      name: "Girl Group Power (TWICE style)",
      category: "K-Pop",
      bpm: 120,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 100},
        {"instrument": "snare_drum", "beat": 2, "velocity": 90},
        {"instrument": "bass_drum", "beat": 3, "velocity": 100},
        {"instrument": "snare_drum", "beat": 4, "velocity": 90},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 75},
        {"instrument": "rimshot", "beat": 4, "velocity": 80}
      ]
    },
    "kpop_7": {
      name: "Retro K-Pop (aespa style)",
      category: "K-Pop",
      bpm: 110,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 95},
        {"instrument": "snare_drum", "beat": 3, "velocity": 85},
        {"instrument": "bass_drum", "beat": 3, "velocity": 95},
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 50},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 70},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 100}
      ]
    },
    "kpop_8": {
      name: "Dynamic Shift (ENHYPEN style)",
      category: "K-Pop",
      bpm: 124,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 105},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 95},
        {"instrument": "bass_drum", "beat": 3, "velocity": 105},
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 95},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "open_hihat", "beat": 4, "velocity": 75},
        {"instrument": "rimshot", "beat": 4.5, "velocity": 80}
      ]
    },
    "kpop_9": {
      name: "Choreo Beat (ATEEZ style)",
      category: "K-Pop",
      bpm: 125,
      sequence: [
        // TR-808 Bass Drum - K-pop choreo foundation with dance-ready power
        {"instrument": "bass_drum", "beat": 1, "velocity": 115},
        {"instrument": "bass_drum", "beat": 2.25, "velocity": 105},
        {"instrument": "bass_drum", "beat": 3, "velocity": 112},
        {"instrument": "bass_drum", "beat": 4.5, "velocity": 98},
        
        // TR-909 Snare - K-pop choreo backbeat with choreographic snap
        {"instrument": "snare_drum", "beat": 2, "velocity": 108},
        {"instrument": "snare_drum", "beat": 4, "velocity": 112},
        {"instrument": "snare_drum", "beat": 2.75, "velocity": 92}, // Choreo accent
        {"instrument": "snare_drum", "beat": 4.25, "velocity": 88}, // Choreo accent
        {"instrument": "snare_drum", "beat": 1.5, "velocity": 46}, // Ghost note
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 42}, // Ghost note
        
        // TR-909 Hi-Hat - K-pop choreo pattern with dance spacing
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 75},
        
        // TR-909 Open Hi-Hat - K-pop choreo atmosphere
        {"instrument": "open_hihat", "beat": 1.75, "velocity": 85},
        {"instrument": "open_hihat", "beat": 3.5, "velocity": 88},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 78},
        
        // TR-808 Cowbell - K-pop choreo metallic texture
        {"instrument": "cowbell", "beat": 2.25, "velocity": 78},
        {"instrument": "cowbell", "beat": 4.25, "velocity": 82},
        
        // TR-808 Claves - K-pop choreo percussive elements
        {"instrument": "claves", "beat": 1.5, "velocity": 74},
        {"instrument": "claves", "beat": 3.25, "velocity": 78},
        
        // TR-808 Toms - K-pop choreo melodic fills
        {"instrument": "ht", "beat": 1.25, "velocity": 88},
        {"instrument": "ht", "beat": 3.75, "velocity": 85},
        {"instrument": "mt", "beat": 2.5, "velocity": 92},
        {"instrument": "mt", "beat": 4.5, "velocity": 82},
        {"instrument": "tom_low", "beat": 3.5, "velocity": 96},
        
        // TR-808 Rimshot - K-pop choreo percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 88},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 84},
        {"instrument": "rimshot", "beat": 4, "velocity": 92},
        
        // TR-808 Congas - K-pop choreo groove depth
        {"instrument": "conga_high", "beat": 1.5, "velocity": 82},
        {"instrument": "conga_high", "beat": 3.25, "velocity": 78},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 86},
        {"instrument": "conga_mid", "beat": 4.75, "velocity": 84},
        {"instrument": "conga_low", "beat": 2.75, "velocity": 92},
        {"instrument": "conga_low", "beat": 4.25, "velocity": 96},
        
        // TR-808 Maracas - K-pop choreo high-frequency texture
        {"instrument": "ma", "beat": 1.75, "velocity": 68},
        {"instrument": "ma", "beat": 3.5, "velocity": 72},
        
        // TR-909 Cymbals - K-pop choreo impact and atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 118},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 115},
        {"instrument": "cym", "beat": 2.5, "velocity": 102},
        {"instrument": "cym", "beat": 4.5, "velocity": 108},
        
        // TR-808 Accent - K-pop choreo dance dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 98},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 112},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 118}
      ]
    },
    "kpop_10": {
      name: "Youthful Pop (IVE style)",
      category: "K-Pop",
      bpm: 119,
      sequence: [
        // TR-808 Bass Drum - youthful K-pop foundation with playful bounce
        {"instrument": "bass_drum", "beat": 1, "velocity": 102},
        {"instrument": "bass_drum", "beat": 3.25, "velocity": 96},
        {"instrument": "bass_drum", "beat": 4.75, "velocity": 88},
        
        // TR-909 Snare - youthful K-pop backbeat with fresh snap
        {"instrument": "snare_drum", "beat": 2, "velocity": 92},
        {"instrument": "snare_drum", "beat": 4, "velocity": 98},
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 38}, // Youthful ghost note
        {"instrument": "snare_drum", "beat": 3.5, "velocity": 35}, // Youthful ghost note
        
        // TR-909 Hi-Hat - youthful K-pop pattern with playful spacing
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 52},
        
        // TR-909 Open Hi-Hat - youthful K-pop atmosphere
        {"instrument": "open_hihat", "beat": 2.25, "velocity": 72},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 78},
        
        // TR-808 Cowbell - youthful K-pop playful texture
        {"instrument": "cowbell", "beat": 3.75, "velocity": 68},
        
        // TR-808 Toms - youthful K-pop melodic fills
        {"instrument": "ht", "beat": 2.5, "velocity": 75},
        {"instrument": "mt", "beat": 3.25, "velocity": 82},
        {"instrument": "tom_low", "beat": 4.25, "velocity": 85},
        
        // TR-808 Congas - youthful K-pop groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 65},
        {"instrument": "conga_mid", "beat": 2.75, "velocity": 72},
        {"instrument": "conga_low", "beat": 4, "velocity": 78},
        
        // TR-909 Cymbals - youthful K-pop sparkle
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
        {"instrument": "cym", "beat": 3.5, "velocity": 95},
        
        // TR-808 Accent - youthful K-pop dynamics
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 85},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 92}
      ]
    },

    // ===== INDIE CATEGORY (10 sequences) =====
    "indie_1": {
      name: "Chill Strum (Mitski style)",
      category: "Indie",
    bpm: 94,
      sequence: [
      // TR-808 Bass Drum - chill indie foundation with relaxed spacing
      {"instrument": "bass_drum", "beat": 1, "velocity": 88},
      {"instrument": "bass_drum", "beat": 3.25, "velocity": 82},
      
      // TR-909 Snare - chill indie backbeat with organic feel
      {"instrument": "snare_drum", "beat": 2.5, "velocity": 78},
      {"instrument": "snare_drum", "beat": 4, "velocity": 85},
      {"instrument": "snare_drum", "beat": 1.75, "velocity": 35}, // Subtle ghost note
      {"instrument": "snare_drum", "beat": 3.5, "velocity": 32}, // Subtle ghost note
      
      // TR-909 Hi-Hat - chill indie pattern with breathing space
      {"instrument": "closed_hihat", "beat": 1.5, "velocity": 48},
      {"instrument": "closed_hihat", "beat": 2.75, "velocity": 52},
      {"instrument": "closed_hihat", "beat": 4.25, "velocity": 45},
      
      // TR-909 Open Hi-Hat - chill indie atmosphere
      {"instrument": "open_hihat", "beat": 2, "velocity": 65},
      {"instrument": "open_hihat", "beat": 4.5, "velocity": 70},
      
      // TR-808 Cowbell - chill indie texture
      {"instrument": "cowbell", "beat": 3.75, "velocity": 68},
      
      // TR-808 Claves - chill indie percussive elements
      {"instrument": "claves", "beat": 2.25, "velocity": 58},
      {"instrument": "claves", "beat": 4.75, "velocity": 62},
      
      // TR-808 Toms - chill indie melodic fills
      {"instrument": "ht", "beat": 1.25, "velocity": 72},
      {"instrument": "ht", "beat": 4, "velocity": 75},
      {"instrument": "mt", "beat": 2.75, "velocity": 78},
      {"instrument": "tom_low", "beat": 3.5, "velocity": 82},
      
      // TR-808 Rimshot - chill indie percussion character
      {"instrument": "rimshot", "beat": 1, "velocity": 72},
      {"instrument": "rimshot", "beat": 2.5, "velocity": 68},
      {"instrument": "rimshot", "beat": 4, "velocity": 75},
      
      // TR-808 Congas - chill indie groove depth
      {"instrument": "conga_high", "beat": 1.5, "velocity": 65},
      {"instrument": "conga_high", "beat": 3.75, "velocity": 62},
      {"instrument": "conga_mid", "beat": 2.25, "velocity": 70},
      {"instrument": "conga_mid", "beat": 4.5, "velocity": 68},
      {"instrument": "conga_low", "beat": 3, "velocity": 75},
      
      // TR-808 Maracas - chill indie texture with space
      {"instrument": "ma", "beat": 1.75, "velocity": 52},
      {"instrument": "ma", "beat": 3.25, "velocity": 55},
      
      // TR-909 Cymbals - chill indie atmosphere
      {"instrument": "crash_cymbal", "beat": 1, "velocity": 85},
      {"instrument": "cym", "beat": 3.5, "velocity": 78},
      
      // TR-808 Accent - chill indie dynamics
      // Removed accent: {"instrument": "accent", "beat": 2.5, "velocity": 75},
      // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 82}
      ]
    },
    "indie_2": {
      name: "Dreamy Wave (Phoebe Bridgers style)",
      category: "Indie",
      bpm: 86,
      sequence: [
        // TR-808 Bass Drum - dreamy indie foundation with ethereal spacing
        {"instrument": "bass_drum", "beat": 1, "velocity": 82},
        {"instrument": "bass_drum", "beat": 3.5, "velocity": 78},
        
        // TR-909 Snare - dreamy indie backbeat with soft atmospheric feel
        {"instrument": "snare_drum", "beat": 2, "velocity": 72},
        {"instrument": "snare_drum", "beat": 4, "velocity": 78},
        {"instrument": "snare_drum", "beat": 1.25, "velocity": 28}, // Whisper ghost note
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 25}, // Whisper ghost note
        
        // TR-909 Hi-Hat - dreamy indie pattern with floating space
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 42},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 48},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 38},
        
        // TR-909 Open Hi-Hat - dreamy indie atmosphere
        {"instrument": "open_hihat", "beat": 2, "velocity": 58},
        {"instrument": "open_hihat", "beat": 4.75, "velocity": 62},
        
        // TR-808 Cowbell - dreamy indie texture
        {"instrument": "cowbell", "beat": 3.25, "velocity": 55},
        
        // TR-808 Claves - dreamy indie percussive elements
        {"instrument": "claves", "beat": 1.75, "velocity": 48},
        {"instrument": "claves", "beat": 4.5, "velocity": 52},
        
        // TR-808 Toms - dreamy indie melodic fills
        {"instrument": "ht", "beat": 2.5, "velocity": 65},
        {"instrument": "ht", "beat": 4.25, "velocity": 62},
        {"instrument": "mt", "beat": 1.75, "velocity": 68},
        {"instrument": "tom_low", "beat": 3.75, "velocity": 72},
        
        // TR-808 Rimshot - dreamy indie percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 58},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 55},
        {"instrument": "rimshot", "beat": 4.25, "velocity": 62},
        
        // TR-808 Congas - dreamy indie groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 52},
        {"instrument": "conga_high", "beat": 3.5, "velocity": 48},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 58},
        {"instrument": "conga_mid", "beat": 4.75, "velocity": 55},
        {"instrument": "conga_low", "beat": 3, "velocity": 62},
        
        // TR-808 Maracas - dreamy indie texture with floating space
        {"instrument": "ma", "beat": 1.5, "velocity": 42},
        {"instrument": "ma", "beat": 3.25, "velocity": 45},
        
        // TR-909 Cymbals - dreamy indie atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 75},
        {"instrument": "cym", "beat": 3.5, "velocity": 68},
        
        // TR-808 Accent - dreamy indie dynamics
        // Removed accent: {"instrument": "accent", "beat": 2.75, "velocity": 65},
        // Removed accent: {"instrument": "accent", "beat": 4.25, "velocity": 72}
      ]
    },
    "indie_3": {
      name: "Alt Edge (Arctic Monkeys style)",
      category: "Indie",
      bpm: 135,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 105},
        {"instrument": "snare_drum", "beat": 2, "velocity": 95},
        {"instrument": "bass_drum", "beat": 3, "velocity": 105},
        {"instrument": "snare_drum", "beat": 4, "velocity": 95},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
        {"instrument": "rimshot", "beat": 4.5, "velocity": 80}
      ]
    },
    "indie_4": {
      name: "Folk-Indie (Noah Kahan style)",
      category: "Indie",
      bpm: 98,
      sequence: [
        // TR-808 Bass Drum - folk indie foundation with organic spacing
        {"instrument": "bass_drum", "beat": 1, "velocity": 92},
        {"instrument": "bass_drum", "beat": 3.75, "velocity": 86},
        
        // TR-909 Snare - folk indie backbeat with natural feel
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 82},
        {"instrument": "snare_drum", "beat": 4, "velocity": 88},
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 34}, // Organic ghost note
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 30}, // Organic ghost note
        
        // TR-909 Hi-Hat - folk indie pattern with natural breathing space
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 52},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 48},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 55},
        
        // TR-909 Open Hi-Hat - folk indie atmosphere
        {"instrument": "open_hihat", "beat": 2, "velocity": 68},
        {"instrument": "open_hihat", "beat": 4.25, "velocity": 72},
        
        // TR-808 Cowbell - folk indie texture
        {"instrument": "cowbell", "beat": 3.5, "velocity": 65},
        
        // TR-808 Claves - folk indie percussive elements
        {"instrument": "claves", "beat": 1.5, "velocity": 62},
        {"instrument": "claves", "beat": 4.75, "velocity": 58},
        
        // TR-808 Toms - folk indie melodic fills
        {"instrument": "ht", "beat": 2.25, "velocity": 75},
        {"instrument": "ht", "beat": 4.5, "velocity": 72},
        {"instrument": "mt", "beat": 1.75, "velocity": 78},
        {"instrument": "tom_low", "beat": 3.25, "velocity": 82},
        
        // TR-808 Rimshot - folk indie percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 72},
        {"instrument": "rimshot", "beat": 2.5, "velocity": 68},
        {"instrument": "rimshot", "beat": 4, "velocity": 76},
        
        // TR-808 Congas - folk indie groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 65},
        {"instrument": "conga_high", "beat": 3.75, "velocity": 62},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 72},
        {"instrument": "conga_mid", "beat": 4.25, "velocity": 68},
        {"instrument": "conga_low", "beat": 3, "velocity": 78},
        
        // TR-808 Maracas - folk indie texture with organic space
        {"instrument": "ma", "beat": 1.75, "velocity": 58},
        {"instrument": "ma", "beat": 3.5, "velocity": 62},
        
        // TR-909 Cymbals - folk indie atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 88},
        {"instrument": "cym", "beat": 3.75, "velocity": 82},
        
        // TR-808 Accent - folk indie dynamics
        // Removed accent: {"instrument": "accent", "beat": 2.5, "velocity": 78},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 85}
      ]
    },
    "indie_5": {
      name: "Shoegaze Haze (Tame Impala style)",
      category: "Indie",
      bpm: 110,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 95},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 85},
        {"instrument": "bass_drum", "beat": 3, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 85},
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 55},
        {"instrument": "open_hihat", "beat": 4, "velocity": 70},
        {"instrument": "tom_mid", "beat": 4.5, "velocity": 65}
      ]
    },
    "indie_6": {
      name: "Garage Rock (The Strokes style)",
      category: "Indie",
      bpm: 130,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 100},
        {"instrument": "snare_drum", "beat": 2, "velocity": 90},
        {"instrument": "bass_drum", "beat": 3, "velocity": 100},
        {"instrument": "snare_drum", "beat": 4, "velocity": 90},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
        {"instrument": "rimshot", "beat": 4.5, "velocity": 80}
      ]
    },
    "indie_7": {
      name: "Indie Folk (Bon Iver style)",
      category: "Indie",
      bpm: 88,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 85},
        {"instrument": "snare_drum", "beat": 3, "velocity": 75},
        {"instrument": "bass_drum", "beat": 3, "velocity": 85},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 45},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 45},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 45},
        {"instrument": "tom_low", "beat": 4.5, "velocity": 60},
        {"instrument": "claves", "beat": 2, "velocity": 65},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 70}
      ]
    },
    "indie_8": {
      name: "Psychedelic Indie (Tame Impala style)",
      category: "Indie",
      bpm: 115,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 95},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 85},
        {"instrument": "bass_drum", "beat": 3, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 85},
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 50},
        {"instrument": "open_hihat", "beat": 4, "velocity": 70},
        {"instrument": "tom_mid", "beat": 4.5, "velocity": 65}
      ]
    },
    "indie_9": {
      name: "Lo-Fi Chill (Clairo style)",
      category: "Indie",
      bpm: 92,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 90},
        {"instrument": "snare_drum", "beat": 3, "velocity": 80},
        {"instrument": "bass_drum", "beat": 3, "velocity": 90},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 50},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 65},
        {"instrument": "tom_low", "beat": 4, "velocity": 60},
        {"instrument": "rimshot", "beat": 2, "velocity": 70}
      ]
    },
    "indie_10": {
      name: "Garage Revival (The Strokes style)",
      category: "Indie",
      bpm: 138,
      sequence: [
        // TR-808 Bass Drum - garage revival foundation with raw energy
        {"instrument": "bass_drum", "beat": 1, "velocity": 105},
        {"instrument": "bass_drum", "beat": 2.75, "velocity": 98},
        {"instrument": "bass_drum", "beat": 3.25, "velocity": 102},
        {"instrument": "bass_drum", "beat": 4.5, "velocity": 95},
        
        // TR-909 Snare - garage revival backbeat with gritty character
        {"instrument": "snare_drum", "beat": 2, "velocity": 92},
        {"instrument": "snare_drum", "beat": 4, "velocity": 98},
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 85}, // Garage accent
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 42}, // Ghost note
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 38}, // Ghost note
        
        // TR-909 Hi-Hat - garage revival pattern with raw spacing
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 68},
        
        // TR-909 Open Hi-Hat - garage revival atmosphere
        {"instrument": "open_hihat", "beat": 1.5, "velocity": 82},
        {"instrument": "open_hihat", "beat": 3, "velocity": 88},
        {"instrument": "open_hihat", "beat": 4.25, "velocity": 75},
        
        // TR-808 Rimshot - garage revival percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 88},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 84},
        {"instrument": "rimshot", "beat": 4.5, "velocity": 92},
        
        // TR-808 Toms - garage revival fills
        {"instrument": "ht", "beat": 1.75, "velocity": 85},
        {"instrument": "mt", "beat": 3.25, "velocity": 92},
        {"instrument": "tom_low", "beat": 4.25, "velocity": 98},
        
        // TR-808 Congas - garage revival groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 78},
        {"instrument": "conga_mid", "beat": 2.5, "velocity": 85},
        {"instrument": "conga_low", "beat": 4, "velocity": 92},
        
        // TR-909 Cymbals - garage revival impact
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 112},
        {"instrument": "cym", "beat": 2.25, "velocity": 105},
        
        // TR-808 Accent - garage revival raw dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 105},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 98},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 112},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 118}
      ]
    },

    // ===== PSYTRANCE CATEGORY (10 sequences) =====
    "psy_1": {
      name: "Rolling Bass (Juno Reactor style)",
      category: "Psytrance",
      bpm: 142,
      sequence: [
        // TR-808 Bass Drum - psytrance rolling bass foundation with hypnotic power
        {"instrument": "bass_drum", "beat": 1, "velocity": 122},
        {"instrument": "bass_drum", "beat": 2, "velocity": 118},
        {"instrument": "bass_drum", "beat": 3, "velocity": 125},
        {"instrument": "bass_drum", "beat": 4, "velocity": 120},
        
        // TR-909 Snare - psytrance rolling bass backbeat with digital edge
        {"instrument": "snare_drum", "beat": 2, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4, "velocity": 100},
        {"instrument": "snare_drum", "beat": 2.75, "velocity": 85}, // Rolling accent
        {"instrument": "snare_drum", "beat": 1.25, "velocity": 40}, // Ghost note
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 38}, // Ghost note
        
        // TR-909 Hi-Hat - psytrance rolling bass pattern with breathing space
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 65},
        
        // TR-909 Open Hi-Hat - psytrance rolling bass atmosphere
        {"instrument": "open_hihat", "beat": 1.75, "velocity": 78},
        {"instrument": "open_hihat", "beat": 3.75, "velocity": 82},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 75},
        
        // TR-808 Cowbell - psytrance rolling bass metallic texture
        {"instrument": "cowbell", "beat": 2.25, "velocity": 76},
        {"instrument": "cowbell", "beat": 4.25, "velocity": 82},
        
        // TR-808 Claves - psytrance rolling bass percussive elements
        {"instrument": "claves", "beat": 1.5, "velocity": 72},
        {"instrument": "claves", "beat": 3.5, "velocity": 78},
        
        // TR-808 Toms - psytrance rolling bass fills with space
        {"instrument": "ht", "beat": 1.75, "velocity": 88},
        {"instrument": "ht", "beat": 4, "velocity": 92},
        {"instrument": "mt", "beat": 2.5, "velocity": 95},
        {"instrument": "mt", "beat": 4.5, "velocity": 85},
        {"instrument": "tom_low", "beat": 3.75, "velocity": 98},
        
        // TR-808 Rimshot - psytrance rolling bass percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 86},
        {"instrument": "rimshot", "beat": 2.25, "velocity": 82},
        {"instrument": "rimshot", "beat": 4, "velocity": 90},
        
        // TR-808 Congas - psytrance rolling bass groove depth
        {"instrument": "conga_high", "beat": 1.25, "velocity": 78},
        {"instrument": "conga_high", "beat": 3.5, "velocity": 74},
        {"instrument": "conga_mid", "beat": 2.5, "velocity": 84},
        {"instrument": "conga_mid", "beat": 4.75, "velocity": 80},
        {"instrument": "conga_low", "beat": 2.75, "velocity": 90},
        {"instrument": "conga_low", "beat": 4.25, "velocity": 94},
        
        // TR-808 Maracas - psytrance rolling bass high-frequency texture
        {"instrument": "ma", "beat": 1.5, "velocity": 64},
        {"instrument": "ma", "beat": 3.25, "velocity": 68},
        
        // TR-909 Cymbals - psytrance rolling bass impact and atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 105},
        {"instrument": "cym", "beat": 2.25, "velocity": 96},
        {"instrument": "cym", "beat": 4.5, "velocity": 102},
        
        // TR-808 Accent - psytrance rolling bass hypnotic dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 102},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 96},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 108},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 112}
      ]
    },
    "psy_2": {
      name: "Psy Roll (Infected Mushroom style)",
      category: "Psytrance",
      bpm: 146,
      sequence: [
        // TR-808 Bass Drum - psytrance psy roll foundation with rolling power
        {"instrument": "bass_drum", "beat": 1, "velocity": 118},
        {"instrument": "bass_drum", "beat": 2, "velocity": 112},
        {"instrument": "bass_drum", "beat": 3, "velocity": 120},
        {"instrument": "bass_drum", "beat": 4, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4.75, "velocity": 110},
        
        // TR-909 Snare - psytrance psy roll backbeat with rolling digital edge
        {"instrument": "snare_drum", "beat": 2, "velocity": 98},
        {"instrument": "snare_drum", "beat": 3.5, "velocity": 102},
        {"instrument": "snare_drum", "beat": 4.25, "velocity": 88}, // Roll accent
        {"instrument": "snare_drum", "beat": 1.5, "velocity": 42}, // Ghost note
        {"instrument": "snare_drum", "beat": 3, "velocity": 38}, // Ghost note
        
        // TR-909 Hi-Hat - psytrance psy roll pattern with rolling space
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 52},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 62},
        
        // TR-909 Open Hi-Hat - psytrance psy roll atmosphere
        {"instrument": "open_hihat", "beat": 1.5, "velocity": 72},
        {"instrument": "open_hihat", "beat": 2.75, "velocity": 78},
        {"instrument": "open_hihat", "beat": 4.25, "velocity": 68},
        
        // TR-808 Cowbell - psytrance psy roll metallic texture
        {"instrument": "cowbell", "beat": 1.75, "velocity": 74},
        {"instrument": "cowbell", "beat": 3.5, "velocity": 80},
        
        // TR-808 Claves - psytrance psy roll percussive elements
        {"instrument": "claves", "beat": 2.25, "velocity": 70},
        {"instrument": "claves", "beat": 4.75, "velocity": 76},
        
        // TR-808 Toms - psytrance psy roll fills with rolling space
        {"instrument": "ht", "beat": 1.25, "velocity": 85},
        {"instrument": "ht", "beat": 3.25, "velocity": 90},
        {"instrument": "mt", "beat": 2.75, "velocity": 92},
        {"instrument": "mt", "beat": 4.5, "velocity": 82},
        {"instrument": "tom_low", "beat": 3.75, "velocity": 95},
        
        // TR-808 Rimshot - psytrance psy roll percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 84},
        {"instrument": "rimshot", "beat": 2.5, "velocity": 88},
        {"instrument": "rimshot", "beat": 4, "velocity": 92},
        
        // TR-808 Congas - psytrance psy roll groove depth
        {"instrument": "conga_high", "beat": 1.5, "velocity": 76},
        {"instrument": "conga_high", "beat": 3.75, "velocity": 72},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 82},
        {"instrument": "conga_mid", "beat": 4.25, "velocity": 78},
        {"instrument": "conga_low", "beat": 2.75, "velocity": 88},
        {"instrument": "conga_low", "beat": 4.5, "velocity": 92},
        
        // TR-808 Maracas - psytrance psy roll high-frequency texture
        {"instrument": "ma", "beat": 1.75, "velocity": 62},
        {"instrument": "ma", "beat": 3.25, "velocity": 66},
        
        // TR-909 Cymbals - psytrance psy roll impact and atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 106},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 103},
        {"instrument": "cym", "beat": 2.5, "velocity": 94},
        {"instrument": "cym", "beat": 4.75, "velocity": 100},
        
        // TR-808 Accent - psytrance psy roll rolling dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 100},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 94},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 106},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 110}
      ]
    },
    "psy_3": {
      name: "Full-On Peak (Astrix style)",
      category: "Psytrance",
      bpm: 149,
      sequence: [
        // TR-808 Bass Drum - full-on peak foundation with peak intensity
        {"instrument": "bass_drum", "beat": 1, "velocity": 127},
        {"instrument": "bass_drum", "beat": 2, "velocity": 118},
        {"instrument": "bass_drum", "beat": 3, "velocity": 127},
        {"instrument": "bass_drum", "beat": 4, "velocity": 122},
        
        // TR-909 Snare - full-on peak backbeat with explosive energy
        {"instrument": "snare_drum", "beat": 2, "velocity": 112},
        {"instrument": "snare_drum", "beat": 4, "velocity": 118},
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 105}, // Peak accent
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 52}, // Ghost note
        
        // TR-909 Hi-Hat - full-on peak pattern with peak spacing
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 78},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 65},
        
        // TR-909 Open Hi-Hat - full-on peak atmosphere
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 95},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 102},
        
        // TR-808 Rimshot - full-on peak percussion power
        {"instrument": "rimshot", "beat": 1, "velocity": 105},
        {"instrument": "rimshot", "beat": 3, "velocity": 112},
        
        // TR-808 Toms - full-on peak explosive fills
        {"instrument": "ht", "beat": 1.75, "velocity": 108},
        {"instrument": "mt", "beat": 3.25, "velocity": 115},
        {"instrument": "tom_low", "beat": 4.25, "velocity": 122},
        
        // TR-808 Congas - full-on peak groove intensity
        {"instrument": "conga_high", "beat": 1.25, "velocity": 95},
        {"instrument": "conga_mid", "beat": 2.75, "velocity": 102},
        {"instrument": "conga_low", "beat": 4, "velocity": 112},
        
        // TR-909 Cymbals - full-on peak explosive climax
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 127},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 125},
        {"instrument": "cym", "beat": 2.25, "velocity": 118},
        
        // TR-808 Accent - full-on peak explosive dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 122},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 115},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 127},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
      ]
    },
    "psy_4": {
      name: "Goa Trance (Astral Projection style)",
      category: "Psytrance",
      bpm: 138,
      sequence: [
        // TR-808 Bass Drum - goa trance foundation with spiritual spacing
        {"instrument": "bass_drum", "beat": 1, "velocity": 118},
        {"instrument": "bass_drum", "beat": 2, "velocity": 112},
        {"instrument": "bass_drum", "beat": 3, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4, "velocity": 120},
        
        // TR-909 Snare - goa trance backbeat with mystical character
        {"instrument": "snare_drum", "beat": 2, "velocity": 96},
        {"instrument": "snare_drum", "beat": 3.5, "velocity": 102},
        {"instrument": "snare_drum", "beat": 4.67, "velocity": 88}, // Triplet accent
        {"instrument": "snare_drum", "beat": 1.33, "velocity": 40}, // Ghost note
        
        // TR-909 Hi-Hat - goa trance pattern with flowing space
        {"instrument": "closed_hihat", "beat": 1.67, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 2.33, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 3.67, "velocity": 52},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 62},
        
        // TR-909 Open Hi-Hat - goa trance atmosphere
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 78},
        {"instrument": "open_hihat", "beat": 4, "velocity": 85},
        
        // TR-808 Cowbell - goa trance metallic texture
        {"instrument": "cowbell", "beat": 1.33, "velocity": 72},
        {"instrument": "cowbell", "beat": 3.33, "velocity": 78},
        
        // TR-808 Toms - goa trance triplet fills
        {"instrument": "ht", "beat": 2.67, "velocity": 85},
        {"instrument": "mt", "beat": 3.33, "velocity": 92},
        {"instrument": "tom_low", "beat": 4.67, "velocity": 98},
        
        // TR-808 Congas - goa trance organic groove
        {"instrument": "conga_high", "beat": 1.67, "velocity": 75},
        {"instrument": "conga_mid", "beat": 3, "velocity": 82},
        {"instrument": "conga_low", "beat": 4.33, "velocity": 88},
        
        // TR-909 Cymbals - goa trance spiritual atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
        {"instrument": "cym", "beat": 3.67, "velocity": 102},
        
        // TR-808 Accent - goa trance triplet dynamics
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 92},
        // Removed accent: {"instrument": "accent", "beat": 3.5, "velocity": 105}
      ]
    },
    "psy_5": {
      name: "Hi-Tech Edge (Vini Vici style)",
      category: "Psytrance",
      bpm: 151,
      sequence: [
        // TR-808 Bass Drum - hi-tech edge foundation with digital precision
        {"instrument": "bass_drum", "beat": 1, "velocity": 125},
        {"instrument": "bass_drum", "beat": 2, "velocity": 122},
        {"instrument": "bass_drum", "beat": 3, "velocity": 127},
        {"instrument": "bass_drum", "beat": 4, "velocity": 118},
        
        // TR-909 Snare - hi-tech edge backbeat with digital precision
        {"instrument": "snare_drum", "beat": 2, "velocity": 110},
        {"instrument": "snare_drum", "beat": 4, "velocity": 115},
        {"instrument": "snare_drum", "beat": 3.7, "velocity": 98}, // Hi-tech accent
        {"instrument": "snare_drum", "beat": 1.3, "velocity": 48}, // Ghost note
        
        // TR-909 Hi-Hat - hi-tech edge pattern with precise spacing
        {"instrument": "closed_hihat", "beat": 1.6, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 2.4, "velocity": 75},
        {"instrument": "closed_hihat", "beat": 3.8, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 4.4, "velocity": 72},
        
        // TR-909 Open Hi-Hat - hi-tech edge atmosphere
        {"instrument": "open_hihat", "beat": 2.2, "velocity": 88},
        {"instrument": "open_hihat", "beat": 4.8, "velocity": 95},
        
        // TR-808 Rimshot - hi-tech edge percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 102},
        {"instrument": "rimshot", "beat": 3.4, "velocity": 108},
        
        // TR-808 Toms - hi-tech edge fills
        {"instrument": "ht", "beat": 1.4, "velocity": 105},
        {"instrument": "mt", "beat": 2.6, "velocity": 112},
        {"instrument": "tom_low", "beat": 4.2, "velocity": 118},
        
        // TR-909 Cymbals - hi-tech edge explosive impact
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 122},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 118},
        {"instrument": "cym", "beat": 2.6, "velocity": 115},
        
        // TR-808 Accent - hi-tech edge digital dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 118},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 112},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 125},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
      ]
    },
    "psy_6": {
      name: "Dark Psy (Skazi style)",
      category: "Psytrance",
      bpm: 145,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 115},
        {"instrument": "bass_drum", "beat": 2, "velocity": 115},
        {"instrument": "bass_drum", "beat": 3, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4, "velocity": 115},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 70},
        {"instrument": "rimshot", "beat": 4, "velocity": 80}
      ]
    },
    "psy_7": {
      name: "Progressive Psy (Ace Ventura style)",
      category: "Psytrance",
      bpm: 138,
      sequence: [
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 2, "velocity": 110},
        {"instrument": "bass_drum", "beat": 3, "velocity": 110},
        {"instrument": "bass_drum", "beat": 4, "velocity": 110},
        {"instrument": "snare_drum", "beat": 2, "velocity": 90},
        {"instrument": "snare_drum", "beat": 4, "velocity": 90},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 55},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 70}
      ]
    },
    "psy_8": {
      name: "Full-On Drive (Neelix style)",
      category: "Psytrance",
      bpm: 144,
      sequence: [
        // TR-808 Bass Drum - full-on drive foundation with relentless power
        {"instrument": "bass_drum", "beat": 1, "velocity": 120},
        {"instrument": "bass_drum", "beat": 2, "velocity": 112},
        {"instrument": "bass_drum", "beat": 3, "velocity": 125},
        {"instrument": "bass_drum", "beat": 4, "velocity": 110},
        
        // TR-909 Snare - full-on drive backbeat with driving energy
        {"instrument": "snare_drum", "beat": 2, "velocity": 102},
        {"instrument": "snare_drum", "beat": 4, "velocity": 108},
        {"instrument": "snare_drum", "beat": 2.75, "velocity": 92}, // Drive accent
        {"instrument": "snare_drum", "beat": 1.25, "velocity": 45}, // Ghost note
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 40}, // Ghost note
        
        // TR-909 Hi-Hat - full-on drive pattern with intense spacing
        {"instrument": "closed_hihat", "beat": 1.75, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 68},
        
        // TR-909 Open Hi-Hat - full-on drive atmosphere
        {"instrument": "open_hihat", "beat": 2.25, "velocity": 85},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 92},
        
        // TR-808 Rimshot - full-on drive percussion character
        {"instrument": "rimshot", "beat": 1, "velocity": 92},
        {"instrument": "rimshot", "beat": 2.75, "velocity": 88},
        {"instrument": "rimshot", "beat": 4, "velocity": 98},
        
        // TR-808 Toms - full-on drive fills
        {"instrument": "ht", "beat": 1.25, "velocity": 95},
        {"instrument": "mt", "beat": 3.5, "velocity": 102},
        {"instrument": "tom_low", "beat": 4.25, "velocity": 108},
        
        // TR-808 Congas - full-on drive groove intensity
        {"instrument": "conga_high", "beat": 1.5, "velocity": 82},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 88},
        {"instrument": "conga_low", "beat": 3.75, "velocity": 95},
        
        // TR-909 Cymbals - full-on drive impact
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 112},
        {"instrument": "cym", "beat": 2.5, "velocity": 105},
        
        // TR-808 Accent - full-on drive relentless dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 112},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 105},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 118},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 122}
      ]
    },
    "psy_9": {
      name: "Goa Wave (Shpongle style)",
      category: "Psytrance",
      bpm: 120,
      sequence: [
        // TR-808 Bass Drum - goa wave foundation with flowing organic spacing
        {"instrument": "bass_drum", "beat": 1, "velocity": 112},
        {"instrument": "bass_drum", "beat": 2.33, "velocity": 108}, // Triplet feel
        {"instrument": "bass_drum", "beat": 3.67, "velocity": 115}, // Triplet feel
        
        // TR-909 Snare - goa wave backbeat with psychedelic character
        {"instrument": "snare_drum", "beat": 2, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4, "velocity": 100},
        {"instrument": "snare_drum", "beat": 3.33, "velocity": 88}, // Triplet accent
        {"instrument": "snare_drum", "beat": 1.67, "velocity": 42}, // Ghost note
        
        // TR-909 Hi-Hat - goa wave pattern with flowing space
        {"instrument": "closed_hihat", "beat": 1.33, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 2.67, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 4.33, "velocity": 52},
        
        // TR-909 Open Hi-Hat - goa wave atmosphere
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 78},
        {"instrument": "open_hihat", "beat": 4.67, "velocity": 82},
        
        // TR-808 Cowbell - goa wave metallic texture
        {"instrument": "cowbell", "beat": 1.67, "velocity": 72},
        {"instrument": "cowbell", "beat": 3.33, "velocity": 78},
        
        // TR-808 Toms - goa wave triplet fills
        {"instrument": "ht", "beat": 1.5, "velocity": 85},
        {"instrument": "mt", "beat": 3, "velocity": 92},
        {"instrument": "tom_low", "beat": 4.33, "velocity": 98},
        
        // TR-808 Congas - goa wave organic groove
        {"instrument": "conga_high", "beat": 1.33, "velocity": 75},
        {"instrument": "conga_mid", "beat": 2.67, "velocity": 82},
        {"instrument": "conga_low", "beat": 4, "velocity": 88},
        
        // TR-909 Cymbals - goa wave psychedelic atmosphere
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 105},
        {"instrument": "cym", "beat": 3.67, "velocity": 98},
        
        // TR-808 Accent - goa wave triplet dynamics
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 92},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 108}
      ]
    },
    "psy_10": {
      name: "Hi-Energy Psy (Vini Vici style)",
      category: "Psytrance",
      bpm: 150,
      sequence: [
        // TR-808 Bass Drum - hi-energy psy foundation with intense power
        {"instrument": "bass_drum", "beat": 1, "velocity": 127},
        {"instrument": "bass_drum", "beat": 2, "velocity": 118},
        {"instrument": "bass_drum", "beat": 3, "velocity": 125},
        {"instrument": "bass_drum", "beat": 4, "velocity": 120},
        
        // TR-909 Snare - hi-energy psy backbeat with explosive power
        {"instrument": "snare_drum", "beat": 2, "velocity": 108},
        {"instrument": "snare_drum", "beat": 3.5, "velocity": 115},
        {"instrument": "snare_drum", "beat": 4.25, "velocity": 102}, // Energy buildup
        {"instrument": "snare_drum", "beat": 1.25, "velocity": 48}, // Ghost note
        
        // TR-909 Hi-Hat - hi-energy psy pattern with intense spacing
        {"instrument": "closed_hihat", "beat": 1.75, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 75},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 72},
        
        // TR-909 Open Hi-Hat - hi-energy psy atmosphere
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 88},
        {"instrument": "open_hihat", "beat": 4, "velocity": 95},
        
        // TR-808 Rimshot - hi-energy psy percussion power
        {"instrument": "rimshot", "beat": 1, "velocity": 102},
        {"instrument": "rimshot", "beat": 3, "velocity": 108},
        
        // TR-808 Toms - hi-energy psy explosive fills
        {"instrument": "ht", "beat": 1.25, "velocity": 105},
        {"instrument": "mt", "beat": 2.75, "velocity": 112},
        {"instrument": "tom_low", "beat": 3.75, "velocity": 118},
        
        // TR-808 Congas - hi-energy psy groove intensity
        {"instrument": "conga_high", "beat": 1.5, "velocity": 92},
        {"instrument": "conga_mid", "beat": 2.25, "velocity": 98},
        {"instrument": "conga_low", "beat": 4.25, "velocity": 108},
        
        // TR-909 Cymbals - hi-energy psy explosive climax
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 127},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 125},
        {"instrument": "cym", "beat": 2.5, "velocity": 122},
        
        // TR-808 Accent - hi-energy psy explosive dynamics
        // Removed accent: {"instrument": "accent", "beat": 1, "velocity": 125},
        // Removed accent: {"instrument": "accent", "beat": 2, "velocity": 118},
        // Removed accent: {"instrument": "accent", "beat": 3, "velocity": 127},
        // Removed accent: {"instrument": "accent", "beat": 4, "velocity": 127}
      ]
    }, 
    // ===== TREQ CATEGORY (10 sequences) — The Treq catalog =====
    // Note: the loader has no clap mapping, so these sequences use rimshot,
    // snare ghosts, and percussion color instead of handclaps.
    "treq_1": {
      name: "Misty Downtempo",
      category: "Treq",
      bpm: 88,
      sequence: [
        // Kick - soft, unsettled heartbeat
        {"instrument": "bass_drum", "beat": 1, "velocity": 96},
        {"instrument": "bass_drum", "beat": 2.75, "velocity": 78},
        {"instrument": "bass_drum", "beat": 3.5, "velocity": 88},

        // Snare - one brushed hit mid-bar, ghosts breathing around it
        {"instrument": "snare_drum", "beat": 3, "velocity": 86},
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 45}, // Ghost
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 42}, // Ghost

        // Rimshot - woodgrain taps
        {"instrument": "rimshot", "beat": 2, "velocity": 58},
        {"instrument": "rimshot", "beat": 4.25, "velocity": 52},

        // Closed hat - sparse offbeats in the mist
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 56},

        // Maracas - rain-on-tent 8ths, dynamics rising and falling
        {"instrument": "maracas", "beat": 1, "velocity": 48},
        {"instrument": "maracas", "beat": 1.5, "velocity": 40},
        {"instrument": "maracas", "beat": 2, "velocity": 52},
        {"instrument": "maracas", "beat": 2.5, "velocity": 42},
        {"instrument": "maracas", "beat": 3, "velocity": 48},
        {"instrument": "maracas", "beat": 3.5, "velocity": 40},
        {"instrument": "maracas", "beat": 4, "velocity": 52},
        {"instrument": "maracas", "beat": 4.5, "velocity": 44},

        // Open hat - one breath before the bar turns
        {"instrument": "open_hihat", "beat": 4.75, "velocity": 70},

        // Low percussion color
        {"instrument": "claves", "beat": 2.25, "velocity": 46},
        {"instrument": "low_conga", "beat": 3.25, "velocity": 55},
        {"instrument": "mid_tom", "beat": 4.75, "velocity": 58},

        // Cymbal wash - fog rolling in on the downbeat
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 70}
      ]
    },
    "treq_2": {
      name: "Ghost-Note Indie",
      category: "Treq",
      bpm: 96,
      sequence: [
        // Kick - hesitant, leaving gaps where words should be
        {"instrument": "bass_drum", "beat": 1, "velocity": 100},
        {"instrument": "bass_drum", "beat": 2.5, "velocity": 85},
        {"instrument": "bass_drum", "beat": 4.25, "velocity": 80},

        // Snare - honest backbeat, ghosts as the unsaid things
        {"instrument": "snare_drum", "beat": 2, "velocity": 95},
        {"instrument": "snare_drum", "beat": 4, "velocity": 100},
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 45}, // Ghost
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 40}, // Ghost
        {"instrument": "snare_drum", "beat": 4.75, "velocity": 50}, // Ghost

        // Closed hat - steady 8ths with dipping dynamics
        {"instrument": "closed_hihat", "beat": 1, "velocity": 70},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 3, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 52},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 66},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 54},

        // Open hat - a held breath before the last backbeat
        {"instrument": "open_hihat", "beat": 3.75, "velocity": 78},

        // Rim + claves - small wooden details
        {"instrument": "rimshot", "beat": 3, "velocity": 62},
        {"instrument": "claves", "beat": 2.75, "velocity": 48},

        // Congas - warm organic undertow
        {"instrument": "high_conga", "beat": 1.25, "velocity": 50},
        {"instrument": "mid_conga", "beat": 3.5, "velocity": 55},

        // Maracas - quiet motion
        {"instrument": "maracas", "beat": 2.25, "velocity": 45},
        {"instrument": "maracas", "beat": 4.25, "velocity": 48},

        // Toms - the sentence trailing off into the next bar
        {"instrument": "mid_tom", "beat": 4.5, "velocity": 60},
        {"instrument": "low_tom", "beat": 4.75, "velocity": 72},

        // Crash - soft downbeat wash
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 75}
      ]
    },
    "treq_3": {
      name: "Walking Folk-Pop",
      category: "Treq",
      bpm: 102,
      sequence: [
        // Kick - a walking pulse with a push into beat 3
        {"instrument": "bass_drum", "beat": 1, "velocity": 105},
        {"instrument": "bass_drum", "beat": 2.75, "velocity": 88},
        {"instrument": "bass_drum", "beat": 3, "velocity": 95},
        {"instrument": "bass_drum", "beat": 4.5, "velocity": 82},

        // Snare - confident backbeat, one soft ghost
        {"instrument": "snare_drum", "beat": 2, "velocity": 100},
        {"instrument": "snare_drum", "beat": 4, "velocity": 105},
        {"instrument": "snare_drum", "beat": 3.75, "velocity": 48}, // Ghost

        // Closed hat - steady traveling 8ths
        {"instrument": "closed_hihat", "beat": 1, "velocity": 75},
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 3, "velocity": 75},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 4, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 58},

        // Open hat - lift at the end of the road
        {"instrument": "open_hihat", "beat": 4.75, "velocity": 85},

        // Maracas - 16th pushes, the extra steps of the long way
        {"instrument": "maracas", "beat": 1.25, "velocity": 42},
        {"instrument": "maracas", "beat": 2.25, "velocity": 44},
        {"instrument": "maracas", "beat": 3.25, "velocity": 42},
        {"instrument": "maracas", "beat": 4.25, "velocity": 46},

        // Rim + claves - fence-post details along the route
        {"instrument": "rimshot", "beat": 1.75, "velocity": 55},
        {"instrument": "rimshot", "beat": 3.25, "velocity": 58},
        {"instrument": "claves", "beat": 2.25, "velocity": 50},

        // Toms - the hill before home
        {"instrument": "mid_tom", "beat": 4.25, "velocity": 78},
        {"instrument": "low_tom", "beat": 4.75, "velocity": 85},

        // Crash - setting out
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 85}
      ]
    },
    "treq_4": {
      name: "Peak Trance",
      category: "Treq",
      bpm: 134,
      sequence: [
        // Kick - quarter-note trance four-on-the-floor
        {"instrument": "bass_drum", "beat": 1, "velocity": 118},
        {"instrument": "bass_drum", "beat": 2, "velocity": 112},
        {"instrument": "bass_drum", "beat": 3, "velocity": 118},
        {"instrument": "bass_drum", "beat": 4, "velocity": 112},

        // Open hat - offbeat 8th pulse
        {"instrument": "open_hihat", "beat": 1.5, "velocity": 95},
        {"instrument": "open_hihat", "beat": 2.5, "velocity": 92},
        {"instrument": "open_hihat", "beat": 3.5, "velocity": 95},
        {"instrument": "open_hihat", "beat": 4.5, "velocity": 92},

        // Closed hat - 16th shimmer between the pulses
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 1.75, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 62},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 55},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 4.75, "velocity": 70},

        // Snare - backbeat plus a rising turn into the next bar
        {"instrument": "snare_drum", "beat": 2, "velocity": 105},
        {"instrument": "snare_drum", "beat": 4, "velocity": 108},
        {"instrument": "snare_drum", "beat": 4.75, "velocity": 80}, // Riser hit

        // Claves - plucked arp echo (up is down)
        {"instrument": "claves", "beat": 1.75, "velocity": 68},
        {"instrument": "claves", "beat": 2.75, "velocity": 70},
        {"instrument": "claves", "beat": 3.75, "velocity": 68},

        // Rimshot - circuit clicks
        {"instrument": "rimshot", "beat": 2.25, "velocity": 65},
        {"instrument": "rimshot", "beat": 4.25, "velocity": 68},

        // Toms - melodic fill into the drop
        {"instrument": "mid_tom", "beat": 4.5, "velocity": 85},
        {"instrument": "low_tom", "beat": 4.75, "velocity": 95},

        // Cymbals - phrase marker and mid-bar wash
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 115},
        {"instrument": "cym", "beat": 3, "velocity": 85}
      ]
    },
    "treq_5": {
      name: "Tribal Heartbeat",
      category: "Treq",
      bpm: 100,
      sequence: [
        // Kick - heartbeat quarters, unshakeable
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 2, "velocity": 100},
        {"instrument": "bass_drum", "beat": 3, "velocity": 110},
        {"instrument": "bass_drum", "beat": 4, "velocity": 100},

        // Toms - the rolling forest-drum engine, high to low
        {"instrument": "high_tom", "beat": 1.25, "velocity": 70},
        {"instrument": "high_tom", "beat": 1.5, "velocity": 80},
        {"instrument": "high_tom", "beat": 2.25, "velocity": 72},
        {"instrument": "high_tom", "beat": 3.25, "velocity": 70},
        {"instrument": "high_tom", "beat": 4.25, "velocity": 74},
        {"instrument": "mid_tom", "beat": 1.75, "velocity": 85},
        {"instrument": "mid_tom", "beat": 2.5, "velocity": 88},
        {"instrument": "mid_tom", "beat": 3.5, "velocity": 86},
        {"instrument": "mid_tom", "beat": 4.5, "velocity": 90},
        {"instrument": "low_tom", "beat": 2.75, "velocity": 95},
        {"instrument": "low_tom", "beat": 3.75, "velocity": 96},
        {"instrument": "low_tom", "beat": 4.75, "velocity": 105},

        // Congas - hands joining the drum circle
        {"instrument": "high_conga", "beat": 2.25, "velocity": 58},
        {"instrument": "mid_conga", "beat": 3.25, "velocity": 60},
        {"instrument": "low_conga", "beat": 4.25, "velocity": 64},

        // Claves - the rallying signal
        {"instrument": "claves", "beat": 1, "velocity": 72},
        {"instrument": "claves", "beat": 2.5, "velocity": 68},
        {"instrument": "claves", "beat": 4, "velocity": 74},

        // Snare - one defiant strike mid-bar
        {"instrument": "snare_drum", "beat": 3, "velocity": 90},

        // Minimal hats - space for the drums to speak
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 50},

        // Crash - the summit downbeat
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 110}
      ]
    },
    "treq_6": {
      name: "Indie Dance Lilt",
      category: "Treq",
      bpm: 110,
      sequence: [
        // Kick - light-footed, with a lilt
        {"instrument": "bass_drum", "beat": 1, "velocity": 105},
        {"instrument": "bass_drum", "beat": 2.5, "velocity": 90},
        {"instrument": "bass_drum", "beat": 3, "velocity": 100},
        {"instrument": "bass_drum", "beat": 4.5, "velocity": 85},

        // Snare - warm backbeat with trailing ghosts
        {"instrument": "snare_drum", "beat": 2, "velocity": 98},
        {"instrument": "snare_drum", "beat": 4, "velocity": 102},
        {"instrument": "snare_drum", "beat": 2.75, "velocity": 45}, // Ghost
        {"instrument": "snare_drum", "beat": 4.75, "velocity": 50}, // Ghost

        // Closed hat - offbeat skips plus one soft 16th
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 64},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 64},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 45}, // Skip step

        // Open hat - a swing of held hands
        {"instrument": "open_hihat", "beat": 4.25, "velocity": 78},

        // Rimshot - footsteps beside footsteps
        {"instrument": "rimshot", "beat": 1.25, "velocity": 55},
        {"instrument": "rimshot", "beat": 3.25, "velocity": 58},

        // Maracas - quarter-note stroll
        {"instrument": "maracas", "beat": 1, "velocity": 50},
        {"instrument": "maracas", "beat": 2, "velocity": 54},
        {"instrument": "maracas", "beat": 3, "velocity": 50},
        {"instrument": "maracas", "beat": 4, "velocity": 54},

        // Color notes - cowbell wink, claves, conga warmth
        {"instrument": "cowbell", "beat": 1.75, "velocity": 60},
        {"instrument": "claves", "beat": 3.75, "velocity": 52},
        {"instrument": "high_conga", "beat": 2.25, "velocity": 52},
        {"instrument": "mid_tom", "beat": 4.75, "velocity": 70},

        // Crash - stepping out the door
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 80}
      ]
    },
    "treq_7": {
      name: "Bass Drop Energy",
      category: "Treq",
      bpm: 140,
      sequence: [
        // Kick - full festival pressure, syncopated doubles
        {"instrument": "bass_drum", "beat": 1, "velocity": 125},
        {"instrument": "bass_drum", "beat": 1.75, "velocity": 95},
        {"instrument": "bass_drum", "beat": 2.5, "velocity": 110},
        {"instrument": "bass_drum", "beat": 3, "velocity": 125},
        {"instrument": "bass_drum", "beat": 3.75, "velocity": 95},
        {"instrument": "bass_drum", "beat": 4.5, "velocity": 112},

        // Snare - slamming backbeat plus a roll into the drop
        {"instrument": "snare_drum", "beat": 2, "velocity": 115},
        {"instrument": "snare_drum", "beat": 4, "velocity": 120},
        {"instrument": "snare_drum", "beat": 4.25, "velocity": 70}, // Roll
        {"instrument": "snare_drum", "beat": 4.5, "velocity": 85}, // Roll
        {"instrument": "snare_drum", "beat": 4.75, "velocity": 100}, // Roll

        // Closed hat - relentless 16th grid
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 70},
        {"instrument": "closed_hihat", "beat": 1.75, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 2.25, "velocity": 72},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 68},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 70},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 65},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 72},

        // Open hat - big offbeat gasps
        {"instrument": "open_hihat", "beat": 1.5, "velocity": 98},
        {"instrument": "open_hihat", "beat": 3.5, "velocity": 98},

        // Cowbell - hook stabs riding the hats
        {"instrument": "cowbell", "beat": 2.25, "velocity": 85},
        {"instrument": "cowbell", "beat": 4.25, "velocity": 85},

        // Rimshot - snap in the gap
        {"instrument": "rimshot", "beat": 2.75, "velocity": 80},

        // Toms - fill stacking into the turnaround
        {"instrument": "high_tom", "beat": 4.25, "velocity": 85},
        {"instrument": "mid_tom", "beat": 4.5, "velocity": 95},
        {"instrument": "low_tom", "beat": 4.75, "velocity": 110},

        // Cymbals - impact and mid-bar re-ignition
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 120},
        {"instrument": "crash_cymbal", "beat": 3, "velocity": 110},
        {"instrument": "cym", "beat": 2, "velocity": 90}
      ]
    },
    "treq_8": {
      name: "Slow Swagger Shuffle",
      category: "Treq",
      bpm: 94,
      sequence: [
        // Kick - slow swagger with a pickup into the bar
        {"instrument": "bass_drum", "beat": 1, "velocity": 110},
        {"instrument": "bass_drum", "beat": 2.75, "velocity": 90},
        {"instrument": "bass_drum", "beat": 3.5, "velocity": 100},
        {"instrument": "bass_drum", "beat": 4.75, "velocity": 85}, // Pickup

        // Snare - smoky backbeat, ghosts like a brushed shuffle
        {"instrument": "snare_drum", "beat": 2, "velocity": 105},
        {"instrument": "snare_drum", "beat": 4, "velocity": 108},
        {"instrument": "snare_drum", "beat": 1.75, "velocity": 42}, // Ghost
        {"instrument": "snare_drum", "beat": 2.5, "velocity": 40}, // Ghost
        {"instrument": "snare_drum", "beat": 3.25, "velocity": 45}, // Ghost

        // Rimshot - velvet clicks
        {"instrument": "rimshot", "beat": 2.25, "velocity": 60},
        {"instrument": "rimshot", "beat": 4.5, "velocity": 62},

        // Closed hat - lazy 16th lean, uneven dynamics for the swing feel
        {"instrument": "closed_hihat", "beat": 1.25, "velocity": 58},
        {"instrument": "closed_hihat", "beat": 1.75, "velocity": 64},
        {"instrument": "closed_hihat", "beat": 2.75, "velocity": 56},
        {"instrument": "closed_hihat", "beat": 3.25, "velocity": 60},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 64},
        {"instrument": "closed_hihat", "beat": 4.25, "velocity": 58},

        // Open hat - one slow exhale
        {"instrument": "open_hihat", "beat": 3, "velocity": 82},

        // Color - cowbell low light, claves, deep conga
        {"instrument": "cowbell", "beat": 1.5, "velocity": 68},
        {"instrument": "claves", "beat": 2.5, "velocity": 50},
        {"instrument": "low_conga", "beat": 4.25, "velocity": 70},

        // Maracas - underlying slink
        {"instrument": "maracas", "beat": 2, "velocity": 48},
        {"instrument": "maracas", "beat": 4, "velocity": 50},

        // Low tom - a nod with the pickup
        {"instrument": "low_tom", "beat": 4.75, "velocity": 75},

        // Crash - dim spotlight on 1
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 78}
      ]
    },
    "treq_9": {
      name: "Conga Circuit",
      category: "Treq",
      bpm: 122,
      sequence: [
        // Kick - four-on-the-floor circuitry
        {"instrument": "bass_drum", "beat": 1, "velocity": 115},
        {"instrument": "bass_drum", "beat": 2, "velocity": 110},
        {"instrument": "bass_drum", "beat": 3, "velocity": 115},
        {"instrument": "bass_drum", "beat": 4, "velocity": 110},

        // Congas - the tribal engine, hands over wires
        {"instrument": "high_conga", "beat": 1.5, "velocity": 85},
        {"instrument": "high_conga", "beat": 1.75, "velocity": 70},
        {"instrument": "high_conga", "beat": 2.5, "velocity": 88},
        {"instrument": "high_conga", "beat": 3.5, "velocity": 85},
        {"instrument": "high_conga", "beat": 4.5, "velocity": 88},
        {"instrument": "mid_conga", "beat": 1.25, "velocity": 65},
        {"instrument": "mid_conga", "beat": 2.25, "velocity": 75},
        {"instrument": "mid_conga", "beat": 3.25, "velocity": 72},
        {"instrument": "mid_conga", "beat": 4.25, "velocity": 78},
        {"instrument": "low_conga", "beat": 2.75, "velocity": 92},
        {"instrument": "low_conga", "beat": 4.75, "velocity": 95},

        // Claves - the clave key of the circuit
        {"instrument": "claves", "beat": 1, "velocity": 80},
        {"instrument": "claves", "beat": 3, "velocity": 76},
        {"instrument": "claves", "beat": 4.5, "velocity": 72},

        // Snare - electronic backbeat under the drums
        {"instrument": "snare_drum", "beat": 2, "velocity": 92},
        {"instrument": "snare_drum", "beat": 4, "velocity": 96},

        // Rimshot - clicking relays
        {"instrument": "rimshot", "beat": 2.25, "velocity": 68},
        {"instrument": "rimshot", "beat": 4.25, "velocity": 70},

        // Minimal hats - just a spark between beats
        {"instrument": "closed_hihat", "beat": 1.75, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 3.75, "velocity": 55},

        // Maracas - current hum on the quarters
        {"instrument": "maracas", "beat": 1, "velocity": 55},
        {"instrument": "maracas", "beat": 2, "velocity": 58},
        {"instrument": "maracas", "beat": 3, "velocity": 55},
        {"instrument": "maracas", "beat": 4, "velocity": 58},

        // Low tom - grounding thump before the turnaround
        {"instrument": "low_tom", "beat": 3.75, "velocity": 90},

        // Cymbals - power-on crash, mid-bar shimmer
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 108},
        {"instrument": "cym", "beat": 3, "velocity": 80}
      ]
    },
    "treq_10": {
      name: "Coastal Ambient",
      category: "Treq",
      bpm: 84,
      sequence: [
        // Kick - tide pulses, far apart
        {"instrument": "bass_drum", "beat": 1, "velocity": 88},
        {"instrument": "bass_drum", "beat": 2.75, "velocity": 70},
        {"instrument": "bass_drum", "beat": 4, "velocity": 72},

        // Rimshot - driftwood knock instead of a snare backbeat
        {"instrument": "rimshot", "beat": 3, "velocity": 72},
        {"instrument": "rimshot", "beat": 1.75, "velocity": 40}, // Ghost

        // Snare - barely-there brushes in the fog
        {"instrument": "snare_drum", "beat": 2, "velocity": 38}, // Ghost
        {"instrument": "snare_drum", "beat": 3.5, "velocity": 35}, // Ghost

        // Closed hat - drizzle offbeats
        {"instrument": "closed_hihat", "beat": 1.5, "velocity": 45},
        {"instrument": "closed_hihat", "beat": 2.5, "velocity": 50},
        {"instrument": "closed_hihat", "beat": 3.5, "velocity": 45},
        {"instrument": "closed_hihat", "beat": 4.5, "velocity": 52},

        // Open hat - gull cry before the bar turns
        {"instrument": "open_hihat", "beat": 4.75, "velocity": 65},

        // Maracas - surf hiss on the quarters
        {"instrument": "maracas", "beat": 1, "velocity": 42},
        {"instrument": "maracas", "beat": 2, "velocity": 46},
        {"instrument": "maracas", "beat": 3, "velocity": 42},
        {"instrument": "maracas", "beat": 4, "velocity": 46},

        // Claves - pebbles turning in the wash
        {"instrument": "claves", "beat": 2.25, "velocity": 40},
        {"instrument": "claves", "beat": 4.25, "velocity": 44},

        // Congas and toms - shapes in the mist
        {"instrument": "high_conga", "beat": 1.25, "velocity": 42},
        {"instrument": "mid_conga", "beat": 2.5, "velocity": 45},
        {"instrument": "low_conga", "beat": 3.75, "velocity": 50},
        {"instrument": "high_tom", "beat": 4.25, "velocity": 48},
        {"instrument": "low_tom", "beat": 4.5, "velocity": 55},

        // Cymbals - long horizon washes
        {"instrument": "crash_cymbal", "beat": 1, "velocity": 60},
        {"instrument": "cym", "beat": 3, "velocity": 48}
      ]
    },
    "beat_2": {
        "name": "Treq Example",
        "category": "EDM",
        "bpm": 128,
        "bars": 1,
        "sequence": [
            {"instrument": "bass_drum", "beat": 1, "velocity": 120},
            {"instrument": "bass_drum", "beat": 2, "velocity": 115},
            {"instrument": "bass_drum", "beat": 3, "velocity": 120},
            {"instrument": "bass_drum", "beat": 4, "velocity": 115},
            {"instrument": "snare_drum", "beat": 2, "velocity": 100},
            {"instrument": "snare_drum", "beat": 4, "velocity": 100},
            {"instrument": "rimshot", "beat": 1.75, "velocity": 90},
            {"instrument": "rimshot", "beat": 2.75, "velocity": 90},
            {"instrument": "rimshot", "beat": 3.75, "velocity": 90},
            {"instrument": "rimshot", "beat": 4.75, "velocity": 90},
            {"instrument": "closed_hihat", "beat": 1.5, "velocity": 80},
            {"instrument": "closed_hihat", "beat": 2.5, "velocity": 80},
            {"instrument": "closed_hihat", "beat": 3.5, "velocity": 80},
            {"instrument": "closed_hihat", "beat": 4.5, "velocity": 80},
            {"instrument": "crash_cymbal", "beat": 1, "velocity": 110},
            {"instrument": "crash_cymbal", "beat": 3, "velocity": 110},
            {"instrument": "cp", "beat": 1.5, "velocity": 95},
            {"instrument": "cp", "beat": 2.5, "velocity": 95},
            {"instrument": "cp", "beat": 3.5, "velocity": 95},
            {"instrument": "cp", "beat": 4.5, "velocity": 95}
        ]
    }
};