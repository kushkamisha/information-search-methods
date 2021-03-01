const fs = require('fs');
const { stepMap, stepReduce } = require('./indexing');

const filenames = [
  "cut Война и мир. Том 1.txt",
  "cut Бесы.txt",
  // "Война и мир. Том 1.txt",
  // "Война и мир. Том 2.txt",
  // "Война и мир. Том 3.txt",
  // "Война и мир. Том 4.txt",
  // "Мастер и Маргарита.txt",
  // "Волшебник Изумрудного города.txt",
  // "Братья Карамазовы.txt",
  // "Идиот.txt",
  // "Униженные и оскорбленные.txt",
  // "Бесы.txt",
];

const main = async () => {
  const start = Date.now();

  await stepMap(filenames);
  stepReduce();

  console.log(`Working time is ${Date.now() - start} ms`);
}

// main();

(async () => {
  const file = 'output/segment.txt';
  const stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 20 });
  let prev = '';
  stream.on('data', (chunk) => {
    if (prev.length) {
      chunk = prev + chunk;
      prev = '';
    }

    const lines = chunk.split('\n');
    const processed = [];
    for (let i = 0; i < lines.length; i++) {
      if (/^[А-я]+,[0-9]+$/.test(lines[i])) {
        processed.push(lines[i].split(','));
      } else {
        prev = lines[i];
      }
    }

    console.log(processed);


    // const processed = [];
    // const lines = chunk.split('\n');
    // for (let i = 0; i < lines.length; i++) {
    //   const [word, docId] = lines[i].split(',');
    //   // console.log({ word, docId });
    //   if (docId === undefined) {
    //     prev = word;
    //   } else if (word !== undefined) {
    //     processed.push([word, docId]);
    //   }
    // }
    // console.log();
    // console.log(processed);
    // // console.log(lines.slice(0, 10));
    // // console.log(lines.slice(-10));
    // console.log();
  })
  // const firstByte = await stream[Symbol.asyncIterator]().next();
  // for (firstByte of stream[Symbol.asyncIterator]().next()) {
  //   console.log(`${file} >>> ${firstByte.value.length}`);
  // }
})()
