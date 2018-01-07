define('jira/ajs/select/multi-select/lozenge', ['jira/util/formatter', 'jira/util/assistive', 'jira/util/strings', 'jira/ajs/control', 'jquery'], function (formatter, Assistive, strings, Control, jQuery) {
    'use strict';

    var ID = 0;
    var assistiveLabelId;

    /**
     * @typedef {Object} LozengeOptions
     * @prop {String} options.label
     * @prop {String} [options.title]
     * @prop {String} options.focusClass
     * @prop {jQuery|HTMLElement} options.container
     */

    /**
     * A lozenge represents a discrete item of user input as a <button> element that can be focused, blurred and removed.
     *
     * @class MultiSelect.Lozenge
     * @extends Control
     */
    return Control.extend({

        /**
         * @param {LozengeOptions} options
         */
        init: function init(options) {
            this.id = ID;
            ID += 1;

            this._setOptions(options);

            this.$lozenge = this._render("lozenge");

            this.$removeButton = this._render("removeButton");
            this.$removeButton.tooltip();

            this._assignEvents("instance", this);
            this._assignEvents("lozenge", this.$lozenge);
            this._assignEvents("removeButton", this.$removeButton);

            this.$removeButton.appendTo(this.$lozenge);
            this.$lozenge.appendTo(this.options.container);
        },

        /**
         * @returns {LozengeOptions}
         * @private
         */
        _getDefaultOptions: function _getDefaultOptions() {
            return {
                label: null,
                title: null,
                container: null,
                focusClass: "focused"
            };
        },

        _renders: {
            "lozenge": function lozenge() {
                var label = strings.escapeHtml(this.options.label);
                if (!assistiveLabelId) {
                    assistiveLabelId = Assistive.createOrUpdateLabel(formatter.I18n.getText("common.concepts.remove.option.label"));
                }

                return jQuery('<li class="item-row" role="option"><button type="button" tabindex="-1" class="value-item"><span><span class="value-text">' + label + '</span></span></button></li>').attr({
                    'aria-describedby': assistiveLabelId,
                    'id': 'item-row-' + this.id
                });
            },
            "removeButton": function removeButton() {
                return jQuery('<em class="item-delete" aria-label=" "></em>');
            }
        },

        _events: {
            "instance": {
                "focus": function focus() {
                    this.$lozenge.addClass(this.options.focusClass);
                },
                "blur": function blur() {
                    this.$lozenge.removeClass(this.options.focusClass);
                },
                "remove": function remove() {
                    this.$lozenge.remove();
                }
            },
            "lozenge": {
                "click": function click() {
                    this.trigger("focus");
                }
            },
            "removeButton": {
                "click": function click() {
                    this.trigger("remove");
                }
            }
        }
    });
});

AJS.namespace('AJS.MultiSelect.Lozenge', null, require('jira/ajs/select/multi-select/lozenge'));