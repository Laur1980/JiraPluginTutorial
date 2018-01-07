/**
 * Utility module for handling URL strings, typically for outputting
 * hyperlinks that include the appropriate context path and security tokens.
 * @module jira/util/urls
 */
define('jira/util/urls', ['exports'], function (exports) {
  'use strict';

  /**
   * Returns the meta tag that contains the XSRF atlassian token
   * or undefined if not on page
   * @returns {string} a token you can provide to URLs that require XSRF authentication.
   */

  exports.atl_token = function () {
    var tokenEl = document.getElementById('atlassian-token');
    return tokenEl && tokenEl.getAttribute ? tokenEl.getAttribute('content') : undefined;
  };
});