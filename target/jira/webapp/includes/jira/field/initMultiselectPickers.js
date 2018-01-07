/*
 Copied over from initComponentPickers.js
 Slightly changed the way the Multiselect component is initialized.
 */

define('jira/field/init-multi-select-pickers', ['jquery', 'jira/ajs/select/multi-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/util/formatter'], function (jQuery, MultiSelect, Reasons, Types, Events, formatter) {

    function createPicker($selectField) {
        new MultiSelect({
            element: $selectField,
            itemAttrDisplayed: "label",
            errorMessage: formatter.I18n.getText("jira.ajax.autocomplete.multiselect.error"),
            maxInlineResultsDisplayed: 15,
            submitInputVal: true,
            expandAllResults: true
        });
    }

    function locateSelect(parent) {
        var $parent = jQuery(parent);
        var $selectField;

        if ($parent.is("select")) {
            $selectField = $parent;
        } else {
            $selectField = $parent.find("select");
        }

        return $selectField;
    }

    var DEFAULT_SELECTORS = ["div.aui-field-multiselectpicker.frother-control-renderer" // aui forms
    ];

    function findComponentSelectAndConvertToPicker(context, selector) {

        selector = selector || DEFAULT_SELECTORS.join(", ");

        jQuery(selector, context).each(function () {

            var $selectField = locateSelect(this);

            if ($selectField.length) {
                createPicker($selectField);
            }
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            findComponentSelectAndConvertToPicker(context);
        }
    });
});