!function(){"use strict";var e;define("jira/moment/moment.jira.datetime-formats",["wrm/data"],function(t){return e||(e=t.claim("jira.webresources:dateFormatProvider.allFormats")),e})}(),define("jira/moment/moment.jira.i18n",["jira/moment/moment.lib","jira/moment/moment.jira.datetime-formats","jira/moment/moment.jira.formatter","jira/util/formatter"],function(e,t,m,a){"use strict";var r=t.dateFormats,o=t.lookAndFeelFormats;return e.lang("jira",{months:r.months,monthsShort:r.monthsShort,weekdays:r.weekdays,weekdaysShort:r.weekdaysShort,weekdaysMin:r.weekdaysShort,longDateFormat:{LT:m.translateSimpleDateFormat(o.time),L:m.translateSimpleDateFormat(o.day),LL:m.translateSimpleDateFormat(o.dmy),LLL:m.translateSimpleDateFormat(o.complete)},meridiem:function(e){return r.meridiem[+(e>11)]},calendar:{sameDay:"LLL",nextDay:"LLL",nextWeek:"LLL",lastDay:"LLL",lastWeek:"LLL",sameElse:"LLL"},relativeTime:{future:a.I18n.getText("common.date.relative.time.future","%s"),past:a.I18n.getText("common.date.relative.time.past","%s"),s:a.I18n.getText("common.date.relative.time.seconds"),m:a.I18n.getText("common.date.relative.time.minute"),mm:a.I18n.getText("common.date.relative.time.minutes","%d"),h:a.I18n.getText("common.date.relative.time.hour"),hh:a.I18n.getText("common.date.relative.time.hours","%d"),d:a.I18n.getText("common.date.relative.time.day"),dd:a.I18n.getText("common.date.relative.time.days","%d"),M:a.I18n.getText("common.date.relative.time.month"),MM:a.I18n.getText("common.date.relative.time.months","%d"),y:a.I18n.getText("common.date.relative.time.year"),yy:a.I18n.getText("common.date.relative.time.years","%d")}}),e});