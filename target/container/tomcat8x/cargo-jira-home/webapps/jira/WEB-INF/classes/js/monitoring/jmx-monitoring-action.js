require(['jquery', 'wrm/context-path'], function ($, contextPath) {
    'use strict';

    $(function () {
        var urlPrefix = '/rest/api/2/monitoring/jmx';
        var startUrl = urlPrefix + '/startExposing';
        var stopUrl = urlPrefix + '/stopExposing';
        var areMetricsExposedUrl = urlPrefix + '/areMetricsExposed';

        var toggle = document.getElementById('enable-jmx-toggle');
        toggle.busy = true;
        $.get(contextPath() + areMetricsExposedUrl).done(function (response) {
            toggle.checked = response;
        }).always(function () {
            toggle.busy = false;
        });

        toggle.addEventListener('change', function () {
            var isChecked = toggle.checked;
            toggle.busy = true;

            var requestUrl = isChecked ? startUrl : stopUrl;
            $.get(contextPath() + requestUrl).fail(function () {
                toggle.checked = !isChecked;
            }).always(function () {
                toggle.busy = false;
            });
        });
    });
});