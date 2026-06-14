// logincard.js-ലെ ഈ ഭാഗം ശ്രദ്ധിക്കുക
async function agriLoginCardHandleLogin(e) {
    e.preventDefault(); // ഇതാണ് ഏറ്റവും പ്രധാനം! ഇത് പേജ് റീലോഡ് ആകുന്നത് തടയും.
    
    if (!agriLoginCardValidateForm()) return;

    // UI മാറ്റുന്നു
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = "Authenticating...";
    // Spinner ഉണ്ടെങ്കിൽ അത് കാണിക്കാൻ
    if(submitBtn.querySelector('.btn-spinner')) {
        submitBtn.querySelector('.btn-spinner').style.display = "inline-block";
    }

    try {
        // Supabase ഉപയോഗിച്ചുള്ള ലോഗിൻ
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginId.value.trim(), 
            password: password.value.trim(),
        });

        if (error) throw error;

        // വിജയിച്ചാൽ ഡാഷ്‌ബോർഡിലേക്ക്
        window.location.href = "dashboard.html";

    } catch (err) {
        alert("Login Failed: " + err.message);
        
        // ബട്ടൺ തിരികെ പഴയ രീതിയിൽ ആക്കുന്നു
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = "Login";
        if(submitBtn.querySelector('.btn-spinner')) {
            submitBtn.querySelector('.btn-spinner').style.display = "none";
        }
    }
}
