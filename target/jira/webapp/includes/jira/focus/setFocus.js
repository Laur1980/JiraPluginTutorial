define('jira/focus/set-focus', ['jira/dialog/dialog', 'jquery'], function (Dialog, jQuery) {
    var _defaultExcludeParentSelector = 'form.dont-default-focus';
    var _defaultFocusElementSelector = 'input:not(#issue-filter-submit), select, textarea, button, a.cancel';
    var _defaultParentElementSelectors = ["." + Dialog.ClassNames.CONTENT_AREA, 'form.aui', 'form'];
    var _configurationStack = [];

    var _focusIn = function _focusIn(context, parentSelector, excludeParentSelector, elementSelector) {
        var found = false;
        jQuery(parentSelector, context).not(excludeParentSelector).find(elementSelector).each(function () {
            var elem = jQuery(this);
            if (elem.is(":enabled, a") && elem.is(":visible")) {
                elem.focus();
                if (elem.is(":text, :password, textarea")) {
                    if (elem.is(".focus-select-end")) {
                        elem.setCaretToPosition(elem[0].value.length);
                    } else {
                        elem.setSelectionRange(0, elem[0].value.length);
                    }
                }
                found = true;
                return false; // break loop, we're done
            }
        });
        return found;
    };

    var _defaultFocusNow = function _defaultFocusNow() {
        var i = 0;
        var currentConfig = _configurationStack[_configurationStack.length - 1];
        while (!_focusIn(currentConfig.context, currentConfig.parentElementSelectors[i], currentConfig.excludeParentSelector, currentConfig.focusElementSelector) && i < currentConfig.parentElementSelectors.length) {
            i++;
        }
    };

    return {

        FocusConfiguration: function FocusConfiguration() {
            this.context = document;
            this.excludeParentSelector = _defaultExcludeParentSelector;
            this.focusElementSelector = _defaultFocusElementSelector;
            this.parentElementSelectors = _defaultParentElementSelectors.slice(0);
            this.focusNow = _defaultFocusNow;
        },

        triggerFocus: function triggerFocus() {
            if (_configurationStack.length === 0) {
                _configurationStack.push(new this.FocusConfiguration());
            }
            _configurationStack[_configurationStack.length - 1].focusNow();
        },

        pushConfiguration: function pushConfiguration(configuration) {
            _configurationStack.push(configuration);
        },

        popConfiguration: function popConfiguration() {
            _configurationStack.pop();
        }
    };
});

AJS.namespace('JIRA.setFocus', null, require('jira/focus/set-focus'));