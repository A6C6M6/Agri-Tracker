(function() {
    // 1. സുപ്പബേസ് ക്ലയന്റ് ഇവിടെ ഗ്ലോബൽ ആയി ഡിക്ലയർ ചെയ്യുക
    let supabase;

    // 2. Supabase ലോഡ് ആയോ എന്ന് ഉറപ്പുവരുത്താൻ window.supabase ഉപകരിക്കും
    function initSupabase() {
        if (window.supabase) {
            supabase = window.supabase.createClient('https://icdppzjhqpskmtertrbv.supabase.co', 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ');
        } else {
            console.error("Supabase script not loaded yet!");
        }
    }

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

        // ലോഗിൻ ചെയ്യുന്നതിന് മുൻപ് Supabase ഉണ്ടോ എന്ന് ഉറപ്പുവരുത്തുക
        if (!supabase) {
            initSupabase();
        }

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
            window.location.href = "dashboard.html"; 
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        // Supabase ലോഡ് ആയിക്കഴിഞ്ഞാൽ മാത്രം ഇനിഷ്യലൈസ് ചെയ്യുക
        initSupabase(); 
        
        loginForm.addEventListener('submit', agriLoginCardHandleLogin);
        
        passwordToggle.addEventListener('click', () => {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            passwordToggle.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    });
})();
