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

const forgotPasswordLink =
    document.getElementById("forgotPasswordLink");

const registerLink =
    document.getElementById("registerLink");

function validateLoginId() {

    const value = loginId.value.trim();

    if (value === "") {

        loginIdError.textContent =
            "Login ID is required.";

        loginId.classList.add("error");

        return false;
    }

    loginIdError.textContent = "";
    loginId.classList.remove("error");

    return true;
}

function validatePassword() {

    const value = password.value.trim();

    if (value === "") {

        passwordError.textContent =
            "Password is required.";

        password.classList.add("error");

        return false;
    }

    passwordError.textContent = "";
    password.classList.remove("error");

    return true;
}

function validateForm() {

    return (
        validateLoginId() &&
        validatePassword()
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

passwordToggle.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        passwordToggle.textContent = "Hide";

    } else {

        password.type = "password";
        passwordToggle.textContent = "Show";

    }

});

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    loginSubmitBtn.disabled = true;

    btnText.textContent =
        "Authenticating...";

    btnSpinner.style.display =
        "inline-block";

    setTimeout(() => {

        btnText.textContent = "Login";

        btnSpinner.style.display = "none";

        loginSubmitBtn.disabled = false;

        window.location.href =
            "dashboard.html";

    }, 1500);

});

/* ==========================================================
   FORGOT PASSWORD CONFIGURATION
   ========================================================== */

const FORGOT_PASSWORD_URL = "forgot_password.html";

/* ==========================================================
   FORGOT PASSWORD EVENT
   ========================================================== */

forgotPasswordLink.addEventListener(
    "click",
    () => {

        if (
            FORGOT_PASSWORD_URL.trim() === ""
        ) {

            window.location.href =
    "assets/image/agritracker_Login_BackGround.png";

            return;
        }

        window.location.href =
            FORGOT_PASSWORD_URL;

    }
);

/* ==========================================================
   REGISTER EVENT
   ========================================================== */

registerLink.addEventListener(
    "click",
    () => {

        window.location.href =
            "register.html";

    }
);


});
