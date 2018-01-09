define('jira/ajs/select/checkbox-multi-select', ['jira/util/formatter', 'jira/util/key-code', 'jira/ajs/select/queryable-dropdown-select', 'jira/ajs/select/select-helper', 'jira/ajs/select/select-model', 'jira/ajs/select/suggestions/checkbox-multi-select-suggest-handler', 'jira/ajs/list/list', 'jira/util/events', 'jira/util/events/types', 'jquery', 'underscore'], function (formatter, keyCodes, QueryableDropdownSelect, SelectHelper, SelectModel, SelectSuggestHandler, List, Events, Types, jQuery, _) {
    'use strict';

    /**
     * A multiselect list that can be queried, selected options appear as checkboxes below the queryfield.
     * https://extranet.atlassian.com/download/attachments/1991213117/Sparkler+-+Phased+Approach.png
     *
     * @class CheckboxMultiSelect
     * @extends QueryableDropdownSelect
     */

    return QueryableDropdownSelect.extend({

        /**
         * @param {Object} options
         * @constructs
         */
        init: function init(options) {

            var instance = this;

            // mixin
            jQuery.extend(this, SelectHelper);

            // munge default options with user specified options. Will put result at this.options.
            this._setOptions(options);

            var element = jQuery(this.options.element);
            if (!element.attr("multiple")) {
                throw "Cannot create CheckboxMultiSelect without multiple-select select element.";
            }

            this.options.element = jQuery(this.options.element).hide();

            // Gives a JSON interface to a &lt;select list&gt;. Allowing you to add elements via JSON descriptors. It also
            // provides utility methods to retrieve collections of elements as JSON, for example selected options.
            this.model = new SelectModel({
                element: this.options.element,
                removeOnUnSelect: this.options.removeOnUnSelect
            });

            var HandlerClass = this.options.suggestionsHandler ? this.options.suggestionsHandler : SelectSuggestHandler;
            this.suggestionsHandler = new HandlerClass(this.options, this.model);

            // Some convienience events for devs to add remove <option>'s to <select> and it be reflected in UI
            this.options.element.bind("updateOptions", function () {
                instance._setOptions(options);
            }).bind("selectOption", function (e, descriptor) {
                instance.selectItem(descriptor);
            }).bind("removeOption", function (e, descriptor) {
                instance.unselectItem(descriptor);
            }).bind("clear", function () {
                instance.clear();
            });

            // Add the visual representation
            this._createFurniture();

            this._createDropdownController();
            this._createListController();

            this._assignEventsToFurniture();

            // Render suggestions in correct state from <select> (checked or not)
            this.render();
            this.model.$element.addClass("check-list-select-select").trigger("initialized", [this]);
            Events.trigger(Types.CHECKBOXMULITSELECT_READY, [this.model.$element, this]);
            return this;
        },

        _createListController: function _createListController() {
            var instance = this;
            this.listController = new List({
                stallEventBind: this.options.stallEventBind,
                containerSelector: jQuery(".aui-list", this.$container),
                scrollContainer: ".aui-list-scroll",
                selectionEvent: "change",
                delegateTarget: this.$field,
                hasLinks: false,
                itemSelector: ".check-list-item",
                groupSelector: "ul.aui-list-section",
                matchingStrategy: this.options.matchingStrategy,
                maxInlineResultsDisplayed: this.options.maxInlineResultsDisplayed,
                expandAllResults: this.options.expandAllResults,
                renderers: this._getCustomRenders(),
                selectionHandler: function selectionHandler(e) {
                    var focusedItem;
                    if (e.type === "change") {
                        focusedItem = jQuery(e.target).closest(this.options.itemSelector);
                    } else {
                        focusedItem = this.getFocused();
                    }
                    instance._selectionHandler(focusedItem, e);
                    return false;
                }
            });
        },

        _createDropdownController: function _createDropdownController() {
            // QueryableDropdownSelect which we extend relies on dropdownController being there to manage the showing and
            // hiding of the dropdown when querying suggestions. As our suggestions are always shown we can just make these
            // methods empty.
            this.dropdownController = {
                show: jQuery.noop,
                setWidth: jQuery.noop,
                setPosition: jQuery.noop,
                hide: jQuery.noop
            };
        },

        /**
         * Returns custom renders used by list controller
         *
         * @return {Object}
         * @private
         */
        _getCustomRenders: function _getCustomRenders() {
            return {
                suggestion: this._renders.suggestionItem, // override default suggestion renderer
                suggestionItemElement: this._renders.suggestionItemElement.bind(this),
                suggestionItemResolver: this._renders.suggestionItemResolver.bind(this)
            };
        },

        /**
         * Hides list if the is no value in input, otherwise shows and resets suggestions in dropdown
         *
         * @param {Boolean} force
         */
        _handleCharacterInput: function _handleCharacterInput(force) {
            // tipsy() only works for the first item in the set. We want to hide the tipsy() for all the
            // invalid items, hence the each() call. Related to JRADEV-16120
            jQuery.each(this.listController.$container.find(".invalid-item"), function () {
                jQuery(this).tipsy("hide");
            });
            this.requestSuggestions(force).done(_.bind(function (suggestions) {
                this._setSuggestions(suggestions);
            }, this));
            this.$dropDownIcon.toggleClass('clear-field aui-iconfont-remove', !!this.getQueryVal());
            this.$dropDownIcon.toggleClass('aui-iconfont-search', !this.getQueryVal());
            this.listController.moveToFirst();
        },

        /**
         * Gets default options
         * @return {Object}
         */
        _getDefaultOptions: function _getDefaultOptions() {
            return jQuery.extend(true, this._super(), {
                errorMessage: formatter.I18n.getText("jira.ajax.autocomplete.error"),
                stallEventBind: true
            });
        },

        /**
         * Appends container dom element required to render check-list
         */
        _createFurniture: function _createFurniture() {
            var id = this.model.$element.attr("id");
            this.$container = this._render("container", id);
            this.$fieldContainer = this._render("fieldContainer").appendTo(this.$container);
            this.$field = this._render("field", id, this._getPlaceholderText()).appendTo(this.$fieldContainer);
            var $suggestionsContainer = this._render("suggestionsContainer", id);
            this.suggestionsContainerId = $suggestionsContainer.attr("id");
            this.$container.append($suggestionsContainer);
            this.$field.attr("aria-controls", $suggestionsContainer.attr("id"));
            this.$container.insertBefore(this.model.$element);
            this.$dropDownIcon = this._render("dropdownAndLoadingIcon").appendTo(this.$fieldContainer);
        },

        _getPlaceholderText: function _getPlaceholderText() {
            var placeholderText = jQuery.trim(this.model.$element.data("placeholder-text"));
            return placeholderText && placeholderText !== "" ? placeholderText : formatter.I18n.getText("common.concepts.search");
        },

        /**
         * Assigns events furniture
         */
        _assignEventsToFurniture: function _assignEventsToFurniture() {
            var instance = this;
            this._assignEvents("body", document);
            // if this control is created as the result of a keydown event then we do no want to catch keyup or keypress for a moment

            if (this.options.stallEventBind) {
                window.setTimeout(function () {
                    instance._assignEvents("field", instance.$field)._assignEvents("keys", instance.$field)._assignEvents("container", instance.$container)._assignEvents("fieldIcon", instance.$dropDownIcon);
                }, 0);
            } else {
                instance._assignEvents("field", instance.$field)._assignEvents("keys", instance.$field)._assignEvents("fieldIcon", instance.$dropDownIcon);
            }

            this.listController.$container.delegate(".clear-all", "click", function (event) {
                event.preventDefault();
                var $clearAll = jQuery(event.target);
                if ($clearAll.hasClass('disabled')) {
                    return;
                }
                $clearAll.parent().remove();
                instance.clear();
            });

            this.listController.bind("itemFocus", this._onItemFocus.bind(this));
        },

        /**
         * Clears the control - selection(s) and field text.
         */
        clear: function clear() {
            var instance = this;
            var selectedDescriptors = this.model.getDisplayableSelectedDescriptors();
            this.model.setAllUnSelected();
            if (this.$field.val().length === 0) {
                this.$field.val("");
                this.listController.$container.find(":checkbox").removeAttr("checked");
            } else {
                this.clearQueryField();
                this.listController.moveToFirst();
            }
            this._toggleClearButton();
            jQuery.each(selectedDescriptors, function () {
                instance.model.$element.trigger("unselect", [this, instance, true]);
            });
        },

        clearQueryField: function clearQueryField() {
            this.$field.val("");
            this._handleCharacterInput(true);
            this.$field.focus();
        },

        /**
         * Unselects item in model
         * @param {ItemDescriptor} descriptor
         */
        unselectItem: function unselectItem(descriptor) {
            this.model.setUnSelected(descriptor);
            this.model.$element.trigger("unselect", [descriptor, this, false]);
            this.$container.find(".aui-list input[type=checkbox]").each(function () {
                if (this.value === descriptor.value()) {
                    this.checked = false;
                }
            });
        },
        /**
         * Specific implementation of turning on the loading state - it does not show spinner, but changes classes to keep the contract
         * @return {*} this
         */
        showLoading: function showLoading() {
            this.$dropDownIcon.addClass("loading").removeClass("noloading");
            return this;
        },

        /**
         * Specific implementation of turning off the loading state - it does not show spinner, but changes classes to keep the contract
         * @return {*} this
         */
        hideLoading: function hideLoading() {
            this.$dropDownIcon.removeClass("loading").addClass("noloading");
            return this;
        },

        _handleEscape: function _handleEscape(e) {
            var $field = this.$field;
            if (e.type === "keydown" && $field.val() !== "") {
                e.stopPropagation();
                $field.val("");
                $field.on("keyup", handleEscKeyUp);
                this._handleCharacterInput(true);
            }
            // Some controls listen to keyup for ESC, others to keydown.
            // We want to stopPropagation of *either* key event iff ESC was pressed when the field is not empty
            function handleEscKeyUp(event) {
                if (event.keyCode === keyCodes.ESCAPE) {
                    event.stopPropagation();
                    $field.off("keyup", handleEscKeyUp);
                }
            }
        },

        /**
         * Adds selected suggestion to the selected items, and marks it as selected in the model.
         * @param {Object} descriptor - JSON describing suggestion/option
         * @param {Boolean} initialize
         */
        selectItem: function selectItem(descriptor, initialize) {
            this.model.setSelected(descriptor);
            if (!initialize) {
                this.model.$element.trigger("selected", [descriptor, this]);
            }
            this.$container.find(".aui-list input[type=checkbox]").each(function () {
                if (this.value === descriptor.value()) {
                    this.checked = true;
                }
            });
        },

        /**
         * Handle when a suggestion is selected/unselected
         * @param {jQuery} selected
         * @param {Event} event
         */
        _selectionHandler: function _selectionHandler(selected, event) {
            var instance = this;
            selected.each(function () {
                var descriptor = jQuery.data(this, "descriptor");
                var $input = jQuery(this).find(":input");

                if (instance._directCheckboxClick || event.shiftKey) {
                    descriptor.properties.fromCheckbox = true;
                }

                instance._setDescriptorSelection(descriptor, $input);
            });
            this._toggleClearButton();
        },

        _toggleClearButton: function _toggleClearButton() {
            var hasSelection = this.model.getSelectedValues().length > 0;
            this.listController.$container.find('.clear-all').attr('tabindex', hasSelection ? null : -1).closest('.check-list-group-actions').toggleClass('hidden', !hasSelection);
        },

        /**
         * Set the selection state of a descriptor and its associated input.
         *
         * Called by _selectionHandler.
         *
         * @param {ItemDescriptor} descriptor The Item Descriptor.
         * @param {jQuery} $input The descriptor's input.
         */
        _setDescriptorSelection: function _setDescriptorSelection(descriptor, $input) {
            if (!descriptor.selected()) {
                this.selectItem(descriptor);
                $input.attr("checked", "checked");
            } else {
                this.unselectItem(descriptor);
                $input.removeAttr("checked");
            }
        },

        render: function render() {
            this._handleCharacterInput(true);
        },

        _events: {
            field: {
                "keydown": function keydown(event) {
                    if (event.keyCode === keyCodes.ENTER) {
                        event.preventDefault();
                        // TODO: The following is a trial to test keyboard behaviour. @see JRADEV-14866
                        var instance = this;
                        this.model.$element.bind("unselect selected", handleSelected);
                        setTimeout(function () {
                            instance.model.$element.unbind("unselect selected", handleSelected);
                        }, 0);
                    }
                    function handleSelected() {
                        if (jQuery.trim(instance.$field.val()) !== "") {
                            // Reset the results after selecting an item in autocomplete mode with RETURN key.
                            instance.$field.val("");
                            instance._handleCharacterInput(true);
                        }
                    }
                }
            },
            container: {
                /**
                 * Refocus the input when a suggestion is clicked.
                 *
                 * This prevents the need to handle mousemove and scroll events
                 * when the field is unfocused, yet the dialog is still visible.
                 *
                 * In IE, if a field is selected with the Return key, the form was
                 * prematurely submitted.
                 *
                 * In Chrome (since checkboxes are not focused when clicked) the
                 * whole page would move when pressing the Up or Down keys causing
                 * a confusing situation where the suggestion under where the mouse was
                 * (as it is hidden when key-navigating), would be highlighted but not
                 * selected when the Return key was pressed.
                 */
                mousedown: function mousedown(event) {
                    var instance = this;
                    function onmouseup(event) {
                        if (event.type === "mouseup") {
                            instance._directCheckboxClick = true;
                            setTimeout(function () {
                                instance._directCheckboxClick = false;
                            }, 40);
                        }
                        jQuery(document).unbind("mouseup mouseleave", onmouseup);
                    }
                    if (jQuery(event.target).is("input[type=checkbox]")) {
                        // "click" events are always dispatched when a checkbox value is
                        // changed. This is how we determine if it was actually clicked.
                        jQuery(document).unbind("mouseup mouseleave", onmouseup).bind("mouseup mouseleave", onmouseup);
                    }
                    if (event.target !== this.$field.get(0)) {
                        event.preventDefault();
                    }
                },
                click: function click() {
                    if (this.$field.get(0) !== document.activeElement) {
                        this.$field.focus();
                    }
                }
            },
            fieldIcon: {
                // For clearing the query field
                click: function click(e) {
                    if (jQuery(e.target).hasClass('clear-field')) {
                        this.clearQueryField();
                    }
                }
            }
        },

        _renders: {
            errorMessage: function errorMessage(idPrefix) {
                return jQuery('<div class="error" />').attr('id', idPrefix + "-error");
            },
            fieldContainer: function fieldContainer() {
                return jQuery("<div class='check-list-field-container' />");
            },
            field: function field(idPrefix, placeholderText) {
                return this._render("baseField").attr({
                    "placeholder": placeholderText,
                    "class": "aui-field check-list-field",
                    "id": idPrefix + "-input"
                });
            },
            disableSelectField: function disableSelectField(id) {
                return jQuery("<input type='text' class='long-field' />").attr({
                    "name": id,
                    "id": id
                });
            },
            container: function container(idPrefix) {
                return jQuery('<div class="check-list-select" />').attr('id', idPrefix + '-multi-select');
            },
            suggestionItemElement: function suggestionItemElement(descriptor, replacementText) {
                //adding the label as a class for testing.
                var $checkbox = jQuery("<input type='checkbox' tabindex='-1' />").val(descriptor.value());
                var $listElem = jQuery('<li class="check-list-item" role="option" />').attr("id", descriptor.value() + '-' + this.options.id);
                var $label = jQuery("<label class='item-label' />");
                var $img;

                if (descriptor.styleClass()) {
                    $listElem.addClass(descriptor.styleClass());
                }

                if (replacementText) {
                    $label.html(replacementText);
                } else if (descriptor.html()) {
                    $label.html(descriptor.html());
                } else {
                    $label.text(descriptor.label());
                }

                if (descriptor.selected()) {
                    $checkbox.attr("checked", "checked");
                }

                if (descriptor.icon() && descriptor.icon() !== "none") {
                    $img = jQuery("<img height='16' width='16' align='absmiddle' />").attr("src", descriptor.icon());
                    if (descriptor.fallbackIcon() && descriptor.fallbackIcon() !== "none") {
                        $img.one('error', function () {
                            this.src = descriptor.fallbackIcon();
                        });
                    }
                    $label.prepend($img);
                }

                if (descriptor.title()) {
                    $label.attr("title", descriptor.title());
                    $label.attr("data-descriptor-title", descriptor.title()); // Used by KickAss' page object for finding values in the dropdown!
                }

                if (descriptor.disabled()) {
                    $listElem.addClass("disabled");
                    $checkbox.attr("disabled", "disabled");
                }

                $label.prepend($checkbox);
                $listElem.append($label);

                return $listElem;
            },
            suggestionItemResolver: function suggestionItemResolver(descriptor, replacementText) {
                return this._render("suggestionItemElement", descriptor, replacementText);
            },
            suggestionItem: function suggestionItem(descriptor, replacementText) {
                var $listElem = this._render("suggestionItemResolver", descriptor, replacementText);
                var $label = $listElem.find("label");
                var $tipsyTarget;

                if (descriptor.invalid() || descriptor.disabled()) {

                    $listElem.addClass("has-invalid-item");

                    $label.append("<span class='invalid-item'></span>");
                    $tipsyTarget = $label.find(".invalid-item");

                    //Need to remove the title
                    //Otherwise both tipsy and html tooltip will show
                    _.defer(function () {
                        $listElem.attr("original-title", $listElem.attr("title"));
                        $listElem.removeAttr("title");
                    });

                    var _title;
                    //If the searcher is nice enough to put an error message
                    //then use that instead
                    //otherwise use the generic one
                    if (descriptor.title()) {
                        _title = descriptor.title();

                        $label.attr("original-title", _title);
                        $label.removeAttr("title");
                    } else {
                        _title = formatter.I18n.getText("jira.search.context.invalid.generic", formatter.I18n.getText("common.concepts.value"), descriptor.label());
                    }

                    $tipsyTarget.tipsy({
                        title: function title() {
                            return _title;
                        },
                        className: "tipsy-front",
                        trigger: "manual"
                    });

                    $tipsyTarget.hoverIntent({
                        interval: 200,
                        over: function over() {
                            $tipsyTarget.tipsy("show");
                        },
                        out: function out() {
                            $tipsyTarget.tipsy("hide");
                        }
                    });
                }

                return $listElem.data("descriptor", descriptor);
            },
            dropdownAndLoadingIcon: function dropdownAndLoadingIcon() {
                return jQuery('<span class="icon-default aui-icon aui-icon-small aui-iconfont-search noloading"></span>');
            }
        },

        // QueryableDropdownSelect requires these but we don't
        handleFreeInput: jQuery.noop,
        hideSuggestions: jQuery.noop,
        showErrorMessage: jQuery.noop,
        _deactivate: jQuery.noop
    });
});

AJS.namespace('AJS.CheckboxMultiSelect', null, require('jira/ajs/select/checkbox-multi-select'));