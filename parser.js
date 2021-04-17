const parser = require('fast-xml-parser');

class Parser {
  constructor(text) {
    this.book = parser.parse(text);
  }

  title() {
    return this.book.FictionBook.description['title-info']['book-title'];
  }

  author() {
    const {
      'first-name': fName, 'middle-name': mName, 'last-name': lName,
    } = this.book.FictionBook.description['title-info'].author;
    return `${fName} ${mName} ${lName}`;
  }

  body() {
    return this.book.FictionBook.body;
  }

  chapters() {
    // console.log({ x: this.book.FictionBook.body.section[4].title.p }); // часть третья. Исполнение желаний
    // console.log({ x: this.book.FictionBook.body.section[1].title.p }); // ураган
    // console.log({ x: this.book.FictionBook.body.section[2].title.p }); // 'Часть первая', 'Дорога из жёлтого кирпича
    // console.log({ x: this.book.FictionBook.body.section[2].section[0].title }); // 'Часть первая', 'Дорога из жёлтого кирпича -> Элли в удивительной стране жевунов
    // console.log({ x: this.book.FictionBook.body.section[2].section[0].p.reduce((acc, cur) => acc + cur, '') }); // 'Часть первая', 'Дорога из жёлтого кирпича -> Элли в удивительной стране жевунов

    const res = [];
    const parts = this.book.FictionBook.body.section;
    for (let i = 2; i < parts.length; i++) {
      // console.log({ parts: parts[i] });
      // console.log({ i, part: parts[i] });
      const chapters = parts[i].section;
      // eslint-disable-next-line no-continue
      // if (!chapters) continue;
      if (chapters) {
        for (let j = 0; j < chapters.length; j++) {
          res.push(this.getTitleAndBody(chapters[j]));
        }
      } else {
        // console.log(1);
        // console.log({ i, part: parts[2].title });
        res.push(this.getTitleAndBody(parts));
      }
    }

    return res;
  }

  // eslint-disable-next-line class-methods-use-this
  getTitleAndBody(part) {
    const title = part?.title;
    const body = part?.p?.reduce((acc, cur) => acc + cur, '');
    return ({ title, body });
  }
}

module.exports = {
  Parser,
};
