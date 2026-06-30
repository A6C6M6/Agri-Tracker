/* ==========================
   Sidebar Toggle
========================== */

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const sidebar = document.querySelector(".sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
});

/* ==========================
   Session Validation
========================== */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!window.supabaseClient) return;
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.replace("logincard.html");
            return;
        }
    } catch (error) {
        console.error("Session Error:", error);
        window.location.replace("logincard.html");
    }
});

/* ==========================
   Logout Function
========================== */

async function logout() {
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
    } catch (error) {
        console.error("Logout Error:", error);
    }
    window.location.replace("logincard.html");
}

/* ==========================
   Person Master Redirection
========================== */

function redirectToPersonMaster() {
    window.location.href = "settings-person-master.html";
}

/* ==========================
   Placeholders for other modules
========================== */

function addItem() { console.log("Add Item"); }
function editItem() { console.log("Edit Item"); }
function viewItemList() { console.log("View Item List"); }

function generateReports() { console.log("Generate Reports"); }
function scheduleReports() { console.log("Schedule Reports"); }

/* ==========================
   Initialize Dynamic Cards
========================== */

document.addEventListener("DOMContentLoaded", renderSettingsCards);

/* Settings ലിങ്ക് Dashboard-ലേക്ക് മാറ്റുന്നു
*/

document.addEventListener("DOMContentLoaded", () => {
    const settingsLink = document.querySelector('.menu a[href="settings.html"]');
    if (settingsLink) {
        settingsLink.setAttribute('href', 'dashboard.html');
        const span = settingsLink.querySelector('span');
        if (span) span.textContent = 'Dashboard';
    }
});
