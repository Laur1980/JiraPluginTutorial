require(['jquery'], function ($) {
    'use strict';

    $(function () {
        var progress = $('.aui-progress-indicator').data('progress') || 0;
        AJS.progressBars.update('#priority-migration-progress', progress);
    });
});