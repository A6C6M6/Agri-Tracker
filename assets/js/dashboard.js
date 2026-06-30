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
   NAVIGATION ITEMS & SIDEBAR BUILD
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

document.addEventListener("DOMContentLoaded", () => {
    const navMenu = document.getElementById("nav-menu");
    if (navMenu) {
        navItems.forEach(item => {
            const btn = document.createElement("a");
            btn.href = "#";
            btn.innerHTML = `<i class="fas ${item.icon} mr-3"></i> ${item.name}`;
            btn.className = "flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-100 mb-2";
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                if (item.id === "print") window.print();
                else if (item.id === "downloadJson") { /* Logic maintained */ }
                else if (item.id === "exportData") showToast("Export module will be integrated soon");
                else navigateTo(item.id);
            });
            navMenu.appendChild(btn);
        });
    }

    /* CALENDAR WIDGET */
    const dateElement = document.getElementById("current-date");
    const dayElement = document.getElementById("current-day");
    if (dateElement && dayElement) {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
        dayElement.textContent = now.toLocaleDateString("en-GB", { weekday: "long" });
    }

    /* LOGOUT BUTTON */
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => logout());
    }

    /* SIDEBAR TOGGLE LOGIC (HAMBURGER) */
    const headerHamburger = document.querySelector('.header-left i.fa-bars');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (headerHamburger && sidebar && mainContent) {
        headerHamburger.style.cursor = "pointer";
        headerHamburger.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
});

/* ==========================================
   SUPABASE SESSION & AUTH
========================================== */
async function logout(){
    try { await window.supabaseClient.auth.signOut(); }
    catch(error) { console.error("Logout Error:", error); }
    window.location.replace("logincard.html");
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) { window.location.replace("logincard.html"); return; }
        
        const userName = session.user?.user_metadata?.full_name || session.user?.email || "Admin User";
        const userNameElement = document.getElementById("logged-user-name");
        if (userNameElement) userNameElement.textContent = userName;

        const avatarElement = document.getElementById("user-avatar");
        if (avatarElement) avatarElement.src = session.user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
    } catch(error) {
        window.location.replace("logincard.html");
    }
});


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
        name: "🏡 Farm Management",
        id: "farmManagement",
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
========================== */

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

/* ==========================================
   SIDEBAR HIDE/RESTORE (Hamburger toggle)
   - Preserves existing behavior and state (collapsed)
   - No changes to business logic / API / DB
   - Adds small UI-only behavior that hides sidebar and expands main-content full-width
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  try {
    const headerHamburger = document.querySelector('.header-left i.fa-bars') || document.querySelector('.header-left .fa-bars') || null;
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (!headerHamburger || !sidebar || !mainContent) {
      // Nothing to do if elements missing
      return;
    }

    // Helper: store previous values on sidebar.dataset to restore later
    // prevMarginLeft: mainContent previous margin-left (computed)
    if (!sidebar.dataset.prevMarginLeft) {
      const prevMargin = window.getComputedStyle(mainContent).marginLeft || '280px';
      sidebar.dataset.prevMarginLeft = prevMargin;
    }

    // Attach accessible attributes
    headerHamburger.setAttribute('role', 'button');
    headerHamburger.setAttribute('aria-label', 'Toggle sidebar');
    headerHamburger.tabIndex = 0;

    // Click handler
    const toggleHandler = (ev) => {
      ev && ev.preventDefault && ev.preventDefault();

      const isHidden = sidebar.classList.contains('hidden');

      if (!isHidden) {
        // Hide: remember collapsed state and prev margin-left
        sidebar.dataset.wasCollapsed = sidebar.classList.contains('collapsed') ? '1' : '0';
        // store computed main-content margin-left for accurate restore
        const currentMargin = window.getComputedStyle(mainContent).marginLeft || sidebar.dataset.prevMarginLeft || '280px';
        sidebar.dataset.prevMarginLeft = currentMargin;

        // Add 'hidden' marker class (CSS may also define .sidebar.hidden)
        sidebar.classList.add('hidden');

        // Apply inline transform to move sidebar out of view
        sidebar.style.transition = 'transform 240ms ease';
        sidebar.style.transform = 'translateX(-110%)';
        // Optionally collapse visual overflow
        sidebar.style.width = sidebar.offsetWidth + 'px'; // keep width while animating, then hide for focusability
        sidebar.style.overflow = 'hidden';
        // Set main-content to full width by removing left margin
        mainContent.style.transition = 'margin-left 240ms ease';
        mainContent.style.marginLeft = '0px';

        // Remove collapsed class because sidebar is hidden (but remember it)
        sidebar.classList.remove('collapsed');

        // For accessibility, mark as hidden
        sidebar.setAttribute('aria-hidden', 'true');
        headerHamburger.setAttribute('aria-expanded', 'false');

      } else {
        // Restore: remove hidden state, restore transform and margin
        sidebar.classList.remove('hidden');

        // Clear inline transform and width after a small delay to allow class removal if CSS defines animations
        sidebar.style.transform = '';
        sidebar.style.overflow = '';
        // restore main-content margin-left to previous value
        const prevMarginLeft = sidebar.dataset.prevMarginLeft || '';
        if (prevMarginLeft) {
          mainContent.style.marginLeft = prevMarginLeft;
        } else {
          // fallback default
          mainContent.style.marginLeft = '';
        }

        // Restore collapsed state if it was collapsed before hiding
        if (sidebar.dataset.wasCollapsed === '1') {
          sidebar.classList.add('collapsed');
        } else {
          sidebar.classList.remove('collapsed');
        }

        // remove stored flags
        delete sidebar.dataset.wasCollapsed;
        // accessibility
        sidebar.setAttribute('aria-hidden', 'false');
        headerHamburger.setAttribute('aria-expanded', 'true');
      }
    };

    // Click and keyboard handlers
    headerHamburger.addEventListener('click', toggleHandler);
    headerHamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleHandler(e);
      }
    });

    // Ensure that if window is resized, we update stored prevMarginLeft to match responsive CSS
    window.addEventListener('resize', () => {
      if (!sidebar.classList.contains('hidden')) {
        // update stored margin to current computed (in case responsive rules changed it)
        sidebar.dataset.prevMarginLeft = window.getComputedStyle(mainContent).marginLeft || sidebar.dataset.prevMarginLeft || '';
      }
    });

  } catch (err) {
    console.error('Sidebar toggle error:', err);
  }
});
