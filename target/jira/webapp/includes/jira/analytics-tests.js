AJS.test.require(["jira.webresources:jira-analytics-amd"], function () {
    "use strict";

    var analytics = require("jira/analytics");

    module("ViewIssueAnalytics", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            AJS.EventQueue = [];
        },

        teardown: function teardown() {
            this.sandbox.restore();
        },

        makeEvent: function makeEvent(eventName, data, properties) {
            var event = { name: eventName };
            if (data) {
                event.data = data;
            }
            if (properties) {
                event.properties = properties;
            }
            return event;
        }
    });

    test("Should use options.data", function () {
        var data = { property1: 'property1', property2: 'property2' };
        var event = this.makeEvent('testEvent', data);
        analytics.send(event);

        equal(AJS.EventQueue.length, 1, '1 event should be queried');
        var expected = {
            name: 'testEvent',
            data: data,
            properties: data
        };
        deepEqual(AJS.EventQueue[0], expected);
    });

    test("Should use options.properties", function () {
        var properties = { property1: 'property1', property2: 'property2' };
        var event = this.makeEvent('testEvent', undefined, properties);
        analytics.send(event);

        equal(AJS.EventQueue.length, 1, '1 event should be queried');
        var expected = {
            name: 'testEvent',
            properties: properties
        };
        deepEqual(AJS.EventQueue[0], expected);
    });

    test("Should merge options.data and options.properties", function () {
        var data = { property1: 'property1', property2: 'property2' };
        var properties = { property2: 'property2prop', property3: 'property3' };
        var event = this.makeEvent('testEvent', data, properties);
        analytics.send(event);

        equal(AJS.EventQueue.length, 1, '1 event should be queried');
        var expected = {
            name: 'testEvent',
            data: data,
            properties: {
                property1: 'property1',
                property2: 'property2prop',
                property3: 'property3'
            }
        };
        deepEqual(AJS.EventQueue[0], expected);
    });

    test("Should trigger jiraAnalyticsEvent", function () {
        var properties = { property1: 'property1', property2: 'property2' };
        var event = this.makeEvent('testEvent', undefined, properties);

        var events = [];
        AJS.bind("jiraAnalyticsEvent.analyticsTest", function (event, data) {
            events.push(data);
        });

        analytics.send(event);

        equal(events.length, 1, '1 event should be trigger');
        var expected = {
            name: 'testEvent',
            properties: properties
        };
        deepEqual(events[0], expected);

        AJS.unbind(".analyticsTest");
    });
});