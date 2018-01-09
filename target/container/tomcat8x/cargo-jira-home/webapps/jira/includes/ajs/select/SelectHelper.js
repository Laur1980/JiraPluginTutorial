define('jira/ajs/select/select-helper', function () {
    'use strict';

    return {
        updateFreeInputVal: function updateFreeInputVal() {
            if (this.options.submitInputVal) {
                this.model.updateFreeInput(this.$field.val());
            }
        },

        removeFreeInputVal: function removeFreeInputVal() {
            if (this.options.submitInputVal) {
                this.model.removeFreeInputVal();
            }
        }
    };
});

AJS.namespace('AJS.SelectHelper', null, require('jira/ajs/select/select-helper'));