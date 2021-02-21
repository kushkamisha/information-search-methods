const { read } = require('./utils');
const { stepMap } = require('./indexing');

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

  // console.log(`Dict size is ${[...dict.values()].reduce((acc, x) => acc + Array.from(x).toString().length, 0)} symbols`);

  // console.log([...dict.get('императрица')].map(x => filenames[x]));
  // console.log([...dict.get('бояре')].map(x => filenames[x]));
  // console.log([...dict.get('княгиня')].map(x => filenames[x]));

  // console.log(processAtomicQuery('императрица AND княгиня', dict, filenames.length).map(x => filenames[x]));
  // console.log(processAtomicQuery('императрица OR княгиня', dict, filenames.length).map(x => filenames[x]));
  // console.log(processAtomicQuery('NOT княгиня', dict, filenames.length).map(x => filenames[x]));

  // const pairMap = createBiwordIndex(data);
  // console.log(find('она жила', pairMap, filenames));

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();
