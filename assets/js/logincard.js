async function agriLoginCardHandleLogin(e) {
    e.preventDefault();
    if (!agriLoginCardValidateForm()) return;

    // UI മാറ്റുന്നു
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = "Authenticating...";
    submitBtn.querySelector('.btn-spinner').style.display = "inline-block";

    try {
        // Supabase ലോഗിൻ
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginId.value.trim(), // ഇവിടെ നിങ്ങളുടെ loginId എന്നത് ഇമെയിൽ ആണെന്ന് കരുതുന്നു
            password: password.value.trim(),
        });

        if (error) {
            throw error; // error ഉണ്ടെങ്കിൽ catch-ലേക്ക് പോകും
        }

        // ലോഗിൻ വിജയിച്ചാൽ
        alert("Login Successful!");
        window.location.href = "dashboard.html"; // ഡാഷ്‌ബോർഡിലേക്ക് മാറ്റുന്നു

    } catch (err) {
        // ലോഗിൻ പരാജയപ്പെട്ടാൽ
        alert("Login Failed: " + err.message);
        
        // ബട്ടൺ പഴയതുപോലെ ആക്കുന്നു
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = "Login";
        submitBtn.querySelector('.btn-spinner').style.display = "none";
    }
}
