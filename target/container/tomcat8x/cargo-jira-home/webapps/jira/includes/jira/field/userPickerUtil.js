define('jira/field/user-picker-util', ['jira/ajs/list/item-descriptor', 'jira/ajs/list/group-descriptor', 'jquery'], function (ItemDescriptor, GroupDescriptor, jQuery) {

    return {
        formatResponse: function formatResponse(data) {

            var ret = [];

            jQuery(data).each(function (i, suggestions) {

                var groupDescriptor = new GroupDescriptor({
                    weight: i, // order or groups in suggestions dropdown
                    label: suggestions.footer
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
    };
});

AJS.namespace('JIRA.UserPickerUtil', null, require('jira/field/user-picker-util'));