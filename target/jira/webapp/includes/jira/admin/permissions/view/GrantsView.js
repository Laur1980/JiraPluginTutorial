define('jira/project/permissions/grantsview', ['jira/util/formatter', 'backbone', 'underscore', 'jira/project/permissions/securitytypes'], function (formatter, Backbone, _, SecurityTypes) {
    "use strict";

    return Backbone.View.extend({
        tagName: 'dl',
        className: 'types',
        template: JIRA.Templates.ProjectPermissions.grants,
        initialize: function initialize(attributes) {
            this.grants = attributes.grants;
        },
        render: function render() {
            var self = this;
            _.each(this.grants, function (grant) {
                self.$el.append(self.renderGrant(grant));
            });
            return this;
        },
        isSingleValueGrant: function isSingleValueGrant(grant) {
            return grant.securityType !== SecurityTypes.GROUP && grant.securityType !== SecurityTypes.APPLICATION_ROLE && _.every(grant.values, function (value) {
                return value.displayValue === undefined;
            });
        },
        renderGrant: function renderGrant(grant) {
            var isSingleValue = this.isSingleValueGrant(grant);
            var emptyValue = undefined;
            if (grant.securityType === SecurityTypes.GROUP) {
                emptyValue = formatter.I18n.getText('admin.common.words.anyone');
            } else if (grant.securityType === SecurityTypes.APPLICATION_ROLE) {
                emptyValue = formatter.I18n.getText('admin.permission.types.application.role.any');
            }
            return JIRA.Templates.ProjectPermissions.renderGrant({
                displayName: grant.displayName,
                isSingleValue: isSingleValue,
                values: grant.values,
                emptyValue: emptyValue
            });
        }
    });
});