const form =
document.getElementById("registerForm");

const messageBox =
document.getElementById("formMessage");

form.addEventListener(
"submit",
async function (event) {


event.preventDefault();

const fullName =
document.getElementById("fullName")
.value.trim();

const email =
document.getElementById("email")
.value.trim();

const mobile =
document.getElementById("mobile")
.value.trim();

const password =
document.getElementById("password")
.value;

const confirmPassword =
document.getElementById("confirmPassword")
.value;

messageBox.textContent = "";
messageBox.className = "form-message";

if (
    !fullName ||
    !mobile ||
    !password ||
    !confirmPassword
) {

    messageBox.textContent =
    "Please fill all required fields.";

    return;
}

if (password !== confirmPassword) {

    messageBox.textContent =
    "Passwords do not match.";

    return;
}

try {

    /* ---------------------------
       STEP 1
       Create Auth User
    ---------------------------- */

    const {
        data: authData,
        error: authError
    } =
    await window.supabaseClient
    .auth
    .signUp({

        email: email,
        password: password

    });

    if (authError) {

        messageBox.textContent =
        authError.message;

        return;
    }

    /* ---------------------------
       STEP 2
       Save Additional Data
    ---------------------------- */

    const {
        error: insertError
    } =
    await window.supabaseClient
    .from("users")
    .insert([

        {
            full_name: fullName,
            email: email,
            mobile: mobile
        }

    ]);

    if (insertError) {

        console.error(insertError);
    }

    messageBox.textContent =
    "Registration successful. Please check your email.";

    messageBox.style.color =
    "green";

    setTimeout(() => {

        window.location.href =
        "logincard.html";

    }, 2000);

}

catch (error) {

    console.error(error);

    messageBox.textContent =
    "Registration failed.";

}


});
