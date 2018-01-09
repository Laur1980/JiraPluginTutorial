define("calendarTestHelper", ["jquery"], function(jQuery) {
    return {
        runTests: function (locale, consts, requireMoment) {
            module("JIRA.list.calendar.Calendar" + (requireMoment ? "WithMoment" : "") + locale.toUpperCase() + "test", {
                setup: function () {
                    this.consts = consts;
                    var fixtureID = "#qunit-fixture";
                    this.$input = jQuery("<input type='text'>").appendTo(fixtureID);
                    this.trigger = jQuery("<input type='button'>").appendTo(fixtureID)[0];

                    this.input = this.$input[0];
                    this.assertDaySelected = function (day) {
                        var $cal = jQuery(".calendar.active");
                        var $selectedDay = jQuery(".day-" + day + ".selected", $cal);
                        ok($selectedDay, "First day should be selected");
                        ok($selectedDay.length, "First day should be selected");
                    }
                },
                teardown: function () {
                    jQuery(".calendar").remove();
                    window.calendar = undefined;
                }
            });
            test("test calendar selects proper date on open", function () {
                var date = new Date(2012, 0, 1);
                Calendar.setup({inputField: this.input, button: this.trigger, date: date, firstDay: 0});
                this.trigger.click();
                var $cal = jQuery(".calendar.active");
                ok($cal.length, "Calendar not present");
                ok($cal.is(":visible"), "Callendar should be visible");
                this.assertDaySelected(1);
                equal(jQuery(".title", $cal).text(), this.consts.longMonths[0] + ", 2012", "Expect proper header");
            });

            test("test calendar translation for day of week", function () {
                var date = new Date(2012, 1, 1);
                Calendar.setup({inputField: this.input, button: this.trigger, date: date, firstDay: 0});
                this.trigger.click();
                var days = jQuery(".name.day");
                equal(days.length, 7, "Expected that the week has seven days")
                for (var i = 0; i < 7; i++) {
                    equal(jQuery(days[i]).text(), this.consts.daysOfWeek[i], "Invalid week name");
                }
            });

            test("test calendar month changes properly by change of input field", function () {
                var date = new Date(2012, 1, 1);
                Calendar.setup({
                    inputField: this.input,
                    button: this.trigger,
                    ifFormat: "%d/%b/%y ",
                    date: date,
                    firstDay: 0
                });
                for (var i = 0; i < 12; i++) {
                    var date = "1/" + this.consts.shortMonths[i] + "/2012";
                    this.$input.val(date);
                    this.trigger.click();
                    this.assertDaySelected(1);
                    var $cal = jQuery(".calendar.active");
                    equal(jQuery(".title", $cal).text(), this.consts.longMonths[i] + ", 2012", "Expect proper header");
                }
            });

            test("test calendar month changes properly by js function", function () {
                Calendar.setup({inputField: this.input, button: this.trigger, firstDay: 0});
                this.trigger.click();
                for (var i = 0; i < 12; i++) {
                    window.calendar.setDate(new Date(2012, i, 1))
                    this.assertDaySelected(1);
                    var $cal = jQuery(".calendar.active");
                    equal(jQuery(".title", $cal).text(), this.consts.longMonths[i] + ", 2012", "Expect proper header");
                }
            });

            test("test calendar popup selects day by click ", function () {
                var date = new Date(2012, 1, 1);
                Calendar.setup({inputField: this.input, button: this.trigger, date: date, firstDay: 0});
                this.trigger.click();
                var $calendar = jQuery(".calendar.active");
                Calendar.dayMouseDown({currentTarget: jQuery(".day-3", $calendar)[0]})
                Calendar.tableMouseUp({target: jQuery(".day-3", $calendar)[0]})
                equal(this.$input.val(), "2012/02/03");
            });

            test("test calendar with 24 hour time mode ", function () {
                var hour = 16;
                var minute = 23;
                var date = new Date(2012, 1, 1, hour, minute, 12);
                Calendar.setup(
                    {
                        inputField: this.input,
                        button: this.trigger,
                        showsTime: true,
                        time24: true,
                        date: date, firstDay: 0
                    });
                this.trigger.click();
                var $cal = jQuery(".calendar.active");
                equal(jQuery(".time > .hour", $cal).text(), hour, "Invalid hour");
                equal(jQuery(".time > .minute", $cal).text(), minute, "Invalid minute");
            });

            test("test Date.splitDate", function () {
                var date = new Date(2017, 1, 1);
                var ifFormat = "%e/%b/%y";
                Calendar.setup({
                    inputField: this.input,
                    button: this.trigger,
                    ifFormat: ifFormat,
                    date: date,
                    firstDay: 0
                });
                for (var i = 0; i < 12; i++) {
                    var day = 20;
                    var year = 17;
                    var date = day.toString() + "/" + this.consts.shortMonths[i] + "/" + year.toString();
                    var parts = Date.splitDate(date, ifFormat)

                    equal(parts.day, day, "Expect proper day");
                    equal(parts.month, i, "Expect proper month");
                    equal(parts.year, 2000 + year, "Expect proper year");
                }
            });
        }
    }
});
