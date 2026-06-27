// card-template.js
// Global function: window.renderCards(containerId, cards)
// Designed to work with your existing card schema (iconColor, icon, title, description, buttons[])
// Buttons: { text, icon, class, action } where action is the name of a global function (string) or a function reference.

(function () {
  function createEl(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  function buildCard(card, index) {
    const wrapper = createEl('div', 'setting-card');
    wrapper.setAttribute('data-card-index', index);

    // card-top
    const top = createEl('div', 'card-top');

    const iconDiv = createEl('div', 'icon ' + (card.iconColor || 'green'));
    const iconI = createEl('i', 'fa-solid ' + (card.icon || 'fa-circle'));
    iconDiv.appendChild(iconI);

    const textWrap = document.createElement('div');
    const h3 = createEl('h3');
    h3.textContent = card.title || '';
    const p = createEl('p');
    p.textContent = card.description || '';

    textWrap.appendChild(h3);
    textWrap.appendChild(p);

    top.appendChild(iconDiv);
    top.appendChild(textWrap);

    wrapper.appendChild(top);

    // hr
    const hr = document.createElement('hr');
    wrapper.appendChild(hr);

    // actions
    const actions = createEl('div', 'actions');

    if (Array.isArray(card.buttons)) {
      card.buttons.forEach((btn) => {
        const button = createEl('button', 'btn ' + (btn.class || ''));
        // icon inside button
        if (btn.icon) {
          const bi = createEl('i', 'fa-solid ' + btn.icon);
          button.appendChild(bi);
        }
        // space then text
        const txt = document.createTextNode(' ' + (btn.text || ''));
        button.appendChild(txt);

        // action handling:
        // - if btn.action is a function, addEventListener
        // - if btn.action is a string and window[btn.action] is function, call it
        // - if btn.href provided (not expected in current schema), handle navigation
        if (typeof btn.action === 'function') {
          button.addEventListener('click', (ev) => {
            try { btn.action(ev, card); } catch (e) { console.error(e); }
          });
        } else if (typeof btn.action === 'string' && typeof window[btn.action] === 'function') {
          button.addEventListener('click', (ev) => {
            try { window[btn.action](ev, card); } catch (e) { console.error(e); }
          });
        } else if (btn.href) {
          button.addEventListener('click', () => {
            window.location.href = btn.href;
          });
        } else {
          // no-op or fallback: keep button but no action
          button.addEventListener('click', (ev) => {
            console.warn('No action for button', btn, card);
            ev.preventDefault();
          });
        }

        actions.appendChild(button);
      });
    }

    wrapper.appendChild(actions);

    return wrapper;
  }

  function renderCards(containerId, cards) {
    if (!containerId) {
      console.warn('renderCards: missing containerId');
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`renderCards: element with id "${containerId}" not found`);
      return;
    }

    // Accept null/undefined or non-array gracefully
    const list = Array.isArray(cards) ? cards : [];

    // Use DocumentFragment for performance
    const frag = document.createDocumentFragment();

    list.forEach((card, idx) => {
      const cardEl = buildCard(card, idx);
      // keyboard accessibility for each card (if whole-card click desired, card.onClick or card.href can be added in card object)
      if (card.onClick && typeof card.onClick === 'function') {
        cardEl.tabIndex = 0;
        cardEl.setAttribute('role', 'button');
        cardEl.addEventListener('click', (ev) => card.onClick(ev, card));
        cardEl.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            card.onClick(ev, card);
          }
        });
      } else if (card.href) {
        cardEl.style.cursor = 'pointer';
        cardEl.tabIndex = 0;
        cardEl.addEventListener('click', () => {
          window.location.href = card.href;
        });
        cardEl.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            window.location.href = card.href;
          }
        });
      }

      frag.appendChild(cardEl);
    });

    // clear and append
    container.innerHTML = '';
    container.appendChild(frag);
  }

  // expose globally
  window.renderCards = renderCards;
})();