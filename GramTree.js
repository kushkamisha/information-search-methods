class GramTree {
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
    return this.addWord(word.slice(1), docIndex, letters.get(letter).letters);
  }

  getSubtree(prefix, letters = this.letters) {
    if (!prefix.length) return letters;
    const letter = prefix[0];
    if (letters.has(letter)) {
      if (prefix.length === 1) return letters.get(letter);
      return this.getSubtree(prefix.slice(1), letters.get(letter).letters);
    }
  }

  getSubtreeWords(prefix) {
    const subtree = this.getSubtree(prefix);
    return this.__flattenMap(prefix, subtree);
  }

  __flattenMap(prefix, subtree, wordDocId = []) {
    if (!subtree || !subtree.letters || !subtree.letters.size) return wordDocId;
    subtree.letters.forEach((value, letter) => {
      if (value.docIndexes.size) {
        wordDocId.push([prefix + letter, value.docIndexes]);
      }
      wordDocId = [...wordDocId, ...this.__flattenMap(prefix + letter, value, wordDocId)];
    })
    return [...new Set(wordDocId)];
  }
}

module.exports = {
  GramTree,
}