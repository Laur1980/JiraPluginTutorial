define('jira/field/init-priority-pickers', ['jira/ajs/select/single-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events'], function (SingleSelect, Reasons, Types, Events) {

    function createPriorityPicker(context) {
        context.find("select#priority").each(function (i, el) {
            new SingleSelect({
                element: el,
                revertOnInvalid: true
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            createPriorityPicker(context);
        }
    });
});