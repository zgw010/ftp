const createSocketConnection = require('./networkCommunication').createSocketConnection
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
      currentLiDom.addEventListener('mouseup', function (e) {
        if (e.button == 2) {
          // 获取文件的相对路径
          let path = '';
          let findRootPtr = e.target.parentElement;
          while (findRootPtr.tagName !== 'DIV') {
            path = findRootPtr.previousElementSibling.getAttribute('data') + '/' + path;
            findRootPtr = findRootPtr.parentElement;
          }
          path = path + e.target.textContent;
          // 获取文件保存在本地
          // createSocketConnection('get', e.target.textContent, ftpOptions, 'get ' + path, null, null)
          createMouseEventDom({ clientX: e.clientX, clientY: e.clientY }, path)

        }
        // return;
        // if (!e) e = window.event;

      })
      currentLiDom.oncontextmenu = function (e) {
        e.preventDefault();
      };
      // 定义右键函数
      // currentLiDom.onmouseup = function (e) {
      //   console.log(e);

      // }
      const currentLiContent = document.createTextNode(currentFile);
      currentLiDom.appendChild(currentLiContent);
      currentDom.appendChild(currentLiDom)
    } else if (file[currentFile].htmlType === 'ul') {
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
function createMouseEventDom(mouseSite, path) {
  console.log(mouseSite);
  const mouseRightDom = document.createElement('div');
  mouseRightDom.setAttribute('class', 'mouseRightPopup')
  mouseRightDom.setAttribute('data-path', path)
  // console.log(mouseRightDom.style);
  mouseRightDom.style.top = mouseSite.clientY + 'px';
  console.log(mouseRightDom.style.top);
  mouseRightDom.style.left = mouseSite.clientX + 'px';

  const mouseRightDomCopy = document.createElement('div');
  const mouseRightDomCopyContext = document.createTextNode('copy');
  mouseRightDomCopy.appendChild(mouseRightDomCopyContext);
  const mouseRightDomPaste = document.createElement('div');
  const mouseRightDomDelete = document.createElement('div');
  mouseRightDom.appendChild(mouseRightDomCopy);
  mouseRightDom.appendChild(mouseRightDomPaste);
  mouseRightDom.appendChild(mouseRightDomDelete);
  document.body.appendChild(mouseRightDom)
}

module.exports = {
  createFileTreeDomRecursion
};