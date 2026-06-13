document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if(!username || !password){
            alert("Please enter login details");
            return;
        }

        alert("Login Successful");

        // Dashboard Redirect
        // window.location.href = "dashboard.html";
    });

});

function registerAccount(){
    alert("Register page coming soon");
}