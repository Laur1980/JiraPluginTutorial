define('jira/field/init-inline-attach', ['jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery', // Ensure jQuery is loaded
'jira/jquery/plugins/attachment/inline-attach'], function (Events, Types, Reasons) {
    'use strict';

    /**
     * @param {jQuery} context
     */

    function createInlineAttach(context) {
        context.find("input[type=file]:not('.ignore-inline-attach')").inlineAttach();
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            createInlineAttach(context);
        }
    });
});