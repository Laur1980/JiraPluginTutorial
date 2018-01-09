require(['jquery', 'wrm/data', 'jira/project/permissions/permissionschememodel', 'jira/project/permissions/permissionschemeview', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons'], function ($, wrmData, ProjectPermissionSchemeModel, ProjectPermissionSchemeView, JiraEvents, JiraEventTypes, JiraEventReasons) {
    "use strict";

    $(function () {
        var permissionSchemeId = wrmData.claim("permissionSchemeId");
        var sharedProjects = wrmData.claim("sharedProjects");
        var model = new ProjectPermissionSchemeModel({ id: permissionSchemeId });

        var permissionSchemeView = new ProjectPermissionSchemeView({ model: model, sharedProjects: sharedProjects, el: ".project-permissions-container" });
        // needed to hook up the shared-by inline dialog.
        permissionSchemeView.on("renderDone", function (context) {
            JiraEvents.trigger(JiraEventTypes.NEW_CONTENT_ADDED, [context, JiraEventReasons.pageLoad]);
        });

        model.fetch();
    });
});