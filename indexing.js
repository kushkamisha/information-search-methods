function stepMap(data) {
  const termDocPairs = new Set();
  let word = '';
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === ' ' || data[i][j] === '\n') {
        if (word.length) termDocPairs.add([word, i])
        word = '';
      } else if (/[^а-яА-Я ]+/g.test(data[i][j])) {
        continue;
      } else {
        word += data[i][j].toLowerCase();
      }
    }
  }
  return termDocPairs;
}

module.exports = {
  stepMap,
}
