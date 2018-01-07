define('jira/dropdown/standard', ['jira/dropdown', 'jira/util/objects'], function (jiraDropdown, objects) {
    /**
     * Standard dropdown constructor
     * @constuctor JIRA.Dropdown.Standard
     * @extends JIRA.Dropdown
     * @param {HTMLElement} trigger
     * @param {HTMLElement} dropdown
     * @return {JIRA.Dropdown} instance
     */
    return function (trigger, dropdown) {

        /** @lends JIRA.Dropdown.Standard.prototype */
        var that = objects.begetObject(jiraDropdown);
        that.init(trigger, dropdown);

        return that;
    };
});

AJS.namespace('JIRA.Dropdown.Standard', null, require('jira/dropdown/standard'));