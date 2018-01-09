define('jira/util/navigator', ['internal/util/navigator', 'jira/util/data/meta', 'jquery'], function (internalNavigator, Meta, jQuery) {
  'use strict';

  /**
   * Can retrieve names and version numbers for the user's
   * browser and platform / operating system.
   *
   * This module should be used sparingly; you should
   * always prefer feature-detection over checking
   * properties defined here.
   *
   * @exports jira/util/navigator
   * @extends module:internal/util/navigator
   * @see The {@link https://stash.atlassian.com/projects/FE/repos/atlassian-navigator}
   *      repo for implementation details.
   */

  var Navigator = jQuery.extend({}, internalNavigator);

  /**
   * @function module:jira/util/navigator.isWin
   * @returns {boolean} true if the current operating system is Windows-based.
   */

  /**
   * @function module:jira/util/navigator.isMac
   * @returns {boolean} true if the current operating system is Apple OS X-based.
   */

  /**
   * @function module:jira/util/navigator.isLinux
   * @returns {boolean} true if the current operating system is Linux-based.
   */

  /**
   * @function module:jira/util/navigator.majorVersion
   * @returns {int} the major version of the current browser.
   */

  /**
   * @function module:jira/util/navigator.isIE
   * @returns {boolean} true if the current browser is Internet Explorer.
   */

  /**
   * @function module:jira/util/navigator.isEdge
   * @returns {boolean} true if the current browser is Microsoft Edge.
   */

  /**
   * @function module:jira/util/navigator.isWebkit
   * @returns {boolean} true if the current browser engine is webkit-based.
   */

  /**
   * @function module:jira/util/navigator.isSafari
   * @returns {boolean} true if the current browser is Safari.
   */

  /**
   * @function module:jira/util/navigator.isChrome
   * @returns {boolean} true if the current browser is Google Chrome.
   */

  /**
   * @function module:jira/util/navigator.isFirefox
   * @returns {boolean} true if the current browser is Mozilla Firefox.
   */

  /**
   * @returns {boolean} true if the current browser is Opera
   * @note Was missing from internal/util/navigator as at 2014-05-06
   */
  Navigator.isOpera = function () {
    return jQuery.browser.opera === true;
  };

  /**
   * The modifier key used to trigger access-keys defined in a page.
   *
   * @return {String} A textual description of the modifier key used by this browser.
   * e.g. "Alt" or "Alt+Shift"
   *
   * @deprecated You shouldn't need this. But if you did, you'd call {@code AJS.Meta.get("keyboard-accesskey-modifier")} instead.
   */
  Navigator.modifierKey = function () {
    return Meta.get("keyboard-accesskey-modifier");
  };

  return Navigator;
});