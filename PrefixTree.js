// class PrefixTree {
//   // constructor() {
//   //   // this.name = name;
//   // }

//   addWord(elem) {

//   }


// }

class PrefixTree {
  constructor() {
    this.letters = new Map();
  }

  addLetter(letter) {
    if (!this.letters.has(letter)) {
      this.letters.set(letter, { name: letter, letters: new Map() });
    }
    return true;
  }

  addWord(word, letters = this.letters) {
    if (!word.length) return letters;
    const letter = word[0];
    if (!letters.has(letter)) {
      letters.set(letter, { name: letter, letters: new Map() });
    }
    // console.log({ letters: letters.get(letter).letters });
    this.addWord(word.slice(1), letters.get(letter).letters);
  }
}

module.exports = {
  PrefixTree,
}