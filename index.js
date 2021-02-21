const { read } = require('./utils');
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
  const data = await Promise.all(filenames.map(filename => read(filename)));

  stepMap(data);
  stepReduce();

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();
