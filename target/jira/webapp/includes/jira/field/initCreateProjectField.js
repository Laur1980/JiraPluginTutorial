define('jira/field/init-create-project-field', ['jira/field/create-project-field', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery'], function (CreateProjectField, Events, Types, Reasons, jQuery) {

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            context.find("#add-project-fields").each(function () {
                new CreateProjectField({
                    element: jQuery(this)
                });
            });
        }
    });
});