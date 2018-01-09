define('jira/ajs/dropdown/dropdown', ['jira/ajs/control', 'jira/ajs/layer/inline-layer', 'jira/ajs/layer/layer-constants', 'jira/ajs/layer/layer-interactions', 'jira/ajs/layer/hide-reasons', 'jira/ajs/dropdown/dropdown-constants', 'jira/ajs/dropdown/dropdown-list-item', 'jira/ajs/dropdown/dropdown-options-descriptor', 'underscore', 'jquery'], function (Control, InlineLayer, LayerConstants, interactions, LayerHideReason, Constants, ListItem, OptionsDescriptor, _, $) {
    /**
     * Creates dropdown menu functionality. It is <strong>STRONGLY</strong> advised that you create these objects through
     * the factory method {@see Dropdown.createDropdown}
     *
     * @class Dropdown
     * @extends Control
     */
    var Dropdown = Control.extend({

        CLASS_SIGNATURE: "AJS_DROPDOWN",

        /**
         * @param {Object | Dropdown.OptionsDescriptor} options
         * @constructs
         */
        init: function init(options) {
            var $trigger;
            var triggerId;
            var layerProperties;
            var instance = this;

            if (!(options instanceof OptionsDescriptor)) {
                this.options = new OptionsDescriptor(options);
            } else {
                this.options = options;
            }

            // Get a reference to what will ultimately be the trigger element.
            $trigger = this.options.trigger();
            // Ensure the trigger has an ID, or will have one.
            triggerId = this._ensureIdOf($trigger);

            layerProperties = this.options.allProperties();
            if (!layerProperties.offsetTarget) {
                layerProperties.offsetTarget = layerProperties.trigger;
            }
            if (!layerProperties.id) {
                layerProperties.id = triggerId + "_drop";
            }

            this.layerController = new InlineLayer(layerProperties);

            // override click to close, so we close when selecting list item
            this.layerController._validateClickToClose = function (e) {
                if (e.target === this.offsetTarget()[0]) {
                    return false;
                } else if (e.target === this.layer()[0]) {
                    return false;
                } else if (this.offsetTarget().has(e.target).length > 0) {
                    return false;
                }

                return true;
            };

            this.listController = this.options.listController();

            this.listController.bind("change:activeItem", function (e, activeItem) {
                activeItem.$element.find("a").focus();
            });

            // we need to do cleanup if the inlinelayer is hidden by one of its own events
            this.layerController.onhide(function () {
                instance.hide();
            });

            // pass the error message to the instance, if there is an onerror callback defined
            this.layerController.onerror(function () {
                if ($.isFunction(instance.options.properties.onerror)) {
                    instance.options.properties.onerror(instance);
                }
            });

            this.layerController.contentChange(function () {

                instance.listController.removeAllItems();

                instance.layerController.layer().find("div > ul > li:visible:has(a)").each(function () {
                    instance.listController.addItem(new ListItem({
                        element: this,
                        autoScroll: instance.options.autoScroll()
                    }));
                });

                if (instance.options.focusFirstItem()) {
                    instance.listController.shiftFocus(0);
                } else {
                    instance.listController.prepareForInput();
                }
            });

            this.trigger($trigger); // bind trigger events

            this._applyIdToLayer();
        },

        /**
         * Shows dropdown, in the case of an ajax dropdown this will make a request to get content if there isn't already some
         *
         */
        show: function show() {
            this.trigger().addClass(LayerConstants.ACTIVE_CLASS);
            $(this).trigger("showLayer");
            this.layerController.show();
            if (this.options.focusFirstItem()) {
                this.listController.shiftFocus(0);
            } else {
                this.listController.prepareForInput();
            }
        },

        /**
         * Hides dropdown
         */
        hide: function hide() {
            $(this).trigger("hideLayer");
            this.trigger().removeClass(LayerConstants.ACTIVE_CLASS);
            this.layerController.hide();
            this.listController.trigger("blur");
        },

        /**
         * Hides and shows dropdown
         */
        toggle: function toggle() {
            // Why the toggle flag? If an assistive click and a keydown both occur,
            // it can cause the dropdowns to open & close in one go, because the assistive
            // triggering isn't handled by the browser. In that case, both
            // keyboard + mouse events can occur, which would trigger the toggle twice.
            // Setting this flag avoids the dropdown from toggling twice.
            if (this._toggling) {
                return;
            }
            this._toggling = true;
            if (this.layerController.isVisible()) {
                this.hide();
            } else {
                this.show();
            }
            setTimeout(function () {
                this._toggling = false;
            }.bind(this), 0);
        },

        /**
         * Sets/Gets content. Delegates to layer controller.
         *
         * @param {jQuery} content
         * @return {jQuery}
         */
        content: function content(_content) {
            if (_content) {
                this.layerController.content(_content);
            } else {
                return this.layerController.content();
            }
        },

        /**
         * Sets/Gets trigger. If setting, unbinds events of previous trigger (if there was one), binding events to new one.
         *
         * @param {jQuery} [trigger] if passed, will update the trigger for the dropdown to this element;
         *     events will be unbound from the previous element and added to the new one.
         * @return {jQuery} the current trigger element for the dropdown.
         */
        trigger: function trigger(_trigger) {
            if (_trigger) {

                if (this.options.trigger()) {
                    this._unassignEvents("trigger", this.options.trigger());
                }

                this.options.trigger($(_trigger));

                if (!this.layerController.offsetTarget()) {
                    this.layerController.offsetTarget(this.options.trigger());
                }

                this._assignEvents("trigger", this.options.trigger());
            } else {
                return this.options.trigger();
            }
        },

        _ensureIdOf: function _ensureIdOf($trigger) {
            var triggerId = $trigger.attr('id');
            if (_.isEmpty(triggerId)) {
                triggerId = $trigger.attr("id", _.uniqueId(this.CLASS_SIGNATURE + "__"));
            }
            return triggerId;
        },

        _applyIdToLayer: function _applyIdToLayer() {
            var triggerId = this._ensureIdOf(this.trigger());
            var layerId = this.layerController.layer().attr("id") || triggerId + "_drop";

            // Apply the various IDs in a way that makes them accessible to screen readers
            this.layerController.layer().attr({
                "id": layerId, // should have already been set when the layer was created, but best to set again.
                "role": "menu",
                "aria-hidden": true
            });
            this.trigger().attr({
                "aria-controls": layerId,
                "aria-haspopup": true,
                "aria-expanded": false
            });

            this.layerController.bind(InlineLayer.EVENTS.show, function () {
                this.trigger().attr("aria-expanded", true);
            }.bind(this));
            this.layerController.bind(InlineLayer.EVENTS.hide, function (event, layer, reason) {
                this.trigger().attr("aria-expanded", false);
                this.trigger().one("beforeBlurInput", function (e) {
                    e.preventDefault(); // this stops the keyboard shortcut handler from de-focussing the element.
                });
                if (reason === LayerHideReason.escPressed) {
                    this.trigger().focus();
                }
            }.bind(this));
        },

        _events: {
            trigger: {
                "aui:keydown": function auiKeydown(e) {
                    if (e.key === "Return" || e.key === "Spacebar") {
                        e.preventDefault();
                        this.toggle();
                    }
                },
                click: function click(e) {
                    e.preventDefault(); // in-case we are a link
                    this.toggle();
                }
            }
        }

    });

    //static
    $.extend(Dropdown, Constants);

    interactions.preventDialogHide(Dropdown);
    interactions.hideBeforeDialogShown(Dropdown);

    return Dropdown;
});

/** Preserve legacy namespace
    @deprecated AJS.DropDown */
AJS.namespace('AJS.DropDown', null, require('jira/ajs/dropdown/dropdown'));
AJS.namespace('AJS.Dropdown', null, require('jira/ajs/dropdown/dropdown'));