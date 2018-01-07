(function () {
    var Events = require('jira/util/events');
    // Bind only the legacy so that the JIRA object doesn't implicitly get new methods.
    AJS.namespace('JIRA.bind', null, Events.bind);
    AJS.namespace('JIRA.unbind', null, Events.unbind);
    AJS.namespace('JIRA.one', null, Events.one);
    AJS.namespace('JIRA.trigger', null, Events.trigger);
})();

(function () {
    var User = require('jira/util/users/logged-in-user');
    AJS.namespace('JIRA.isAdmin', null, User.isAdmin);
    AJS.namespace('JIRA.isSysadmin', null, User.isSysadmin);
})();

(function () {
    var E = require('jira/util/elements');
    AJS.namespace('AJS.elementIsFocused', null, E.elementIsFocused);
    AJS.namespace('AJS.consumesKeyboardEvents', null, E.consumesKeyboardEvents);
})();

(function () {
    var B = require('jira/util/browser');
    AJS.namespace('AJS.canAccessIframe', null, B.canAccessIframe);
    AJS.namespace('AJS.isSelenium', null, B.isSelenium);
    AJS.namespace('AJS.reloadViaWindowLocation', null, B.reloadViaWindowLocation);
    AJS.namespace('AJS.enableKeyboardScrolling', null, B.enableKeyboardScrolling);
    AJS.namespace('AJS.disableKeyboardScrolling', null, B.disableKeyboardScrolling);
})();

(function () {
    var O = require('jira/util/objects');
    AJS.namespace("begetObject", window, O.begetObject);
})();

(function () {
    var F = require('jira/util/forms');
    AJS.namespace('submitOnEnter', window, F.submitOnEnter);
    AJS.namespace('submitOnCtrlEnter', window, F.submitOnCtrlEnter);
    AJS.namespace('getMultiSelectValues', window, F.getMultiSelectValues);
    AJS.namespace('getMultiSelectValuesAsArray', window, F.getMultiSelectValuesAsArray);
})();

// Cookie handling functions
(function () {
    var Cookie = require('jira/data/cookie');
    AJS.namespace('saveToConglomerateCookie', window, Cookie.saveToConglomerate);
    AJS.namespace('readFromConglomerateCookie', window, Cookie.readFromConglomerate);
    AJS.namespace('eraseFromConglomerateCookie', window, Cookie.eraseFromConglomerate);
    AJS.namespace('getValueFromCongolmerate', window, Cookie.getValueFromCongolmerate);
    AJS.namespace('addOrAppendToValue', window, Cookie.addOrAppendToValue);
    AJS.namespace('getCookieValue', window, Cookie.getValue);
    AJS.namespace('saveCookie', window, Cookie.save);
    AJS.namespace('readCookie', window, Cookie.read);
    AJS.namespace('eraseCookie', window, Cookie.erase);
})();

// This is here so that we find bugs like JRA-19245 ASAP
jQuery.noConflict();
jQuery.ajaxSettings.traditional = true;

/* eslint-disable */
(function () {
    var hasGlobalAlready = 'contextPath' in window;
    if (!hasGlobalAlready) {
        /**
         * @deprecated Use require('wrm/context-path') instead.
         * @notes We initially removed this, but it broke plugins and QUnit tests,
         * because sometimes the head-common.jsp doesn't get included in the
         * page decoration process, and that file's contextPath global isn't output.
         */
        AJS.namespace('contextPath', window, require('wrm/context-path')());
    }
})();
/* eslint-enable */

// constants
(function () {
    var LayerOptions = require('jira/ajs/layer/layer-constants');
    AJS.namespace('AJS.LEFT', null, LayerOptions.LEFT);
    AJS.namespace('AJS.RIGHT', null, LayerOptions.RIGHT);
    AJS.namespace('AJS.ACTIVE_CLASS', null, LayerOptions.ACTIVE_CLASS);
    AJS.namespace('AJS.BOX_SHADOW_CLASS', null, LayerOptions.BOX_SHADOW_CLASS);
    AJS.namespace('AJS.LOADING_CLASS', null, LayerOptions.LOADING_CLASS);
    AJS.namespace('AJS.INTELLIGENT_GUESS', null, LayerOptions.INTELLIGENT_GUESS);
})();

(function () {
    var SPECIAL_CHARS = /[.*+?|^$()[\]{\\]/g;
    // Note: This escapes str for regex literal sequences -- not within character classes
    RegExp.escape = function (str) {
        return str.replace(SPECIAL_CHARS, "\\$&");
    };
})();

/**
 * A bunch of useful utilitiy javascript methods available to all jira pages
 */
(function () {
    var $ = require('jquery');
    /**
     * Reads data from a structured HTML, such as definition list and build a data object.
     * Even children represent names, odd children represent values.
     *
     * @param {String} s jQuery selector
     * @memberof external:jQuery
     * @deprecated
     */
    $.readData = function (s) {
        var r = {};
        var n = "";

        $(s).children().each(function (i) {
            if (i % 2) {
                r[n] = $.trim($(this).text());
            } else {
                n = $.trim($(this).text());
            }
        }).remove();
        $(s).remove();
        return r;
    };
})();

/** @deprecated wat */
String.prototype.escapejQuerySelector = function () {
    return this.replace(/([:.])/g, "\\$1");
};

/**
 * This function can extract the BODY tag text from a HttpRequest if its there are otherwise
 * return all the response text.
 *
 * @param text the AJAX request text returned
 */
AJS.extractBodyFromResponse = function (text) {
    var fragment = text.match(/<body[^>]*>([\S\s]*)<\/body[^>]*>/);
    if (fragment && fragment.length > 0) {
        return fragment[1];
    }
    return text;
};

AJS.isDevMode = function () {
    return AJS.Meta.get("dev-mode");
};

(function () {
    /**
     * Tries to run a function and return its value and if it throws an exception, returns the default value instead
     *
     * @param f the function to try
     * @param defaultVal the default value to return in case of an error
     * @deprecated
     */
    function tryIt(f, defaultVal) {
        try {
            return f();
        } catch (ex) {
            return defaultVal;
        }
    }
    AJS.namespace("tryIt", window, tryIt);
})();

(function () {
    /**
     * Returns true if the value has a truthy equivalent in the array.
     * @deprecated use {@link jQuery.inArray}
     */
    function arrayContains(array, value) {
        for (var i = 0, ii = array.length; i < ii; i++) {
            if (array[i] == value) {
                // eslint-disable-line eqeqeq
                return true;
            }
        }
        return false;
    }
    AJS.namespace("arrayContains", window, arrayContains);
})();

(function () {
    var jQuery = require('jquery');

    /** @deprecated use {@link jQuery.addClass} */
    function addClassName(elementId, classNameToAdd) {
        jQuery('#' + elementId).addClass(classNameToAdd);
    }
    /** @deprecated use {@link jQuery.addClass} */
    AJS.namespace("addClassName", window, addClassName);

    /** @deprecated use {@link jQuery.removeClass} */
    function removeClassName(elementId, classNameToRemove) {
        jQuery('#' + elementId).removeClass(classNameToRemove);
    }
    /** @deprecated use {@link jQuery.removeClass} */
    AJS.namespace("removeClassName", window, removeClassName);
})();

(function () {
    /**
     * Returns the field as an encoded string (assuming that the id == the field name
     * @deprecated since 6.2
     */
    function getEscapedFieldValue(id) {

        var e = document.getElementById(id);

        if (e.value) {
            return id + '=' + encodeURIComponent(e.value);
        } else {
            return '';
        }
    }
    AJS.namespace("getEscapedFieldValue", window, getEscapedFieldValue);

    /**
     * Returns a concatenated version of getEscapedFieldValue
     * @deprecated since 6.2
     */
    function getEscapedFieldValues(ids) {
        var s = '';
        for (var i = 0; i < ids.length; i++) {
            s = s + '&' + getEscapedFieldValue(ids[i]);
        }
        return s;
    }
    AJS.namespace("getEscapedFieldValues", window, getEscapedFieldValues);
})();

(function () {
    var jQuery = require('jquery');
    var Cookie = require('jira/data/cookie');

    /* Manages Gui Preferences and stores them in the user's cookie. */
    var GuiPrefs = {
        toggleVisibility: function toggleVisibility(elementId) {
            var elem = document.getElementById(elementId);
            if (elem) {
                if (Cookie.readFromConglomerateCookie("jira.conglomerate.cookie", elementId, '1') == '1') {
                    elem.style.display = "none";
                    jQuery('#' + elementId + 'header').removeClass('headerOpened').addClass('headerClosed');
                    Cookie.saveToConglomerateCookie("jira.conglomerate.cookie", elementId, '0');
                } else {
                    elem.style.display = "";
                    jQuery('#' + elementId + 'header').removeClass('headerClosed').addClass('headerOpened');
                    Cookie.eraseFromConglomerateCookie("jira.conglomerate.cookie", elementId);
                }
            }
        }
    };
    AJS.namespace("GuiPrefs", window, GuiPrefs);

    /**
     * Toggles hide / unhide an element. Also attemots to change the "elementId + header" element to have the headerOpened / headerClosed class.
     * Also saves the state in a cookie
     * @deprecated use @see GuiPrefs.toggleVisibility
     */
    function toggle(elementId) {
        GuiPrefs.toggleVisibility(elementId);
    }
    AJS.namespace("toggle", window, toggle);
})();

(function () {
    var jQuery = require('jquery');
    var Cookie = require('jira/data/cookie');

    /** @deprecated */
    function toggleDivsWithCookie(elementShowId, elementHideId) {
        var elementShow = document.getElementById(elementShowId);
        var elementHide = document.getElementById(elementHideId);
        if (elementShow.style.display === 'none') {
            elementHide.style.display = 'none';
            elementShow.style.display = 'block';
            Cookie.saveToConglomerateCookie("jira.viewissue.cong.cookie", elementShowId, '1');
            Cookie.saveToConglomerateCookie("jira.viewissue.cong.cookie", elementHideId, '0');
        } else {
            elementShow.style.display = 'none';
            elementHide.style.display = 'block';
            Cookie.saveToConglomerateCookie("jira.viewissue.cong.cookie", elementHideId, '1');
            Cookie.saveToConglomerateCookie("jira.viewissue.cong.cookie", elementShowId, '0');
        }
    }
    AJS.namespace("toggleDivsWithCookie", window, toggleDivsWithCookie);

    /**
     * Similar to toggle. Run this on page load.
     * @deprecated
     */
    function restoreDivFromCookie(elementId, cookieName, defaultValue) {
        if (defaultValue == null) defaultValue = '1';

        var elem = document.getElementById(elementId);
        if (elem) {
            if (Cookie.readFromConglomerateCookie(cookieName, elementId, defaultValue) != '1') {
                elem.style.display = "none";
                jQuery('#' + elementId + 'header').removeClass('headerOpened').addClass('headerClosed');
            } else {
                elem.style.display = "";
                jQuery('#' + elementId + 'header').removeClass('headerClosed').addClass('headerOpened');
            }
        }
    }
    AJS.namespace("restoreDivFromCookie", window, restoreDivFromCookie);

    /**
     * Similar to toggle. Run this on page load.
     * @deprecated
     */
    function restore(elementId) {
        restoreDivFromCookie(elementId, "jira.conglomerate.cookie", '1');
    }
    AJS.namespace("restore", window, restore);
})();

// Table colouring functions
(function () {
    var TableUtils = require('jira/tables/legacy-table-utils');
    AJS.namespace("recolourSimpleTableRows", window, TableUtils.recolourSimpleTableRows);
    AJS.namespace("recolourTableRows", window, TableUtils.recolourTableRows);
})();

(function () {
    var strings = require('jira/util/strings');
    /** @deprecated use {@see module:jira/util/strings#escapeHtml} */
    AJS.namespace("htmlEscape", window, strings.escapeHtml);
    /** @deprecated use {@see module:jira/util/strings#escapeHtml} */
    AJS.namespace('AJS.escapeHTML', null, strings.escapeHtml);
})();

(function () {
    AJS.namespace("atl_token", window, require('jira/util/urls').atl_token);
})();