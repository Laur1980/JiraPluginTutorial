define('jira/field/component-picker', ['jira/util/formatter', 'jira/util/events', 'jira/ajs/select/suggestions/only-new-items-suggest-handler', 'jira/ajs/select/multi-select', 'underscore', 'jquery'], function (formatter, Events, OnlyNewItemsSuggestHandler, MultiSelect, _, jQuery) {

    return MultiSelect.extend({

        init: function init(options) {
            this._super(options);
            this.suggestionsHandler = new OnlyNewItemsSuggestHandler(this.options, this.model);
        },

        _getDefaultOptions: function _getDefaultOptions(opts) {
            var canCreate = false;
            if (opts && opts.element) {
                canCreate = jQuery(opts.element).data("create-permission");
            }
            if (canCreate) {
                return jQuery.extend(true, this._super(), {
                    userEnteredOptionsMsg: formatter.I18n.getText("common.concepts.new.component")
                });
            } else {
                return this._super(opts);
            }
        },

        _selectionHandler: function _selectionHandler(selected, e) {
            var allExistingDescriptors = this.model.getDisplayableSelectedDescriptors().concat(this.model.getDisplayableUnSelectedDescriptors());
            var selectedDescriptor = selected.data("descriptor");
            var existingDescriptor = _.find(allExistingDescriptors, function (descriptor) {
                return descriptor.label() === selectedDescriptor.label();
            });
            if (!existingDescriptor) {
                selectedDescriptor.properties.value = "nv_" + selectedDescriptor.value();
                Events.trigger("Issue.Component.new.selected", [selectedDescriptor.value()]);
            }
            this._super(selected, e);
        }
    });
});

AJS.namespace('JIRA.ComponentPicker', null, require('jira/field/component-picker'));