define('jira/field/init-single-user-pickers', ['jquery', 'wrm/context-path', 'jira/ajs/select/single-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/user-picker-util', 'jira/util/formatter'], function (jQuery, wrmContextPath, SingleSelect, Reasons, Types, Events, UserPickerUtil, formatter) {
    'use strict';

    var contextPath = wrmContextPath();

    function createSingleUserPickers(ctx) {

        var restPath = "/rest/api/1.0/users/picker";

        jQuery(".js-default-user-picker", ctx).each(function () {
            var $this = jQuery(this);
            if ($this.data("aui-ss")) {
                return;
            }
            var data = { showAvatar: true };
            var inputText = $this.data('inputValue');

            new SingleSelect({
                element: $this,
                submitInputVal: true,
                showDropdownButton: !!$this.data('show-dropdown-button'),
                errorMessage: formatter.I18n.getText("user.picker.invalid.user", "'{0}'"),
                ajaxOptions: {
                    url: contextPath + restPath,
                    query: true, // keep going back to the sever for each keystroke
                    data: data,
                    formatResponse: UserPickerUtil.formatResponse
                },
                inputText: inputText
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            createSingleUserPickers(context);
        }
    });
});