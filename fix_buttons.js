const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src');

function replaceFile(name, replacer) {
  const file = path.join(dir, name);
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
  }
}

replaceFile('ProfilePage.jsx', c => {
  c = c.replace(/className="btn btn-edit"/g, 'className="primary-btn"');
  c = c.replace(/className="btn btn-save"/g, 'className="primary-btn"');
  c = c.replace(/className="btn btn-cancel"/g, 'className="secondary-btn"');
  return c;
});

replaceFile('TransactionsPage.jsx', c => {
  c = c.replace(/style=\{\{\s*flex:\s*1,\s*background:\s*"linear-gradient[^}]*\}\}/g, 'className="primary-btn" style={{ flex: 1 }}');
  c = c.replace(/style=\{\{\s*padding:\s*"10px 12px",\s*borderRadius:\s*8,\s*border:\s*"1px solid rgba[^}]*\}\}/g, 'className="secondary-btn"');
  return c;
});

replaceFile('SavingsSimulator.jsx', c => {
  c = c.replace(/style=\{\{\s*background:\s*"linear-gradient[^}]*\}\}/g, 'className="primary-btn"');
  c = c.replace(/style=\{\{\s*marginTop:\s*10,\s*background:\s*"transparent",\s*border:\s*"1px solid rgba[^}]*\}\}/g, 'className="secondary-btn" style={{ marginTop: 10 }}');
  return c;
});

replaceFile('KYCPage.jsx', c => {
  c = c.replace(/style=\{\{\s*marginTop:\s*16,\s*background:\s*"linear-gradient[^}]*\}\}/g, 'className="primary-btn" style={{ marginTop: 16 }}');
  return c;
});

replaceFile('HelpSupport.jsx', c => {
  c = c.replace(/style=\{\{\s*background:\s*"linear-gradient[^}]*\}\}/g, 'className="primary-btn"');
  return c;
});

replaceFile('EducationHub.jsx', c => {
  c = c.replace(/style=\{\{\s*padding:\s*"8px 12px",\s*borderRadius:\s*8,\s*border:\s*"1px solid rgba[^}]*\}\}/g, 'className="secondary-btn"');
  c = c.replace(/style=\{\{\s*padding:\s*"8px 12px",\s*borderRadius:\s*8,\s*background:\s*"#4caf50"[^}]*\}\}/g, 'className="primary-btn"');
  return c;
});

console.log('Fixed buttons');
