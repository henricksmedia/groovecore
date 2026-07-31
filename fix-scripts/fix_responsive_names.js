const fs = require('fs');

// Read the HTML file
let content = fs.readFileSync('index.html', 'utf8');

// Fix all the responsive class patterns
content = content.replace(
  /<!-- Mobile: Show only short code -->\s*<span class="md:hidden"><strong>(\w+)<\/strong><\/span>\s*<!-- Desktop: Show full name -->\s*<span class="hidden md:inline"><strong>\1<\/strong> \(([^)]+)\)<\/span>/g,
  `<!-- Mobile/Small: Show only short code -->
            <span class="lg:hidden"><strong>$1</strong></span>
            <!-- Large screens: Show full name -->
            <span class="hidden lg:inline"><strong>$1</strong> ($2)</span>`
);

// Also fix any remaining md: patterns that weren't caught
content = content.replace(/class="md:hidden"/g, 'class="lg:hidden"');
content = content.replace(/class="hidden md:inline"/g, 'class="hidden lg:inline"');

// Write back to file
fs.writeFileSync('index.html', content);

console.log('Successfully fixed all responsive instrument name classes');
