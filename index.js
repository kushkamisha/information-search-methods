const util = require('util');
const { read, splitIntoWords } = require('./utils');
const { PrefixTree } = require('./PrefixTree');

const tree = new PrefixTree()
tree.addWord('hi', 5);
tree.addWord('hey', 7);
tree.addWord('hello', 8);
tree.addWord('yey', 7);
console.log(util.inspect(tree.getSubtree('he'), true, null, true));
// console.log(tree.getSubtree('he'));
