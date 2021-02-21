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

function buildOccurrencesMap() {
  const data = fs.readFileSync(path.join(__dirname, 'output', 'segment.txt'), 'utf8');
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
  const ranges = new Array(letters.length + 1).fill();
  for (let i = 0; i < arr.length - 1; i++) {
    const word = arr[i][0];
    let isPushed = false;
    // console.log(letters.length);
    for (let j = 0; j < letters.length; j++) {
      const firstLetter = word[0];
      // console.log({ firstLetter, curr: letters[j], next: letters[j + 1] });
      if (firstLetter > letters[j]) {
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
  // first range is at the end => moving it to the front
  // return [ranges[ranges.length - 1], ...ranges.slice(0, ranges.length - 1)];
}

function stepReduce() {
  const wordDocIdMap = buildOccurrencesMap();
  const sortedWordDocIdArr = [...wordDocIdMap.entries()].sort();
  const letters = ['ж', 'л', 'ф'];
  const ranges = splitArrayByLetters(sortedWordDocIdArr, letters);
  // const line = ranges[0][0];
  // console.log(`${line[0]},${[...line[1].entries()].join(',')}`);
  ranges.forEach((range, i) => {
    // console.log();
    fs.writeFileSync(path.join(__dirname, 'output', `segment-${letters[i]}.txt`),
      range.map(pair => `${pair[0]},${[...pair[1].entries()].join(', ')}`).join('\n'));
  })
}

module.exports = {
  stepMap,
  stepReduce,
}
