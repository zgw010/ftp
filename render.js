const { createFileDomTree, removeMouseRightPopup, createPopup } = require('./src/dom/createDom')
const { createSocketConnection } = require('./src/net/networkCommunication');
const { readDirSync } = require('./src/file/fileOperation');
const { addDragListener } = require('./src/event/eventListener');

//处理本地文件
function createLocalFileTreeDom(path, domId = 'right') {
  const localFileTreeJSON = readDirSync(path);
  createFileDomTree(localFileTreeJSON, domId, path);
}

// 构建服务器文件目录树
function initServerFileListTree() {
  const leftDom = document.querySelector('#left');
  const serverFileListJSON = 'fileList.json';
  const ftpServerOptions = { port: 8124 };
  // 获取服务器目录的 JSON 文件, 保存在本地
  createSocketConnection(serverFileListJSON, 'get', ftpServerOptions, 'ls', createServerFileTreeDom, { dom: leftDom, file: serverFileListJSON })
}

// 打开程序的时候初始化一次, 需要向服务器发送 ls 请求, 接收从服务器发来的 JSON 格式的文件目录, 保存在本地
// 之后根据 JSON 文件来构建 DOM 树.
function createServerFileTreeDom(root, ftpServerFileList) {
  const ftpServerFileListJson = require('./' + ftpServerFileList);
  createFileDomTree(ftpServerFileListJson, 'left', '/home/z/ftp/node_ftp/s/ftpFile');
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

function init() {
  createLocalFileTreeDom('/home/z/react', 'right');
  // 生成服务器目录树,之后调用 createServerFileTreeDom 来根据 JSON 文件构造服务器目录 DOM 树
  initServerFileListTree();

  window.addEventListener('click', function () {
    removeMouseRightPopup();
  })
  window.addEventListener('mousedown', function (e) {
    if (e.button == 2) {
      removeMouseRightPopup();
    }
  })
  addDragListener();
  // 预先创建一个隐藏的弹窗
  createPopup();
}
init();