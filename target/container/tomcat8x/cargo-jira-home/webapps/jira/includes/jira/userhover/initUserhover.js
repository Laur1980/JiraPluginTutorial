require(['jquery', 'jira/userhover/userhover'], function (jQuery, userhover) {
    'use strict';

    jQuery(document).delegate(".user-hover[rel]", {
        "mousemove": function mousemove() {
            userhover.show(this);
        },
        "mouseleave": function mouseleave() {
            userhover.hide(this);
        },
        "click": function click() {
            userhover.hide(this, -1);
        }
    });
});