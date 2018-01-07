define('jira/viewissue/init-toggle-block', ['jira/util/events', 'jira/util/events/types', 'jira/toggleblock/toggle-block'], function (Events, Types, ToggleBlock) {
    new ToggleBlock({
        blockSelector: ".toggle-wrap",
        triggerSelector: "#issue-content .mod-header .toggle-title",
        storageCollectionName: "block-states"
    });

    // When we refresh the issue page we also need make sure we restore twixi block state
    if (Types.ISSUE_REFRESHED) {
        Events.bind(Types.ISSUE_REFRESHED, function () {
            if (Types.REFRESH_TOGGLE_BLOCKS) {
                Events.trigger(Types.REFRESH_TOGGLE_BLOCKS);
            }
        });
    }
});