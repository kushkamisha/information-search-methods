const fs = require('fs');
const path = require('path');
const { Compression } = require('./Compression');

const dir = 'data';
const books = fs.readdirSync(dir)
    .filter(x => x.indexOf('.txt') !== -1)
    .map(x => path.join(dir, x));
const output = path.join(__dirname, 'out.txt');

const compression = new Compression(books);
// compression.compressDict();
// compression.writeToFile(output);
compression.compressPostings();

// console.log(compression.__gammaEncode(2));
// console.log(compression.__gammaDecode('1011001101'));
