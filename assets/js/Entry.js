/* assets/js/entry.js
   Final single-file for Entry page.
   - Preserves all existing business logic, APIs, DB behavior and navigation.
   - Renders dynamic cards: Workers, Farm Tasks, Fertilizers, Pesticides, Irrigation, Harvest, Sales, Drying, Equipment
   - Safe placeholders: if your real functions exist they will be used; otherwise placeholders prevent runtime errors.
*/

/* -------------------------
   renderCards (define only if not present)
------------------------- */
(function () {
  if (typeof window.renderCards === 'function') return;

  function createEl(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  function buildCard(card, index) {
    const wrapper = createEl('div', 'setting-card');
    wrapper.setAttribute('data-card-index', index);
    if (card.id) wrapper.setAttribute('data-card-id', card.id);

    // top
    const top = createEl('div', 'card-top');
    const iconDiv = createEl('div', 'icon ' + (card.iconColor || 'green'));
    const iconI = createEl('i', 'fa-solid ' + (card.icon || 'fa-circle'));
    iconDiv.appendChild(iconI);

    const textWrap = document.createElement('div');
    const h3 = createEl('h3'); h3.textContent = card.title || '';
    const p = createEl('p'); p.textContent = card.description || '';

    textWrap.appendChild(h3);
    textWrap.appendChild(p);

    top.appendChild(iconDiv);
    top.appendChild(textWrap);
    wrapper.appendChild(top);

    // hr
    wrapper.appendChild(document.createElement('hr'));

    // actions
    const actions = createEl('div', 'actions');
    if (Array.isArray(card.buttons)) {
      card.buttons.forEach((btn) => {
        const button = createEl('button', 'btn ' + (btn.class || ''));
        if (btn.icon) {
          const bi = createEl('i', 'fa-solid ' + btn.icon);
          button.appendChild(bi);
        }
        button.appendChild(document.createTextNode(' ' + (btn.text || '')));

        // bind action: prefer function ref, then global name, then href
        if (typeof btn.action === 'function') {
          button.addEventListener('click', (ev) => { try { btn.action(ev, card); } catch (e) { console.error(e); } });
        } else if (typeof btn.action === 'string' && typeof window[btn.action] === 'function') {
          button.addEventListener('click', (ev) => { try { window[btn.action](ev, card); } catch (e) { console.error(e); } });
        } else if (btn.href) {
          button.addEventListener('click', () => { window.location.href = btn.href; });
        } else {
          button.addEventListener('click', (ev) => { console.warn('No action for button', btn, card); ev.preventDefault(); });
        }

        actions.appendChild(button);
      });
    }
    wrapper.appendChild(actions);

    // optional whole-card click
    if (card.onClick && typeof card.onClick === 'function') {
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'button');
      wrapper.addEventListener('click', (ev) => card.onClick(ev, card));
      wrapper.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); card.onClick(ev, card); }
      });
    } else if (card.href) {
      wrapper.style.cursor = 'pointer';
      wrapper.tabIndex = 0;
      wrapper.addEventListener('click', () => { window.location.href = card.href; });
      wrapper.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); window.location.href = card.href; }
      });
    }

    return wrapper;
  }

  function renderCards(containerId, cards) {
    if (!containerId) { console.warn('renderCards: missing containerId'); return; }
    let container = document.getElementById(containerId);
    if (!container) container = document.querySelector('.card-grid');
    if (!container) { console.warn(`renderCards: container "${containerId}" not found and no .card-grid present.`); return; }

    const list = Array.isArray(cards) ? cards : [];
    const frag = document.createDocumentFragment();
    list.forEach((card, idx) => frag.appendChild(buildCard(card, idx)));
    container.innerHTML = '';
    container.appendChild(frag);
  }

  window.renderCards = renderCards;
})();

/* ==========================
   Sidebar Toggle (simple collapse) — UI only
   Preserves existing behavior; doesn't touch business logic.
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const sidebar = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  }
});

/* ==========================
   Session Validation (Supabase) — unchanged behavior
========================= */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!window.supabaseClient) return;
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) { window.location.replace('logincard.html'); return; }
    console.log('Logged In User:', session.user.email);
  } catch (error) {
    console.error('Session Error:', error);
    window.location.replace('logincard.html');
  }
});

/* ==========================
   Logout (exposed but not overwritten if exists)
========================= */
window.logout = window.logout || (async function logout() {
  try { if (window.supabaseClient) await window.supabaseClient.auth.signOut(); }
  catch (error) { console.error('Logout Error:', error); }
  window.location.replace('logincard.html');
});

/* ==========================
   Logout button binding
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
});

/* ==========================
   Dashboard menu highlight (no changes)
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const dashboardLink = document.querySelector('.menu a[href="dashboard.html"]');
  if (dashboardLink) dashboardLink.classList.add('active-menu');
});

/* ==========================
   entryCards: requested new cards (keeps design & styles)
   Titles contain English + Malayalam where appropriate.
   Buttons use action names that map to existing functions (unchanged).
========================= */
const entryCards = [
  {
    id: 'workers',
    iconColor: 'orange',
    icon: 'fa-people-group',
    title: 'Workers (തൊഴിലാളികൾ)',
    description: 'Fields: name, phone, work days, wage, payment info',
    buttons: [
      { text: 'Add Worker', icon: 'fa-plus', class: 'green-btn', action: 'addWorker' },
      { text: 'Edit Worker', icon: 'fa-pen', class: 'blue-btn', action: 'editWorker' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewWorkerList' }
    ]
  },
  {
    id: 'farm-tasks',
    iconColor: 'blue',
    icon: 'fa-tractor',
    title: 'Farm Tasks (കൃഷി ജോലികൾ)',
    description: 'Tasks: digging, ploughing, planting, cutting, etc.',
    buttons: [
      { text: 'Add Task', icon: 'fa-plus', class: 'green-btn', action: 'addFarmTask' },
      { text: 'Edit Task', icon: 'fa-pen', class: 'blue-btn', action: 'editFarmTask' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewFarmTaskList' }
    ]
  },
  {
    id: 'fertilizers',
    iconColor: 'green',
    icon: 'fa-seedling',
    title: 'Fertilizers (വളങ്ങൾ)',
    description: 'Info: fertilizer name, quantity, used date, cost',
    buttons: [
      { text: 'Add Fertilizer', icon: 'fa-plus', class: 'green-btn', action: 'addFertilizer' },
      { text: 'Edit Fertilizer', icon: 'fa-pen', class: 'blue-btn', action: 'editFertilizer' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewFertilizerList' }
    ]
  },
  {
    id: 'pesticides',
    iconColor: 'purple',
    icon: 'fa-bug',
    title: 'Pesticides (കീടനാശിനികൾ)',
    description: 'Info: pesticide name, dose, spray date',
    buttons: [
      { text: 'Add Pesticide', icon: 'fa-plus', class: 'green-btn', action: 'addPesticide' },
      { text: 'Edit Pesticide', icon: 'fa-pen', class: 'blue-btn', action: 'editPesticide' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewPesticideList' }
    ]
  },
  {
    id: 'irrigation',
    iconColor: 'blue',
    icon: 'fa-water',
    title: 'Irrigation (ജലസേചനം)',
    description: 'Records: date, time, irrigation method',
    buttons: [
      { text: 'Add Irrigation', icon: 'fa-plus', class: 'green-btn', action: 'addIrrigation' },
      { text: 'Edit Irrigation', icon: 'fa-pen', class: 'blue-btn', action: 'editIrrigation' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewIrrigationList' }
    ]
  },
  {
    id: 'harvest',
    iconColor: 'green',
    icon: 'fa-wheat-awn',
    title: 'Harvest (വിളവെടുപ്പ്)',
    description: 'Details: crop name, weight, harvest date',
    buttons: [
      { text: 'Add Harvest', icon: 'fa-plus', class: 'green-btn', action: 'addHarvest' },
      { text: 'Edit Harvest', icon: 'fa-pen', class: 'blue-btn', action: 'editHarvest' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewHarvestList' }
    ]
  },
  {
    id: 'sales',
    iconColor: 'orange',
    icon: 'fa-hand-holding-dollar',
    title: 'Sales (വിൽപ്പന)',
    description: 'Sales: bananas, pepper, other produce — price, buyer info',
    buttons: [
      { text: 'Add Sale', icon: 'fa-plus', class: 'green-btn', action: 'addSale' },
      { text: 'Edit Sale', icon: 'fa-pen', class: 'blue-btn', action: 'editSale' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewSaleList' }
    ]
  },
  {
    id: 'drying',
    iconColor: 'yellow',
    icon: 'fa-sun',
    title: 'Drying (ഉണക്കൽ)',
    description: 'Drying: quantity sent, dry weight after, charges',
    buttons: [
      { text: 'Add Drying', icon: 'fa-plus', class: 'green-btn', action: 'addDrying' },
      { text: 'Edit Drying', icon: 'fa-pen', class: 'blue-btn', action: 'editDrying' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewDryingList' }
    ]
  },
  {
    id: 'equipment',
    iconColor: 'purple',
    icon: 'fa-wrench',
    title: 'Equipment (ഉപകരണങ്ങൾ)',
    description: 'Equipment: sprayers, pumps, machines — service info',
    buttons: [
      { text: 'Add Equipment', icon: 'fa-plus', class: 'green-btn', action: 'addEquipment' },
      { text: 'Edit Equipment', icon: 'fa-pen', class: 'blue-btn', action: 'editEquipment' },
      { text: 'View List', icon: 'fa-list', class: 'green-btn', action: 'viewEquipmentList' }
    ]
  }
];

/* ==========================
   Action placeholders (do not override real implementations)
   If your app already defines these functions globally, those will be used.
   Otherwise we provide safe console.log placeholders.
========================= */
window.addWorker = window.addWorker || function () { console.log('addWorker'); };
window.editWorker = window.editWorker || function () { console.log('editWorker'); };
window.viewWorkerList = window.viewWorkerList || function () { console.log('viewWorkerList'); };

window.addFarmTask = window.addFarmTask || function () { console.log('addFarmTask'); };
window.editFarmTask = window.editFarmTask || function () { console.log('editFarmTask'); };
window.viewFarmTaskList = window.viewFarmTaskList || function () { console.log('viewFarmTaskList'); };

window.addFertilizer = window.addFertilizer || function () { console.log('addFertilizer'); };
window.editFertilizer = window.editFertilizer || function () { console.log('editFertilizer'); };
window.viewFertilizerList = window.viewFertilizerList || function () { console.log('viewFertilizerList'); };

window.addPesticide = window.addPesticide || function () { console.log('addPesticide'); };
window.editPesticide = window.editPesticide || function () { console.log('editPesticide'); };
window.viewPesticideList = window.viewPesticideList || function () { console.log('viewPesticideList'); };

window.addIrrigation = window.addIrrigation || function () { console.log('addIrrigation'); };
window.editIrrigation = window.editIrrigation || function () { console.log('editIrrigation'); };
window.viewIrrigationList = window.viewIrrigationList || function () { console.log('viewIrrigationList'); };

window.addHarvest = window.addHarvest || function () { console.log('addHarvest'); };
window.editHarvest = window.editHarvest || function () { console.log('editHarvest'); };
window.viewHarvestList = window.viewHarvestList || function () { console.log('viewHarvestList'); };

window.addSale = window.addSale || function () { console.log('addSale'); };
window.editSale = window.editSale || function () { console.log('editSale'); };
window.viewSaleList = window.viewSaleList || function () { console.log('viewSaleList'); };

window.addDrying = window.addDrying || function () { console.log('addDrying'); };
window.editDrying = window.editDrying || function () { console.log('editDrying'); };
window.viewDryingList = window.viewDryingList || function () { console.log('viewDryingList'); };

window.addEquipment = window.addEquipment || function () { console.log('addEquipment'); };
window.editEquipment = window.editEquipment || function () { console.log('editEquipment'); };
window.viewEquipmentList = window.viewEquipmentList || function () { console.log('viewEquipmentList'); };

/* ==========================
   Render on DOMContentLoaded
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const targetId = 'entryCardContainer';
  if (typeof window.renderCards === 'function') {
    const container = document.getElementById(targetId) || document.querySelector('.card-grid');
    if (container) window.renderCards(targetId, entryCards);
    else console.warn(`No container found for entry cards. Add <div class="card-grid" id="${targetId}"></div> in Entry.html`);
  } else {
    console.warn('renderCards not available');
  }
});
