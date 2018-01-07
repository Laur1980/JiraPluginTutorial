/**
 * Utility functions for interacting with HTML elements
 * @module jira/util/elements
 */
define('jira/util/elements', ['jquery'], function ($) {
    'use strict';

    return (/** @alias module:jira/util/elements */{
            /**
             * Whether the given element has browser focus or not
             * @param {HTMLElement} input
             * @returns {boolean}
             */
            elementIsFocused: function elementIsFocused(input) {
                return input && $(input).get(0) === document.activeElement;
            },


            /**
             * Determines if the given element (typically jQuery(e.target) ) is likely to want to consume a keyboard event.
             * @param input
             */
            consumesKeyboardEvents: function consumesKeyboardEvents(input) {
                var $e = input instanceof $ ? input : $(input);
                return !$e.is(':button') && ($e.is(':input') || $e.is('[contentEditable]'));
            }
        }
    );
});