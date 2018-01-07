define('jira/field/project-issue-type-select', ['jira/lib/class'], function (Class) {

    /**
     * @class
     * @extends Class
     */
    return Class.extend({

        init: function init(options) {
            var val;
            var instance = this;

            this.$project = options.project;

            this.issueTypeSelect = options.issueTypeSelect;
            this.$projectIssueTypesSchemes = options.projectIssueTypesSchemes;
            this.$issueTypeSchemeIssueDefaults = options.issueTypeSchemeIssueDefaults;
            this.projectIssueTypeSchemes = JSON.parse(this.$projectIssueTypesSchemes.html());
            this.issueTypesSchemeDefaults = JSON.parse(this.$issueTypeSchemeIssueDefaults.html() || '[]');

            //may not have a project select on the edit issue page!
            if (instance.$project.length > 0) {
                val = instance.$project.val();
                instance.setIssueTypeScheme(instance.getIssueTypeSchemeForProject(val));

                this.$project.change(function () {
                    var val = instance.$project.val();
                    instance.setIssueTypeScheme(instance.getIssueTypeSchemeForProject(val));
                });
            }
        },

        getIssueTypeSchemeForProject: function getIssueTypeSchemeForProject(projectId) {
            return this.projectIssueTypeSchemes[projectId];
        },

        getDefaultIssueTypeForScheme: function getDefaultIssueTypeForScheme(issueTypeSchemeId) {
            return this.issueTypesSchemeDefaults[issueTypeSchemeId];
        },

        setIssueTypeScheme: function setIssueTypeScheme(issueTypeSchemeId) {
            var selectedIssueType = this.issueTypeSelect.model.getValue();

            this.issueTypeSelect.model.setFilterGroup(issueTypeSchemeId);

            //retain value if possible, if not set default value
            //we set selection using model method since this change doesn't deal with dropdown
            if (!this.issueTypeSelect.model.setSelected(selectedIssueType, false)) {
                this.setDefaultIssueType(issueTypeSchemeId);
            }

            this.issueTypeSelect.model.$element.data('project', this.$project.val());
        },
        /**
         * Sets the default issue type for given issue type scheme.
         * If there is no default issue type in model set the first one
         *
         * @param {string} issueTypeSchemeId id of the issue type scheme
         */
        setDefaultIssueType: function setDefaultIssueType(issueTypeSchemeId) {
            var defaultIssueType = this.getDefaultIssueTypeForScheme(issueTypeSchemeId);
            var descriptor = this.issueTypeSelect.model.getDescriptor(defaultIssueType);

            if (!descriptor) {
                descriptor = this.issueTypeSelect.model.getAllDescriptors()[0];
            }
            this.issueTypeSelect.setSelection(descriptor, false);
        }
    });
});

AJS.namespace('JIRA.ProjectIssueTypeSelect', null, require('jira/field/project-issue-type-select'));