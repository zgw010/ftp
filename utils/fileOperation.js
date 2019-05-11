const fs = require('fs')
function readDirSync(dir, fileTreeObject = {}) {
  var pathList = fs.readdirSync(dir);
  pathList.forEach(function (fileName) {
    fileTreeObject[fileName] = {};
    var info = fs.statSync(dir + '/' + fileName)
    if (info.isDirectory()) {
      fileTreeObject[fileName].htmlType = 'ul';
      fileTreeObject[fileName].children = {};
      readDirSync(dir + '/' + fileName, fileTreeObject[fileName].children);
    } else {
      fileTreeObject[fileName].htmlType = 'li';
    }
  })
  return fileTreeObject;
}
function deleteFileSync(dir) {
  try {
    fs.unlinkSync(dir);
    console.log(`已成功删除 ${dir} `);
  } catch (err) {
    // 处理错误
    console.log(`删除文件 [${dir}] 出错`);
  }
}

function deleteDirectorySync(dir) {
  const files = fs.readdirSync(dir);
  const newPath = `${dir}/${files[i]}`;
  for (let i = 0; i < files.length; i++) {
    const info = fs.statSync(newPath)
    if (info.isDirectory()) {
      //如果是文件夹就递归下去
      deleteDirectorySync(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}

module.exports = {
  readDirSync,
  deleteFileSync,
  deleteDirectorySync
}