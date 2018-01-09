define('jira/ajs/avatarpicker/avatar-store', ['jira/util/urls', 'jira/util/formatter', 'jira/ajs/avatarpicker/avatar-util', 'jira/ajs/avatarpicker/avatar-factory', 'jira/ajs/ajax/smart-ajax', 'jira/lib/class', 'jquery'], function (urls, formatter, AvatarUtil, AvatarFactory, SmartAjax, Class, jQuery) {
    /**
     * Persistent storage mechanism for JIRA.Avatar
     *
     * This default store uses a CRUD rest interface. There are several parameters to provide. Any optional rest URL
     * parameters are simply not invoked.
     *
     * @param restQueryUrl
     *      Mandatory. Retrieves the list of available avatars to pick from.
     *      Type: GET
     * e.g. URL: http://jira.com/rest/api/latest/project/HSP/avatars
     *      Response: {"system":[{"id":10001,"isSystemAvatar":true,"selected":false}], "custom": [{"id":10002,"isSystemAvatar":false,"selected":false}]}
     *
     * @param restUpdateUrl
     *      Optional. Sets the avatar as the selection for the owner.
     *      Type: PUT
     * e.g. URL: http://jira.com/rest/api/latest/project/HSP/avatar
     *      Request: {"id":10001,"isSystemAvatar":true,"selected":false}
     *
     * @param restCreateTempUrl
     *      Mandatory. Uploads a file and stores it as the session's temporary avatar
     *      Type: Wildcard
     * e.g. URL: http://jira.com/rest/api/latest/project/HSP/avatar/temporary
     *      Request: io stream (for supporting browsers) or multipart
     *
     * @param restUpdateTempUrl
     *      Mandatory. Crops the temporary avatar. This may also be a good time to convert it into a real avatar, but that
     *      will not always be the case, e.g. when an owner (project, user, etc) is still in the process of being created.
     *      Type: POST
     * e.g. URL: http://jira.com/rest/api/latest/project/HSP/avatar
     *      Request: {"cropperOffsetX":"90","cropperOffsetY":"57","cropperWidth":"143"}
     *
     * @param restSingleAvatarUrl
     *      Optional. Deletes avatar.
     *      Type: DELETE
     * e.g. URL: http://jira.com/rest/api/latest/project/HSP/avatar
     *      Request: {"id":10001,"isSystemAvatar":true,"selected":false}
     *
     * @param restParams
     *      Optional. e.g. {username: "admin"}
     *
     * @param defaultAvatarId
     *      Mandatory. Used if the currently selected avatar is deleted.
     *
     * Note: If you want to use a different storage mechanism, you can implement the same interface as here and pass it to the
     * constructor of your JIRA.AvatarManager
     */
    return Class.extend({

        TEMP_ID: "TEMP",

        /**
         * @constructor
         * @param options
         * ... {String} restQueryUrl - Retrieves the list of available avatars to pick from (see class description)
         * ... {String} restUpdateUrl - Sets the avatar as the selection for the owner (see class description)
         * ... {String} restCreateTempUrl - Uploads a file and stores it as the session's temporary avatar (see class description)
         * ... {String} restUpdateTempUrl - Crops the temporary avatar (see class description)
         * ... {String} restSingleAvatarUrl - Deletes avatar (see class description)
         * ... {String} restParams - The optional query parameters to append to the base URL for rest requests (see class description)
         * ... {Number} defaultAvatarId - The id of default avatar. The selected avatar if user has not selected one yet.
         */
        init: function init(options) {

            if (!options.restQueryUrl) {
                throw new Error("JIRA.AvatarStore.init: You must specify [restQueryUrl], The rest url for querying avatars (see class description)");
            }

            if (!options.restCreateTempUrl) {
                throw new Error("JIRA.AvatarStore.init: You must specify [restCreateTempUrl], The rest url for creating a temporary avatar (see class description)");
            }

            if (!options.restUpdateTempUrl) {
                throw new Error("JIRA.AvatarStore.init: You must specify [restUpdateTempUrl], The rest url for updating a temporary avatar (see class description)");
            }

            if (!options.defaultAvatarId) {
                throw new Error("JIRA.AvatarStore.init: You must specify [defaultAvatarId] to the contructor so the store " + "knows what to select if you delete the selected one");
            }

            this.restQueryUrl = options.restQueryUrl;
            this.restUpdateUrl = options.restUpdateUrl;
            this.restCreateTempUrl = options.restCreateTempUrl;
            this.restUpdateTempUrl = options.restUpdateTempUrl;
            this.restSingleAvatarUrl = options.restSingleAvatarUrl;
            this.restParams = options.restParams || {};
            this.restParams.atl_token = urls.atl_token();
            this.defaultAvatarId = options.defaultAvatarId;
            this.avatars = { system: [], custom: [] };
        },

        /**
         * Builds the REST URL using the given url and optional restParams options.
         */
        _buildCompleteUrl: function _buildCompleteUrl(url) {
            var completeUrl = url;

            if (this.restParams) {
                var queryParams = '';
                for (var name in this.restParams) {
                    queryParams += formatter.format('&{0}={1}', encodeURIComponent(name), encodeURIComponent(this.restParams[name]));
                }

                completeUrl += '?' + queryParams.substr(1);
            }

            return completeUrl;
        },

        /**
         * Retrieves the Avatar by id.
         *
         * @param avatarId the avatar's id, must not be null.
         * @return the avatar with the given id or null if it doesn't exist.
         */
        getById: function getById(avatarId) {

            var match;

            jQuery.each(this.avatars.system, function (i, avatar) {
                if (this.getId() === avatarId) {
                    match = avatar;
                    return false;
                }
            });

            if (!match) {
                jQuery.each(this.avatars.custom, function (i, avatar) {
                    if (this.getId() === avatarId) {
                        match = avatar;
                        return false;
                    }
                });
            }

            return match;
        },

        /**
         * Checks if the given avatar is the temporarty avatar.
         *
         * @param avatar
         * @return true if it is the temporary avatar, false if otherwise.
         */
        isTempAvatar: function isTempAvatar(avatar) {
            return avatar.getId() === this.TEMP_ID;
        },

        /**
         * Update client side storage
         *
         * @param avatar
         */
        _selectAvatar: function _selectAvatar(avatar) {

            var selected = this.getSelectedAvatar();

            if (selected) {
                selected.setUnSelected();
            }
            avatar.setSelected();
        },

        /**
         * Selects avatar, this will become the displayed avatar for the given type (ie project)
         *
         * @param {JIRA.Avatar} avatar
         * @param {Object} options
         * ... {Function(JIRA.Avatar)} success - ajax callback
         * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
         */
        selectAvatar: function selectAvatar(avatar, options) {

            var instance = this;

            if (!avatar) {
                throw new Error("JIRA.AvatarStore.selectAvatar: Cannot select Avatar that does not exist");
            }

            if (this.restUpdateUrl) {
                SmartAjax.makeRequest({
                    type: "PUT",
                    contentType: "application/json",
                    dataType: "json",
                    url: this._buildCompleteUrl(this.restUpdateUrl),
                    data: JSON.stringify(avatar.toJSON()),
                    success: function success() {
                        instance._selectAvatar(avatar);
                        if (options.success) {
                            options.success.call(this, avatar);
                        }
                    },
                    error: options.error
                });
            } else {
                instance._selectAvatar(avatar);
                if (options.success) {
                    options.success.call(this, avatar);
                }
            }
        },

        /**
         * Removes avatar in client side store
         *
         * @param {JIRA.Avatar} avatar
         */
        _destory: function _destory(avatar) {

            var index = jQuery.inArray(avatar, this.avatars.custom);

            if (index !== -1) {
                this.avatars.custom.splice(index, 1);
            } else {
                throw new Error("JIRA.AvatarStore._destroy: Cannot remove avatar [" + avatar.getId() + "], " + "it might be a system avatar (readonly) or does not exist.");
            }
        },

        /**
         * Permanently removes the avatar from the system.
         *
         * @param {JIRA.Avatar} avatar - must not be null.
         * @param {Object} options
         * ... {Function(JIRA.Avatar)} success - ajax callback
         * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
         */
        destroy: function destroy(avatar, options) {

            var instance = this;

            options = options || {};

            if (!avatar) {
                throw new Error("JIRA.AvatarStore.destroy: Cannot delete Avatar that does not exist");
            }

            SmartAjax.makeRequest({
                type: "DELETE",
                url: this.getRestUrlForAvatar(avatar),
                success: function success() {
                    instance._destory(avatar);
                    if (avatar.isSelected()) {
                        instance.selectAvatar(instance.getById(instance.defaultAvatarId), options);
                    } else if (options.success) {
                        options.success.apply(this, arguments);
                    }
                },
                error: options.error
            });
        },

        /**
         * Gets selected avatar, the displayed avatar for the given type (ie project)
         *
         * @return {JIRA.Avatar}
         */
        getSelectedAvatar: function getSelectedAvatar() {

            for (var i = 0; i < this.avatars.custom.length; i++) {
                if (this.avatars.custom[i].isSelected()) {
                    return this.avatars.custom[i];
                }
            }

            for (i = 0; i < this.avatars.system.length; i++) {
                if (this.avatars.system[i].isSelected()) {
                    return this.avatars.system[i];
                }
            }
        },

        /**
         * Updates avatar in our client side store
         *
         * @param {JIRA.Avatar} avatar
         */
        _update: function _update(avatar) {

            var instance = this;

            if (this.getById(avatar.getId())) {
                jQuery.each(this.avatars.custom, function (i) {
                    if (this.getId() === avatar.getId()) {
                        instance.avatars.custom[i] = avatar;
                    }
                });
            } else {
                throw new Error("JIRA.AvatarStore._update: Cannot update avatar [" + avatar.getId() + "], " + "it might be a system avatar (readonly) or does not exist.");
            }
        },

        /**
         * Updates an avatar's properties to match those in the given avatar. The avatar
         * to change is identified by the id of the given avatar.
         *
         * @param {JIRA.Avatar} avatar - the avatar to update, must not be null.
         * @param {Object} options
         * ... {Function(JIRA.Avatar)} success - ajax callback
         * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
         */
        update: function update(avatar, options) {

            var instance = this;

            options = options || {};

            SmartAjax.makeRequest({
                type: "PUT",
                url: this.getRestUrlForAvatar(avatar),
                error: options.error,
                success: function success() {
                    instance._update(avatar);
                    if (options.success) {
                        options.success.apply(this, arguments);
                    }
                }
            });
        },

        /**
         * Adds avatar to our client side store
         *
         * @param avatar
         */
        _add: function _add(avatar) {
            if (avatar.isSystemAvatar()) {
                this.avatars.system.push(avatar);
            } else {
                this.avatars.custom.push(avatar);
            }
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

            var instance = this;

            options = options || {};

            if (this.restUpdateTempUrl) {
                SmartAjax.makeRequest({
                    type: "POST",
                    url: this._buildCompleteUrl(this.restUpdateTempUrl),
                    data: JSON.stringify(instructions),
                    contentType: "application/json",
                    dataType: "json",
                    success: function success(data) {

                        // If no data is returned, no real avatar was created and the temporary avatar has just been updated with the cropping instructions
                        if (!data) {
                            data = {
                                id: instance.TEMP_ID,
                                isSelected: true
                            };
                        }
                        var avatar = AvatarFactory.createCustomAvatar(data);
                        instance._add(avatar);

                        if (options.success) {
                            options.success.call(this, data);
                        }
                    },
                    error: options.error
                });
            }
        },

        /**
         *
         * Creates temporary avatar on server
         *
         * @param {HTMLElement} fileInput
         * @param {Object} options
         * ... {Function} success
         * ... {Function} error
         */
        createTemporaryAvatar: function createTemporaryAvatar(fileInput, options) {
            // add the restParams as option
            options = jQuery.extend(true, {}, options, { params: this.restParams });

            AvatarUtil.uploadTemporaryAvatar(this.restCreateTempUrl, fileInput, options);
        },

        /**
         * Resets store with the Avatars created from the supplied JSON
         *
         * @param JSON avatar descriptors
         */
        _refresh: function _refresh(avatars) {

            var instance = this;

            instance.avatars.system = [];
            instance.avatars.custom = [];

            if (avatars.system) {
                jQuery.each(avatars.system, function (i, descriptor) {
                    instance.avatars.system.push(AvatarFactory.createSystemAvatar(descriptor));
                });
            }

            if (avatars.custom) {
                jQuery.each(avatars.custom, function (i, descriptor) {
                    instance.avatars.custom.push(AvatarFactory.createCustomAvatar(descriptor));
                });
            }
        },

        /**
         * Goes back to the server and retrievs all avatars
         *
         * @param {Object} options
         * ... {Function} success
         * ... {Function} error
         */
        refresh: function refresh(options) {

            var instance = this;

            // Remember the temporary avatar if we have one
            var tempAvatar = this.getById(instance.TEMP_ID);

            options = options || {};

            SmartAjax.makeRequest({
                url: this._buildCompleteUrl(this.restQueryUrl),
                error: options.error,
                success: function success(avatars) {
                    instance._refresh(avatars);
                    if (tempAvatar) {
                        instance._add(tempAvatar);
                    }
                    if (options.success) {
                        options.success.apply(this, arguments);
                    }
                }
            });
        },

        /**
         * Gets all avatars, custom and system
         *
         * @return {Object}
         * ... {Array<JIRA.Avatar>} system
         * ... {Array<JIRA.Avatar>} custom
         */
        getAllAvatars: function getAllAvatars() {
            return this.avatars;
        },

        /**
         * Provides an array of all system avatars.
         *
         * @return the system avatars, never null.
         */
        getAllSystemAvatars: function getAllSystemAvatars() {
            return this.avatars.system;
        },

        /**
         * Provides an array of all system avatars.
         *
         * @return the custom avatars.
         */
        getAllCustomAvatars: function getAllCustomAvatars() {
            return this.avatars.custom;
        },

        /**
         * Gets rest url to update a single avatar
         *
         * @param avatar
         */
        getRestUrlForAvatar: function getRestUrlForAvatar(avatar) {
            return this._buildCompleteUrl(this.restSingleAvatarUrl + "/" + avatar.getId());
        }
    });
});