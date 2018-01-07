AJS.test.require("jira.webresources:top-same-origin-window", function () {

    module('jira/util/top-same-origin-window', {
        setup: function setup() {
            this.topSameOriginWindow = require('jira/util/top-same-origin-window');
        }
    });

    test("Check the when first parent is valid", function () {
        var parentNoException = { location: { href: "helloworld" } };
        var thisWindow = { parent: parentNoException };
        var parentWindow = this.topSameOriginWindow(thisWindow);
        equal(parentWindow, parentNoException);
    });

    test("Window is top window itself", function () {
        var thisWindow = {
            parent: thisWindow,
            location: {
                href: "helloworld"
            }
        };
        var parentWindow = this.topSameOriginWindow(thisWindow);
        equal(parentWindow, thisWindow);
    });

    test("When first parent is out of scope, returns itself", function () {
        var parentWithException = { location: null };
        var thisWindow = { parent: parentWithException };
        var parentWindow = this.topSameOriginWindow(thisWindow);
        equal(parentWindow, thisWindow);
    });

    test("When second parent is out of scope, returns parent", function () {
        var parentWithException = { location: null };
        var parentNoException = {
            location: {
                href: "helloworld"
            },
            parent: parentWithException
        };
        var thisWindow = { parent: parentNoException };
        topSameOriginWindow = require('jira/util/top-same-origin-window');
        var parentWindow = this.topSameOriginWindow(thisWindow);
        equal(parentWindow, parentNoException);
    });

    test("When in same origin goes to the top window", function () {
        var topWindow = {
            location: {
                href: "hello"
            },
            parent: topWindow
        };
        var parentNoException = {
            location: {
                href: "hello.world"
            },
            parent: topWindow
        };
        var thisWindow = { parent: parentNoException };
        topSameOriginWindow = require('jira/util/top-same-origin-window');
        var parentWindow = this.topSameOriginWindow(thisWindow);
        equal(parentWindow, topWindow);
    });
});