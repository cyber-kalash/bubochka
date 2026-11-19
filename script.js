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
    var path = window.location.pathname;
    var isSubFolder = path.includes('1_saga') || path.includes('2_stadium') || path.includes('3_zen');
    var basePath = isSubFolder ? '../template/' : 'template/';
    toggleImg.src = isHidden ? basePath + 'btn-open.png' : basePath + 'btn-close.png';
  }
}

// 4. Инициализация общих событий при загрузке страницы
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

  // Подсвечиваем активную вкладку сверху по адресу страницы
  highlightTopTab();
});

// 5. Подсветка активной вкладки сверху по адресу страницы
function highlightTopTab() {
  const tabs = document.querySelectorAll('.top-tabs a');
  if (tabs.length < 3) return;
  const path = window.location.pathname;
  let index = 0;                                  // по умолчанию «Сага» (и index.html в корне)
  if (path.includes('2_stadium')) index = 1;      // «Стадион»
  else if (path.includes('3_zen')) index = 2;     // «Кафе»
  tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
}
// 6. Возвращаем на место контейнеры, которые Chrome может сдвинуть при «Озвучить страницу»
function resetContainerScroll() {
  ['.content-area', '.main-container'].forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el && (el.scrollTop || el.scrollLeft)) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });
}
document.addEventListener('scroll', resetContainerScroll, true);

// 7. Возвращаем саму страницу (окно) на место, если Chrome сдвинул её при «Озвучить страницу»
function resetPageScroll() {
  if (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop) {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}
window.addEventListener('scroll', resetPageScroll);
document.addEventListener('DOMContentLoaded', resetPageScroll);
window.addEventListener('load', resetPageScroll);
