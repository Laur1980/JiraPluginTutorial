define('jira/ajs/select/queryable-dropdown-select', ['jira/util/formatter', 'jira/jquery/deferred', 'jira/ajs/control', 'jira/ajs/select/suggestions/default-suggest-handler', 'jira/ajs/layer/inline-layer-factory', 'jira/ajs/list/list', 'jira/util/key-code', 'jira/util/navigator', 'jira/util/assistive', 'jquery', 'underscore'], function (formatter, Deferred, Control, DefaultSuggestHandler, InlineLayerFactory, List, keyCodes, Navigator, Assistive, jQuery, _) {
    'use strict';

    var SUGGESTIONS_ID_SUFFIX = '-suggestions';
    var CONTROL_ID = 0;

    /**
     * A dropdown that can be queried and it's links selected via keyboard. Dropdown contents retrieved via AJAX.
     *
     * @class QueryableDropdownSelect
     * @extends Control
     */
    return Control.extend({

        /**
         * A request will not be fired and suggestions will not reset if any of these keys are inputted.
         *
         * @enum
         */
        INVALID_KEYS: {
            "Shift": true,
            "Esc": true,
            "Right": true
        },

        /**
         * Overrides default options with user options. Inserts an input field before dropdown.
         *
         * @param {Object} options
         * @param {jQuery | HTMLElement} options.element
         * @param {SuggestHandler} options.suggestionsHandler
         * @constructs
         */
        init: function init(options) {
            this.suggestionsVisible = false;
            this._setOptions(options);
            this._createFurniture();
            this._createDropdownController();
            this._createSuggestionsController();
            this._createListController();
            this._assignEventsToFurniture();

            if (this.options.width) {
                this.setFieldWidth(this.options.width);
            }
            if (this.options.loadOnInit) {
                // eagerly get suggestions
                this.requestSuggestions(true);
            }
        },

        /**
         * Creates dropdown controller
         */
        _createDropdownController: function _createDropdownController() {
            var instance = this;
            if (this.options.dropdownController) {
                this.dropdownController = this.options.dropdownController;
            } else {
                this.dropdownController = InlineLayerFactory.createInlineLayers({
                    offsetTarget: this.$field,
                    width: this.$field.innerWidth(),
                    content: this.options.element
                });
            }
            this.dropdownController.onhide(function () {
                instance.hideSuggestions();
            });
        },

        /**
         * Creates suggestions controller
         */
        _createSuggestionsController: function _createSuggestionsController() {
            var HandlerClass = this.options.suggestionsHandler ? this.options.suggestionsHandler : DefaultSuggestHandler;
            this.suggestionsHandler = new HandlerClass(this.options);
        },

        /**
         * Creates list controller
         */
        _createListController: function _createListController() {
            var instance = this;
            this.listController = new List({
                containerSelector: this.options.element,
                groupSelector: "ul.aui-list-section",
                matchingStrategy: this.options.matchingStrategy,
                eventTarget: this.$field,
                selectionHandler: function selectionHandler() {
                    // prevent form field from being dirty
                    instance.$field.val(formatter.I18n.getText("common.concepts.loading")).css("color", "#999");
                    instance.hideSuggestions();
                    return true;
                }
            });
        },

        _onItemFocus: function _onItemFocus(e, item) {
            var $field = this.$field;
            var id = item && item.id ? item.id : "null";
            Assistive.wait(function () {
                $field.attr("aria-activedescendant", id);
            });
        },

        /**
         * Sets field width
         *
         * @param {Number} width - field width
         */
        setFieldWidth: function setFieldWidth(width) {
            this.$container.css({
                width: width,
                minWidth: width
            });
        },

        /**
         * Show an error message near this field
         *
         * @param {String} [value] - The user input text responsible for the error.
         * Defaults to the `options.errorMessage` provided in construction.
         */
        showErrorMessage: function showErrorMessage(value) {

            var $container = this.$container.parent(".field-group"); // aui container

            this.hideErrorMessage(); // remove old

            this.$errorMessage.text(formatter.format(this.options.errorMessage, value || this.getQueryVal()));

            if ($container.length === 1) {
                $container.append(this.$errorMessage);
                return;
            }

            if ($container.length === 0) {
                $container = this.$container.parent(".frother-control-renderer"); // not in aui but JIRA renderer
            }

            if ($container.length === 1) {
                this.$errorMessage.prependTo($container);
                return;
            }

            if ($container.length === 0) {
                this.$container.parent().append(this.$errorMessage);
            }
        },

        /**
         * Hides the error message
         */
        hideErrorMessage: function hideErrorMessage() {
            if (this.$errorMessage) {
                this.$errorMessage.remove();
            }
            this.$container.parent().find(".error").remove(); // remove all error message from server also
        },

        /**
         * Gets default options
         *
         * @private
         * @return {Object}
         */
        _getDefaultOptions: function _getDefaultOptions() {
            CONTROL_ID += 1;

            return {
                id: CONTROL_ID,
                // keyInputPeriod: expected milliseconds between consecutive keystrokes
                // If this user types faster than this, no requests will be issued until they slow down.
                keyInputPeriod: 75,
                // localListLiveUpdateLimit: Won't search for new options if there are more options than this value
                localListLiveUpdateLimit: 25,
                // Only search for new options locally after this delay.
                localListLiveUpdateDelay: 150
            };
        },

        /**
         * Appends furniture around specified dropdown element. This includes:
         *
         * <ul>
         *  <li>Field - text field used fro querying</li>
         *  <li>Container - Wrapper used to contain all furniture</li>
         *  <li>Dropdown Icon - Button in right of field used to open dropdown via mouse</li>
         * </ul>
         */
        _createFurniture: function _createFurniture() {
            this.$container = this._render("container").insertBefore(this.options.element);
            this.suggestionsContainerId = this.options.id + SUGGESTIONS_ID_SUFFIX;
            this.$field = this._render("field").appendTo(this.$container);
            this.$dropDownIcon = this._render("dropdownAndLoadingIcon", this._hasDropdownButton()).appendTo(this.$container);
            if (this.options.overlabel) {
                this.$overlabel = this._render("overlabel").insertBefore(this.$field);
                this.$overlabel.overlabel();
            }
        },

        /**
         * Whether or not to display dropdown icon/button
         *
         * @protected
         * @return {Boolean}
         */
        _hasDropdownButton: function _hasDropdownButton() {
            return this.options.showDropdownButton || this.options.ajaxOptions && this.options.ajaxOptions.minQueryLength === 0;
        },

        /**
         * Assigns events to DOM nodes
         *
         * @protected
         */
        _assignEventsToFurniture: function _assignEventsToFurniture() {

            var instance = this;

            this._assignEvents("ignoreBlurElement", this.dropdownController.$layer);
            this._assignEvents("container", this.$container);

            if (this._hasDropdownButton()) {
                this._assignEvents("ignoreBlurElement", this.$dropDownIcon);
                this._assignEvents("dropdownAndLoadingIcon", this.$dropDownIcon);
            }

            // if this control is created as the result of a keydown event then we do no want to catch keyup or keypress for a moment
            setTimeout(function () {
                instance._assignEvents("field", instance.$field);
                instance._assignEvents("keys", instance.$field);
            }, 15);

            this.listController.bind("itemFocus", this._onItemFocus.bind(this));
        },

        /**
         * Requests JSON formatted suggestions from specified resource. Resource is sepecified in the ajaxOptions object
         * passed to the constructed during initialization.
         *
         * If the query option of ajaxOptions is set to true, an ajax request will be made for every keypress. Otherwise
         * ajax request will be made only the first time the dropdown is shown.
         *
         * @private
         * @param {Boolean} force - flag to specify that gating by keyInputPeriod should be circumvented
         */
        requestSuggestions: function requestSuggestions(force) {
            var instance = this;
            var deferred = new Deferred();

            this.outstandingRequest = this.suggestionsHandler.execute(this.getQueryVal(), force).done(function (descriptors, query) {
                if (query === instance.getQueryVal()) {
                    deferred.resolve(descriptors, query);
                }
            });
            if (this.outstandingRequest.state() !== "resolved") {
                window.clearTimeout(this.loadingWait); // clear existing wait
                // wait 150ms until we should throbber to avoid flickering while typing
                this.loadingWait = window.setTimeout(function () {
                    if (instance.outstandingRequest.state() === "pending") {
                        instance.showLoading();
                    }
                }, 150);

                this.outstandingRequest.always(function () {
                    instance.hideLoading(); // make sure we always remove throbber
                });
            }
            return deferred;
        },

        /**
         * Show the loading indicator
         * @return {*} this
         */
        showLoading: function showLoading() {
            this.$dropDownIcon.addClass("loading").removeClass("noloading");
            if (!this.$dropDownIcon.data("spinner")) {
                this.$dropDownIcon.spin();
            }
            this.$field.attr('aria-busy', 'true');
            return this;
        },

        /**
         * Hide the loading indicator
         * @return {*} this
         */
        hideLoading: function hideLoading() {
            this.$dropDownIcon.removeClass("loading").addClass("noloading");
            this.$dropDownIcon.spinStop();
            this.$field.attr('aria-busy', 'false');
            return this;
        },
        /**
         *
         * Sets suggestions and shows them
         *
         * @param {Array} Descriptors
         */
        _setSuggestions: function _setSuggestions(data) {

            if (data) {
                this.listController.generateListFromJSON(data, this.getQueryVal());
                this.showSuggestions();
            } else {
                this.hideSuggestions();
            }

            // Makes WebDriver wait for the correct suggestions
            this.$container.attr("data-query", this.getQueryVal());
        },

        /**
         * Fades out & disables interactions with field
         */
        disable: function disable() {
            if (!this.disabled) {
                this.$container.addClass("aui-disabled");
                // The disabledBlanket is necessary to prevent clicks on other elements positioned over the field.
                this.$disabledBlanket = this._render("disabledBlanket").appendTo(this.$container);
                this.$field.attr('disabled', true);
                this.dropdownController.hide();
                this.disabled = true;
            }
        },

        /**
         * Enables interactions with field
         */
        enable: function enable() {
            if (this.disabled) {
                this.$container.removeClass("aui-disabled");
                this.$disabledBlanket.remove();
                this.$field.attr('disabled', false);
                this.disabled = false;
            }
        },

        /**
         * Gets input field value
         *
         * @return {String}
         */
        getQueryVal: function getQueryVal() {
            return jQuery.trim(this.$field.val());
        },

        _isValidInput: function _isValidInput(event) {
            return this.$field.is(":visible") && !(event.type === "aui:keydown" && this.INVALID_KEYS[event.key]);
        },

        /**
         * Hides list if the is no value in input, otherwise shows and resets suggestions in dropdown
         *
         * @param {Boolean} force - flag to specify that gating by keyInputPeriod (via requestSuggestions) should be circumvented
         * @private
         */
        _handleCharacterInput: function _handleCharacterInput(force) {
            var queryLength = this.getQueryVal().length;
            if (queryLength >= 1 || force) {
                this.requestSuggestions(force).done(_.bind(function (suggestions) {
                    this._setSuggestions(suggestions);
                }, this));
            } else {
                this.hideSuggestions();
            }
        },

        /**
         * Handles down key
         *
         * @param {Event} e
         */
        _handleDown: function _handleDown(e) {
            if (!this.suggestionsVisible) {
                this.listController._latestQuery = ""; // JRADEV-9009 Resetting query value
                this._handleCharacterInput(true);
            }
            e.preventDefault();
        },

        /**
         * Cancels and pending or outstanding requests
         *
         * @protected
         */
        _rejectPendingRequests: function _rejectPendingRequests() {
            if (this.outstandingRequest) {
                this.outstandingRequest.reject();
            }
        },

        showSuggestions: function showSuggestions() {
            if (this.suggestionsVisible) {
                return;
            }
            this.suggestionsVisible = true;
            this.dropdownController.show();
            this.dropdownController.setWidth(this.$field.innerWidth());
            this.dropdownController.setPosition();
            this.listController.enable();
            this.$field.attr("aria-expanded", "true");
            this.$field.attr("aria-controls", this.suggestionsContainerId);
        },

        /**
         * Hides suggestions
         */
        hideSuggestions: function hideSuggestions() {
            if (!this.suggestionsVisible) {
                return;
            }
            this._rejectPendingRequests();
            this.suggestionsVisible = false;
            this.$dropDownIcon.addClass("noloading");
            this.dropdownController.hide();
            this.listController.disable();
            this.$field.removeAttr("aria-activedescendant");
            this.$field.attr("aria-expanded", "false");
            this.$field.removeAttr("aria-controls");
        },

        _deactivate: function _deactivate() {
            this.hideSuggestions();
        },

        /**
         * Handles Escape key
         *
         * @param {Event} e
         */
        _handleEscape: function _handleEscape(e) {
            if (this.suggestionsVisible) {
                e.stopPropagation();
                if (e.type === "keyup") {
                    this.hideSuggestions();
                    if (Navigator.isIE() && Navigator.majorVersion() < 12) {
                        // IE - field has already received the event and lost focus (default browser behaviour)
                        this.$field.focus();
                    }
                }
            }
        },

        /**
         * Selects currently focused suggestion, if there is one
         */
        acceptFocusedSuggestion: function acceptFocusedSuggestion() {
            var focused = this.listController.getFocused();
            if (focused.length !== 0 && focused.is(":visible")) {
                this.listController._acceptSuggestion(focused);
            }
        },

        keys: {
            "Down": function Down(e) {
                if (this._hasDropdownButton()) {
                    this._handleDown(e);
                }
            },
            "Up": function Up(e) {
                e.preventDefault();
            },
            "Return": function Return(e) {
                e.preventDefault();
            }
        },

        onEdit: function onEdit() {
            this._handleCharacterInput();
        },

        _events: {

            dropdownAndLoadingIcon: {
                click: function click(e) {
                    if (this.suggestionsVisible) {
                        this.hideSuggestions();
                    } else {
                        this._handleDown(e);
                        this.$field.focus();
                    }
                    e.stopPropagation();
                }
            },

            container: {
                disable: function disable() {
                    this.disable();
                },
                enable: function enable() {
                    this.enable();
                }
            },

            field: {
                blur: function blur() {
                    if (!this.ignoreBlurEvent) {
                        this._deactivate();
                    } else {
                        this.ignoreBlurEvent = false;
                    }
                },
                click: function click(e) {
                    e.stopPropagation();
                },
                "keydown keyup": function keydownKeyup(e) {
                    if (e.keyCode === keyCodes.ESCAPE) {
                        this._handleEscape(e);
                    }
                }
            },

            keys: {
                "aui:keydown input": function auiKeydownInput(event) {
                    this._handleKeyEvent(event);
                }
            },

            ignoreBlurElement: {
                mousedown: function mousedown(e) {
                    if (Navigator.isIE() && Navigator.majorVersion() < 12) {
                        // JRA-27685. IE fires blur events when user clicks on the scrollbar inside autocomplete suggestion list.
                        // In that case we don't deactivate the input field by setting a flag and checking it in field:blur.
                        // eslint-disable-next-line eqeqeq
                        var targetIsDropdownController = jQuery(e.target)[0] == jQuery(this.dropdownController.$layer)[0];

                        if (targetIsDropdownController) {
                            this.ignoreBlurEvent = true;
                        }
                    }

                    // IE9 and other browsers
                    e.preventDefault();
                }
            }
        },

        _renders: {

            disabledBlanket: function disabledBlanket() {
                return jQuery("<div class='aui-disabled-blanket' />").height(this.$field.outerHeight());
            },
            overlabel: function overlabel() {
                return jQuery("<span class='overlabel' />").text(this.options.overlabel).attr({
                    "data-target": this.options.id + "-field",
                    "id": this.options.id + "-overlabel"
                });
            },

            baseField: function baseField(tagName) {
                // we create the element this way so there's no accidental XSS, like
                // there might be if allowing jQuery to interpret tagName as HTML.
                var el = document.createElement(tagName || "input");
                return jQuery(el).attr({
                    "autocomplete": "off",
                    "role": "combobox",
                    "aria-autocomplete": "list",
                    "aria-haspopup": "true",
                    "aria-expanded": "false"
                });
            },

            field: function field() {
                return this._render("baseField").attr({
                    "class": "text",
                    "id": this.options.id + "-field",
                    "type": "text"
                });
            },
            container: function container() {
                return jQuery("<div class='queryable-select' />").attr("id", this.options.id + "-queryable-container");
            },
            dropdownAndLoadingIcon: function dropdownAndLoadingIcon(showDropdown) {
                return jQuery('<span class="icon noloading"><span>More</span></span>').toggleClass("drop-menu", !!showDropdown);
            },
            suggestionsContainer: function suggestionsContainer(idPrefix) {
                return jQuery('<div />').attr({
                    "class": "aui-list",
                    "id": idPrefix + SUGGESTIONS_ID_SUFFIX,
                    "tabindex": "-1",
                    "role": "listbox"
                });
            }
        }
    });
});

/** Preserve legacy namespace
    @deprecated AJS.QueryableDropdown */
AJS.namespace('AJS.QueryableDropdown', null, require('jira/ajs/select/queryable-dropdown-select'));
AJS.namespace('AJS.QueryableDropdownSelect', null, require('jira/ajs/select/queryable-dropdown-select'));