define('jira/field/init-date-pickers', ['jquery', 'jira/data/parse-options-from-fieldset', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/libs/calendar'], function (jQuery, parseOptionsFromFieldset, Reasons, Types, Events, Calendar) {
    'use strict';

    function initDatePicker(el) {
        jQuery(el || document.body).find('div.aui-field-datepicker').add('tr.aui-field-datepicker').add('td.aui-field-datepicker').each(function () {
            var $container = jQuery(this);
            var field = $container.find('input:text');
            var defaultCheckbox = $container.find('#useCurrentDate');
            var params = parseOptionsFromFieldset($container.find('fieldset.datepicker-params'));

            params.context = el;

            Calendar.setup(params);

            function toggleField() {
                field.prop('disabled', defaultCheckbox.is(':checked'));
            }

            if (defaultCheckbox.length) {
                toggleField();
                defaultCheckbox.click(toggleField);
            }
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initDatePicker(context);
        }
    });
});