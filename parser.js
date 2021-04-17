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
    const res = [];
    const parts = this.book.FictionBook.body.section;
    for (let i = 0; i < parts.length; i++) {
      const chapters = parts[i].section;
      if (chapters) {
        for (let j = 0; j < chapters.length; j++) {
          const chapter = this.getTitleAndBody(chapters[j]);

          if (chapter) res.push(chapter);
        }
      } else {
        const chapter = this.getTitleAndBody(parts[i]);
        if (chapter) res.push(chapter);
      }
    }

    return res;
  }

  // eslint-disable-next-line class-methods-use-this
  getTitleAndBody(part) {
    const title = part?.title;
    const body = part?.p?.reduce((acc, cur) => acc + cur, '');
    return (title && body) ? ({ title, body }) : undefined;
  }
}

module.exports = {
  Parser,
};
