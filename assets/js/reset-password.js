const SUPABASE_URL =
"https://icdppzjhqpskmtertrbv.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_4wk7hLvO7ZYE5Xo2j-K1Iw_ja4Pu5RZ";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const updateBtn =
        document.getElementById(
            "updateBtn"
        );

        updateBtn.addEventListener(
            "click",
            async () => {

                const newPassword =
                document.getElementById(
                    "newPassword"
                ).value.trim();

                if (!newPassword) {

                    alert(
                        "Please enter new password."
                    );

                    return;
                }

                const { error } =
                await supabaseClient.auth
                .updateUser({

                    password:
                    newPassword

                });

                if (error) {

                    alert(
                        error.message
                    );

                    return;
                }

                alert(
                    "Password updated successfully."
                );

                window.location.href =
                "logincard.html";

            }
        );

    }
);
