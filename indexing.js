const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
const { read } = require('./utils');

async function stepMap(filenames) {
  return new Promise(async (resolve) => {
    const outputPath = path.join(__dirname, 'output', 'segment.txt');
    const segmentFileStream = fs.createWriteStream(outputPath, { flags: 'a' });


    let i = 0;
    for await ((filename) of filenames) {
      await processFile(filename, i, segmentFileStream);
      i++;
    }

    // await Promise.all(filenames.map((filename, i) => processFile(filename, i, segmentFileStream)));

    segmentFileStream.close();
    segmentFileStream.on('close', () => {
      console.log('on the disk');
      resolve();
    });
  });
}

async function processFile(filename, fileId, outputStream) {
  console.log(`Process file: ${filename}`);
  const data = await read(filename);
  let word = '';

  for (let i = 0; i < data.length; i++) {
    if (data[i] === ' ' || data[i] === '\n') {
      if (word.length) {
        outputStream.write(`${word},${fileId}\n`);
      }
      word = '';
    } else if (/[^а-яА-Я ]+/g.test(data[i])) {
      continue;
    } else {
      word += data[i].toLowerCase();
    }
  }
}

async function buildOccurrencesMap() {
  // const data = fs.readFileSync(path.join(__dirname, 'output', 'segment.txt'), 'utf8');
  // if (!data.length) throw Error(`No file ${path.join(__dirname, 'output', 'segment.txt')}`);
  // const lines = data.split('\n');

  return new Promise((resolve) => {
    const file = 'output/segment.txt';
    const stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 20 });
    let prev = '';
    const processed = [];

    stream.on('data', (chunk) => {
      if (prev.length) {
        chunk = prev + chunk;
        prev = '';
      }

      const lines = chunk.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/^[А-я]+,[0-9]+$/.test(lines[i])) {
          processed.push(lines[i].split(','));
        } else {
          prev = lines[i];
        }
      }
    });

    stream.on('end', () => {
      // console.log(processed);

      const wordDocIdMap = new Map();
      for (let i = 0; i < processed.length; i++) {
        // if (!processed[i].length) continue;
        const [word, docId] = processed[i];
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
      resolve(wordDocIdMap);
    });
  });
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
          anyWords = true;
        }
      }
    }
    if (!isPushed) {
      if (!ranges[letters.length]) ranges[letters.length] = [];
      ranges[letters.length].push(arr[i]);
    }
  }
  for (let i = 0; i < ranges.length; i++) {
    if (!ranges[i]) {
      ranges[i] = [];
    }
  }
  return ranges;
}

async function stepReduce() {
  console.log(`Step reduce`);
  const wordDocIdMap = await buildOccurrencesMap();
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
