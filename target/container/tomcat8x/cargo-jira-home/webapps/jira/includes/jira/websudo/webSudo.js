require(['jira/util/browser', 'wrm/context-path', 'jquery'], function (Browser, wrmContextPath, $) {
    'use strict';

    var contextPath = wrmContextPath();

    function dropWebSudo(successCallback) {
        $.ajax({
            type: "DELETE",
            url: contextPath + "/rest/auth/1/websudo",
            contentType: "application/json",
            success: successCallback
        });
    }

    $(document).on("click", "#websudo-drop-from-protected-page", function (event) {
        dropWebSudo(function () {
            Browser.reloadViaWindowLocation(contextPath + "/secure/MyJiraHome.jspa");
        });
        event.preventDefault();
    });

    $(document).on("click", "#websudo-drop-from-normal-page", function (event) {
        var banner = $("#websudo-banner");
        dropWebSudo(function () {
            banner.slideUp(function () {
                banner.trigger('aui-message-close');
            });
            banner.addClass("dropped");
        });
        event.preventDefault();
    });
});