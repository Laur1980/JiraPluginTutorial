define('jira/issue', ['jira/issues/search/legacyissue'], function (LegacyIssue) {
    /**
     * Represents the View Issue page.  This class should be used to get the current issue key
     * and any other issue centric information!
     *
     * @deprecated should all be superceded by {@link JIRA.Issues.Api}.
     * @exports jira/issue
     * @namespace JIRA.Issue
     */

    return LegacyIssue;
});
/** @deprecated */AJS.namespace("jira.app.issue", null, require('jira/issue'));
/** @deprecated */AJS.namespace("JIRA.Issue", null, require('jira/issue'));