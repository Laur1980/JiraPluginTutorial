define('jira/field/init-legacy-group-pickers', ['jquery', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events'], function (jQuery, Reasons, Types, Events) {

    /**
     * USE initMultiGroupPicker instead.
     *
     * @deprecated
     * @param el
     */
    function initLegacyGroupPicker(el) {
        jQuery(el || document.body).find('div.aui-field-grouppicker').add('tr.aui-field-grouppicker').add('td.aui-field-grouppicker').each(function () {
            var $container = jQuery(this);
            var trigger = $container.find('a.grouppicker-trigger');
            var url = trigger.attr('href');

            function openGroupPickerWindow(e) {
                e.preventDefault();
                window.open(url, 'GroupPicker', 'status=yes,resizable=yes,top=100,left=100,width=800,height=750,scrollbars=yes');
            }

            trigger.click(openGroupPickerWindow);
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initLegacyGroupPicker(context);
        }
    });
});