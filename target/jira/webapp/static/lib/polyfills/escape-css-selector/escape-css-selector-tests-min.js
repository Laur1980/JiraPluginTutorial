AJS.test.require(["jira.webresources:escape-css-selector-polyfill"],function(){"use strict";module("Escape CSS Selector p(r)olyfill",{});var e=require("jira/polyfill/escapeCSSSelector");test("Test escaping CSS selectors",function(){equal(e("#dot.dot"),"\\#dot\\.dot","CSS selector escaped properly")})});