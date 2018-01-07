define('jira/analytics', ['underscore'], function (_) {
    'use strict';

    function globalAJS() {
        if (!window.AJS) {
            window.AJS = {};
        }
        return window.AJS;
    }

    // The AJS.EventQueue pattern is a little unconventional.
    //
    // It's an array that _may_ or _may not_ exist, that you can contribute events of type
    // `{name: string, properties: object}` to, and which _may_ be emitted as Atlassian Analytics events.
    //
    // As such it's the necessary for the code wishing to contribute events to guarantee that AJS.EventQueue actually
    // exists.
    var localAjs = globalAJS();
    localAjs.EventQueue = localAjs.EventQueue || [];

    /**
     * Request to send an Atlassian Analytics event.
     *
     * An analytics event will only be sent if the Atlassian Analytics plugin is installed.
     *
     * @param {string} options.name The name of the analytics event.
     * @param {object} options.properties Additional properties to send with the analytics event.
     */
    function send(options) {
        options = options || {};
        options.properties = _.extend({}, options.data, options.properties);
        localAjs.EventQueue.push(options);
        // the above implementation is unusual and because of that we need this custom event,
        // so that other bundled plugins can depend on that.
        if (_.isFunction(AJS.trigger)) {
            AJS.trigger("jiraAnalyticsEvent", options);
        }
    }

    return {
        send: send
    };
});