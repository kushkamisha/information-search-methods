const { BTree } = require('./BTree');

const t = 2; // 1 .. 2*t-1
const tree = new BTree(t);
// tree.insert(1);
// tree.insert(2);
// tree.insert(5);
// tree.insert(6);
// tree.insert(7);
// tree.insert(16);
// tree.insert(9);
// tree.insert(12);
// tree.insert(18);
// tree.insert(21);

tree.insert('Misha');
tree.insert('Masha');
tree.insert('Petya');
tree.insert('Vasya');

const subtree = tree.search('Misha');
// console.log(subtree);
console.log(subtree.getSubtreeValues());
// console.log(tree.root);
