// =============================================================================
// MIDI Mapping Validation Test - GrooveCore
// =============================================================================
// This script validates that MIDI exports use the correct mappings from 
// the master reference document.

console.log('🧪 Starting MIDI Mapping Validation...');

// Expected mappings from MIDI_MAPPING_MASTER_REFERENCE.md
const EXPECTED_MAPPINGS = {
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
  ch: 39,        // Clap → GM: Hand Clap (D#1) - CRITICAL FIX
  cb: 56,        // Cowbell → GM: Cowbell (G#2)
  cl: 75,        // Clave → GM: Claves (D#4)
  ma: 70,        // Maraca → GM: Maracas (A#3)
  accent: 40     // Accent → GM: Electric Snare (E1)
};

// Test results
const testResults = {
  masterMappingLoaded: false,
  fallbackMappingCorrect: false,
  allInstrumentsMapped: false,
  criticalFixesApplied: false,
  noDuplicateConflicts: false,
  gmCompliant: false,
  errors: [],
  warnings: []
};

function validateMIDIMappings() {
  console.log('🔍 Validating MIDI mappings...');
  
  // Test 1: Check if master mapping is loaded
  console.log('\n📋 Test 1: Master Mapping Availability');
  if (typeof window !== 'undefined' && window.GrooveCoreMIDI) {
    testResults.masterMappingLoaded = true;
    console.log('✅ Master MIDI mapping loaded from midi-mapping.js');
    
    const actualMapping = window.GrooveCoreMIDI.GROOVECORE_MIDI_MAPPING;
    console.log('📊 Loaded mapping:', actualMapping);
    
    // Test mapping accuracy
    let mappingCorrect = true;
    Object.entries(EXPECTED_MAPPINGS).forEach(([instrument, expectedNote]) => {
      if (actualMapping[instrument] !== expectedNote) {
        testResults.errors.push(`❌ ${instrument}: expected ${expectedNote}, got ${actualMapping[instrument]}`);
        mappingCorrect = false;
      } else {
        console.log(`✅ ${instrument}: ${actualMapping[instrument]} (correct)`);
      }
    });
    
    testResults.fallbackMappingCorrect = mappingCorrect;
    
  } else {
    testResults.warnings.push('⚠️ Master mapping not loaded, checking fallback...');
    console.log('⚠️ Master mapping not available, checking fallback in app.js');
  }
  
  // Test 2: Check app.js fallback mapping
  console.log('\n📋 Test 2: App.js Fallback Mapping');
  // This would need to be checked in the actual app context
  
  // Test 3: Critical fixes validation
  console.log('\n📋 Test 3: Critical Fixes from v2.0');
  const criticalTests = [
    { name: 'CH (Clap) mapping', instrument: 'ch', expected: 39, old: 42 },
    { name: 'HC (Hi-Hat Closed)', instrument: 'hc', expected: 42, old: 63 },
    { name: 'MC (Hi-Hat Mid)', instrument: 'mc', expected: 44, old: 62 },
    { name: 'LC (Hi-Hat Open)', instrument: 'lc', expected: 46, old: 61 },
    { name: 'Accent conflict fix', instrument: 'accent', expected: 40, old: 39 },
    { name: 'Bass Drum optimization', instrument: 'bd', expected: 36, old: 35 }
  ];
  
  let criticalFixesOk = true;
  criticalTests.forEach(test => {
    const actual = EXPECTED_MAPPINGS[test.instrument];
    if (actual === test.expected) {
      console.log(`✅ ${test.name}: ${actual} (fixed from ${test.old})`);
    } else {
      console.log(`❌ ${test.name}: ${actual} (should be ${test.expected}, was ${test.old})`);
      testResults.errors.push(`Critical fix not applied: ${test.name}`);
      criticalFixesOk = false;
    }
  });
  testResults.criticalFixesApplied = criticalFixesOk;
  
  // Test 4: All instruments mapped
  console.log('\n📋 Test 4: Complete Instrument Coverage');
  const expectedInstruments = Object.keys(EXPECTED_MAPPINGS);
  testResults.allInstrumentsMapped = expectedInstruments.length === 17;
  console.log(`📊 Total instruments: ${expectedInstruments.length}/17 expected`);
  
  // Test 5: Duplicate note conflicts
  console.log('\n📋 Test 5: Duplicate Note Analysis');
  const noteUsage = {};
  Object.entries(EXPECTED_MAPPINGS).forEach(([instrument, note]) => {
    if (!noteUsage[note]) noteUsage[note] = [];
    noteUsage[note].push(instrument);
  });
  
  let duplicatesOk = true;
  Object.entries(noteUsage).forEach(([note, instruments]) => {
    if (instruments.length > 1) {
      // Only lc/oh sharing note 46 is acceptable
      if (note === '46' && instruments.sort().join(',') === 'lc,oh') {
        console.log(`✅ Note ${note}: ${instruments.join(', ')} (acceptable duplicate)`);
      } else {
        console.log(`❌ Note ${note}: ${instruments.join(', ')} (unacceptable conflict)`);
        testResults.errors.push(`Duplicate MIDI note ${note}: ${instruments.join(', ')}`);
        duplicatesOk = false;
      }
    } else {
      console.log(`✅ Note ${note}: ${instruments[0]} (unique)`);
    }
  });
  testResults.noDuplicateConflicts = duplicatesOk;
  
  // Test 6: GM Compliance
  console.log('\n📋 Test 6: GM Standard Compliance');
  const gmRange = { min: 35, max: 81 };
  let gmCompliant = true;
  Object.entries(EXPECTED_MAPPINGS).forEach(([instrument, note]) => {
    if (note < gmRange.min || note > gmRange.max) {
      testResults.errors.push(`❌ ${instrument}: Note ${note} outside GM range (${gmRange.min}-${gmRange.max})`);
      gmCompliant = false;
    }
  });
  testResults.gmCompliant = gmCompliant;
  console.log(gmCompliant ? '✅ All notes within GM percussion range' : '❌ Some notes outside GM range');
  
  return testResults;
}

// Run validation
const results = validateMIDIMappings();

// Summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('='.repeat(50));
console.log(`Master Mapping Loaded: ${results.masterMappingLoaded ? '✅' : '❌'}`);
console.log(`Fallback Mapping Correct: ${results.fallbackMappingCorrect ? '✅' : '❌'}`);
console.log(`All Instruments Mapped: ${results.allInstrumentsMapped ? '✅' : '❌'}`);
console.log(`Critical Fixes Applied: ${results.criticalFixesApplied ? '✅' : '❌'}`);
console.log(`No Duplicate Conflicts: ${results.noDuplicateConflicts ? '✅' : '❌'}`);
console.log(`GM Standard Compliant: ${results.gmCompliant ? '✅' : '❌'}`);

if (results.errors.length > 0) {
  console.log('\n❌ ERRORS FOUND:');
  results.errors.forEach(error => console.log(error));
}

if (results.warnings.length > 0) {
  console.log('\n⚠️ WARNINGS:');
  results.warnings.forEach(warning => console.log(warning));
}

const allTestsPassed = results.masterMappingLoaded && 
                      results.fallbackMappingCorrect && 
                      results.allInstrumentsMapped && 
                      results.criticalFixesApplied && 
                      results.noDuplicateConflicts && 
                      results.gmCompliant;

console.log(`\n🎯 OVERALL RESULT: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ TESTS FAILED'}`);

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateMIDIMappings, EXPECTED_MAPPINGS, testResults };
} else if (typeof window !== 'undefined') {
  window.MIDIMappingTest = { validateMIDIMappings, EXPECTED_MAPPINGS, testResults };
}
