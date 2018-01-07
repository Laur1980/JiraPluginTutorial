define('jira/project/browse/projecttypesservice', function () {
    'use strict';

    return {
        init: function init(projectTypes) {
            this.projectTypes = projectTypes;
        },

        areProjectTypesEnabled: function areProjectTypesEnabled() {
            return !!this.projectTypes;
        },

        getProjectTypeIcon: function getProjectTypeIcon(projectTypeKey) {
            if (this.projectTypes) {
                var projectType = this.projectTypes[projectTypeKey] || this.projectTypes['jira-project-type-inaccessible'];
                return projectType.icon;
            }
            return null;
        }
    };
});