function splitIntoWords(data) {
  const words = [];
  let temp = '';
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === ' ' || data[i][j] === '\n') {
        if (temp.length) words.push(temp);
        temp = '';
      } else if (/[^а-яА-Я ]+/g.test(data[i][j])) {
        continue;
      } else {
        temp += data[i][j].toLowerCase();
      }
    }
  }
  return words;
}

function stepMap(data, docId) {
  const words = splitIntoWords(data);
  const termDocPairs = new Set();
  for (let i = 0; i < words.length; i++) {
    termDocPairs.add([words[i], docId]);
  }
  return termDocPairs;
}

module.exports = {
  splitIntoWords,
  stepMap,
}
