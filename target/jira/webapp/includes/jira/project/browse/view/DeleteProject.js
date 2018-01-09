define('jira/project/browse/deleteproject', ['require'], function (require) {
    var $ = require('jquery');
    var convertPercentageToDecimal = function convertPercentageToDecimal(decimal) {
        return decimal * 1.0 / 100;
    };

    return function () {
        var PROJECT_PROGRESS_VAL_ID = '#delete-project-progress';
        var percentage_element = $('#delete-project-progress-value');
        if ($(PROJECT_PROGRESS_VAL_ID).length !== 0) {
            if (!percentage_element || !percentage_element.attr('data-value') || isNaN(percentage_element.attr('data-value'))) {
                AJS.progressBars.setIndeterminate(PROJECT_PROGRESS_VAL_ID);
            } else {
                var progress = convertPercentageToDecimal(percentage_element.attr('data-value'));
                AJS.progressBars.update(PROJECT_PROGRESS_VAL_ID, progress);
            }
        }
    };
});

require(['jira/project/browse/deleteproject'], function (deleteproject) {
    deleteproject();
});