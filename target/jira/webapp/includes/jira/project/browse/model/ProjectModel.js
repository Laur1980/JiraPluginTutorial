define('jira/project/browse/projectmodel', ['backbone', 'underscore', 'jira/project/browse/projecttypesservice'], function (Backbone, _, ProjectTypesService) {
    "use strict";

    return Backbone.Model.extend({
        toJSON: function toJSON() {
            var attributes = _.clone(this.attributes);
            var categories;
            var category;
            if (this.collection && this.collection.pageableCollection) {
                categories = this.collection.pageableCollection.categories;
            }

            if (this.get('projectCategoryId') && categories) {
                category = categories.get(this.get('projectCategoryId'));
                if (category) {
                    attributes.projectCategoryName = category.get('name');
                }
            }
            attributes.projectTypeIcon = ProjectTypesService.getProjectTypeIcon(attributes.projectTypeKey);
            return attributes;
        }
    });
});