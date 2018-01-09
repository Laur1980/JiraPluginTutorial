define('jira/project/edit-project-details', ['jquery', 'backbone', 'jira/project/edit/project-type-field', 'jira/project/edit/project-category-field', 'internal/browser-metrics'], function ($, Backbone, ProjectTypeField, ProjectCategoryField, metrics) {
    /** @lends EditProjectDetails.prototype */
    var EditProjectDetails = Backbone.View.extend({

        LOADED_METRICS_KEY: "jira.administration.project.details",

        /**
         * @class EditProjectDetails wraps around the edit project details form to bind to the fields, etc.
         *
         * @augments Backbone.View
         * @constructs
         */
        initialize: function initialize() {
            var $projectTypeField = this.$el.find("#projectTypeKey");
            if ($projectTypeField.length) {
                this.projectTypeField = new ProjectTypeField({
                    el: $projectTypeField.parent()
                });
            }
            var $projectCategoryField = this.$el.find("#project-category-selector");
            if ($projectCategoryField.length) {
                this.projectCategoryField = new ProjectCategoryField({
                    el: $projectCategoryField.parent()
                });
            }

            this.$el.on("remove", this.cleanup.bind(this));

            if (!this._isInDialog()) {
                this._measurePageLoad();
            }
        },

        cleanup: function cleanup() {
            this.projectTypeField && this.projectTypeField.cleanup();
            $(".edit-project-help-bubble").remove();
        },

        _measurePageLoad: function _measurePageLoad() {
            // We're only measuring full page loads (`isInitial: true`), so calling .end() immediately after
            // .start() is appropriate.
            metrics.start({ key: this.LOADED_METRICS_KEY, isInitial: true });
            metrics.end({ key: this.LOADED_METRICS_KEY });
        },

        _isInDialog: function _isInDialog() {
            return this.$el.parents(".jira-dialog").length;
        }
    });

    return EditProjectDetails;
});