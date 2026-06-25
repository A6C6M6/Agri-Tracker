/* ==========================
   Sidebar Toggle
========================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const toggleBtn =
            document.getElementById(
                "toggleBtn"
            );

        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        if (
            toggleBtn &&
            sidebar
        ) {

            toggleBtn.addEventListener(
                "click",
                () => {

                    sidebar.classList.toggle(
                        "collapsed"
                    );

                }
            );

        }

    }
);


/* ==========================
   Session Validation
========================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            if (
                !window.supabaseClient
            ) {
                return;
            }

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

        }
        catch (error) {

            console.error(
                "Session Error:",
                error
            );

            window.location.replace(
                "logincard.html"
            );

        }

    }
);


/* ==========================
   Logout Function
========================== */

async function logout() {

    try {

        if (
            window.supabaseClient
        ) {

            await window
                .supabaseClient
                .auth
                .signOut();

        }

    }
    catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }

    window.location.replace(
        "logincard.html"
    );

}


/* ==========================
   Logout Button Binding
========================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const logoutBtn =
            document.querySelector(
                ".logout-btn"
            );

        if (
            logoutBtn
        ) {

            logoutBtn.addEventListener(
                "click",
                logout
            );

        }

    }
);


/* ==========================
   Dashboard Menu Highlight
========================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const dashboardLink =
            document.querySelector(
                '.menu a[href="dashboard.html"]'
            );

        if (
            dashboardLink
        ) {

            dashboardLink.classList.add(
                "active-menu"
            );

        }

    }
);


/* ==========================
   Dynamic Settings Cards
========================== */

const settingsCards = [

    {
        iconColor: "green",
        icon: "fa-user",
        title: "Person Master",
        description:
            "Add, edit and manage persons information",

        buttons: [
            {
                text: "Add Person",
                icon: "fa-plus",
                class: "green-btn"
            },
            {
                text: "Edit Person",
                icon: "fa-pen",
                class: "blue-btn"
            },
            {
                text: "View List",
                icon: "fa-list",
                class: "green-btn"
            }
        ]
    },

    {
        iconColor: "yellow",
        icon: "fa-box",
        title: "Item Master",
        description:
            "Add, edit and manage items information",

        buttons: [
            {
                text: "Add Item",
                icon: "fa-plus",
                class: "green-btn"
            },
            {
                text: "Edit Item",
                icon: "fa-pen",
                class: "blue-btn"
            },
            {
                text: "View List",
                icon: "fa-list",
                class: "green-btn"
            }
        ]
    },

    {
        iconColor: "blue",
        icon: "fa-house",
        title: "Village Master",
        description:
            "Add and manage village information",

        buttons: [
            {
                text: "Add Village",
                icon: "fa-plus",
                class: "green-btn"
            },
            {
                text: "Edit Village",
                icon: "fa-pen",
                class: "blue-btn"
            },
            {
                text: "View List",
                icon: "fa-list",
                class: "green-btn"
            }
        ]
    },

    {
        iconColor: "purple",
        icon: "fa-location-dot",
        title: "Ward Master",
        description:
            "Add and manage ward information",

        buttons: [
            {
                text: "Add Ward",
                icon: "fa-plus",
                class: "green-btn"
            },
            {
                text: "Edit Ward",
                icon: "fa-pen",
                class: "blue-btn"
            },
            {
                text: "View List",
                icon: "fa-list",
                class: "green-btn"
            }
        ]
    },

    {
        iconColor: "green",
        icon: "fa-seedling",
        title: "Crop Master",
        description:
            "Add and manage crop information",

        buttons: [
            {
                text: "Add Crop",
                icon: "fa-plus",
                class: "green-btn"
            },
            {
                text: "Edit Crop",
                icon: "fa-pen",
                class: "blue-btn"
            },
            {
                text: "View List",
                icon: "fa-list",
                class: "green-btn"
            }
        ]
    },

    {
        iconColor: "orange",
        icon: "fa-users",
        title: "User Management",
        description:
            "Add users and manage user accounts",

        buttons: [
            {
                text: "Add User",
                icon: "fa-plus",
                class: "green-btn"
            },
            {
                text: "Edit User",
                icon: "fa-pen",
                class: "blue-btn"
            },
            {
                text: "View List",
                icon: "fa-list",
                class: "green-btn"
            }
        ]
    }

];


/* ==========================
   Render Settings Cards
========================== */

function renderSettingsCards() {

    const container =
        document.getElementById(
            "settingsCardContainer"
        );

    if (!container) return;

    container.innerHTML =
        settingsCards.map(card => `

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

                    <button
                        class="btn ${btn.class}">

                        <i class="fa-solid ${btn.icon}"></i>
                        ${btn.text}

                    </button>

                `).join("")}

            </div>

        </div>

        `).join("");

}


/* ==========================
   Initialize Dynamic Cards
========================== */

document.addEventListener(
    "DOMContentLoaded",
    renderSettingsCards
);
