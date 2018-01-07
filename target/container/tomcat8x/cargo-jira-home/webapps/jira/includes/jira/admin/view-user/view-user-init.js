require(['jira/util/logger', 'jira/admin/view-user/view-user', 'wrm/context-path', 'jquery', 'aui/inline-dialog2', // Initialises AUI's InlineDialog component
'jira/admin/application-selector' // Initialises the admin area's app selector
], function (logger, ViewUser, wrmContextPath, $) {
    'use strict';

    var contextPath = wrmContextPath();

    $(function () {
        var $applicationsAndGroupsModule = $(".view-user-applications-and-groups-module");
        var username = $applicationsAndGroupsModule.attr("data-username");

        var viewUser = new ViewUser({
            el: $applicationsAndGroupsModule,
            username: username
        });

        viewUser.listenTo(viewUser, "application-trigger", function (options) {
            var ajaxType = options.application.isSelected() ? "POST" : "DELETE";

            $.ajax({
                type: ajaxType,
                url: contextPath + "/rest/internal/2/viewuser/application/" + encodeURI(options.application.getApplicationKey()) + "?username=" + encodeURIComponent(username),
                contentType: "application/json",
                dataType: "json"
            }).done(function (response) {
                viewUser.update(response);
                logger.trace("view-user-select");
            }).fail(function (xhr) {
                viewUser.onError(xhr.responseText, xhr.status);
            });
        });
    });
});