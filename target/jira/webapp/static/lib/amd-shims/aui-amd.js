define('aui/dialog', function() { return AJS.Dialog; });
define('aui/dropdown', function() { return AJS.dropDown; });
define('aui/message', function() { return AJS.messages; });
define('aui/params', function() { return AJS.params; });
define('aui/progressive-data-set', function() { return AJS.ProgressiveDataSet; });
define('aui/popup', function() { return AJS.popup; });
define('aui/tabs', function() { return AJS.tabs; });

define('aui/inline-dialog', ['jira/ajs/layer/layer-interactions'], function(interactions) {
    'use strict';
    interactions.preventDialogHide(AJS.InlineDialog);
    interactions.hideBeforeDialogShown(AJS.InlineDialog);
    return AJS.InlineDialog;
});
