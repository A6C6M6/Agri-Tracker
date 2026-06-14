(function() {
    // Supabase client initialization
    // Please replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your actual project credentials
    const supabase = window.supabase.createClient('https://icdppzjhqpskmtertrbv.supabase.co', 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ');
    
    const loginForm = document.getElementById('agriLoginForm');
    const loginId = document.getElementById('loginId');
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const passwordToggle = document.getElementById('passwordToggle');

    // Validation
    function agriLoginCardValidateForm() {
        let isValid = true;
        if (!loginId.value.trim()) {
            document.getElementById('loginIdError').textContent = "Please enter your Login ID.";
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

    // Login Handler
    loginForm.addEventListener('submit', async (e) => {
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
            window.location.href = "dashboard.html";
        }
    });

    // Password Toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            passwordToggle.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    }
})();
