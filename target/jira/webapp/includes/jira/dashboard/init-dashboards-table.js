require(['jquery', 'jira/tabs/tab-manager', 'jira/dashboard/dashboards-table'], function (jQuery, TabManager, DashboardsTable) {
    "use strict";

    jQuery(function () {
        TabManager.navigationTabs.init({
            customInit: DashboardsTable.init,
            tabParam: "view"
        });
    });
});