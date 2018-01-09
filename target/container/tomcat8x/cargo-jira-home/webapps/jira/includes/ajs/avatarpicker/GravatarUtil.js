/**
 * Helper methods for showing Gravatar-related help text.
 */
define('jira/ajs/avatarpicker/gravatar-util', ['jquery', 'exports'], function (jQuery, exports) {

    exports.showGravatarHelp = function showGravatarHelp(data) {
        // response is in the form of  { entry: [] }
        if (typeof data !== 'undefined' && typeof data.entry !== 'undefined') {
            // hide the "sign up" text and show the "log in" text
            jQuery('.gravatar-signup-text').addClass('hidden');
            jQuery('.gravatar-login-text').removeClass('hidden');
        }
    };

    exports.displayGravatarHelp = function displayGravatarHelp() {
        var gravatarJsonUrl = jQuery('#gravatar_json_url');
        if (gravatarJsonUrl.length) {
            // use JSONP to determine whether the user has a Gravatar
            jQuery.ajax(gravatarJsonUrl.val(), {
                dataType: 'jsonp',
                success: exports.showGravatarHelp
            });
        }
    };
});