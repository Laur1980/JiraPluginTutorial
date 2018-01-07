define('jira/field/init-project-issue-type-select', ['jira/ajs/select/suggestion-collection-model', 'jquery', 'jira/ajs/select/single-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/project-issue-type-select'], function (SuggestionCollectionModel, jQuery, SingleSelect, Reasons, Types, Events, ProjectIssueTypeSelect) {

    function findProjectAndIssueTypeSelectAndConvertToPicker(ctx) {
        var $ctx = ctx || jQuery("body");

        $ctx.find(".issuetype-field").each(function (index) {
            var $project = $ctx.find(".project-field, .project-field-readonly");
            var $issueTypeSelect = jQuery(this);
            var $projectIssueTypes = $ctx.find("#" + $issueTypeSelect.attr('id') + '-projects');
            var $defaultProjectIssueTypes = $ctx.find("#" + $issueTypeSelect.attr('id') + '-defaults');

            var issueTypeSelect = new SingleSelect({
                element: $issueTypeSelect,
                revertOnInvalid: true,
                model: SuggestionCollectionModel
            });

            // Remove redundant "please select" option
            issueTypeSelect.model.remove("");

            //if there is accompanied project field link them together
            if ($project.length > 0) {
                new ProjectIssueTypeSelect({
                    project: $project.eq(index), //link correct project field in case of multiple project fields
                    issueTypeSelect: issueTypeSelect,
                    projectIssueTypesSchemes: $projectIssueTypes,
                    issueTypeSchemeIssueDefaults: $defaultProjectIssueTypes
                });
            }
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            findProjectAndIssueTypeSelectAndConvertToPicker(context);
        }
    });
});