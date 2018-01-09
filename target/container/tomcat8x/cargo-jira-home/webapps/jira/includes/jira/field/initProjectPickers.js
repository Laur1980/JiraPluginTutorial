/**
 * Initialises project picker frother fields
 *
 * Please not that project fields interact with issue type fields in create issue. This interation is handled in
 * initIssueTypeSelect.js
 */
define('jira/field/init-project-pickers', ['jira/ajs/select/scrollable-single-select', 'jira/ajs/select/suggestion-collection-model', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events'], function (ScrollableSingleSelect, SuggestionCollectionModel, Reasons, Types, Events) {

    function createProjectPicker(context) {
        context.find(".project-field").each(function () {
            new ScrollableSingleSelect({
                element: this,
                revertOnInvalid: true,
                pageSize: 50,
                pagingThreshold: 100,
                model: SuggestionCollectionModel
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            createProjectPicker(context);
        }
    });
});