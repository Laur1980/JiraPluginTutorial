AJS.test.require([
    "jira.webresources:calendar",
    "jira.webresources:calendar-test-helper",
    "jira.webresources:calendar-fr"
], function() {
    var calendarHelper = require("calendarTestHelper");
    calendarHelper.runTests("fr", {
        daysOfWeek: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        shortMonths: ["janv.", "f\u00e9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c."],
        longMonths: ["Janvier", "F\u00e9vrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Ao\u00fbt", "Septembre", "Octobre", "Novembre", "D\u00e9cembre"]
    });
});
