define("jira/admin/application/defaults/ApplicationView", ["marionette"], function (Marionette) {
    "use strict";

    return Marionette.ItemView.extend({
        className: "checkbox",
        template: JIRA.Templates.ApplicationSelector.applicationCheckbox,

        ui: {
            setting: ".checkbox"
        },

        triggers: {
            "change @ui.setting": "setting:changed"
        },

        isSelected: function isSelected() {
            return this.ui.setting.is(":checked");
        },

        serializeData: function serializeData() {
            var application = this.model.toJSON();
            application.selected = application.selectedByDefault;
            return {
                application: application,
                showInfoMessages: false
            };
        }
    });
});

define("jira/admin/application/defaults/ApplicationListView", ["jquery", "marionette", "jira/admin/application/defaults/ApplicationView"], function ($, Marionette, ApplicationView) {
    "use strict";

    var EmptyView = Marionette.ItemView.extend({
        template: JIRA.Templates.Admin.ApplicationAccessDefaults.listEmpty
    });

    return Marionette.CompositeView.extend({
        itemView: ApplicationView,
        itemViewContainer: ".application-picker-applications",

        emptyView: EmptyView,

        template: JIRA.Templates.Admin.ApplicationAccessDefaults.list,

        commit: function commit() {
            var $settings = this.$el.find('.application.checkbox');
            $settings.each(function (idx, checkbox) {
                var $checkbox = $(checkbox);
                var roleKey = $checkbox.data('key');
                var selectedByDefault = $checkbox.is(":checked");
                var roleModel = this.collection.get({ id: roleKey });
                if (roleModel.get("selectedByDefault") != selectedByDefault) {
                    roleModel.set("selectedByDefault", selectedByDefault);
                }
            }.bind(this));

            return this.collection.updateDefaults();
        },

        onRender: function onRender() {
            this.unwrapTemplate();
        }
    });
});

define("jira/admin/application/defaults/DialogView", ["jquery", "underscore", "marionette"], function ($, _, Marionette) {
    "use strict";

    var ErrorView = Marionette.ItemView.extend({
        template: JIRA.Templates.Admin.ApplicationAccessDefaults.showError
    });

    var WarningView = Marionette.ItemView.extend({
        serializeData: function serializeData() {
            return {
                applications: this.options.applications
            };
        }
    });

    return Marionette.Layout.extend({
        ui: {
            submit: ".app-role-defaults-dialog-submit-button",
            close: ".app-role-defaults-dialog-close-button",
            iconWait: ".aui-dialog2-footer .aui-icon-wait",
            webPanels: ".app-role-defaults-web-panels"
        },

        regions: {
            errors: ".app-role-defaults-errors",
            warnings: ".app-role-defaults-warnings",
            contents: ".app-role-defaults-contents"
        },

        events: {
            "click @ui.submit": "formSubmit",
            "click @ui.close": "close"
        },

        template: JIRA.Templates.Admin.ApplicationAccessDefaults.dialog,

        onRender: function onRender() {
            this.unwrapTemplate();

            this.dialog = AJS.dialog2(this.$el);
            this.dialog.on("hide", this.close.bind(this));
        },

        show: function show() {
            this.dialog.show();
        },

        disable: function disable() {
            this.$(':input').prop("disabled", true);
        },

        enable: function enable() {
            this.$(':input').prop("disabled", false);
        },

        showContents: function showContents(contentView) {
            this.contents.show(contentView);
            this.ui.webPanels.html(this.options.webPanels);
            this.showWarning();

            this.trigger("showContents");
            this.listenTo(contentView, "itemview:setting:changed", this.showWarning);
        },

        showWarning: function showWarning() {
            this.warnings.reset();

            var applicationsWithoutSeats = this._applicationsWithoutSeats();
            var applicationsWithoutDefaultGroup = this._applicationsWithoutDefaultGroup();

            // exceeded seat limit warning will override default groups warning
            if (applicationsWithoutSeats.length > 0) {
                this.warnings.show(new WarningView({
                    template: JIRA.Templates.Admin.ApplicationAccessDefaults.noSeatsWarning,
                    applications: applicationsWithoutSeats
                }));
            } else if (applicationsWithoutDefaultGroup.length > 0) {
                this.warnings.show(new WarningView({
                    template: JIRA.Templates.Admin.ApplicationAccessDefaults.noDefaultGroupWarning,
                    applications: applicationsWithoutDefaultGroup
                }));
            }
        },

        /**
         * Get selected items
         * @returns {Array.<ItemView>}
         * @private
         */
        _selectedItems: function _selectedItems() {
            return this.contents.currentView.children.filter(function (item) {
                return item.isSelected();
            });
        },

        /**
         * Return applications that don't have default groups defined
         * @returns {Array}
         * @private
         */
        _applicationsWithoutDefaultGroup: function _applicationsWithoutDefaultGroup() {
            return this._selectedItems().filter(function (item) {
                return _.isEmpty(item.model.get("defaultGroups"));
            }).map(function (item) {
                return item.model.attributes;
            });
        },

        /**
         * Return applications that don't have any seats available are not type of unlimited license
         * @returns {Array}
         * @private
         */
        _applicationsWithoutSeats: function _applicationsWithoutSeats() {
            return this._selectedItems().filter(function (item) {
                return item.model.get("remainingSeats") == 0 && !item.model.get("hasUnlimitedSeats");
            }).map(function (item) {
                return item.model.attributes;
            });
        },

        formSubmit: function formSubmit() {
            this.errors.reset();
            this.disable();
            this.ui.iconWait.removeClass("hidden");

            return this.contents.currentView.commit().done(function () {
                this.close();
            }.bind(this)).fail(function () {
                this.errors.show(new ErrorView());
                this.enable();
                this.ui.iconWait.addClass("hidden");
            }.bind(this));
        },

        onClose: function onClose() {
            if (this.dialog.isVisible()) {
                this.dialog.remove();
            }
        }
    });
});

define("jira/admin/application/defaults", ["jquery", "marionette", "jira/admin/application/defaults/DialogView", "jira/admin/application/defaults/ApplicationListView", "jira/admin/application/defaults/api", "jira/util/logger", "wrm/data"], function ($, Marionette, DialogView, ApplicationListView, defaultsAPI, logger, wrmData) {
    "use strict";

    return Marionette.Controller.extend({

        initialize: function initialize(collection) {
            var webPanels = wrmData.claim("com.atlassian.jira.web.action.admin.application-access:defapp-selector-webpanels");
            $('.app-role-defaults-show-button').on('click', function () {
                var dialogView = new DialogView({
                    collection: collection,
                    webPanels: webPanels
                });
                dialogView.on("showContents", function () {
                    defaultsAPI.trigger(defaultsAPI.EVENT_ON_SHOW, dialogView);
                });
                dialogView.render();
                dialogView.show();

                dialogView.disable();
                collection.whenFetched().then(function () {
                    dialogView.enable();
                    dialogView.showContents(new ApplicationListView({ collection: collection }));
                    logger.trace('jira.admin.application.defaultsdialog.enabled');
                });
            }.bind(this));
        }
    });
});