document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("agriLoginForm");
    const loginId = document.getElementById("loginId");
    const password = document.getElementById("password");

    const loginIdError = document.getElementById("loginIdError");
    const passwordError = document.getElementById("passwordError");

    const passwordToggle = document.getElementById("passwordToggle");

    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const btnText = loginSubmitBtn.querySelector(".btn-text");
    const btnSpinner = loginSubmitBtn.querySelector(".btn-spinner");

    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const registerLink = document.getElementById("registerLink");

    /* ==========================================
       VALIDATION FUNCTIONS
    ========================================== */

    function agriLoginCardValidateLoginId() {

        const value = loginId.value.trim();

        if (value === "") {

            loginIdError.textContent = "Login ID is required.";
            loginId.classList.add("error");

            return false;
        }

        loginIdError.textContent = "";
        loginId.classList.remove("error");

        return true;
    }

    function agriLoginCardValidatePassword() {

        const value = password.value.trim();

        if (value === "") {

            passwordError.textContent = "Password is required.";
            password.classList.add("error");

            return false;
        }

        passwordError.textContent = "";
        password.classList.remove("error");

        return true;
    }

    function agriLoginCardValidateForm() {

        const isLoginIdValid =
            agriLoginCardValidateLoginId();

        const isPasswordValid =
            agriLoginCardValidatePassword();

        return (
            isLoginIdValid &&
            isPasswordValid
        );
    }

    /* ==========================================
       BLUR VALIDATION
    ========================================== */

    loginId.addEventListener(
        "blur",
        agriLoginCardValidateLoginId
    );

    password.addEventListener(
        "blur",
        agriLoginCardValidatePassword
    );

    /* ==========================================
       PASSWORD TOGGLE
    ========================================== */

    passwordToggle.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";
            passwordToggle.textContent = "Hide";

        } else {

            password.type = "password";
            passwordToggle.textContent = "Show";
        }

    });

    /* ==========================================
       LOGIN SUBMIT
    ========================================== */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const isValid =
            agriLoginCardValidateForm();

        if (!isValid) {
            return;
        }

        loginSubmitBtn.disabled = true;

        btnText.textContent = "Authenticating...";
        btnSpinner.style.display = "inline-block";

        setTimeout(() => {

            btnText.textContent = "Login";
            btnSpinner.style.display = "none";

            window.location.href = "dashboard.html";

        }, 1500);

    });

    /* ==========================================
       FORGOT PASSWORD
    ========================================== */

    forgotPasswordLink.addEventListener("click", () => {

        alert(
            "Password recovery module will be integrated soon."
        );

    });

    /* ==========================================
       REGISTER
    ========================================== */

    registerLink.addEventListener("click", () => {

        alert(
            "Registration module will be integrated soon."
        );

    });

});