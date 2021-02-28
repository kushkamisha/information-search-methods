const fs = require('fs');
const path = require('path');

async function stepMap(data) {
  return new Promise((resolve, reject) => {
    try {
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

      segmentFile.close();
      setTimeout(() => resolve(), 100);
    } catch (err) {
      reject(err);
    }
  });
}

function buildOccurrencesMap() {
  const data = fs.readFileSync(path.join(__dirname, 'output', 'segment.txt'), 'utf8');
  if (!data.length) throw Error('No file "segment.txt"');
  const lines = data.split('\n');
  const wordDocIdMap = new Map();
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].length) continue;
    const [word, docId] = lines[i].split(',');
    if (wordDocIdMap.has(word)) {
      const docIds = wordDocIdMap.get(word);
      const occurences = docIds.get(docId);
      if (occurences) {
        docIds.set(docId, occurences + 1);
      } else {
        docIds.set(docId, 1);
      }
    } else {
      wordDocIdMap.set(word, new Map([[docId, 1]]));
    }
  }
  return wordDocIdMap;
}

function splitArrayByLetters(arr, letters) {
  const ranges = new Array(letters.length).fill();

  for (let i = 0; i < arr.length - 1; i++) {
    const word = arr[i][0];
    let isPushed = false;
    for (let j = 0; j < letters.length; j++) {
      const firstLetter = word[0];
      if (firstLetter >= letters[j]) {
        if (firstLetter < letters[j + 1] || letters[j + 1] === undefined) {
          if (!ranges[j]) ranges[j] = [];
          ranges[j].push(arr[i]);
          isPushed = true;
        }
      }
    }
    if (!isPushed) {
      if (!ranges[letters.length]) ranges[letters.length] = [];
      ranges[letters.length].push(arr[i]);
    }
  }
  return ranges;
}

function stepReduce() {
  const wordDocIdMap = buildOccurrencesMap();
  const sortedWordDocIdArr = [...wordDocIdMap.entries()].sort();
  const letters = ['а', 'б', 'ж', 'л', 'п', 'ф'];
  const ranges = splitArrayByLetters(sortedWordDocIdArr, letters);

  for (let i = 0; i < ranges.length; i++) {
    fs.writeFileSync(path.join(__dirname, 'output', `segment-${letters[i]}.txt`),
      ranges[i].map(pair => `${pair[0]},${[...pair[1].entries()].join(', ')}`).join('\n'));
  }
}

module.exports = {
  stepMap,
  stepReduce,
}
