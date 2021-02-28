const { arrIntersection } = require('./utils');

class ThreeGramIndex {
  constructor() {
    this.words = new Map();
  }

  addWord(word, docId) {
    const grams = this.__make3Grams(word);
    for (const gram of grams) {
      if (this.words.get(gram)) {
        const docIds = this.words.get(gram).get(word);
        if (docIds) {
          docIds.add(docId);
          this.words.get(gram).set(word, docIds);
        } else {
          this.words.get(gram).set(word, new Set([docId]));
        }
      } else {
        this.words.set(gram, new Map([[word, new Set([docId])]]));
      }
    }
  }

  query(query) {
    const [prefix, suffix] = query.split('*');
    if (!prefix && !suffix) return;
    if (!prefix) return this.__processSuffix(suffix);
    if (!suffix) return this.__processPrefix(prefix);
    return arrIntersection(
      this.__processPrefix(prefix),
      this.__processSuffix(suffix)
    );
  }

  __processPrefix(prefix) {
    return this.words.get(`$${prefix}`) ? [...this.words.get(`$${prefix}`).entries()] : [];
  }

  __processSuffix(suffix) {
    return this.words.get(`${suffix}$`) ? [...this.words.get(`${suffix}$`).entries()] : [];
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
