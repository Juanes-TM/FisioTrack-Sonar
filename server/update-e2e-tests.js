const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 't-e2e', 'original');

// Leer todos los archivos de test
const testFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.spec.js'));

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar Firefox por Chrome
  content = content.replace(/\.forBrowser\('firefox'\)/, `.forBrowser('chrome')`);
  
  // Reemplazar URL
  content = content.replace(/https:\/\/10\.6\.131\.134/g, 'http://localhost:3000');
  
  // Añadir timeout mayor si no existe
  if (!content.includes('jest.setTimeout')) {
    content = "jest.setTimeout(60000);\n" + content;
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${file}`);
});

console.log('All E2E tests updated for Chrome');