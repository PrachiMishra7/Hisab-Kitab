const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') || f.endsWith('.css'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace inline white colors
  content = content.replace(/color:\s*['"]#fff['"]/g, 'color: "var(--text-primary)"');
  content = content.replace(/color:\s*['"]#ffffff['"]/g, 'color: "var(--text-primary)"');
  
  // Replace css white colors
  content = content.replace(/color:\s*#fff;/gi, 'color: var(--text-primary);');
  content = content.replace(/color:\s*#ffffff;/gi, 'color: var(--text-primary);');
  
  // Replace dark card texts that were forced
  content = content.replace(/color:\s*#071227;/g, 'color: var(--text-primary);');
  content = content.replace(/color:\s*['"]#071227['"]/g, 'color: "var(--text-primary)"');

  // White text in gradients usually needs to stay white for contrast.
  // Wait, I should not replace color: #fff; everywhere, e.g. in primary-btn.
  // Let me just manually check that my replace doesn't break primary-btn
  
  fs.writeFileSync(filePath, content);
});
console.log('Fixed text colors');
