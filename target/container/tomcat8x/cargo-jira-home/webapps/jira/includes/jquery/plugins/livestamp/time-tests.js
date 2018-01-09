AJS.test.require(["jira.webresources:jira-global", "jira.webresources:jquery-livestamp"], function () {
    'use strict';

    var Time = require("jira/jquery/plugins/livestamp/time");
    var moment = require("jira/moment");
    var formatter = require("jira/util/formatter");

    module('time.js Test Suite', {
        setup: function setup() {
            sinon.spy(formatter, "format");
        },

        teardown: function teardown() {
            formatter.format.restore();
            Time.restoreDefaultRelativeTranslations();
        },

        assertRelativeDate: function assertRelativeDate(msg, now, date, expectedString, expectedValue) {
            formatter.format.reset();
            var resultString = Time.formatDateWithRelativeAge(date.clone(), Time.FormatType.types.shortAge, now.clone());
            equal(resultString, expectedString, msg);

            if (typeof expectedValue !== "undefined") {
                sinon.assert.alwaysCalledWith(formatter.format, expectedString, expectedValue);
            }
        },

        assertRelativeDateFromNow: function assertRelativeDateFromNow(modificator, expectedString, expectedValue) {
            var now = moment("2012-02-16T04:00:00.000");
            this.assertRelativeDate("Now " + modificator, now.clone(), now.clone().add(moment.duration(modificator)), expectedString, expectedValue);
        },

        assertRelativeDateFromMidnight: function assertRelativeDateFromMidnight(modificator, expectedString, expectedValue) {
            var now = moment("2012-02-16T00:00:00.000");
            this.assertRelativeDate("Midnight " + modificator, now.clone(), now.clone().add(moment.duration(modificator)), expectedString, expectedValue);
        },

        assertAMomentAgo: function assertAMomentAgo(result) {
            this.assertRelativeDateFromNow("", result);
            this.assertRelativeDateFromNow("-00:00:59", result);
            this.assertRelativeDateFromNow("-00:00:59.999", result);
        },

        assertOneMinuteAgo: function assertOneMinuteAgo(result) {
            this.assertRelativeDateFromNow("-00:01:00", result);
            this.assertRelativeDateFromNow("-00:01:00.001", result);
            this.assertRelativeDateFromNow("-00:01:29", result);
            this.assertRelativeDateFromNow("-00:01:30", result);
            this.assertRelativeDateFromNow("-00:01:31", result);
            this.assertRelativeDateFromNow("-00:01:59.999", result);
        },

        assertXMinutesAgo: function assertXMinutesAgo(result) {
            this.assertRelativeDateFromNow("-00:02:00", result, 2);
            this.assertRelativeDateFromNow("-00:02:01", result, 2);
            this.assertRelativeDateFromNow("-00:02:29", result, 2);
            this.assertRelativeDateFromNow("-00:02:30", result, 2);
            this.assertRelativeDateFromNow("-00:02:31", result, 2);
            this.assertRelativeDateFromNow("-00:29:00", result, 29);
            this.assertRelativeDateFromNow("-00:30:00", result, 30);
            this.assertRelativeDateFromNow("-00:31:00", result, 31);
            this.assertRelativeDateFromNow("-00:49:59.999", result, 49);
        },

        assertOneHourAgo: function assertOneHourAgo(result) {
            this.assertRelativeDateFromNow("-00:50:00", result);
            this.assertRelativeDateFromNow("-00:50:00.001", result);
            this.assertRelativeDateFromNow("-01:29:00", result);
            this.assertRelativeDateFromNow("-01:29:59.999", result);
        },

        assertXHoursAgo: function assertXHoursAgo(result) {
            this.assertRelativeDateFromNow("-01:30:00", result, 2);
            this.assertRelativeDateFromNow("-01:31:00", result, 2);
            this.assertRelativeDateFromNow("-03:59:59", result, 4);
            this.assertRelativeDateFromNow("-04:00:00", result, 4);
            this.assertRelativeDateFromNow("-04:00:01", result, 4);
            this.assertRelativeDateFromNow("-04:59:59", result, 5);
            this.assertRelativeDateFromNow("-05:00:00", result, 5);

            this.assertRelativeDateFromMidnight("-01:30:00", result, 2);
            this.assertRelativeDateFromMidnight("-05:00:00", result, 5);
        },

        assertOneDayAgo: function assertOneDayAgo(result) {
            this.assertRelativeDateFromNow("-05:00:00.001", result);
            this.assertRelativeDateFromNow("-1.00:00:00", result);
            this.assertRelativeDateFromNow("-1.04:00:00", result);

            this.assertRelativeDateFromMidnight("-05:00:00.001", result);
            this.assertRelativeDateFromMidnight("-23:59:59", result);
            this.assertRelativeDateFromMidnight("-1.00:00:00", result);
        },

        assertXDaysAgo: function assertXDaysAgo(result) {
            this.assertRelativeDateFromNow("-1.04:00:00.001", result);
            this.assertRelativeDateFromNow("-2.00:00:00", result, 2);
            this.assertRelativeDateFromNow("-6.00:00:00", result, 6);
            this.assertRelativeDateFromNow("-6.23:59:59.999", result, 6);

            this.assertRelativeDateFromMidnight("-1.00:00:00.001", result, 2);
            this.assertRelativeDateFromMidnight("-2.00:00:00", result, 2);
            this.assertRelativeDateFromMidnight("-2.23:59:59.999", result, 2);
            this.assertRelativeDateFromMidnight("-3.00:00:00", result, 3);
            this.assertRelativeDateFromMidnight("-3.00:00:00.001", result, 3);
            this.assertRelativeDateFromMidnight("-6.23:59:59.999", result, 6);
        },

        assertOneWeekAgo: function assertOneWeekAgo(result) {
            this.assertRelativeDateFromNow("-7.00:00:00", result);
            this.assertRelativeDateFromNow("-7.23:59:59.999", result);
        },

        assertInAMoment: function assertInAMoment(result) {
            this.assertRelativeDateFromNow("+00:00:00.001", result);
            this.assertRelativeDateFromNow("+00:00:59", result);
        },

        assertInOneMinute: function assertInOneMinute(result) {
            this.assertRelativeDateFromNow("+00:01:00", result);
            this.assertRelativeDateFromNow("+00:01:00.001", result);
            this.assertRelativeDateFromNow("+00:01:29", result);
            this.assertRelativeDateFromNow("+00:01:30", result);
            this.assertRelativeDateFromNow("+00:01:31", result);
            this.assertRelativeDateFromNow("+00:01:59.999", result);
        },

        assertInXMinutes: function assertInXMinutes(result) {
            this.assertRelativeDateFromNow("+00:02:00", result, 2);
            this.assertRelativeDateFromNow("+00:02:01", result, 2);
            this.assertRelativeDateFromNow("+00:02:29", result, 2);
            this.assertRelativeDateFromNow("+00:02:30", result, 2);
            this.assertRelativeDateFromNow("+00:02:31", result, 2);
            this.assertRelativeDateFromNow("+00:29:00", result, 29);
            this.assertRelativeDateFromNow("+00:30:00", result, 30);
            this.assertRelativeDateFromNow("+00:31:00", result, 31);
            this.assertRelativeDateFromNow("+00:49:59.999", result, 49);
        },

        assertInOneHour: function assertInOneHour(result) {
            this.assertRelativeDateFromNow("+00:50:00", result);
            this.assertRelativeDateFromNow("+00:50:00.001", result);
            this.assertRelativeDateFromNow("+01:29:00", result);
            this.assertRelativeDateFromNow("+01:29:59.999", result);
        },

        assertInXHours: function assertInXHours(result) {
            this.assertRelativeDateFromNow("+01:30:00", result, 2);
            this.assertRelativeDateFromNow("+01:31:00", result, 2);
            this.assertRelativeDateFromNow("+19:59:59.999", result, 20);

            this.assertRelativeDateFromMidnight("+01:30:00", result, 2);
            this.assertRelativeDateFromMidnight("+05:00:00", result, 5);
            this.assertRelativeDateFromMidnight("+23:59:59", result, 24);
        },

        assertInOneDay: function assertInOneDay(result) {
            this.assertRelativeDateFromNow("+20:00:00", result);
            this.assertRelativeDateFromNow("+1.00:00:00", result);
            this.assertRelativeDateFromNow("+1.19:59:59.999", result);

            this.assertRelativeDateFromMidnight("+1.00:00:00", result);
            this.assertRelativeDateFromMidnight("+1.23:59:59.999", result);
        },

        assertInXDays: function assertInXDays(result) {
            this.assertRelativeDateFromNow("+1.20:00:00", result, 2);
            this.assertRelativeDateFromNow("+2.00:00:00", result, 2);
            this.assertRelativeDateFromNow("+6.00:00:00", result, 6);
            this.assertRelativeDateFromNow("+6.23:59:59.999", result, 6);

            this.assertRelativeDateFromMidnight("+2.00:00:00", result, 2);
            this.assertRelativeDateFromMidnight("+2.23:59:59.999", result, 2);
            this.assertRelativeDateFromMidnight("+3.00:00:00", result, 3);
            this.assertRelativeDateFromMidnight("+3.00:00:00.001", result, 3);
            this.assertRelativeDateFromMidnight("+6.23:59:59.999", result, 6);
        },

        assertInOneWeek: function assertInOneWeek(result) {
            this.assertRelativeDateFromNow("+7.00:00:00", result);
            this.assertRelativeDateFromNow("+7.23:59:59", result);
        }
    });

    test('format relative dates', function () {
        this.assertAMomentAgo("common.date.relative.a.moment.ago");
        this.assertOneMinuteAgo("common.date.relative.one.minute.ago");
        this.assertXMinutesAgo("common.date.relative.x.minutes.ago");
        this.assertOneHourAgo("common.date.relative.one.hour.ago");
        this.assertXHoursAgo("common.date.relative.x.hours.ago");
        this.assertOneDayAgo("common.date.relative.one.day.ago");
        this.assertXDaysAgo("common.date.relative.x.days.ago");
        this.assertOneWeekAgo("common.date.relative.one.week.ago");

        this.assertInAMoment("common.date.relative.in.a.moment");
        this.assertInOneMinute("common.date.relative.in.one.minute");
        this.assertInXMinutes("common.date.relative.in.x.minutes");
        this.assertInOneHour("common.date.relative.in.one.hour");
        this.assertInXHours("common.date.relative.in.x.hours");
        this.assertInOneDay("common.date.relative.in.one.day");
        this.assertInXDays("common.date.relative.in.x.days");
        this.assertInOneWeek("common.date.relative.in.one.week");
    });

    test('format relative dates with a custom text', function () {
        Time.setRelativeTranslations({
            'aMomentAgo': 'custom-common.date.relative.a.moment.ago',
            'oneMinuteAgo': 'custom-common.date.relative.one.minute.ago',
            'xMinutesAgo': 'custom-common.date.relative.x.minutes.ago',
            'oneHourAgo': 'custom-common.date.relative.one.hour.ago',
            'xHoursAgo': 'custom-common.date.relative.x.hours.ago',
            'oneDayAgo': 'custom-common.date.relative.one.day.ago',
            'xDaysAgo': 'custom-common.date.relative.x.days.ago',
            'oneWeekAgo': 'custom-common.date.relative.one.week.ago',
            'inAMoment': 'custom-common.date.relative.in.a.moment',
            'inOneMinute': 'custom-common.date.relative.in.one.minute',
            'inXMinutes': 'custom-common.date.relative.in.x.minutes',
            'inOneHour': 'custom-common.date.relative.in.one.hour',
            'inXHours': 'custom-common.date.relative.in.x.hours',
            'inOneDay': 'custom-common.date.relative.in.one.day',
            'inXDays': 'custom-common.date.relative.in.x.days',
            'inOneWeek': 'custom-common.date.relative.in.one.week'
        });

        this.assertAMomentAgo("custom-common.date.relative.a.moment.ago");
        this.assertOneMinuteAgo("custom-common.date.relative.one.minute.ago");
        this.assertXMinutesAgo("custom-common.date.relative.x.minutes.ago");
        this.assertOneHourAgo("custom-common.date.relative.one.hour.ago");
        this.assertXHoursAgo("custom-common.date.relative.x.hours.ago");
        this.assertOneDayAgo("custom-common.date.relative.one.day.ago");
        this.assertXDaysAgo("custom-common.date.relative.x.days.ago");
        this.assertOneWeekAgo("custom-common.date.relative.one.week.ago");
        this.assertInAMoment("custom-common.date.relative.in.a.moment");
        this.assertInOneMinute("custom-common.date.relative.in.one.minute");
        this.assertInXMinutes("custom-common.date.relative.in.x.minutes");
        this.assertInOneHour("custom-common.date.relative.in.one.hour");
        this.assertInXHours("custom-common.date.relative.in.x.hours");
        this.assertInOneDay("custom-common.date.relative.in.one.day");
        this.assertInXDays("custom-common.date.relative.in.x.days");
        this.assertInOneWeek("custom-common.date.relative.in.one.week");
    });

    test('format date with format string - format is correct (short, long, full, timestamp)', function () {
        var context = AJS.test.mockableModuleContext();
        context.mock("jira/moment/moment.jira.datetime-formats", {
            dateFormats: {},
            lookAndFeelFormats: {}
        });
        var moment = context.require("jira/moment");
        var Time = context.require("jira/jquery/plugins/livestamp/time");

        var midnight = moment(new Date("2012-02-16T00:00:00.000+03:00"));
        var now = midnight.clone().add('d', 1).subtract('ms', 1); // 11:59pm 16 Feb 2012 +03:00

        function assertFormatString(date, expected, type) {
            type = type || "timestamp";
            try {
                equal(Time.formatDateWithFormatString(date.clone(), Time.FormatType.types[type]), expected, 'formatted date is correct for ' + date.toDate().toUTCString());
            } catch (e) {
                ok(false, 'formatDateWithFormatString failed with args ' + date.toDate().toUTCString() + ' and ' + type + '.\nCause: ' + e.toString());
            }
        }

        assertFormatString(now, "LLL", "timestamp");
        assertFormatString(now, "LLL", "full");
        assertFormatString(now, "LL", "long");
        assertFormatString(now, "ll", "short");
    });
});