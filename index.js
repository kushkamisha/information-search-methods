const { BTree, BTreeNode } = require('./BTree');

const t = 2;
const root = new BTreeNode(true);
const tree = new BTree(t, root);
tree.insert(3);
tree.insert(5);
tree.insert(6);
tree.insert(9);
console.log(tree.searchValue(root, 3).parent.children);
