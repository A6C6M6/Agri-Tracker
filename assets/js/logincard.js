document.addEventListener("DOMContentLoaded", () => {

    // Validate SDK
    if (!window.supabase) {
        console.error("Supabase SDK is not loaded.");
        return;
    }

    if (!window.supabaseClient) {
        console.error("Supabase Client is not initialized.");
        return;
    }

    const supabase = window.supabaseClient;

    const loginForm = document.getElementById("agriLoginForm");
    const loginId = document.getElementById("loginId");
    const password = document.getElementById("password");
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");

    // Loading UI
    const toggleLoading = (isLoading) => {

        if (!loginSubmitBtn) return;

        loginSubmitBtn.disabled = isLoading;

        const btnText =
            loginSubmitBtn.querySelector(".btn-text");

        const spinner =
            loginSubmitBtn.querySelector(".btn-spinner");

        if (btnText) {
            btnText.textContent = isLoading
                ? "Authenticating..."
                : "Login";
        }

        if (spinner) {
            spinner.style.display = isLoading
                ? "inline-block"
                : "none";
        }
    };

    // Password Toggle
    const passwordToggle =
        document.getElementById("passwordToggle");

    if (passwordToggle) {

        passwordToggle.addEventListener("click", (e) => {

            const isPassword =
                password.type === "password";

            password.type = isPassword
                ? "text"
                : "password";

            e.target.textContent = isPassword
                ? "Hide"
                : "Show";

        });

    }

    // Login Submit
    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email = loginId.value.trim();
            const pass = password.value.trim();

            if (!email || !pass) {

                alert("Please fill in all fields.");
                return;

            }

            toggleLoading(true);

            try {

                const { data, error } =
                    await supabase.auth.signInWithPassword({
                        email,
                        password: pass
                    });

                if (error) throw error;

                if (data.session) {

                    console.log("Login Success");
                    console.log(data);

                    window.location.replace(
    window.APP_CONFIG.DEFAULT_PAGE
);

                }

            } catch (error) {

                console.error(
                    "Login Error:",
                    error.message
                );

                alert(
                    "Invalid email or password."
                );

            } finally {

                toggleLoading(false);

            }

        });

    }

    // Forgot Password
    const forgotPasswordLink =
        document.getElementById("forgotPasswordLink");

    if (forgotPasswordLink) {

        forgotPasswordLink.addEventListener(
            "click",
            () => {
                window.location.href =
                    "forgot_password.html";
            }
        );

    }

    // Register
    const registerLink =
        document.getElementById("registerLink");

    if (registerLink) {

        registerLink.addEventListener(
            "click",
            () => {
                window.location.href =
                    "register.html";
            }
        );

    }

});

