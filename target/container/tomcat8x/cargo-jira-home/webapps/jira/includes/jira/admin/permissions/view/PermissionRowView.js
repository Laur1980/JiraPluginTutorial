define('jira/project/permissions/permissionrowview', ['marionette', 'jquery', 'underscore', 'jira/util/logger', 'jira/util/formatter', 'jira/analytics', 'jira/flag', 'wrm/context-path', 'jira/project/permissions/grantsview'], function (Marionette, $, _, logger, formatter, Analytics, JiraFlag, wrmContextPath, GrantsView) {
    "use strict";

    return Marionette.ItemView.extend({
        tagName: 'tr',
        template: JIRA.Templates.ProjectPermissions.permissionRow,
        ui: {
            grants: ".grants",
            extToggle: "input.toggle"
        },
        events: {
            "click .add-trigger": "openAddDialog",
            "click .delete-trigger": "openDeleteDialog",
            "change @ui.extToggle": "toggleExtendedPermission"
        },
        initialize: function initialize(attributes) {
            this.readOnly = attributes.readOnly;
            this.extendedFeedbackFlag = undefined;
        },
        onRender: function onRender() {
            this.ui.grants.append(new GrantsView({ grants: this.model.get("grants") }).render().el);
        },
        serializeData: function serializeData() {
            return _.extend({}, this.model.toJSON(), { readOnly: this.readOnly });
        },
        attributes: function attributes() {
            return {
                "data-permission-key": this.model.get("permissionKey")
            };
        },

        openAddDialog: function openAddDialog(e) {
            e.preventDefault();
            this.trigger("openAddDialog", this.model.get("permissionKey"));
        },
        openDeleteDialog: function openDeleteDialog(e) {
            e.preventDefault();
            this.trigger("openDeleteDialog", this.model);
        },
        toggleExtendedPermission: function toggleExtendedPermission(e) {
            e.preventDefault();

            var toggle = this.ui.extToggle.get(0);
            var isChecked = toggle.checked;
            var extPermission = this.model.get("extPermission");

            if (toggle.busy) {
                logger.warn('Ignoring since the previous request has not been completed yet');
                toggle.checked = !isChecked;
                return;
            }

            toggle.busy = true;
            $.ajax({
                url: wrmContextPath() + extPermission.endpointURI,
                type: "PUT",
                data: JSON.stringify(isChecked),
                contentType: "text/plain",
                success: function () {
                    toggle.checked = isChecked;
                    if (isChecked) {
                        Analytics.send({ name: "admin.permissions.extendedadmin.optin" });
                    } else {
                        Analytics.send({ name: "admin.permissions.extendedadmin.optout" });
                        this._showExtendedPermissionDisableFeedback();
                    }
                }.bind(this),
                error: function error() {
                    toggle.checked = !isChecked;
                    Analytics.send({ name: "admin.permissions.extendedadmin.error" });
                    if (isChecked) {
                        JiraFlag.showErrorMsg("", formatter.I18n.getText("admin.permissions.extendedadmin.feedback.granterror"));
                    } else {
                        JiraFlag.showErrorMsg("", formatter.I18n.getText("admin.permissions.extendedadmin.feedback.revokeerror"));
                    }
                },
                complete: function complete() {
                    toggle.busy = false;
                }
            });
        },

        _closeFeedbackFlag: function _closeFeedbackFlag() {
            if (this.extendedFeedbackFlag) {
                this.extendedFeedbackFlag.close();
                this.extendedFeedbackFlag = undefined;
            }
        },

        _showExtendedPermissionDisableFeedback: function _showExtendedPermissionDisableFeedback() {
            this._closeFeedbackFlag();

            var optOutFeedbackFlag = JiraFlag.showSuccessMsg(formatter.I18n.getText("admin.permissions.extendedadmin.feedback.flag.title"), JIRA.Templates.ProjectPermissions.optOutFeedbackFlag(), {
                closeable: true,
                close: 'manual'
            });
            var feedbackLink = optOutFeedbackFlag.querySelector("a.extended-admin-optout-link");

            this.extendedFeedbackFlag = optOutFeedbackFlag;
            setTimeout(function () {
                optOutFeedbackFlag.close();
                if (this.extendedFeedbackFlag === optOutFeedbackFlag) {
                    this.extendedFeedbackFlag = undefined;
                }
            }.bind(this), 10000);

            window.ATL_JQ_PAGE_PROPS = {
                "triggerFunction": function (showCollector) {
                    feedbackLink.addEventListener("click", function (event) {
                        this._closeFeedbackFlag();
                        event.preventDefault();
                        showCollector();
                    }.bind(this));
                }.bind(this)
            };

            $.ajax({
                url: "https://jira.atlassian.com/s/c0ee7481af1f09efe3d85af9bf8b8d01-T/7fmdi8/73011/b6b48b2829824b869586ac216d119363/2.0.23/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-UK&collectorId=b206bcb6",
                type: "get",
                cache: true,
                dataType: "script"
            });
        }
    });
});