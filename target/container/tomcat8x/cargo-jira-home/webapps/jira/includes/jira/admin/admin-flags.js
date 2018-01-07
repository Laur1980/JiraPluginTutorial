require(['jira/util/logger', 'wrm/data', 'jquery', 'jira/flag'], function (logger, wrmData, $, Flags) {
    "use strict";

    $(function () {
        var data = wrmData.claim('jira.webresources:user-message-flags.adminLockout') || {};
        if (data.noprojects) {
            var templates = JIRA.Templates.Flags.Admin;
            var title = templates.adminIssueAccessFlagTitle({});
            var body = templates.adminIssueAccessFlagBody({
                manageAccessUrl: data.manageAccessUrl
            });
            var flag = Flags.showWarningMsg(title, body, {
                dismissalKey: data.flagId
            });

            $(flag).find("a").on("click", function () {
                flag.dismiss();
            });
        }
        logger.trace("admin.flags.done");
    });
});