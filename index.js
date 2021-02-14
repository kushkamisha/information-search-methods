const { BTree } = require('./BTree');

const t = 2; // 1 .. 2*t-1
const tree = new BTree(t);
tree.insert(1);
tree.insert(2);
tree.insert(5);
tree.insert(6);
tree.insert(7);
tree.insert(16);
tree.insert(9);
tree.insert(12);
tree.insert(18);
tree.insert(21);

const subtree = tree.search(16);
console.log(subtree.getSubtreeValues());
