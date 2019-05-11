const { createSocketConnection } = require('./networkCommunication');
const { findAllParentElementDataPath } = require('./findFromDom');
const { getFileNameFromPath } = require('./utils');
const ftpOptions = { port: 8124 };
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
      currentLiDom.setAttribute('draggable', 'true')
      
      // // currentLiDom.addEventListener('drag', function (e) {
      // //   // console.log(e);
      // //   // console.log('object');
      // // })
      // currentLiDom.addEventListener("dragstart", function (event) {
      //   // 保存拖动元素的引用(ref.)
      //   console.log(event.target);
      //   event.target.style.opacity = .5;
      //   localStorage.setItem('dom', event.target.textContent);
      //   // dragged = event.target;
      //   // 使其半透明
      //   // event.target.style.opacity = .5;
      // }, false);
      // currentLiDom.addEventListener("dragend", function (event) {
      //   // 重置透明度
      //   event.target.style.opacity = "";
      //   console.log(localStorage.getItem('dom'));
      // }, false);

      // /* 放置目标元素时触发事件 */
      // currentLiDom.addEventListener("dragover", function (event) {
      //   // 阻止默认动作以启用drop
      //   event.preventDefault();
      // }, false);
      // currentLiDom.addEventListener("dragenter", function (event) {
      //   // 当可拖动的元素进入可放置的目标时高亮目标节点
      //   if (event.target.tagName == "LI") {
      //     event.target.style.background = "purple";
      //   }

      // }, false);
      // currentLiDom.addEventListener("dragleave", function (event) {
      //   // 当拖动元素离开可放置目标节点，重置其背景
      //   if (event.target.tagName == "LI") {
      //     event.target.style.background = "";
      //   }

      // }, false);

      currentLiDom.addEventListener('mouseup', function (e) {
        if (e.button == 2) {
          const path = findAllParentElementDataPath(e.target) + e.target.textContent;
          // 获取文件保存在本地
          // createSocketConnection('get', e.target.textContent, ftpOptions, 'get ' + path, null, null)
          removeMouseRightPopup();
          createMouseEventDom({ clientX: e.clientX, clientY: e.clientY }, path)

        }
      })

      const currentLiContent = document.createTextNode(currentFile);
      currentLiDom.appendChild(currentLiContent);
      currentDom.appendChild(currentLiDom)
    } else if (file[currentFile].htmlType === 'ul') {
      const currentTreeDom = createFileTreeDomRecursion(file[currentFile])

      const catalogDom = document.createElement('div');
      catalogDom.setAttribute('draggable', 'true')
      catalogDom.setAttribute('data-path', `${currentFile}`)
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
function createMouseEventDom(mouseSite, path) {
  const mouseRightDom = document.createElement('div');
  mouseRightDom.setAttribute('id', 'mouseRightPopup')
  mouseRightDom.setAttribute('data-path', path)
  mouseRightDom.style.top = mouseSite.clientY + 'px';
  mouseRightDom.style.left = mouseSite.clientX + 'px';
  const fileName = getFileNameFromPath(path);
  const mouseRightDomRefresh = createMouseRightMenuElement('refresh', createSocketConnection, [path, 'get', ftpOptions, 'get ' + path, null, null]);
  const mouseRightDomDownload = createMouseRightMenuElement('download', createSocketConnection, [fileName, 'get', ftpOptions, 'get ' + path, null, null]);
  const mouseRightDomCopy = createMouseRightMenuElement('copy', createSocketConnection, [path, 'get', ftpOptions, 'get ' + path, null, null]);
  const mouseRightDomPaste = createMouseRightMenuElement('paste', createSocketConnection, [path, 'get', ftpOptions, 'get ' + path, null, null]);
  const mouseRightDomDelete = createMouseRightMenuElement('delete', createSocketConnection, [path, 'get', ftpOptions, 'get ' + path, null, null]);
  mouseRightDom.appendChild(mouseRightDomRefresh);
  mouseRightDom.appendChild(mouseRightDomDownload);
  mouseRightDom.appendChild(mouseRightDomCopy);
  mouseRightDom.appendChild(mouseRightDomPaste);
  mouseRightDom.appendChild(mouseRightDomDelete);
  document.body.appendChild(mouseRightDom)
}

// 给文件列表树的根添加一个头部
function addFileRootPath(root, path, ) {
  const rootCatalogDom = document.createElement('div');
  rootCatalogDom.setAttribute('data-path', path)
  root.appendChild(rootCatalogDom);
}

function createFileDomTree(fileTreeJSON, domId, path) {
  let rootDom = document.querySelector(`#${domId}`);

  addFileRootPath(rootDom, path)
  const fileListDom = createFileTreeDomRecursion({ htmlType: 'ul', children: fileTreeJSON });
  rootDom.appendChild(fileListDom);
}

// 创建鼠标右键菜单中的一个选项
function createMouseRightMenuElement(elementContext, addEventListenerFunction, addEventListenerFunctionArguments) {
  const element = document.createElement('div');
  element.appendChild(document.createTextNode(elementContext));
  element.addEventListener('click', function () {
    // addEventListenerFunction(e)
    // if
    console.log(addEventListenerFunctionArguments[0]);
    addEventListenerFunction(...addEventListenerFunctionArguments)
    // createSocketConnection('get', e.target.textContent, ftpOptions, 'get ' + path, null, null)
  })
  return element;
}

// 移除鼠标右键菜单
function removeMouseRightPopup() {
  const mouseRightPopup = document.querySelector('#mouseRightPopup');
  if (mouseRightPopup) {
    mouseRightPopup.parentElement.removeChild(document.querySelector('#mouseRightPopup'));
  }
}
module.exports = {
  // createFileTreeDomRecursion,
  // addFileRootPath,
  createFileDomTree,
  removeMouseRightPopup
};