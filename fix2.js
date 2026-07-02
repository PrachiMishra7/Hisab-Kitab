const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace specifically the container colors that make everything white
  content = content.replace(/color:\s*['"]#fff['"]/g, (match, offset, string) => {
    // If this is a button or mic icon, keep it #fff
    const surrounding = string.substring(Math.max(0, offset - 50), offset + 50).toLowerCase();
    if (surrounding.includes('gradient') || surrounding.includes('background: "#4caf50"')) {
      return match;
    }
    return match.replace('#fff', 'var(--text-primary)');
  });
  
  // Replace the remaining .css classes inside the <style> tags of those components
  content = content.replace(/color:\s*#fff;/g, 'color: var(--text-primary);');

  fs.writeFileSync(filePath, content);
});
console.log('Fixed JSX text colors');
