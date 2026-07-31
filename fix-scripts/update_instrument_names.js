const fs = require('fs');

// Read the HTML file
let content = fs.readFileSync('index.html', 'utf8');

// Define the instrument mappings
const instruments = [
  { code: 'LT', name: 'LOW TOM' },
  { code: 'MT', name: 'MID TOM' },
  { code: 'HT', name: 'HIGH TOM' },
  { code: 'RIM', name: 'RIM SHOT' },
  { code: 'HC', name: 'HI-HAT CLOSED' },
  { code: 'MC', name: 'HI-HAT MID' },
  { code: 'LC', name: 'HI-HAT LOW' },
  { code: 'CB', name: 'CRASH' },
  { code: 'CYM', name: 'CYMBAL' },
  { code: 'OH', name: 'OPEN HAT' },
  { code: 'CH', name: 'CLAP' },
  { code: 'CL', name: 'CLAVE' },
  { code: 'MA', name: 'MARACA' },
  { code: 'ACCENT', name: 'ACCENT' }
];

// Replace each instrument name pattern
instruments.forEach(instrument => {
  const oldPattern = `<span><strong>${instrument.code}</strong> (${instrument.name})</span>`;
  const newPattern = `<!-- Mobile: Show only short code -->
            <span class="md:hidden"><strong>${instrument.code}</strong></span>
            <!-- Desktop: Show full name -->
            <span class="hidden md:inline"><strong>${instrument.code}</strong> (${instrument.name})</span>`;
  
  content = content.replace(oldPattern, newPattern);
});

// Write back to file
fs.writeFileSync('index.html', content);

console.log('Successfully updated all instrument names with responsive visibility');
