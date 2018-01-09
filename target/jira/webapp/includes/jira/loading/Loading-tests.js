AJS.test.require(["jira.webresources:page-loading-indicator"], function () {
    var Loading = require("jira/loading/loading");

    module("Loading");

    test("isVisible() correctly reflects the state", function () {
        ok(!Loading.isVisible());
        Loading.showLoadingIndicator();
        ok(Loading.isVisible());
        Loading.hideLoadingIndicator();
    });
});