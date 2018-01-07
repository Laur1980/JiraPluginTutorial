AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {

    var groupPickerUtil = require('jira/field/group-picker-util');

    module("JIRA.GroupPickerUtil");

    test("formatResponse returns correct group descriptor", function () {
        var response = groupPickerUtil.formatResponse([{
            header: 'label1',
            groups: [{ name: 'name1' }, { name: 'name2' }]
        }]);

        equal(response.length, 1, 'Return only one GroupDescriptor');

        var groupDescriptor = response[0];
        equal(groupDescriptor.weight(), 0, 'GroupDescriptor weight should be 0');
        equal(groupDescriptor.label(), 'label1', 'GroupDescriptor label should be "label1"');
        equal(groupDescriptor.items().length, 2, 'GroupDescriptor should have 2 ItemDescritor\'s');

        var itemDescriptor1 = groupDescriptor.items()[0];
        equal(itemDescriptor1.label(), 'name1', 'First ItemDescriptor should be "name1"');

        var itemDescriptor2 = groupDescriptor.items()[1];
        equal(itemDescriptor2.label(), 'name2', 'Second ItemDescriptor should be "name2"');
    });
});