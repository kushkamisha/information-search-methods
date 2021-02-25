// const { BTree } = require('./BTree');
const util = require('util');
const { read, splitIntoWords } = require('./utils');
const BinaryTree = require('btree-js');
const Tree = BinaryTree.Tree;
const Node = BinaryTree.Node;

const tree = new Tree();

// tree.insert('в');
// tree.insert('ов');
// tree.insert('ров');
// tree.insert('иров');
// tree.insert('жиров');
// tree.insert('ажиров');
// tree.insert('сажиров');
// tree.insert('ссажиров');
// tree.insert('ассажиров');
// tree.insert('пассажиров');

// tree.print();
// const subtree = tree.search('ссажиров');
// console.log(tree.getRightValues(subtree));

async function main() {
  const data = splitIntoWords(await read('Идиот.txt')).slice(0, 5);
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

  // tree.print()

  const subtree = tree.search('ан');
  console.log(util.inspect(tree.getRightSubtree((data) => console.log(data), subtree), true, 4, true));
  // console.log(tree.getRightValues(subtree));

  // tree.preOrderTraversal((data) => { console.log(data.key); }, subtree);
}

main();
