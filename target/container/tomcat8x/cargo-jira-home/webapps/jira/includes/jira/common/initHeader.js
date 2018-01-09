(function () {
    var Header = require('jira/common/header');
    var jQuery = require('jquery');

    // On dom ready
    jQuery(function () {
        Header.initialize();
    });
})();