const fs = require('fs');

class Compression {
    constructor(books) {
        this.books = books;
        this.dictionary = new Map();
        this.stringDict = '';
        this.pointers = [];
        this.ptrToPost = [];
        this.words = [];
        this.__init();
    }

    compressDict() {
        let blockLen = 0;

        for (let i = 0; i < this.words.length; i++) {
            if (blockLen % 4 === 0) {
                this.pointers.push(this.stringDict.length);
            }
            this.stringDict += `${this.words[i].length}${this.words[i]}`;
            this.blockLen++;
        }
    }

    compressPostings() {
        this.ptrToPost = new Array(this.words.length).fill();
        // console.log(this.dictionary.get(this.words[1]));
        for (let i = 0; i < /* this.words.length */ 20; i++) {
            const docIds = this.dictionary.get(this.words[i]);
            // console.log(this.words[i]);
            // console.log(docIds);
            const distances = this.__distance(docIds);
            console.log(distances);
            let numb = '1';
            distances.map(dist => numb += this.__gammaEncode(dist));
            // for (let j = 0; j < distances.length; j++) {
            //     numb += this.__gammaEncode(distances[j]);
            // }
            console.log(numb);
            const decimalNumb = parseInt(numb, '2');
            this.ptrToPost[i] = decimalNumb;
            // console.log(decimalNumb);
            // console.log(this.__gammaDecode(numb));
        }
    }

    writeToFile(outputPath) {
        fs.writeFileSync(outputPath, this.stringDict);
    }

    __init() {
        for (let i = 0; i < this.books.length; i++) {
            const data = fs.readFileSync(this.books[i], 'utf-8');
            const words = data.replaceAll('\n', ' ')
                // .replaceAll(/[^a-zA-Z ]+/g, '')
                .replaceAll(/[^а-яА-Я ]+/g, '')
                .split(' ');

            const docId = i + 1;
            for (let j = 0; j < words.length; j++) {
                if (!!words[j]) {
                    const word = words[j].toLowerCase();
                    const docIds = this.dictionary.get(word);
                    if (docIds) {
                        if (!docIds.includes(docId)) docIds.push(docId);
                        this.dictionary.set(word, docIds);
                    } else {
                        this.dictionary.set(word, [docId]);
                    }

                    // if (this.dictionary.has(word)) {
                    //     if (!this.dictionary.get(word).includes(docId)) {
                    //         this.dictionary.get(word).push(docId);
                    //         // this.dictionary.set(word, [...this.dictionary.get(word), docId]);
                    //     }
                    // } else {
                    //     this.dictionary.set(word, [fileId]);
                    // }
                }
            }
        }
        // console.log(this.dictionary);
        this.words = [...this.dictionary.keys()];
        this.words.sort();
        // console.log([...this.dictionary.values()].filter(x => x.length > 1));
    }

    __gammaEncode(n) {
        const binary = n.toString('2').slice(1);
        const unary = `${new Array(binary.length).fill(1).join('')}0`;
        return `${unary}${binary}`;
    }

    __gammaDecode(gamma) {
        const numbers = [];
        while (gamma.length) {
            let ctr = 0;
            while (gamma[0] !== '0') {
                gamma = gamma.slice(1);
                ctr++;
            };
            const binary = `1${gamma.slice(1, ctr + 1)}`;
            gamma = gamma.slice(ctr + 1);
            numbers.push(parseInt(binary, '2'));
        }
        return numbers;
    }

    __distance(docIds) {
        const dist = [docIds[0]];
        for (let i = 0; i < docIds.length - 1; i++) {
            dist.push(docIds[i + 1] - docIds[i]);
        }
        return dist;
    }
}

module.exports = {
    Compression,
}