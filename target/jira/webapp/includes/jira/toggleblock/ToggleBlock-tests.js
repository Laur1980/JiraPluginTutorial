AJS.test.require(["jira.webresources:jira-global"], function () {
    var ToggleBlock = require('jira/toggleblock/toggle-block');
    var toggleBlock = new ToggleBlock();

    test("ToggleBlock.checkIsPermlink", function () {
        var urlBase = "http://localhost:8090/jira/browse/HSP-1";

        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedCommentId=xxx"));
        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedWorklogId=xxx"));
        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedCommentId=xxx#zzz"));
        ok(toggleBlock.checkIsPermlink(urlBase + "?focusedCommentId=10000&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-10000"));

        ok(!toggleBlock.checkIsPermlink(urlBase));
        ok(!toggleBlock.checkIsPermlink(urlBase + "?page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-10000"));
    });
});