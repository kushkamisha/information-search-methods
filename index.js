// const { BTree } = require('./BTree');
const util = require('util');
const { read, splitIntoWords } = require('./utils');
const BinaryTree = require('btree-js');
const Tree = BinaryTree.Tree;
const Node = BinaryTree.Node;

const tree = new Tree();

// const t = 1 // 2; // 1 .. 2*t-1
// const tree = new BTree(t);
// // tree.insert(12);
// // tree.insert(18);
// // tree.insert(21);
// // tree.insert(1);
// // tree.insert(2);
// // tree.insert(5);
// // tree.insert(6);
// // tree.insert(7);
// // tree.insert(16);
// // tree.insert(9);

// tree.insert('o');
// tree.insert('lo');
// tree.insert('llo');
// tree.insert('ello');
// tree.insert('hello');

// tree.insert('hello$');
// tree.insert('ello$h');
// tree.insert('llo$he');
// tree.insert('lo$hel');
// tree.insert('o$hell');
// tree.insert('$hello');

// tree.insert('l');
// tree.insert('ll');
// tree.insert('llo$');
// tree.insert('llo$h');
// tree.insert('llo$he');
// tree.insert('llo');

tree.insert('o');
tree.insert('lo');
tree.insert('llo');
tree.insert('ello');
tree.insert('hello');

// tree.insert('o');
// tree.insert('lo');
// tree.insert('alo');
// tree.insert('malo');

// tree.bulkInsert(50, 25, 75, 60, 90);
// tree.insert(50);
// tree.insert(25);
// tree.insert(75);
// tree.insert(60);
// tree.insert(90);
tree.print();
// tree.preOrderTraversal(function (node) {
//   console.log(node.value);
// });
// console.log(tree.search('hello'));
const subtree = tree.search('hello');
// console.log(subtree.getSubtreeValues());
console.log(tree.getRightValues(subtree));
// console.log(util.inspect(subtree, true, 4, true));

async function main() {
  const data = splitIntoWords(await read('Идиот.txt')).slice(0, 100);
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    let value = '';
    const word = data[i];
    for (let j = word.length - 1; j >= 0; j--) {
      value = word[j] + value;
      console.log(value)
      tree.insert(value);
    }
  }

  const subtree = tree.search('пассажиров');
  console.log(util.inspect(subtree, true, 4, true));
  // console.log(subtree.getSubtreeValues());
  // console.log(tree.root);
}

// main();
