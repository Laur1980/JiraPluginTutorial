define("jira/admin/admindata", ['wrm/data'], function (wrmData) {
    "use strict";

    var adminData = wrmData.claim('jira.webresources:jira-admin-data.data');

    var adminDataObject = {
        isUserAdmin: function isUserAdmin() {
            return adminData["isAdmin"];
        },
        isUserSysAdmin: function isUserSysAdmin() {
            return adminData["isSysAdmin"];
        }
    };

    return adminDataObject;
});