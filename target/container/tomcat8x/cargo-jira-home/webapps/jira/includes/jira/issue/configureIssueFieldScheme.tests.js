AJS.test.require(['jira.webresources:configure-issue-field-scheme'], function () {
    'use strict';

    var $ = require('jquery');
    var ConfigureIssueFieldSchemeView = require('jira/issue/configureissuefieldscheme');
    module('test add priority schemes', {
        setup: function setup() {
            var $viewContainer = this.setUpMockElements();
            this.sandbox = sinon.sandbox.create();
            this.moveAllSpy = this.sandbox.spy(ConfigureIssueFieldSchemeView.prototype, 'moveAll');
            this.restrictOptionsSpy = this.sandbox.spy(ConfigureIssueFieldSchemeView.prototype, 'restrictOptions');
            this.getSelectedOptionsSpy = this.sandbox.spy(ConfigureIssueFieldSchemeView.prototype, 'getSelectedOptions');
            this.submitformSpy = this.sandbox.spy(ConfigureIssueFieldSchemeView.prototype, 'submitForm');
            this.issueFieldView = new ConfigureIssueFieldSchemeView({
                el: $viewContainer
            });
        },
        teardown: function teardown() {
            this.issueFieldView.remove();
            this.sandbox.restore();
        },
        setUpMockElements: function setUpMockElements() {
            var $viewContainer = $('<form onsubmit="return false"/>').append('<select id="default-option-select">\n                    <option id="-1" value="\'\'">1</option>\n                    <option id="1">1</option>\n                    <option id="2">2</option>\n                 </select>', '<div id="addAllAvailableOptions"/>', '<div id="removeAllSelectedOptions"/>', '<ul id="selectedOptions">\'\n                    <li id="selectedOptions_1">1</li>\n                </ul>', '<ul id="availableOptions">\n                    <li id="availableOptions_2">2</li>\n                </ul>', '<button id="submitSave"/>');
            $viewContainer.appendTo("#qunit-fixture");
            return $viewContainer;
        }
    });

    test('Events are bound correctly', function () {
        this.issueFieldView.ui.addAllButton.click();
        ok(this.moveAllSpy.calledOnce);
        this.issueFieldView.ui.removeAllButton.click();
        ok(this.moveAllSpy.calledTwice);
        this.issueFieldView.ui.submitButton.click();
        ok(this.submitformSpy.calledOnce);
    });
    test('Initialized correctly', function () {
        // ui-sortable class is added by jQuery UI library when sorting is initialized
        ok(this.issueFieldView.ui.selectedOptions.hasClass('ui-sortable'));
        ok(this.issueFieldView.ui.availableOptions.hasClass('ui-sortable'));
        ok(this.restrictOptionsSpy.calledOnce);
    });
    //tests moveAll method
    test('Add/remove all options buttons works correctly', function () {
        this.issueFieldView.ui.addAllButton.click();
        var selectedOptions = this.issueFieldView.getSelectedOptions().replace(/selectedOptions=/g, "").split('&');
        deepEqual(selectedOptions, ['1', '2']);
        this.issueFieldView.ui.removeAllButton.click();
        selectedOptions = this.issueFieldView.getSelectedOptions().replace(/selectedOptions=/g, "").split('&');
        deepEqual(selectedOptions, ['']);
    });
    // tests restrictOptions method
    test('Select options are displayed correctly', function () {
        this.restrictOptionsSpy.reset(); // view init called this method
        this.issueFieldView.ui.addAllButton.click();
        ok(this.restrictOptionsSpy.calledOnce);
        var visibleDefaultOptions = this.issueFieldView.ui.defaultOptionSelect.find('option:not(".hidden")').map(function (i, el) {
            return el.id;
        }).get();
        deepEqual(visibleDefaultOptions, ['-1', '1', '2']);
        this.issueFieldView.ui.removeAllButton.click();
        ok(this.restrictOptionsSpy.calledTwice);
        visibleDefaultOptions = this.issueFieldView.ui.defaultOptionSelect.find('option:not(".hidden")').map(function (i, el) {
            return el.id;
        }).get();
        deepEqual(visibleDefaultOptions, ['-1']);
    });
    // tests getSelectedOptions method
    test('Serialization works correctly', function () {
        this.issueFieldView.ui.addAllButton.click();
        equal(this.issueFieldView.getSelectedOptions(), 'selectedOptions=1&selectedOptions=2');
        this.issueFieldView.ui.removeAllButton.click();
        equal(this.issueFieldView.getSelectedOptions(), 'selectedOptions=');
    });
    // tests submitForm method and getSelectedOptions method
    test('Form data is updated correctly before submission', function () {
        equal(this.issueFieldView.$el.attr('action'), undefined);
        this.issueFieldView.ui.addAllButton.click();
        this.getSelectedOptionsSpy.reset();
        this.issueFieldView.ui.submitButton.click();
        ok(this.getSelectedOptionsSpy.calledOnce);
        equal(this.issueFieldView.$el.attr('action'), '?selectedOptions=1&selectedOptions=2');
    });
});