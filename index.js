const fs = require('fs');
const path = require('path');

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
const dictType = {
  insidence: 'insidence',
  inverted: 'inverted',
}

const read = filename =>
  new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, 'input', filename), 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)));

async function createInsidenceMatrix(filenames) {
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
          words.set(word, new Array(filenames.length).fill(0));
        }
        words.get(word)[i] = 1;
      }
    }
  }

  return words;
};

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

function processOR(query, mtr, filesIDs, type) {
  const words = query.split('or').map(x => x.trim());
  const [word1, word2] = words;
  if (type === dictType.insidence) {
    const occur1 = mtr.get(word1) || new Array(filesIDs).fill(0);
    const occur2 = mtr.get(word2) || new Array(filesIDs).fill(0);
    return occur1.map((w, i) => w || occur2[i]);
  } else {
    const occur1 = mtr.get(word1) || [];
    const occur2 = mtr.get(word2) || [];
    // const entries = words.reduce((acc, w) => { if (mtr.get(w)) { acc.push(...mtr.get(w)) }; return acc; }, []);
    return [...new Set([...occur1, ...occur2]).values()];
  }
}

function processAND(query, mtr, type) {
  const [word1, word2] = query.split('and').map(x => x.trim());
  const occur1 = mtr.get(word1);
  const occur2 = mtr.get(word2);
  if (!occur1 || !occur2) return [];
  return type === dictType.insidence
    ? occur1.map((x, i) => x && occur2[i])
    : [...occur1].filter(x => [...occur2].includes(x));
}

function processNOT(query, mtr, filesIDs, type) {
  const word = query.split('not')[1].trim();
  if (type === dictType.insidence) {
    const occur = mtr.get(word) || new Array(filesIDs).fill(0);
    return occur.map(x => 1 - x);
  } else {
    const occur = mtr.get(word) || [];
    const ids = new Array(filesIDs).fill().map((_, i) => i);
    return ids.filter(x => ![...occur].includes(x));
  }
}

function processAtomicQueryInsidenceMatrix(query, mtr, filesIDs) {
  query = query.toLowerCase();
  if (query.indexOf('or') != -1) return processOR(query, mtr, filesIDs, dictType.insidence);
  else if (query.indexOf('and') != -1) return processAND(query, mtr, dictType.insidence);
  else if (query.indexOf('not') != -1) return processNOT(query, mtr, filesIDs, dictType.insidence);
}

function processAtomicQueryInvertedIndex(query, mtr, filesIDs) {
  query = query.toLowerCase();
  if (query.indexOf('or') != -1) return processOR(query, mtr);
  else if (query.indexOf('and') != -1) return processAND(query, mtr);
  else if (query.indexOf('not') != -1) return processNOT(query, mtr, filesIDs);
}

function processAtomicQuery(query, mtr, filesIDs) {
  if (Array.isArray(mtr.values().next().value)) return processAtomicQueryInsidenceMatrix(query, mtr, filesIDs);
  else return processAtomicQueryInvertedIndex(query, mtr, filesIDs);
}

const main = async () => {
  const start = Date.now();
  const dict1 = await createInsidenceMatrix(filenames);
  const dict2 = await createInvertedIndex(filenames);

  console.log(dict1.size);
  console.log(dict2.size);
  console.log(dict1.values().next().value);

  // console.log(dict1.get('императрица').map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));
  // console.log(dict1.get('бояре').map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));
  // console.log(dict1.get('княгиня').map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));

  // console.log([...dict2.get('императрица')].map(x => filenames[x]));
  // console.log([...dict2.get('бояре')].map(x => filenames[x]));
  // console.log([...dict2.get('княгиня')].map(x => filenames[x]));

  // console.log(processAtomicQuery('императрица AND княгиня', dict1, filenames.length)
  //   .map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));
  // console.log(processAtomicQuery('императрица OR княгиня', dict1, filenames.length)
  // .map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));
  // console.log(processAtomicQuery('NOT княгиня', dict1, filenames.length)
  //   .map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));

  // console.log(processAtomicQuery('императрица AND княгиня', dict2, filenames.length).map(x => filenames[x]));
  // console.log(processAtomicQuery('императрица OR княгиня', dict2, filenames.length).map(x => filenames[x]));
  // console.log(processAtomicQuery('NOT княгиня', dict2, filenames.length).map(x => filenames[x]));

  console.log(`Working time: ${Date.now() - start} ms`);
}

main();
