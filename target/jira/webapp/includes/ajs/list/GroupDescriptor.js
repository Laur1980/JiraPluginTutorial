define('jira/ajs/list/group-descriptor', ['jira/ajs/descriptor', 'jira/ajs/list/item-descriptor'], function (Descriptor, ItemDescriptor) {
    /**
     * The group descriptor is used in {@link QueryableDropdownSelect} to define characteristics and display
     * of groups of items added to suggestions dropdown and in the case of {@link QueryableDropdownSelect} and
     * {@link SelectModel} also.
     *
     * @class GroupDescriptor
     * @extends Descriptor
     */
    return Descriptor.extend({

        /**
         * Defines default properties
         *
         * @return {Object}
         */
        _getDefaultOptions: function _getDefaultOptions() {
            return {
                showLabel: true,
                label: "",
                items: []
            };
        },

        placement: function placement() {
            return this.properties.placement;
        },

        /**
         * Gets styleClass, in the case of {@link QueryableDropdownSelect} these are the classNames that will be applied to the
         * &lt;div&gt; surrounding a group of suggestions.
         *
         * @return {String}
         */
        styleClass: function styleClass() {
            return this.properties.styleClass;
        },

        /**
         * Gets weight, in the case of {@link QueryableDropdownSelect} this defines the order in which the group is appended in
         * the &lt;optgroup&gt; and as a result displayed in the suggestions.
         *
         * @return {Number}
         */
        weight: function weight() {
            return this.properties.weight;
        },

        /**
         * Gets label, in the case of {@link QueryableDropdownSelect} this is the heading that is displayed in the suggestions
         *
         * @return {String}
         */
        label: function label() {
            return this.properties.label;
        },

        /**
         * Unselectable Li appended to bottom of list
         * @return {String}
         */
        footerText: function footerText(_footerText) {
            if (_footerText) {
                this.properties.footerText = _footerText;
            } else {
                return this.properties.footerText;
            }
        },

        /**
         * Unselectable Li appended to bottom of list
         * @return {String}
         */
        footerHtml: function footerHtml(_footerHtml) {
            if (_footerHtml) {
                this.properties.footerHtml = _footerHtml;
            } else {
                return this.properties.footerHtml;
            }
        },

        /**
         * Prepended to group list; used for "Clear All" link
         * @param {string=} actionBarHtml
         * @return {string}
         */
        actionBarHtml: function actionBarHtml(_actionBarHtml) {
            if (_actionBarHtml) {
                this.properties.actionBarHtml = _actionBarHtml;
            }
            return this.properties.actionBarHtml;
        },

        /**
         * Determines if the label should be shown or not, in the case of {@link QueryableDropdownSelect} this is used when we have
         * a suggestion that mirrors that of the user input. It sits in a seperate group but we do not want a heading for it.
         *
         * @return {Boolean}
         */
        showLabel: function showLabel() {
            return this.properties.showLabel;
        },

        /**
         * Gets items, in the case of {@link QueryableDropdownSelect} and subclasses these are instances of {@link ItemDescriptor}.
         * These items are used to describe the elements built as &lt;option&gt;'s in {@link SelectModel} and suggestion
         * items built in {@link List}
         *
         * @return {ItemDescriptor[]}
         */
        items: function items(_items) {
            if (_items) {
                this.properties.items = _items;
                return this;
            } else {
                return this.properties.items;
            }
        },

        /**
         * Adds item to the items array.
         *
         * @param {ItemDescriptor} item
         */
        addItem: function addItem(item) {
            this.properties.items.push(item);
            return this;
        },

        /**
         * @return a unique id
         */
        id: function id() {
            return this.properties.id;
        },

        /**
         * Sets model, in the
         *
         * @param {jQuery} $model
         */
        setModel: function setModel($model) {
            this.properties.model = $model;
        },

        replace: function replace() {
            return this.properties.replace;
        },

        /**
         * Defines a scope within which items in this Group must be unique; allowed values are:
         *
         * - 'group':     (default) the item must be unique in this group
         * - 'container': the item must be unique in this Group *and* its container
         * - 'none':      the item does not need to be unique.
         *
         * The setting here may be overridden by the {@link ItemDescriptor#allowDuplicate} property.
         */
        uniqueItemScope: function uniqueItemScope() {
            return this.properties.uniqueItemScope;
        },

        description: function description() {
            return this.properties.description;
        },

        /**
         * Gets or sets model, in the case of {@link SelectModel} gets jQuery wrapped &lt;optgroup&gt; element
         *
         * @return {jQuery}
         */
        model: function model($model) {
            if ($model) {
                this.properties.model = $model;
            } else {
                return this.properties.model;
            }
        }
    });
});

AJS.namespace('AJS.GroupDescriptor', null, require('jira/ajs/list/group-descriptor'));