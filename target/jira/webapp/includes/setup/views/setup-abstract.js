/**
 * @module jira/setup/setup-abstract-view
 */
define("jira/setup/setup-abstract-view", ["jira/util/key-code", "marionette", "jquery", "underscore"], function (keyCodes, Marionette, $, _) {

    var choiceBoxClass = ".jira-setup-choice-box";

    var ui = {
        choiceBox: choiceBoxClass,
        choiceValueField: "#jira-setup-choice-value",
        form: ".jira-setup-form",
        submitButton: ".jira-setup-form-submit"
    };

    var events = {
        "click @ui.choiceBox": "onChoiceBoxClick",
        "submit @ui.form": "onSubmit",
        "keydown @ui.choiceBox": "onChoiceBoxKeyDown"
    };

    /**
     * @class
     * @abstract
     * @extends Backbone.Marionette.Layout
     * @alias module:jira/setup/setup-abstract-view
     */
    return Marionette.Layout.extend({
        choiceActiveClassname: "jira-setup-choice-box-active",

        constructor: function constructor(attributes, options) {
            var initialize = this.initialize;

            this.ui = _.extend({}, this.ui, ui);
            this.events = _.extend({}, this.events, events);

            if (typeof initialize === "function") {
                this.initialize = function () {
                    this.bindUIElements();
                    this.delegateEvents();

                    this._pageData = this._readPageDataFromStorage();

                    // use default value if given, if not make the first choice default one
                    if (this.ui.choiceBox.length) {
                        var defaultValue = this.ui.choiceValueField.val();

                        if (defaultValue) {
                            this.selectChoiceBox(defaultValue);
                        } else {
                            this.selectFirstChoiceBox();
                        }
                    }
                    initialize.apply(this, arguments);
                };
            }

            Marionette.ItemView.apply(this, arguments);
        },

        selectChoiceBox: function selectChoiceBox(choiceValue) {
            var $box = this.ui.choiceBox.filter("[data-choice-value='" + choiceValue + "']");

            if ($box.length) {
                this._handleChoiceBoxSelection($box);
            }
        },

        selectFirstChoiceBox: function selectFirstChoiceBox() {
            this._handleChoiceBoxSelection(this.ui.choiceBox.eq(0));
        },

        _handleChoiceBoxSelection: function _handleChoiceBoxSelection($box) {
            var value = $box.data("choice-value");

            this.ui.choiceBox.removeClass(this.choiceActiveClassname);
            this.ui.choiceBox.removeAttr("tabindex");

            $box.addClass(this.choiceActiveClassname);
            // use tabindex dynamically so that only one of the choices can accept focus
            // this way, tab will stop only once in the group.
            $box.attr("tabindex", "0");
            $box.focus();

            this.ui.choiceValueField.val(value);
            this.ui.submitButton.enable();
            this.onChoiceBoxValueChange($box);
        },

        onChoiceBoxClick: function onChoiceBoxClick(e) {
            var $box = $(e.currentTarget);

            this._handleChoiceBoxSelection($box);
        },

        _handleChoiceBoxToggleByKeyboard: function _handleChoiceBoxToggleByKeyboard(e) {
            var $newSelectedElement = $();

            if (e.keyCode === keyCodes.DOWN) {
                //down
                e.preventDefault();
                $newSelectedElement = $(e.target).next(choiceBoxClass);
            } else if (e.keyCode === keyCodes.UP) {
                // up
                e.preventDefault();
                $newSelectedElement = $(e.target).prev(choiceBoxClass);
            }

            if ($newSelectedElement.length == 1) {
                this._handleChoiceBoxSelection($newSelectedElement);
            }
        },

        onChoiceBoxValueChange: function onChoiceBoxValueChange($el) {
            this.updatePageDataKey("choiceBoxValue", $el.data("choice-value"));
        },

        _sendFormByPressingEnterOnChoiceBox: function _sendFormByPressingEnterOnChoiceBox(e) {
            e.preventDefault();
            $(e.target).parent("form").find("input[type=submit]").click();
        },

        onChoiceBoxKeyDown: function onChoiceBoxKeyDown(e) {
            if (e.keyCode === keyCodes.ENTER) {
                // enter was pressed - try to send the form.
                this._sendFormByPressingEnterOnChoiceBox(e);
            } else {
                // something else was pressed - try to change the choicebox option
                this._handleChoiceBoxToggleByKeyboard(e);
            }
        },

        updatePageDataKey: function updatePageDataKey(key, value) {
            this._pageData[key] = value;

            if (this.pageStorageKey) {
                window.sessionStorage.setItem(this.pageStorageKey, JSON.stringify(this._pageData));
            }
        },

        getPageData: function getPageData() {
            return this._pageData;
        },

        getPageDataKey: function getPageDataKey(key) {
            return this._pageData[key];
        },

        _readPageDataFromStorage: function _readPageDataFromStorage() {
            if (this.pageStorageKey) {
                return JSON.parse(window.sessionStorage.getItem(this.pageStorageKey) || "{}");
            }

            return {};
        }
    });
});