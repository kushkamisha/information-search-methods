const { PrefixTree } = require('./PrefixTree');
const { intersection } = require('./utils');

class PermutationIndex {
  constructor() {
    this.prefix = new PrefixTree()
  }

  addWord(word, docId) {
    const perms = this.__makePermutations(word);
    for (const perm of perms) {
      this.prefix.addWord(perm, docId);
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
    const words = this.prefix.getSubtreeWords(prefix);
    return words.map((word) => [word[0].slice(0, -1), word[1]]);
  }

  __processSuffix(suffix) {
    const words = this.prefix.getSubtreeWords(`${suffix}$`);
    return words.map((word) => [this.__formatPermuttedWord(word[0]), word[1]]);
  }

  __makePermutations(word) {
    let curr = word + '$';
    const perms = [curr];
    for (let i = 0; i < word.length; i++) {
      curr = curr.slice(1) + curr[0];
      perms.push(curr);
    }
    return perms;
  }

  __formatPermuttedWord(word) {
    const index = word.indexOf('$');
    return `${word.slice(index + 1)}${word.slice(0, index)}`;
  }
}

module.exports = {
  PermutationIndex,
}
