define("jira/admin/application/defaults/api", ["marionette"], function (Marionette) {
    "use strict";

    var DefaultsApi = Marionette.Controller.extend({
        EVENT_ON_SHOW: "show"
    });

    return new DefaultsApi();
});