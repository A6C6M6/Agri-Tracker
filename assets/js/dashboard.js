document.addEventListener("DOMContentLoaded", async () => {


try {

    // User Session Check
    const {
        data: { user }
    } = await window.supabaseClient.auth.getUser();

    if (!user) {
        window.location.href = "logincard.html";
        return;
    }

    // Logout Button
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            await window.supabaseClient.auth.signOut();

            window.location.href = "logincard.html";

        });

    }

} catch (err) {

    console.error(err);

    window.location.href = "logincard.html";

}


});
