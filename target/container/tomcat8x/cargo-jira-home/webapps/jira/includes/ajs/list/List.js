define('jira/ajs/list/list', ['jira/util/logger', 'jira/util/formatter', 'jira/util/strings', 'jira/ajs/control', 'jira/ajs/list/group-descriptor', 'jira/ajs/list/item-descriptor', 'jira/ajs/input/mouse', 'jira/util/assistive', 'jira/util/browser', 'jquery', 'underscore'], function (logger, formatter, strings, Control, GroupDescriptor, ItemDescriptor, Mouse, Assistive, Browser, jQuery, _) {
    'use strict';

    function buildElementId(id) {
        return id.trim().toLowerCase().replace(/[\s\.]+/g, "-");
    }

    // id of particular item on the list
    // this is simply incremented on render and is needed to make sure element's id is unique
    var globalItemId = 0;

    /**
     * @class List
     * @extends Control
     * @deprecated Use {@link Group} instead
     */
    return Control.extend({
        MAX_RESULT_LIMIT: 2000,

        init: function init(options) {
            options = options || {};
            if (options) {
                this.options = jQuery.extend(true, this._getDefaultOptions(options), options);
            } else {
                this.options = this._getDefaultOptions(options);
            }

            this.maxInlineResultsDisplayed = this.options.maxInlineResultsDisplayed || this.MAX_RESULT_LIMIT;

            this._renders = jQuery.extend({}, this._renders, this.options.renderers);
            this.disabled = true;

            this.reset();

            var instance = this;

            if (this.options.selectionHandler) {
                this.$container.delegate(this.options.itemSelector, this.options.selectionEvent, function (e) {
                    instance.options.selectionHandler.call(instance, e);
                });
            }

            // Initialise the mouse motion detector.
            this.motionDetector.wait();

            this.$container.delegate(this.options.itemSelector, "mousemove", function () {
                if (!instance.disabled && (instance.motionDetector.moved || Browser.isSelenium())) {
                    // too hard to simulate mouse move reliably in selenium
                    instance.index = jQuery.inArray(this, instance.$visibleItems);
                    instance.focus(true);
                }
            });
        },

        _getDefaultOptions: function _getDefaultOptions() {
            return {
                selectionEvent: "click",
                delegateTarget: document,
                matchingStrategy: "(^|.*?(\\s+|\\())({0})(.*)", // match start of words, including after '('
                itemSelector: "li.aui-list-item",
                hasLinks: true,
                stallEventBind: true,
                expandAllResults: false,
                suggestionRole: "option"
            };
        },

        index: 0,

        /**
         * Focuses first item element in list. If the mutliselectMode is set to true will toogle that elements focused state.
         */
        moveToFirst: function moveToFirst() {
            if (this.$visibleItems.length > 0) {
                this.index = 0;
                this.focus();
            }
        },

        /**
         * Focuses item element in list. If the mutliselectMode is set to true will toogle that elements focused state.
         */
        moveToNext: function moveToNext() {
            if (this.index < this.maxIndex) {
                ++this.index; // increase the index
                this.focus(); // focus it
            } else if (this.options.expandAllResults && this.hasTooManySuggestions) {
                this._expandAllResults();
                ++this.index; // increase the index
                this.focus(); // focus it
            } else if (this.$visibleItems.length > 1) {
                this.index = 0;
                this.focus();
            }
        },

        container: function container(_container) {
            if (_container) {
                this.$container = jQuery(_container);
                this.containerSelector = _container;
            } else {
                return this.$container;
            }
        },

        getItemsByDescriptor: function getItemsByDescriptor(descriptorToMatch) {
            var $matches = jQuery();
            this.$container.find(this.options.itemSelector).each(function () {
                var descriptor = jQuery.data(this, "descriptor");
                if (descriptor && descriptor.value() === descriptorToMatch.value()) {
                    $matches = $matches.add(this);
                }
            });
            return $matches;
        },

        scrollContainer: function scrollContainer() {
            return this.options.scrollContainer ? this.$container.find(this.options.scrollContainer) : this.$container.parent();
        },

        /**
         * @private
         * @return {boolean}
         *
         * Indicates whether the scrollContainer or the document should be
         * scrolled. If a scroll container is declared explicitly, or a
         * dialog is currently limiting the viewport's scrolling, this
         * method will return true.
         */
        _isScrollConstrained: function _isScrollConstrained() {
            var scrollContainer = this.scrollContainer()[0];
            return scrollContainer.clientHeight < scrollContainer.scrollHeight;
        },
        /**
         * Focuses item element in list. If the mutliselectMode is set to true will toogle that elements focused state.
         */
        moveToPrevious: function moveToPrevious() {
            if (this.index > 0) {
                --this.index; // decrease the index
                this.focus();
            } else if (this.$visibleItems.length > 0) {
                this.index = this.$visibleItems.length - 1;
                this.focus();
            }
        },

        /**
         * Scroll the container to ensure the active element is visible.
         *
         * Notes:
         *
         *   1. The scrolling algorithm chosen depends on the value of
         *      this._isScrollConstrained(). If constrained, we cannot
         *      scroll the documentElement, so instead we scroll
         *      this.scrollContainer().
         *
         *   2. We assume $scrollContainer has borderTop, borderLeft,
         *      paddingTop, paddingLeft are all zero.
         *
         *   3. We assume the active element will fit vertically inside
         *      the scrolling region.
         */
        scrollActiveItemIntoView: function scrollActiveItemIntoView() {

            var $activeItem = this.$visibleItems.filter(".active");
            var $scrollContainer = this.scrollContainer();
            var scrollTop = $scrollContainer.scrollTop();

            if ($activeItem.length === 0) {
                // Sanity check.
                return;
            }

            if (!this._isScrollConstrained()) {
                // Scrolling is unconstrained, so we are allowed to scroll the
                // documentElement to ensure $activeItem is in view.
                $activeItem.scrollIntoView({
                    callback: jQuery.proxy(this.motionDetector, "wait")
                });

                return;
            }
            // Scrolling is constrained to within $scrollContainer so assume
            // it's scrollable and scroll it in place to ensure $activeItem is
            // in view.

            if ($activeItem.closest($scrollContainer).length === 0) {
                // If $activeItem is not a descendant of $scrollContainer, we
                // don't need to scroll. (Most likely, $activeItem resides in
                // the ".aui-list-fixed" container.)
                return;
            }

            if ($activeItem.is($scrollContainer.find(this.items).first())) {
                // Take a shortcut: If $activeItem is the first selectable item
                // in $scrollContainer, just scroll straight to the top. This
                // ensures optgroup headings are visible when autoscrolling.
                this._scrollContainerTo(0);

                return;
            }

            var roomAbove = $activeItem.offset().top - $scrollContainer.offset().top;
            var roomBelow = $scrollContainer.outerHeight() - $activeItem.outerHeight() - roomAbove;

            if (roomAbove >= 0) {

                if (roomBelow < 0) {
                    // Scroll $scrollContainer so that $activeItem aligns with
                    // the baseline of $scrollContainer's scrolling region.
                    this._scrollContainerTo(scrollTop - roomBelow);
                }
            } else {
                // Scroll $scrollContainer so that $activeItem aligns with the
                // top of $scrollContainer's scrolling region.
                this._scrollContainerTo(scrollTop + roomAbove);
            }
        },

        /**
         * Helper method to ensure autoscrolling always evades mousemove events.
         * @private
         * @param {number} scrollTop
         */
        _scrollContainerTo: function _scrollContainerTo(scrollTop) {
            var $scrollContainer = this.scrollContainer();
            if ($scrollContainer.scrollTop() !== scrollTop) {
                this.motionDetector.unbind();
                this.motionDetector.wait();
                $scrollContainer.scrollTop(scrollTop);
            }
        },

        /**
         * Focus the item at this.index.
         *
         * @param {boolean=} noScroll
         *   -- whether to automatically scroll the active item into view
         */
        focus: function focus(noScroll) {
            this.$visibleItems.removeClass("active");
            var $target = this.$visibleItems.eq(this.index);
            $target.addClass("active");
            this.lastFocusedItemDescriptor = $target.data("descriptor");
            this.trigger("itemFocus", $target, this.lastFocusedItemDescriptor);
            if (!noScroll) {
                this.scrollActiveItemIntoView();
            }
        },

        motionDetector: new Mouse.MotionDetector(),

        disable: function disable() {
            if (this.disabled) {
                return;
            }

            this._unassignEvents("delegateTarget", this.options.delegateTarget);

            this.disabled = true;
            this.lastFocusedItemDescriptor = null;
        },

        enable: function enable() {
            var instance = this;
            if (!instance.disabled) {
                return;
            }

            if (this.options.stallEventBind) {
                window.setTimeout(function () {
                    instance._assignEvents("delegateTarget", instance.options.delegateTarget);
                }, 0);
            } else {
                instance._assignEvents("delegateTarget", instance.options.delegateTarget);
            }

            instance.disabled = false;
            this._scrollContainerTo(0);
        },

        getFocused: function getFocused() {
            return this.$visibleItems.filter(".active");
        },

        reset: function reset(index) {
            this.$container = jQuery(this.options.containerSelector);
            this.items = jQuery(this.options.itemSelector, this.$container).not(".no-suggestions");
            this.$visibleItems = this._computeVisibleItems();
            this.groups = jQuery(this.options.groupSelector, this.$container);
            this.maxIndex = this.$visibleItems.length - 1;
            this.index = this.$visibleItems[index] ? index : 0;

            this.focus(true);
        },

        _computeVisibleItems: function _computeVisibleItems() {
            return this.items.not(".hidden, .disabled");
        },

        selectValue: function selectValue(value) {
            var matchedItem = this.$container.find(this.options.itemSelector).filter(function () {
                return jQuery(this).parent().data('descriptor').value() === value;
            });
            if (!matchedItem.length) {
                logger.log("WARN: No List item found with Decriptor value '" + value + "'");
            }
            matchedItem.click();
        },

        _getLinkFromItem: function _getLinkFromItem(item) {
            var link;

            item = jQuery(item);
            if (item.is("a")) {
                link = item;
            } else {
                link = item.find("a");
            }

            return link;
        },

        _makeResultDiv: function _makeResultDiv(data, query) {

            var $fixedContainer = jQuery('<div class="aui-list-fixed" role="presentation">');
            var $resultsContainer = jQuery('<div class="aui-list-scroll" tabindex="-1" role="presentation">');
            var instance = this;
            var ungrouped = [];

            function appendUngrouped() {
                if (ungrouped.length > 0) {
                    $resultsContainer.append(instance._generateUngroupedOptions(ungrouped, query));
                    ungrouped = [];
                }
            }

            jQuery.each(data, function (i, descriptor) {
                var $container;
                var $optgroup;
                if (descriptor instanceof GroupDescriptor) {
                    appendUngrouped();
                    $container = descriptor.placement() === "fixed" ? $fixedContainer : $resultsContainer;
                    $optgroup = instance._generateOptGroup(descriptor, query);
                    $container.append($optgroup);
                } else if (descriptor instanceof ItemDescriptor) {
                    ungrouped.push(descriptor);
                }
            });
            appendUngrouped();
            if ($fixedContainer.children().length === 0) {
                // If $fixedContainer is empty, don't include it in the returned collection.
                return $resultsContainer;
            }

            return $fixedContainer.add($resultsContainer);
        },

        _addResultToContainer: function _addResultToContainer($result) {
            // Don't count suggestions in the "fixed" group.
            if ($result.not(".aui-list-fixed").find(this.options.itemSelector).length === 0) {
                var $scrollContainer = this.$container.find(".aui-list-scroll");
                if ($scrollContainer.length === 0) {
                    $scrollContainer = jQuery('<div class="aui-list-scroll" tabindex="-1" role="presentation">').appendTo(this.$container);
                }
                var $noSuggestions = this._render("noSuggestion");
                Assistive.readText($noSuggestions.text());
                $scrollContainer.html($noSuggestions);
            } else {
                $result.find("ul:last").addClass("aui-last");
                this.$container.html($result);
            }
        },

        /**
         * Using the array of {@see GroupDescriptor} and {@see ItemDescriptor} matches items using the supplied query
         * argument. These items are then rendered. Note: Any previous items in the list a removed.
         *
         * @param {Array} data
         * @param {string} query
         * @param {boolean} [forceAllResults=false] True to display all the results, overriding maxInlineResultsDisplayed config option
         */
        generateListFromJSON: function generateListFromJSON(data, query, forceAllResults) {

            this.suggestions = 0;
            this.exactMatchIndex = -1;
            this.lastFocusedIndex = -1;

            this.lastQuery = query;
            this.lastData = data;
            this.forceAllResults = forceAllResults;
            this.hasTooManySuggestions = false; // will be set to the correct value by _addOptionsToContainer(), if needed

            var $result = this._makeResultDiv(data, query);

            this.$container.hide();
            this._addResultToContainer($result, query);
            this.$container.show();

            var indexToHighlight = this.exactMatchIndex >= 0 ? this.exactMatchIndex : this.lastFocusedIndex;
            this.reset(indexToHighlight);
        },

        /**
         * Append items to a {@see GroupDescriptor}
         * @param groupId
         * @param data
         */
        appendToGroupDescriptor: function appendToGroupDescriptor(groupId, data) {
            var group = _.find(this.lastData, function (suggestion) {
                return suggestion.id() === groupId;
            });

            _.forEach(data, function (item) {
                group.addItem(item);
            });
        },

        _generateOption: function _generateOption(item, query, labelRegex) {
            var replacementText;

            // Only highlight query matches if html has NOT been specified - assume the back end knows what it's doing.
            if (!item.highlighted() && labelRegex && labelRegex.test(item.label())) {
                replacementText = item.label().replace(labelRegex, function (_, prefix, spaceOrParenthesis, match, suffix) {
                    var div = jQuery("<div>");

                    prefix && div.append(jQuery("<span>").text(prefix));
                    div.append(jQuery("<em>").text(match));
                    suffix && div.append(jQuery("<span>").text(suffix));

                    return div.html();
                });
            }

            if (this.exactMatchIndex < 0) {
                var itemValue = jQuery.trim(item.label()).toLowerCase();
                if (!item.noExactMatch() && itemValue === jQuery.trim(query).toLowerCase()) {
                    this.exactMatchIndex = this.suggestions;
                } else if (this.lastFocusedIndex < 0 && this.lastFocusedItemDescriptor && itemValue === jQuery.trim(this.lastFocusedItemDescriptor.label()).toLowerCase()) {
                    this.lastFocusedIndex = this.suggestions;
                }
            }

            this.suggestions++;

            return this._render("suggestion", item, replacementText);
        },

        _filterOptions: function _filterOptions(options, regexEscapedQuery, labelRegex) {
            if (!regexEscapedQuery) {
                return options;
            }

            var filtered = [];
            var keywordsRegex = new RegExp(formatter.format(".*{0}.*", regexEscapedQuery), "i");

            for (var i = 0, len = options.length; i < len; i++) {
                var item = this._filterOption(options[i], keywordsRegex, labelRegex);
                if (item) {
                    filtered.push(item);
                }
            }

            return filtered;
        },

        _filterOption: function _filterOption(item, keywordsRegex, labelRegex) {
            var result;

            if (item.highlighted()) {
                result = item; // if we have html we assume the server has already filtered
            } else if (labelRegex.test(item.label())) {
                result = item;
            } else if (item.keywords()) {
                // if we didn't match on the label, try to match on keywords
                // for each keyword that contains the query, add it to the item's suffix string
                // otherwise return null if we don't match on the label or on any keywords
                var matchedKeywords = [];
                var keywordString = "" + item.keywords();
                var keywords = keywordString.split(",");

                for (var j = 0; j < keywords.length; j++) {
                    var keyword = keywords[j];
                    if (keywordsRegex.test(keyword)) {
                        matchedKeywords.push(keyword);
                    }
                }

                if (matchedKeywords.length) {
                    item.labelSuffix(" " + matchedKeywords.join(', '));
                    result = item;
                }
            }

            return result;
        },

        _addOptionsToContainer: function _addOptionsToContainer(options, $container, query, labelRegex) {
            var instance = this;
            var maxResult = this.maxInlineResultsDisplayed;
            var hasSuggestion = false;
            var forceAllResults = this.forceAllResults;
            var suggestions = [];

            for (var i = 0, len = options.length; i < len; i++) {
                var option = options[i];
                if (i < maxResult || forceAllResults) {
                    var $suggestion = instance._generateOption(option, query, labelRegex);
                    if ($suggestion) {
                        hasSuggestion = true;
                        suggestions.push($suggestion[0]);
                    }
                } else {
                    this.hasTooManySuggestions = true;
                    var $tooMany = instance._render("tooManySuggestions", options.length - i);
                    Assistive.readText($tooMany.text());
                    suggestions.push($tooMany[0]);
                    break;
                }
            }
            $container.html(jQuery(suggestions));

            return hasSuggestion;
        },

        _filterAndAddOptions: function _filterAndAddOptions(options, container, query) {

            var regexEscapedQuery;
            var labelRegex;

            if (query) {

                regexEscapedQuery = RegExp.escape(query);
                labelRegex = new RegExp(formatter.format(this.options.matchingStrategy, regexEscapedQuery), "i");
                options = this._filterOptions(options, regexEscapedQuery, labelRegex);
            }

            if (this.options.maxResultsDisplayedPerGroup) {
                options = options.slice(0, this.options.maxResultsDisplayedPerGroup);
            }

            return this._addOptionsToContainer(options, container, query, labelRegex);
        },

        _generateUngroupedOptions: function _generateUngroupedOptions(options, query) {
            var $container = this._render("ungroupedSuggestions");
            var optionsAdded = this._filterAndAddOptions(options, $container, query);
            if (optionsAdded) {
                return $container;
            }
        },

        _generateOptGroup: function _generateOptGroup(groupDescriptor, query) {

            var res = jQuery();
            var optContainer = this._render("suggestionGroup", groupDescriptor);
            var options = groupDescriptor.items();
            var optionsAdded = this._filterAndAddOptions(options, optContainer, query);

            if (!optionsAdded) {
                return;
            }

            if (groupDescriptor.label() && groupDescriptor.showLabel() !== false) {
                res = res.add(this._render("suggestionGroupHeading", groupDescriptor));
            }

            if (groupDescriptor.footerText()) {
                optContainer.append(this._render("suggestionsGroupFooter", groupDescriptor.footerText()));
            } else if (groupDescriptor.footerHtml()) {
                optContainer.append(groupDescriptor.footerHtml());
            }

            if (groupDescriptor.actionBarHtml()) {
                optContainer.prepend(groupDescriptor.actionBarHtml());
            }

            res = res.add(optContainer);

            return res;
        },

        _expandAllResults: function _expandAllResults() {
            this.generateListFromJSON(this.lastData, this.lastQuery, true);
        },

        _events: {
            delegateTarget: {
                "aui:keydown": function auiKeydown(event) {
                    this._handleKeyEvent(event);
                }
            }
        },

        _renders: {

            suggestion: function suggestion(descriptor, replacementText) {
                // increment itemId so it never repeats
                globalItemId += 1;

                //adding the label as a class for testing.
                var idSuffix = descriptor.fieldText() || descriptor.label();
                var itemId = strings.escapeHtml(buildElementId(idSuffix));
                var listElem = jQuery('<li class="aui-list-item"><a class="aui-list-item-link" role="presentation" /></li>').attr({
                    "role": this.options.suggestionRole,
                    "id": itemId + '-' + globalItemId
                });
                var linkElem = listElem.children();

                listElem.addClass('aui-list-item-li-' + itemId); // so tests can find specific elements.

                if (descriptor.selected()) {
                    listElem.addClass("aui-checked");
                }

                if (this.options.hasLinks) {
                    linkElem.attr("href", descriptor.href() || "#");
                }

                if (descriptor.styleClass()) {
                    linkElem.addClass(descriptor.styleClass());
                }

                if (replacementText) {
                    linkElem.html(replacementText);
                } else if (descriptor.html()) {
                    linkElem.html(descriptor.html());
                } else {
                    linkElem.text(descriptor.label());
                }

                if (descriptor.labelSuffix()) {
                    var suffixSpan = jQuery("<span class='aui-item-suffix' />").text(descriptor.labelSuffix());
                    linkElem.wrapInner("<span class='aui-item-text' />").append(suffixSpan);
                }

                if (descriptor.icon() && descriptor.icon() !== "none") {
                    var icon = jQuery('<img class="icon"  alt="" />');
                    icon.attr("src", descriptor.icon());
                    linkElem.addClass("aui-iconised-link").prepend(icon);
                }

                if (descriptor.title()) {
                    linkElem.prop('title', descriptor.title());
                }

                listElem.data("descriptor", descriptor);

                return listElem;
            },
            noSuggestion: function noSuggestion() {
                return jQuery('<li class="no-suggestions">').text(formatter.I18n.getText("common.concepts.no.matches"));
            },
            tooManySuggestions: function tooManySuggestions(suggestionCount) {
                if (this.options.expandAllResults) {
                    var instance = this;
                    var $button = jQuery(["<button type='button' class='aui-button aui-button-link view-all'>", formatter.I18n.getText("common.concepts.view.all.with.total.info", suggestionCount), "</button>"].join(""));
                    var $li = jQuery('<li class="no-suggestions"></li>').append($button);

                    // This can't be extracted to _events.delegateTarget as some consumers set the delegateTarget element
                    // to be outside the list, therefore this event will not be handled.
                    $button.click(function (ev) {
                        instance._expandAllResults();
                        ev.stopPropagation();
                    });
                    $button = null;
                    return $li;
                } else {
                    return jQuery('<li class="no-suggestions">' + formatter.I18n.getText("common.concepts.too.many.matches", suggestionCount) + "</li>");
                }
            },
            ungroupedSuggestions: function ungroupedSuggestions() {
                return jQuery('<ul>');
            },
            suggestionGroup: function suggestionGroup(descriptor) {
                return jQuery("<ul/>").attr({
                    "id": buildElementId(descriptor.label()),
                    "class": "aui-list-section",
                    "aria-label": descriptor.label()
                }).addClass(descriptor.styleClass()).data("descriptor", descriptor);
            },
            suggestionGroupHeading: function suggestionGroupHeading(descriptor) {
                var elem = jQuery("<h5 />").text(descriptor.label()).addClass(descriptor.styleClass()).data("descriptor", descriptor);

                if (descriptor.description()) {
                    jQuery("<span class='aui-section-description' />").text(" (" + descriptor.description() + ")").appendTo(elem);
                }

                return elem;
            },
            suggestionsGroupFooter: function suggestionsGroupFooter(text) {
                return jQuery("<li class='aui-list-section-footer' />").text(text);
            }
        },

        _acceptSuggestion: function _acceptSuggestion(item) {

            if (!item instanceof jQuery) {
                item = jQuery(item);
            }

            var linkNode = this._getLinkFromItem(item);

            if (linkNode.length) {
                var event = new jQuery.Event("click");
                linkNode.trigger(event, [linkNode]);
                if (!event.isDefaultPrevented()) {
                    window.location.href = linkNode.attr("href");
                }
            }
        },

        getAllItems: function getAllItems() {
            return this.$container.find(this.options.itemSelector);
        },

        _acceptUserInput: function _acceptUserInput($field) {
            // Call the blur event handler on this field, so that accepting user input goes through a different
            // code path to accepting suggestions.
            // TODO: Refactor this so that AJS.List doesn't need to know about is owner AJS.QueryableDropdownSelect.
            $field.triggerHandler("blur");
        },

        _handleSectionByKeyboard: function _handleSectionByKeyboard(e) {
            var $focusedItem = this.getFocused();
            var $field = jQuery(e.target);

            if ($focusedItem.length === 0) {
                return;
            }

            // NOTE: See AJS.QueryableDropdownSelect.prototype._requestThenResetSuggestions for where this._latestQuery is set.
            if (this._latestQuery && jQuery.trim($field.val()) !== this._latestQuery) {
                // Handle case where user input is inconsistent with suggestion text like a user-inputted-option.
                var inputWords = $field.val().toLowerCase().match(/\S+/g);
                if (inputWords) {
                    var html = this.lastFocusedItemDescriptor && this.lastFocusedItemDescriptor.html();
                    var $item = html ? jQuery("<div>").html(html) : $focusedItem;
                    var matches = [];
                    $item.find("em,b").each(function () {
                        var $match = jQuery(this);
                        var nextText = jQuery($match.attr('nextSibling')).text().toLowerCase().match(/^\S*/)[0];
                        jQuery.each($match.text().toLowerCase().match(/\S+/g), function (i, match) {
                            matches.push(match + nextText);
                        });
                    });

                    for (var i = 0; i < inputWords.length; i++) {
                        var word = inputWords[i];
                        var n = word.length;
                        var hasMatch = false;
                        for (var j = 0; j < matches.length; j++) {
                            if (matches[j].slice(0, n) === word) {
                                hasMatch = true;
                                break;
                            }
                        }
                        if (!hasMatch) {
                            this._acceptUserInput($field);
                            return;
                        }
                    }
                }
            }

            this.scrollActiveItemIntoView();

            // If it's a genuine matching selection, defer to the selectionHandler if one exists.
            // The selection handler may choose to handle accepting a suggestion on its own, in which
            // case we don't need to do any further work.
            if (this.options.selectionHandler && !this.options.selectionHandler.call(this, e)) {
                return;
            }

            this._acceptSuggestion($focusedItem);
        },

        _isValidInput: function _isValidInput() {
            return !this.disabled && this.$container.is(":visible");
        },

        keys: {
            "Down": function Down(event) {
                this.moveToNext();
                event.preventDefault();
            },
            "Up": function Up(event) {
                this.moveToPrevious();
                event.preventDefault();
            },
            "Return": function Return(event) {
                this._handleSectionByKeyboard(event);
                event.preventDefault();
            }
        },

        _buildElementId: buildElementId

    });
});

/** @deprecated use {@link Group} instead */
AJS.namespace('AJS.List', null, require('jira/ajs/list/list'));