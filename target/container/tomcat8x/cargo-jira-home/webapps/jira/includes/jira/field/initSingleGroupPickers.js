define('jira/field/init-single-group-pickers', ['jira/ajs/select/single-select', 'jquery', 'wrm/context-path', 'jira/ajs/list/item-descriptor', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/group-picker-util'], function (SingleSelect, jQuery, wrmContextPath, ItemDescriptor, Reasons, Types, Events, GroupPickerUtil) {
    'use strict';

    var contextPath = wrmContextPath();

    function initSingleGroupPickers(ctx) {
        ctx.find('.js-default-single-group-picker').each(function () {
            var $el = jQuery(this);
            var $emptyValue = $el.find('option[data-empty]');
            var showLabels = $el.data("show-labels") === true;
            var userName = $el.data("user-name");
            new SingleSelect({
                element: this,
                itemAttrDisplayed: "label",
                revertOnInvalid: true,
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
                    formatResponse: function formatResponse(data) {
                        var formattedData = GroupPickerUtil.formatResponse(data, showLabels);
                        if ($emptyValue.length && $el.val() !== '') {
                            formattedData.unshift(new ItemDescriptor({
                                value: '',
                                label: $emptyValue.text(),
                                highlighted: true
                            }));
                        }
                        return formattedData;
                    }
                }
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initSingleGroupPickers(context);
        }
    });
});