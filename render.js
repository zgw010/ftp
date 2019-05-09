const net = require('net');
const fs = require('fs');
// const ftpServerFileListJSONFile = 'fileList.json';

// let totalLength = 0;
// let writeStream;
// let socket = net.createConnection({ port: 8124 }, () => {
//   console.log('connected to server!');
// });
// socket.on('data', (chunk) => {
//   totalLength += chunk.length;
//   console.log('recevied data size: ' + totalLength + 'KB');
// });
// socket.on('error', (er) => {
//   console.log(er);
// })
// socket.on('end', function () {
//   console.log('Connection end');
// });
// socket.on('close', function (e) {
//   console.log('Connection closed', e);
// });
// writeStream = fs.createWriteStream(ftpServerFileListJSONFile)
// const stream = socket.pipe(writeStream);
// stream.on('finish', function () {
//   const ftpServerFileListJson = require('./fileList.json').ftpFile
//   const root = document.querySelector('#left');
//   const newRoot = document.createElement('div');
//   const rootCatalogDom = document.createElement('div');

//   rootCatalogDom.setAttribute('data', './ftpFile/ftpFile/')
//   root.appendChild(rootCatalogDom);
//   function createFileTreeDom(dom, file) {
//     const currentFileList = Object.keys(file.children)
//     const currentDom = document.createElement(file.htmlType);
//     file = file.children;
//     currentFileList.forEach(currentFile => {
//       if (file[currentFile].htmlType === 'li') {
//         const currentLiDom = document.createElement('li');
//         currentLiDom.oncontextmenu = function (e) {
//           e.preventDefault();
//         };
//         //在这里你就可以自己定义事件的函数啦
//         currentLiDom.onmouseup = function (e) {
//           if (!e) e = window.event;
//           if (e.button == 2) {
//             let path = '';
//             let findRootPtr = e.target.parentElement;
//             // console.log(findRootPtr.tagName);
//             while (findRootPtr.tagName !== 'DIV') {
//               path = findRootPtr.previousElementSibling.getAttribute('data') + '/' + path;
//               // console.log(findRootPtr.previousElementSibling.getAttribute('data'));
//               findRootPtr = findRootPtr.parentElement;

//             }
//             path = path + e.target.textContent;

//             // 获取文件
//             // totalLength = 0;
//             const socket = net.createConnection({ port: 8124 }, () => {
//               console.log('connected to server!');
//             });
//             socket.on('data', (chunk) => {
//               totalLength += chunk.length;
//               console.log('recevied data size: ' + totalLength + 'KB');
//             });
//             socket.on('error', (er) => {
//               console.log(er);
//             })
//             socket.on('end', function () {
//               console.log('Connection end');
//             });
//             socket.on('close', function (e) {
//               console.log('Connection closed', e);
//             });
//             writeStream = fs.createWriteStream(e.target.textContent)
//             socket.pipe(writeStream);
//             socket.write('get ' + path, function () {
//               console.log(socket.destroyed);
//             })


//           }
//         }
//         const currentLiContent = document.createTextNode(currentFile);
//         currentLiDom.appendChild(currentLiContent);
//         currentDom.appendChild(currentLiDom)
//       } else if (file[currentFile].htmlType === 'ul') {
//         const currentTreeDom = createFileTreeDom(dom, file[currentFile])

//         const catalogDom = document.createElement('div');
//         catalogDom.setAttribute('data', `${currentFile}`)
//         const catalogDomIcon = document.createElement('div');
//         catalogDomIcon.appendChild(document.createTextNode('+'));
//         const catalogDomContent = document.createTextNode(currentFile);
//         catalogDomIcon.setAttribute('class', 'catalogIcon');
//         catalogDom.setAttribute('class', 'catalog');
//         catalogDom.appendChild(catalogDomIcon);
//         catalogDom.appendChild(catalogDomContent);

//         currentDom.appendChild(catalogDom);
//         currentDom.appendChild(currentTreeDom);
//       }
//     });
//     return currentDom;
//   }


//   // console.log(newRoot,ftpServerFileListJson);
//   const res = createFileTreeDom(newRoot, ftpServerFileListJson);
//   // root.appendChild(rootCatalogDom);

//   root.appendChild(res);

// //   const currentControlButtons = document.querySelectorAll('.catalogIcon');
// //   currentControlButtons.forEach(currentControlButton => {
// //     currentControlButton.addEventListener('click', function (e) {
// //       if (e.target.parentElement.nextElementSibling.style.display === 'none') {
// //         e.target.textContent = '-';
// //         e.target.parentElement.nextElementSibling.style.display = 'block';
// //       } else {
// //         e.target.textContent = '+';
// //         e.target.parentElement.nextElementSibling.style.display = 'none';
// //       }
// //     })
// //   });

// //   currentControlButtons.forEach(currentControlButton => {
// //     currentControlButton.parentElement.nextElementSibling.style.display = 'none';
// //   });
// });

// socket.write('ls', function () {
//   console.log(socket.destroyed);
// })


//处理本地文件



// 构建服务器文件目录树

// 获取服务器目录的 JSON 文件, 保存在本地
function getServerFileListJSON(serverfileListLocalPath) {
  // TODO 这里写死了, 应该改成可配置的
  const ftpServerFileListJson = require('./fileList.json').ftpFile
  const root = document.querySelector('#left');
  const newRoot = document.createElement('div');
  const rootCatalogDom = document.createElement('div');

  rootCatalogDom.setAttribute('data', './ftpFile/ftpFile/')
  root.appendChild(rootCatalogDom);
  const res = createFileTreeDom(newRoot, ftpServerFileListJson);
  root.appendChild(res);

  const currentControlButtons = document.querySelectorAll('.catalogIcon');
  currentControlButtons.forEach(currentControlButton => {
    currentControlButton.addEventListener('click', function (e) {
      if (e.target.parentElement.nextElementSibling.style.display === 'none') {
        e.target.textContent = '-';
        e.target.parentElement.nextElementSibling.style.display = 'block';
      } else {
        e.target.textContent = '+';
        e.target.parentElement.nextElementSibling.style.display = 'none';
      }
    })
  });
  currentControlButtons.forEach(currentControlButton => {
    currentControlButton.parentElement.nextElementSibling.style.display = 'none';
  });
}

function initServerFileListTree() {
  getServerFileListJSON(serverfileListLocalPath);
}

// mode(string): get or put
// fileName(string): get or put fileName
// socketOption(object): {port:number,ip:string}
// instruction(function): send a command to the server
// [cb(function)]: when pipe finish call this function
function createSocketConnection(mode, fileName, socketOption, instruction, cb, cbOptions) {
  let totalLength = 0;
  let writeStream, streamIsFinish, readStream;
  const socket = net.createConnection(socketOption, () => {
    console.log('connected to server!');
  });
  socket.on('data', (chunk) => {
    totalLength += chunk.length;
    console.log('recevied data size: ' + totalLength + 'KB');
  });
  socket.on('error', (er) => {
    console.log(er);
  })
  socket.on('end', function () {
    console.log('Connection end');
  });
  socket.on('close', function (e) {
    console.log('Connection closed', e);
  });
  if (mode === 'get') {
    writeStream = fs.createWriteStream(fileName);
    streamIsFinish = socket.pipe(writeStream);
  } else if (mode === 'put') {
    readStream = fs.createReadStream(fileName);
    streamIsFinish = readStream.pipe(socket);
  }
  if (cb && (typeof cb == 'function')) {
    streamIsFinish.on('finish', function () { cb(cbOptions.dom, cbOptions.file) });
  }
  if (instruction) {
    console.log('instruction', instruction);
    socket.write(instruction);
  } else {
    console.log('error, lack instruction');
  }
}
let file = 'fileList.json';

const root = document.querySelector('#left');
createSocketConnection('get', file, { port: 8124 }, 'ls', createFileTreeDom, { dom: root, file });

// 打开程序的时候初始化一次, 需要向服务器发送 ls 请求, 接收从服务器发来的 JSON 格式的文件目录, 保存在本地
// 之后根据 JSON 文件来构建 DOM 树.
function createFileTreeDom(root, ftpServerFileList) {
  ftpServerFileListJson = require('./' + ftpServerFileList).ftpFile;
  // require(ftpServerFileListJson).ftpFile
  // console.log(ftpServerFileListJson);
  // ftpServerFileListJson = './'+ftpServerFileListJson
  // console.log(createFileTreeDomRecursion();
  // return;
  // const root = document.querySelector('#left');
  const newRoot = document.createElement('div');

  const rootCatalogDom = document.createElement('div');
  rootCatalogDom.setAttribute('data', './ftpFile/ftpFile/')

  root.appendChild(rootCatalogDom);

  const res = createFileTreeDomRecursion(ftpServerFileListJson);
  root.appendChild(res);
}
function createFileTreeDomRecursion(file) {
  const currentFileList = Object.keys(file.children)
  // console.log(currentFileList);
  const currentDom = document.createElement(file.htmlType);
  // console.log(currentDom);
  file = file.children;
  currentFileList.forEach(currentFile => {
    // console.log(file[currentFile].htmlType);
    if (file[currentFile].htmlType === 'li') {
      const currentLiDom = document.createElement('li');
      // currentLiDom.oncontextmenu = function (e) {
      //   e.preventDefault();
      // };
      //在这里你就可以自己定义事件的函数啦
      // currentLiDom.onmouseup = function (e) {
      //   if (!e) e = window.event;
      //   if (e.button == 2) {
      //     let path = '';
      //     let findRootPtr = e.target.parentElement;
      //     // console.log(findRootPtr.tagName);
      //     while (findRootPtr.tagName !== 'DIV') {
      //       path = findRootPtr.previousElementSibling.getAttribute('data') + '/' + path;
      //       // console.log(findRootPtr.previousElementSibling.getAttribute('data'));
      //       findRootPtr = findRootPtr.parentElement;

      //     }
      //     path = path + e.target.textContent;

      //     // 获取文件
      //     // totalLength = 0;
      //     const socket = net.createConnection({ port: 8124 }, () => {
      //       console.log('connected to server!');
      //     });
      //     socket.on('data', (chunk) => {
      //       totalLength += chunk.length;
      //       console.log('recevied data size: ' + totalLength + 'KB');
      //     });
      //     socket.on('error', (er) => {
      //       console.log(er);
      //     })
      //     socket.on('end', function () {
      //       console.log('Connection end');
      //     });
      //     socket.on('close', function (e) {
      //       console.log('Connection closed', e);
      //     });
      //     writeStream = fs.createWriteStream(e.target.textContent)
      //     socket.pipe(writeStream);
      //     socket.write('get ' + path, function () {
      //       console.log(socket.destroyed);
      //     })


      //   }
      // }
      const currentLiContent = document.createTextNode(currentFile);
      currentLiDom.appendChild(currentLiContent);
      currentDom.appendChild(currentLiDom)
    } else if (file[currentFile].htmlType === 'ul') {
      console.log('object', currentDom);
      const currentTreeDom = createFileTreeDomRecursion(file[currentFile])

      const catalogDom = document.createElement('div');
      catalogDom.setAttribute('data', `${currentFile}`)
      const catalogDomIcon = document.createElement('div');
      catalogDomIcon.appendChild(document.createTextNode('+'));
      const catalogDomContent = document.createTextNode(currentFile);
      catalogDomIcon.setAttribute('class', 'catalogIcon');
      catalogDom.setAttribute('class', 'catalog');
      catalogDom.appendChild(catalogDomIcon);
      catalogDom.appendChild(catalogDomContent);

      currentDom.appendChild(catalogDom);
      currentDom.appendChild(currentTreeDom);
    }
  });
  return currentDom;
}