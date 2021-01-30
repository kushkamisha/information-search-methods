// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// 1. Побудувати двословний індекс
// 2. і координатний інвертований індекс по колекції документів.
// 3. Реалізувати фразовий пошук
// 4. та пошук з урахуванням відстані для кожного з них.

const fs = require('fs');
const path = require('path');
const { processAND, processOR, processNOT } = require('./boolOperators');

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

const read = filename =>
  new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, 'input', filename), 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)));

async function createInvertedIndex(filenames) {
  const texts = await Promise.all(filenames.map(filename => read(filename)));
  const words = new Map();

  for (let i = 0; i < texts.length; i++) {
    const arr = texts[i].replaceAll('\n', ' ')
      // .replaceAll(/[^a-zA-Z ]+/g, '')
      .replaceAll(/[^а-яА-Я ]+/g, '')
      .split(' ');
    for (let j = 0; j < arr.length; j++) {
      const word = arr[j].toLowerCase();
      if (!!arr[j]) {
        if (!words.has(word)) {
          words.set(word, new Set());
        }
        words.get(word).add(i);
      }
    }
  }

  return words;
};

function processAtomicQuery(query, mtr, filesIDs) {
  query = query.toLowerCase();
  if (query.indexOf('or') != -1) return processOR(query, mtr);
  else if (query.indexOf('and') != -1) return processAND(query, mtr);
  else if (query.indexOf('not') != -1) return processNOT(query, mtr, filesIDs);
}

const main = async () => {
  const start = Date.now();
  const dict = await createInvertedIndex(filenames);

  console.log(`Dict size is ${[...dict.values()].reduce((acc, x) => acc + Array.from(x).toString().length, 0)} symbols`);

  console.log([...dict.get('императрица')].map(x => filenames[x]));
  console.log([...dict.get('бояре')].map(x => filenames[x]));
  console.log([...dict.get('княгиня')].map(x => filenames[x]));

  console.log(processAtomicQuery('императрица AND княгиня', dict, filenames.length).map(x => filenames[x]));
  console.log(processAtomicQuery('императрица OR княгиня', dict, filenames.length).map(x => filenames[x]));
  console.log(processAtomicQuery('NOT княгиня', dict, filenames.length).map(x => filenames[x]));

  console.log(`Working time is ${Date.now() - start} ms`);
}

main();
