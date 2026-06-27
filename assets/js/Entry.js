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
Entry Menu Highlight
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const entryLink = document.querySelector('.menu a[href="entry.html"]');
    if (entryLink) {
        entryLink.classList.add("active-menu");
    }
});

/* ==========================
Dynamic Entry Cards (data)
========================= */

const entryCards = [

  {
      iconColor: "green",
      icon: "fa-leaf",
      title: "Crop Entry",
      description: "Record and manage crop planting and growth data",
      buttons: [
          { text: "New Entry", icon: "fa-plus", class: "green-btn", action: "newCropEntry" },
          { text: "Edit Entry", icon: "fa-pen", class: "blue-btn", action: "editCropEntry" },
          { text: "View List", icon: "fa-list", class: "green-btn", action: "viewCropList" }
      ]
  },

  {
      iconColor: "yellow",
      icon: "fa-cloud",
      title: "Weather Data",
      description: "Log weather conditions and climate information",
      buttons: [
          { text: "Add Data", icon: "fa-plus", class: "green-btn", action: "addWeatherData" },
          { text: "View History", icon: "fa-history", class: "blue-btn", action: "viewWeatherHistory" }
      ]
  },

  {
    iconColor: "purple",
    icon: "fa-flask",
    title: "Soil Entry",
    description: "Record soil quality and nutrient analysis data",
    buttons: [
      { text: "New Sample", icon: "fa-plus", class: "green-btn", action: "newSoilSample" },
      { text: "View Report", icon: "fa-file-alt", class: "blue-btn", action: "viewSoilReport" }
    ]
  },

  {
    iconColor: "orange",
    icon: "fa-droplet",
    title: "Irrigation",
    description: "Track irrigation schedules and water usage",
    buttons: [
      { text: "Log Irrigation", icon: "fa-plus", class: "green-btn", action: "logIrrigation" },
      { text: "View Schedule", icon: "fa-calendar", class: "blue-btn", action: "viewIrrigationSchedule" }
    ]
  }

];

/* ==========================
Render Entry Cards (uses renderCards from card-template.js)
========================= */

function renderEntryCards() {
    // renderCards is global (from card-template.js)
    if (typeof window.renderCards === 'function') {
        window.renderCards('entryCardContainer', entryCards);
    } else {
        // fallback: original innerHTML method (very unlikely)
        const container = document.getElementById("entryCardContainer");
        if (!container) return;
        container.innerHTML = entryCards.map(card => `
          <div class="entry-card">
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
Placeholder Action Functions
========================= */

function newCropEntry() { console.log("New Crop Entry"); }
function editCropEntry() { console.log("Edit Crop Entry"); }
function viewCropList() { console.log("View Crop List"); }

function addWeatherData() { console.log("Add Weather Data"); }
function viewWeatherHistory() { console.log("View Weather History"); }

function newSoilSample() { console.log("New Soil Sample"); }
function viewSoilReport() { console.log("View Soil Report"); }

function logIrrigation() { console.log("Log Irrigation"); }
function viewIrrigationSchedule() { console.log("View Irrigation Schedule"); }

/* ==========================
Initialize Dynamic Cards
========================= */

document.addEventListener("DOMContentLoaded", renderEntryCards);

/* ==========================
When on Entry page: convert any "Entry" menu item to "Dashboard"
(so Entry link is not shown again; clicking goes to dashboard.html)
This preserves user flow.
========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Find a menu link that points to entry.html
  const entryLink = document.querySelector('.menu a[href="entry.html"]');
  if (entryLink) {
    // change it to dashboard
    entryLink.setAttribute('href', 'dashboard.html');
    // change visible text if there's a span
    const span = entryLink.querySelector('span');
    if (span) {
      span.textContent = 'Dashboard';
    }
  }
});
