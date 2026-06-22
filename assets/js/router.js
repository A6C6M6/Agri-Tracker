javascript
/*
==================================================
router.js
Centralized Navigation Router
==================================================

Purpose:
- Read routes from APP_CONFIG.MODULES
- Centralize navigation logic
- Keep existing functionality unchanged
- No changes to Business Logic
- No changes to API / Database behavior
==================================================
*/

(function (window) {

    "use strict";

    /**
     * Get all configured module routes
     */
    function getModules() {

        return (
            window.APP_CONFIG?.MODULES || {}
        );

    }

    /**
     * Get route URL by module name
     */
    function getRoute(moduleName) {

        const modules =
            getModules();

        return modules[moduleName] || null;

    }

    /**
     * Check if module exists
     */
    function hasRoute(moduleName) {

        return !!getRoute(moduleName);

    }

    /**
     * Navigate to module page
     */
    function navigate(moduleName) {

        const route =
            getRoute(moduleName);

        if (!route) {

            console.warn(
                `[Router] Route not found: ${moduleName}`
            );

            return false;

        }

        window.location.href =
            route;

        return true;

    }

    /**
     * Get default page
     */
    function getDefaultPage() {

        return (
            window.APP_CONFIG?.DEFAULT_PAGE ||
            "dashboard.html"
        );

    }

    /**
     * Navigate to default page
     */
    function goHome() {

        window.location.href =
            getDefaultPage();

    }

    /**
     * Current page filename
     */
    function getCurrentPage() {

        const path =
            window.location.pathname;

        return path.substring(
            path.lastIndexOf("/") + 1
        );

    }

    /**
     * Check active page
     */
    function isCurrentPage(moduleName) {

        const route =
            getRoute(moduleName);

        if (!route) {
            return false;
        }

        return (
            getCurrentPage() === route
        );

    }

    /**
     * Get all routes
     */
    function getAllRoutes() {

        return {
            ...getModules()
        };

    }

    /**
     * Public API
     */
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

