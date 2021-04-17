const libxmljs = require('libxmljs');

class Fb2Parser {
  constructor(book) {
    this.book = book;
    //  = {
    //             fb: 'http://www.gribuser.ru/xml/fictionbook/2.0'
    //         };
  }

  load(document) {
    this.book = libxmljs.parseXmlString(document);
  }

  title() {
    return this.book.get('//fb:book-title').text();
  }

  author() {
    return `${this.book.get('//fb:first-name').text()} ${this.book.get('//fb:last-name').text()}`;
  }

  date() {
    return this.book.get('//fb:date').text();
  }

  content() {
    const chapters = [];

    this.book.find('//fb:body[1]/fb:section').forEach((section) => {
      const title = section.get('fb:title/fb:p').text();
      let content = '';

      section.childNodes().forEach((child) => {
        if (child.name() !== 'title') {
          content += child.toString();
        }
      });

      const chapter = {
        title,
        content,
      };
      chapters.push(chapter);
    });

    return chapters;
  }

  finalize() {
    return this.book;
  }
}

module.exports = {
  Fb2Parser,
};
