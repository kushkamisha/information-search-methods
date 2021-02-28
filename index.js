const fs = require('fs');
const { stepMap, stepReduce } = require('./indexing');
const { Liner } = require('./Liner');

const filenames = [
  // "cut Война и мир. Том 1.txt",
  // "cut Бесы.txt",
  "Война и мир. Том 1.txt",
  "Война и мир. Том 2.txt",
  "Война и мир. Том 3.txt",
  "Война и мир. Том 4.txt",
  "Мастер и Маргарита.txt",
  "Волшебник Изумрудного города.txt",
  "Братья Карамазовы.txt",
  "Идиот.txt",
  "Униженные и оскорбленные.txt",
  "Бесы.txt",
];

const main = async () => {
  const start = Date.now();

  await stepMap(filenames);
  stepReduce();

  console.log(`Working time is ${Date.now() - start} ms`);
}

// main();

// const source = fs.createReadStream('output/segment.txt');
// const liner = new Liner({ delimiter: ',' });

// source.pipe(liner);

// liner.on('readable', () => {
//   let line
//   while (null !== (line = liner.read())) {
//     console.log(line)
//   }
// })

(async () => {
  const file = 'output/segment.txt';
  const stream = fs.createReadStream(file, { encoding: 'utf8', /*highWaterMark: 20000*/ });
  stream.on('data', (chunk) => {
    console.log(chunk.length);
  })
  // const firstByte = await stream[Symbol.asyncIterator]().next();
  // for (firstByte of stream[Symbol.asyncIterator]().next()) {
  //   console.log(`${file} >>> ${firstByte.value.length}`);
  // }
})()
