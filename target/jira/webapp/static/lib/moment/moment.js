/**
 * @fileOverview
 * Pulls in the core Moment.js library, defines JIRA's i18n mappings,
 * then returns a moment instance that always uses the correct i18n setting.
 * See {@link http://momentjs.com/docs/#/i18n/instance-locale/} for details
 * on Moment.js' (changes in its) support for i18n.
 */

/**
 * @module jira/moment
 */
define('jira/moment', ['jira/moment/moment.jira.i18n'], function(moment) {

    /**
     * Splits @value into parts defined by @format.
     * If some of the values cannot by matched than this value will be NaN.
     * This method supports only strftime-like format(see Calendar.js file).
     * @param {String} value
     * @param {String} format
     * @returns {parts: {Array}, year: {Number}, month: {Number}, day: {Number}, hour: {Number}, minute: {Number}}
     */
    moment.splitDate = function (value, format) {
        return Date.splitDate(value, format)
    };

    return moment;
});
