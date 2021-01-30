function splitIntoWords(data) {
  const words = data.replaceAll('\n', ' ')
    // .replaceAll(/[^a-zA-Z ]+/g, '')
    .replaceAll(/[^а-яА-Я ]+/g, '')
    .split(' ');

  const processed = [];
  for (let i = 0; i < words.length; i++) {
    if (!!words[i]) {
      processed.push(words[i].toLowerCase());
    }
  }
  return processed;
}

function createInvertedIndex(data) {
  const wordMap = new Map();

  for (let i = 0; i < data.length; i++) {
    const words = splitIntoWords(data[i]);
    for (let j = 0; j < words.length; j++) {
      if (!wordMap.has(words[j])) {
        wordMap.set(words[j], new Set());
      }
      wordMap.get(words[j]).add(i);
    }
  }

  return wordMap;
};

function createBiwordIndex(data) {
  const pairMap = new Map();

  for (let i = 0; i < data.length; i++) {
    const words = splitIntoWords(data[i]);
    for (let j = 0; j < words.length - 1; j++) {
      const pair = `${words[j]} ${words[j + 1]}`;
      if (!pairMap.has(pair)) {
        pairMap.set(pair, new Set());
      }
      pairMap.get(pair).add(i);
    }
  }

  return pairMap;
}

module.exports = {
  createInvertedIndex,
  createBiwordIndex,
}