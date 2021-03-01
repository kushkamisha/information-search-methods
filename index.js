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
  await stepReduce();

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();

// (async () => {
//   const file = 'output/segment.txt';
//   const stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 20 });
//   let prev = '';
//   const processed = [];

//   stream.on('data', (chunk) => {
//     if (prev.length) {
//       chunk = prev + chunk;
//       prev = '';
//     }

//     const lines = chunk.split('\n');
//     for (let i = 0; i < lines.length; i++) {
//       if (/^[А-я]+,[0-9]+$/.test(lines[i])) {
//         processed.push(lines[i].split(','));
//       } else {
//         prev = lines[i];
//       }
//     }
//   })

//   stream.on('end', () => {
//     console.log(processed);
//   })

// })()
