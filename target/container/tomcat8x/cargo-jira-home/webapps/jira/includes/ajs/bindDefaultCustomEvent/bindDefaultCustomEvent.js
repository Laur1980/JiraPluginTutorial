define('jira/ajs/default-custom-event', ['jquery', 'exports'], function (jQuery, exports) {
    var defaultEvents = {};

    /**
     * Binds a default handler for jQuery custom events. The event can be prevented by calling e.preventDefault();
     *
     * @param {String} name - event name
     * @param {function} defaultHandler
     * @deprecated since JIRA 6.2
     */
    exports.bind = function (name, defaultHandler) {

        if (defaultEvents[name]) {
            throw new Error("You have already bound a default handler for [" + name + "] event");
        }

        defaultEvents[name] = function (e) {
            var events = jQuery(document).data("events")[name];
            var lastEventHandler = events[events.length - 1].handler;

            // we need out default event to fire last so we can listen for calls to e.preventDefault
            if (lastEventHandler !== arguments.callee) {

                // if this is called by any event handlers null out default handler
                e.preventDefault = function () {
                    defaultHandler = null;
                };

                events[events.length - 1].handler = function () {

                    lastEventHandler.apply(this, arguments);

                    if (defaultHandler) {
                        defaultHandler.apply(this, arguments);
                    }

                    events[events.length - 1].handler = lastEventHandler; // restore, so we don't have nested closure hell
                };
            } else {

                // we are the only handler anyway
                defaultHandler.apply(this, arguments);
            }
        };

        jQuery(document).bind(name, defaultEvents[name]);
    };

    /**
     *
     * Unbinds default event. This can be used to remove a previous default custom event and replace it for another.
     *
     * @param {String} name - event name
     * @deprecated since JIRA 6.2
     */
    exports.unbind = function (name) {

        // unbind from jQuery events and remove our own reference
        if (defaultEvents[name]) {
            jQuery(document).unbind(name, defaultEvents[name]);
            delete defaultEvents[name];
        }
    };
});

AJS.namespace('AJS.bindDefaultCustomEvent', null, require('jira/ajs/default-custom-event').bind);
AJS.namespace('AJS.unbindDefaultCustomEvent', null, require('jira/ajs/default-custom-event').unbind);