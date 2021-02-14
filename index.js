const { BTree, BTreeNode } = require('./BTree');

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
// console.log(root.n);
// console.log(tree.getMinMaxFromSubTree(root, 0))
// console.log(tree.searchValue(root, 3));
// console.log(tree.searchValue(root, 3).parent.children);
// console.log(root.parent.parent);
// console.log((root.parent.parent).children[1].children);
// const { root } = tree;
// console.log(root);
const subtree = tree.search(16);
// console.log(subtree);
console.log(subtree.getSubtreeValues());
