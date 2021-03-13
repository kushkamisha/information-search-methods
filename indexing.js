const fs = require('fs');
const path = require('path');
const { read, getFilesizeInBytes } = require('./utils');
const { MainEmitter } = require('./MainEmitter');

const emitter = new MainEmitter();
emitter.setMaxListeners(1000);

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

async function stepMap2(outputDir) {
  console.log(`Step reduce`);
  const segmentFilePath = path.join(outputDir, 'segment.txt');
  const totalSize = getFilesizeInBytes(segmentFilePath);

  return new Promise((resolve) => {
    console.log(`>> reading ${segmentFilePath}`);
    const stream = fs.createReadStream(
      segmentFilePath,
      { encoding: 'utf8', highWaterMark: 1024 * 3 /* * 1024  * 1024 */ /* 1 GB */ },
    );
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

async function stepReduce(outputDir) {
  const fileNames = fs.readdirSync(outputDir);
  const numOfFiles = fileNames.length;
  let streamsData = [];
  // let counter = 0;
  let endCounter = 0;
  // let dataToWrite = '';

  // return new Promise((resolve) => {

  const outFileStream = fs.createWriteStream(
    path.join(outputDir, 'bigfile.txt'),
    { flags: 'a' },
  );

  emitter.on('new-chunk', (data) => {
    streamsData.push(data);
    // counter++;
    // dataToWrite += data;
    console.log({ endCounter });
    // console.log(streamsData.length + endCounter)
    if ((streamsData.length + endCounter) >= numOfFiles) {
      // console.log(streamsData);
      outFileStream.write(streamsData.reduce((acc, x) => acc += x));
      // outFileStream.write(dataToWrite);
      // dataToWrite = '';
      // counter = 0;
      streamsData = [];
      emitter.emit('resume');
    }
  });

  emitter.on('end', () => {
    endCounter++;
    if (endCounter >= numOfFiles) {
      // console.log({ dataToWrite });
      console.log('Output file stream was successfully closed');
      outFileStream.write(streamsData.reduce((acc, x) => acc += x));
      outFileStream.close();
    }
  })

  Promise.all(fileNames.map((filename) => {
    const stream = fs.createReadStream(
      path.join(outputDir, filename),
      { encoding: 'utf8', highWaterMark: 1024 /* * 1024 /* * 1024 */ /* 1 GB */ },
    );

    let prev = '';
    let processed = [];
    let chunkId = 0;

    stream.on('readable', () => {
      let chunk;
      while (null !== (chunk = stream.read())) {
        console.log(`>>> new chunk #${filename}-${chunkId}`);

        chunkId++;
        if (prev.length) {
          chunk = prev + chunk;
          prev = '';
        }
        stream.pause();
        emitter.emit('new-chunk', chunk);
        emitter.on('resume', () => stream.resume());
      }
    });

    stream.on('end', () => emitter.emit('end'));
  }));

  // });
}

module.exports = {
  stepMap,
  stepMap2,
  stepReduce,
}
