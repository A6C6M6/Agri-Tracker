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
                await window.supabaseClient.auth
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