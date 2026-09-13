const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const srcPath = path.join(__dirname, 'site', 'src', 'app.jsx');
const outPath = path.join(__dirname, 'site', 'app.js');

const source = fs.readFileSync(srcPath, 'utf8');

const result = babel.transformSync(source, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  filename: 'app.jsx',
  comments: false,
});

fs.writeFileSync(outPath, result.code + '\n');
console.log(`Built ${srcPath} -> ${outPath} (${result.code.length} bytes)`);
