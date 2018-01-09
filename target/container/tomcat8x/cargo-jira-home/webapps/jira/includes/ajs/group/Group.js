define('jira/ajs/group', ['jira/ajs/control', 'jquery'], function (Control, $) {
    /**
     * A group manages focus for a list of items so that only one item has focus at a time.
     *
     * @class Group
     * @extends Control
     */
    return Control.extend({
        CLASS_SIGNATURE: "AJS_GROUP",

        init: function init() {
            this.items = [];
            this.index = -1;
            this._assignEvents("instance", this);
        },

        /**
         * Add an item to this group.
         *
         * @param {Control} item
         */
        addItem: function addItem(item) {
            this.items.push(item);
            this._assignEvents("item", item);
        },

        /**
         * Remove an item from this group.
         * Note: This does not remove the UI lozenge.
         *
         * @param {Control} item
         */
        _removeItem: function _removeItem(item) {
            var index = $.inArray(item, this.items);
            if (index < 0) {
                throw new Error("Group: item [" + item + "] is not a member of this group");
            }
            item.trigger("blur");
            if (index < this.index) {
                this.index--;
            }
            this.items.splice(index, 1);
            this._unassignEvents("item", item);
        },

        /**
         * Remove an item from this group. It also removes the UI lozenge.
         *
         * @param {Control} item
         */
        removeItem: function removeItem(item) {
            item.trigger("remove");
        },

        /**
         * Remove all items from this group. It also removes the UI lozenges.
         */
        removeAllItems: function removeAllItems() {
            while (this.items.length) {
                this.items[0].trigger("remove");
            }
        },

        /**
         * Move focus to a new item, relative to the currently focused item.
         *
         * @param {Number} offset -- The position of the item to focus, relative to the position of the currently focused item.
         */
        shiftFocus: function shiftFocus(offset) {
            if (this.index === -1 && offset === 1) {
                offset = 0;
            }
            if (this.items.length > 0) {
                var i = (Math.max(0, this.index) + this.items.length + offset) % this.items.length;
                this.items[i].trigger("focus");
                this.trigger("change:activeItem", this.items[i]);
            }
        },

        /**
         * Assigns events so that (ie in the case of a dropdown, if no items are focused that key down will focus first time)
         */
        prepareForInput: function prepareForInput() {
            this._assignEvents("keys", document);
        },

        _events: {
            "instance": {
                "focus": function focus() {
                    if (this.items.length === 0) {
                        return;
                    }
                    if (this.index < 0) {
                        this.items[0].trigger("focus");
                    } else {
                        this._assignEvents("keys", document);
                    }
                },
                "blur": function blur() {
                    if (this.index >= 0) {
                        this.items[this.index].trigger("blur");
                    } else {
                        this._unassignEvents("keys", document);
                    }
                }
            },
            "keys": {
                "aui:keydown": function auiKeydown(event) {
                    this._handleKeyEvent(event);
                }
            },
            "item": {
                "focus": function focus(event) {
                    var index = this.index;
                    this.index = $.inArray(event.target, this.items);
                    if (index < 0) {
                        this.trigger("focus");
                    } else if (index !== this.index) {
                        this.items[index].trigger("blur");
                    }
                },
                "blur": function blur(event) {
                    if (this.index === $.inArray(event.target, this.items)) {
                        this.index = -1;
                        this.trigger("blur");
                    }
                },
                "remove": function remove(event) {
                    this._removeItem(event.target);
                }
            }
        },

        keys: {
            // Key handlers may be added by descendant classes.
        }
    });
});

AJS.namespace('AJS.Group', null, require('jira/ajs/group'));