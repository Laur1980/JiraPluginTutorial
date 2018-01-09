define("jira/admin/application-selector/application-critical", ['jira/admin/application-selector/application', 'underscore'], function (Application, _) {
    return Application.extend({
        ui: _.extend({}, Application.prototype.ui, {
            "criticalWarning": ".application-warning"
        }),

        getApplicationKey: function getApplicationKey() {
            return this.ui.criticalWarning.data("key");
        },

        isDisabled: function isDisabled() {
            return this.ui.label.hasClass("disabled");
        },

        setDisabled: function setDisabled(disabled) {
            this.ui.label.toggleClass("disabled", disabled);
            return this;
        },

        isIndeterminateButNotEffective: function isIndeterminateButNotEffective() {
            return false;
        },

        onIndeterminateChange: function onIndeterminateChange(params) {
            this.ui.criticalWarning.toggleClass("effective", params.indeterminate);
            this.setDisabled(params.indeterminate);
        },

        onInlineWarningChange: function onInlineWarningChange(params) {
            this.ui.criticalWarning.attr("aria-controls", params.controls);
        },

        _getNonIndeterminateWarningId: function _getNonIndeterminateWarningId() {
            return this.ui.criticalWarning.data("warningId");
        },

        // these functions are used in application-selector
        // but they work only in selectable application
        isSelected: function isSelected() {
            return false;
        },
        setSelected: function setSelected() {}

    });
});