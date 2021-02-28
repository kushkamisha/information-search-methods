const util = require('util');
const { read, splitIntoWords } = require('./utils');
const { PrefixTree } = require('./PrefixTree');
const { SuffixTree } = require('./SuffixTree');

const prefix = new PrefixTree()
const suffix = new SuffixTree()

prefix.addWord('hi', 5);
prefix.addWord('hey', 7);
prefix.addWord('hello', 8);
prefix.addWord('solo', 7);
prefix.addWord('halo', 3)

suffix.addWord('hi', 5);
suffix.addWord('hey', 7);
suffix.addWord('hello', 8);
suffix.addWord('solo', 7);
suffix.addWord('halo', 3)

// console.log(util.inspect(prefix.getSubtree('h'), true, null, true));
// console.log(util.inspect(suffix.getSubtree('lo'), true, null, true));
console.log(prefix.getSubtreeWords('h'));
// console.log(util.inspect(suffix.getSubtree('lo'), true, null, true));
