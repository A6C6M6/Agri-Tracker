/* ==========================================
   AGRI PROFILE CARD COMPONENT
   ========================================== */

(function () {

    const agriProfileCardManageBtn =
        document.getElementById("agriProfileCardManageBtn");

    const agriProfileCardSignOutBtn =
        document.getElementById("agriProfileCardSignOutBtn");

    /* ------------------------------------------
       Dynamic Data Binding Example
       Replace with existing user data source
       ------------------------------------------ */

    /*
    document.getElementById("agriProfileCardUserName").textContent =
        currentUser.full_name;

    document.getElementById("agriProfileCardEmail").textContent =
        currentUser.email;

    document.getElementById("agriProfileCardAvatar").src =
        currentUser.avatar_url;
    */

    /* ------------------------------------------
       Manage Account Action
       Existing logic ????? connect ???????
       ------------------------------------------ */

    agriProfileCardManageBtn?.addEventListener(
        "click",
        function () {

            console.log(
                "Agri Profile Card - Manage Account Clicked"
            );

            // Existing Manage Account Logic Here

        }
    );

    /* ------------------------------------------
       Sign Out Action
       Existing logout logic ????? connect ???????
       ------------------------------------------ */

    agriProfileCardSignOutBtn?.addEventListener(
        "click",
        function () {

            console.log(
                "Agri Profile Card - Sign Out Clicked"
            );

            // Existing Sign Out Logic Here

        }
    );

})();