const fs = require('fs');
const path = require('path');

const read = (filename) => new Promise(
  (resolve, reject) => fs.readFile(
    path.join(__dirname, 'input', filename), 'utf-8', (err, data) => (
      err ? reject(err) : resolve(data)),
  ),
);

const intersection = (...arrs) => {
  const res = [];
  for (let i = 0; i < arrs[0].length; i++) {
    let ctr = 0;
    for (let j = 0; j < arrs.length; j++) {
      // console.log({ arr: arrs[j], elem: arrs[0][i] });
      if (arrs[j].includes(arrs[0][i])) ++ctr;
    }
    if (ctr === arrs.length) res.push(arrs[0][i]);
  }
  return res;
};

// console.log(intersection([3, 2, 4, 8, 1], [1, 5, 3, 2], [5, 3, 2, 8]));

module.exports = {
  read,
  intersection,
};
