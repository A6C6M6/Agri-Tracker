// Route Registry - ????? ?????? ?????? ??? ????????
const routeRegistry = {
    dashboard: "dashboard.html",
    overview: "", // Placeholder
    crops: "pages/crops.html",
    fields: ""
};

/**
 * Enterprise Route Guard
 * ??? ?????? ???????? ???????????? ??????????.
 */
function navigateTo(moduleKey) {
    const route = routeRegistry[moduleKey];

    if (route && route !== "") {
        // Valid Route: Redirect
        window.location.href = route;
    } else {
        // Invalid Route: Show Toast
        showEnterpriseToast("Module will be integrated soon");
    }
}

// Enterprise Toast Notification System
function showEnterpriseToast(message) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-5 right-5 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}