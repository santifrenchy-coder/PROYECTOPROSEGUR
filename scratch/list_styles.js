const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

const regex = /style="([^"]+)"/g;
let matches;
let uniqueStyles = new Set();

while ((matches = regex.exec(content)) !== null) {
    uniqueStyles.add(matches[1]);
}

console.log(Array.from(uniqueStyles).sort().join('\n'));
