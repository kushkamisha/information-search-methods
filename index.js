const { read, createInvertedIndex } = require('./utils');

const filenames = [
  "Мастер и Маргарита.txt",
  "Война и мир. Том 1.txt",
  "Война и мир. Том 2.txt",
  "Война и мир. Том 3.txt",
  "Война и мир. Том 4.txt",
  "Волшебник Изумрудного города.txt",
  "Братья Карамазовы.txt",
  "Идиот.txt",
  "Униженные и оскорбленные.txt",
  "Бесы.txt",
];

const main = async () => {
  const texts = await Promise.all(filenames.map(filename => read(filename)));

  // Get titles, authors, bodies
  const titles = [];
  const authors = [];
  const bodies = [];

  for (let i = 0; i < texts.length; i++) {
    const titleInd = texts[i].indexOf('title: ');
    const titleOffset = 7;
    let tmp = '';
    let j = titleInd + titleOffset;

    while (texts[i][j] !== '\n' && texts[i][j] !== '\r') {
      tmp += texts[i][j];
      j++;
    }
    titles.push(tmp);

    const authorInd = texts[i].indexOf('author: ');
    const authorOffset = 8;
    tmp = '';
    j = authorInd + authorOffset;
    while (texts[i][j] !== '\n' && texts[i][j] !== '\r') {
      tmp += texts[i][j];
      j++;
    }
    authors.push(tmp);

    bodies.push(texts[i].slice(j));
  }

  // Create inverted indexes for each zone
  const titlesDict = [];
  const authorsDict = [];
  const bodiesDict = [];

  for (let i = 0; i < titles.length; i++) {
    titlesDict.push(createInvertedIndex(titles[i], i));
    authorsDict.push(createInvertedIndex(authors[i], i));
    bodiesDict.push(createInvertedIndex(bodies[i], i));
  }

  // Implement weighted zone search
  const weights = {
    title: 0.3,
    author: 0.2,
    body: 0.5,
  };
  // const rawQuery = 'мир война';
  // const rawQuery = 'подавно она';
  const rawQuery = 'если б только';
  const query = rawQuery.split(' ').map(x => x.toLowerCase());
  const scores = [];

  for (let i = 0; i < titles.length; i++) {
    let isInTitles = true;
    let isInAuthors = true;
    let isInBodies = true;

    for (let j = 0; j < query.length; j++) {
      if (isInTitles)
        isInTitles = isInTitles && [...titlesDict[i].get(query[j]) || []].includes(i);
      if (isInAuthors)
        isInAuthors = isInAuthors && [...authorsDict[i].get(query[j]) || []].includes(i);
      if (isInBodies)
        isInBodies = isInBodies && [...bodiesDict[i].get(query[j]) || []].includes(i);
    }

    const titleScore = isInTitles ? weights.title : 0;
    const authorScore = isInAuthors ? weights.author : 0;
    const bodyScore = isInBodies ? weights.body : 0;
    console.log({
      titleScore,
      authorScore,
      bodyScore,
    })
    scores.push(titleScore + authorScore + bodyScore);
  }
  console.log({ scores });

  // Post processing scores
  const rank = [];
  for (let i = 0; i < filenames.length; i++) {
    rank.push({ file: filenames[i], score: scores[i] });
  }
  rank.sort((a, b) => b.score - a.score);
  console.log(rank);

  // console.log(`Working time: ${Date.now() - start} ms`);
}

main();
