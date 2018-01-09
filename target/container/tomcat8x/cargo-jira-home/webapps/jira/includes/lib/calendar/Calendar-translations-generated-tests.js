AJS.test.require([
    "jira.webresources:calendar",
    "jira.webresources:calendar-test-helper",
    "jira.webresources:calendar-en",
    "jira.webresources:calendar-localisation-moment"
], function() {
    "use strict";

    var context = AJS.test.mockableModuleContext();

    //This test checks moment localisation which uses server generated month / weekday names.
    //As we do not have control over what server will send us, this method replaces the formats with some arbitrary month / weekday names
    //and checks if they have correctly overwritten calendar-js native localisation.
    //see moment.jira.i18n.js for details
    var ourDateFormats = {
        months: ["M_One", "M_Two", "M_Three", "M_Four", "M_Five", "M_Six", "M_Seven", "M_Eight", "M_Nine", "M_Ten", "M_Eleven", "M_Twelve"],
        monthsShort: ["MS1", "MS2", "MS3", "MS4", "MS5", "MS6", "MS7", "MS8", "MS9", "MS10", "MS11", "MS12"],
        weekdays: ["WeekDay1", "WeekDay2", "WeekDay3", "WeekDay4", "WeekDay5", "WeekDay6", "WeekDay7"],
        weekdaysShort: ["WD1", "WD2", "WD3", "WD4", "WD5", "WD6", "WD7"]
    };
    var ourLFFormats = {};
    var ourMoment = window.moment;

    //Ensure that we always return the same instance
    context.mock("jira/moment/moment.lib", ourMoment);

    //Ensure we stub the date formats so our data is retrieved
    context.mock("jira/moment/moment.jira.datetime-formats", {
        dateFormats: ourDateFormats,
        lookAndFeelFormats: ourLFFormats
    });

    //Force re-applying the 'jira' lang from our date formats module, and
    //Force re-overwriting Calendar._* constants with the new lang definition
    context.require("jira/calendar/localisation-moment");

    var calendarHelper = require('calendarTestHelper');
    calendarHelper.runTests("custom", {
        daysOfWeek: ["WD1", "WD2", "WD3", "WD4", "WD5", "WD6", "WD7"],
        shortMonths: ["MS1", "MS2", "MS3", "MS4", "MS5", "MS6", "MS7", "MS8", "MS9", "MS10", "MS11", "MS12"],
        longMonths: ["M_One", "M_Two", "M_Three", "M_Four", "M_Five", "M_Six", "M_Seven", "M_Eight", "M_Nine", "M_Ten", "M_Eleven", "M_Twelve"]
    }, true);
});
