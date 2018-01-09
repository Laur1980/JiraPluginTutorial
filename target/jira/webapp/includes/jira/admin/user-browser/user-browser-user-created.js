define('jira/admin/user-browser/user-created', ['jira/util/logger', 'jquery', 'underscore', 'jira/flag', 'jira/admin/user-browser/user-browser-flags', 'wrm/data'], function (logger, $, _, Flag, observer, wrmData) {
    function showUserCreatedFlag(displayNames) {
        Flag.showSuccessMsg(null, JIRA.Templates.Admin.UserBrowser.userCreatedFlag({
            names: displayNames
        }));
        logger.trace('user-created-flag');
    }

    $(function () {
        observer.whenFlagSet("userCreatedFlag", function () {
            var displayNames = wrmData.claim("UserBrowser:createdUsersDisplayNames");
            if (displayNames && displayNames.length > 0) {
                showUserCreatedFlag(displayNames);
            }
        });
    });
});