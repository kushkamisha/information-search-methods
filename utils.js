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
      if (arrs[j].includes(arrs[0][i])) ++ctr;
    }
    if (ctr === arrs.length) res.push(arrs[0][i]);
  }
  return res;
};

module.exports = {
  read,
  intersection,
};
