(function() {
    // Supabase Initialization
    const supabaseUrl = 'https://icdppzjhqpskmtertrbv.supabase.co';
    const supabaseKey = 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const loginForm = document.getElementById('agriLoginForm');
    const loginId = document.getElementById('loginId');
    const password = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('loginSubmitBtn');

    // Validation Functions
    function agriLoginCardValidateForm() {
        let isValid = true;
        if (!loginId.value.trim()) {
            document.getElementById('loginIdError').textContent = "Please enter your Email.";
            isValid = false;
        } else {
            document.getElementById('loginIdError').textContent = "";
        }
        
        if (!password.value.trim()) {
            document.getElementById('passwordError').textContent = "Please enter your Password.";
            isValid = false;
        } else {
            document.getElementById('passwordError').textContent = "";
        }
        return isValid;
    }

    // Supabase Login Handler
    async function agriLoginCardHandleLogin(e) {
        e.preventDefault();
        if (!agriLoginCardValidateForm()) return;

        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = "Authenticating...";
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginId.value,
            password: password.value,
        });

        if (error) {
            alert("Login Failed: " + error.message);
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = "Login";
        } else {
            alert("Login Successful!");
            window.location.href = "index.html"; // ലോഗിന് ശേഷം പോകേണ്ട പേജ്
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        loginForm.addEventListener('submit', agriLoginCardHandleLogin);
        
        passwordToggle.addEventListener('click', () => {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            passwordToggle.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    });
})();
