define('jira/libs/calendar', ['require'], function(require) {
    'use strict';
    var Calendar = window.Calendar;
    var layerable = require('jira/libs/calendar-layerable-mixin');
    layerable.layerableExtensions(Calendar);
    return Calendar;
});

(function() {
    'use strict';
    // Need to require this immediately and synchronously so that,
    // regardless of whether it's used via AMD or the old global,
    // the mixins and extensions to Calendar are added immediately.
    var Calendar = require('jira/libs/calendar');
    AJS.namespace('window.Calendar', window, Calendar);
})();
