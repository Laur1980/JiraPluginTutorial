define('jira/field/no-browser-user-name-picker', ['require'], function (require) {
    'use strict';

    var jQuery = require('jquery');
    var ItemDescriptor = require('jira/ajs/list/item-descriptor');
    var MultiSelect = require('jira/ajs/select/multi-select');
    var formatter = require('jira/util/formatter');
    var wrmContextPath = require('wrm/context-path');

    var contextPath = wrmContextPath();

    /**
     * Caters for addition of users in frotherized MultiSelect inputs when the user
     * does not have the Browse User permission.
     *
     * Whilst this control could potentially give away valid usernames it is not new in this behaviour.
     * The old-style user picker used in the Edit Issue form will reveal if a particular username is invalid or not.
     * @class
     * @extends MultiSelect
     */
    return MultiSelect.extend({

        /**
         * Use the User REST interface to attempt to get a user by username.
         */
        _getDefaultOptions: function _getDefaultOptions() {
            return jQuery.extend(true, this._super(), {
                errorMessage: formatter.I18n.getText("admin.project.people.nobrowse.user.doesntexist"),
                showDropdownButton: false,
                removeOnUnSelect: true,
                itemAttrDisplayed: "label"
            });
        },

        /**
         * Override to prevent requesting per keypress.
         *
         * NoBrowseUserNamePicker does not send a request per keypress.
         * Instead it will request for validity when enter or space is pressed
         * or when the field is blurred.
         */
        _handleCharacterInput: function _handleCharacterInput() {
            //this.hideErrorMessage();
        },

        /**
         * Prevents the display of Suggestions for this control.
         *
         * We don't want any suggestions for the NoBrowseUserNamePicker
         * as the user using doesn't have access to see a list of users.
         * Also, using this REST enpoint will not retrieve a list of users anyway.
         */
        _setSuggestions: function _setSuggestions() {},

        /**
         * Handles an error from the REST endpoint.
         *
         * The REST endpoint used for this operation returns a 404 if the user requested
         * does not exist. This situation is handled here.
         *
         * If any other error is returned the parent's error handler will be used.
         *
         * @param smartAjaxResult The error.
         */
        _handleServerError: function _handleServerError(smartAjaxResult) {
            if (smartAjaxResult.status === 404) {
                this.showErrorMessage();
            } else {
                this._super();
            }
        },

        /**
         * Called when the field is blurred.
         *
         * When the field is deactivated (i.e. blurred) we want to issue a
         * request to check if the currently entered username (if any) is valid or not.
         */
        _deactivate: function _deactivate() {
            this.validateAndAdd();
        },

        /**
         * Issues a request to the User REST endpoint with the current field value.
         *
         * Hides any existing error messages before issuing a request to the User endpoint
         * to determine the validity of the current input.
         */
        validateAndAdd: function validateAndAdd() {
            var instance = this;
            if (jQuery.trim(this.$field.val()) === "") {
                this.hideErrorMessage();
            } else {
                jQuery.ajax({
                    url: contextPath + "/rest/api/2/user",
                    data: {
                        username: jQuery.trim(instance.getQueryVal())
                    },
                    success: function success(user) {
                        instance.hideErrorMessage();
                        instance.$field.val("");
                        instance.addItem(new ItemDescriptor({
                            label: user.displayName,
                            value: user.name
                        }));
                    },
                    error: function error() {
                        instance.showErrorMessage();
                    }
                });
            }
        },

        /**
         * Sends a request to the REST endpoint using the currently entered username (if any)
         * when space is pressed.
         *
         * This allows for quick entry of usernames.
         *
         * If the username is not valid the space keypress event is prevented and an error message
         * displayed.
         */
        _handleSpace: function _handleSpace() {
            this.validate();
        },

        /**
         * Transforms the successfully returned username into a Lozenge.
         *
         * @param data The successfully selected username.
         */
        _handleServerSuggestions: function _handleServerSuggestions() {
            this.hideErrorMessage();
            this.handleFreeInput();
        },

        /**
         * Adds the current user input as a lozenge.
         *
         * By this time the input has been validated as a username.
         * If the input is not a valid username the response comes back as a
         * 404 triggering _handleServerError.
         */
        handleFreeInput: function handleFreeInput() {
            var value = jQuery.trim(this.$field.val());

            if (value !== "") {
                this.addItem({ value: value, label: value });
                this.model.$element.trigger("change");
            }

            this.$field.val("");
        },

        keys: {
            /**
             * Issue a request for the currently entered username when Return is pressed.
             *
             * @param event The aui:keypress event.
             */
            "Return": function Return(event) {
                event.preventDefault();
                this.validateAndAdd();
            },

            /**
             * Issue a request for the currently entered username when the Spacebar is pressed.
             *
             * @param event The aui:keypress event.
             */
            "Spacebar": function Spacebar(event) {
                event.preventDefault();
                this.validateAndAdd();
            }
        }
    });
});

AJS.namespace('AJS.NoBrowseUserNamePicker', null, require('jira/field/no-browser-user-name-picker'));