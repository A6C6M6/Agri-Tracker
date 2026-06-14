// Supabase ക്ലയന്റ് ഇവിടെ ഡിക്ലയർ ചെയ്യുക (നിങ്ങളുടെ URL, Key എന്നിവ ചേർക്കുക)
const supabase = supabase.createClient('https://icdppzjhqpskmtertrbv.supabase.co', 'sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ');

// ... (മറ്റ് ഫംഗ്‌ഷനുകൾ)

async function agriLoginCardHandleLogin(e) {
    e.preventDefault();
    if (!agriLoginCardValidateForm()) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = "Authenticating...";
    submitBtn.querySelector('.btn-spinner').style.display = "inline-block";

    // Supabase ലോഗിൻ
    const { data, error } = await supabase.auth.signInWithPassword({
        email: loginId.value,
        password: password.value,
    });

    if (error) {
        alert("Login Failed: " + error.message);
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = "Login";
        submitBtn.querySelector('.btn-spinner').style.display = "none";
    } else {
        // ലോഗിൻ വിജയിച്ചു - dashboard.html ലേക്ക് പോകുക
        window.location.href = "dashboard.html"; 
    }
}
