document.addEventListener("DOMContentLoaded", () => {

```
const form = document.getElementById("agriLoginForm");
const loginId = document.getElementById("loginId");
const password = document.getElementById("password");
const submitBtn = document.getElementById("loginSubmitBtn");
const passwordToggle = document.getElementById("passwordToggle");

passwordToggle.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        passwordToggle.textContent = "Hide";
    } else {
        password.type = "password";
        passwordToggle.textContent = "Show";
    }

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = loginId.value.trim();
    const pass = password.value.trim();

    if (!email || !pass) {
        alert("Please enter Email and Password");
        return;
    }

    submitBtn.disabled = true;

    const btnText = submitBtn.querySelector(".btn-text");
    const spinner = submitBtn.querySelector(".btn-spinner");

    btnText.textContent = "Authenticating...";
    spinner.style.display = "inline-block";

    try {

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: email,
                password: pass
            });

        if (error) throw error;

        console.log("Login Success", data);

        window.location.href = "dashboard.html";

    } catch (err) {

        console.error(err);

        alert("Login Failed: " + err.message);

        submitBtn.disabled = false;
        btnText.textContent = "Login";
        spinner.style.display = "none";
    }

});
```

});
