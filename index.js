const { read, splitIntoWords } = require('./utils');
const { PrefixTree } = require('./PrefixTree');

const tree = new PrefixTree()
tree.addLetter('j');
console.log(tree.letters);
