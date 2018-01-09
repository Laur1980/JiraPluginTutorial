AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {

    var MultiUserListPicker = require('jira/field/multi-user-list-picker');

    module("JIRA.MultiUserListPicker", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            var fixture = jQuery("#qunit-fixture");
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("Is correctly declared in AMD", function () {
        ok(MultiUserListPicker, "Is AMDifyed");
    });
});