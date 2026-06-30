/* ==========================================
   ROUTES
========================================== */
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

/* ==========================================
   CENTRAL NAVIGATION
========================================== */
function navigateTo(moduleName) {
    const targetUrl = moduleRoutes[moduleName];
    if (!targetUrl) {
        showToast("Module will be integrated soon");
        return false;
    }
    window.location.href = targetUrl;
    return true;
}

/* ==========================================
   TOAST
========================================== */
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
    setTimeout(() => { toast.remove(); }, 3000);
}

/* ==========================================
   NAVIGATION ITEMS
========================================== */
const navItems = [
    { name: "📊 Overview", id: "overview", icon: "fa-chart-line" },
    { name: "🌾 Entry", id: "Entry", icon: "fa-seedling" },
    { name: "🏡 Farm Management", id: "farmManagement", icon: "fa-calendar" },
    { name: "📑 Reports", id: "reports", icon: "fa-file-alt" },
    { name: "🆘 Support", id: "support", icon: "fa-life-ring" },
    { name: "💳 Payment History", id: "paymentHistory", icon: "fa-credit-card" },
    { name: "⚙️ Settings", id: "settings", icon: "fa-cog" }
];

/* ==========================================
   BUILD SIDEBAR MENU
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const navMenu = document.getElementById("nav-menu");
    if (!navMenu) return;

    navItems.forEach(item => {
        const btn = document.createElement("a");
        btn.href = "#";
        btn.innerHTML = `<i class="fas ${item.icon} mr-3"></i> <span class="nav-text">${item.name}</span>`;
        btn.className = "flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-100 mb-2";
        
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (item.id === "print") { window.print(); return; }
            if (item.id === "downloadJson") {
                const data = { app: "Agri Tracker", exportedAt: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "agri-tracker.json";
                a.click();
                URL.revokeObjectURL(url);
                return;
            }
            if (item.id === "exportData") { showToast("Export module will be integrated soon"); return; }
            navigateTo(item.id);
        });
        navMenu.appendChild(btn);
    });
});

/* ==========================================
   CALENDAR & SESSION
========================================== */
document.addEventListener("DOMContentLoaded", async () => {
    // Calendar
    const dateElement = document.getElementById("current-date");
    const dayElement = document.getElementById("current-day");
    if (dateElement && dayElement) {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
        dayElement.textContent = now.toLocaleDateString("en-GB", { weekday: "long" });
    }

    // Session Check
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) { window.location.replace("logincard.html"); return; }
        
        const userName = session.user?.user_metadata?.full_name || session.user?.user_metadata?.name || session.user?.email || "Admin User";
        const userNameElement = document.getElementById("logged-user-name");
        if (userNameElement) userNameElement.textContent = userName;
    } catch(error) { window.location.replace("logincard.html"); }

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => logout());
});

async function logout(){
    try { await window.supabaseClient.auth.signOut(); } catch(error) { console.error(error); }
    window.location.replace("logincard.html");
}

/* ==========================================
   SIDEBAR COLLAPSE LOGIC (Updated)
========================================== */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector('.header-left i.fa-bars') || document.querySelector('.header-left .fa-bars');
    const sidebar = document.querySelector('.sidebar');

    if (hamburger && sidebar) {
        hamburger.style.cursor = 'pointer';
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
});
