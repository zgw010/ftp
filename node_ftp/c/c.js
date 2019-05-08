const ftpServerFileListJson = require('./fileList.json')
// console.log(ftpServerFileListJson);
const currentFileList = Object.keys(ftpServerFileListJson)
currentFileList.forEach(element => {
  console.log(ftpServerFileListJson[element]);
});