var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

AJS.test.require(["jira.webresources:jquery-escape-selector-polyfill"], function () {
    'use strict';

    module("jQuery escapeSelector", {});

    var jQuery = require("jquery");

    test('Test $.escapeSelector presence', function () {
        equal(_typeof(jQuery.escapeSelector), "function", "jQuery.escapeSelector present");
    });
    test('Test escaping CSS selector via jQuery function', function () {
        equal(jQuery.escapeSelector("#dot.dot"), "\\#dot\\.dot", "jQuery.escapeSelector function properly");
    });
});