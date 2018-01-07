define("jira/setup/setup-language-view", ['jira/util/formatter', 'jira/ajs/select/single-select', 'jira/util/data/meta', 'wrm/context-path', "jquery", "marionette", "underscore"], function (formatter, SingleSelect, Meta, wrmContextPath, $, Marionette, _) {
    'use strict';

    var fetchTimeout = 60 * 1000;

    return Marionette.ItemView.extend({
        defaultTexts: {
            button: formatter.I18n.getText("common.words.save"),
            cancel: formatter.I18n.getText("common.forms.cancel"),
            connectionWarningContent: formatter.I18n.getText("setup.language.dialog.connection.warning.content"),
            connectionWarningTitle: formatter.I18n.getText("setup.language.dialog.connection.warning.title"),
            langLabel: formatter.I18n.getText("setup.choose.language"),
            langDesc: formatter.I18n.getText("setupdb.server.language.description"),
            header: formatter.I18n.getText("setup.language.dialog.header")
        },

        ui: {
            button: ".jira-setup-language-save-button",
            cancel: ".jira-setup-language-cancel-button",
            footerSpinner: ".jira-setup-language-footer-spinner",
            select: "#jira-setup-language",
            spinner: ".jira-setup-language-spinner",
            warning: ".jira-setup-language-connection-warning"
        },

        events: {
            "click @ui.button": "onButtonClick",
            "click @ui.cancel": "onCancelClick",
            "change @ui.select": "onSelectChange"
        },

        template: JIRA.Templates.Setup.languageDialogContent,
        templateHelpers: {
            locales: [],
            showConnectionWarning: false,
            showSpinner: true,
            texts: {}
        },

        initialize: function initialize() {
            // fallback for default texts when jsI18n transformer doesn't work
            // (see atlassian-plugins-webresource-plugin-mock.xml)
            var defaultTexts = Meta.get("setup-language-dialog-default-texts");
            if (defaultTexts) {
                this.defaultTexts = JSON.parse(defaultTexts);
            }
        },

        showInitial: function showInitial() {
            this._formDisabled = false;
            this._defaultLocale = undefined; // the locale selected by default
            this._selectedLocale = undefined;

            this.templateHelpers.showSpinner = true;
            this.templateHelpers.showConnectionWarning = false;

            this.updateTexts();
            this.render();
            this.enableButton(false);
        },

        start: function start() {
            this.pullInstalledLocales();
        },

        updateSelected: function updateSelected(defaultLocale) {
            _.each(this.templateHelpers.locales, _.bind(function (localeData) {
                localeData.selected = this._selectedLocale ? localeData.value === this._selectedLocale : localeData.value === defaultLocale;
            }, this));
        },

        updateTexts: function updateTexts(newTexts) {
            var newTexts = newTexts || {};
            this.templateHelpers.texts = _.extend({}, this.defaultTexts, newTexts);
        },

        onButtonClick: function onButtonClick() {
            this.disableForm();

            $.ajax({
                data: { jiraLanguage: this._selectedLocale },
                dataType: "json",
                timeout: fetchTimeout,
                type: "POST",
                url: wrmContextPath() + "/secure/" + this.getCorrectActionName() + "!changeLanguage.jspa",
                complete: _.bind(this._languageChangeComplete, this)
            });
        },

        _languageChangeComplete: function _languageChangeComplete() {
            window.location.reload();
        },

        onCancelClick: function onCancelClick(e) {
            e.preventDefault();

            if (!this._formDisabled) {
                this.trigger("cancel-requested");
            }
        },

        onSelectChange: function onSelectChange() {
            this._selectedLocale = this.ui.select.val()[0];
            this.disableForm();
            this.ui.cancel.focus();
            this.pullLanguageTexts();
        },

        disableForm: function disableForm() {
            this._formDisabled = true;

            this.enableButton(false);

            this.ui.select.prop("disabled", true);
            this.langSingleSelect.disable();

            this.ui.footerSpinner.removeClass("hidden");
        },

        pullInstalledLocales: function pullInstalledLocales() {
            this.templateHelpers.showConnectionWarning = false;

            $.ajax({
                dataType: "json",
                timeout: fetchTimeout,
                type: "GET",
                url: wrmContextPath() + "/secure/" + this.getCorrectActionName() + "!getInstalledLocales.jspa",
                success: _.bind(this._pullInstalledLocalesSuccess, this),
                error: _.bind(this._pullInstalledLocalesError, this)
            });
        },

        _pullInstalledLocalesSuccess: function _pullInstalledLocalesSuccess(data) {
            var locales = [];

            _.each(data.locales, _.bind(function (text, value) {
                locales.push({
                    text: text,
                    value: value
                });
            }, this));

            this.templateHelpers.locales = _.sortBy(locales, "text");
            this.updateSelected(data.currentLocale);
            this.templateHelpers.showSpinner = false;

            this.render();
            this._defaultLocale = this.ui.select.val()[0];
            this.enableButton(false);
        },

        _pullInstalledLocalesError: function _pullInstalledLocalesError() {
            this.templateHelpers.showSpinner = false;
            this.templateHelpers.showConnectionWarning = true;

            this.render();
        },

        pullLanguageTexts: function pullLanguageTexts() {
            this.templateHelpers.showConnectionWarning = false;

            $.ajax({
                data: { localeForTexts: this._selectedLocale },
                dataType: "json",
                timeout: fetchTimeout,
                type: "GET",
                url: wrmContextPath() + "/secure/" + this.getCorrectActionName() + "!getLanguageTexts.jspa",
                success: _.bind(this._pullLanguageTextsSuccess, this),
                error: _.bind(this._pullLanguageTextsError, this)
            });
        },

        _pullLanguageTextsSuccess: function _pullLanguageTextsSuccess(data) {
            this.updateSelected();
            this.updateTexts(data);
            this.render();

            if (this._selectedLocale === this._defaultLocale) {
                this.enableButton(false);
            }
        },

        _pullLanguageTextsError: function _pullLanguageTextsError() {
            this.templateHelpers.showConnectionWarning = true;

            this.render();
        },

        onRender: function onRender() {
            this._formDisabled = false;
            this.langSingleSelect = new SingleSelect({
                element: this.ui.select
            });
            this.ui.cancel.focus();
        },

        enableButton: function enableButton(enable) {
            var enable = enable === undefined ? true : enable;

            this.ui.button.prop("disabled", !enable);
            this.ui.button.attr("aria-disabled", "" + !enable);
        },

        getCorrectActionName: function getCorrectActionName() {
            var match = window.location.pathname.replace(wrmContextPath() + "/secure/", "").match(/^([a-zA-Z]+)/);

            return match ? match[0] : "SetupMode";
        }
    });
});