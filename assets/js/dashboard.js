/* app-config.js ൽ നിന്നുള്ള routes */

const moduleRoutes =
    window.APP_CONFIG?.MODULES || {

    dashboard: "dashboard.html",
    overview: "dashboard.html",

   Entry: "Entry.html",
   
   
    activities: "activities.html",

    
    reports: "reports.html",

    support: "",
    paymentHistory: "",

    print: "",
    downloadJson: "",
    exportData: "",

    settings: "settings.html",

    

};


/* ----------------------------------
   Central Navigation Function
---------------------------------- */

function navigateTo(moduleName) {

    const targetUrl =
        moduleRoutes[moduleName];

    if (!targetUrl) {

        showToast(
            "Module will be integrated soon"
        );

        return false;
    }

    window.location.href =
        targetUrl;

    return true;
}


/* ----------------------------------
   Toast
---------------------------------- */

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


/* ----------------------------------
   Navigation Items
---------------------------------- */

const navItems = [

    { name: "📊 Overview", id: "overview", icon: "fa-chart-line" },
    { name: "🌾 Entry", id: "Entry", icon: "fa-Entry" },
   
   
    { name: "📅 Activities", id: "activities", icon: "fa-calendar" },

    
    { name: "📑 Reports", id: "reports", icon: "fa-file-alt" },

    { name: "🆘 Support", id: "support", icon: "fa-life-ring" },

    { name: "💳 Payment History", id: "paymentHistory", icon: "fa-credit-card" },

    { name: "🖨️ Print", id: "print", icon: "fa-print" },

    { name: "📥 Download JSON", id: "downloadJson", icon: "fa-download" },

    { name: "📤 Export Data", id: "exportData", icon: "fa-upload" },

    { name: "⚙️ Settings", id: "settings", icon: "fa-cog" },

  

];


/* ----------------------------------
   Sidebar Menu Build
---------------------------------- */

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
                        {
                            type: "application/json"
                        }
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

                    showToast(
                        "Export module will be integrated soon"
                    );

                    return;

                default:

                    navigateTo(item.id);

                    return;
            }

        });

        navMenu.appendChild(btn);

    });

});


/* ----------------------------------
   Logout
---------------------------------- */

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



/* ==========================
   Supabase Session Check
========================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

    try {

        const {
            data: { session }
        } =
        await window.supabaseClient
        .auth
        .getSession();

        if (!session) {

            window.location.replace(
                "logincard.html"
            );

            return;
        }

        console.log(
            "Logged In User:",
            session.user.email
        );

    }
    catch(error){

        console.error(
            "Session Error:",
            error
        );

        window.location.replace(
            "logincard.html"
        );

    }

});


/* ==========================
   Logout Function
========================== */

async function logout(){

    try{

        await window
        .supabaseClient
        .auth
        .signOut();

    }
    catch(error){

        console.error(
            "Logout Error:",
            error
        );

    }

    window.location.replace(
        "logincard.html"
    );

}

