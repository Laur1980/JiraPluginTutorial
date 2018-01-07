/**
 * Temporary functionality to allow HTML5 input placeholder text
 * functionality in IE.
 *
 * Please remove this file if/when IE supports placeholder.
 */
require(['jquery'], function (jQuery) {

    jQuery.fn.ieImitationPlaceholder = function () {
        if (jQuery.browser.msie) {
            var setTextFromPlaceholder = function setTextFromPlaceholder() {
                var field = jQuery(this);
                if (field.val() === "") {
                    field.val(field.attr("placeholder"));
                    field.addClass("input-placeholder");
                }
            };

            var clearTextIfUnchanged = function clearTextIfUnchanged() {
                var field = jQuery(this);
                if (field.val() === field.attr("placeholder")) {
                    field.val("");
                    field.removeClass("input-placeholder");
                }
            };

            var clearAllIfUnchanged = function clearAllIfUnchanged() {
                fields.each(clearTextIfUnchanged);
            };

            var form = this;
            var fields = form.find("[placeholder]");

            fields.focus(clearTextIfUnchanged);
            fields.blur(setTextFromPlaceholder);
            form.submit(clearAllIfUnchanged);

            fields.each(setTextFromPlaceholder);
        }
    };
});