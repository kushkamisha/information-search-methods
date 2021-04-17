// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// + 4. та пошук з урахуванням відстані для кожного з них.
const { createTf, createIdf } = require('./indexes');
const { read } = require('./utils');

const isStopWord = (word, idf, tolerance) => !!(idf.get(word) < tolerance);

function getChampionList(query, tf, idf, tolerance, r, filenames) {
  const words = query.split(' ');
  const docs = [];

  // Remove "stop" words from query
  for (let i = 0; i < words.length; i++) {
    if (!isStopWord(words[i], idf, tolerance) && tf.get(words[i])) { docs.push(tf.get(words[i])); }
  }
  console.log({ docs });

  const resultTf = new Map();

  // Merge maps (docId => numOfOccurences) of all words
  for (let i = 0; i < docs.length; i++) {
    // eslint-disable-next-line no-restricted-syntax
    for (const docId of docs[i].keys()) {
      const resOccurs = resultTf.get(docId);
      const currOccurs = docs[i].get(docId);
      if (resOccurs) {
        resultTf.set(docId, resOccurs + currOccurs);
      } else {
        resultTf.set(docId, currOccurs);
      }
    }
  }
  console.log({ resultTf });

  // Sort & limit result to r
  const sortedDocsWithLimit = [...resultTf.entries()].sort((a, b) => b[1] - a[1]).slice(0, r);

  // Get filenames
  const namedDocs = sortedDocsWithLimit.map(([docId]) => filenames[docId]);

  return namedDocs;
}

const main = async () => {
  const filenames = [
    'Война и мир. Том 1.txt',
    'Война и мир. Том 2.txt',
    'Война и мир. Том 3.txt',
    'Война и мир. Том 4.txt',
    'Мастер и Маргарита.txt',
    'Волшебник Изумрудного города.txt',
    'Братья Карамазовы.txt',
    'Идиот.txt',
    'Униженные и оскорбленные.txt',
    'Бесы.txt',
  ];
  const start = Date.now();
  const filter = 0.7; // remove words that occur in more than (filter * 100) % of docs
  const r = 3; // champion list limit
  const tolerance = Math.log(filenames.length / (filenames.length * filter));
  const data = await Promise.all(filenames.map((filename) => read(filename)));

  // Build Tf & Idf
  const tf = createTf(data);
  const idf = createIdf(tf, data.length);
  console.log(`Initial Tf size: ${tf.size}`);

  // Remove "stop" words from the tf map
  // eslint-disable-next-line no-restricted-syntax
  for (const word of idf.keys()) {
    if (isStopWord(word, idf, tolerance)) tf.delete(word);
  }

  console.log(`Tf size after removing "stop" words: ${tf.size}`);

  // Process a query
  const query = 'волшебник величество король он';
  // const query = 'аделаида ивановна';
  console.log(getChampionList(query, tf, idf, tolerance, r, filenames));

  console.log(`Working time is ${Date.now() - start} ms`);
};

main();
