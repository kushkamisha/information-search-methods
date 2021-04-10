// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// + 4. та пошук з урахуванням відстані для кожного з них.
const { createTf } = require('./indexes');
const { read } = require('./utils');

const filenames = [
    "Война и мир. Том 1.txt",
    "Война и мир. Том 2.txt",
    "Война и мир. Том 3.txt",
    "Война и мир. Том 4.txt",
    "Мастер и Маргарита.txt",
    "Волшебник Изумрудного города.txt",
    "Братья Карамазовы.txt",
    "Идиот.txt",
    "Униженные и оскорбленные.txt",
    "Бесы.txt",
];

function getWordOccurences(query, tf, filenames) {
    const words = query.split(' ');
    const docs = [];
    for (let i = 0; i < words.length; i++) {
        docs.push(tf.get(words[i]));
    }

    return docs;

    // const resDocs = [];
    // for (const [doc, occursWord1] of word1Docs) {
    //     if (word2Docs.get(doc)) {
    //         const occursWord2 = word2Docs.get(doc);
    //         for (let i = 0; i < occursWord1.length; i++) {
    //             for (let j = 0; j < occursWord2.length; j++) {
    //                 if (occursWord1[i] === occursWord2[j] - distance) {
    //                     resDocs.push(doc);
    //                 }
    //             }
    //         }
    //     }
    // }
    // return [...new Set(resDocs)].map(x => filenames[x]);
}

const main = async () => {
    const start = Date.now();
    const data = await Promise.all(filenames.map(filename => read(filename)));

    const tf = createTf(data);
    const query = 'величество король он';
    console.log(getWordOccurences(query, tf, filenames));
    // console.log(tf);

    console.log(`Working time is ${Date.now() - start} ms`);
}

main();
