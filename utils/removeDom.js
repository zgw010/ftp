function removeDom(dom) {
  const parent = dom.parentElement;
  // 删除:
  let removed = parent.removeChild(dom);
  removed = null;
}

module.exports = {
  removeDom
};