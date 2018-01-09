define('jira/field/multi-user-list-picker/item', ['jira/util/data/meta', 'jira/util/strings', 'jira/ajs/control', 'jquery'], function (Meta, strings, Control, jQuery) {
    'use strict';

    /**
     * A JIRA.MultiUserListPicker.Item represents an item selected in the Share Dialog & Watchers Dialog.
     * It is much like an AJS.MultiSelect.Lozenge but is rendered differently with slightly altered behaviour.
     *
     * @constructor JIRA.MultiUserListPicker.Item
     * @extends AJS.Control
     */

    return Control.extend({

        init: function init(options) {
            this._setOptions(options);

            this.$lozenge = this._render("item");
            this.$removeButton = this.$lozenge.find('.remove-recipient');

            this._assignEvents("instance", this);
            this._assignEvents("lozenge", this.$lozenge);
            this._assignEvents("removeButton", this.$removeButton);

            this.$lozenge.prependTo(this.options.container);
        },

        _getDefaultOptions: function _getDefaultOptions() {
            return {
                label: null,
                title: null,
                container: null,
                focusClass: "focused"
            };
        },

        _renders: {
            "item": function item() {
                var descriptor = this.options.descriptor;

                var data;
                if (descriptor.noExactMatch() !== true) {
                    // A User selected from the matches
                    data = {
                        escape: false,
                        username: descriptor.value(),
                        icon: descriptor.icon(),
                        displayName: strings.escapeHtml(descriptor.label())
                    };

                    return jQuery(JIRA.Templates.Fields.recipientUsername(data));
                } else {
                    // Just an email
                    data = {
                        email: descriptor.value(),
                        icon: Meta.get('default-avatar-url')
                    };
                    return jQuery(JIRA.Templates.Fields.recipientEmail(data));
                }
            }
        },

        _events: {
            "instance": {
                "remove": function remove() {
                    this.$lozenge.remove();
                }
            },
            "removeButton": {
                "click": function click(e) {
                    // We need to stop the click propagation, else by the time the InlineDialog catches the event the span
                    // will no longer be in the DOM and the click handler will think the user clicked outside of the dialog,
                    // closing it.
                    e.stopPropagation();
                    this.trigger("remove");
                }
            }
        }
    });
});