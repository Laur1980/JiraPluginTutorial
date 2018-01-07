define('jira/ajs/select/security/default-comment-security-level-model', ['jira/issue', 'jira/analytics', 'jira/lib/class', 'jira/util/strings', 'jquery', 'wrm/context-path'], function (IssueApi, analytics, Class, StringUtils, jQuery, contextPath) {
    'use strict';

    /**
     * Manages default security level api calls
     *
     * @class DefaultCommentSecurityLevelModel
     * @extends Class
     **/

    return Class.extend({

        DEFAULT_COMMENT_SECURITY_LEVEL_KEY_PREFIX: "default-comment-security-level-",

        /** @type {LvlObj} */_currentDefault: null,
        /** @type {String} */_preferenceKey: null,

        /**
         * Initialization method called during object creation
         *
         * @param {String} projectId - as the default is per project, its id is required during creation
         * @constructs
         * @see Class
         */
        init: function init(projectId) {
            this.NOT_SELECTED_DEFAULT = new this.LvlObj("", "");
            this._preferenceKey = this.DEFAULT_COMMENT_SECURITY_LEVEL_KEY_PREFIX + projectId;
        },

        /**
         * Object used for storage of default security level
         *
         * @param {String} level - level id, that is e.g. "role:10123"
         * @param {String} levelName - level text to display
         * @class LvlObj
         */
        LvlObj: function LvlObj(level, levelName) {
            this.level = level;
            this.levelName = levelName;
        },

        /**
         * Used to check for response error
         *
         * @param {Object} lvlObj - object containing security level to be validated - should be {@code LvlObj}
         * @returns {boolean}
         * @private
         */
        _isLvlObjValid: function _isLvlObjValid(lvlObj) {
            return !(typeof lvlObj['level'] === 'undefined' || typeof lvlObj['levelName'] === 'undefined');
        },

        /**
         * Store default security level object in current logged in users myPreferences
         *
         * @param {LvlObj} lvlObj - default security level object to be stored
         * @returns {XMLHttpRequest}
         * @private
         */
        _getDefaultStoreRequest: function _getDefaultStoreRequest(lvlObj) {
            return jQuery.ajax({
                url: contextPath() + "/rest/api/2/mypreferences?key=" + this._preferenceKey,
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(lvlObj)
            });
        },

        /**
         * Load default security level object from current logged in users myPreferences by using REST API
         *
         * @returns {XMLHttpRequest}
         * @private
         */
        _getDefaultLoadRequest: function _getDefaultLoadRequest() {
            return jQuery.ajax({
                url: contextPath() + "/rest/api/2/mypreferences?key=" + this._preferenceKey,
                type: "GET",
                contentType: "application/json",
                dataType: "json"
            });
        },

        /**
         * Handle for updating users default comment security level within the project that this control is created for
         * @see DefaultCommentSecurityLevelModel.init for project id
         *
         * @param {LvlObj} lvlObj - default security level object to be updated
         * @param {function()} onSuccess - callback to be executed on operation success
         * @param {function(XMLHttpRequest)} onError - callback to be executed on operation failure
         */
        updateDefault: function updateDefault(lvlObj, onSuccess, onError) {
            this._sendDefaultChangedAnalytics(lvlObj);
            this._getDefaultStoreRequest(lvlObj).done(function done() {
                // data is empty on success
                this._currentDefault = lvlObj;
                onSuccess();
            }.bind(this)).fail(function fail(xhr) {
                onError(xhr);
            });
        },

        /**
         * Returns currently stored default comment level for user within the project that the control is created for
         * @see DefaultCommentSecurityLevelModel.init for project id
         *
         * @param {function(LvlObj)} onSuccess - callback to be executed on operation success
         * @param {function(XMLHttpRequest)} onError - callback to be executed on operation failure
         */
        getDefault: function getDefault(onSuccess, onError) {
            if (this._currentDefault == null) {
                this._getDefaultLoadRequest().done(function done(data) {
                    if (this._isLvlObjValid(data)) {
                        this._currentDefault = data;
                    } else {
                        this._currentDefault = this.NOT_SELECTED_DEFAULT;
                    }
                    onSuccess(this._currentDefault);
                }.bind(this)).fail(function fail(xhr) {
                    if (xhr.status === 404) {
                        // 404 means there was no default set yet
                        this._currentDefault = this.NOT_SELECTED_DEFAULT;
                        onSuccess(this._currentDefault);
                    } else {
                        onError(xhr);
                    }
                }.bind(this));
            } else {
                onSuccess(this._currentDefault);
            }
        },

        /**
         *
         * @returns {LvlObj}
         */
        getCurrentDefault: function getCurrentDefault() {
            return this._currentDefault;
        },

        /**
         * Sends analytics event about default security level change
         *
         * @param {LvlObj} lvlObj - the default security level object that was updated to
         * @private
         */
        _sendDefaultChangedAnalytics: function _sendDefaultChangedAnalytics(lvlObj) {
            var projectIdHash = StringUtils.hashCode(this._preferenceKey);
            analytics.send({
                name: "jira.issue.comment.level.default.set",
                data: {
                    newDefaultlevelHash: StringUtils.hashCode(lvlObj.level.toString()),
                    projectIdHash: projectIdHash,
                    issueIdHash: StringUtils.hashCode(IssueApi.getIssueId().toString()),
                    wasSetToByAll: lvlObj.level === ""
                }
            });
        }
    });
});