// ==========================================
// AGRI TRACKER - REGISTER ACCOUNT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const mobile =
            document.getElementById("mobile").value.trim();

        const uniqueNumber =
            document.getElementById("uniqueNumber").value.trim();

        const userId =
            document.getElementById("userId").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!fullName) {
            alert("Please enter Full Name");
            return;
        }

        if (!mobile) {
            alert("Please enter Mobile Number");
            return;
        }

        if (!password) {
            alert("Please enter Password");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            // ==========================================
            // CHECK DUPLICATE MOBILE
            // ==========================================

            const { data: existingMobile } =
                await window.supabaseClient
                    .from("users")
                    .select("mobile")
                    .eq("mobile", mobile);

            if (existingMobile && existingMobile.length > 0) {
                alert("Mobile Number already registered");
                return;
            }

            // ==========================================
            // SAVE USER
            // ==========================================

            const { error } =
                await window.supabaseClient
                    .from("users")
                    .insert([
                        {
                            full_name: fullName,
                            email: email || null,
                            mobile: mobile,
                            unique_number: uniqueNumber || null,
                            user_id: userId || null,
                            password: password,
                            status: "Active"
                        }
                    ]);

            if (error) {
                console.error(error);
                alert("Registration Failed");
                return;
            }

            // ==========================================
            // SUCCESS
            // ==========================================

            alert("Account Created Successfully");

            window.location.href =
                "logincard.html";

        } catch (err) {

            console.error(err);

            alert(
                "Something went wrong. Please try again."
            );
        }

    });

});
