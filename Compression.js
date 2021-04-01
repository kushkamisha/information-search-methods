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
        fs.writeFileSync(outputPath, this.stringDict);
    }

    compressPostings() {
        const wstream = fs.createWriteStream('myBinaryFile.txt');
        // creates random Buffer of 100 bytes
        // var buffer = crypto.randomBytes(100);

        // wstream.end();
        // this.ptrToPost = new Array(this.words.length).fill();
        // console.log(this.dictionary.get(this.words[1]));
        for (let i = 0; i < /* this.words.length */ 20; i++) {
            const docIds = this.dictionary.get(this.words[i]);
            // console.log(this.words[i]);
            console.log({ docIds });
            const distances = this.__distance(docIds);
            console.log({ distances });
            let numb = '1';
            distances.map(dist => numb += this.__gammaEncode(dist));
            // for (let j = 0; j < distances.length; j++) {
            //     numb += this.__gammaEncode(distances[j]);
            // }
            console.log({ numb });
            const decimalNumb = parseInt(numb, '2');
            this.ptrToPost.push(decimalNumb);
            // console.log({ decimalNumb });
            // console.log(this.__gammaDecode(numb));
        }
        wstream.write(Buffer.from(this.ptrToPost));
        wstream.end();
        // console.log();
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

    /**
     * 
     * @param {string} gamma binary number
     * @returns array of decimals
     */
    __gammaDecode(gamma) {
        const binary = gamma.slice(1);
        const numbers = []
        let ch = 0
        let ctr = 0
        let n = '1'

        while (ch < binary.length) {
            if (binary[ch] === '1') {
                ctr += 1;
                ch += 1;
            } else if (binary[ch] === '0') {
                for (let i = 0; i < ctr; i++) {
                    ch++;
                    n += binary[ch];
                }
                numbers.push(parseInt(n, 2));
                n = '1';
                ch++;
                ctr = 0;
            }
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