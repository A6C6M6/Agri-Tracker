document
.getElementById("resetBtn")
.addEventListener(
"click",
async () => {

    const email =
    document.getElementById(
        "email"
    ).value.trim();

    if (!email) {

        alert(
            "Please enter email address."
        );

        return;
    }

    const { error } =
    await window.supabaseClient
    .auth
    .resetPasswordForEmail(
        email,
        {
            redirectTo:
            "https://a6c6m6.github.io/Agri-Tracker/reset-password.html"
        }
    );

    if (error) {

        alert(error.message);
        return;
    }

    alert(
        "Password reset link sent successfully."
    );

}

);