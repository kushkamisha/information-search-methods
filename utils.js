const fs = require('fs');
const path = require('path');

const read = (filename) => new Promise(
  (resolve, reject) => fs.readFile(
    path.join(__dirname, 'input', filename), 'utf-8', (err, data) => (
      err ? reject(err) : resolve(data)),
  ),
);

module.exports = {
  read,
};
