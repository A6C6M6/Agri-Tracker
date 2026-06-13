(function() {
    const loginForm = document.getElementById('agriLoginForm');
    const loginId = document.getElementById('loginId');
    const password = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('loginSubmitBtn');

    function agriLoginCardValidateLoginId() {
        if (!loginId.value.trim()) {
            document.getElementById('loginIdError').textContent = "Please enter your Login ID.";
            return false;
        }
        document.getElementById('loginIdError').textContent = "";
        return true;
    }

    function agriLoginCardValidatePassword() {
        if (!password.value.trim()) {
            document.getElementById('passwordError').textContent = "Please enter your Password.";
            return false;
        }
        document.getElementById('passwordError').textContent = "";
        return true;
    }

    function agriLoginCardValidateForm() {
        const isIdValid = agriLoginCardValidateLoginId();
        const isPassValid = agriLoginCardValidatePassword();
        return isIdValid && isPassValid;
    }

    function agriLoginCardTogglePassword() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        passwordToggle.textContent = type === 'password' ? 'Show' : 'Hide';
    }

    function agriLoginCardHandleLogin(e) {
        e.preventDefault();
        if (!agriLoginCardValidateForm()) return;

        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = "Authenticating...";
        submitBtn.querySelector('.btn-spinner').style.display = "inline-block";

        setTimeout(() => {
            // TODO:
            // Replace with actual authentication API integration

            window.location.href = "index.html";
        }, 1500);
    }

    function agriLoginCardShowMessage(msg) {
        alert(msg);
    }

    document.addEventListener("DOMContentLoaded", () => {
        loginForm.addEventListener('submit', agriLoginCardHandleLogin);
        passwordToggle.addEventListener('click', agriLoginCardTogglePassword);
        
        document.getElementById('forgotPasswordLink').addEventListener('click', () => 
            agriLoginCardShowMessage("Password recovery module will be integrated soon."));
            
        document.getElementById('registerLink').addEventListener('click', () => 
            agriLoginCardShowMessage("Registration module will be integrated soon."));

        loginId.addEventListener('blur', agriLoginCardValidateLoginId);
        password.addEventListener('blur', agriLoginCardValidatePassword);
    });
})();