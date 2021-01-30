const { read } = require('./utils');

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

module.exports = {
  createInvertedIndex,
}