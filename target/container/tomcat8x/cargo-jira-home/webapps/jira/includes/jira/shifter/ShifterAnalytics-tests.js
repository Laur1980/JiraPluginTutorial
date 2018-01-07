AJS.test.require(['jira.webresources:shifter'], function () {

    var ShifterAnalytics = require('jira/shifter/shifter-analytics');
    var Meta = require('jira/util/data/meta');
    var analytics = require('jira/analytics');
    var _ = require('underscore');
    var assert = sinon.assert;
    var match = sinon.match;

    var sendAnalyticsStub;

    function selection(data) {
        return {
            name: "jira.dotdialog.selection",
            data: _.extend({ lang: "en" }, data)
        };
    }

    var moduleSetup = {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();

            this.sandbox.stub(Meta, "get").returns("en");

            sendAnalyticsStub = this.sandbox.stub(analytics, "send");
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    };

    module('ShifterAnalytics#show', moduleSetup);

    test('should trigger an event', function () {
        ShifterAnalytics.show();

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, {
            name: "jira.dotdialog.show",
            data: undefined
        });
    });

    module('ShifterAnalytics#selection', moduleSetup);

    test('shouldn\'t trigger if there are not enough parameters', function () {
        ShifterAnalytics.selection();
        ShifterAnalytics.selection("label");
        ShifterAnalytics.selection("label", "value");

        ShifterAnalytics.selection("label", "value", "group-id");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, match.has("name", "jira.dotdialog.selection"));
    });

    test('should hash labels that are potentially user-entered', function () {
        ShifterAnalytics.selection("label", "value", "group-id");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, selection({
            group: "group-id",
            selected: "102727412"
        }));
    });

    test('shouldn\'t hash values in white-listed groups', function () {
        _.each(ShifterAnalytics.selection.privacyPolicySafeGroups, function (groupId) {
            ShifterAnalytics.selection("label", "value", groupId);
            assert.calledWith(sendAnalyticsStub, selection({
                group: groupId,
                selected: "label"
            }));
        });

        assert.calledTwice(sendAnalyticsStub);
    });

    test('shouldn\'t hash white-listed values', function () {
        _.each(ShifterAnalytics.selection.privacyPolicySafeLabels, function (label) {
            ShifterAnalytics.selection(label, "value", "group-id");
            assert.calledWith(sendAnalyticsStub, selection({
                group: "group-id",
                selected: label
            }));
        });

        assert.callCount(sendAnalyticsStub, 8);
    });

    test('should use values and not labels for system fields in "edit-fields" group', function () {
        ShifterAnalytics.selection("label", "value", "edit-fields");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, selection({
            group: "edit-fields",
            selected: "value"
        }));
    });

    test('should hash custom fields in "edit-fields" group', function () {
        ShifterAnalytics.selection("label", "customfield_123", "edit-fields");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, selection({
            group: "edit-fields",
            selected: "102727412"
        }));
    });

    test('Should extract language from the locale', function () {
        Meta.get.returns("te_ST");
        ShifterAnalytics.selection("label", "value", "group");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, {
            name: "jira.dotdialog.selection",
            data: {
                lang: "te",
                group: "group",
                selected: "102727412"
            }
        });
    });

    test('Should use default language if something is wrong with the locale', function () {
        Meta.get.returns("wrong");
        ShifterAnalytics.selection("label", "value", "group");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, {
            name: "jira.dotdialog.selection",
            data: {
                lang: "en",
                group: "group",
                selected: "102727412"
            }
        });
    });

    test('Should use default language if there is no locale', function () {
        Meta.get.returns(undefined);
        ShifterAnalytics.selection("label", "value", "group");

        assert.calledOnce(sendAnalyticsStub);
        assert.calledWith(sendAnalyticsStub, {
            name: "jira.dotdialog.selection",
            data: {
                lang: "en",
                group: "group",
                selected: "102727412"
            }
        });
    });
});