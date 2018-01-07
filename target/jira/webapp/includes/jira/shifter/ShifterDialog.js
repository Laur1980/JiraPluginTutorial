/**
 * @module jira/shifter/shifter-dialog
 */
define('jira/shifter/shifter-dialog', ['jira/util/key-code', 'jira/jquery/deferred', 'jira/lib/class', 'jira/data/session-storage', 'jira/shifter/shifter-select', 'jira/ajs/list/group-descriptor', 'jira/ajs/list/item-descriptor-factory', 'jira/shifter/shifter-analytics', 'jquery', 'underscore'], function (keyCodes, Deferred, Class, sessionStorage, ShifterSelect, GroupDescriptor, ItemDescriptorFactory, ShifterAnalytics, jQuery, _) {
    /**
     * @class ShifterDialog
     * @extends Class
     * @alias module:jira/shifter/shifter-dialog
     */
    return Class.extend({
        BLUR_DELAY: 50,

        /**
         * @constructs
         * @param {String} id - unique id for this dialog
         * @param {ShifterGroup[]} groups
         * @param {Object} options
         * @param {Number} options.maxResultsDisplayedPerGroup
         */
        init: function init(id, groups, options) {
            this.id = id;
            this.groups = groups;
            this.options = options;
            this._render();
            this._destroyOnBlur();
            this._preventFocusOnNonInputElements();
            jQuery(document).on('mousedown.shifterdialog.' + id, _.bind(this._destroyOnMousedownOutside, this));
        },

        focus: function focus() {
            if (this.$dialog) {
                this.$dialog.find('input').focus();
            }
        },

        destroy: function destroy() {
            var $dialog = this.$dialog;
            if ($dialog) {
                $dialog.stop().animate({
                    top: -1 * $dialog.height()
                }, 100, function () {
                    $dialog.remove();
                });
                this.$dialog = null;
                jQuery(document).off('mousedown.shifterdialog.' + this.id);
            }
        },

        destroyed: function destroyed() {
            return !this.$dialog;
        },

        saveLastQuery: function saveLastQuery(query) {
            sessionStorage.setItem('JIRA.Shifter.lastQuery', query);
        },

        getLastQuery: function getLastQuery() {
            return sessionStorage.getItem('JIRA.Shifter.lastQuery');
        },

        enterLoadingState: function enterLoadingState() {
            var $dialog = this.$dialog;
            $dialog.addClass('loading-action');
            $dialog.find('.aui-list').slideUp(200);
        },

        _render: function _render() {
            var html = JIRA.Templates.Shifter.dialog({
                id: this.id
            });
            var $dialog = this.$dialog = jQuery(html).appendTo('body');

            var shifterSelect = this.shifterSelect = new ShifterSelect({
                id: this.id,
                element: $dialog.find('.aui-list'),
                groups: this.groups,
                suggestionsHandler: this._makeSuggestionsHandler(),
                onSelection: _.bind(this._onSelection, this),
                maxResultsDisplayedPerGroup: this.options.maxResultsDisplayedPerGroup
            });

            if (this.getLastQuery()) {
                shifterSelect.$field.val(this.getLastQuery()).select();
                shifterSelect.onEdit();
            }

            shifterSelect.$field.on('keyup', _.bind(function (e) {
                if (e.which === keyCodes.ESCAPE) {
                    e.stopPropagation();
                    this.destroy();
                }
            }, this));

            //JRADEV-19747 - Hide any layer to avoid conflicts with the keyboard handling (up, down, return...)
            if (AJS.currentLayerItem && AJS.currentLayerItem.hide) {
                AJS.currentLayerItem.hide();
            }

            //NEXT-851 dropdown2 is not store as currentLayerItem so we have to manually close them
            this._closeDropdownsIfNeeded();

            $dialog.css('top', -1 * $dialog.height()).animate({
                top: 0
            }, 100);
        },

        _closeDropdownsIfNeeded: function _closeDropdownsIfNeeded() {
            jQuery('.aui-dropdown2-trigger.active').trigger('aui-button-invoke');
        },

        _destroyOnBlur: function _destroyOnBlur() {
            this.$dialog.find('input').blur(_.bind(function () {
                setTimeout(_.bind(function () {
                    if (this.$dialog && !jQuery.contains(this.$dialog[0], document.activeElement)) {
                        this.destroy();
                    }
                }, this), this.BLUR_DELAY);
            }, this));
        },

        /**
         * Preventing focus when clicking on elements inside the dialog doesn't completely work in IE8
         */
        _destroyOnMousedownOutside: function _destroyOnMousedownOutside(e) {
            if (this.$dialog.find(e.target).length === 0 && e.target !== this.$dialog) {
                this.destroy();
            }
        },

        _preventFocusOnNonInputElements: function _preventFocusOnNonInputElements() {
            var $inputs = this.$dialog.find('input');
            this.$dialog.mousedown(function (e) {
                if (jQuery.inArray(e.target, $inputs) === -1) {
                    e.preventDefault();
                }
            });
        },

        _makeSuggestionsHandler: function _makeSuggestionsHandler() {
            var groups = this.groups;
            return Class.extend({
                execute: function execute(query) {
                    var suggestions = [];
                    var masterDeferred = Deferred();
                    var deferredsRemaining = groups.length;
                    _.map(groups, function (group, groupIndex) {
                        return group.getSuggestions(query).done(function (groupSuggestions) {
                            if (!_.isArray(groupSuggestions)) {
                                return;
                            }
                            suggestions.push(new GroupDescriptor({
                                label: group.name,
                                description: group.context,
                                weight: group.weight,
                                items: _.map(groupSuggestions, function (suggestion) {
                                    return ItemDescriptorFactory.createItemDescriptor(suggestion, groupIndex);
                                })
                            }));
                            // Keep the groups sorted
                            suggestions.sort(function (a, b) {
                                return a.weight() - b.weight();
                            });
                        }).always(function () {
                            deferredsRemaining--;
                            if (deferredsRemaining === 0) {
                                masterDeferred.resolve(suggestions, query);
                            }
                        });
                    });
                    return masterDeferred;
                }
            });
        },

        _onSelection: function _onSelection(group, value, label) {
            ShifterAnalytics.selection(label, value, group.id);

            this.saveLastQuery(label);
            var ret = group.onSelection(value, label);
            if (ret && _.isFunction(ret.always)) {
                this.enterLoadingState();
                ret.always(_.bind(this.destroy, this));
            } else {
                this.destroy();
            }
        }
    });
});

AJS.namespace('JIRA.ShifterComponent.ShifterDialog', null, require('jira/shifter/shifter-dialog'));