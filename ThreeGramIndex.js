const { intersection } = require('./utils');

class ThreeGramIndex {
  constructor() {
    this.words = new Map();
  }

  addWord(word, docId) {
    const grams = this.__make3Grams(word);
    for (const gram of grams) {
      const list = this.words.get(gram);
      if (list) {
        list.push([word, docId]);
        this.words.set(gram, list);
      } else {
        this.words.set(gram, [[word, docId]]);
      }
    }
  }

  query(query) {
    const [prefix, suffix] = query.split('*');
    if (!prefix && !suffix) return;
    if (!prefix) return this.__processSuffix(suffix);
    if (!suffix) return this.__processPrefix(prefix);
    return intersection(
      this.__processPrefix(prefix),
      this.__processSuffix(suffix)
    );
  }

  __processPrefix(prefix) {
    return this.words.get(`$${prefix}`) || [];
  }

  __processSuffix(suffix) {
    return this.words.get(`${suffix}$`) || [];
  }

  __make3Grams(word) {
    const grams = [];
    const extended = `$${word}$`;
    for (let i = 0; i < word.length; i++) {
      grams.push(extended.slice(i, i + 3));
    }
    return grams;
  }
}

module.exports = {
  ThreeGramIndex,
}
