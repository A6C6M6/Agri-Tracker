(function() {
    const supabase = window.supabase.createClient('https://icdppzjhqpskmtertrbv.supabase.co', 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ');
    
    const loginForm = document.getElementById('agriLoginForm');
    const loginId = document.getElementById('loginId');
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('loginSubmitBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.textContent = "Authenticating...";

        const { error } = await supabase.auth.signInWithPassword({
            email: loginId.value,
            password: password.value,
        });

        if (error) {
            alert(error.message);
            submitBtn.textContent = "Login";
        } else {
            window.location.href = "dashboard.html";
        }
    });
})();
