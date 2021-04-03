const fs = require('fs');
const path = require('path');

const read = async filename => new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, 'input', filename), 'utf-8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
    }));

const createInvertedIndex = (text, docId) => {
    const words = new Map();
    const arr = text.replaceAll('\n', ' ')
        // .replaceAll(/[^a-zA-Z ]+/g, '')
        .replaceAll(/[^а-яА-Я0-9 ]+/g, '')
        .split(' ');

    for (let j = 0; j < arr.length; j++) {
        const word = arr[j].toLowerCase();
        if (!!arr[j]) {
            if (!words.has(word)) {
                words.set(word, new Set());
            }
            words.get(word).add(docId);
        }
    }

    return words;
};

module.exports = {
    read,
    createInvertedIndex,
}
