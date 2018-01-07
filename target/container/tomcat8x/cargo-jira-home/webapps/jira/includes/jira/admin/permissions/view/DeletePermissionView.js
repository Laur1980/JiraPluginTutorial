define('jira/project/permissions/deletepermissionview', ['jira/util/formatter', 'backbone', 'jquery', 'underscore', 'jira/project/permissions/securitytypes', "wrm/context-path"], function (formatter, Backbone, $, _, SecurityTypes, wrmContextPath) {
    "use strict";

    return Backbone.View.extend({
        template: JIRA.Templates.ProjectPermissions.deleteDialog,

        events: {
            'change .js-delete-grant': '_handleGrantClick',
            'click #dialog-save-button': '_handleSubmitEvent',
            'click #dialog-close-button': 'close'
        },

        initialize: function initialize(attributes) {
            this.grantsToRemove = [];
            this.permissionSchemeId = attributes.permissionSchemeId;
            this.model.on('change:submitDisabled', _.bind(this._handleSubmitState, this));
            this.model.on('change:grants', _.bind(this.render, this));
            this.dialog = AJS.dialog2(this.$el);
        },

        /**
         * Open the dialog and renders the content
         */
        open: function open() {
            this.dialog.show();
            this.dialog.on('hide', _.bind(this.close, this));
            this.render();
            this.trigger('contentLoaded');
        },

        /**
         * Renders the content of the dialog
         */
        render: function render() {
            var grantsContainer = this.$('.grants');
            var self = this;

            _.each(this.model.get('grants'), function (grant) {
                grantsContainer.append(self._renderDeleteGrantControl(grant));
            });

            this.model.set('submitDisabled', true);
            this._checkFirstCheckboxIfOnlyOneExists();
        },

        /**
         * @returns {boolean} if the delete permission can be submitted
         */
        canSubmit: function canSubmit() {
            return !this.model.get('submitDisabled');
        },

        /**
         * If we are in a state where we can submit, submit and close the dialog.
         */
        submit: function submit() {
            if (this.canSubmit()) {
                this._removeGrants();
            }
        },

        /**
         * Closes the dialog.
         */
        close: function close() {
            this.remove();
            this.dialog.remove();
        },

        _checkFirstCheckboxIfOnlyOneExists: function _checkFirstCheckboxIfOnlyOneExists() {
            var checkboxes = this.$('.js-delete-grant');
            if (checkboxes.length === 1) {
                $(checkboxes[0]).prop('checked', true).change();
            }
        },

        _handleGrantClick: function _handleGrantClick(e) {
            var grantValue = parseInt($(e.target).val());
            if (e.target.checked) {
                this.grantsToRemove.push(grantValue);
            } else {
                this.grantsToRemove = _.without(this.grantsToRemove, grantValue);
            }

            this._determineSubmitState();
        },

        _determineSubmitState: function _determineSubmitState() {
            this.model.set('submitDisabled', this.grantsToRemove.length === 0);
        },

        _removeGrants: function _removeGrants() {
            var context = this;
            context._disableAllFields();
            $.ajax({
                url: wrmContextPath() + "/rest/internal/2/managedpermissionscheme/" + this.permissionSchemeId,
                type: "DELETE",
                data: JSON.stringify({ "grantsToDelete": this.grantsToRemove }),
                contentType: "application/json",
                success: function success(response) {
                    context.trigger("deleteCompleted", response);
                    context.close();
                },
                error: function error(response) {
                    response = response.responseText ? JSON.parse(response.responseText) : {};
                    context.trigger("deletePermissionError", response);
                    context._enableAllFields();
                }
            });
        },

        _disableAllFields: function _disableAllFields() {
            this.$el.find('input, button').attr('aria-disabled', 'true').attr('disabled', 'disabled');
        },

        _enableAllFields: function _enableAllFields() {
            this.$el.find('input, button').attr('aria-disabled', 'false').removeAttr('disabled');
        },

        _handleSubmitEvent: function _handleSubmitEvent(e) {
            e.preventDefault();

            this.submit();
        },

        _renderDeleteGrantControl: function _renderDeleteGrantControl(grant) {
            var data = grant;
            if (grant.securityType === SecurityTypes.GROUP) {
                data = $.extend({ emptyDisplayName: formatter.I18n.getText('admin.common.words.anyone') }, grant);
            } else if (grant.securityType === SecurityTypes.APPLICATION_ROLE) {
                data = $.extend({ emptyDisplayName: formatter.I18n.getText('admin.permission.types.application.role.any') }, grant);
            }
            return JIRA.Templates.ProjectPermissions.deleteGrant(data);
        },

        _handleSubmitState: function _handleSubmitState() {
            this.dialog.$el.find('#dialog-save-button').attr('aria-disabled', this.model.get('submitDisabled'));
        }
    });
});