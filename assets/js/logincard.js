(function() {
    // Supabase ക്ലയന്റ് സജ്ജമാക്കുക
    const supabase = supabase.createClient('https://icdppzjhqpskmtertrbv.supabase.co', 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ');

    const loginForm = document.getElementById('agriLoginForm');
    const loginId = document.getElementById('loginId');
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('loginSubmitBtn');

    async function agriLoginCardHandleLogin(e) {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = "Authenticating...";

        // Supabase ഉപയോഗിച്ചുള്ള ലോഗിൻ
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginId.value,
            password: password.value,
        });

        if (error) {
            alert("Login Failed: " + error.message);
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = "Login";
        } else {
            // ലോഗിൻ വിജയിച്ചാൽ ഡാഷ്‌ബോർഡിലേക്ക് പോകുക
            window.location.href = "dashboard.html";
        }
    }

    loginForm.addEventListener('submit', agriLoginCardHandleLogin);
})();
