define('jira/field/multi-user-list-picker', ['jira/util/formatter', 'jira/field/multi-user-list-picker/item', 'jira/ajs/select/suggestions/user-list-suggest-handler', 'jira/ajs/select/multi-select', 'jira/ajs/list/item-descriptor', 'jira/ajs/list/group-descriptor', 'jira/ajs/group', 'wrm/context-path', 'jquery'], function (formatter, MultiUserListPickerItem, UserListSuggestHandler, MultiSelect, ItemDescriptor, GroupDescriptor, Group, wrmContextPath, jQuery) {
    'use strict';

    var contextPath = wrmContextPath();

    /**
     * A multi-select list for selecting recipients to Share an issue or filter with. Shares are to 2 types of recipients:
     * - Users: selected from a dropdown list, and
     * - Email: addresses typed out in full
     *
     * @constructor JIRA.MultiUserListPicker
     * @extends AJS.MultiSelect
     */
    return MultiSelect.extend({

        init: function init(options) {

            var restPath = "/rest/api/1.0/users/picker";

            function formatResponse(response) {

                var ret = [];

                jQuery(response).each(function (i, suggestions) {

                    var groupDescriptor = new GroupDescriptor({
                        weight: i, // order or groups in suggestions dropdown
                        label: suggestions.footer // Heading of group
                    });

                    jQuery(suggestions.users).each(function () {
                        groupDescriptor.addItem(new ItemDescriptor({
                            value: this.name, // value of item added to select
                            label: this.displayName, // title of lozenge
                            html: this.html,
                            icon: this.avatarUrl,
                            allowDuplicate: false,
                            highlighted: true
                        }));
                    });

                    ret.push(groupDescriptor);
                });

                return ret;
            }

            jQuery.extend(options, {
                itemAttrDisplayed: "label",
                userEnteredOptionsMsg: formatter.I18n.getText("common.form.email.label.suffix"),
                showDropdownButton: false,
                removeOnUnSelect: true,
                ajaxOptions: {
                    url: contextPath + restPath,
                    query: true, // keep going back to the server for each keystroke
                    data: { showAvatar: true },
                    formatResponse: formatResponse
                },
                suggestionsHandler: UserListSuggestHandler,
                itemGroup: new Group(),
                itemBuilder: function itemBuilder(descriptor) {
                    return new MultiUserListPickerItem({
                        descriptor: descriptor,
                        container: this.$selectedItemsContainer
                    });
                }
            });

            this._super(options);
        },

        _createFurniture: function _createFurniture(disabled) {
            this._super(disabled);
            if (this.options.description) {
                this._render("description", this.options.description).insertAfter(this.$field);
            }
        },

        /**
         * The share textarea has no lozenges inside it and no need for cursor and indent nonsense.
         * It could even be a plain text field.
         */
        updateItemsIndent: jQuery.noop,

        _renders: {
            selectedItemsWrapper: function selectedItemsWrapper() {
                return jQuery('<div class="recipients" />');
            },
            selectedItemsContainer: function selectedItemsContainer() {
                return jQuery('<ol />');
            },
            description: function description(_description) {
                return jQuery("<div />").addClass("description").text(_description);
            }
        }

    });
});

AJS.namespace('JIRA.MultiUserListPicker', null, require('jira/field/multi-user-list-picker'));
AJS.namespace('JIRA.MultiUserListPicker.Item', null, require('jira/field/multi-user-list-picker/item'));