define('jira/field/init-label-pickers', ['jira/field/label-picker-factory', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery'], function (LabelPickerFactory, Events, Types, Reasons, jQuery) {

    var FIELDSET_SELECTOR = "fieldset.labelpicker-params";

    function locateFieldset(parent) {
        var $parent = jQuery(parent);
        var $fieldset;

        if ($parent.is(FIELDSET_SELECTOR)) {
            $fieldset = $parent;
        } else {
            $fieldset = $parent.find(FIELDSET_SELECTOR);
        }

        return $fieldset;
    }

    function findLabelsFieldsetAndConvertToPicker(context, selector) {
        selector = selector || ".aui-field-labelpicker";

        jQuery(selector, context).each(function () {
            var $fieldset = locateFieldset(this);

            if ($fieldset.length > 0) {
                LabelPickerFactory.createPicker($fieldset, context);
            }
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            findLabelsFieldsetAndConvertToPicker(context);
        }
    });
});