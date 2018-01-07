define('jira/field/init-cascading-selects', ['jquery', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events'], function (jQuery, Reasons, Types, Events) {

    function initCascadingSelect(el) {
        jQuery(el || document.body).find('div.aui-field-cascadingselect').add('tr.aui-field-cascadingselect').add('td.aui-field-cascadingselect').each(function () {
            var $container = jQuery(this);
            var parent = $container.find('.cascadingselect-parent');
            var parentOptions = parent.find('option');
            var oldClass = "";
            var child = $container.find('.cascadingselect-child');
            var childOptions = child.find('option');
            var selectedChild = child.find(':selected');

            function update() {
                var placeholder;
                var currentClass = parent.find('option:selected').attr('class');
                // Compare so we're not redrawing the child dropdown when changing between the options with the class "default-option"
                if (currentClass !== oldClass) {
                    // Hide all the options other than ones relating to the selected parent

                    placeholder = jQuery("<span />").insertAfter(child);
                    child.detach();
                    child.find('option').each(function (i, elem) {
                        elem.parentNode.removeChild(this);
                    });
                    child.insertAfter(placeholder);
                    placeholder.remove();

                    childOptions.filter('.' + parent.find('option:selected').attr('class')).appendTo(child);
                    // Select the option which is to be selected on page load - default to the first one if none specified.
                    if (selectedChild.hasClass(parent.find('option:selected').attr('class'))) {
                        child.val(selectedChild.val());
                    } else {
                        child.val(child.find('option:first').val());
                    }
                    oldClass = currentClass;
                }
            }
            parent.bind('cascadingSelectChanged', update).change(function () {
                jQuery(this).trigger('cascadingSelectChanged');
            }).trigger('cascadingSelectChanged');
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            initCascadingSelect(context);
        }
    });
});