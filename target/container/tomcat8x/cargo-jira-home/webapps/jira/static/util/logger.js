/* global JIRA */
/* eslint no-console: 0 */

/**
 * Provides basic logging functions that are typically
 * output to the developer console, but can also be
 * routed in to analytics or error reporting services.
 *
 * Allows a separation between the intent to log and
 * the destination the messages are logged at.
 * @module jira/util/logger
 */
define('jira/util/logger', ['exports'], function (exports) {
  'use strict';

  /**
   * @typedef {Function} LoggingFunction
   * @param {...*} - anything you want to log
   */

  /**
   * @private
   * @type {LoggingFunction}
   */

  function devNull() {}
  // somewhere, a dev cries
  // as their logs drift away to
  // a place of silence


  /**
   * Return a function that will log out to console.
   *
   * Internet Explorer 9 and 10 don't create the console object until
   * devtools are opened, so we need to lazily check for the existence of console
   * each time.
   *
   * @param {String} prop the function to check if it exists on console
   * @returns {LoggingFunction} either the browser's console function, or a
   *     proxy that will check for the existence of the console function
   *     each time it is called.
   */
  function maybeConsole(prop) {
    // Check whether the console is available immediately, so modern browsers
    // don't suffer.
    if (typeof console !== 'undefined' && typeof console[prop] === 'function') {
      return console[prop].bind(console);
    }

    return function maybeCanUseConsole() {
      // We can't test typeof console[prop], since in IE it is sometimes 'object', not 'function'.
      if (typeof console !== 'undefined' && console[prop]) {
        return Function.prototype.apply.call(console[prop], console, arguments);
      }
    };
  }

  /**
   * Returns a function that receives any input, and streams it out to
   * any and all necessary data sinks (e.g., the console, analytics, etc).
   * @private
   * @param {string} prop the name of the logging property to proxy
   * @returns {LoggingFunction} an appropriate logging function
   */
  function make(prop) {
    return maybeConsole(prop) || devNull;
  }

  /**
   * Logs messages. Naturally.
   * @type {LoggingFunction}
   */
  exports.log = make('log');

  /**
   * Logs messages at an 'info' level.
   * @type {LoggingFunction}
   */
  exports.info = make('info');

  /**
   * Logs messages at a 'warn' level.
   * @type {LoggingFunction}
   */
  exports.warn = make('warn');

  /**
   * Logs messages at an 'error' level.
   * @type {LoggingFunction}
   */
  exports.error = make('error');

  /**
   * Logs messages at a 'debug' level.
   * @type {LoggingFunction}
   */
  exports.debug = make('debug');

  /**
   * Traces things of interest that occur at certain points
   * in time during JIRA's runtime. The trace events
   * are used almost exclusively to make func tests and
   * webdriver tests simpler to write.
   *
   * @type {LoggingFunction}
   * @protected
   */
  exports.trace = function proxyTracer() {
    /**
     * The actual non-null implementation of this function
     * gets created by the func-test-plugin.
     *
     * Dynamically plucked from window so the func-tests can
     * make the proper impl, and so existing code paths using
     * the global continue to work.
     * @type {LoggingFunction}
     * @private
     */
    var tracer = window['__tracer'] || devNull;
    if (tracer !== proxyTracer) {
      return tracer.apply(tracer, arguments);
    }
  };
});