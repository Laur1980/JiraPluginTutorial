define('jira/legacy/meta', ['require', 'exports'], function (require, exports) {
    'use strict';

    var Meta = require('jira/util/data/meta');
    var deprecator = require('jira/deprecator');
    var params = require('aui/params');

    /**
     * @return {Object} the currently logged-in user
     * @deprecated use the {@amd jira/util/users} module instead.
     */
    exports.getLoggedInUser = function () {
        return {
            name: Meta.get('remote-user'),
            fullName: Meta.get('remote-user-fullname')
        };
    };

    /**
     * @return {String} the Project key for the currently-viewed issue. Blank if the current page isn't for an issue or project.
     * @deprecated Doesn't work.
     */
    exports.getProject = function () {
        return params.projectKey;
    };

    /**
     * @return {String} the key of the currently-viewed issue. Blank if the current page isn't for a viewed issue.
     * @deprecated use the {@amd jira/issue} module instead.
     */
    exports.getIssueKey = function () {
        return Meta.get('issue-key');
    };

    deprecator.prop(exports, 'getLoggedInUser', { sinceVersion: '7.0', removeInVersion: '8.0', alternativeName: 'module:jira/util/users/logged-in-user' });
    deprecator.prop(exports, 'getProject', { sinceVersion: '7.0', removeInVersion: '8.0' });
    deprecator.prop(exports, 'getIssueKey', { sinceVersion: '7.0', removeInVersion: '8.0', alternativeName: 'module:jira/issue' });
});

/**
 * JIRA.Meta represents meta-state about the current JIRA page - logged in user, etc.
 *
 * @deprecated add metadata to more appropriate business objects.
 */
AJS.namespace('JIRA.Meta', null, require('jira/legacy/meta'));