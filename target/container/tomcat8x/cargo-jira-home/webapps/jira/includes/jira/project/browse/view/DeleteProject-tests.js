var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

AJS.test.require('jira.webresources:delete-project-progress', function () {
    var $ = require('jquery');
    var DeleteProject = require('jira/project/browse/deleteproject');

    var getHTML = function getHTML() {
        return '<div id="delete-project-progress" class="aui-progress-indicator">' + '<span class="aui-progress-indicator-value"></span>' + '<span id="delete-project-progress-value"></span>' + '</div>';
    };

    var hasAttr = function hasAttr(element, attr) {
        return _typeof(element.attr(attr)) !== (typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined)) && element.attr(attr) !== false;
    };

    module('DeleteProject', {
        setup: function setup() {
            $('#qunit-fixture').append(getHTML());
        }
    });

    test('Should convert percentage to decimal', function () {
        var percentage_element = $('#delete-project-progress-value');
        var decimal_element = $('#delete-project-progress');

        percentage_element.attr('data-value', 20);
        DeleteProject();
        ok(decimal_element.attr('data-value') === '0.2', 'should convert 20 to 0.2');

        percentage_element.attr('data-value', 0);
        DeleteProject();
        ok(decimal_element.attr('data-value') === '0', 'should convert 0 to 0');
    });

    test('Should set progress bar to indeterminate if no percentage given', function () {
        var decimal_element = $('#delete-project-progress');

        DeleteProject();
        ok(!hasAttr(decimal_element, 'data-value'), 'should remove data-value attribute');
    });

    test('Should set progress bar to indeterminate if percentage is not a number', function () {
        var percentage_element = $('#delete-project-progress-value');
        var decimal_element = $('#delete-project-progress');

        percentage_element.attr('data-value', 'not a number');
        DeleteProject();
        ok(!hasAttr(decimal_element, 'data-value'), 'should remove data-value attribute');
    });
});