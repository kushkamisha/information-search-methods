function splitIntoWords(data) {
  const words = data.replaceAll('\n', ' ')
    // .replaceAll(/[^a-zA-Z ]+/g, '')
    .replaceAll(/[^а-яА-Я ]+/g, '')
    .split(' ');

  const processed = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i]) {
      processed.push(words[i].toLowerCase());
    }
  }
  return processed;
}

// data: [{ title: string; body: string; }]
function createIndex(data) {
  const idx = new Map();

  for (let i = 0; i < data.length; i++) {
    const words = splitIntoWords(data[i].body);
    const { title } = data[i];
    for (let j = 0; j < words.length; j++) {
      if (!idx.has(words[j])) {
        idx.set(words[j], new Set()); // add new word
      }
      const titles = idx.get(words[j]);
      titles.add(title);
      idx.set(words[j], titles);
    }
  }

  return idx;
}

module.exports = {
  splitIntoWords,
  createIndex,
};
