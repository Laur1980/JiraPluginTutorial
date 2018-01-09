/**
 * A singleton that supports colour picker. Updates associated form fields with selected values.
 *
 * @author Scott Harwood
 */
require(['jquery'], function (jQuery) {
    'use strict';

    var defaultColor;
    var openerElem;
    var openerForm;

    /**
     * Given a colour updates associated form fields
     * @private
     * @param {String} color - hex value of new colour
     */
    var acceptColor = function acceptColor(color) {
        jQuery("#colorVal").val(color);
    };

    /**
     * Closes popup, colour picker window, and updates values.
     * @private
     */
    var ok = function ok() {
        jQuery(document.getElementById("preview")).val("true");
        openerElem.val(jQuery("#colorVal").val());
        jQuery("#" + openerElem.attr("name") + "-rep", openerForm).css({
            backgroundColor: jQuery("#colorVal").val()
        });
        window.close();
    };

    /**
     * Restores form fields to default colour, the colour present before colour picker was opened.
     * @private
     */
    var cancel = function cancel() {
        openerElem.val(defaultColor);
        window.close();
    };

    /**
     * Gets hex value from hidden dom nodes, used to store params.
     * @private
     * @return {String} colour present before colour picker was opened
     */
    var getDefaultColor = function getDefaultColor() {
        return jQuery("#colorpicker-params").find(".defaultcolor").text();
    };

    /**
     * Gets the form field name, from hidden dom node, that lanched the colour picker.
     * Using this name, retrieves the dom node, and returns it as a jQuery object.
     *
     * @private
     * @return {Object} colour present before colour picker was opened
     */
    var getOpenerElement = function getOpenerElement() {
        var elemName = jQuery.trim(jQuery("#colorpicker-params").find(".openerelem").text());
        return jQuery(opener.document.jiraform[elemName]);
    };

    /**
     * Gets the form from which the colour picker was launched.
     *
     * @private
     * @return {Object} The form from which the colour picker was launched, as jQuery object.
     */
    var getOpenerForm = function getOpenerForm() {
        return jQuery(opener.document.jiraform);
    };

    jQuery(function () {
        defaultColor = getDefaultColor();
        openerElem = getOpenerElement();
        openerForm = getOpenerForm();
        jQuery(document).click(function (e) {
            var targ = jQuery(e.target);
            if (targ.parent().hasClass("colorpicker-option")) {
                acceptColor(targ.parent().attr("title"));
                e.preventDefault();
            } else if (targ.hasClass("colorpicker-ok")) {
                ok();
            } else if (targ.hasClass("colorpicker-cancel")) {
                cancel();
            }
        });

        jQuery(document).on("click", "#picker", function (e) {
            e.preventDefault();
        });
    });
});