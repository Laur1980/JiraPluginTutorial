define('jira/ajs/layer/hide-reasons', [], function () {
    return {
        clickOutside: "clickOutside",
        toggle: "toggle",
        escPressed: "esc",
        cancelClicked: "cancelClicked",
        submit: "submit",
        tabbedOut: "tabbedOut"
    };
});

AJS.namespace('AJS.HIDE_REASON', null, require('jira/ajs/layer/hide-reasons'));