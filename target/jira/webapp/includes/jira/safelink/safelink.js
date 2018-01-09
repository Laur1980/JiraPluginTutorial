require(['jquery'], function initSafeLink($) {
    'use strict';

    $(document).on('click', '.clickonce', function (e) {
        var link = e.target;
        if (link.clicked) {
            e.preventDefault();
        } else {
            link.clicked = true;
        }
    });
});