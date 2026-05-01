const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// 1. Check duplicate IDs
const idMatches = content.match(/id="([^"]+)"/g) || [];
const ids = idMatches.map(m => m.match(/id="([^"]+)"/)[1]);
const seenIds = new Set();
const duplicateIds = [];

for (const id of ids) {
    if (seenIds.has(id)) {
        duplicateIds.push(id);
    }
    seenIds.add(id);
}

// 2. Check for double class/style attributes
const doubleClass = content.match(/<[^>]+?\s+class="[^"]+"\s+class="[^"]+"/gi) || [];
const doubleStyle = content.match(/<[^>]+?\s+style="[^"]+"\s+style="[^"]+"/gi) || [];

// 3. Check for empty alt tags
const emptyAlt = content.match(/alt=""/g) || [];

// 4. Check for unassociated labels (basic check)
const labels = content.match(/<label[^>]*>(.*?)<\/label>/gi) || [];
const unassociatedLabels = labels.filter(l => !l.includes('for="'));

console.log('--- AUDIT RESULTS ---');
console.log('Duplicate IDs:', duplicateIds.length > 0 ? duplicateIds.join(', ') : 'None');
console.log('Double Class attributes:', doubleClass.length);
console.log('Double Style attributes:', doubleStyle.length);
console.log('Empty Alt tags:', emptyAlt.length);
console.log('Unassociated Labels (missing for):', unassociatedLabels.length);
console.log('---------------------');
