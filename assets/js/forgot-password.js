const SUPABASE_URL =
"https://icdppzjhqpskmtertrbv.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ";

const supabaseClient =
supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

document
.getElementById("resetBtn")
.addEventListener(
"click",
async () => {

    const email =
    document.getElementById(
        "email"
    ).value.trim();

    if (!email) {

        alert(
            "Please enter email address."
        );

        return;
    }

    const { error } =
    await supabaseClient
    .auth
    .resetPasswordForEmail(
        email,
        {
            redirectTo:
            "https://a6c6m6.github.io/Agri-Tracker/reset-password.html"
        }
    );

    if (error) {

        alert(error.message);
        return;
    }

    alert(
        "Password reset link sent successfully."
    );

}

);