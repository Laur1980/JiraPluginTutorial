define('jira/ajs/select/security/select-adapter', ['jira/lib/class'], function (Class) {
    'use strict';

    /**
     *
     * @class SecuritySelectAdapter
     * @extends Class
     * @private
     */

    return Class.extend({

        /** @type {SelectModel} */_selectedModel: null,

        /**
         *
         * @param {SelectModel} selectModel
         */
        init: function init(selectModel) {
            this._selectModel = selectModel;
        },

        /**
         *
         * @param {String} level
         * @returns {boolean}
         */
        hasSecurityLevel: function hasSecurityLevel(level) {
            return this._selectModel.hasOptionByValue(level);
        },

        /**
         *
         * @param {String} text
         */
        selectUnavailble: function selectUnavailble(text) {
            this._selectModel.putOption('none', text, true);
            this._selectModel.changeSelectionByValue('none');
        },

        /**
         *
         * @param {String} level
         */
        selectLevel: function selectLevel(level) {
            this._selectModel.changeSelectionByValue(level);
        },

        /**
         *
         * @returns {String}
         */
        repickSelection: function repickSelection() {
            this._selectModel.changeSelectionByValue(this.getSelectedLevel());
        },

        /**
         *
         * @returns {String}
         */
        getSelectedLevel: function getSelectedLevel() {
            return this._selectModel.getSelectedValues()[0];
        },

        /**
         *
         * @returns {String}
         */
        getSelectedLevelName: function getSelectedLevelName() {
            return this._selectModel.getSelectedTexts()[0];
        }
    });
});