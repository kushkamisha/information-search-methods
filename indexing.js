const fs = require('fs');
const path = require('path');
const { read, getFilesizeInBytes } = require('./utils');

async function stepMap(filenames, outputDir) {
  return new Promise(async (resolve) => {
    const segmentFilePath = path.join(outputDir, 'segment.txt');
    const segmentFileStream = fs.createWriteStream(segmentFilePath, { flags: 'a' });

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

function buildOccurrencesMap(processed) {
  // console.log('>> Building occurences map');

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
  return wordDocIdMap;
}

function splitArrayByLetters(arr, letters) {
  // console.log('Splitting array by letters');
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

async function stepReduce(outputDir) {
  console.log(`Step reduce`);
  const segmentFilePath = path.join(outputDir, 'segment.txt');
  const totalSize = getFilesizeInBytes(segmentFilePath);

  return new Promise((resolve) => {
    console.log(`>> reading ${segmentFilePath}`);
    const stream = fs.createReadStream(segmentFilePath, { encoding: 'utf8', highWaterMark: 1024 * 1024 /* * 1024 */ /* 1 GB */ });
    let prev = '';
    let processed = [];
    let chunkId = 0;
    let chunksCumulativeSize = 0;

    stream.on('data', (chunk) => {
      processed = [];
      chunksCumulativeSize += chunk.length;
      // if (!(chunkId % 5)) {
      console.log(`>>> new chunk (${chunksCumulativeSize}/${totalSize})`);
      // }
      chunkId++;
      if (prev.length) {
        chunk = prev + chunk;
        prev = '';
      }
      console.log(chunk.length);

      const lines = chunk.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (/^[А-я]+,[0-9]+$/.test(lines[i])) {
          processed.push(lines[i].split(','));
        } else {
          prev = lines[i];
        }
      }

      // Actual processing
      const wordDocIdMap = buildOccurrencesMap(processed);
      const sortedWordDocIdArr = [...wordDocIdMap.entries()].sort();

      fs.writeFileSync(path.join(outputDir, `${chunkId}.txt`),
        sortedWordDocIdArr.map(pair => `${pair[0]},${[...pair[1].entries()].join(',')}`).join('\n'));
    });

    stream.on('end', () => resolve());
  });
}

module.exports = {
  stepMap,
  stepReduce,
}
