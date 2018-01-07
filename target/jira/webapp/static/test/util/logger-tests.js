AJS.test.require(['jira.webresources:jira-logger'], function () {
    'use strict';

    var _ = require('underscore');

    module('jira/util/logger - logging to console', {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();

            this.originalConsole = window.console;
        },
        fakeWith: function fakeWith() {
            var props = Array.prototype.slice.call(arguments);
            var fakeConsole = {};
            _.each(props, function (p) {
                fakeConsole[p] = this.spy();
            }.bind(this));
            return fakeConsole;
        },
        teardown: function teardown() {
            window.console = this.originalConsole;
        }
    });

    test('when console is available', function () {
        var fakeConsole = this.fakeWith('log', 'info', 'warn', 'error', 'debug');
        window.console = fakeConsole;

        var logger = this.context.require('jira/util/logger');

        logger.log('a simple message');
        logger.log(1, 2, 3);
        logger.info('informational messages', 'are', 'awesome');
        logger.warn('THIS IS SPARTAAA!', logger.warn);
        logger.error(logger, 'not an error');
        logger.error(undefined, 'also not an error');
        logger.debug('a debug message', logger);
        logger.log('whee');

        equal(fakeConsole.log.callCount, 3);
        equal(fakeConsole.info.callCount, 1);
        equal(fakeConsole.warn.callCount, 1);
        equal(fakeConsole.error.callCount, 2);
        equal(fakeConsole.debug.callCount, 1);
    });

    test('when console is not immediately available (i.e., in IE8, 9, and 10)', function () {
        var fakeConsole = this.fakeWith('log', 'info', 'warn', 'error', 'debug');
        // I am evil. I am sorry.
        delete window.console;
        window.console = undefined;

        var logger = this.context.require('jira/util/logger');

        logger.log('a simple message');
        logger.log(1, 2, 3);
        logger.info('informational messages', 'are', 'awesome');
        logger.warn('THIS IS SPARTAAA!', logger.warn);
        logger.error(logger, 'not an error');
        // console appears...
        window.console = fakeConsole;
        // ...and we continue
        logger.error(undefined, 'also not an error');
        logger.debug('a debug message', logger);
        logger.log('whee');

        equal(fakeConsole.log.callCount, 1);
        equal(fakeConsole.info.callCount, 0);
        equal(fakeConsole.warn.callCount, 0);
        equal(fakeConsole.error.callCount, 1);
        equal(fakeConsole.debug.callCount, 1);
    });
});