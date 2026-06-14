(function() {
    const supabase = window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
    
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
