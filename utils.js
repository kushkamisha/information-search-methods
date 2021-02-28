const fs = require('fs');
const path = require('path');

const read = filename =>
  new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, 'input', filename), 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)));

function splitIntoWords(data) {
  const words = data.replaceAll('\n', ' ')
    // .replaceAll(/[^a-zA-Z ]+/g, '')
    .replaceAll(/[^а-яА-Я ]+/g, '')
    .split(' ');

  const processed = [];
  for (let i = 0; i < words.length; i++) {
    if (!!words[i]) {
      processed.push(words[i].toLowerCase());
    }
  }
  return processed;
}

const arrIntersection = (arr1, arr2) => {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i][0] === arr2[j][0]) result.push(arr1[i]);
    }
  }
  return result;
}

module.exports = {
  read,
  arrIntersection,
  splitIntoWords,
}
