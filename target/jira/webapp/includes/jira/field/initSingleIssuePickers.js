define('jira/field/init-single-issue-pickers', ['jira/field/single-issue-picker', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery', 'jira/util/formatter'], function (SingleIssuePicker, Events, Types, Reasons, jQuery, formatter) {

    function initIssuePicker(el) {
        jQuery(el || document.body).find('.aui-field-singleissuepicker').each(function () {
            var issuePicker = new SingleIssuePicker({
                element: jQuery(this),
                userEnteredOptionsMsg: formatter.I18n.getText('linkissue.enter.issue.key'),
                uppercaseUserEnteredOnSelect: true
            });
            this.issuePicker = issuePicker;
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initIssuePicker(context);
        }
    });
});