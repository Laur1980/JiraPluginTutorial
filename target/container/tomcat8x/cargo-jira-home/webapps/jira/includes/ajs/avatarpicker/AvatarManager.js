define('jira/ajs/avatarpicker/avatar-manager', ['jira/util/formatter', 'jira/lib/class', 'wrm/context-path', 'jquery'], function (formatter, Class, wrmContextPath, jQuery) {
    'use strict';

    var contextPath = wrmContextPath();

    /**
     * Manager interface for JIRA.Avatar objects.
     *
     * You should use this for creating, manipulating and deleteing of avatars. Helper methods such as getting avatar
     * urls are also contained within this class.
     *
     * Please use the factory methods for construction
     *
     * @Class JIRA.AvatarManager
     */
    return Class.extend({

        /**
         * @param options
         * @param {JIRA.AvatarStore} options.store
         * @param {Number|String} options.defaultAvatarId - This is the avatar that is currently in use if no other have been selected
         * @param {Number|String} options.anonymousAvatarId - In the case of user avatar, this is the one used for logged out/or annonymous users
         * @param {String} options.avatarSrcBaseUrl - The base url used to load the avatar image
         */
        init: function init(options) {
            this.store = options.store;
            this.ownerId = options.ownerId;
            this.username = options.username;
            this.anonymousAvatarId = options.anonymousAvatarId;
            this.avatarSrcBaseUrl = options.avatarSrcBaseUrl;
        },

        /**
         * Selects avatar, this will become the displayed avatar for the given type (ie project)
         *
         * @param avatar
         * @param options
         */
        selectAvatar: function selectAvatar(avatar, options) {
            return this.store.selectAvatar(avatar, options);
        },

        /**
         * Retrieve the avatar with the given id.
         *
         * @param avatarId must not be null.
         * @param {Object} options
         * ... {Function} success
         * ... {Function} error
         */
        getById: function getById(id) {
            return this.store.getById(id);
        },

        /**
         * Delete the avatar
         *
         * @param {String} avatar must not be null.
         */
        destroy: function destroy(avatar, options) {
            this.store.destroy(avatar, options);
        },

        /**
         * Saves the avatar as an updated version of the avatar with the same id that is already in the store.
         *
         * @param {JIRA.Avatar} avatar must not be null.
         * @param {Object} options
         * ... {Function} success
         * ... {Function} error
         */
        update: function update(avatar, options) {
            this.store.update(avatar, options);
        },

        /**
         * Creates a database record for the given avatar. Use the return value as the persistent avatar, not the one you
         * passed in.
         *
         * @param {JIRA.Avatar} avatar must not be null, must have a null id.
         * @param {Object} options
         * ... {Function} success
         * ... {Function} error
         */
        add: function add(avatar, options) {
            this.store._add(avatar, options);
        },

        /**
         * Provides a list of all system avatars.
         *
         * Note: You will need to call refreshStore first
         *
         * @return {Array<JIRA.Avatar>} the system avatars.
         */
        getAllSystemAvatars: function getAllSystemAvatars() {
            return this.store.getAllSystemAvatars();
        },

        /**
         * Provides an array of all system avatars.
         *
         * Note: You will need to call refreshStore first
         *
         * @return {Array<JIRA.Avatar>} the custom avatars.
         */
        getAllCustomAvatars: function getAllCustomAvatars() {
            return this.store.getAllCustomAvatars();
        },

        /**
         * Gets selected avatar
         *
         * @return JIRA.Avatar
         */
        getSelectedAvatar: function getSelectedAvatar() {
            return this.store.getSelectedAvatar();
        },

        /**
         *
         * Gets all avatars
         *
         * Note: You will need to call refreshStore first
         *
         * @return {Object}
         * ... {Array<JIRA.Avatar>} system
         * ... {Array<JIRA.Avatar>} custom
         */
        getAllAvatars: function getAllAvatars() {
            return this.store.getAllAvatars();
        },

        /**
         * Gets a JSON blob, that contains the img src of each avatar based on the supplied size
         *
         * @param {JIRA.Avatar.LARGE | JIRA.Avatar.MEDIUM | JIRA.Avatar.SMALL} size
         * @return {Object}
         * ... {Array[{id, src, isSystemAvatar}]} system
         * ... {Array[{id, src, isSystemAvatar}] custom
         */
        getAllAvatarsRenderData: function getAllAvatarsRenderData(size) {
            var i;
            var instance = this;
            var avatars = this.getAllAvatars();

            var renderData = {
                system: [],
                custom: []
            };

            for (i = 0; i < avatars.system.length; i++) {
                renderData.system.push(instance.getAvatarRenderData(avatars.system[i], size));
            }

            for (i = 0; i < avatars.custom.length; i++) {
                renderData.custom.push(instance.getAvatarRenderData(avatars.custom[i], size));
            }

            return renderData;
        },

        /**
         * Gets json descriptor of given avatar that contains the img src based on the supplied size
         * @param avatar
         * @param size
         */
        getAvatarRenderData: function getAvatarRenderData(avatar, size) {
            var data = avatar.toJSON();

            data.src = this.getAvatarSrc(avatar, size);
            data.width = size.width;
            data.height = size.height;

            return data;
        },

        /**
         * Refreshes avatar store
         *
         * @param options
         * ... {function} success
         * ... {function} error
         */
        refreshStore: function refreshStore(options) {
            this.store.refresh(options);
        },

        /**
         *
         * @param {JIRA.Avatar} avatar
         * @param {JIRA.Avatar.LARGE | JIRA.Avatar.MEDIUM | JIRA.Avatar.SMALL} size
         * @return String
         */
        getAvatarSrc: function getAvatarSrc(avatar, size) {

            if (this.store.isTempAvatar(avatar)) {
                // if the user chooses a new temporary avatar we need to keep making this url unique so that the image is kept fresh
                return contextPath + "/secure/temporaryavatar?" + jQuery.param({
                    cropped: true,
                    magic: new Date().getTime(),
                    size: size.param
                });
            }

            return avatar.getUrl(formatter.format('{0}x{1}', size.height, size.width));
        },

        /**
         * Creates temporary avatar from the value in the supplied file input field
         *
         * @param {HTMLElement} field
         * @param {Object} options
         * ... {function} success
         * ... {function} error
         */
        createTemporaryAvatar: function createTemporaryAvatar(field, options) {
            this.store.createTemporaryAvatar(field, options);
        },

        /**
         * Creates an avatar with the properties of the given avatar.
         *
         * @param {Object} instructions
         * ... {Number} cropperOffsetX
         * ... {Number} cropperOffsetY
         * ... {Number} cropperWidth
         *
         * @param {Object} options
         * ... {Function(JIRA.Avatar)} success - ajax callback
         * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
         */
        createAvatarFromTemporary: function createAvatarFromTemporary(instructions, options) {
            this.store.createAvatarFromTemporary(instructions, options);
        },

        /**
         * Gets the avatar id to use to represent an unknown or anonymous user
         * @return {Number} the avatar id for an anonymous user
         */
        getAnonymousAvatarId: function getAnonymousAvatarId() {
            return this.anonymousAvatarId;
        }

    });
});

// Factories

define('jira/ajs/avatarpicker/avatar-manager-factory', ['jira/ajs/avatarpicker/avatar-store', 'jira/ajs/avatarpicker/avatar-manager', 'wrm/context-path', 'exports'], function (AvatarStore, AvatarManager, wrmContextPath, exports) {
    'use strict';

    var contextPath = wrmContextPath();

    /**
     *
     * Creates a project avatar manager
     *
     * @param options
     * ... {String} projectKey
     * ... {String} projectId
     * ... {String} defaultAvatarId
     */
    exports.createUniversalAvatarManager = function (options) {
        // Cater for the projectKey being empty
        var restQueryUrl;

        var restUpdateUrl = "";
        var restCreateTempUrl = "";
        var restUpdateTempUrl = "";
        var restSingleAvatarUrl = "";

        if (options.projectId) {
            var urlAvatarOwnerPrefix = contextPath + "/rest/api/latest/universal_avatar/type/" + options.avatarType + "/owner/" + options.projectId;

            restQueryUrl = urlAvatarOwnerPrefix;

            var avatarCreateUrl = urlAvatarOwnerPrefix + "/avatar";

            restUpdateUrl = null;
            restCreateTempUrl = urlAvatarOwnerPrefix + "/temp";
            restUpdateTempUrl = avatarCreateUrl;
            restSingleAvatarUrl = avatarCreateUrl;
        } else {
            restQueryUrl = contextPath + "/rest/api/latest/avatar/project/system";
            restCreateTempUrl = contextPath + "/rest/api/latest/avatar/project/temporary";
            restUpdateTempUrl = contextPath + "/rest/api/latest/avatar/project/temporaryCrop";
        }

        var store = new AvatarStore({
            restQueryUrl: restQueryUrl,
            restUpdateUrl: restUpdateUrl,
            restCreateTempUrl: restCreateTempUrl,
            restUpdateTempUrl: restUpdateTempUrl,
            restSingleAvatarUrl: restSingleAvatarUrl,
            defaultAvatarId: options.defaultAvatarId
        });

        return new AvatarManager({
            store: store,
            ownerId: options.projectId,
            avatarSrcBaseUrl: contextPath + "/secure/projectavatar"
        });
    };

    /**
     *
     * Creates a project avatar manager
     *
     * @param options
     * ... {String} projectKey
     * ... {String} projectId
     * ... {String} defaultAvatarId
     */
    exports.createProjectAvatarManager = function (options) {
        options.avatarType = "project";

        return exports.createUniversalAvatarManager(options);
    };

    /**
     * Creates a user avatar manager
     *
     * @param options
     * ... {String} username
     * ... {String} defaultAvatarId
     */
    exports.createUserAvatarManager = function (options) {

        var userRestUrl = contextPath + "/rest/api/latest/user";
        var store = new AvatarStore({
            restQueryUrl: userRestUrl + "/avatars",
            restUpdateUrl: userRestUrl + "/avatar",
            restCreateTempUrl: userRestUrl + "/avatar/temporary",
            restUpdateTempUrl: userRestUrl + "/avatar",
            restSingleAvatarUrl: userRestUrl + "/avatar",
            restParams: { 'username': options.username },
            defaultAvatarId: options.defaultAvatarId
        });

        return new AvatarManager({
            store: store,
            username: options.username,
            avatarSrcBaseUrl: contextPath + "/secure/useravatar"
        });
    };
});