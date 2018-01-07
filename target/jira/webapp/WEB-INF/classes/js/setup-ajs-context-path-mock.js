(function ($) {
    "use strict";

    var contextPath = null;

    $(function () {
        contextPath = $("meta[name='ajs-setup-context-path']").attr("content");
    });

    function getOurContextPath() {
        return contextPath ? contextPath : "";
    }

    // Make our setup code work with the AMD module
    define("wrm/context-path", [], function () {
        return getOurContextPath;
    });

    // Polyfill the global in window, just in case
    window.AJS || (window.AJS = {});
    window.AJS.contextPath = getOurContextPath;
})(window.jQuery);