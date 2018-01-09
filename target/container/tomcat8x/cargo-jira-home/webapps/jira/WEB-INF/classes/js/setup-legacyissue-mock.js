/**
 * @fileOverview
 * There are some AMD modules that come from the issuenav plugin
 * that are not available during setup. The missing modules aren't
 * actually used in setup, but their absence causes problems/
 *
 * This file mocks them out.
 *
 * @see {@linkplain atlassian-plugins-jira-issue-nav-plugin-mock.xml}
 */
define('jira/issues/search/legacyissue', {});
define('jira/issues/search/legacyissuenavigator', {});
define('jira/issues/search/legacyissuenavigatorshortcuts', {});