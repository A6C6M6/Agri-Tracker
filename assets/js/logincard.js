```javascript
(function () {
    document.addEventListener("DOMContentLoaded", () => {

        const loginForm = document.getElementById("agriLoginForm");
        if (!loginForm) return;

        const loginId = document.getElementById("loginId");
        const password = document.getElementById("password");
        const passwordToggle = document.getElementById("passwordToggle");
        const submitBtn = document.getElementById("loginSubmitBtn");

        const loginIdError = document.getElementById("loginIdError");
        const passwordError = document.getElementById("passwordError");

        // ==========================
        // Login ID Validation
        // ==========================
        function validateLoginId() {
            const value = loginId.value.trim();

            if (!value) {
                if (loginIdError) {
                    loginIdError.textContent = "Please enter your Email.";
                }
                return false;
            }

            if (loginIdError) {
                loginIdError.textContent = "";
            }

            return true;
        }

        // ==========================
        // Password Validation
        // ==========================
        function validatePassword() {
            const value = password.value.trim();

            if (!value) {
                if (passwordError) {
                    passwordError.textContent =
                        "Please enter your Password.";
                }
                return false;
            }

            if (passwordError) {
                passwordError.textContent = "";
            }

            return true;
        }

        // ==========================
        // Form Validation
        // ==========================
        function validateForm() {
            const isEmailValid = validateLoginId();
            const isPasswordValid = validatePassword();

            return isEmailValid && isPasswordValid;
        }

        // ==========================
        // Password Toggle
        // ==========================
        function togglePassword() {
            const isPasswordHidden =
                password.getAttribute("type") === "password";

            password.setAttribute(
                "type",
                isPasswordHidden ? "text" : "password"
            );

            if (passwordToggle) {
                passwordToggle.textContent =
                    isPasswordHidden ? "Hide" : "Show";
            }
        }

        // ==========================
        // Loading State
        // ==========================
        function setLoading(isLoading) {

            const btnText =
                submitBtn?.querySelector(".btn-text");

            const spinner =
                submitBtn?.querySelector(".btn-spinner");

            submitBtn.disabled = isLoading;

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
        }

        // ==========================
        // Login Handler
        // ==========================
        async function handleLogin(e) {

            e.preventDefault();

            if (!validateForm()) return;

            setLoading(true);

            try {

                const email = loginId.value.trim();
                const pass = password.value.trim();

                const { error } =
                    await window.supabaseClient
                        .auth
                        .signInWithPassword({
                            email,
                            password: pass
                        });

                if (error) {
                    throw error;
                }

                // Login Success
                window.location.href = "dashboard.html";

            } catch (err) {

                alert(
                    "Login Failed: " +
                    (err.message || "Unknown Error")
                );

                setLoading(false);
            }
        }

        // ==========================
        // Message Handler
        // ==========================
        function showMessage(message) {
            alert(message);
        }

        // ==========================
        // Event Listeners
        // ==========================
        loginForm.addEventListener(
            "submit",
            handleLogin
        );

        if (passwordToggle) {
            passwordToggle.addEventListener(
                "click",
                togglePassword
            );
        }

        loginId.addEventListener(
            "blur",
            validateLoginId
        );

        password.addEventListener(
            "blur",
            validatePassword
        );

        const forgotPasswordLink =
            document.getElementById(
                "forgotPasswordLink"
            );

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener(
                "click",
                () => {
                    showMessage(
                        "Password recovery module will be integrated soon."
                    );
                }
            );
        }

        const registerLink =
            document.getElementById(
                "registerLink"
            );

        if (registerLink) {
            registerLink.addEventListener(
                "click",
                () => {
                    showMessage(
                        "Registration module will be integrated soon."
                    );
                }
            );
        }
    });
})();
```
