const { rejects } = require('assert');
const fs = require('fs');
const path = require('path');

const read = async filename => new Promise((resolve, reject) =>
  fs.readFile(path.join(__dirname, 'input', filename), 'utf-8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  }));

const createInsidenceMatrix = async filenames => {
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

const createInvertedIndex = async filenames => {
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

// cosnt processInsidenceMatrix = (query, mtr) => {
// }

function processOR(query, mtr) {
  const words = query.split('or').map(x => x.trim());
  const entries = words.reduce((acc, w) => { acc.push(...mtr.get(w)); return acc; }, []);
  return [...new Set(entries).values()];
}

function processAND(query, mtr) {
  const [word1, word2] = query.split('and').map(x => x.trim());
  const occur1 = [...mtr.get(word1)];
  const occur2 = [...mtr.get(word2)];
  return occur1.filter(x => occur2.includes(x));
}

function processNOT(query, mtr, filesIDs) {
  const word = query.split('not')[1].trim();
  const occur = mtr.get(word);
  const ids = new Array(filesIDs).fill().map((_, i) => i);
  if (!occur) return [];
  return ids.filter(x => ![...occur].includes(x));
}

const processAtomicQuery = (query, mtr, filesIDs) => {
  query = query.toLowerCase();
  if (query.indexOf('or') != -1) return processOR(query, mtr);
  else if (query.indexOf('and') != -1) return processAND(query, mtr);
  else if (query.indexOf('not') != -1) return processNOT(query, mtr, filesIDs);
}

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

const main = async () => {
  const start = Date.now();
  // const dict1 = await createInsidenceMatrix(filenames);
  const dict2 = await createInvertedIndex(filenames);
  // console.log([...dict.keys()].slice(0, 10));
  // console.log(dict1.size);
  // console.log(dict2.size);
  // console.log(dict1.get('императрица').map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));
  // console.log(dict1.get('бояре').map((x, i) => x !== 0 ? filenames[i] : undefined).filter(x => x));
  // console.log([...dict2.get('императрица')].map(x => filenames[x]));
  // console.log([...dict2.get('бояре')].map(x => filenames[x]));
  console.log([...dict2.get('княгиня')].map(x => filenames[x]));

  console.log(processAtomicQuery('NOT княгиня', dict2, filenames.length).map(x => filenames[x]));

  console.log(`Working time: ${Date.now() - start} ms`);
}

main();
