document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("agriLoginForm");
    const loginId = document.getElementById("loginId");
    const password = document.getElementById("password");
    const submitBtn = document.getElementById("loginSubmitBtn");
    const passwordToggle = document.getElementById("passwordToggle");

    if (passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = "text";
                passwordToggle.textContent = "Hide";
            } else {
                password.type = "password";
                passwordToggle.textContent = "Show";
            }
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = loginId.value.trim();
        const pass = password.value.trim();

        if (!email || !pass) {
            alert("Please enter Email and Password");
            return;
        }

        try {
            submitBtn.disabled = true;

            const btnText = submitBtn.querySelector(".btn-text");
            if (btnText) btnText.textContent = "Authenticating...";

            const { data, error } =
                await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: pass
                });

            if (error) throw error;

            console.log("Login Success", data);

            const REDIRECT_PAGE = "dashboard.html";
               window.location.href = REDIRECT_PAGE;

        } catch (err) {

            console.error(err);
            alert("Login Failed: " + err.message);

            submitBtn.disabled = false;

            const btnText = submitBtn.querySelector(".btn-text");
            if (btnText) btnText.textContent = "Login";
        }
    });

});
