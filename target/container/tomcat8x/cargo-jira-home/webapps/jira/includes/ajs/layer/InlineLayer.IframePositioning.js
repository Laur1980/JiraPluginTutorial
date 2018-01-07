define('jira/ajs/layer/inline-layer/iframe-positioning', ['jira/ajs/layer/inline-layer/standard-positioning', 'jira/util/navigator', 'jquery', 'jira/util/top-same-origin-window'], function (StandardPositioning, Navigator, jQuery, getTopSameOriginWindow) {

    var topSameOriginWindow = getTopSameOriginWindow(window);

    /**
     * Handles positiong of dropdown in iframes. Need to calculate the offset of the iframe as well. Some browsers
     * will return the iframe offset without taking scroll into account. This is handled by an instance property
     * 'add scroll'
     *
     * @class IframePositioning
     * @extends StandardPositioning
     */
    var IframePositioning = StandardPositioning.extend({

        /**
         * Calculates offset of iframe and offsetTarget
         *
         * @return {Object}
         */
        offset: function offset() {
            var window = IframePositioning.window();
            var topWindow = IframePositioning.topWindow();
            var $iframe = jQuery("iframe", topWindow.document.body).filter(function () {
                return this.getAttribute("name") === window.name;
            });
            var iframeOffset = $iframe.parent().offset();
            var offsetInDocument = this._super();
            var topDocumentScrollTop = this._topDocumentScrollTop();
            var topDocumentScrollLeft = this._topDocumentScrollLeft();
            var iframeScrollTop = this._iframeScrollTop();
            var iframeScrollLeft = this._iframeScrollLeft();
            // we need to account for document scroll and 'forget' iframe scroll, as the resulting offset should be with regards to the top document
            var scrollTopModifier = topDocumentScrollTop - iframeScrollTop;
            var scrollLeftModifier = topDocumentScrollLeft - iframeScrollLeft;

            return {
                left: iframeOffset.left + offsetInDocument.left + scrollLeftModifier,
                top: iframeOffset.top + offsetInDocument.top + scrollTopModifier
            };
        },

        _topDocumentScrollTop: function _topDocumentScrollTop() {
            return this.isOffsetIncludingScroll() ? 0 : Math.max(topSameOriginWindow.document.body.scrollTop, topSameOriginWindow.document.documentElement.scrollTop);
        },

        _topDocumentScrollLeft: function _topDocumentScrollLeft() {
            return this.isOffsetIncludingScroll() ? 0 : Math.max(topSameOriginWindow.document.body.scrollLeft, topSameOriginWindow.document.documentElement.scrollLeft);
        },

        _iframeScrollTop: function _iframeScrollTop() {
            return this.isOffsetIncludingScroll() ? 2 * Math.max(window.document.body.scrollTop, window.document.documentElement.scrollTop) : 0;
        },

        _iframeScrollLeft: function _iframeScrollLeft() {
            return this.isOffsetIncludingScroll() ? 2 * Math.max(window.document.body.scrollLeft, window.document.documentElement.scrollLeft) : 0;
        },

        /**
         * Gets/sets a boolean flag that controls how this positioning instance
         * computes the offsets in case of scrolling. If set to
         * <code>true</code>, this positioning will behave as if the offset methods
         * did include non-visible scrolled out areas. This has implications over how
         * the real offset of the dropdown layer within the top document is calculated,
         * and the offset results are non consistent across different browsers in those
         * terms.
         *
         * The default value for this property is <code>true</code> (as in FF and Safari).
         *
         * @param {boolean} offsetIncludingScroll
         * @return {boolean}
         */
        isOffsetIncludingScroll: function isOffsetIncludingScroll(offsetIncludingScroll) {
            if (typeof this.offsetIncludingScroll === "undefined") {
                this.offsetIncludingScroll = true;
            }
            if (typeof offsetIncludingScroll !== "undefined") {
                this.offsetIncludingScroll = offsetIncludingScroll;
            }
            return this.offsetIncludingScroll;
        },

        /**
         * Appends to top document body
         */
        appendToBody: function appendToBody() {
            topSameOriginWindow.jQuery("body").append(this.layer());
        },

        /**
         * Gets top window
         * @return {window}
         */
        window: function window() {
            return topSameOriginWindow;
        },

        /**
         * We are not doing any scrolling, but need to override
         */
        scrollTo: function scrollTo() {}

    });

    if (Navigator.isWebkit()) {
        // Handles positioning of dropdown in DOM below iframes.
        // Webkit does not allow a parent document to adopt nodes so we need to rebuild.
        IframePositioning = IframePositioning.extend( /** @lends IframePositioning.prototype */{

            /**
             * Appends to body, rebuilding element in context of parent document
             * @override
             */
            appendToBody: function appendToBody() {
                var oldLayer = this.layer();
                this.layer(this._rebuildLayerInParent());
                topSameOriginWindow.jQuery("body").append(this.layer());
                oldLayer.remove();
                this.rebuilt();
            },

            /**
             * Appends to placeholder, rebuilding element in context of iframe document
             * @override
             */
            appendToPlaceholder: function appendToPlaceholder() {
                var oldLayer = this.layer();
                this.layer(this._rebuildLayerInIframe());
                this.layer().appendTo(this.placeholder());
                oldLayer.remove();
                this.rebuilt();
            },

            /**
             * Rebuilds layer in context of parent DOM
             *
             * @private
             * @return {jQuery}
             */
            _rebuildLayerInParent: function _rebuildLayerInParent() {
                return topSameOriginWindow.jQuery("<div class='ajs-layer'>" + this.layer().html() + "</div>");
            },

            /**
             * Rebuilds layer in context of iframe DOM
             *
             * @private
             * @return {jQuery}
             */
            _rebuildLayerInIframe: function _rebuildLayerInIframe() {
                return jQuery("<div class='ajs-layer'>" + this.layer().html() + "</div>");
            }
        });
    }

    if (Navigator.isMozilla()) {
        // Defers appending to placeholder until some time after the layer is hidden.
        // Firefox 5+ has an issue following links after the link element has moved across documents
        // (eg from top to iframe), even with the setTimeout() defer that wraps the call to this method in InlineLayer.hide()
        IframePositioning = IframePositioning.extend( /** @lends IframePositioning.prototype */{
            /**
             * Appends to placeholder, rebuilding element in context of iframe document
             * @override
             */
            appendToPlaceholder: function appendToPlaceholder() {
                var $oldLayer = this.layer();
                this.layer($oldLayer.clone(true).appendTo(this.placeholder()));
                this.rebuilt();
                window.setTimeout(function () {
                    $oldLayer.remove();
                }, 10);
            }
        });
    }

    IframePositioning.window = function () {
        return window;
    };

    IframePositioning.topWindow = function () {
        return topSameOriginWindow;
    };

    return IframePositioning;
});