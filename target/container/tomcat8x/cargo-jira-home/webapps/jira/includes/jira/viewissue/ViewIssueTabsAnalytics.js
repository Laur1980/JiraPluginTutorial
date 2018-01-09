define("jira/viewissue/tabs/analytics", ['jquery', 'jira/analytics', 'jira/util/strings', 'jira/viewissue/analytics-utils', 'underscore'], function (jQuery, analytics, StringUtils, AnalyticsUtils, _) {

    var privacyPolicyWhitlistedTabs = ["com.atlassian.jira.plugin.system.issuetabpanels:all-tabpanel", "com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel", "com.atlassian.jira.plugin.system.issuetabpanels:worklog-tabpanel", "com.atlassian.jira.plugin.system.issuetabpanels:changehistory-tabpanel", "com.atlassian.streams.streams-jira-plugin:activity-stream-issue-tab"];

    function whitelistedTabId(tabId) {
        if (privacyPolicyWhitlistedTabs.indexOf(tabId) > -1) {
            return tabId;
        }
        return StringUtils.hashCode(tabId);
    }

    function getTabData($tabElement) {
        return {
            tab: whitelistedTabId($tabElement.attr('data-key')),
            tabPosition: $tabElement.index()
        };
    }

    function baseEventData(openedInNewWindow, triggeredByKeyboard) {
        return {
            inNewWindow: openedInNewWindow,
            keyboard: triggeredByKeyboard,
            context: AnalyticsUtils.context()
        };
    }

    return {
        tabClicked: function tabClicked($elementClicked, openedInNewWindow, triggeredByKeyboard) {
            var $parent = $elementClicked.parent();
            var data = _.extend({}, baseEventData(openedInNewWindow, triggeredByKeyboard), getTabData($parent));
            analytics.send({
                name: "jira.viewissue.tab.clicked",
                properties: data
            });
        },

        buttonClicked: function buttonClicked($elementClicked, openedInNewWindow, triggeredByKeyboard) {
            if (!$elementClicked.is("[data-tab-sort]")) {
                return;
            }

            var order = $elementClicked.data("order");
            var $activeTab = $elementClicked.parents(".tabwrap").find("li.active");

            analytics.send({
                name: "jira.viewissue.tabsort.clicked",
                properties: _.extend({}, baseEventData(openedInNewWindow, triggeredByKeyboard), getTabData($activeTab), {
                    order: order
                })
            });
        }
    };
});