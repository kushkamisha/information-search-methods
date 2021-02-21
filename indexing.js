const fs = require('fs');
const path = require('path');

function stepMap(data) {
  const segmentFile = fs.createWriteStream(path.join(__dirname, 'output', 'segment.txt'), {
    flags: 'w',
  });
  let word = '';

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === ' ' || data[i][j] === '\n') {
        if (word.length) {
          segmentFile.write(`${word},${i}\n`);
        }
        word = '';
      } else if (/[^а-яА-Я ]+/g.test(data[i][j])) {
        continue;
      } else {
        word += data[i][j].toLowerCase();
      }
    }
  }
}

module.exports = {
  stepMap,
}
