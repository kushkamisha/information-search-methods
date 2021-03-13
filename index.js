const fs = require('fs');
const path = require('path');
const { stepMap, stepReduce } = require('./indexing');
const { cleanUp } = require('./utils');

const filenames = [
  // "cut Война и мир. Том 1.txt",
  // "cut Бесы.txt",
  "Война и мир. Том 1.txt",
  "Война и мир. Том 2.txt",
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

  const outputDir = path.join(__dirname, 'output');

  cleanUp(outputDir);
  await stepMap(filenames, outputDir);
  await stepReduce(outputDir);
  fs.unlinkSync(path.join(outputDir, 'segment.txt'));

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();
