define('jira/project/edit/change-triggered-flag', ['jira/util/key-code', 'jquery', 'aui/flag'], function (keyCode, $, Flag) {
    /**
     * @typedef {Object} ChangeTriggeredFlagOptions
     *
     * @property {Function} getValue get the current value for the element
     * @property {Function} revert the value back to the original state
     * @property {Function} warningDescription returns the text for the flag
     * @property {Function} cancelMessage returns the text for the cancel button
     * @property {Function} onCancelCallback optional callback to be fired when the change is cancelled by the user
     **/

    /**
     * @class ChangeTriggeredFlag used to show a warning message if a change has been made to a value. This can be
     * reverted by selecting cancel in the field or changing the value back to the original value.
     *
     * @constructs
     *
     * Gets the original value for the field for checking if the flag is needed
     * @param {ChangeTriggeredFlagOptions} options
     */
    var ChangeTriggeredFlag = function ChangeTriggeredFlag(options) {
        this.getValue = options.getValue;
        this.revert = options.revert;
        this.warningDescription = options.warningDescription;
        this.cancelMessage = options.cancelMessage;
        this.onCancelCallback = options.onCancelCallback;

        this.flag = null;
        this.cancelled = false;

        this.originalValue = this.getValue();
        this.Templates = JIRA.Templates.Project.ChangeTriggeredFlag;
    };

    /**
     * Function that can be called when a change has occurred. This will show or hide the flag if needed.
     */
    ChangeTriggeredFlag.prototype.changeOccurred = function () {
        if (this.getValue() !== this._getOriginalValue()) {
            if (this.flag === null && !this.cancelled) {
                this._showFlag();
            }
        } else {
            this._closeFlag();
            this._triggerCancellationCallback();
        }
    };

    /**
     * Get the original value for the field
     * @returns {*}
     */
    ChangeTriggeredFlag.prototype._getOriginalValue = function () {
        return this.originalValue;
    };

    /**
     * Show the flag
     */
    ChangeTriggeredFlag.prototype._showFlag = function () {
        this.flag = Flag({
            type: 'warning',
            title: '',
            body: this.Templates.fieldRevertWarning({
                message: this.warningDescription,
                revertMessage: this.cancelMessage
            })
        });

        $(this.flag).find(".cancel").click(function (event) {
            event.preventDefault();
            this.revert(this._getOriginalValue());
        }.bind(this));

        $(this.flag).find(".aui-icon.icon-close").click(function () {
            this.cancelled = true;
            this.flag = null;
        }.bind(this));

        $(this.flag).find(".aui-icon.icon-close").keypress(function (e) {
            if (e.which === keyCode.ENTER || e.which === keyCode.SPACE) {
                this.cancelled = true;
                this.flag = null;
            }
        }.bind(this));
    };

    /**
     * Close the flag
     */
    ChangeTriggeredFlag.prototype._closeFlag = function () {
        if (this.flag) {
            this.flag.close();
            this.flag = null;
        }
    };

    /**
     * Fires the analytics event when a user cancels the change action
     */
    ChangeTriggeredFlag.prototype._triggerCancellationCallback = function () {
        if (this.onCancelCallback) {
            this.onCancelCallback();
        }
    };

    /**
     * Used to do any clean up steps, e.g. the form element is being removed and we do not need this flag anymore.
     * We don't want the flag persisting after it is not needed.
     */
    ChangeTriggeredFlag.prototype.cleanup = function () {
        this._closeFlag();
    };

    return ChangeTriggeredFlag;
});