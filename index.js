// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// + 4. та пошук з урахуванням відстані для кожного з них.
const { Parser } = require('./parser');
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
    // 'Война и мир том 1-4.fb2',
    // 'Война и мир. Том 1.txt',
    // 'Война и мир. Том 2.txt',
    // 'Война и мир. Том 3.txt',
    // 'Война и мир. Том 4.txt',
    // 'Мастер и Маргарита.txt',
    // 'Волшебник Изумрудного города.fb2',
    'Волшебник Изумрудного города v2.fb2',
    // 'Волшебник Изумрудного города.txt',
    // 'Братья Карамазовы.txt',
    // 'Идиот.fb2',
    // 'Идиот.txt',
    // 'Униженные и оскорбленные.txt',
    // 'Бесы.txt',
  ];
  const start = Date.now();
  const filter = 0.7; // remove words that occur in more than (filter * 100) % of docs
  const r = 3; // champion list limit
  const tolerance = Math.log(filenames.length / (filenames.length * filter));
  const data = await Promise.all(filenames.map((filename) => read(filename)));
  const books = [];

  // books: [
  //   {
  //     title: string;
  //     author: stirng;
  //     chaptersTfs: [{
  //       title: string;
  //       tf: Map(word: string => Map(docId => occurences))
  //     }]
  //   }
  // ]
  for (let i = 0; i < data.length; i++) {
    const bookText = data[i];
    const book = new Parser(bookText);

    const title = book.title();
    const author = book.author();
    const rawChapters = book.chapters();
    // console.log({ titles: rawChapters.map((x) => x.title) });

    const chapters = [];
    for (let j = 0; j < rawChapters.length; j++) {
      const chapterTitle = rawChapters[j].title;
      const tf = createTf(rawChapters[j].body, chapterTitle);
      chapters.push({ title: chapterTitle, tf });
    }

    books.push({ title, author, chapters });
  }

  console.log(books[0]);

  // console.log(fb2Parser.title());
  // console.log(fb2Parser.author());
  // console.log(fb2Parser.date());
  // console.log(fb2Parser.content());

  // // Build Tf & Idf
  // const tf = createTf(data);
  // const idf = createIdf(tf, data.length);
  // console.log(`Initial Tf size: ${tf.size}`);

  // // Remove "stop" words from the tf map
  // // eslint-disable-next-line no-restricted-syntax
  // for (const word of idf.keys()) {
  //   if (isStopWord(word, idf, tolerance)) tf.delete(word);
  // }

  // console.log(`Tf size after removing "stop" words: ${tf.size}`);

  // // Process a query
  // const query = 'волшебник величество король он';
  // // const query = 'аделаида ивановна';
  // console.log(getChampionList(query, tf, idf, tolerance, r, filenames));

  // console.log(`Working time is ${Date.now() - start} ms`);
};

main();
