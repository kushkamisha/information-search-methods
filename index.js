// Практичне зайняття 3. Двословний індекс і координатний інвертований індекс
// + 1. Побудувати двословний індекс
// + 2. і координатний інвертований індекс по колекції документів.
// + 3. Реалізувати фразовий пошук
// + 4. та пошук з урахуванням відстані для кожного з них.
const { createTf, createIdf } = require('./indexes');
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

function getWordOccurences(query, tf, idf, tolerance, filenames) {
    const words = query.split(' ');
    const docs = [];

    for (let i = 0; i < words.length; i++) {
        if (!isStopWord(words[i], idf, tolerance))
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

const isStopWord = (word, idf, tolerance) => !!(idf.get(word) < tolerance);

const main = async () => {
    const start = Date.now();
    const filter = 0.7;
    const tolerance = Math.log(filenames.length / (filenames.length * filter));
    const data = await Promise.all(filenames.map(filename => read(filename)));

    // Build Tf & Idf
    const tf = createTf(data);
    const idf = createIdf(tf, data.length);
    console.log(`Initial Tf size: ${tf.size}`);

    // Remove "stop" words from the tf map
    for (const word of idf.keys()) {
        if (isStopWord(word, idf, tolerance)) tf.delete(word)
    }

    console.log(`Tf size after removing "stop" words: ${tf.size}`);

    // Process a query
    const query = 'принцесса величество король он';
    console.log(getWordOccurences(query, tf, idf, tolerance, filenames));

    console.log(`Working time is ${Date.now() - start} ms`);
}

main();
