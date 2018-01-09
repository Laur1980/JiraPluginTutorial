require(['jira/admin/application/approleseditor', 'jquery'], function (ApplicationRoles, $) {
    "use strict";

    $(function () {
        new ApplicationRoles({
            el: "#application-roles"
        });
    });
});