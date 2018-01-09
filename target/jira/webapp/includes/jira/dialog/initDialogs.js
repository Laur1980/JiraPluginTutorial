require(['jira/dialog/init-generic-dialogs', 'jira/dialog/init-dashboard-dialogs', 'jira/dialog/init-non-dashboard-dialogs', 'jira/dialog/init-workflow-transition-dialogs', 'jira/dialog/init-dialog-behaviour', 'jquery'], function (genericDialogs, dashboardDialogs, nonDashboardDialogs, workflowTransitionDialogs, dialogBehaviour, jQuery) {
    'use strict';

    jQuery(function () {
        // Invoke dialog initialisation.
        genericDialogs.init();
        dashboardDialogs.init();
        nonDashboardDialogs.init();
        workflowTransitionDialogs.init();
        dialogBehaviour.init();
    });
});