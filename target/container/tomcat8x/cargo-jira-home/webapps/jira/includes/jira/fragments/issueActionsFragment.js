/** @deprecated since JIRA 6.2. Write Soy templates. */

define('jira/fragments/issueActionsFragment', ["require"], function (require) {
    var jQuery = require('jquery');
    var topSameOriginWindow = require("jira/util/top-same-origin-window")(window);

    function addIssueIdToReturnUrl(issueId) {
        var matchSelectedIssueId = /selectedIssueId=[0-9]*/g;

        if (self != top) {
            return encodeURIComponent(topSameOriginWindow.location.href);
        }

        var url = window.location.href;
        var newUrl = url;

        if (/selectedIssueId=[0-9]*/.test(url)) {
            newUrl = url.replace(matchSelectedIssueId, "selectedIssueId=" + issueId);
        } else {
            if (url.lastIndexOf("?") >= 0) {
                newUrl = url + "&";
            } else {
                newUrl = url + "?";
            }
            newUrl = newUrl + "selectedIssueId=" + issueId;
        }
        return encodeURIComponent(newUrl);
    }

    return function (json) {
        json.returnUrl = json.returnUrl || addIssueIdToReturnUrl(json.id);
        return jQuery(JIRA.Templates.Dropdowns.issueActionsDropdown(json));
    };
});

AJS.namespace('JIRA.FRAGMENTS.issueActionsFragment', null, require('jira/fragments/issueActionsFragment'));