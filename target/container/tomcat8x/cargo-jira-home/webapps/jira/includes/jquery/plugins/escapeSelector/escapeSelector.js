/**
 * Escape CSS selector
 * Technically - a backport of jQuery 3.0 escapeSelector
 *
 */
define('jira/jquery/plugins/escapeSelector', ['jira/polyfill/escapeCSSSelector', 'jquery'], function (escapeCSSSelector, $) {

    if (!$.escapeSelector) {
        $.escapeSelector = escapeCSSSelector;
    }

    return $.escapeSelector;
});

// make it available
(function () {
    require('jira/jquery/plugins/escapeSelector');
})();