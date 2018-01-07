define('jira/ajs/select/dropdown-select', ['jira/ajs/layer/layer-constants', 'jira/ajs/control', 'jira/ajs/select/select-model', 'jira/ajs/layer/inline-layer-factory', 'jira/ajs/list/list', 'jquery'], function (LayerConstants, Control, SelectModel, InlineLayerFactory, List, jQuery) {
    'use strict';

    /**
     * This dropdown binds to first <a> before "options" element (<select>).
     * By clicking on mentioned <a> you expand list of options under it.
     * Hides original <select> element and creates <div> container as view.
     * <div> is used to display list of options and has id={idPrefix}-suggestions
     * where {idPrefix} is id of <select> element.
     *
     * @class DropdownSelect
     * @extends Control
     */

    return Control.extend({

        /**
         *
         * @param options - <select> element
         */
        init: function init(options) {

            var instance = this;

            this.model = new SelectModel(options);

            this.model.$element.hide();

            this._createFurniture();

            this.dropdownController = InlineLayerFactory.createInlineLayers({
                alignment: LayerConstants.LEFT,
                width: 200,
                hideOnScroll: ".issue-container",
                content: jQuery(".aui-list", this.$container)
            });

            this.dropdownController.layer().addClass("select-menu");

            this.listController = new List({
                containerSelector: jQuery(".aui-list", this.$container),
                groupSelector: "ul.opt-group",
                itemSelector: "li:not(.no-suggestions)",
                selectionHandler: function selectionHandler(e) {
                    instance._selectionHandler(this.getFocused(), e);
                    e.preventDefault();
                }
            });

            this._assignEventsToFurniture();
        },

        show: function show() {
            this.listController.generateListFromJSON(this.model.getAllDescriptors());
            this.dropdownController.show();
            this.listController.index = 0;
            this.listController.focus();
            this.listController.enable();
        },

        _assignEventsToFurniture: function _assignEventsToFurniture() {
            this._assignEvents("trigger", this.$trigger);
        },

        _createFurniture: function _createFurniture() {
            var id = this.model.$element.attr("id");

            this.$container = this._render("container", id);
            this.$trigger = this.model.$element.prev("a").appendTo(this.$container);
            this.$container.append(this._render("suggestionsContainer", id));
            this.$container.insertBefore(this.model.$element);
        },

        _renders: {
            container: function container(idPrefix) {
                return jQuery('<div class="select-menu" />').attr("id", idPrefix + '-multi-select');
            },
            suggestionsContainer: function suggestionsContainer(idPrefix) {
                return jQuery('<div class="aui-list aui-list-checked" tabindex="-1" />').attr('id', idPrefix + '-suggestions');
            }
        },

        _selectionHandler: function _selectionHandler(selected) {
            var instance = this;
            var intCount = 0;

            this.model.setSelected(selected.data("descriptor"));

            this.dropdownController.content().find(".aui-checked").removeClass(".aui-checked");

            selected.addClass(".aui-checked");

            var myInterval = window.setInterval(function () {
                intCount++;
                selected.toggleClass(".aui-checking");
                if (intCount > 2) {
                    clearInterval(myInterval);
                    instance.dropdownController.hide();
                }
            }, 80);
        },

        _events: {
            trigger: {
                click: function click(e) {
                    this.show();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }
    });
});

/** Preserve legacy namespace
    @deprecated AJS.SelectMenu*/
AJS.namespace("AJS.SelectMenu", null, require('jira/ajs/select/dropdown-select'));
AJS.namespace("AJS.DropdownSelect", null, require('jira/ajs/select/dropdown-select'));