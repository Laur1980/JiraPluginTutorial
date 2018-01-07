require(['jquery', 'jira/analytics', 'underscore', 'jira/util/data/meta', 'jira/admin/analytics'], function (jQuery, analytics, _, Meta, adminAnalytics) {
    /**
     * Capture some events that better explain how people use JIRA administration in general.
     */
    AJS.toInit(function (jQuery) {
        var activeTab = Meta.get('admin.active.tab');

        _.defer(function () {
            adminAnalytics.bindEvents();

            if (activeTab === "view_project_workflows") {
                adminAnalytics.sendLoadWorkflowsTabEvent();
            }

            if (jQuery("#edit-issue-type-scheme-form").length && jQuery("input[name=schemeId]").val()) {
                analytics.send({
                    name: "administration.issuetypeschemes.viewed.global"
                });
            }
        });
    });
});