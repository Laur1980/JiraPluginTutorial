AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {

    var componentPicker = require('jira/field/component-picker');

    module("JIRA.ComponentPicker", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            var fixture = jQuery("#qunit-fixture");
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("Is correctly declared in AMD", function () {
        ok(componentPicker, "Is AMDifyed");
    });
});