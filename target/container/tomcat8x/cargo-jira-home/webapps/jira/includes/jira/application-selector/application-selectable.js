define("jira/admin/application-selector/application-selectable", ['jira/admin/application-selector/application', 'underscore'], function (Application, _) {
    return Application.extend({
        ui: _.extend({}, Application.prototype.ui, {
            "checkbox": "input[type=checkbox]",
            "undefinedApplicationDialog": ".application-not-defined-dialog"
        }),

        events: {
            "change @ui.checkbox": function changeUiCheckbox(event, parameters) {
                var manual = true;
                if (parameters && !parameters.manual) {
                    manual = false;
                }

                this.hideEffectiveWarning();

                this.trigger(Application.TOGGLE_EVENT, { manual: manual });

                if (!this.isDefined()) {
                    var dialog = this.getUndefinedWarning();
                    if (this.isSelected()) {
                        this.trigger(Application.WARNING_DIALOG_OPENED_EVENT, {
                            type: Application.WARNINGS.NONEFFECTIVE
                        });
                        if (this.options.disableUndefinedWarningDisplaying !== true) {
                            this.displayWarning(Application.WARNINGS.NONEFFECTIVE);
                        }
                    } else {
                        dialog.open = false;
                    }
                }
            }
        },

        getApplicationKey: function getApplicationKey() {
            return this.ui.checkbox.data("key");
        },

        getEffective: function getEffective() {
            return this.ui.checkbox.data("effective") || [];
        },

        isDisabled: function isDisabled() {
            return this.ui.checkbox.prop("disabled");
        },

        setDisabled: function setDisabled(disabled) {
            this.ui.checkbox.prop("disabled", disabled);
            return this;
        },

        isDefined: function isDefined() {
            return this.ui.checkbox.attr("data-defined") === "true";
        },

        isSelected: function isSelected() {
            return this.ui.checkbox.prop("checked");
        },

        setSelected: function setSelected(checked) {
            if (checked !== this.isSelected()) {
                this.ui.checkbox.prop("checked", checked);
                this.ui.checkbox.trigger('change', {
                    manual: false
                });
            }
        },

        isIndeterminateButNotEffective: function isIndeterminateButNotEffective() {
            return this.ui.checkbox.data("indeterminate") === "indeterminate";
        },

        onIndeterminateChange: function onIndeterminateChange(params) {
            this.ui.checkbox.prop("indeterminate", params.indeterminate);
        },

        getUndefinedWarning: function getUndefinedWarning() {
            return this.ui.undefinedApplicationDialog.get(0);
        },

        onInlineWarningChange: function onInlineWarningChange(params) {
            this.ui.checkbox.attr("aria-controls", params.controls);
        },

        _getNonIndeterminateWarningId: function _getNonIndeterminateWarningId() {
            return this.ui.undefinedApplicationDialog.prop("id");
        },

        displayWarning: function displayWarning(type) {
            if (type === Application.WARNINGS.NONEFFECTIVE) {
                this.changeInlineWarning(Application.WARNINGS.NONEFFECTIVE);
                var inlineWarningDialog = this.getUndefinedWarning();
                inlineWarningDialog.open = true;
            } else {
                Application.prototype.displayWarning.call(this, type);
            }
        }
    });
});