define('jira/libs/calendar-layerable-mixin', [
    'jira/ajs/layer/layer-interactions',
    'jira/ajs/layer/inline-layer',
    'jira/util/events'
], function(
    interactions,
    InlineLayer,
    Events
) {
    'use strict';

    function initLayerable (Calendar) {
        interactions.preventDialogHide(Calendar);
        interactions.preventInputBlur(Calendar);
        interactions.preventInlineEditCancel(Calendar);

        Events.bind(InlineLayer.EVENTS.beforeHide, function (e) {
            if (Calendar.current) {
                e.preventDefault();
            }
        });
    }

    return {
        layerableExtensions: initLayerable
    };
});
