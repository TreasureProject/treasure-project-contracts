const fs = require('fs');
const path = require('path');

task('tree-json-to-csv')
  .addParam('source')
  .setAction(async function ({ source }) {
    const { entries } = require(path.resolve(source));

    const csv = entries
      .map((e) => `${e.address}|${e.id}|${e.amount}|${e.proof.join(',')}`)
      .join('\n');

    fs.writeFileSync(source.replace('.json', '.csv'), csv, { flag: 'w' });
  });
