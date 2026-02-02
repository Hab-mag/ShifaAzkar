(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const backBtn = $('backBtn');
  const pageTitle = $('pageTitle');
  const homeScreen = $('home');
  const ayatScreen = $('ayat');
  const azkarScreen = $('azkar');
  const duaScreen = $('dua');
  const categoryScreen = $('category');
  const readerScreen = $('reader');
  const readerContent = $('readerContent');
  const fontSizeLabel = $('fontSizeLabel');
  const fontSmaller = $('fontSmaller');
  const fontLarger = $('fontLarger');

  let history = [];
  let readerScale = 1;

  function showScreen(screen, title) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    screen.classList.add('active');
    pageTitle.textContent = title || 'Шифа';
    backBtn.hidden = history.length === 0;
  }

  function goTo(screen, title) {
    history.push({ screen: getCurrentScreen(), title: pageTitle.textContent });
    showScreen(screen, title);
  }

  function getCurrentScreen() {
    return document.querySelector('.screen.active');
  }

  function back() {
    if (history.length === 0) return;
    const prev = history.pop();
    showScreen(prev.screen, prev.title);
  }

  function renderCategories(sectionKey) {
    const section = DATA[sectionKey];
    if (!section) return;
    const container = $(sectionKey + 'Categories');
    if (!container) return;
    container.innerHTML = section.categories
      .map(
        (cat) =>
          `<a href="#" class="cat-item" data-section="${sectionKey}" data-category-id="${cat.id}">
            <strong>${escapeHtml(cat.title)}</strong>
            <span>${cat.items.length} ${itemsWord(cat.items.length)}</span>
          </a>`
      )
      .join('');

    container.querySelectorAll('.cat-item').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openCategory(sectionKey, el.dataset.categoryId);
      });
    });
  }

  function itemsWord(n) {
    if (n === 1) return 'пункт';
    if (n >= 2 && n <= 4) return 'пункта';
    return 'пунктов';
  }

  function openCategory(sectionKey, categoryId) {
    const section = DATA[sectionKey];
    const category = section.categories.find((c) => c.id === categoryId);
    if (!category) return;

    const container = $('contentList');
    container.innerHTML = category.items
      .map(
        (item) =>
          `<a href="#" class="content-item" data-section="${sectionKey}" data-category-id="${categoryId}" data-item-id="${item.id}">
            <strong>${escapeHtml(item.title)}</strong>
          </a>`
      )
      .join('');

    container.querySelectorAll('.content-item').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openReader(sectionKey, categoryId, el.dataset.itemId);
      });
    });

    goTo(categoryScreen, category.title);
  }

  function openReader(sectionKey, categoryId, itemId) {
    const section = DATA[sectionKey];
    const category = section.categories.find((c) => c.id === categoryId);
    const item = category && category.items.find((i) => i.id === itemId);
    if (!item) return;

    const scale = document.documentElement.style.getPropertyValue('--reader-scale') || '1';
    readerContent.innerHTML = `
      <h2 class="reader-title">${escapeHtml(item.title)}</h2>
      <div class="reader-arabic">${item.arabic}</div>
      <div class="reader-translation">${item.translation}</div>
    `;
    document.documentElement.style.setProperty('--reader-scale', String(readerScale));
    fontSizeLabel.textContent = Math.round(readerScale * 100) + '%';

    goTo(readerScreen, item.title);
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function initNav() {
    document.querySelectorAll('.nav-card[data-section]').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const section = card.dataset.section;
        const title = DATA[section] ? DATA[section].title : 'Шифа';
        if (section === 'ayat') goTo(ayatScreen, title);
        else if (section === 'azkar') goTo(azkarScreen, title);
        else if (section === 'dua') goTo(duaScreen, title);
      });
    });
  }

  function initFontSize() {
    fontSmaller.addEventListener('click', () => {
      readerScale = Math.max(0.8, readerScale - 0.1);
      document.documentElement.style.setProperty('--reader-scale', String(readerScale));
      fontSizeLabel.textContent = Math.round(readerScale * 100) + '%';
    });
    fontLarger.addEventListener('click', () => {
      readerScale = Math.min(1.5, readerScale + 0.1);
      document.documentElement.style.setProperty('--reader-scale', String(readerScale));
      fontSizeLabel.textContent = Math.round(readerScale * 100) + '%';
    });
  }

  backBtn.addEventListener('click', back);

  renderCategories('ayat');
  renderCategories('azkar');
  renderCategories('dua');
  initNav();
  initFontSize();
})();
