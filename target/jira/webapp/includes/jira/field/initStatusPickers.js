define('jira/field/init-status-pickers', ['jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/status-category-single-select'], function (Reasons, Types, Events, StatusCategorySingleSelect) {

    function createCategoryPicker(context) {
        context.find("select#statusCategory").each(function (i, el) {
            new StatusCategorySingleSelect({
                element: el,
                revertOnInvalid: true
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            createCategoryPicker(context);
        }
    });
});