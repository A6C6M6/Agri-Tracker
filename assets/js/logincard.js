document.addEventListener("DOMContentLoaded", () => {

```
const form = document.getElementById("agriLoginForm");

// Form ഇല്ലെങ്കിൽ exit
if (!form) return;

const loginId = document.getElementById("loginId");
const password = document.getElementById("password");
const submitBtn = document.getElementById("loginSubmitBtn");
const passwordToggle = document.getElementById("passwordToggle");

// Password Show / Hide
if (passwordToggle && password) {
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

// Login Handler
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = loginId?.value.trim();
    const pass = password?.value.trim();

    if (!email || !pass) {
        alert("Please enter Email and Password");
        return;
    }

    const btnText = submitBtn?.querySelector(".btn-text");
    const spinner = submitBtn?.querySelector(".btn-spinner");

    try {

        submitBtn.disabled = true;

        if (btnText) {
            btnText.textContent = "Authenticating...";
        }

        if (spinner) {
            spinner.style.display = "inline-block";
        }

        const { error } =
            await window.supabaseClient.auth.signInWithPassword({
                email,
                password: pass
            });

        if (error) throw error;

        // Redirect Page
        const REDIRECT_PAGE = "dashboard.html";
        window.location.href = REDIRECT_PAGE;

    } catch (err) {

        alert("Login Failed: " + err.message);

        submitBtn.disabled = false;

        if (btnText) {
            btnText.textContent = "Login";
        }

        if (spinner) {
            spinner.style.display = "none";
        }

    }

});
```

});
