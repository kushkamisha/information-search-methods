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

function createIdf(data) {
  const tf = new Map();
  const N = data.length; // number of documents
  const idf = new Map();

  for (let i = 0; i < data.length; i++) {
    const words = splitIntoWords(data[i]);
    for (let j = 0; j < words.length; j++) {
      if (!tf.has(words[j])) {
        tf.set(words[j], new Set([i])); // add new word along with docIs
      } else {
        tf.get(words[j]).add(i);
      }
    }
  }

  for (let word of tf.keys()) {
    const df = tf.get(word).size // num of docs in the collection that has the word
    idf.set(word, Math.log(N / df));
  }

  return idf;
}


module.exports = {
  createIdf,
}