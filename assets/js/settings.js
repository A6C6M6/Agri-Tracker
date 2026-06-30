/* ==========================
   Sidebar Toggle
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
   Session Validation
========================== */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!window.supabaseClient) return;
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.replace("logincard.html");
            return;
        }
    } catch (error) {
        console.error("Session Error:", error);
        window.location.replace("logincard.html");
    }
});

/* ==========================
   Logout Function
========================== */

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
   Person Master Navigation
========================== */

function redirectToPersonMaster() {
    window.location.href = "settings-person-master.html";
}

/* ==========================
   Settings Card Configuration
========================== */

const settingsCards = [
  {
      iconColor: "green",
      icon: "fa-user",
      title: "Person Master",
      description: "Add, edit and manage persons information",
      buttons: [
          { text: "Add Person", icon: "fa-plus", class: "green-btn", action: "redirectToPersonMaster" },
          { text: "Edit Person", icon: "fa-pen", class: "blue-btn", action: "redirectToPersonMaster" },
          { text: "View List", icon: "fa-list", class: "green-btn", action: "redirectToPersonMaster" }
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
  },
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
  }
];

/* ==========================
   Render Cards Helper
========================== */

function renderSettingsCards() {
    if (typeof window.renderCards === 'function') {
        window.renderCards('settingsCardContainer', settingsCards);
    } else {
        console.error("renderCards function not found in card-template.js");
    }
}

// പ്ലേസ്‌ഹോൾഡർ ഫംഗ്‌ഷനുകൾ
function addItem() { console.log("Add Item"); }
function editItem() { console.log("Edit Item"); }
function viewItemList() { console.log("View Item List"); }
function generateReports() { console.log("Generate Reports"); }
function scheduleReports() { console.log("Schedule Reports"); }

// Init
document.addEventListener("DOMContentLoaded", renderSettingsCards);
