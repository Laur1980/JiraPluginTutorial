AJS.test.require(["jira.webresources:jira-events", "jira.webresources:ajs-underscorejs-amd-shim", "jira.webresources:jira-analytics"], function () {
    var $ = require("jquery");
    var _ = require("underscore");
    var DarkFeatures = require("jira/ajs/dark-features");

    module("analytics", {
        setup: function setup() {
            this.sendSpy = sinon.spy();
            this.darkFeatures = sinon.stub();
            this.context = AJS.test.mockableModuleContext();
            this.context.mock("jira/analytics", { send: this.sendSpy });
            this.context.mock("jira/ajs/dark-features", this.darkFeatures);
            this.context.require('jira/analytics/analytics').bindEvents();
        },

        assertAfterClick: function assertAfterClick(html, expectedName, expectedProperties) {
            var element = $(html);
            element.appendTo("#qunit-fixture");
            element.click();

            ok(this.sendSpy.calledOnce, "Event added only once");

            var event = this.sendSpy.args[0][0];

            equal(event.name, expectedName, "Check event name");

            if (expectedProperties) {
                _.each(expectedProperties, function (expectedValue, key) {
                    equal(event.properties[key], expectedValue, "Check property '" + key + "'");
                });
            }

            this.sendSpy.reset();
        }
    });

    test("View workflow on view issue page", function () {
        var isEnabled = this.darkFeatures.isEnabled = sinon.stub();
        isEnabled.returns(false);

        this.assertAfterClick("<a class='issueaction-viewworkflow' href='#'></a>", "issue.viewworkflow", { version: "old", newEnabled: false });

        this.assertAfterClick("<a class='issueaction-viewworkflow new-workflow-designer' href='#'></a>", "issue.viewworkflow", { version: "new", newEnabled: false });

        this.assertAfterClick("<a class='issueaction-viewworkflow jira-workflow-designer-link' href='#'></a>", "issue.viewworkflow", { version: "new", newEnabled: false });

        isEnabled.returns(true);

        this.assertAfterClick("<a class='issueaction-viewworkflow' href='#'></a>", "issue.viewworkflow", { version: "old", newEnabled: true });

        this.assertAfterClick("<a class='issueaction-viewworkflow new-workflow-designer' href='#'></a>", "issue.viewworkflow", { version: "new", newEnabled: true });

        this.assertAfterClick("<a class='issueaction-viewworkflow jira-workflow-designer-link' href='#'></a>", "issue.viewworkflow", { version: "new", newEnabled: true });
    });
});