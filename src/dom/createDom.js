const { createSocketConnection } = require('../net/networkCommunication');
const { findAllParentElementDataPath } = require('./findFromDom');
const { removeDom } = require('./removeDom')
const { deleteFileSync } = require('../file/fileOperation')
const { getFileNameFromPath } = require('../utils/utils');

const ftpOptions = { port: 8124 };
function createFileTreeDomRecursion(file) {
  let currentFileList = Object.keys(file.children);

  // 对目录进行排序, 让文件目录显示在文件的前面
  const _file = [];
  const _directory = [];
  currentFileList.forEach(fileName => {
    if (file.children[fileName].htmlType === 'li') {
      _file.push(fileName)
    } else {
      _directory.push(fileName)

    }
  })
  currentFileList = _directory.concat(_file);

  const currentDom = document.createElement(file.htmlType);
  file = file.children;
  currentFileList.forEach(currentFile => {
    // console.log(file[currentFile].htmlType);
    if (file[currentFile].htmlType === 'li') {
      const currentLiDom = document.createElement('li');
      currentLiDom.setAttribute('draggable', 'true')

      currentLiDom.addEventListener('mouseup', function (e) {
        if (e.button == 2) {
          const path = findAllParentElementDataPath(e.target) + e.target.textContent;
          removeMouseRightPopup();
          createMouseEventDom(e.target, { clientX: e.clientX, clientY: e.clientY }, path)

        }
      })

      const currentLiContent = document.createTextNode(currentFile);
      currentLiDom.appendChild(currentLiContent);
      currentDom.appendChild(currentLiDom);
    } else if (file[currentFile].htmlType === 'ul') {
      const currentTreeDom = createFileTreeDomRecursion(file[currentFile]);

      const catalogDom = document.createElement('div');
      catalogDom.setAttribute('draggable', 'true');
      catalogDom.setAttribute('data-path', `${currentFile}`);

      catalogDom.addEventListener('mouseup', function (e) {
        if (e.button == 2) {
          const path = findAllParentElementDataPath(e.target) + currentFile;
          removeMouseRightPopup();
          createMouseEventDom(e.target, { clientX: e.clientX, clientY: e.clientY }, path);

        }
      })
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

function deleteFileAndRemoveDom(dom, dir) {
  removeDom(dom);
  deleteFileSync(dir);
}
function createMouseEventDom(dom, mouseSite, path) {
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
  const mouseRightDomDelete = createMouseRightMenuElement('delete', deleteFileAndRemoveDom, [dom, path]);
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
    addEventListenerFunction(...addEventListenerFunctionArguments)
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
function createPopup() {
  createPopupBg();
  const element = document.createElement('div');
  element.setAttribute('class', 'popup');

  const elementHead = document.createElement('div');
  elementHead.appendChild(document.createTextNode('提示'))
  elementHead.setAttribute('class', 'popup-head');
  const elementBody = document.createElement('div');
  elementBody.appendChild(document.createTextNode('提示信息'))
  elementBody.setAttribute('class', 'popup-body');
  const elementButton = document.createElement('div');
  elementButton.appendChild(document.createTextNode('确定'))
  elementButton.setAttribute('class', 'popup-botton');
  elementButton.addEventListener('click', function () {
    document.querySelector('.popup-bg').style.display = 'none'
    document.querySelector('.popup').style.display = 'none'
  })
  element.appendChild(elementHead);
  element.appendChild(elementBody);
  element.appendChild(elementButton);

  document.body.appendChild(element);
}

function createPopupBg() {
  const element = document.createElement('div');
  element.setAttribute('class', 'popup-bg');
  document.body.appendChild(element);
}

function insertAfter(newElement, targetElement) {
  const parentEl = targetElement.parentNode;

  if (parentEl.lastChild === targetElement) {
    parentEl.appendChild(newElement);
  } else {
    parentEl.insertBefore(newElement, targetElement.nextSibling);
  }
}

function createLi(content) {
  const currentLiDom = document.createElement('li');
  currentLiDom.setAttribute('draggable', 'true')

  currentLiDom.addEventListener('mouseup', function (e) {
    if (e.button == 2) {
      const path = findAllParentElementDataPath(e.target) + e.target.textContent;
      removeMouseRightPopup();
      createMouseEventDom(e.target, { clientX: e.clientX, clientY: e.clientY }, path)
    }
  })

  const currentLiContent = document.createTextNode(content);
  currentLiDom.appendChild(currentLiContent);
  return currentLiDom;
}

module.exports = {
  createFileDomTree,
  removeMouseRightPopup,
  createPopup,
  insertAfter,
  createLi
};