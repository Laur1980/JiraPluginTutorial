define('jira/dropdown/auto-complete', ['require'], function (require) {
    var objects = require('jira/util/objects');
    var jQuery = require('jquery');
    var jiraDropdown = require('jira/dropdown');

    /**
     * Standard dropdown constructor
     * @constructor JIRA.Dropdown.AutoComplete
     * @extends JIRA.Dropdown
     * @param {HTMLElement} trigger
     * @param {HTMLElement} dropdown
     * @return {Object} - instance
     */
    return function (trigger, dropdown) {

        /** @lends JIRA.Dropdown.AutoComplete.prototype */
        var that = objects.begetObject(jiraDropdown);

        that.init = function (trigger, dropdown) {

            this.addInstance(this);
            this.dropdown = jQuery(dropdown).click(function (e) {
                // lets not hide dropdown when we click on it
                e.stopPropagation();
            });
            this.dropdown.css({ display: "none" });

            // this instance is triggered by a method call
            if (trigger.target) {
                jQuery.aop.before(trigger, function () {
                    if (!that.displayed) {
                        that.displayDropdown();
                    }
                });

                // this instance is triggered by a click event
            } else {
                trigger.click(function (e) {
                    if (!that.displayed) {
                        that.displayDropdown();
                        e.stopPropagation();
                    }
                });
            }

            // hide dropdown when click anywhere other than on this instance
            jQuery(document.body).click(function () {
                if (that.displayed) {
                    that.hideDropdown();
                }
            });
        };

        that.init(trigger, dropdown);

        return that;
    };
});

AJS.namespace('JIRA.Dropdown.AutoComplete', null, require('jira/dropdown/auto-complete'));