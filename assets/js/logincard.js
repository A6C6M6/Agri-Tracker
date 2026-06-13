document
.getElementById("loginForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    let username =
        document.getElementById("username").value;

    let password =
        document.getElementById("password").value;

    if(username === "" || password === "")
    {
        alert("Please enter login details");
        return;
    }

    alert("Login Successful");

    // Dashboard Redirect
    // window.location.href = "dashboard.html";
});