define('jira/mention/mention-group', ['jira/ajs/group'], function (Group) {
    /**
     * @class MentionGroup
     * @extends Group
     */
    return Group.extend({
        _makeSelection: function _makeSelection(e) {
            if (this.items && this.items[this.index]) {
                this.items[this.index].trigger("accept");
                e.preventDefault();
            }
        },

        /**
         * @override
         */
        shiftFocus: function shiftFocus(offset) {
            Group.prototype.shiftFocus.call(this, offset);
            var newItem = this.items[this.index];
            if (newItem) {
                this.highlighted = this.items[this.index];
            }
        },

        keys: {
            "Up": function Up(e) {
                this.shiftFocus(-1);
                e.preventDefault();
            },
            "Down": function Down(e) {
                this.shiftFocus(1);
                e.preventDefault();
            },
            "Return": function Return(e) {
                this._makeSelection(e);
            },
            "Tab": function Tab(e) {
                this._makeSelection(e);
            }
        }
    });
});

AJS.namespace('JIRA.MentionGroup', null, require('jira/mention/mention-group'));