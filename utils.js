const fs = require('fs');
const path = require('path');

const read = filename =>
  new Promise((resolve, reject) =>
    fs.readFile(path.join(__dirname, 'input', filename), 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)));

const cleanUp = (dirPath) => {
  const files = fs.readdirSync(dirPath);
  if (files.length > 0)
    for (let i = 0; i < files.length; i++) {
      const filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        cleanUp(filePath);
    }
  // fs.rmdirSync(dirPath);
}

const getFilesizeInBytes = filename => {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

module.exports = {
  read,
  cleanUp,
  getFilesizeInBytes,
}
