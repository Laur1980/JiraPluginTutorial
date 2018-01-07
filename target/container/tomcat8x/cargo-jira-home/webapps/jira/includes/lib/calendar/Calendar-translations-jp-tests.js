AJS.test.require([
    "jira.webresources:calendar",
    "jira.webresources:calendar-test-helper",
    "jira.webresources:calendar-jp"
], function() {
    var calendarHelper = require("calendarTestHelper");
    calendarHelper.runTests("jp", {
        daysOfWeek: ["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"],
        shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        longMonths: ["1\u6708", "2\u6708", "3\u6708", "4\u6708", "5\u6708", "6\u6708", "7\u6708", "8\u6708", "9\u6708", "10\u6708", "11\u6708", "12\u6708"]
    });
});
