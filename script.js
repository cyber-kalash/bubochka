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

// 3. Логика навигации по главам раздела «Кафе „У причала“» (3_zen)
const zenChapters = [
  'Introduction.htm',
  '1_Origins.htm',
  '2_solitary_dock.htm',
  '3_Chapter.htm',
  '4_Chapter.htm',
  '5_Chapter.htm',
  '6_Chapter.htm',
  '7_Chapter.htm',
  '8_Chapter.htm',
  '9_Chapter.htm',
  '10_Chapter.htm',
  '11_Chapter.htm',
  '12_Chapter.htm',
  '13_Chapter.htm'
];

function updateNavigation(currentUrl) {
  const fileName = currentUrl.split('/').pop();
  const currentIndex = zenChapters.indexOf(fileName);
  
  const prevSpan = document.getElementById('btn-prev');
  const nextSpan = document.getElementById('btn-next');
  const imgPrev = document.getElementById('img-prev');
  const imgNext = document.getElementById('img-next');
  
  if (!prevSpan || !nextSpan) return;

  // Кнопка Назад
  if (currentIndex > 0) {
    prevSpan.onclick = (e) => loadZenChapter(zenChapters[currentIndex - 1], e);
    if (imgPrev) imgPrev.src = '../template/btn_prev_n.png';
    prevSpan.style.opacity = '1';
    prevSpan.style.cursor = 'pointer';
  } else {
    prevSpan.onclick = null;
    if (imgPrev) imgPrev.src = '../template/btn_prev_g.png';
    prevSpan.style.opacity = '0.5';
    prevSpan.style.cursor = 'default';
  }

  // Кнопка Вперед
  if (currentIndex !== -1 && currentIndex < zenChapters.length - 1) {
    nextSpan.onclick = (e) => loadZenChapter(zenChapters[currentIndex + 1], e);
    if (imgNext) imgNext.src = '../template/btn_next_n.png';
    nextSpan.style.opacity = '1';
    nextSpan.style.cursor = 'pointer';
  } else {
    nextSpan.onclick = null;
    if (imgNext) imgNext.src = '../template/btn_next_g.png';
    nextSpan.style.opacity = '0.5';
    nextSpan.style.cursor = 'default';
  }
}

function loadZenChapter(pageUrl, event) {
  if (event) event.preventDefault();

  fetch(pageUrl)
    .then(response => {
      if (!response.ok) throw new Error('Ошибка загрузки страницы');
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newMainContent = doc.querySelector('#main-content');
      const newTitleEl = doc.querySelector('h2');
      const newTitle = newTitleEl ? newTitleEl.textContent : '';

      if (newMainContent) {
        document.getElementById('main-content').innerHTML = newMainContent.innerHTML;
      }
      
      if (newTitle) {
        const titleEl = document.getElementById('chapter-title');
        if (titleEl) titleEl.textContent = newTitle;
      }

      document.querySelectorAll('#menu-zen .chapter-link').forEach(link => {
        if (link.getAttribute('href') === pageUrl) {
          link.classList.add('active-chapter');
        } else {
          link.classList.remove('active-chapter');
        }
      });

      window.history.pushState({ path: pageUrl }, '', pageUrl);
      updateNavigation(pageUrl);
    })
    .catch(error => {
      console.error('Ошибка AJAX/fetch:', error);
    });
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

  // Автоматически настраиваем стрелки при загрузке/обновлении любой страницы
  updateNavigation(window.location.pathname);
});