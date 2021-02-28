const util = require('util');
const { read, splitIntoWords } = require('./utils');
const { PrefixTree } = require('./PrefixTree');

const tree = new PrefixTree()
// tree.addLetter('j');
tree.addWord('hi');
console.log(util.inspect(tree.letters, true, null, true));
