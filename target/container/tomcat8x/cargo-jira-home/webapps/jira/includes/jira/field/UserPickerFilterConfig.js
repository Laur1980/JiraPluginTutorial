define('jira/admin/custom-fields/user-picker-filter/config', ['jquery', 'jira/admin/custom-fields/user-picker-filter/selector-panel'], function (jQuery, selectorPanel) {

    /**
     * A user of the SelectorPanel from the config page, a webwork action.
     *
     * Input data is obtained from ww action via data in the generated html.
     * Configured filter data is sent back to server via form submission to ww action, too.
     */
    return {
        /**
         * store the user filter json into the hidden field for form action.
         */
        _storeUserFilterJson: function _storeUserFilterJson(userFilter) {
            jQuery('#filter-data-hidden').val(JSON.stringify(userFilter));
        },

        /**
         * update css class of button panel depending on whether filter is disabled.
         * we want to have a larger margin top when disabled.
         * @param userFilterEnabled whether the user filter is enabled
         * @private
         */
        _adjustButtonPanelPostion: function _adjustButtonPanelPostion(userFilterEnabled) {
            var filterButtonPanel = jQuery("#filter-button-panel");
            var add = userFilterEnabled ? "enabled" : "disabled";
            var remove = userFilterEnabled ? "disabled" : "enabled";
            filterButtonPanel.addClass("filter-" + add);
            filterButtonPanel.removeClass("filter-" + remove);
        },

        /**
         * This method performs initialization when the selector panel is loaded from user picker config page.
         * A different initialization method is required when loading from the quick Create Field dialog.
         */
        initializeFromConfigPage: function initializeFromConfigPage() {
            var $data = jQuery('#data-for-template');
            var groups = $data.data('groupsJson') || [];
            var projectRoles = $data.data('projectRolesJson') || [];
            var userFilter = $data.data('userFilterJson') || { enabled: false };

            $data.remove(); // don't need the data in html any more

            var instance = this;

            selectorPanel.initialize(jQuery('#filter-selector-panel'), userFilter, groups, projectRoles);

            this._adjustButtonPanelPostion(userFilter);

            // setup hook to store the json string into hidden file before form submit
            jQuery('#filter-submit').click(function () {
                instance._storeUserFilterJson(selectorPanel.getUserFilter());
            });
            selectorPanel.getFilterCheckbox().change(function () {
                // adjust the top margin of button panels
                instance._adjustButtonPanelPostion(selectorPanel.isUserFilterEnabled());
            });
        }
    };
});

AJS.namespace('JIRA.Admin.CustomFields.UserPickerFilter.Config', null, require('jira/admin/custom-fields/user-picker-filter/config'));