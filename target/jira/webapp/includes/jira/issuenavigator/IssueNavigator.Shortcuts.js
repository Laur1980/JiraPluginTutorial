define('jira/issuenavigator/issue-navigator/shortcuts', ['jira/issues/search/legacyissuenavigatorshortcuts'], function (LegacyIssueNavigatorShortcuts) {
    /**
     * @deprecated should all be superceded by {@link JIRA.Issues.Api}.
     * @exports jira/issuenavigator/issue-navigator/shortcuts
     * @namespace JIRA.IssueNavigator.Shortcuts
     */
    return LegacyIssueNavigatorShortcuts;
});
/** @deprecated */AJS.namespace("jira.app.issuenavigator.shortcuts", null, require('jira/issuenavigator/issue-navigator/shortcuts'));
/** @deprecated */AJS.namespace("JIRA.IssueNavigator.Shortcuts", null, require('jira/issuenavigator/issue-navigator/shortcuts'));