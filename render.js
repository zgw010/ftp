

const createFileTreeDomRecursion = require('./utils/createDom').createFileTreeDomRecursion;
const createSocketConnection = require('./utils/networkCommunication').createSocketConnection;
const fileTree2JSON = require('./utils/fileOperation').readDirSync;

//处理本地文件
const localFileTreeJSON = fileTree2JSON('/home/z/blog');
const localFileTreeJSON2 = { blog: { htmlType: 'ul', children: localFileTreeJSON } };
let rightDom = document.querySelector('#right');
const r = createFileTreeDomRecursion(localFileTreeJSON2.blog);
rightDom.appendChild(r);


// 构建服务器文件目录树
// 获取服务器目录的 JSON 文件, 保存在本地


function initServerFileListTree() {
  const leftDom = document.querySelector('#left');
  const serverFileListJSON = 'fileList.json';
  const ftpServerOptions = { port: 8124 };
  createSocketConnection('get', serverFileListJSON, ftpServerOptions, 'ls', createFileTreeDom, { dom: leftDom, file: serverFileListJSON })
}




// 打开程序的时候初始化一次, 需要向服务器发送 ls 请求, 接收从服务器发来的 JSON 格式的文件目录, 保存在本地
// 之后根据 JSON 文件来构建 DOM 树.
function createFileTreeDom(root, ftpServerFileList) {
  const ftpServerFileListJson = require('./' + ftpServerFileList).ftpFile;

  const rootCatalogDom = document.createElement('div');
  rootCatalogDom.setAttribute('data', './ftpFile/ftpFile/')

  root.appendChild(rootCatalogDom);

  const res = createFileTreeDomRecursion(ftpServerFileListJson);
  root.appendChild(res);

  initHideSubFile('.catalogIcon');

}

// 隐藏列表中子文件,并且添加点击 收起/展开 事件
function initHideSubFile(buttonsClassName) {
  const currentControlButtons = document.querySelectorAll(buttonsClassName);
  // 给列表中按钮添加点击 收起/展开 事件
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
  // 隐藏列表中子文件
  currentControlButtons.forEach(currentControlButton => {
    currentControlButton.parentElement.nextElementSibling.style.display = 'none';
  });
}

initServerFileListTree();