const util = require('util');
const { read, splitIntoWords } = require('./utils');
const { PrefixTree } = require('./PrefixTree');

const tree = new PrefixTree()
tree.addWord('hi', 5);
console.log(util.inspect(tree.letters, true, null, true));
