AJS.test.require([
    "jira.webresources:calendar",
    "jira.webresources:calendar-test-helper",
    "jira.webresources:calendar-de"
], function() {
    var calendarHelper = require("calendarTestHelper");
    calendarHelper.runTests("de", {
        daysOfWeek: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
        longMonths: ["Januar", "Februar", "M\u00e4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    });
});
