AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {

    var VersionPicker = require('jira/field/version-picker');

    module("JIRA.VersionPicker", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            var fixture = jQuery("#qunit-fixture");
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("Is correctly declared in AMD", function () {
        ok(VersionPicker, "Is AMDifyed");
    });
});