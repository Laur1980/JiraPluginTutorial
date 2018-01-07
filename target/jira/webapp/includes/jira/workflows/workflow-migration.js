require(['jquery'], function (jQuery) {
    jQuery(document).on('click', '.workflow-mapping-issue-type', function () {
        jQuery(this).toggleClass("collapsed");
    });
});