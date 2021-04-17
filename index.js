// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// + 4. та пошук з урахуванням відстані для кожного з них.
const { Parser } = require('./parser');
const { createIndex, createIdf } = require('./indexes');
const { read, intersection } = require('./utils');

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

function processQuery(query, books) {
  const { title } = query;
  const { author } = query;
  const { chapter } = query;

  // Filter books by book title & book author
  const goodBooks = books
    .filter((book) => (title ? book.title.indexOf(title) !== -1 : true))
    .filter((book) => (author ? book.author.indexOf(author) !== -1 : true));

  if (chapter && (chapter.title || chapter.body)) {
    let betterBooks = [];

    // Filter books by chapter title
    if (chapter.title) {
      for (let i = 0; i < goodBooks.length; i++) {
        const goodChapters = goodBooks[i].chaptersTitles
          .filter((t) => t.indexOf(chapter.title) !== -1);
        if (goodChapters.length) {
          betterBooks.push({
            title: goodBooks[i].title,
            author: goodBooks[i].author,
            chaptersTitles: goodChapters,
            chaptersIdx: goodBooks[i].chaptersIdx,
          });
        }
      }
    } else {
      betterBooks = goodBooks;
    }

    let bestBooks = [];
    // Filter books by chapter body
    if (chapter.body) {
      const queryWords = chapter.body.split(' ').filter((x) => x);

      // eslint-disable-next-line no-restricted-syntax
      for (const betterBook of betterBooks) {
        const goodChapters = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const word of queryWords) {
          console.log(betterBook.chaptersIdx.get(word));
          goodChapters.push([...betterBook.chaptersIdx.get(word)]);
        }
        const commonGoodChapters = intersection(...goodChapters);
        // console.log(commonGoodChapters);
        if (commonGoodChapters.length) {
          bestBooks.push({
            title: betterBook.title,
            author: betterBook.author,
            chaptersTitles: commonGoodChapters,
            chaptersIdx: betterBook.chaptersIdx,
          });
        }
      }
    } else {
      bestBooks = betterBooks;
    }

    return bestBooks;
  }
  return goodBooks;
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
  const data = await Promise.all(filenames.map((filename) => read(filename)));
  const books = [];

  // books: [
  //   {
  //     title: string;
  //     author: stirng;
  //     chapters: [{
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
    const chapters = book.chapters();
    const chaptersTitles = chapters.map((c) => c.title);
    const chaptersIdx = createIndex(chapters);
    // console.log({ titles: rawChapters.map((x) => x.title) });

    // const chapters = [];
    // for (let j = 0; j < rawChapters.length; j++) {
    //   const chapterTitle = rawChapters[j].title;
    //   const tf = createTf(rawChapters[j].body, chapterTitle);
    //   chapters.push({ title: chapterTitle, tf });
    // }

    books.push({
      title, author, chaptersTitles, chaptersIdx,
    });
  }

  // console.log({ books: books[0].chaptersIdx });

  const query = {
    title: 'Волшебник Изумрудного города',
    chapter: {
      // title: 'Гудвин',
      body: 'страшила хотел волшебница',
    },
  };

  console.log({ res: processQuery(query, books)[0].chaptersTitles });

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
