function getFileNameFromPath(path) {
  return path.slice(path.lastIndexOf('/') + 1);
}

function showPromptPopup(text) {
  document.querySelector('.popup-body').textContent = text;
  document.querySelector('.popup-bg').style.display = 'block';
  document.querySelector('.popup').style.display = 'block';
}
module.exports = {
  getFileNameFromPath,
  showPromptPopup
}