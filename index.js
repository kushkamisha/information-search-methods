// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// 4. та пошук з урахуванням відстані для кожного з них.
const { processAND, processOR, processNOT } = require('./boolOperators');
const { createInvertedIndex, createBiwordIndex, createPositionalIndex } = require('./indexes');
const { read } = require('./utils');

const filenames = [
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

function processAtomicQuery(query, mtr, filesIDs) {
  query = query.toLowerCase();
  if (query.indexOf('or') != -1) return processOR(query, mtr);
  else if (query.indexOf('and') != -1) return processAND(query, mtr);
  else if (query.indexOf('not') != -1) return processNOT(query, mtr, filesIDs);
}

function find(query, pairMap, filenames) {
  return [...pairMap.get(query) || []].map(x => filenames[x]) || [];
}

function findInPositional(query, posMap, filenames) {
  const [word1, word2] = query.split(' ');
  const word1Docs = posMap.get(word1);
  const word2Docs = posMap.get(word2);

  const resDocs = [];
  for (const [doc, occursWord1] of word1Docs) {
    if (word2Docs.get(doc)) {
      const occursWord2 = word2Docs.get(doc);
      for (let i = 0; i < occursWord1.length; i++) {
        for (let j = 0; j < occursWord2.length; j++) {
          if (occursWord1[i] === occursWord2[j] - 1) {
            resDocs.push(doc);
          }
        }
      }
    }
  }
  return [...new Set(resDocs)].map(x => filenames[x]);
}

const main = async () => {
  const start = Date.now();
  const data = await Promise.all(filenames.map(filename => read(filename)));
  // const dict = await createInvertedIndex(data);

  // console.log(`Dict size is ${[...dict.values()].reduce((acc, x) => acc + Array.from(x).toString().length, 0)} symbols`);

  // console.log([...dict.get('императрица')].map(x => filenames[x]));
  // console.log([...dict.get('бояре')].map(x => filenames[x]));
  // console.log([...dict.get('княгиня')].map(x => filenames[x]));

  // console.log(processAtomicQuery('императрица AND княгиня', dict, filenames.length).map(x => filenames[x]));
  // console.log(processAtomicQuery('императрица OR княгиня', dict, filenames.length).map(x => filenames[x]));
  // console.log(processAtomicQuery('NOT княгиня', dict, filenames.length).map(x => filenames[x]));

  // const pairMap = createBiwordIndex(data);
  // console.log(find('она жила', pairMap, filenames));

  const posMap = createPositionalIndex(data);
  console.log(findInPositional('она жила', posMap, filenames));

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();
