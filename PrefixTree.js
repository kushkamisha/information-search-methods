class PrefixTree {
  constructor() {
    this.letters = new Map();
  }

  addWord(word, docIndex, letters = this.letters) {
    const letter = word[0];
    if (!letters.has(letter)) {
      letters.set(letter, { docIndexes: new Set(), letters: new Map() });
    }
    if (word.length === 1) {
      letters.get(letter).docIndexes.add(docIndex);
      return;
    }
    // console.log({ letters: letters.get(letter).letters });
    return this.addWord(word.slice(1), docIndex, letters.get(letter).letters);
  }

  getSubtree(prefix, letters = this.letters) {
    const letter = prefix[0];
    if (letters.has(letter)) {
      // console.log({ len: prefix.length, result: letters.get(letter) });
      if (prefix.length === 1) return letters.get(letter);
      return this.getSubtree(prefix.slice(1), letters.get(letter).letters);
    }
  }
}

module.exports = {
  PrefixTree,
}