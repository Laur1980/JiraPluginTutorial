/**
 * @fileOverview
 * JIRA's layer management has some fundamental shortcomings. I'll do my best to explain them.
 *
 * An ideal layer management solution would be something like:
 * - a single 'layerable' component exists, from which every other component extends or mixes in.
 * - all layers have a parent-child relationship with something else in the DOM.
 * - whenever a layer is to be shown or hidden, correct layering would be a case of
 * -- determining the parent of the layer to be shown/hidden
 * -- popping every layer that's a child of the parent you found, then
 * -- pushing the new layer (if it was to be shown).
 *
 * JIRA's layer management is nothing like that.
 *
 * JIRA has no core layerable component, and no hierarchy of layers. Rather,
 * each component can decide whether it shows or hides individually.
 * A consequence of this: no one layerable component knows about (or could know about) another.
 * There is no layer hierarchy; instead of a "stack" of layers, each component has a
 * singleton value for the "current" shown instance of that component.
 *
 * Because of this, JIRA's layer management consists of:
 * (1) figuring out what components can be shown or hidden at any given time,
 * (2) knowing what all layerable events might occur, and
 * (3) knowing which shown layers should appear/disappear when an event occurs.
 *
 * @note
 * This file is deliberately *not* an AMD module, because the event registration
 * needs to happen immediately an synchronously so as not to miss any events fired
 * during page initialisation.
 */
(function () {
    'use strict';

    var Events = require('jira/util/events');
    var Types = require('jira/util/events/types');
    var Strings = require('jira/util/strings');
    var LayerHideReason = require('jira/ajs/layer/hide-reasons');
    var interactions = require('jira/ajs/layer/layer-interactions');
    var topSameOriginWindow = require('jira/util/top-same-origin-window');
    var jQuery = require('jquery');
    var _ = require('underscore');

    var $doc = jQuery(document);

    function anyStringContains(haystack, needles) {
        if (typeof needles === "string") {
            needles = [needles];
        }
        return _.any(needles, function (n) {
            return Strings.contains(haystack, n);
        });
    }

    // We want to make sure that we don't have any other layers open before we close the dialog
    Events.bind("Dialog.beforeHide", function (e) {
        var shouldPrevent = _.any(interactions.preventDialogHide(), function (layerable) {
            return layerable && layerable.current;
        });
        if (shouldPrevent) {
            e.preventDefault();
        }
    });

    // Close any layers that are currently open before allowing a dialog open to occur
    Events.bind("Dialog.show", function (e) {
        _.each(interactions.hideBeforeDialogShown(), function (layerable) {
            if (layerable && layerable.current) {
                layerable.current.hide();
                e.preventDefault();
            }
        });
    });

    // If there are layers that should affect an input, the user is probably still selecting a value
    // for the input field. Therefore, don't allow the input to be blurred while these layers are active.
    $doc.bind("beforeBlurInput", function (e) {
        var shouldPrevent = _.any(interactions.preventInputBlur(), function (layerable) {
            return layerable && layerable.current;
        });
        if (shouldPrevent) {
            e.preventDefault();
        }
    });

    // Some layers are shown to allow picking values for inline editable fields. If one is shown when an inline edit
    // is cancelled, the user is probably still picking a value; prevent the edit from being cancelled until the layer is gone.
    if (Types.BEFORE_INLINE_EDIT_CANCEL) {
        Events.bind(Types.BEFORE_INLINE_EDIT_CANCEL, function (e, id, type, reason) {
            if (reason !== JIRA.Issues.CANCEL_REASON.escPressed) {
                return;
            }
            var shouldPrevent = _.any(interactions.preventInlineEditCancel(), function (layerable) {
                return layerable && layerable.current;
            });
            if (shouldPrevent) {
                e.preventDefault();
            }
        });
    }

    function getWindow() {
        return topSameOriginWindow(window);
    }

    function getLayer(instance) {
        // instance is:
        //  - AJS.InlineLayer
        //  - JIRA.Dialog
        //  - AJS.dropDown
        //  - AJS.InlineDialog.
        //  - AJS.Dialog
        return (instance.$layer || instance.$popup || instance.$ || instance.popup || instance.element || instance)[0];
    }

    function listenForLayerEvents($doc) {
        $doc.bind("showLayer", function (e, type, item) {
            // User hover and inline edit dialogs don't participate in layer management.
            if (anyStringContains(item && item.id, ["user-hover-dialog", "aui-inline-edit-error", "watchers", "jira-help-tip"])) {
                return;
            }
            var topWindow = getWindow().AJS;
            //the user-hover-dialog has a dropdown in it which is why we're not hiding it on showLayer. It hides
            //itself anyway when the user doesn't hover over it any more with the mouse.
            if (topWindow.currentLayerItem && item !== topWindow.currentLayerItem && topWindow.currentLayerItem.type !== "popup") {
                topWindow.currentLayerItem.hide();
            }
            if (item) {
                topWindow.currentLayerItem = item;
                topWindow.currentLayerItem.type = type;
            }
        }).bind("hideLayer", function (e, type, item) {

            // User hover dialogs don't participate in layer management.
            if (!item || anyStringContains(item.id, ["user-hover-dialog", "aui-inline-edit-error", "jira-help-tip"])) {
                return;
            }
            var topWindow = getWindow().AJS;
            if (topWindow.currentLayerItem) {
                if (topWindow.currentLayerItem === item) {
                    topWindow.currentLayerItem = null;
                } else if (jQuery.contains(getLayer(item), getLayer(topWindow.currentLayerItem))) {
                    topWindow.currentLayerItem.hide();
                }
            }
        }).bind("hideAllLayers", function () {
            var topWindow = getWindow().AJS;
            if (topWindow.currentLayerItem) {
                topWindow.currentLayerItem.hide();
            }
        }).click(function (e) {
            var topWindow = getWindow().AJS;
            var layerItem = topWindow.currentLayerItem;

            if (!layerItem || layerItem.type === "popup" || layerItem.type === "inlineDialog" && layerItem.persistent) {
                return;
            }

            if (layerItem._validateClickToClose) {
                if (layerItem._validateClickToClose(e)) {
                    if (layerItem instanceof AJS.InlineLayer) {
                        layerItem.hide(LayerHideReason.clickOutside, e);
                    } else {
                        layerItem.hide();
                    }
                }
            } else {
                layerItem.hide();
            }
        });
    }

    $doc.bind("iframeAppended", function (e, iframe) {
        iframe = jQuery(iframe);
        iframe.load(function () {
            listenForLayerEvents(iframe.contents());
        });
    });

    listenForLayerEvents($doc);
})();