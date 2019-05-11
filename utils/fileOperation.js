const fs = require('fs')
function readDirSync(path, fileTreeObject = {}) {
  var pathList = fs.readdirSync(path);
  pathList.forEach(function (fileName) {
    fileTreeObject[fileName] = {};
    var info = fs.statSync(path + '/' + fileName)
    if (info.isDirectory()) {
      fileTreeObject[fileName].htmlType = 'ul';
      fileTreeObject[fileName].children = {};
      readDirSync(path + '/' + fileName, fileTreeObject[fileName].children);
    } else {
      fileTreeObject[fileName].htmlType = 'li';
    }
  })
  return fileTreeObject;
}
function deleteFileSync(file){
  try {
    fs.unlinkSync(file);
    console.log(`已成功删除 ${file} `);
  } catch (err) {
    // 处理错误
    console.log(`删除文件 [${file}] 出错`);
  }
}
module.exports = {
  readDirSync,
  deleteFileSync
}