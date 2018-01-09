define('jira/dialog/link-issue-dialog-factory', ['require'], function (require) {
    'use strict';

    var deprecator = require('jira/deprecator');
    var DialogFactory = require('jira/dialog/dialog-factory');
    var FormDialog = require('jira/dialog/form-dialog');
    var DialogUtil = require('jira/dialog/dialog-util');
    var SmartAjax = require('jira/ajs/ajax/smart-ajax');
    var Issue = require('jira/issue');
    var IssueNavigator = require('jira/issuenavigator/issue-navigator');
    var jQuery = require('jquery');
    var Deferred = require('jira/jquery/deferred');
    var wrmContextPath = require('wrm/context-path');
    var wrmRequire = require('wrm/require');
    var contextPath = wrmContextPath();

    /**
     * Adds isSelected property to linkType that should currently be selected
     *
     * @param {String} activeId
     * @param {Array} linkTypes
     * @return {Array}
     */
    function markSelectedLinkType(activeId, linkTypes) {

        var hasSelected = false;

        // If active link id equals link type set it as selected
        jQuery.each(linkTypes, function (i, linkType) {
            if (linkType.id === activeId) {
                linkType.isSelected = true;
                hasSelected = true;
                return false;
            }
        });

        // Otherwise assume it is the first one.
        if (!hasSelected) {
            linkTypes[0].isSelected = true;
        }

        return linkTypes;
    }

    /**
     * Goes to the server to get array of remote issue link types.
     *
     * @return jQuery.Promise<Array>
     */
    function getRemoteIssueLinks(issueId) {
        var deferred = new Deferred();
        SmartAjax.makeRequest({
            url: contextPath + "/rest/viewIssue/1/remoteIssueLink/linkType?issueId=" + issueId,
            complete: function complete(xhr, textStatus, smartAjaxResult) {
                if (smartAjaxResult.successful) {
                    deferred.resolve(smartAjaxResult.data);
                } else {
                    deferred.reject(SmartAjax.buildDialogErrorContent(smartAjaxResult));
                }
            }
        });

        return deferred.promise();
    }

    /**
     * Loads tab content using the active trigger's (<a> clicked) href as the url to request
     *
     * @param {Dialog} dialog
     * @return jQuery.Promise<String>
     */
    function getTabContent(dialog) {
        var deferred = new Deferred();
        var ajaxOptions = DialogUtil.getDefaultAjaxOptions.call(dialog);

        ajaxOptions.complete = function (xhr, textStatus, smartAjaxResult) {
            if (smartAjaxResult.successful) {
                deferred.resolve(smartAjaxResult.data);
            } else {
                deferred.reject(SmartAjax.buildDialogErrorContent(smartAjaxResult));
            }
        };

        SmartAjax.makeRequest(ajaxOptions);

        return deferred.promise();
    }

    /**
     * Gets id from active trigger
     *
     * @param {Dialog} dialog
     * @return {String}
     */
    function getActiveTabId(dialog) {
        return dialog.$activeTrigger.attr("id");
    }

    function loadIssueLinkContentResources() {
        return wrmRequire(['wrc!com.atlassian.jira.jira-issue-link-web-plugin:init-issuelink-web', 'wrc!com.atlassian.jira.jira-issue-link-confluence-plugin:init-issuelink-confluence', 'wrc!com.atlassian.jira.jira-issue-link-remote-jira-plugin:init-issuelink-jira']);
    }

    /**
     * Creates a link issue dialog
     *
     * @param {String | jQuery} trigger - jQuery selector for the element/s that trigger dialog to open
     */
    function createLinkIssueDialog(trigger) {

        return new FormDialog({
            id: "link-issue-dialog",
            isIssueDialog: true,
            trigger: trigger,
            onSuccessfulSubmit: function onSuccessfulSubmit(data, smartAjaxResponse) {
                if (smartAjaxResponse.getResponseHeader("X-Atlassian-Dialog-Msg-Type") !== "warning") {
                    DialogUtil.storeCurrentIssueIdOnSucessfulSubmit.apply(this, arguments);
                }
            },
            issueMsg: 'thanks_issue_linked',
            widthClass: 'large',
            stacked: true,
            content: function content(ready) {
                var dialog = this;
                var issueId = Issue.getIssueId() || IssueNavigator.getSelectedIssueId();

                var loadUIResourcesDeferred = loadIssueLinkContentResources();
                var remoteIssueLinksDeferred = getRemoteIssueLinks(issueId);
                var tabContentDeferred = getTabContent(dialog);
                jQuery.when(tabContentDeferred, remoteIssueLinksDeferred, loadUIResourcesDeferred).done(function (tabContent, linkTypes) {
                    linkTypes = markSelectedLinkType(getActiveTabId(dialog), linkTypes);

                    ready(JIRA.Templates.LinkIssue.dialog({
                        linkTypes: linkTypes,
                        tabContent: tabContent
                    }));

                    jQuery.each(linkTypes, function (i, linkType) {
                        var focusElementSelector;
                        if (linkType.isSelected === true) {
                            focusElementSelector = "[name='" + linkType.focusedFieldName + "']";
                            if (jQuery(focusElementSelector).length === 0) {
                                focusElementSelector = "#" + linkType.id;
                            }
                            dialog._focusFirstField(focusElementSelector);
                        }
                    });
                }).fail(function (tabContentError, linkTypeError) {
                    ready(linkTypeError || tabContentError);
                });
            },
            // A work around because the submit response does not include the menu bar. So we push the submit response
            // into our current content.
            formatSubmitResponseContent: function formatSubmitResponseContent(content) {
                this.get$popupContent().find(".dialog-pane").html(content);
                return this.get$popupContent().html();
            },
            onContentRefresh: function onContentRefresh() {
                // make sure that whenever we click on of our other tabs they load in the dialog.
                this.bindAnchorsToDialog(this.get$popupContent().find(".dialog-menu-item "));
            }
        });
    }

    // Legacy, which I doubt anybody will use.
    DialogFactory.createLinkIssueDialog = createLinkIssueDialog;
    deprecator.prop(DialogFactory, 'createLinkIssueDialog', { sinceVersion: '7.3', removeInVersion: '8.0' });

    return {
        createLinkIssueDialog: createLinkIssueDialog
    };
});