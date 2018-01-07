define('jira/field/init-multi-group-pickers', ['jquery', 'wrm/context-path', 'jira/ajs/select/multi-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/group-picker-util'], function (jQuery, wrmContextPath, MultiSelect, Reasons, Types, Events, GroupPickerUtil) {
    'use strict';

    var contextPath = wrmContextPath();

    function initMultiGroupPickers(ctx) {
        ctx.find('.js-default-multi-group-picker').each(function () {
            var $el = jQuery(this);
            var showLabels = $el.data("show-labels") === true;
            var userName = $el.data("user-name");
            new MultiSelect({
                element: this,
                itemAttrDisplayed: "label",
                showDropdownButton: false,
                ajaxOptions: {
                    data: function data(query) {
                        return {
                            userName: userName,
                            query: query,
                            exclude: $el.val()
                        };
                    },
                    url: contextPath + "/rest/api/2/groups/picker",
                    query: true, // keep going back to the sever for each keystroke
                    formatResponse: showLabels ? GroupPickerUtil.formatResponseWithLabels : GroupPickerUtil.formatResponse
                }
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initMultiGroupPickers(context);
        }
    });
});