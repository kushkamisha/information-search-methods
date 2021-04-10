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

function createTf(data) {
  const posMap = new Map();

  for (let i = 0; i < data.length; i++) {
    const words = splitIntoWords(data[i]);
    for (let j = 0; j < words.length; j++) {
      if (!posMap.has(words[j])) {
        posMap.set(words[j], new Map()); // add new word
      }
      if (!posMap.get(words[j]).has(i)) {
        posMap.get(words[j]).set(i, 1); // add document number, word occurence = 1
      } else {
        const prev = posMap.get(words[j]).get(i);
        posMap.get(words[j]).set(i, prev + 1); // increment word occurence
      }
    }
  }

  return posMap;
}

module.exports = {
  createTf,
}