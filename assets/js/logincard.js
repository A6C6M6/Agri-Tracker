document.addEventListener("DOMContentLoaded", () => {
    // Supabase Configuration - Update these values
    const SUPABASE_URL = 'https://icdppzjhqpskmtertrbv.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const loginForm = document.getElementById("agriLoginForm");
    const loginId = document.getElementById("loginId");
    const password = document.getElementById("password");
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    
    // UI Helpers
    const toggleLoading = (isLoading) => {
        loginSubmitBtn.disabled = isLoading;
        loginSubmitBtn.querySelector('.btn-text').textContent = isLoading ? "Authenticating..." : "Login";
        loginSubmitBtn.querySelector('.btn-spinner').style.display = isLoading ? "inline-block" : "none";
    };

    // Password Toggle
    document.getElementById("passwordToggle").addEventListener("click", (e) => {
        const isPassword = password.type === "password";
        password.type = isPassword ? "text" : "password";
        e.target.textContent = isPassword ? "Hide" : "Show";
    });

    // Form Submission
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: pass,
            });

            if (error) throw error;
            window.location.href = "dashboard.html";
        } catch (error) {
            alert("Login Failed: " + error.message);
        } finally {
            toggleLoading(false);
        }
    });

    // Navigation
    document.getElementById("forgotPasswordLink").addEventListener("click", () => window.location.href = "forgot_password.html");
    document.getElementById("registerLink").addEventListener("click", () => window.location.href = "register.html");
});