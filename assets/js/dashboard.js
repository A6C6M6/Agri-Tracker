const moduleRoutes = {
    dashboard: "index.html",
    overview: "",
    crops: ""
};

const navItems = [
    {
        name: "Dashboard",
        id: "dashboard",
        icon: "fa-chart-line"
    },
    {
        name: "Overview",
        id: "overview",
        icon: "fa-eye"
    }
];

function showToast(message) {

    const container =
        document.getElementById("toast-container");

    if (!container) return;

    const toast =
        document.createElement("div");

    toast.className =
        "bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg toast";

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {

    const navMenu =
        document.getElementById("nav-menu");

    if (!navMenu) {
        console.error("nav-menu not found");
        return;
    }

    navItems.forEach(item => {

        const btn =
            document.createElement("a");

        btn.href = "#";

        btn.innerHTML =
            `<i class="fas ${item.icon} mr-3"></i>${item.name}`;

        btn.className =
            "flex items-center p-3 rounded-lg cursor-pointer hover:bg-slate-100 mb-2";

        btn.addEventListener("click", (e) => {

            e.preventDefault();

            if (moduleRoutes[item.id]) {

                window.location.href =
                    moduleRoutes[item.id];

            } else {

                showToast(
                    "Module will be integrated soon"
                );
            }
        });

        navMenu.appendChild(btn);
    });

});