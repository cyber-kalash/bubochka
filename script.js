// 1. Детектор мобильных устройств
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// 2. Управление боковым меню (сайдбаром)
function toggleSidebar(state) {
  var sidebar = document.querySelector('.sidebar');
  var toggleImg = document.getElementById('sidebar-toggle-img');
  if (!sidebar) return;

  if (state === 'hide') {
    sidebar.classList.add('hidden');
  } else if (state === 'show') {
    sidebar.classList.remove('hidden');
  } else {
    sidebar.classList.toggle('hidden');
  }

  var isHidden = sidebar.classList.contains('hidden');

  try {
    localStorage.setItem('sidebar_hidden', isHidden);
  } catch (err) {}

  if (toggleImg) {
    // Автоматически определяем путь к картинке кнопки в зависимости от текущей папки
    var basePath = window.location.pathname.indexOf('/1_saga/') !== -1 ? '../template/' : 'template/';
    toggleImg.src = isHidden ? basePath + 'btn-open.png' : basePath + 'btn-close.png';
  }
}

// 3. Инициализация общих событий
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('toggle-sidebar-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      toggleSidebar();
    });
  }

  if (isMobile()) {
    toggleSidebar('hide');
  } else {
    var isHiddenCache = false;
    try {
      isHiddenCache = localStorage.getItem('sidebar_hidden') === 'true';
    } catch (err) {}
    toggleSidebar(isHiddenCache ? 'hide' : 'show');
  }
});