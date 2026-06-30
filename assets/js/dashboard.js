/* ==========================================
   AGRI TRACKER - CENTRALIZED DASHBOARD JS
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

/* --- Navigation Helpers --- */
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
    if (!container) { alert(message); return; }
    const toast = document.createElement("div");
    toast.className = "bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* --- Initialization --- */
document.addEventListener("DOMContentLoaded", () => {
    
    /* 1. Build Sidebar */
    const navMenu = document.getElementById("nav-menu");
    if (navMenu) {
        const navItems = [
            { name: "📊 Overview", id: "overview", icon: "fa-chart-line" },
            { name: "🌾 Entry", id: "Entry", icon: "fa-seedling" },
            { name: "🏡 Farm Management", id: "farmManagement", icon: "fa-calendar" },
            { name: "📑 Reports", id: "reports", icon: "fa-file-alt" },
            { name: "🆘 Support", id: "support", icon: "fa-life-ring" },
            { name: "💳 Payment History", id: "paymentHistory", icon: "fa-credit-card" },
            { name: "⚙️ Settings", id: "settings", icon: "fa-cog" }
        ];

        navItems.forEach(item => {
            const btn = document.createElement("a");
            btn.href = "#";
            btn.innerHTML = `<i class="fas ${item.icon} mr-3"></i> ${item.name}`;
            btn.className = "flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-100 mb-2";
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                if (item.id === "print") window.print();
                else if (item.id === "downloadJson") {
                    const data = { app: "Agri Tracker", exportedAt: new Date().toISOString() };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "agri-tracker.json"; a.click();
                    URL.revokeObjectURL(url);
                } else {
                    navigateTo(item.id);
                }
            });
            navMenu.appendChild(btn);
        });
    }

    /* 2. Calendar & Logout Setup */
    const now = new Date();
    const dateEl = document.getElementById("current-date");
    const dayEl = document.getElementById("current-day");
    if (dateEl) dateEl.textContent = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    if (dayEl) dayEl.textContent = now.toLocaleDateString("en-GB", { weekday: "long" });

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    /* 3. Auth Check */
    checkSession();
});

/* --- Auth & Session Logic --- */
async function checkSession() {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) { window.location.replace("logincard.html"); return; }

        const userName = session.user?.user_metadata?.full_name || session.user?.email || "Admin User";
        const nameEl = document.getElementById("logged-user-name");
        const avatarEl = document.getElementById("user-avatar");
        
        if (nameEl) nameEl.textContent = userName;
        if (avatarEl) avatarEl.src = session.user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
    } catch {
        window.location.replace("logincard.html");
    }
}

async function logout() {
    try { await window.supabaseClient.auth.signOut(); } 
    catch(e) { console.error("Logout Error:", e); }
    window.location.replace("logincard.html");
}
