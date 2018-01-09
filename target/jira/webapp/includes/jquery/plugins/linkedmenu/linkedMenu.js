/* eslint-disable */
(function (jQuery) {
    jQuery.deactivateLinkedMenu = function () {};

    jQuery.linkedMenuInstances = [];

    jQuery.fn.linkedMenu = function (opts) {

        var idx,
            that = this,
            onDisable,
            enabled = false,
            focusElement = function focusElement(elem) {
            elem = jQuery(elem);
            that.blur();
            elem.trigger("click", "focus", "mousedown");
        },
            keyHandler = function keyHandler(e) {
            var targ;
            if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 27) {
                if (e.keyCode === 37) {
                    targ = idx - 1;
                    if (idx - 1 >= 0) {
                        if (isNotActive(that[targ])) {
                            idx = targ;
                            focusElement(that[idx]);
                        }
                    } else {
                        targ = that.length - 1;
                        if (isNotActive(that[targ])) {
                            idx = targ;
                            focusElement(that[idx]);
                        }
                    }
                } else if (e.keyCode === 39) {
                    targ = idx + 1;
                    if (targ < that.length) {
                        if (isNotActive(that[targ])) {
                            idx = targ;
                            focusElement(that[idx]);
                        }
                    } else {
                        targ = 0;
                        if (isNotActive(that[targ])) {
                            idx = targ;
                            focusElement(that[idx]);
                        }
                    }
                } else {
                    that.disableLinkedMenu(e);
                }
                e.preventDefault();
            }
        },
            isNotActive = function isNotActive(elem) {
            if (elem !== that[idx]) {
                return true;
            }
        },
            focusBridge = function focusBridge() {
            if (isNotActive(this)) {
                idx = jQuery.inArray(this, that);
                focusElement(this);
            }
        },
            reflectionBridge = function reflectionBridge() {
            var targ = jQuery.inArray(this, jQuery(opts.reflectFocus));
            if (isNotActive(that[targ])) {
                idx = targ;
                focusElement(that[idx]);
            }
        },
            enable = function enable() {
            var elem, clss;
            if (!enabled) {

                jQuery.currentLinkedMenu = that;

                if (opts.onFocusRemoveClass) {
                    elem = jQuery(opts.onFocusRemoveClass);
                    clss = opts.onFocusRemoveClass.match(/\.([a-z]*)$/);
                    if (clss && clss[1] && elem.length > 0) {
                        jQuery(opts.onFocusRemoveClass).removeClass(clss[1]);
                        onDisable = function onDisable() {
                            jQuery(elem).addClass(clss[1]);
                        };
                    }
                }
                enabled = true;
                idx = jQuery.inArray(this, that);

                that.mouseover(focusBridge);

                if (jQuery.browser.mozilla) {
                    jQuery(document).keypress(keyHandler);
                } else {
                    jQuery(document).keydown(keyHandler);
                }
                jQuery(document).mousedown(that.disableLinkedMenu);

                if (opts.reflectFocus) {
                    jQuery(opts.reflectFocus).mouseover(reflectionBridge);
                }
            }
        };

        that.disableLinkedMenu = function (e) {

            jQuery(document).unbind("keypress", keyHandler);
            jQuery(document).unbind("keydown", keyHandler);
            that.unbind("mouseover", focusBridge);
            jQuery(document).unbind("mousedown", arguments.callee);
            if (opts.reflectFocus) {
                jQuery(opts.reflectFocus).unbind("mouseover", reflectionBridge);
            }

            if (onDisable) {
                onDisable();
            }

            that.blur();

            delete jQuery.currentLinkedMenu;

            window.setTimeout(function () {
                enabled = false;
            }, 200);
        };

        opts = opts || {};

        focusElement = opts.focusElement || focusElement;

        that.click(enable);

        return that;
    };
})(jQuery);
/* eslint-enable */