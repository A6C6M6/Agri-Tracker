const agriPasswordToggle =
    document.getElementById("agriPasswordToggle");

const agriPasswordInput =
    document.getElementById("agriPassword");

const agriLoginForm =
    document.getElementById("agriLoginCardForm");

const agriForgotPasswordLink =
    document.getElementById("agriForgotPasswordLink");

const agriForgotPasswordMessage =
    document.getElementById("agriForgotPasswordMessage");

const agriRegisterButton =
    document.getElementById("agriRegisterButton");

agriPasswordToggle.addEventListener("click", function () {

    if (agriPasswordInput.type === "password") {

        agriPasswordInput.type = "text";

    } else {

        agriPasswordInput.type = "password";
    }
});

agriForgotPasswordLink.addEventListener("click", function (e) {

    e.preventDefault();

    agriForgotPasswordMessage.textContent =
        "Forgot Password feature is currently not available. Code update pending.";
});

agriLoginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let agriValid = true;

    const agriLoginId =
        document.getElementById("agriLoginId");

    const agriPassword =
        document.getElementById("agriPassword");

    const agriLoginIdError =
        document.getElementById("agriLoginIdError");

    const agriPasswordError =
        document.getElementById("agriPasswordError");

    agriLoginIdError.textContent = "";
    agriPasswordError.textContent = "";

    if (agriLoginId.value.trim() === "") {

        agriLoginIdError.textContent =
            "Login ID is required";

        agriValid = false;
    }

    if (agriPassword.value.trim() === "") {

        agriPasswordError.textContent =
            "Password is required";

        agriValid = false;
    }

    if (!agriValid) {
        return;
    }

    /*
    ===================================================
    EXISTING AUTHENTICATION LOGIC HERE
    DO NOT MODIFY EXISTING LOGIN FUNCTION
    ===================================================
    */

    console.log("Login validation success");

    /*
    Placeholder Redirect
    Replace only if required
    Existing login flow should remain unchanged
    */

    // window.location.href = "dashboard.html";
});

agriRegisterButton.addEventListener("click", function () {

    /*
    Placeholder Navigation
    Keep existing routing unchanged
    */

    // window.location.href = "register.html";

    console.log("Navigate to Registration Page");
});