require(['jquery', 'jira/admin/custom-fields/user-picker-filter/config'], function (jQuery, userPickerFilterConfig) {

    // render the filter selector panel
    jQuery(function () {
        userPickerFilterConfig.initializeFromConfigPage();
    });
});