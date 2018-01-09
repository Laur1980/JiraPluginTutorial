define('jira/workflows/workflow-transition-properties', ['aui/restful-table'], function (RestfulTable) {
    'use strict';

    var KeyView = RestfulTable.CustomReadView.extend({
        render: function render(args) {
            return JIRA.Templates.WorkflowTransitionPropertiesTemplates.key(args);
        }
    });

    var ValueView = RestfulTable.CustomReadView.extend({
        render: function render(args) {
            return JIRA.Templates.WorkflowTransitionPropertiesTemplates.value(args);
        }
    });

    var CreateKeyView = RestfulTable.CustomReadView.extend({
        render: function render(args) {
            return JIRA.Templates.WorkflowTransitionPropertiesTemplates.createKey(args);
        }
    });

    var EditKeyView = RestfulTable.CustomEditView.extend({
        render: function render(args) {
            return JIRA.Templates.WorkflowTransitionPropertiesTemplates.key(args);
        }
    });

    return {
        KeyView: KeyView,
        ValueView: ValueView,
        CreateKeyView: CreateKeyView,
        EditKeyView: EditKeyView
    };
});

/**
 * Preserve legacy namespace.
 * @deprecated JIRA.WorkflowTransitionProperties
 */
AJS.namespace("JIRA.WorkflowTransitionProperties", null, require('jira/workflows/workflow-transition-properties'));