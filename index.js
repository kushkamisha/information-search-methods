const { JokerQueries } = require('./JokerQueries');
const { PermutationIndex } = require('./PermutationIndex');
const { ThreeGramIndex } = require('./ThreeGramIndex');

const joker = new JokerQueries();
const perms = new PermutationIndex();
const tgram = new ThreeGramIndex();

// Prefix + suffix trees
joker.addWord('hi', 5);
joker.addWord('hey', 7);
joker.addWord('hello', 8);
joker.addWord('salo', 7);
joker.addWord('halo', 3);

console.log(joker.query('h*'));
console.log(joker.query('h*lo'));
console.log(joker.query('*lo'));
console.log(joker.query('x*'));

// Prefix tree with word permutaions
perms.addWord('hi', 5);
perms.addWord('hey', 7);
perms.addWord('hello', 8);
perms.addWord('salo', 7);
perms.addWord('halo', 3);

console.log(perms.query('h*'));
console.log(perms.query('h*lo'));
console.log(perms.query('*lo'));
console.log(joker.query('x*'));

// 3-gram index
tgram.addWord('hi', 5);
tgram.addWord('hey', 7);
tgram.addWord('hello', 8);
tgram.addWord('salo', 7);
tgram.addWord('halo', 3);

console.log(tgram.query('he*'));
console.log(tgram.query('he*lo'));
console.log(tgram.query('*lo'));

