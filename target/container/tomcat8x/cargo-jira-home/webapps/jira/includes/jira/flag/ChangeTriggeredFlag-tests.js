AJS.test.require(["jira.webresources:edit-project-details"], function () {

    var $ = require('jquery');
    var _ = require('underscore');
    var ChangeTriggeredFlag = require('jira/project/edit/change-triggered-flag');
    var CANCEL_ANALYTICS_KEY = 'cancelled-event-analytics-key';

    module("JIRA.Project.Flag.ChangeTriggeredFlag", {
        setup: function setup() {
            this.changeTriggeredFlag = initialiseTestObject.call(this);
        },
        teardown: function teardown() {
            $("#aui-flag-container").remove();
        }
    });

    function flagShowing() {
        var flag = $("#aui-flag-container").find(".aui-flag");

        return flag && flag.attr('aria-hidden') === "false";
    }

    function cancelFlag() {
        $("#aui-flag-container").find(".aui-flag a.cancel").click();
    }

    function closeFlag() {
        $("#aui-flag-container").find(".aui-icon.icon-close").click();
    }

    function initialiseTestObject(options) {
        this.value = 0;
        var self = this;
        self.cancelCallback = sinon.spy();
        options = _.defaults(options || {}, {
            getValue: function getValue() {
                return self.value;
            },
            revert: function revert() {
                self.value = 0;
            },
            warningDescription: function warningDescription() {
                return "warning";
            },
            cancelMessage: function cancelMessage() {
                return "cancel";
            },
            onCancelCallback: self.cancelCallback
        });

        return new ChangeTriggeredFlag(options);
    }

    test("On a value change the flag is shown", function () {
        this.value = 1;
        this.changeTriggeredFlag.changeOccurred();

        ok(flagShowing(), "Should have shown the flag on a change");
    });

    test("On changing the value back the flag should go away", function () {
        this.value = 1;
        this.changeTriggeredFlag.changeOccurred();

        ok(flagShowing(), "Should have shown the flag on a change");

        this.value = 0;
        this.changeTriggeredFlag.changeOccurred();

        ok(!flagShowing(), "Should have hidden the flag");
        ok(this.cancelCallback.calledOnce);
    });

    test("Clicking cancel on the flag reverts to the original value", function () {
        this.value = 1;
        this.changeTriggeredFlag.changeOccurred();

        cancelFlag();
        this.changeTriggeredFlag.changeOccurred();

        equal(this.value, 0, "Should have reverted back to the original value");
        ok(this.cancelCallback.calledOnce);
    });

    test("Clicking dismiss on flag will never show it again even when changing", function () {
        this.value = 1;
        this.changeTriggeredFlag.changeOccurred();

        closeFlag();

        ok(!flagShowing(), "Should have hidden the flag when cancelled");

        this.value = 2;
        this.changeTriggeredFlag.changeOccurred();

        ok(!flagShowing(), "Should have hidden the flag when cancelled");

        this.value = 0;
        this.changeTriggeredFlag.changeOccurred();

        ok(!flagShowing(), "Should have hidden the flag when cancelled");

        this.value = 2;
        this.changeTriggeredFlag.changeOccurred();

        ok(!flagShowing(), "Should have hidden the flag when cancelled");
    });
});