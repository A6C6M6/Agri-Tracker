/* =====================================================
   ?? PURPLE SECTION
   API & External Services
===================================================== */

/*
Supabase Client:
window.supabaseClient

External Service:
Supabase Database
*/


/* =====================================================
   ?? BROWN SECTION
   Database Structure
===================================================== */

/*
Table Name:
users

Columns Used:
full_name
email
mobile
password
status

Data Flow:
Register Form
    ?
Validation
    ?
Duplicate Mobile Check
    ?
Insert User
    ?
Success Redirect
*/


/* =====================================================
   ? BLACK SECTION
   Security & Validation
===================================================== */

/*
Validation Rules:
? Full Name Required
? Mobile Number Required
? Password Required
? Password Match Required

Error Handling:
? Try Catch
? Registration Error Alert
? Duplicate Mobile Alert

Authentication:
Custom User Registration

Authorization:
Handled After Login
*/


/* =====================================================
   ?? RED SECTION
   Navigation & Redirects
===================================================== */

/*
Success Redirect:
logincard.html
*/


/* =====================================================
   ?? FUNCTION SECTION
===================================================== */

/**
 * Function Name : DOMContentLoaded
 * Purpose       : Initialize Registration Page
 */
document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    /**
     * Function Name : Register Form Submit
     * Purpose       : Validate & Register User
     */
    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        /* =====================================================
           ? WHITE SECTION
           Input Value Collection
        ===================================================== */

        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const mobile =
            document.getElementById("mobile").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        /* =====================================================
           ? BLACK SECTION
           Validation Rules
        ===================================================== */

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

            /* =====================================================
               ?? BROWN SECTION
               Duplicate Mobile Check
            ===================================================== */

            const { data: existingMobile } =
                await window.supabaseClient
                    .from("users")
                    .select("mobile")
                    .eq("mobile", mobile);

            if (existingMobile && existingMobile.length > 0) {
                alert("Mobile Number already registered");
                return;
            }


            /* =====================================================
               ?? PURPLE SECTION
               Save User To Supabase
            ===================================================== */

            const { error } =
                await window.supabaseClient
                    .from("users")
                    .insert([
                        {
                            full_name: fullName,
                            email: email || null,
                            mobile: mobile,
                            password: password,
                            status: "Active"
                        }
                    ]);

            if (error) {
                console.error(error);
                alert("Registration Failed");
                return;
            }


            /* =====================================================
               ?? RED SECTION
               Success Redirect
            ===================================================== */

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