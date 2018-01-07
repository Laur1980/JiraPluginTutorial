define('jira/field/init-favourite-pickers', ['jira/field/favourite-picker', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events'], function (FavouritePicker, Reasons, Types, Events) {

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, $ctx, reason) {
        if (reason === Reasons.pageLoad) {
            FavouritePicker.init($ctx);
        }
    });
});