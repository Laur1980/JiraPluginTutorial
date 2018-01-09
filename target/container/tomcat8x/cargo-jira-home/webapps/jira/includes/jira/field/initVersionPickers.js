define('jira/field/init-version-pickers', ['jira/field/version-picker', 'jira/util/formatter', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery'], function (VersionPicker, formatter, Events, Types, Reasons, jQuery) {

    function createPicker($selectField) {
        new VersionPicker({
            element: $selectField,
            itemAttrDisplayed: "label",
            removeOnUnSelect: false,
            submitInputVal: true,
            errorMessage: formatter.I18n.getText("jira.ajax.autocomplete.versions.error"),
            maxInlineResultsDisplayed: 15,
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

    function findVersionSelectAndConvertToPicker(context, selector) {
        selector = selector || ".aui-field-versionspicker.frother-control-renderer";
        jQuery(selector, context).each(function () {
            var $selectField = locateSelect(this);
            if ($selectField.length) {
                createPicker($selectField);
            }
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            findVersionSelectAndConvertToPicker(context);
        }
    });
});