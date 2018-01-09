/**
 * JIRA's module for using [jQuery.Deferred]{@link https://api.jquery.com/category/deferred-object/}
 * objects in JIRA's UI.
 *
 * Differs from the AMD module in jQuery's source, in that it returns the actual
 * Deferred constructor instead of the root jQuery object.
 *
 * @module jquery/deferred
 * @requires external:jQuery
 * @exports external:"jQuery.Deferred"
 */
define('jira/jquery/deferred', ['jquery'], function($) {
    return $.Deferred;
});
