/* ==========================================
   AGRI-TRACKER DASHBOARD JS - FIXED VERSION
========================================== */

/* --- Configuration & Routes --- */
const moduleRoutes = window.APP_CONFIG?.MODULES || {
    dashboard: "dashboard.html",
    overview: "dashboard.html",
    Entry: "Entry.html",
    farmManagement: "farm-management.html",
    reports: "reports.html",
    support: "",
    paymentHistory: "",
    print: "",
    downloadJson: "",
    exportData: "",
    settings: "settings.html"
};

/* --- Navigation & Utilities --- */
function navigateTo(moduleName) {
    const targetUrl = moduleRoutes[moduleName];
    if (!targetUrl) {
        showToast("Module will be integrated soon");
        return false;
    }
    window.location.href = targetUrl;
    return true;
}

function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) {
        alert(message);
        return;
    }
    const toast = document.createElement("div");
    toast.className = "bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* --- Core Initialization --- */
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Build Sidebar Menu
    const navMenu = document.getElementById("nav-menu");
    const navItems = [
        { name: "📊 Overview", id: "overview", icon: "fa-chart-line" },
        { name: "🌾 Entry", id: "Entry", icon: "fa-seedling" },
        { name: "🏡 Farm Management", id: "farmManagement", icon: "fa-calendar" },
        { name: "📑 Reports", id: "reports", icon: "fa-file-alt" },
        { name: "🆘 Support", id: "support", icon: "fa-life-ring" },
        { name: "💳 Payment History", id: "paymentHistory", icon: "fa-credit-card" },
        { name: "⚙️ Settings", id: "settings", icon: "fa-cog" }
    ];

    if (navMenu) {
        navItems.forEach(item => {
            const li = document.createElement("li");
            const btn = document.createElement("a");
            btn.href = "#";
            btn.innerHTML = `<i class="fas ${item.icon}"></i> ${item.name}`;
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                
                // Logic for menu items
                switch(item.id) {
                    case "print":
                        window.print();
                        break;
                    case "downloadJson": {
                        // FIXED: Curly braces added here to fix scope error
                        const data = { app: "Agri Tracker", exportedAt: new Date().toISOString() };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "agri-tracker.json";
                        a.click();
                        URL.revokeObjectURL(url);
                        break;
                    }
                    default:
                        navigateTo(item.id);
                }
            });
            li.appendChild(btn);
            navMenu.appendChild(li);
        });
    }

    // 2. Calendar & Sidebar Toggle logic remains the same...
    const headerHamburger = document.querySelector('.header-left i.fa-bars');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (headerHamburger && sidebar) {
        headerHamburger.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
});

/* --- Auth & Session --- */
async function logout() {
    try {
        if (window.supabaseClient) await window.supabaseClient.auth.signOut();
    } catch (error) {
        console.error("Logout Error:", error);
    }
    window.location.replace("logincard.html");
}
