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
      currentLiDom.oncontextmenu = function (e) {
        e.preventDefault();
      };
      // 定义右键函数
      currentLiDom.onmouseup = function (e) {
        if (!e) e = window.event;
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
          createSocketConnection('get', e.target.textContent, ftpOptions, 'get ' + path, null, null)

        }
      }
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

module.exports = {
  createFileTreeDomRecursion
};