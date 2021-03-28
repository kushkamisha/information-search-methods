const fs = require('fs');
const path = require('path');
const { Compression } = require('./Compression');

const dir = 'data';
const books = fs.readdirSync(dir)
    .filter(x => x.indexOf('.txt') !== -1)
    .map(x => path.join(dir, x));

const compression = new Compression(books);
