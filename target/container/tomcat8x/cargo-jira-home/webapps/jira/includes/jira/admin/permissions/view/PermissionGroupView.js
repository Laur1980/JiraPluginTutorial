define('jira/project/permissions/permissiongroupview', ['backbone', 'jira/project/permissions/permissionrowview', 'underscore', 'jira/project/permissions/securitytypes'], function (Backbone, PermissionRowView, _, SecurityTypes) {
    "use strict";

    return Backbone.View.extend({
        tagName: 'div',
        className: 'permissions-group',
        template: JIRA.Templates.ProjectPermissions.permissionTable,

        initialize: function initialize(attributes) {
            this.readOnly = attributes.readOnly;
            this.listenTo(this.model, "change", this.render);
        },
        render: function render() {
            // avoid rendering a table that will have no content
            if (this.model.get("permissions").length === 0) {
                return this;
            }

            var warningContent = [];
            this.model.get("permissions").each(function (permissionModel) {
                var contentForPerm = [];
                _.each(permissionModel.attributes.grants, function (grant) {
                    if (grant.securityType === SecurityTypes.SINGLE_USER) {
                        _.each(grant.values, function (value) {
                            if (value.valid === false) {
                                contentForPerm.push({
                                    displayValue: value.displayValue
                                });
                            }
                        });
                    }
                });

                if (Object.keys(contentForPerm).length > 0) {
                    warningContent.push({
                        permName: permissionModel.attributes.permissionName,
                        content: contentForPerm
                    });
                }
            });

            this.$el.html(this.template({
                heading: this.model.get('heading'),
                readOnly: this.readOnly,
                warningContent: warningContent
            }));

            var tableBody = this.$("tbody");
            var self = this;

            this.model.get("permissions").each(function (permissionModel) {
                var rowView = new PermissionRowView({ model: permissionModel, readOnly: self.readOnly });
                rowView.on("openAddDialog", function (permissionKey) {
                    self.trigger("openAddDialog", permissionKey);
                }).on("openDeleteDialog", function (model) {
                    self.trigger("openDeleteDialog", model);
                });
                tableBody.append(rowView.render().el);
            });
            return this;
        }
    });
});