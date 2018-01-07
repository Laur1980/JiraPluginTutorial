define('jira/ajs/dropdown/dropdown-list-item', ['jira/ajs/layer/layer-constants', 'jira/ajs/control', 'jira/ajs/input/mouse', 'underscore', 'jquery', 'jira/util/top-same-origin-window'], function (LayerConstants, Control, Mouse, _, $, getTopSameOriginWindow) {

    var topSameOriginWindow = getTopSameOriginWindow(window);

    /**
     * A list item is an item used in a list.
     *
     * @class Dropdown.ListItem
     * @extends Control
     */
    var ListItem = Control.extend({
        CLASS_SIGNATURE: "AJS_DROPDOWN_LISTITEM",

        init: function init(options) {
            this._setOptions(options);

            this.$element = $(this.options.element);
            this.$element.find("a").attr({
                "role": "menuitem",
                "tabindex": -1
            });
            this.hasFocus = false;

            this._ensureIdOf(this.$element);
            this._assignEvents("instance", this);
            this._assignEvents("element", this.$element);
        },

        _getDefaultOptions: function _getDefaultOptions() {
            return {
                element: null,
                autoScroll: true,
                focusClass: LayerConstants.ACTIVE_CLASS
            };
        },

        _ensureIdOf: function _ensureIdOf($el) {
            var id = $el.attr("id");
            if (_.isEmpty(id)) {
                id = $el.attr("id", _.uniqueId(this.CLASS_SIGNATURE + "__"));
            }
            return id;
        },

        _events: {
            "instance": {
                "focus": function focus(event) {
                    this.hasFocus = true;
                    this.$element.addClass(this.options.focusClass);

                    if (!event.noscrolling) {
                        ListItem.MOTION_DETECTOR.unbind();
                        this.isWaitingForMove = true;
                        if (this.options.autoScroll) {
                            this.$element.scrollIntoView(ListItem.SCROLL_INTO_VIEW_OPTIONS);
                        }
                    }
                },
                "blur": function blur() {
                    this.hasFocus = false;
                    this.$element.removeClass(this.options.focusClass);
                },
                "accept": function accept() {
                    var event = new $.Event("click");
                    var $target = this.$element.is("a[href]") ? this.$element : this.$element.find("a[href]");

                    $target.trigger(event);

                    if (!event.isDefaultPrevented()) {
                        topSameOriginWindow.location = $target.attr("href");
                    }
                }
            },
            "element": {
                "mousemove": function mousemove() {
                    if (this.isWaitingForMove && ListItem.MOTION_DETECTOR.moved && !this.hasFocus || !this.hasFocus) {
                        this.isWaitingForMove = false;
                        this.trigger({
                            type: "focus",
                            noscrolling: true
                        });
                    }
                }
            }
        }
    });

    ListItem.MOTION_DETECTOR = new Mouse.MotionDetector();

    ListItem.SCROLL_INTO_VIEW_OPTIONS = {
        duration: 100,
        callback: function callback() {
            ListItem.MOTION_DETECTOR.wait();
        }
    };

    return ListItem;
});

AJS.namespace('AJS.Dropdown.ListItem', null, require('jira/ajs/dropdown/dropdown-list-item'));