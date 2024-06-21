const fs = require('fs');
const path = require('path');

const sourceFile = path.resolve(__dirname, 'src/extensions.json');

const destFile = path.resolve(__dirname, 'public/extensions.json');

try {
    fs.copyFileSync(sourceFile, destFile);
    console.log(`'extensions.json' was successfully copied to 'public'.`);
  } catch(err) {
    console.error(`Error copying 'extensions.json': `, err);
  }