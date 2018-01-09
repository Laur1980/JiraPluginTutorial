require(['jira/analytics/analytics'], function (analytics) {
    AJS.toInit(function () {
        analytics.bindEvents();
    });
});