const fs = require('fs');
const path = require('path');
const { stepMap, stepMap2, stepReduce } = require('./indexing');
const { cleanUp } = require('./utils');

const filenames = [
  "cut Война и мир. Том 1.txt",
  "cut Война и мир. Том 2.txt",
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

  const outputDir = path.join(__dirname, 'output');

  // cleanUp(outputDir);
  // await stepMap(filenames, outputDir);
  // await stepMap2(outputDir);
  await stepReduce(outputDir);
  // fs.unlinkSync(path.join(outputDir, 'segment.txt'));
  // fs.unlinkSync(path.join(outputDir, 'bigfile.txt'));

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();
