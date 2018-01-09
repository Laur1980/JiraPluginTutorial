var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('jira/ajs/avatarpicker/avatar', ['jira/lib/class'], function (Class) {
    /**
     * Represents an icon for a project or some other entity in JIRA.
     *
     * @Class JIRA.Avatar
     *
     */
    return Class.extend({

        /**
         * @constructor
         * @param {object} options
         * @param {Number} options.id
         * @param {Boolean} options.isSystemAvatar
         * @param {object} [options.urls] an optional hash of avatar URLs
         */
        init: function init(options) {
            this._id = options.id;
            this._isSystemAvatar = options.isSystemAvatar;
            this._isSelected = options.isSelected;
            this._urls = options.urls;
        },

        /**
         * Sets as unselected
         */
        setUnSelected: function setUnSelected() {
            this._isSelected = false;
        },

        /**
         * Sets as selected
         */
        setSelected: function setSelected() {
            this._isSelected = true;
        },

        /**
         * Gets selected state
         */
        isSelected: function isSelected() {
            return !!this._isSelected;
        },

        /**
         * Indicates whether the Avatar is a system-provided one or if users have defined it.
         *
         * @return {Boolean} true only if the Avatar is a system-provided one.
         */
        isSystemAvatar: function isSystemAvatar() {
            return this._isSystemAvatar;
        },

        /**
         * The database identifier for the Avatar, may be null if it hasn't yet been stored.
         *
         * @return the database id or null.
         */
        getId: function getId() {
            return this._id;
        },

        /**
         * Returns the URL of this avatar in the given size.
         *
         * @param {string} size an avatar size
         * @return {string} the avatar URL
         */
        getUrl: function getUrl(size) {
            return this._urls[size];
        },

        /**
         * Serilaizes the object into a JSON object
         *
         * @return {Object}
         */
        toJSON: function toJSON() {
            return {
                id: this._id,
                isSystemAvatar: this._isSystemAvatar,
                isSelected: this._isSelected,
                urls: this._urls
            };
        }
    });
});

// Factories

define('jira/ajs/avatarpicker/avatar-factory', ['jira/ajs/avatarpicker/avatar', 'exports'], function (Avatar, exports) {
    /**
     * Creates custom avatar
     *
     * @param descriptor
     * ... {String} id
     */
    exports.createCustomAvatar = function createCustomAvatar(descriptor) {
        descriptor.isSystemAvatar = false;
        return new Avatar(descriptor);
    };

    /**
     * Creates system avatar
     *
     * @param descriptor
     * ... {String} id
     */
    exports.createSystemAvatar = function createSystemAvatar(descriptor) {
        descriptor.isSystemAvatar = true;
        return new Avatar(descriptor);
    };
});

// Sizes

define('jira/ajs/avatarpicker/avatar/sizes', ['exports', 'jquery'], function (exports, jQuery) {

    /**
     * Converts avatar size name to size object. If passed parameters is object is
     * returned unmodified.
     * @param name
     * @returns {JIRA.Avatar}
     */
    exports.getSizeObjectFromName = function (name) {
        if ("object" === (typeof name === 'undefined' ? 'undefined' : _typeof(name))) {
            return name;
        }
        var nameTrimmed = "string" === typeof name ? jQuery.trim(name) : "";
        if (exports.LARGE.param === name) {
            return exports.LARGE;
        } else if (exports.MEDIUM.param === name) {
            return exports.MEDIUM;
        } else if (exports.SMALL.param === name) {
            return exports.SMALL;
        } else if ("xsmall" === name) {
            // Java uses xmall name!#@$
            return exports.SMALL;
        } else {
            return exports.LARGE;
        }
    };

    /**
     * Large avatar settings
     */
    exports.LARGE = {
        param: "large",
        height: 48,
        width: 48
    };
    /**
     * Medium avatar settings
     */
    exports.MEDIUM = {
        param: "medium",
        width: 32,
        height: 32
    };
    /**
     * Small avatar settings
     */
    exports.SMALL = {
        param: "small",
        width: 16,
        height: 16
    };
});