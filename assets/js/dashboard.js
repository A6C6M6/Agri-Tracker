/* ==========================================
   ROUTES
========================================== */

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

    settings: "settings.html"
};


/* ==========================================
   CENTRAL NAVIGATION
========================================== */

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


/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    const container =
        document.getElementById(
            "toast-container"
        );

    if (!container) {

        alert(message);

        return;
    }

    const toast =
        document.createElement("div");

    toast.className =
        "bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg toast";

    toast.textContent =
        message;

    container.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);
}


/* ==========================================
   NAVIGATION ITEMS
========================================== */

const navItems = [

    {
        name: "📊 Overview",
        id: "overview",
        icon: "fa-chart-line"
    },

    {
        name: "🌾 Entry",
        id: "Entry",
        icon: "fa-seedling"
    },

    {
        name: "📅 Activities",
        id: "activities",
        icon: "fa-calendar"
    },

    {
        name: "📑 Reports",
        id: "reports",
        icon: "fa-file-alt"
    },

    {
        name: "🆘 Support",
        id: "support",
        icon: "fa-life-ring"
    },

    {
        name: "💳 Payment History",
        id: "paymentHistory",
        icon: "fa-credit-card"
    },

    {
        name: "⚙️ Settings",
        id: "settings",
        icon: "fa-cog"
    }
];


/* ==========================================
   BUILD SIDEBAR MENU
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

    const navMenu =
        document.getElementById(
            "nav-menu"
        );

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

        btn.addEventListener(
            "click",
            (e) => {

            e.preventDefault();

            switch (item.id) {

                case "print":

                    window.print();
                    return;

                case "downloadJson":

                    const data = {

                        app:
                        "Agri Tracker",

                        exportedAt:
                        new Date()
                        .toISOString()
                    };

                    const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                data,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                            "application/json"
                        }
                    );

                    const url =
                    URL.createObjectURL(
                        blob
                    );

                    const a =
                    document.createElement(
                        "a"
                    );

                    a.href = url;

                    a.download =
                    "agri-tracker.json";

                    a.click();

                    URL.revokeObjectURL(
                        url
                    );

                    return;

                case "exportData":

                    showToast(
                        "Export module will be integrated soon"
                    );

                    return;

                default:

                    navigateTo(
                        item.id
                    );

                    return;
            }

        });

        navMenu.appendChild(
            btn
        );

    });

});


/* ==========================================
   CALENDAR WIDGET
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

    const dateElement =
        document.getElementById(
            "current-date"
        );

    const dayElement =
        document.getElementById(
            "current-day"
        );

    if (
        !dateElement ||
        !dayElement
    ) {
        return;
    }

    const now =
        new Date();

    dateElement.textContent =
        now.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    dayElement.textContent =
        now.toLocaleDateString(
            "en-GB",
            {
                weekday: "long"
            }
        );

});


/* ==========================================
   SIMPLE LOGOUT BUTTON
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

    const logoutBtn =
        document.getElementById(
            "logout-btn"
        );

    if (!logoutBtn) {
        return;
    }

    logoutBtn.addEventListener(
        "click",
        () => {

            logout();

        }
    );

});


/* ==========================================
   SUPABASE SESSION CHECK
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

    try {

        const {
            data: { session }
        } =
        await window
        .supabaseClient
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

        /* ==========================
           USER NAME
        ========================== */

        const userName =

            session.user
            ?.user_metadata
            ?.full_name ||

            session.user
            ?.user_metadata
            ?.name ||

            session.user
            ?.email ||

            "Admin User";

        const userNameElement =
            document.getElementById(
                "logged-user-name"
            );

        if (
            userNameElement
        ) {

            userNameElement.textContent =
                userName;
        }

        /* ==========================
           USER AVATAR
        ========================== */

        const avatarElement =
            document.getElementById(
                "user-avatar"
            );

        if (
            avatarElement
        ) {

            const avatarUrl =

                session.user
                ?.user_metadata
                ?.avatar_url ||

                `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=ffffff&color=0d6efd`;

            avatarElement.src =
                avatarUrl;
        }

        /* ==========================
           ONLINE STATUS
        ========================== */

        const statusText =
            document.getElementById(
                "user-status-text"
            );

        const statusContainer =
            document.querySelector(
                ".user-status"
            );

        if (
            statusText &&
            statusContainer
        ) {

            statusText.textContent =
                "Online";

            statusContainer.classList.remove(
                "offline"
            );

            statusContainer.classList.add(
                "online"
            );
        }

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


/* ==========================================
   LOGOUT FUNCTION
========================================== */

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


/* ==========================================
   SIDEBAR ACTIVE STATE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar a"
        );

    let selectedLink =
        null;

    sidebarLinks.forEach(
        link => {

        link.addEventListener(
            "mouseenter",
            () => {

            sidebarLinks.forEach(
                item => {

                if (
                    item !== selectedLink
                ) {

                    item.classList.remove(
                        "active"
                    );
                }

            });

            link.classList.add(
                "active"
            );

        });

        link.addEventListener(
            "mouseleave",
            () => {

            if (
                link !== selectedLink
            ) {

                link.classList.remove(
                    "active"
                );
            }

        });

        link.addEventListener(
            "click",
            () => {

            sidebarLinks.forEach(
                item => {

                item.classList.remove(
                    "active"
                );

            });

            selectedLink =
                link;

            link.classList.add(
                "active"
            );

        });

    });

});
