javascript
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

