AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {

    var userPickerUtil = require('jira/field/user-picker-util');

    module("JIRA.UserPickerUtil");

    test("formatResponse returns correct group descriptor", function () {
        var response = userPickerUtil.formatResponse([{
            footer: 'label1',
            users: [{ name: 'name1', displayName: 'Name 1', html: '<html1>', avatarUrl: '/avatar1' }, { name: 'name2', displayName: 'Name 2', html: '<html1>', avatarUrl: '/avatar2' }]
        }]);

        equal(response.length, 1, 'Return only one GroupDescriptor');

        var groupDescriptor = response[0];
        equal(groupDescriptor.weight(), 0, 'GroupDescriptor weight should be 0');
        equal(groupDescriptor.label(), 'label1', 'GroupDescriptor label should be "label1"');
        equal(groupDescriptor.items().length, 2, 'GroupDescriptor should have 2 ItemDescritor\'s');

        var itemDescriptor1 = groupDescriptor.items()[0];
        equal(itemDescriptor1.label(), 'Name 1', 'First ItemDescriptor should be "Name 1"');

        var itemDescriptor2 = groupDescriptor.items()[1];
        equal(itemDescriptor2.label(), 'Name 2', 'Second ItemDescriptor should be "Name 2"');
    });
});