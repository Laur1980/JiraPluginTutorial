define('jira/project/edit/project-category-field', ['jquery', 'jira/ajs/select/single-select', 'backbone', 'aui/inline-dialog2'], function ($, SingleSelect, Backbone) {
    /** @lends ProjectCategoryField.prototype */
    var ProjectCategoryField = Backbone.View.extend({

        /**
         * @class ProjectCategoryField used to create a project category field which shows an inline dialog on the form
         * and uses the SingleSelect styling.
         *
         * @augments Backbone.View
         * @constructs
         *
         */
        initialize: function initialize() {
            var projectCategorySelect = this.$el.find('#project-category-selector');
            this.projectCategorySingleSelect = new SingleSelect({
                element: $(projectCategorySelect),
                revertOnInvalid: true,
                uneditable: $(projectCategorySelect).attr('disabled') === 'disabled'
            });
        }
    });

    return ProjectCategoryField;
});