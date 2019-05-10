const fs = require('fs')
function readDirSync(path, fileTreeObject = {}) {
  var pathList = fs.readdirSync(path);
  pathList.forEach(function (fileName) {
    fileTreeObject[fileName] = {};
    var info = fs.statSync(path + '/' + fileName)
    if (info.isDirectory()) {
      // object[fileName].type = 'isDirectory';
      fileTreeObject[fileName].htmlType = 'ul';
      fileTreeObject[fileName].children = {};
      readDirSync(path + '/' + fileName, fileTreeObject[fileName].children);
    } else {
      // object[fileName].type = 'isFile';
      fileTreeObject[fileName].htmlType = 'li';
    }
  })
  return fileTreeObject;
}

module.exports = {
  readDirSync
}