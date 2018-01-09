define('jira/admin/view-user/view-user', ['jira/util/urls', 'jira/util/formatter', 'jira/admin/application-selector', 'jira/flag', 'jira/skate', 'marionette', 'jquery'], function (urls, formatter, ApplicationSelector, Flag, skate, Marionette, $) {
    "use strict";

    return Marionette.ItemView.extend({
        template: JIRA.Templates.Admin.ViewUser.applicationsAndGroupsContent,

        initialize: function initialize() {
            this._initializeApplicationSelector();
        },

        onRender: function onRender() {
            this._initializeApplicationSelector();
        },

        _initializeApplicationSelector: function _initializeApplicationSelector() {
            var that = this;
            var applicationPickerElement = $(".application-picker");
            if (applicationPickerElement.length === 0) {
                return;
            }

            this.applicationSelector = new ApplicationSelector({
                el: applicationPickerElement,
                disableEffectiveAccess: true,
                disableUndefinedWarningDisplaying: true
            });
            skate.init(applicationPickerElement);

            this.listenTo(this.applicationSelector, "itemview:application:toggle", function (child, options) {
                if (!options.manual) {
                    return;
                }
                that.applicationSelector.disableAllApplications();
                that.trigger("application-trigger", { application: child });
            });

            // if dialog open after click on checkbox, let's open it again after applications
            this.listenTo(this.applicationSelector, "itemview:dialog:opened", function (child, options) {
                that.inlineWarningOpened = {
                    applicationKey: child.getApplicationKey(),
                    type: options.type
                };
            });

            if (this.inlineWarningOpened) {
                this.applicationSelector.getByKey(this.inlineWarningOpened.applicationKey).displayWarning(this.inlineWarningOpened.type);
            }
            delete this.inlineWarningOpened;
        },

        onError: function onError(error, status) {
            this.data = {};
            try {
                this.data = JSON.parse(error);

                if (this.data.selectableApplications && this.data.selectableApplications.length > 0) {
                    this.render();
                }
            } catch (e) {
                // if error message is not defined default message will be set in template
                // JIRA.Templates.Admin.ViewUser.applicationAccessError
            }

            Flag.showWarningMsg(formatter.I18n.getText('admin.viewuser.error.rest.title'), JIRA.Templates.Admin.ViewUser.applicationAccessError({
                messages: this.data.errorMessages,
                status: status
            }));
        },

        update: function update(response) {
            this.data = response;
            this.render();
        },

        serializeData: function serializeData() {
            return $.extend({
                token: urls.atl_token(),
                username: this.options.username,
                isUserEditable: this.data.editable
            }, this.data);
        }
    });
});