AJS.test.require(["jira.webresources:viewissue"], function () {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");
    var StringUtil = require("jira/util/strings");

    module("ViewIssueAnalytics", {
        setup: function setup() {
            var that = this;
            this.sandbox = sinon.sandbox.create();
            this.context = AJS.test.mockableModuleContext();

            this.issueContext = "unknown";
            this.fakeSender = this.sandbox.spy();

            this.context.mock("jira/analytics", {
                send: that.fakeSender
            });
            this.context.mock("jira/viewissue/analytics-utils", {
                context: function context() {
                    return that.issueContext;
                }
            });
            this.analytics = this.context.require("jira/viewissue/tabs/analytics");
            this.container = $("<div class='tabwrap'>");
        },

        teardown: function teardown() {
            this.sandbox.restore();
        },

        getTabLink: function getTabLink(index) {
            return this.container.find("a.tab-link:eq(" + index + ")");
        },

        addAdditionalButton: function addAdditionalButton(buttonData) {
            buttonData = _.extend({
                sort: true,
                order: "asc"
            }, buttonData);

            var button = $("<a>");
            if (buttonData.sort) {
                button.attr({
                    "data-tab-sort": "",
                    "data-order": buttonData.order
                });
            }
            button.appendTo(this.container);
            return button;
        },

        addTab: function addTab(tabData) {
            tabData = _.extend({
                id: "com.atlassian.jira.plugin.system.issuetabpanels:all-tabpanel",
                active: false,
                href: "href"
            }, tabData);

            var tab = $("<li>").attr({
                "data-key": tabData.id,
                "data-href": tabData.href,
                "class": tabData.active ? "active" : ""
            });
            tab.appendTo(this.container);

            $("<a class='tab-link'>").appendTo(tab);
        },

        assertSortButtonEvent: function assertSortButtonEvent(callNumber, eventData) {
            this.assertEventCall("jira.viewissue.tabsort.clicked", callNumber, eventData);
        },

        assertTabEvent: function assertTabEvent(callNumber, eventData) {
            this.assertEventCall("jira.viewissue.tab.clicked", callNumber, eventData);
        },

        assertEventCall: function assertEventCall(eventName, callNumber, eventData) {
            var call = this.fakeSender.getCall(callNumber);
            var callArguments = call && call.args[0];
            deepEqual(callArguments, {
                name: eventName,
                properties: eventData
            });
        },

        defaultEventData: function defaultEventData(eventData) {
            return _.extend({
                inNewWindow: false,
                keyboard: false,
                context: this.issueContext,
                tabPosition: 0,
                tab: "com.atlassian.jira.plugin.system.issuetabpanels:all-tabpanel"
            }, eventData);
        }
    });

    test("Should send data after click on tab", function () {
        this.addTab();
        this.analytics.tabClicked(this.getTabLink(0), false, false);

        this.assertTabEvent(0, this.defaultEventData());
    });

    test("Should pass additional parameters after click on tab", function () {
        this.addTab();
        this.analytics.tabClicked(this.getTabLink(0), true, false);

        this.assertTabEvent(0, this.defaultEventData({
            inNewWindow: true
        }));

        this.analytics.tabClicked(this.getTabLink(0), false, true);
        this.assertTabEvent(1, this.defaultEventData({
            keyboard: true
        }));
    });

    test("Should send data about active tab after click on sort button", function () {
        this.addTab({
            active: false
        });
        this.addTab({
            id: "com.atlassian.jira.plugin.system.issuetabpanels:worklog-tabpanel",
            active: true
        });
        var sortButton = this.addAdditionalButton();

        this.analytics.buttonClicked(sortButton, false, false);

        this.assertSortButtonEvent(0, this.defaultEventData({
            tab: "com.atlassian.jira.plugin.system.issuetabpanels:worklog-tabpanel",
            tabPosition: 1,
            order: "asc"
        }));
    });

    test("Should send data about sort order after click on sort button", function () {
        this.addTab({
            active: true
        });
        var sortButton = this.addAdditionalButton({
            order: "desc"
        });

        this.analytics.buttonClicked(sortButton, false, false);

        this.assertSortButtonEvent(0, this.defaultEventData({
            order: "desc"
        }));
    });

    test("Should whitelist tab name after click on tab", function () {
        this.addTab({
            id: "non-whitelisted-tab"
        });

        this.analytics.tabClicked(this.getTabLink(0), false, false);

        this.assertTabEvent(0, this.defaultEventData({
            tab: StringUtil.hashCode("non-whitelisted-tab")
        }));
    });

    test("Should whitelist tab name after click on sort button", function () {
        this.addTab({
            id: "non-whitelisted-tab",
            active: true
        });
        var sortButton = this.addAdditionalButton();

        this.analytics.buttonClicked(sortButton, false, false);

        this.assertSortButtonEvent(0, this.defaultEventData({
            tab: StringUtil.hashCode("non-whitelisted-tab"),
            order: "asc"
        }));
    });

    test("Should do not send analytics after click on something which is not tab or sort", function () {
        this.addTab({
            active: true
        });
        var sortButton = this.addAdditionalButton({
            sort: false
        });

        this.analytics.buttonClicked(sortButton, false, false);

        ok(!this.fakeSender.called);
    });

    test("Should send position of tab", function () {
        this.addTab({
            id: "tab-one"
        });
        this.addTab({
            id: "tab-two"
        });
        this.addTab({
            id: "tab-three"
        });

        this.analytics.tabClicked(this.getTabLink(2), false, false);
        this.analytics.tabClicked(this.getTabLink(0), false, false);
        this.analytics.tabClicked(this.getTabLink(1), false, false);

        ok(this.fakeSender.calledThrice);

        this.assertTabEvent(0, this.defaultEventData({
            tabPosition: 2,
            tab: StringUtil.hashCode("tab-three")
        }));
        this.assertTabEvent(1, this.defaultEventData({
            tabPosition: 0,
            tab: StringUtil.hashCode("tab-one")
        }));
        this.assertTabEvent(2, this.defaultEventData({
            tabPosition: 1,
            tab: StringUtil.hashCode("tab-two")
        }));
    });
});