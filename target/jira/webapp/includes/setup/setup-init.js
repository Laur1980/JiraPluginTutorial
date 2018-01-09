// Define dev-mode. Not that we use it.
if (!AJS.isDevMode) {
    AJS.isDevMode = function () {
        "use strict";

        return AJS.Meta.get("dev-mode");
    };
}

// 30 second timeout on all requests by default.
AJS.$.ajaxSetup({ timeout: 30000 });

require(["jquery", "jira/setup/init-setup-page", "jira/setup/setup-mode-view", "jira/setup/setup-account-view", "jira/setup/setup-finishing-layout", "jira/setup/setup-database-view", "jira/setup/setup-license", "jira/setup/setup-tracker"], function ($, initSetupPage, SetupModeView, SetupAccountView, SetupFinishingLayout, SetupDatabaseView, SetupLicense, SetupTracker) {
    "use strict";

    function initSetup() {
        var views = {
            "jira-setup-mode-page": SetupModeView,
            "jira-setup-account-page": SetupAccountView,
            "jira-setup-finishing-page": SetupFinishingLayout,
            "jira-setup-database-page": SetupDatabaseView
        };

        $.each(views, function (classname, ViewClass) {
            if ($("body").hasClass(classname)) {
                new ViewClass({
                    el: "." + classname
                });
            }
        });

        var $body = $("body");
        if ($body.hasClass("jira-setup-license-page")) {
            // there's really no view for SetupLicense page yet, but it had to become an AMD module
            // so that it's possible to write tests for it
            SetupLicense.startPage();
        } else if ($body.hasClass("jira-setup-account-license-error")) {
            // if the user's journey from MAC ends up in a failure, send this up.
            SetupTracker.sendUserArrivedFromMacFailed();
        }
    }

    $(function () {
        $.fn.isDirty = function () {}; // disable dirty form check
        initSetupPage();
        initSetup();
    });
});