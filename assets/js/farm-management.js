/* assets/js/activities.js
   Single-file implementation for Activities page.
   - Reusable renderCards (only defines if window.renderCards not present)
   - Sidebar toggle, session validation, logout, menu highlight (unchanged behavior)
   - Dynamic activityCards array based on existing static HTML
   - Placeholder action functions that defer to existing implementations if present
*/

/* ==========================
   Reusable renderCards (define only if not already present)
   ========================== */
(function () {
  if (window.renderCards && typeof window.renderCards === 'function') {
    return; // already defined (reuse existing)
  }

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
        if (btn.icon) {
          const bi = createEl('i', 'fa-solid ' + btn.icon);
          button.appendChild(bi);
        }
        const txt = document.createTextNode(' ' + (btn.text || ''));
        button.appendChild(txt);

        // Bind action: prefer function reference, then global function name, then href
        if (typeof btn.action === 'function') {
          button.addEventListener('click', (ev) => {
            try { btn.action(ev, card); } catch (e) { console.error(e); }
          });
        } else if (typeof btn.action === 'string' && typeof window[btn.action] === 'function') {
          button.addEventListener('click', (ev) => {
            try { window[btn.action](ev, card); } catch (e) { console.error(e); }
          });
        } else if (btn.href) {
          button.addEventListener('click', () => { window.location.href = btn.href; });
        } else {
          button.addEventListener('click', (ev) => {
            console.warn('No action for button', btn, card);
            ev.preventDefault();
          });
        }

        actions.appendChild(button);
      });
    }

    wrapper.appendChild(actions);

    // Whole-card support (href or onClick)
    if (card.onClick && typeof card.onClick === 'function') {
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'button');
      wrapper.addEventListener('click', (ev) => card.onClick(ev, card));
      wrapper.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          card.onClick(ev, card);
        }
      });
    } else if (card.href) {
      wrapper.style.cursor = 'pointer';
      wrapper.tabIndex = 0;
      wrapper.addEventListener('click', () => { window.location.href = card.href; });
      wrapper.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          window.location.href = card.href;
        }
      });
    }

    return wrapper;
  }

  function renderCards(containerId, cards) {
    if (!containerId) {
      console.warn('renderCards: missing containerId');
      return;
    }

    // Find exact container by id; fallback to first .card-grid if not found
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.querySelector('.card-grid');
      if (!container) {
        console.warn(`renderCards: element with id "${containerId}" not found and no .card-grid present`);
        return;
      }
    }

    const list = Array.isArray(cards) ? cards : [];

    const frag = document.createDocumentFragment();
    list.forEach((card, idx) => {
      frag.appendChild(buildCard(card, idx));
    });

    container.innerHTML = '';
    container.appendChild(frag);
  }

  window.renderCards = renderCards;
})();

/* ==========================
   Sidebar Toggle
   (unchanged behavior)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.querySelector(".sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
});

/* ==========================
   Session Validation (Supabase)
   (unchanged behavior)
   ========================== */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!window.supabaseClient) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (!session) {
      window.location.replace("logincard.html");
      return;
    }

    console.log("Logged In User:", session.user.email);
  } catch (error) {
    console.error("Session Error:", error);
    window.location.replace("logincard.html");
  }
});

/* ==========================
   Logout Function (unchanged behavior)
   Exposed on window so HTML onclick="logout()" works
   ========================== */
window.logout = window.logout || (async function logout() {
  try {
    if (window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
  } catch (error) {
    console.error("Logout Error:", error);
  }
  window.location.replace("logincard.html");
});

/* ==========================
   Logout Button Binding
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", window.logout);
});

/* ==========================
   Dashboard Menu Highlight
   (unchanged behavior)
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const dashboardLink = document.querySelector('.menu a[href="dashboard.html"]');
  if (dashboardLink) dashboardLink.classList.add("active-menu");
});

/* ==========================
   Dynamic Activity Cards (data)
   - Based on the static cards in your farm-management.html
   - To add/remove cards, edit this array only
   ========================== */
const activityCards = [
  {
    id: "person-master",
    iconColor: "green",
    icon: "fa-user",
    title: "Person Master",
    description: "Add, edit and manage persons information",
    buttons: [
      { text: "Add Person", icon: "fa-plus", class: "green-btn", action: "addPerson" },
      { text: "Edit Person", icon: "fa-pen", class: "blue-btn", action: "editPerson" },
      { text: "View List", icon: "fa-list", class: "green-btn", action: "viewPersonList" }
    ]
  },

  {
    id: "item-master",
    iconColor: "yellow",
    icon: "fa-box",
    title: "Item Master",
    description: "Add, edit and manage items information",
    buttons: [
      { text: "Add Item", icon: "fa-plus", class: "green-btn", action: "addItem" },
      { text: "Edit Item", icon: "fa-pen", class: "blue-btn", action: "editItem" },
      { text: "View List", icon: "fa-list", class: "green-btn", action: "viewItemList" }
    ]
  },

  {
    id: "village-master",
    iconColor: "blue",
    icon: "fa-house",
    title: "Village Master",
    description: "Add and manage village information",
    buttons: [
      { text: "Add Village", icon: "fa-plus", class: "green-btn", action: "addVillage" },
      { text: "Edit Village", icon: "fa-pen", class: "blue-btn", action: "editVillage" },
      { text: "View List", icon: "fa-list", class: "green-btn", action: "viewVillageList" }
    ]
  },

  {
    id: "ward-master",
    iconColor: "purple",
    icon: "fa-location-dot",
    title: "Ward Master",
    description: "Add and manage ward information",
    buttons: [
      { text: "Add Ward", icon: "fa-plus", class: "green-btn", action: "addWard" },
      { text: "Edit Ward", icon: "fa-pen", class: "blue-btn", action: "editWard" },
      { text: "View List", icon: "fa-list", class: "green-btn", action: "viewWardList" }
    ]
  },

  {
    id: "crop-master",
    iconColor: "green",
    icon: "fa-seedling",
    title: "Crop Master",
    description: "Add and manage crop information",
    buttons: [
      { text: "Add Crop", icon: "fa-plus", class: "green-btn", action: "addCrop" },
      { text: "Edit Crop", icon: "fa-pen", class: "blue-btn", action: "editCrop" },
      { text: "View List", icon: "fa-list", class: "green-btn", action: "viewCropList" }
    ]
  },

  {
    id: "user-management",
    iconColor: "orange",
    icon: "fa-users",
    title: "User Management",
    description: "Add users and manage user accounts",
    buttons: [
      { text: "Add User", icon: "fa-plus", class: "green-btn", action: "addUser" },
      { text: "Edit User", icon: "fa-pen", class: "blue-btn", action: "editUser" },
      { text: "View List", icon: "fa-list", class: "green-btn", action: "viewUserList" }
    ]
  }
];

/* ==========================
   Action placeholders
   - If real implementations exist globally, those will be used.
   - Otherwise these safe placeholders prevent runtime errors.
   ========================== */
window.addPerson = window.addPerson || function () { console.log("Add Person"); };
window.editPerson = window.editPerson || function () { console.log("Edit Person"); };
window.viewPersonList = window.viewPersonList || function () { console.log("View Person List"); };

window.addItem = window.addItem || function () { console.log("Add Item"); };
window.editItem = window.editItem || function () { console.log("Edit Item"); };
window.viewItemList = window.viewItemList || function () { console.log("View Item List"); };

window.addVillage = window.addVillage || function () { console.log("Add Village"); };
window.editVillage = window.editVillage || function () { console.log("Edit Village"); };
window.viewVillageList = window.viewVillageList || function () { console.log("View Village List"); };

window.addWard = window.addWard || function () { console.log("Add Ward"); };
window.editWard = window.editWard || function () { console.log("Edit Ward"); };
window.viewWardList = window.viewWardList || function () { console.log("View Ward List"); };

window.addCrop = window.addCrop || function () { console.log("Add Crop"); };
window.editCrop = window.editCrop || function () { console.log("Edit Crop"); };
window.viewCropList = window.viewCropList || function () { console.log("View Crop List"); };

window.addUser = window.addUser || function () { console.log("Add User"); };
window.editUser = window.editUser || function () { console.log("Edit User"); };
window.viewUserList = window.viewUserList || function () { console.log("View User List"); };

/* ==========================
   Render on load
   - Uses 'activitiesCardContainer' id if present, otherwise first .card-grid
   ========================== */
document.addEventListener('DOMContentLoaded', () => {
  const targetId = 'activitiesCardContainer';
  if (typeof window.renderCards === 'function') {
    const container = document.getElementById(targetId) || document.querySelector('.card-grid');
    if (container) window.renderCards(targetId, activityCards);
    else console.warn('No container found for activity cards. Add <div class="card-grid" id="activitiesCardContainer"></div>');
  } else {
    console.warn('renderCards not available');
  }
});
