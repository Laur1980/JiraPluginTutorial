define('jira/viewissue/element/image-wrap', ['jira/fileviewer', 'jira/skate', 'jira/featureflags/feature-manager', 'underscore'], function (fileviewer, skate, featureManager, _) {
    if (featureManager.isFeatureEnabled("jira.fileviewer.disabled")) {
        return;
    }

    skate('file-preview-type', {
        type: skate.type.ATTRIBUTE,
        attached: _.debounce(function elementAttachedHandler() {
            fileviewer.attachToElements();
        }, 0),
        detached: function detached() {
            fileviewer.closeViewer();
        }
    });
});