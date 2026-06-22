/*
==================================================
router.js
Centralized Navigation Router
==================================================

Purpose:
- Read routes from APP_CONFIG.MODULES
- Centralize navigation logic
- Keep existing functionality unchanged
==================================================
*/

(function (window) {

    "use strict";

    function getModules() {
        return window.APP_CONFIG?.MODULES || {};
    }

    function getRoute(moduleName) {
        return getModules()[moduleName] || null;
    }

    function hasRoute(moduleName) {
        return !!getRoute(moduleName);
    }

    function navigate(moduleName) {

        const route = getRoute(moduleName);

        if (!route) {

            console.warn(
                `[Router] Route not found: ${moduleName}`
            );

            return false;
        }

        window.location.href = route;

        return true;
    }

    function getDefaultPage() {

        return (
            window.APP_CONFIG?.DEFAULT_PAGE ||
            "dashboard.html"
        );

    }

    function goHome() {
        window.location.href = getDefaultPage();
    }

    function getCurrentPage() {

        const path = window.location.pathname;

        return path.substring(
            path.lastIndexOf("/") + 1
        );

    }

    function isCurrentPage(moduleName) {

        const route = getRoute(moduleName);

        if (!route) {
            return false;
        }

        return getCurrentPage() === route;
    }

    function getAllRoutes() {

        return {
            ...getModules()
        };

    }

    window.AppRouter = {

        navigate,
        getRoute,
        hasRoute,
        getModules,
        getAllRoutes,
        getDefaultPage,
        getCurrentPage,
        isCurrentPage,
        goHome

    };

})(window);

