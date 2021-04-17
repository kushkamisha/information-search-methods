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
  const tf = new Map();

  for (let i = 0; i < data.length; i++) {
    const words = splitIntoWords(data[i].body);
    const { title } = data[i];
    for (let j = 0; j < words.length; j++) {
      if (!tf.has(words[j])) {
        tf.set(words[j], new Set()); // add new word
      }
      const titles = tf.get(words[j]);
      titles.add(title);
      tf.set(words[j], titles);
      // if (!tf.get(words[j]).has(title)) {
      //   tf.get(words[j]).set(title, 1); // add document number, word occurence = 1
      // } else {
      //   const prev = tf.get(words[j]).get(title);
      //   tf.get(words[j]).set(title, prev + 1); // increment word occurence
      // }
    }
  }

  return tf;
}

/**
 *
 * @param {*} tf
 * @param {*} N - number of documents
 * @returns
 */
function createIdf(tf, N) {
  const idf = new Map();

  for (const word of tf.keys()) {
    // tf.get(word).size
    const df = tf.get(word).size; // num of docs in the collection that has the word
    idf.set(word, Math.log(N / df));
  }

  return idf;
}

module.exports = {
  createIndex,
  createIdf,
};
