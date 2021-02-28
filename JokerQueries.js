const { PrefixTree } = require('./PrefixTree');
const { SuffixTree } = require('./SuffixTree');
const { arrIntersection } = require('./utils');

class JokerQueries {
  constructor() {
    this.prefix = new PrefixTree()
    this.suffix = new SuffixTree()
  }

  addWord(word, docId) {
    this.prefix.addWord(word, docId);
    this.suffix.addWord(word, docId);
  }

  query(query) {
    const [prefix, suffix] = query.split('*');
    if (!prefix && !suffix) return;
    if (!prefix) return this.suffix.getSubtreeWords(suffix);
    if (!suffix) return this.prefix.getSubtreeWords(prefix);
    return arrIntersection(
      this.prefix.getSubtreeWords(prefix),
      this.suffix.getSubtreeWords(suffix)
    );
  }
}

module.exports = {
  JokerQueries,
}