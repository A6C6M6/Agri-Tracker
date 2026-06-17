const form = document.getElementById("registerForm");
const messageBox = document.getElementById("formMessage");

form.addEventListener("submit", async (event) => {

```
event.preventDefault();

const fullName =
    document.getElementById("fullName").value.trim();

const email =
    document.getElementById("email").value.trim();

const mobile =
    document.getElementById("mobile").value.trim();

const password =
    document.getElementById("password").value;

const confirmPassword =
    document.getElementById("confirmPassword").value;

messageBox.textContent = "";

if (
    !fullName ||
    !email ||
    !mobile ||
    !password ||
    !confirmPassword
) {
    messageBox.textContent =
        "Please fill all fields.";
    return;
}

if (password !== confirmPassword) {
    messageBox.textContent =
        "Passwords do not match.";
    return;
}

try {

    console.log("Starting signup...");

    const { data, error } =
        await window.supabaseClient.auth.signUp({
            email: email,
            password: password
        });

    console.log("Signup Data:", data);
    console.log("Signup Error:", error);

    if (error) {
        messageBox.textContent =
            error.message;
        return;
    }

    const { error: insertError } =
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

    messageBox.style.color = "green";
    messageBox.textContent =
        "Registration successful. Check your email.";

} catch (err) {

    console.error(err);

    messageBox.textContent =
        "Registration failed.";

}
```

});
