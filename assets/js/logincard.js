(function() {
    // Supabase Initialization
    const supabaseUrl = 'https://icdppzjhqpskmtertrbv.supabase.co ';
    const supabaseKey = 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const loginForm = document.getElementById('agriLoginForm');
    const loginId = document.getElementById('loginId');
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('loginSubmitBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            // ലോഗിൻ വിജയിച്ചാൽ dashboard.html-ലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
            window.location.href = "dashboard.html";
        }
    });
})();
