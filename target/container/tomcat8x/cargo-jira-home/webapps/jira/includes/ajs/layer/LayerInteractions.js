/**
 * Allow layerable components to register their intent to either
 * hide or prevent hiding of a layer when certain conditions are met.
 * @module jira/ajs/layer/layer-interactions
 */
define('jira/ajs/layer/layer-interactions', ['exports'], function (exports) {
    'use strict';

    var layerBehaviours = {};
    layerBehaviours.preventDialogHide = [];
    layerBehaviours.preventInputBlur = [];
    layerBehaviours.preventInlineEditCancel = [];
    layerBehaviours.hideBeforeDialogShown = [];

    // We'll create a function for each of the layer behaviours dynamically.
    for (var behaviour in layerBehaviours) {
        if (!layerBehaviours.hasOwnProperty(behaviour)) {
            return;
        }
        (function makeBehaviourFor(b) {
            exports[b] = function layerBehaviourAccessor(layerableThing) {
                if (layerableThing && layerBehaviours[b].indexOf(layerableThing) === -1) {
                    layerBehaviours[b].push(layerableThing);
                }
                return layerBehaviours[b];
            };
        })(behaviour);
    }

    /**
     * @function preventDialogHide
     * @param [layerable] constructor for a component that should
     *                    prevent dialogs from hiding if an instance of it is open.
     * @returns the list of components that would prevent a dialog from hiding.
     */

    /**
     * @function preventInputBlur
     * @param [layerable] constructor for a component that should
     *                    prevent form input fields from losing focus
     *                    if an instance of it is open.
     * @returns the list of components that would prevent a form input field from losing focus.
     */

    /**
     * @function preventInlineEditCancel
     * @param [layerable] constructor for a component that should
     *                    prevent an inline edit from finishing if an instance of it is open.
     * @returns the list of components that would prevent an inline edit from finishing.
     */

    /**
     * @function hideBeforeDialogShown
     * @param [layerable] constructor for a component whose instances should
     *                    be hidden whenever a dialog is about to be shown.
     * @returns the list of components that would be hidden when a dialog is shown.
     */
});