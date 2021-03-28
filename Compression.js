const fs = require('fs');

class Compression {
    constructor(books) {
        this.books = books;
        this.dictionary = {}
        this.stringDict = '';
        this.pointers = [];
        this.ptrToPost = [];
        this.words = [];
        this.__init();
    }

    __init() {
        let fileId = 1;
        for (let i = 0; i < this.books.length; i++) {
            const data = fs.readFileSync(this.books[i], 'utf-8');
            console.log(data.length);
        }
    }
}

module.exports = {
    Compression,
}