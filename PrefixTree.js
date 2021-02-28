class PrefixTree {
  constructor() {
    this.letters = new Map();
  }

  addWord(word, docIndex, letters = this.letters) {
    const letter = word[0];
    if (!letters.has(letter)) {
      letters.set(letter, { name: letter, docIndexes: new Set(), letters: new Map() });
    }
    if (word.length === 1) {
      letters.get(letter).docIndexes.add(docIndex);
      return;
    }
    // console.log({ letters: letters.get(letter).letters });
    this.addWord(word.slice(1), docIndex, letters.get(letter).letters);
  }
}

module.exports = {
  PrefixTree,
}