var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Dark features are features that can enabled and disabled per user via a feature key. Their main use is to allow
 * in-development features to be rolled out to production in a low-risk fashion.
 */
define('jira/ajs/dark-features', ['jira/util/data/meta'], function (Meta) {
    /**
     * Returns an array containing the feature keys of all enabled dark features by using AJS.Meta. If there is no
     * <meta> information on the page, returns an empty array.
     */
    function readHtmlMetaTag() {
        try {
            var ajsMeta = JSON.parse(Meta.get('enabled-dark-features'));
            if ((typeof ajsMeta === 'undefined' ? 'undefined' : _typeof(ajsMeta)) === 'object') {
                return ajsMeta;
            }
        } catch (err) {}
        // return [] if AJS.Meta isn't defined


        // return an empty array instead of crashing
        return [];
    }

    var featuresArray = readHtmlMetaTag();
    var features = {};
    for (var i = 0, ii = featuresArray.length; i < ii; i++) {
        features[featuresArray[i]] = true;
    }

    return {
        isEnabled: function isEnabled(key) {
            return !!features[key];
        },

        enable: function enable(key) {
            if (key && !features[key]) features[key] = true;
        },

        disable: function disable(key) {
            if (key && features[key]) delete features[key];
        }
    };
});

AJS.namespace('AJS.DarkFeatures', null, require('jira/ajs/dark-features'));