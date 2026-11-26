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
  '3_letter_from_past.htm',
  '4_guest_from_the_future.htm',
  '5_silence_between_notes.htm',
  '6_unexpected_guest.htm',
  '7_map_of_forgotten_roads.htm',
  '8_star_map.htm',
  '9_echo_of_the_past.htm',
  '10_chorus_of_lonely_hearts.htm',
  '11_door_that_was_not_there.htm',
  '12_question_without_an_answer.htm',
  '13_book_that_reads_you.htm',  
  '14_open_ending.htm'
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

function loadZenChapter(pageUrl, event, fromHistory) {
  if (event) event.preventDefault();

  // cache: 'no-store' — всегда берём свежую версию главы с сервера, а не из кэша браузера
  fetch(pageUrl, { cache: 'no-store' })
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

      // Новая глава всегда открывается с начала текста
      const mainEl = document.getElementById('main-content');
      if (mainEl) mainEl.scrollTop = 0;

      // При переходе кнопками браузера «Назад/Вперёд» адрес уже сменился — второй раз не пишем
      if (!fromHistory) {
        window.history.pushState({ path: pageUrl }, '', pageUrl);
      }
      updateNavigation(pageUrl);
    })
    .catch(error => {
      console.error('Ошибка AJAX/fetch:', error);
    });
}

// Кнопки браузера «Назад/Вперёд» между главами «Кафе»: меняем содержимое под адрес
window.addEventListener('popstate', function () {
  const fileName = window.location.pathname.split('/').pop();
  if (zenChapters.indexOf(fileName) !== -1) {
    loadZenChapter(fileName, null, true);
  }
});

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

  // Подсветка активной верхней вкладки («Кафе» — третья)
  highlightTopTab();
});

// Подсветка верхней вкладки: на страницах 3_zen всегда третья
function highlightTopTab() {
  var tabs = document.querySelectorAll('.top-tabs a');
  if (tabs.length < 3) return;
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.toggle('active', i === 2);
  }
}

// 5. Универсальный контроллер аудиокнопки для третей вкладки
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.waltz-btn');
  if (!btn) return;
  
  const container = btn.closest('.audio-container');
  if (!container) return;
  
  const audio = container.querySelector('audio');
  const btnText = container.querySelector('#playBtnText');
  
  if (audio) {
    if (audio.paused) {
      audio.play().then(() => {
        if (btnText) btnText.innerHTML = '■ <span class="btn-label">Остановить</span>';
        btn.classList.add('active');
      }).catch(err => console.error("Ошибка воспроизведения аудио:", err));
    } else {
      audio.pause();
      if (btnText) btnText.innerHTML = '▶ <span class="btn-label">Включить аудио</span>';
      btn.classList.remove('active');
    }

    audio.onended = () => {
      if (btnText) btnText.innerHTML = '▶ <span class="btn-label">Включить аудио</span>';
      btn.classList.remove('active');
    };
  }
});

// 6. Защита от «уезжания» страницы (например, при «Озвучить страницу» в Chrome)
function resetPageScroll() {
  if (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop) {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}
window.addEventListener('scroll', resetPageScroll);
document.addEventListener('DOMContentLoaded', resetPageScroll);