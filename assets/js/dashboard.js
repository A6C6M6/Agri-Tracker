javascript
document.addEventListener(
    "DOMContentLoaded",
    async () => {

    try {

        const {
            data: { session }
        } =
        await window.supabaseClient
        .auth
        .getSession();

        if (!session) {

            window.location.replace(
                "logincard.html"
            );

            return;
        }

        console.log(
            "Logged In User:",
            session.user.email
        );

    }
    catch(error){

        console.error(
            "Session Error:",
            error
        );

        window.location.replace(
            "logincard.html"
        );

    }

});

async function logout(){

    try{

        await window
        .supabaseClient
        .auth
        .signOut();

    }
    catch(error){

        console.error(
            "Logout Error:",
            error
        );

    }

    window.location.replace(
        "logincard.html"
    );

}

