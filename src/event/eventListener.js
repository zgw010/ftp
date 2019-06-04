const { findAllParentElementDataPath, judgeIsServerOrLocal } = require('../dom/findFromDom');
const { createSocketConnection } = require('../net/networkCommunication');
const { insertAfter, createLi } = require('../dom/createDom');
const { getFileNameFromPath } = require('../utils/utils');
const ftpServerOptions = { port: 8124 }
function addDragListener() {
  document.addEventListener("dragstart", function (event) {
    // 记录开始拖动元素是服务器文件还是本地文件,以及该文件所在的路径
    const fileFrom = judgeIsServerOrLocal(event.target);
    const path = findAllParentElementDataPath(event.target) + event.target.textContent
    localStorage.setItem('fileFrom', fileFrom);
    localStorage.setItem('dragstartPath', path);
    // 使被拖动的元素其半透明
    event.target.style.opacity = .5;
  }, false);

  document.addEventListener("dragend", function (event) {
    // 重置透明度
    event.target.style.opacity = "";
  }, false);

  /* 放置目标元素时触发事件 */
  document.addEventListener("dragover", function (event) {
    // 阻止默认动作以启用drop
    event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function (event) {
    // 当可拖动的元素进入可放置的目标时高亮目标节点
    if (event.target.tagName === 'LI' || event.target.className === 'catalog') {
      event.target.style.background = "#adadad";
    }
    event.preventDefault();
  }, false);

  document.addEventListener("dragleave", function (event) {
    // 当拖动元素离开可放置目标节点，重置其背景
    event.target.style.background = "";
    event.preventDefault();
  }, false);

  document.addEventListener('drop', function (event) {
    // 拖动结束,开始处理文件传输
    const dragstartPath = localStorage.getItem('dragstartPath');
    const target = event.target;
    let dragendPath;
    if (target.tagName === 'LI') {
      dragendPath = findAllParentElementDataPath(target);
    }
    else if (target.className === 'catalog') {
      dragendPath = findAllParentElementDataPath(target) + target.getAttribute('data-path');
    }
    if (target.tagName === 'LI' || target.className === 'catalog') {
      const fileFrom = localStorage.getItem('fileFrom');
      const fileNameFrom = getFileNameFromPath(dragstartPath);
      const fileTo = judgeIsServerOrLocal(target);
      const fileNameTo = getFileNameFromPath(fileTo);
      if (fileFrom === 'local') {
        if (fileTo === 'server') {
          createSocketConnection(dragstartPath, 'put', ftpServerOptions, `put ${dragendPath}/${fileNameFrom}`, null, null)
          if (target.tagName === 'LI') {
            insertAfter(createLi(fileNameFrom), target);
          } else {
            // console.log(target.nextSibling, target);
            target.nextSibling.appendChild(createLi(fileNameFrom));
          }
          // console.log(getFileNameFromPath(dragstartPath), getFileNameFromPath(dragendPath));

        }
      } else if (fileFrom === 'server') {
        if (fileTo === 'local') {
          createSocketConnection(`${dragendPath}/${fileNameFrom}`, 'get', ftpServerOptions, `get ${dragstartPath}`, null, null)
          if (target.tagName === 'LI') {
            insertAfter(createLi(fileNameFrom), target);
          } else {
            target.nextSibling.appendChild(createLi(fileNameFrom));
          }
          // console.log(getFileNameFromPath(dragstartPath), getFileNameFromPath(dragendPath));
        }
      }
      // console.log(dragstartPath, dragendPath);
      event.target.style.background = "";
    }
  })
}

module.exports = {
  addDragListener
}