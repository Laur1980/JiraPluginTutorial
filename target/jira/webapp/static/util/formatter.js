/* global AJS */
/**
 * Utility functions for translating or interpolating text.
 * @module jira/util/formatter
 */
define('jira/util/formatter', ['exports', 'jira/util/data/meta'], function (exports, Meta) {
  'use strict';

  /**
   * Takes a string with placeholder markers and a variable number of arguments
   * to substitute in to it, and returns an interpolated string.
   * @type {function}
   * @returns {string} an interpolated string
   */

  var formatText = AJS.format.bind(AJS);

  /**
   * @note This function's implementation will only ever be invoked
   * during tests or other scenarios where web-resource transformations
   * did not occur to actually replace the untranslated text before
   * getting to production.
   * @param {string} i18nString the translation string from the .properties file.
   *     the string can mark placeholders in the form of \{0\}, \{1\}, etc.
   * @param {...string} [subValues] any number of values to substitute in to the
   *     translation string.
   * @returns {string} a translated string with any values substituted
   *     in the order they were provided.
   */
  function getTranslatedText() {
    return AJS.I18n.getText.apply(AJS.I18n, arguments);
  }

  // Only supports formatting integers to match the user locale.
  // Can be extended to support more complex formatting, and decimals, if necessary.
  function formatNumber(integer) {
    var groupSeparator = Meta.get('user-locale-group-separator') || '';
    // Replace every character boundary that is not a word boundary, and is followed by a multiple of 3 of digits,
    // with the groupSeparator
    return integer.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  }

  /**
   * A generic formatter. Exposed so as to support the web-resource manager's
   * substitution of {@link #I18n.getText} calls with formatting calls.
   * Do not use this function directly. Use {@link #formatText} instead.
   * @private
   * @type {function}
   */
  exports.format = formatText;
  exports.formatNumber = formatNumber;
  exports.formatText = formatText;
  exports.I18n = {};
  exports.I18n.getText = getTranslatedText;
});