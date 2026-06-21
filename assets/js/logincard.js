document.addEventListener("DOMContentLoaded", () => {

    // Validate if SDK and Client are loaded
    if (!window.supabase) {
        console.error("Supabase SDK is not loaded. Please check your CDN link.");
        return;
    }

    if (!window.supabaseClient) {
        console.error("Supabase Client is not initialized. Check supabase-config.js");
        return;
    }

    // Use global client from supabase-config.js
    const supabase = window.supabaseClient;

    const loginForm = document.getElementById("agriLoginForm");
    const loginId = document.getElementById("loginId");
    const password = document.getElementById("password");
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");

    // UI Helpers
    const toggleLoading = (isLoading) => {
        if (!loginSubmitBtn) return;

        loginSubmitBtn.disabled = isLoading;

        const btnText = loginSubmitBtn.querySelector(".btn-text");
        const spinner = loginSubmitBtn.querySelector(".btn-spinner");

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
    const passwordToggle = document.getElementById("passwordToggle");

    if (passwordToggle) {
        passwordToggle.addEventListener("click", (e) => {
            const isPassword = password.type === "password";

            password.type = isPassword
                ? "text"
                : "password";

            e.target.textContent = isPassword
                ? "Hide"
                : "Show";
        });
    }

    // Form Submission
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
                        email: email,
                        password: pass
                    });

                if (error) {
                    throw error;
                }

                if (data.session) {
                    window.location.href = "dashboard.html";
                }

            } catch (error) {

                console.error("Auth Error:", error.message);

                alert(
                    "Invalid email or password. Please try again."
                );

            } finally {

                toggleLoading(false);

            }

        });
    }

    // Navigation
    const forgotPasswordLink =
        document.getElementById("forgotPasswordLink");

    const registerLink =
        document.getElementById("registerLink");

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", () => {
            window.location.href = "forgot_password.html";
        });
    }

    if (registerLink) {
        registerLink.addEventListener("click", () => {
            window.location.href = "register.html";
        });
    }

});