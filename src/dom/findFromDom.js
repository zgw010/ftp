function findAllParentElementDataPath(domElement) {
  let path = '';
  let findRootPtr = domElement.parentElement;
  while (findRootPtr.tagName !== 'DIV') {
    path = findRootPtr.previousElementSibling.getAttribute('data-path') + '/' + path;
    findRootPtr = findRootPtr.parentElement;
  }
  return path;
}

function judgeIsServerOrLocal(domElement) {
  let findRootPtr = domElement.parentElement;
  while (findRootPtr.tagName !== 'DIV') {
    findRootPtr = findRootPtr.parentElement;
  }
  const rootId = findRootPtr.getAttribute('id');
  if (rootId === 'left') {
    return 'server';
  } else if (rootId === 'right') {
    return 'local';
  } else {
    return rootId;
  }
}

module.exports = {
  findAllParentElementDataPath,
  judgeIsServerOrLocal
}