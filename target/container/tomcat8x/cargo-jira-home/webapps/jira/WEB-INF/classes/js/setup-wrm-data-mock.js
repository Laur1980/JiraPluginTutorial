(function (globalWRM) {
    "use strict";

    var WRM = window.WRM = globalWRM || {};
    WRM.data = WRM.data || {};
    WRM.data.claim = WRM.data.claim || function () {};

    define("wrm/data", [], function () {
        return WRM.data;
    });
})(window.WRM);