require(['jquery'], function (jQuery) {
    'use strict';

    jQuery(function () {
        jQuery('#selectedLocale_select').change(function () {
            var myForm = jQuery(this).closest('form');
            myForm.attr('action', 'TranslateCustomField!default.jspa');
            myForm.submit();
            jQuery(':input').enable(false);
        });
    });
});