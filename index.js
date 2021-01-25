const { rejects } = require('assert');
const fs = require('fs');
const path = require('path');

const union = sets => sets.reduce((combined, list) => new Set([...combined, ...list]), new Set());
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
        if (words.has(word)) {
          words.get(word).add(filenames[i]);
        } else {
          words.set(word, new Set());
        }
      }
    }
  }

  return words;
};

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
  const dict = await createInsidenceMatrix(filenames);
  // console.log([...dict.keys()].slice(0, 10));
  console.log(dict.size);
  // console.log(dict);
  // console.log(dict.get('ваш'))

  console.log(`Working time: ${Date.now() - start} ms`);
}

main();
