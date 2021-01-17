const fs = require('fs');
const path = require('path');

const union = sets => sets.reduce((combined, list) => new Set([...combined, ...list]), new Set());

const filenames = [
  "Война и мир. Том 1",
  "Война и мир. Том 2",
  "Война и мир. Том 3",
  "Война и мир. Том 4",
  "Мастер и Маргарита",
  "Волшебник Изумрудного города",
  "Братья Карамазовы",
  "Идиот",
  "Униженные и оскорбленные",
  "Бесы",
];

const dicts = [];
for (let i = 0; i < filenames.length; i++) {
  const data = fs.readFileSync(path.join(__dirname, 'input', `${filenames[i]}.txt`), 'utf8');
  dicts.push(
    new Set(
      data
        .replaceAll('\n', ' ')
        .replaceAll(/[^a-zA-Zа-яА-Я ]+/g, '')
        .split(' ')
        .filter(x => x)
        .map(x => x.toLowerCase())
    )
  );
}

const dict = union(dicts);
console.log(`The size of the dictionary is ${dict.size} words`);
