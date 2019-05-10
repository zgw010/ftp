const { createFileDomTree, removeMouseRightPopup } = require('./utils/createDom')
const { createSocketConnection } = require('./utils/networkCommunication');
const {readDirSync} = require('./utils/fileOperation');

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
  createFileDomTree(ftpServerFileListJson, 'left', './ftpFile');
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
  // document.addEventListener('drag', function (e) {
  //   // console.log(e);
  //   // console.log('object');
  // })
  document.addEventListener("dragstart", function (event) {
    // 保存拖动元素的引用(ref.)
    console.log(event.target);
    event.target.style.opacity = .5;
    localStorage.setItem('dom', event.target.textContent);
    // dragged = event.target;
    // 使其半透明
    // event.target.style.opacity = .5;
  }, false);
  document.addEventListener("dragend", function (event) {
    // 重置透明度
    event.target.style.opacity = "";
    console.log(localStorage.getItem('dom'));
  }, false);

  /* 放置目标元素时触发事件 */
  document.addEventListener("dragover", function (event) {
    // 阻止默认动作以启用drop
    event.preventDefault();
  }, false);
  document.addEventListener("dragenter", function (event) {
    // 当可拖动的元素进入可放置的目标时高亮目标节点
    if (event.target.tagName == "LI") {
      event.target.style.background = "purple";
    }

  }, false);
  document.addEventListener("dragleave", function (event) {
    // 当拖动元素离开可放置目标节点，重置其背景
    if (event.target.tagName == "LI") {
      event.target.style.background = "";
    }

  }, false);
}
function init() {
  createLocalFileTreeDom('/home/z/blog', 'right');
  // 生成服务器目录树,之后调用 createServerFileTreeDom 来根据 JSON 文件构造服务器目录 DOM 树
  initServerFileListTree();

  window.addEventListener('click', function () {
    removeMouseRightPopup();
  })
  window.addEventListener('mousedown', function () {
    removeMouseRightPopup();
  })
}
init();