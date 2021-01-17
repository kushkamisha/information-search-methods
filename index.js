// Написати програму, що по заданій колекції текстових файлів будує словник термінів.

// 1. Текстові файли подаються на вхід в будь - якому форматі.
// + 2. Розмір текстових файлів не менше 150 К.
// + 3. Кількість текстових файлів не менше 10.
// + 4. Словник термінів зберегти на диск.
// 5. Оцінити розмір колекції, загальну кількість слів в колекції та розмір словника.
// 6. Обгрунтувати структуру даних
// 7. Зробити оцінку складності алгоритму
// 8. Випробувати декілька форматів збереження словника(серіалізація словника, збереження в текстовий файл і т.д.) і порівняти результати.

const fs = require('fs');
const path = require('path');

const union = sets => sets.reduce((combined, list) => new Set([...combined, ...list]), new Set());

const filenames = [
  "Война и мир. Том 1",
  // "Война и мир. Том 2",
  // "Война и мир. Том 3",
  // "Война и мир. Том 4",
  // "Мастер и Маргарита",
  // "Волшебник Изумрудного города",
  // "Братья Карамазовы",
  // "Идиот",
  // "Униженные и оскорбленные",
  // "Бесы",
];

const dicts = [];
for (let i = 0; i < filenames.length; i++) {
  const data = fs.readFileSync(path.join(__dirname, 'input', `${filenames[i]}.txt`), 'utf8');
  dicts.push(
    new Set(
      data
        .replaceAll('\n', ' ')
        // .replaceAll(/[^a-zA-Z ]+/g, '')
        .replaceAll(/[^а-яА-Я ]+/g, '')
        .split(' ')
        .filter(x => x)
        .map(x => x.toLowerCase())
    )
  );
}

const dict = union(dicts);
console.log(`The size of the dictionary is ${dict.size} words`);
// console.log([...new Set([1, 2, 3]).values()].join('\n'))

fs.writeFileSync(path.join(__dirname, 'output', 'dictionary.txt'), [...dict.values()].join('\n'));
