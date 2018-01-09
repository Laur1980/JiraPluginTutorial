define('jira/util/cron', ['exports'], function (exports) {
    'use strict';

    var timesOnce = window.timesOnce = window.timesOnce || {};

    /*
     Renders an element visible to the user
     */
    exports.hideCronEdit = function (elementid) {
        document.getElementById(elementid).style.display = 'none';
    };

    /*
     Renders an element invisible to the user
     */
    exports.showCronEdit = function (elementid) {
        document.getElementById(elementid).style.display = '';
    };

    exports.toggleFrequencyControl = function (paramPrefix, setOriginal) {
        var select = document.getElementById(paramPrefix + "interval");
        if (select.value == 0) {
            exports.switchToOnce(paramPrefix, setOriginal);
        } else {
            exports.switchToMany(paramPrefix, setOriginal);
        }
    };

    /*
     Toggles the frequency controls to match 'once per day' mode
     */
    exports.switchToOnce = function (paramPrefix, setOriginal) {
        //make sure the frequency select is set correctly
        //set state
        exports.hideCronEdit(paramPrefix + "runMany");
        exports.showCronEdit(paramPrefix + "runOnce");
        if (setOriginal) {
            timesOnce[paramPrefix] = true;
        }
    };

    /*
     Toggles the frequency controls to match 'many per day' mode
     */
    exports.switchToMany = function (paramPrefix, setOriginal) {
        //set state
        exports.hideCronEdit(paramPrefix + "runOnce");
        exports.showCronEdit(paramPrefix + "runMany");
        if (setOriginal) {
            timesOnce[paramPrefix] = false;
        }
    };

    exports.switchToDaysOfMonth = function (paramPrefix) {
        exports.hideCronEdit(paramPrefix + 'daysOfWeek');
        exports.showCronEdit(paramPrefix + 'daysOfMonth');
        exports.showCronEdit(paramPrefix + 'freqDiv');
        exports.hideCronEdit(paramPrefix + 'innerFreqDiv');
        exports.hideCronEdit(paramPrefix + 'advanced');
        exports.switchToOnce(paramPrefix, false);
    };

    exports.switchToDaysOfWeek = function (paramPrefix) {
        exports.showCronEdit(paramPrefix + 'daysOfWeek');
        exports.hideCronEdit(paramPrefix + 'daysOfMonth');
        exports.showCronEdit(paramPrefix + 'freqDiv');
        exports.showCronEdit(paramPrefix + 'innerFreqDiv');
        exports.hideCronEdit(paramPrefix + 'advanced');
        exports.switchToOriginal(paramPrefix);
    };

    exports.switchToDaily = function (paramPrefix) {
        exports.hideCronEdit(paramPrefix + 'daysOfWeek');
        exports.hideCronEdit(paramPrefix + 'daysOfMonth');
        exports.showCronEdit(paramPrefix + 'freqDiv');
        exports.showCronEdit(paramPrefix + 'innerFreqDiv');
        exports.hideCronEdit(paramPrefix + 'advanced');
        exports.switchToOriginal(paramPrefix);
    };

    exports.switchToAdvanced = function (paramPrefix) {
        exports.hideCronEdit(paramPrefix + 'daysOfWeek');
        exports.hideCronEdit(paramPrefix + 'daysOfMonth');
        exports.hideCronEdit(paramPrefix + "runOnce");
        exports.hideCronEdit(paramPrefix + "runMany");
        exports.hideCronEdit(paramPrefix + 'freqDiv');
        exports.showCronEdit(paramPrefix + 'advanced');
    };

    exports.switchToOriginal = function (paramPrefix) {
        if (timesOnce[paramPrefix]) {
            exports.switchToOnce(paramPrefix, false);
        } else {
            exports.switchToMany(paramPrefix, false);
        }
    };
});

(function () {
    'use strict';

    var cron = require('jira/util/cron');
    AJS.namespace("hideCronEdit", null, cron.hideCronEdit);
    AJS.namespace("showCronEdit", null, cron.showCronEdit);
    AJS.namespace("switchToOnce", null, cron.switchToOnce);
    AJS.namespace("switchToMany", null, cron.switchToMany);
    AJS.namespace("switchToDaysOfMonth", null, cron.switchToDaysOfMonth);
    AJS.namespace("switchToDaysOfWeek", null, cron.switchToDaysOfWeek);
    AJS.namespace("switchToDaily", null, cron.switchToDaily);
    AJS.namespace("switchToAdvanced", null, cron.switchToAdvanced);
    AJS.namespace("switchToOriginal", null, cron.switchToOriginal);
    AJS.namespace("toggleFrequencyControl", null, cron.toggleFrequencyControl);
})();