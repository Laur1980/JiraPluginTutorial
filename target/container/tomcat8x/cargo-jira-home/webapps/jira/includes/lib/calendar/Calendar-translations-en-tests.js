AJS.test.require([
    "jira.webresources:calendar",
    "jira.webresources:calendar-test-helper",
    "jira.webresources:calendar-en"
], function() {
    var calendarHelper = require("calendarTestHelper");
    calendarHelper.runTests("en", {
        daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        longMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    });
});
