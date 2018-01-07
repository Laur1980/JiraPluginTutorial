define('jira/ajs/select/scrollable-single-select', ['jira/jquery/deferred', 'jira/ajs/select/single-select', 'jira/ajs/list/pageable-list', 'jquery', 'underscore'], function (Deferred, SingleSelect, PageableList, jQuery, _) {
    'use strict';

    /**
     * A SingleSelect that implements infinite scroll - it renders more pages of records as user scrolls down the dropdown.
     * In case of suggestions fetched by AJAX requests - rendering next page of results will not trigger another request,
     * only previously fetched results will be paginated
     *
     * @class ScrollableSingleSelect
     * @extends SingleSelect
     */

    return SingleSelect.extend({
        /**
         * @param {Object} options
         * @constructs
         * @override
         */
        init: function init(options) {
            var defaults = {
                newResultsThreshold: 90
            };

            options = jQuery.extend(true, defaults, options);
            this._super(options);

            this.newResultsThreshold = options.newResultsThreshold;
        },

        _assignEventsToFurniture: function _assignEventsToFurniture() {
            var instance = this;
            var promise;
            this._super();

            this.dropdownController.$layer.on('scroll', function () {
                if (this.scrollTop * 100 / instance.newResultsThreshold > this.scrollHeight - this.clientHeight) {
                    if (!promise || promise.isResolved()) {
                        promise = instance._fetchNewContent().done(function () {
                            if (instance.listController.isDisplayedAllItems() && typeof instance.scrolledToBottomHandler === "function") {
                                instance.scrolledToBottomHandler();
                            }
                        }).fail(function () {
                            instance.listController.showPageRenderError();
                            //clear promise on dropdown refresh
                            instance.model.$element.one('suggestionsRefreshed', function () {
                                promise = undefined;
                            });
                        });
                    }
                }
            });
        },

        _createListController: function _createListController() {
            var instance = this;
            this.listController = new PageableList({
                containerSelector: jQuery(".aui-list", this.$container),
                groupSelector: "ul.aui-list-section",
                matchingStrategy: this.options.matchingStrategy,
                pageSize: this.options.pageSize,
                pagingThreshold: this.options.pagingThreshold,
                matchItemText: this.options.matchItemText,
                hasLinks: this.options.hasLinks,
                selectionHandler: function selectionHandler(e) {
                    var selectedSuggestion = this.getFocused();
                    var selectedDescriptor = selectedSuggestion.data("descriptor");

                    instance.setSelection(selectedDescriptor);
                    instance.$field.select();

                    e.preventDefault();
                    return false;
                }
            });
        },

        /**
         * Internal method used to trigger adding next page of records to dropdown
         *
         * @returns {jQuery.Deferred}
         * @private
         */
        _fetchNewContent: function _fetchNewContent() {
            var promise = new Deferred();
            _.defer(function () {
                try {
                    this.listController.addNextPage();
                    promise.resolve();
                } catch (error) {
                    promise.reject(error);
                }
            }.bind(this));
            return promise;
        }
    });
});