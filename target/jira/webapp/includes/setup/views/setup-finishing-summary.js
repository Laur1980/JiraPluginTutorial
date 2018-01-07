define("jira/setup/setup-finishing-summary-view", ["marionette"], function (Marionette) {

    return Marionette.ItemView.extend({
        template: JIRA.Templates.Setup.Finishing.summaryView,

        ui: {
            annotation: ".jira-setup-finishing-annotation",
            summary: ".jira-setup-finishing-summary",
            submitButton: "#jira-setup-finishing-submit"
        },

        templateHelpers: {
            redirectUrl: null
        },

        initialize: function initialize(options) {
            this.templateHelpers.redirectUrl = options.redirectUrl;
        },

        onShow: function onShow() {
            this.ui.submitButton.focus();
        }
    });
});