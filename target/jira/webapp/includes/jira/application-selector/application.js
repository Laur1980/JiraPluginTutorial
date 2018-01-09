define("jira/admin/application-selector/application", ["jira/jquery/deferred", "marionette", "underscore", "aui/inline-dialog2", "internal/util/indeterminate-checkbox-ie-fix"], function (Deferred, Marionette, _) {
    "use strict";

    var Application = Marionette.ItemView.extend({

        initialize: function initialize() {
            this.bindUIElements();
        },

        ui: {
            "label": ".application-label",
            "effectiveWarning": ".application-picker-applications__effective-warning"
        },

        changeInlineWarning: function changeInlineWarning(type) {
            var ariaControls = "";
            if (type === Application.WARNINGS.EFFECTIVE) {
                ariaControls = this.ui.effectiveWarning.prop("id");
            } else {
                ariaControls = this._getNonIndeterminateWarningId();
            }

            this.triggerMethod("inline:warning:change", {
                controls: ariaControls
            });
        },
        setIndeterminate: function setIndeterminate(indeterminate, options) {
            options = _.isObject(options) ? options : {};
            this.triggerMethod("indeterminate:change", {
                indeterminate: indeterminate
            });

            if (indeterminate) {
                if (options.silent !== true) {
                    this.displayWarning(Application.WARNINGS.EFFECTIVE);
                }
            } else {
                this.changeInlineWarning(Application.WARNINGS.NONEFFECTIVE);
            }
        },
        getEffectiveWarning: function getEffectiveWarning() {
            var deferred = new Deferred();
            setTimeout(function () {
                var effectiveWarning = this.ui.effectiveWarning[0];
                if (effectiveWarning && effectiveWarning.hasAttribute("resolved")) {
                    deferred.resolve(effectiveWarning);
                } else {
                    deferred.reject();
                }
            }.bind(this));
            return deferred;
        },
        showEffectiveWarning: function showEffectiveWarning() {
            this.getEffectiveWarning().then(function (effectiveWarning) {
                effectiveWarning.open = true;
            });
        },
        hideEffectiveWarning: function hideEffectiveWarning() {
            this.getEffectiveWarning().then(function (effectiveWarning) {
                effectiveWarning.open = false;
            });
        },

        displayWarning: function displayWarning(type) {
            switch (type) {
                case Application.WARNINGS.EFFECTIVE:
                    this.changeInlineWarning(type);
                    this.showEffectiveWarning();
                    break;
            }
        }
    }, {
        TOGGLE_EVENT: "application:toggle",
        WARNING_DIALOG_OPENED_EVENT: "dialog:opened",

        WARNINGS: {
            EFFECTIVE: "effective",
            NONEFFECTIVE: "noneffective"
        }
    });

    return Application;
});