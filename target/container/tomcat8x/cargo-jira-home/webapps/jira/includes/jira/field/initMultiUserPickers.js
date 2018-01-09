define('jira/field/init-multi-user-pickers', ['jquery', 'wrm/context-path', 'jira/ajs/select/multi-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/no-browser-user-name-picker', 'jira/field/user-picker-util'], function (jQuery, wrmContextPath, MultiSelect, Reasons, Types, Events, NoBrowseUserNamePicker, UserPickerUtil) {
    var contextPath = wrmContextPath();

    function initMultiUserPicker(ctx) {
        ctx.find(".js-default-multi-user-picker").each(function () {
            var $el = jQuery(this);
            if (AJS.params.currentUserCanBrowseUsers) {
                new MultiSelect({
                    element: this,
                    itemAttrDisplayed: "label",
                    showDropdownButton: false,
                    removeOnUnSelect: true,
                    submitInputVal: true,
                    ajaxOptions: {
                        url: contextPath + "/rest/api/1.0/users/picker",
                        query: true, // keep going back to the sever for each keystroke
                        data: function data(query) {
                            return {
                                showAvatar: true,
                                query: query,
                                exclude: $el.val()
                            };
                        },
                        formatResponse: UserPickerUtil.formatResponse
                    }
                });
            } else {
                new NoBrowseUserNamePicker({
                    element: this
                });
            }
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initMultiUserPicker(context);
        }
    });
});