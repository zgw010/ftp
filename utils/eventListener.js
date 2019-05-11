const { findAllParentElementDataPath, judgeIsServerOrLocal } = require('./findFromDom');
const { createSocketConnection } = require('./networkCommunication');
const { getFileNameFromPath } = require('./utils');
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
    let dragendPath;
    if (event.target.tagName === 'LI') {
      dragendPath = findAllParentElementDataPath(event.target);
    }
    else if (event.target.className === 'catalog') {
      dragendPath = findAllParentElementDataPath(event.target) + event.target.getAttribute('data-path');
    }
    const fileFrom = localStorage.getItem('fileFrom');
    const fileNameFrom = getFileNameFromPath(dragstartPath);
    const fileTo = judgeIsServerOrLocal(event.target);
    const fileNameTo = getFileNameFromPath(fileTo);
    if (fileFrom === 'local') {
      if (fileTo === 'server') {
        createSocketConnection(dragstartPath, 'put', ftpServerOptions, `put ${dragendPath}/${fileNameFrom}`, null, null)
        console.log(getFileNameFromPath(dragstartPath), getFileNameFromPath(dragendPath));

      }
    } else if (fileFrom === 'server') {
      if (fileTo === 'local') {
        createSocketConnection(`${dragendPath}/${fileNameFrom}`, 'get', ftpServerOptions, `get ${dragstartPath}`, null, null)
        console.log(getFileNameFromPath(dragstartPath), getFileNameFromPath(dragendPath));
      }
    }
    console.log(dragstartPath, dragendPath);
    event.target.style.background = "";
  })
}

module.exports = {
  addDragListener
}