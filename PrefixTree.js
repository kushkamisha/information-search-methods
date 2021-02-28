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
}

module.exports = {
  PrefixTree,
}