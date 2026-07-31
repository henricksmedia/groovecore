const fs = require('fs');

// Read the HTML file
let content = fs.readFileSync('index.html', 'utf8');

// Fix all the broken responsive patterns back to simple format
// Pattern: Remove the complex dual-span setup and just hide the description part
content = content.replace(
  /<span class="lg:hidden"><strong>(\w+)<\/strong><\/span>\s*<span class="hidden lg:inline"><strong>\1<\/strong> \(([^)]+)\)<\/span>/g,
  '<span><strong>$1</strong> <span class="hidden md:inline">($2)</span></span>'
);

// Also fix any remaining complex patterns
content = content.replace(
  /<!-- Mobile\/Small: Show only short code -->\s*<span class="lg:hidden"><strong>(\w+)<\/strong><\/span>\s*<!-- Large screens: Show full name -->\s*<span class="hidden lg:inline"><strong>\1<\/strong> \(([^)]+)\)<\/span>/g,
  '<span><strong>$1</strong> <span class="hidden md:inline">($2)</span></span>'
);

// Write back to file
fs.writeFileSync('index.html', content);

console.log('Successfully fixed all instrument names to simple responsive format');
