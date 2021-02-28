const { JokerQueries } = require('./JokerQueries');
const { PermutationIndex } = require('./PermutationIndex');

const joker = new JokerQueries();
const perms = new PermutationIndex();

// joker.addWord('hi', 5);
// joker.addWord('hey', 7);
// joker.addWord('hello', 8);
// joker.addWord('salo', 7);
// joker.addWord('halo', 3);

// console.log(joker.query('h*'));
// console.log(joker.query('h*lo'));
// console.log(joker.query('*lo'));

// console.log(perms.__makePermutations('hello'));

perms.addWord('hi', 5);
perms.addWord('hey', 7);
perms.addWord('hello', 8);
perms.addWord('salo', 7);
perms.addWord('halo', 3);

console.log(perms.query('h*'));
console.log(perms.query('h*lo'));
console.log(perms.query('*lo'));
