// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// + 4. та пошук з урахуванням відстані для кожного з них.
const { Parser } = require('./parser');
const { createIndex } = require('./indexes');
const { read, intersection } = require('./utils');

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
          goodChapters.push([...betterBook.chaptersIdx.get(word)]);
        }
        const commonGoodChapters = intersection(...goodChapters);
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

    books.push({
      title, author, chaptersTitles, chaptersIdx,
    });
  }

  const query = {
    title: 'Волшебник Изумрудного города',
    chapter: {
      // title: 'Гудвин',
      body: 'страшила хотел волшебница',
    },
  };

  console.log({ res: processQuery(query, books)[0].chaptersTitles });
};

main();
