define('jira/issuenavigator/issue-navigator', ['jira/issues/search/legacyissuenavigator'], function (LegacyIssueNavigator) {
    /**
     * Represents an the Issue Navigator page.  This class should be used to retrieve information from the
     * issue navigator such as the currently selected row, currently selected issue key and so on.
     *
     * @deprecated should all be superceded by {@link JIRA.Issues.Api}.
     * @exports jira/issuenavigator/issue-navigator
     * @namespace JIRA.IssueNavigator
     */
    return LegacyIssueNavigator;
});
/** @deprecated */AJS.namespace("jira.app.issuenavigator", null, require('jira/issuenavigator/issue-navigator'));
/** @deprecated */AJS.namespace('JIRA.IssueNavigator', null, require('jira/issuenavigator/issue-navigator'));
/** @deprecated */
AJS.namespace('JIRA.Settings.ApplicationTitle.get', null, function () {
    'use strict';

    return require('jira/util/data/meta').get('app-title');
});