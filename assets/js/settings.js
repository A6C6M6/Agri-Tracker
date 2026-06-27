/* ==========================
Sidebar Toggle
========================= */

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
Session Validation
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    try {

        if (!window.supabaseClient) {
            return;
        }

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
Logout Function
========================= */

async function logout() {
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
    } catch (error) {
        console.error("Logout Error:", error);
    }

    window.location.replace("logincard.html");
}

/* ==========================
Logout Button Binding
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});

/* ==========================
Dashboard Menu Highlight
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const dashboardLink = document.querySelector('.menu a[href="dashboard.html"]');
    if (dashboardLink) {
        dashboardLink.classList.add("active-menu");
    }
});

/* ==========================
Dynamic Settings Cards (data)
========================= */

const settingsCards = [

  {
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
      iconColor: "yellow",
      icon: "fa-box",
      title: "Item Master",
      description: "Add, edit and manage items information",
      buttons: [
          { text: "Add Item", icon: "fa-plus", class: "green-btn", action: "addItem" },
          { text: "Edit Item", icon: "fa-pen", class: "blue-btn", action: "editItem" },
          { text: "View List", icon: "fa-list", class: "green-btn", action: "viewItemList" }
      ]
  };


{
    id: "reports",
    iconColor: "purple",
    icon: "fa-chart-line",
    title: "Reports",
    description: "Generate and download system reports",
    buttons: [
      { text: "Generate", icon: "fa-file-arrow-down", class: "green-btn", action: "generateReports" },
      { text: "Schedule", icon: "fa-clock", class: "blue-btn", action: "scheduleReports" }
    ]
    // optional: href: "reports.html"
  }

];
/* ==========================
Render Settings Cards (uses renderCards from card-template.js)
========================= */

function renderSettingsCards() {
    // renderCards is global (from card-template.js)
    if (typeof window.renderCards === 'function') {
        window.renderCards('settingsCardContainer', settingsCards);
    } else {
        // fallback: original innerHTML method (very unlikely)
        const container = document.getElementById("settingsCardContainer");
        if (!container) return;
        container.innerHTML = settingsCards.map(card => `
          <div class="setting-card">
              <div class="card-top">
                  <div class="icon ${card.iconColor}">
                      <i class="fa-solid ${card.icon}"></i>
                  </div>
                  <div>
                      <h3>${card.title}</h3>
                      <p>${card.description}</p>
                  </div>
              </div>
              <hr>
              <div class="actions">
                  ${card.buttons.map(btn => `
                      <button class="btn ${btn.class}" onclick="${btn.action}()">
                          <i class="fa-solid ${btn.icon}"></i>
                          ${btn.text}
                      </button>
                  `).join("")}
              </div>
          </div>
        `).join("");
    }
}

/* ==========================
Placeholder Action Functions (keep as-is)
========================= */

function addPerson() { console.log("Add Person"); }
function editPerson() { console.log("Edit Person"); }
function viewPersonList() { console.log("View Person List"); }
function addItem() { console.log("Add Item"); }
function editItem() { console.log("Edit Item"); }
function viewItemList() { console.log("View Item List"); }

/* ==========================
Initialize Dynamic Cards
========================= */

document.addEventListener("DOMContentLoaded", renderSettingsCards);

/* ==========================
When on Settings page: convert any "Settings" menu item to "Dashboard"
(so Settings link is not shown again; clicking goes to dashboard.html)
This preserves user flow you requested.
========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Find a menu link that points to settings.html
  const settingsLink = document.querySelector('.menu a[href="settings.html"]');
  if (settingsLink) {
    // change it to dashboard
    settingsLink.setAttribute('href', 'dashboard.html');
    // change visible text if there's a span
    const span = settingsLink.querySelector('span');
    if (span) {
      span.textContent = 'Dashboard';
    }
  }
});
