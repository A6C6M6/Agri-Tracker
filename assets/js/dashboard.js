javascript
/* app-config.js ൽ നിന്നുള്ള routes */

const moduleRoutes =
    window.APP_CONFIG?.MODULES || {

    dashboard: "dashboard.html",
    overview: "dashboard.html",
    crops: "crops.html",
    fields: "fields.html",
    weather: "weather.html",
    activities: "activities.html",

    fertilizers: "",
    irrigation: "",

    reports: "reports.html",
    support: "",
    paymentHistory: "",

    print: "",
    downloadJson: "",
    exportData: "",

    settings: "settings.html",

    farmers: "",
    inventory: "",
    equipment: "",
    marketPrices: "",
    alerts: "",
    users: "",
    analytics: "",
    backup: ""

};

const navItems = [

    { name: "📊 Overview", id: "overview", icon: "fa-chart-line" },
    { name: "🌾 Crops", id: "crops", icon: "fa-seedling" },
    { name: "🗺️ Fields", id: "fields", icon: "fa-map" },
    { name: "🌦️ Weather", id: "weather", icon: "fa-cloud-sun" },
    { name: "📅 Activities", id: "activities", icon: "fa-calendar" },

    { name: "🧪 Fertilizers", id: "fertilizers", icon: "fa-flask" },
    { name: "💧 Irrigation", id: "irrigation", icon: "fa-tint" },

    { name: "📑 Reports", id: "reports", icon: "fa-file-alt" },

    { name: "🆘 Support", id: "support", icon: "fa-life-ring" },

    { name: "💳 Payment History", id: "paymentHistory", icon: "fa-credit-card" },

    { name: "🖨️ Print", id: "print", icon: "fa-print" },

    { name: "📥 Download JSON", id: "downloadJson", icon: "fa-download" },

    { name: "📤 Export Data", id: "exportData", icon: "fa-upload" },

    { name: "⚙️ Settings", id: "settings", icon: "fa-cog" },

    { name: "👨‍🌾 Farmers", id: "farmers", icon: "fa-user" },
    { name: "📦 Inventory", id: "inventory", icon: "fa-box" },
    { name: "🚜 Equipment", id: "equipment", icon: "fa-tractor" },
    { name: "📈 Market Prices", id: "marketPrices", icon: "fa-chart-bar" },
    { name: "🔔 Alerts", id: "alerts", icon: "fa-bell" },
    { name: "👥 Users", id: "users", icon: "fa-users" },
    { name: "📊 Analytics", id: "analytics", icon: "fa-chart-pie" },
    { name: "☁ Backup", id: "backup", icon: "fa-cloud" }

];



function showToast(message) {

    const container =
        document.getElementById("toast-container");

    if (!container) {
        alert(message);
        return;
    }

    const toast =
        document.createElement("div");

    toast.className =
        "bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg toast";

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {

    const navMenu =
        document.getElementById("nav-menu");

    if (!navMenu) {
        return;
    }

    navItems.forEach(item => {

        const btn =
            document.createElement("a");

        btn.href = "#";

        btn.innerHTML =
            `<i class="fas ${item.icon} mr-3"></i> ${item.name}`;

        btn.className =
            "flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-100 mb-2";

        btn.addEventListener("click", (e) => {

            e.preventDefault();

            switch (item.id) {

                case "print":
                    window.print();
                    return;

                case "downloadJson":

                    const data = {
                        app: "Agri Tracker",
                        exportedAt: new Date().toISOString()
                    };

                    const blob = new Blob(
                        [JSON.stringify(data, null, 2)],
                        { type: "application/json" }
                    );

                    const url =
                        URL.createObjectURL(blob);

                    const a =
                        document.createElement("a");

                    a.href = url;
                    a.download = "agri-tracker.json";
                    a.click();

                    URL.revokeObjectURL(url);
                    return;

                case "exportData":
                    showToast("Export module will be integrated soon");
                    return;

            }

            if (moduleRoutes[item.id]) {

                window.location.href =
                    moduleRoutes[item.id];

            } else {

                showToast(
                    "Module will be integrated soon"
                );

            }

        });

        navMenu.appendChild(btn);

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn =
        document.getElementById("logout-btn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            window.location.href =
                "logincard.html";

        });

    }

});

