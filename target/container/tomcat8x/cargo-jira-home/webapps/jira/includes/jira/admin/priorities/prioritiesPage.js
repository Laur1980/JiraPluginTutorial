require(['jira/skate', 'jquery', 'jira/flag', 'atlassian/libs/uri-1.14.1', 'jira/util/strings', 'jira/util/formatter'], function (skate, $, flag, URI, strings, formatter) {
    'use strict';

    skate('delete-priority-disabled', {
        type: skate.type.CLASSNAME,
        attached: function attached(element) {
            var $element = $(element);
            $element.tooltip({
                gravity: 'e'
            });

            $element.click(function (e) {
                e.preventDefault();
            });
        }
    });

    $(function () {
        var uri = new URI(location.href);
        var deletedPriorityName = uri.search(true).deletedPriorityName;

        if (deletedPriorityName) {
            var escaped = strings.escapeHtml(deletedPriorityName);
            flag.showSuccessMsg(null, formatter.I18n.getText("admin.issuesettings.priorities.removed.flag", "<strong>", escaped, "</strong>"));

            uri.removeQuery('deletedPriorityName');
            window.history.replaceState({}, {}, uri.href());
        }
    });
});