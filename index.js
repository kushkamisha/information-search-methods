// const util = require('util');
// const { read, splitIntoWords, intersection } = require('./utils');
// const { PrefixTree } = require('./PrefixTree');
// const { SuffixTree } = require('./SuffixTree');

// const prefix = new PrefixTree()
// const suffix = new SuffixTree()

// prefix.addWord('hi', 5);
// prefix.addWord('hey', 7);
// prefix.addWord('hello', 8);
// prefix.addWord('solo', 7);
// prefix.addWord('halo', 3)

// suffix.addWord('hi', 5);
// suffix.addWord('hey', 7);
// suffix.addWord('hello', 8);
// suffix.addWord('solo', 7);
// suffix.addWord('halo', 3)

// // console.log(util.inspect(prefix.getSubtree('h'), true, null, true));
// // console.log(util.inspect(suffix.getSubtree('lo'), true, null, true));
// const firstPart = prefix.getSubtreeWords('h');
// const secondPart = suffix.getSubtreeWords('lo');
// console.log(firstPart, secondPart);
// console.log(intersection(firstPart, secondPart));


const { JokerQueries } = require('./JokerQueries');

const joker = new JokerQueries();

joker.addWord('hi', 5);
joker.addWord('hey', 7);
joker.addWord('hello', 8);
joker.addWord('salo', 7);
joker.addWord('halo', 3);

console.log(joker.query('h*'));
console.log(joker.query('h*lo'));
console.log(joker.query('*lo'));
