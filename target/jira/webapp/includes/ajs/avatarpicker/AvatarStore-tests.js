AJS.test.require(["jira.webresources:avatar-picker"], function () {
    var AvatarStore = require("jira/ajs/avatarpicker/avatar-store");
    var urls = require('jira/util/urls');

    module("JIRA.AvatarStore", {
        teardown: function teardown() {
            this.sandbox.restore();
        },
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
        }
    });

    test("buildCompleteUrl should work for URLs with or without query params", function () {
        this.sandbox.stub(urls, "atl_token").returns('TOKEN');

        var restUrl = "http://localhost:8090/jira/rest/api/latest/project/HSP-1";
        var projAvatarStore = new AvatarStore({
            restQueryUrl: "blah",
            restCreateTempUrl: "blah",
            restUpdateTempUrl: "blah",
            defaultAvatarId: 1000
        });

        equal(projAvatarStore._buildCompleteUrl(restUrl), "http://localhost:8090/jira/rest/api/latest/project/HSP-1?atl_token=TOKEN", "URL for project avatar");

        restUrl = "http://localhost:8090/jira/rest/api/latest/user";
        var userAvatarStore = new AvatarStore({
            restQueryUrl: "blah",
            restCreateTempUrl: "blah",
            restUpdateTempUrl: "blah",
            restParams: { username: "fred" },
            defaultAvatarId: 1000
        });
        equal(userAvatarStore._buildCompleteUrl(restUrl), "http://localhost:8090/jira/rest/api/latest/user?username=fred&atl_token=TOKEN", "URL for user avatar");
    });
});