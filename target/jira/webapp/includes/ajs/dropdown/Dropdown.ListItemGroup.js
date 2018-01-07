define('jira/ajs/dropdown/dropdown-list-item-group', ['jira/ajs/group'], function (Group) {
    /**
     * A list item group has key handling for shifting focus with the vertical arrow keys,
     * and accepting an item with the return key.
     *
     * @class Dropdown.ListItemGroup
     * @extends Group
     */
    return Group.extend({
        keys: {
            "Up": function Up(event) {
                this.shiftFocus(-1);
                event.preventDefault();
            },
            "Down": function Down(event) {
                this.shiftFocus(1);
                event.preventDefault();
            },
            "Return": function Return(event) {
                var item = this.items[this.index];
                if (item && !event.isDefaultPrevented()) {
                    item.trigger("accept");
                    event.preventDefault();
                }
            }
        }
    });
});

AJS.namespace('AJS.Dropdown.ListItemGroup', null, require('jira/ajs/dropdown/dropdown-list-item-group'));