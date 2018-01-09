define('jira/project/edit/project-type-field', ['jira/analytics', 'jira/util/formatter', 'jquery', 'backbone', 'jira/ajs/select/single-select', 'jira/project/edit/change-triggered-flag',
//Needed for the inline dialog help.
'aui/inline-dialog2'], function (analytics, formatter, $, Backbone, SingleSelect, ChangeTriggeredFlag) {
    'use strict';

    var ProjectTypeField = Backbone.View.extend({

        /**
         * @class ProjectTypeField used to create a project type field which shows a warning message on change
         * and uses the SingleSelect styling.
         *
         * @augments Backbone.View
         * @constructs
         *
         */
        initialize: function initialize() {
            this._initSingleSelect();

            this.changeTriggeredFlag = new ChangeTriggeredFlag({
                getValue: this._getValue.bind(this),
                revert: this._revert.bind(this),
                warningDescription: formatter.I18n.getText('admin.projects.edit.project.type.warning.message'),
                cancelMessage: formatter.I18n.getText('admin.projects.edit.project.warning.cancel'),
                onCancelCallback: function onCancelCallback() {
                    analytics.send({
                        name: 'jira.administration.projectdetails.projecttypeupdate.cancelled'
                    });
                }
            });
        },

        events: {
            'change #projectTypeKey': '_optionChanged'
        },

        _getValue: function _getValue() {
            return $("#projectTypeKey", this.$el).val()[0];
        },

        _revert: function _revert(originalValue) {
            this.projectTypeSingleSelect._setDescriptorWithValue(originalValue);
        },

        /**
         * Listens to changes to the project type and calls the {@link ChangeTriggeredFlag.changeOccurred} to show the flag if
         * necessary
         */
        _optionChanged: function _optionChanged() {
            this.changeTriggeredFlag.changeOccurred();
        },

        /**
         * Converts the select field to a AUI SingleSelect.
         * @private
         */
        _initSingleSelect: function _initSingleSelect() {
            var projectTypeSelect = this.$el.find("#projectTypeKey");

            this.projectTypeSingleSelect = new SingleSelect({
                element: $(projectTypeSelect),
                revertOnInvalid: true,
                uneditable: $(projectTypeSelect).attr('disabled') === 'disabled'
            });
        },

        /**
         * Does any cleanup for the field.
         */
        cleanup: function cleanup() {
            this.changeTriggeredFlag.cleanup();
        }
    });

    return ProjectTypeField;
});