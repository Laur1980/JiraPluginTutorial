/**
 *
 * Marionette view containing functionality for adding scheme for an issue field
 * - handles drag and drop sortable
 * - handles default option dropdown depending on selcted options
 * - serializes selected options during form submission
 * * @param {Object} options - options valid for marionette view
 * * @param {Object} options.ui - used to provide custom selectors for the elements in page. The elements must be inside <form> with action attribute
 * * @param {String} options.ui.defaultOptionSelect - selector for default option <select> for the scheme
 * * @param {String} options.ui.selectedOptions - selector for list (<ul>) containing selected options
 * * @param {String} options.ui.availableOptions - selector for list (<ul>) containing available options
 * * @param {String} options.ui.submitButton - selector for the submit button to save the scheme
 * * @private
 * @returns {Marionette.View}
 */
define('jira/issue/configureissuefieldscheme', ['underscore', 'jquery', 'marionette', 'jira/analytics'], function (_, $, Marionette, analytics) {
    'use strict';

    return Marionette.View.extend({
        ui: {
            defaultOptionSelect: '#default-option-select',
            addAllButton: '#addAllAvailableOptions',
            removeAllButton: '#removeAllSelectedOptions',
            selectedOptions: '#selectedOptions',
            availableOptions: '#availableOptions',
            submitButton: '#submitSave'
        },
        events: function events() {

            /*
            * We need to do this here because we allow custom UI selectors to be passed in with view constructor options
            * This is done here because current version of marionette (1.6.1) does not support defining UI hash as a function (line 1290).
            * Ideally this should be done in UI function that returns the UI hash.
            * */
            if (this.options && _.isObject(this.options.ui)) {
                _.extend(this.ui, this.options.ui);
            }

            // Marionette does not support multiple @ui items in single selector. At least  1.6.1 doesn't :/
            return {
                'click @ui.addAllButton': 'moveAll',
                'click @ui.removeAllButton': 'moveAll',
                'click @ui.submitButton': 'submitForm'
            };
        },
        initialize: function initialize() {
            var _this = this;

            /* Marionette.View in old versions having Marionette.ItemView doesn't bind UI elements by itself.
             * ItemView does this after rendering when there is a render function. But we don't need one since page content is not rendered by this view
             * So we have to call this manually for now. Probably this won't be needed in newer versions which doesn't have Marionette.ItemView
             * Make sure this is bound before accessing any UI elements
             */
            this.bindUIElements();

            this.ui.selectedOptions.sortable({
                opacity: 0.7,
                connectWith: this.ui.availableOptions,
                update: function update(event, ui) {
                    /*
                     * Send analytics only when reordering within selected options
                     * if ui.sender is present it means update is caused by by a receive
                     * if the element is inside #availableOptions it means update is caused by a remove
                      */
                    if (!ui.sender && !ui.item.parent().is(_this.ui.availableOptions)) {
                        _this.sendAnalyticsEvent("reordered");
                    }
                },
                receive: function receive() {
                    _this.sendAnalyticsEvent("added");
                },
                remove: function remove() {
                    _this.sendAnalyticsEvent("removed");
                }
            });

            this.ui.availableOptions.sortable({
                update: this.restrictOptions.bind(this),
                opacity: 0.7,
                connectWith: this.ui.selectedOptions
            });
            // This makes use of jQuery UI Sortable API so must be called only after initializing sortables
            this.restrictOptions();
        },

        /**
         * Will move all list nodes from one list to another
         */
        moveAll: function moveAll(e) {
            // Prevent the jump caused by <a href="#">
            e.preventDefault();
            var source = void 0;
            var target = void 0;
            if (this.ui.addAllButton.is(e.target)) {
                source = this.ui.availableOptions;
                target = this.ui.selectedOptions;
            } else {
                source = this.ui.selectedOptions;
                target = this.ui.availableOptions;
            }
            source.find('li').appendTo(target);
            this.restrictOptions();
        },
        sendAnalyticsEvent: function sendAnalyticsEvent(name) {
            // TBD
            analytics.send({
                name: "administration.issuetypeschemes.issuetype." + name + ".global"
            });
        },

        /**
         * Serialises selected priorities and their order into a valid POST string
         * @private
         * @returns {String}
         */
        getSelectedOptions: function getSelectedOptions() {
            return this.ui.selectedOptions.sortable("serialize", { key: "selectedOptions" }) || 'selectedOptions=';
        },

        /**
         * Updates default priority select box options
         * @private
         */
        restrictOptions: function restrictOptions() {
            var queryString = this.getSelectedOptions().replace(/selectedOptions=/g, "");
            var selectedOptions = queryString.split('&');
            var selectElement = this.ui.defaultOptionSelect.get(0);
            var defaultOption = selectElement.options[0];
            var customOptions = $(selectElement.options).slice(1);
            customOptions.each(function (i, option) {
                var $option = $(option);
                if (_.contains(selectedOptions, option.value)) {
                    $option.removeClass('hidden');
                } else {
                    if (option.selected) {
                        option.selected = false;
                        defaultOption.selected = true;
                    }
                    $option.addClass('hidden');
                }
            });
        },

        /**
         * Sets form action to include serialised selected priorities.
         * This is not great but to send this data along with form data we need to generate multiple hidden inputs or use AJAX
         * @private
         * @returns {Boolean} lets form continue with submission
         */
        submitForm: function submitForm(e) {
            var form = e.target.form;
            form.action = form.action + '?' + this.getSelectedOptions();
            return true;
        }
    });
});