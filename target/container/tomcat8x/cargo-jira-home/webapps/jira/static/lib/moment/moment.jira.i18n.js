(function() {
    "use strict";
    var allFormats;

    define("jira/moment/moment.jira.datetime-formats", ["wrm/data"], function(wrmData) {
        if (!allFormats) {
            allFormats = wrmData.claim("jira.webresources:dateFormatProvider.allFormats");
        }
        return allFormats;
    });
})();

define("jira/moment/moment.jira.i18n", [
    "jira/moment/moment.lib",
    "jira/moment/moment.jira.datetime-formats",
    "jira/moment/moment.jira.formatter",
    "jira/util/formatter"
], function(moment, allFormats, momentFmt, formatter) {
    "use strict";

    var timeUnits = allFormats.dateFormats;
    var lfFormats = allFormats.lookAndFeelFormats;

    moment.lang("jira", {
        months: timeUnits.months,
        monthsShort: timeUnits.monthsShort,
        weekdays: timeUnits.weekdays,
        weekdaysShort: timeUnits.weekdaysShort,
        weekdaysMin: timeUnits.weekdaysShort,
        longDateFormat: {
            LT: momentFmt.translateSimpleDateFormat(lfFormats.time),
            L: momentFmt.translateSimpleDateFormat(lfFormats.day),
            LL: momentFmt.translateSimpleDateFormat(lfFormats.dmy),
            LLL: momentFmt.translateSimpleDateFormat(lfFormats.complete)
        },
        meridiem: function (hours) {
            return timeUnits.meridiem[+(hours > 11)];
        },

        calendar: {
            sameDay:  "LLL",
            nextDay:  "LLL",
            nextWeek: "LLL",
            lastDay:  "LLL",
            lastWeek: "LLL",
            sameElse: "LLL"
        },

        // TODO Deprecate?
        relativeTime: {
            future: formatter.I18n.getText("common.date.relative.time.future", "%s"),
            past: formatter.I18n.getText("common.date.relative.time.past", "%s"),
            s: formatter.I18n.getText("common.date.relative.time.seconds"),
            m: formatter.I18n.getText("common.date.relative.time.minute"),
            mm: formatter.I18n.getText("common.date.relative.time.minutes", "%d"),
            h: formatter.I18n.getText("common.date.relative.time.hour"),
            hh: formatter.I18n.getText("common.date.relative.time.hours", "%d"),
            d: formatter.I18n.getText("common.date.relative.time.day"),
            dd: formatter.I18n.getText("common.date.relative.time.days", "%d"),
            M: formatter.I18n.getText("common.date.relative.time.month"),
            MM: formatter.I18n.getText("common.date.relative.time.months", "%d"),
            y: formatter.I18n.getText("common.date.relative.time.year"),
            yy: formatter.I18n.getText("common.date.relative.time.years", "%d")
        }
    });

    return moment;
});
