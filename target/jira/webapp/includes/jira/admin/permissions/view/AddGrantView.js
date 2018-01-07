define('jira/project/permissions/addgrantview', ['jira/util/formatter', 'jira/field/user-picker-util', 'jira/field/group-picker-util', 'jira/ajs/list/item-descriptor', 'backbone', 'underscore', 'jquery', 'jira/ajs/select/single-select', 'jira/project/permissions/securitytypes', 'jira/field/role-picker-util', 'wrm/context-path'], function (formatter, UserPickerUtil, GroupPickerUtil, ItemDescriptor, Backbone, _, $, SingleSelect, SecurityTypes, rolepicker, wrmContextPath) {
    "use strict";

    require("aui/inline-dialog2"); //Necessary to get the inline dialog to show.

    return Backbone.View.extend({
        tagName: "div",
        className: "radio",
        template: JIRA.Templates.AddProjectPermission.renderSecurityTypeItem,

        events: {
            "click .security-type-item-radio-btn": "handleSelect"
        },

        initialize: function initialize() {
            this.listenTo(this.model, "change:selected", this.toggleSecurityType);
        },

        render: function render() {
            if (SecurityTypes.isCustomFieldType(this.model.get("securityType")) && this.model.get("values").length === 0) {
                this.$el.hide();
                return this;
            }

            this.$el.append(this.template(this.model.toJSON()));
            if (!this.model.get("primary")) {
                this.$el.addClass("secondary");
            }

            var renderInput = this.renderInput();
            if (typeof renderInput !== 'undefined') {
                if (typeof renderInput.$container !== 'undefined') {
                    this.inputView = renderInput.$container;
                } else {
                    this.inputView = renderInput;
                }
                this.$el.find('.single-select-parent').append(this.inputView);
            }
            return this;
        },

        handleParamSelect: function handleParamSelect(e) {
            var value = $(e.target).val();
            this.model.set("securityTypeParamVal", value);
        },

        /*
            Generates and input view for the given security type.
            If the security type does not require and input type undefined will get returned.
         */
        renderInput: function renderInput() {
            var renderedItem;
            switch (this.model.get("securityType")) {
                case SecurityTypes.USER_CF:
                case SecurityTypes.GROUP_CF:
                case SecurityTypes.PROJECT_ROLE:
                    var groupSelectTemplate = JIRA.Templates.AddProjectPermission.renderSelect({
                        id: this.model.get("securityType"),
                        data: this.model.get("values")
                    });

                    var singleSelect = new SingleSelect({
                        element: $(groupSelectTemplate),
                        revertOnInvalid: true,
                        itemAttrDisplayed: "label"
                    });
                    singleSelect.model.$element.bind("selected", _.bind(this.handleParamSelect, this));
                    this.model.set("securityTypeParamVal", singleSelect.model.$element.val());

                    singleSelect.$container.hide();
                    renderedItem = singleSelect;
                    break;
                case SecurityTypes.APPLICATION_ROLE:
                    var appRoleSelectTemplate = JIRA.Templates.AddProjectPermission.renderSelect({
                        id: this.model.get("securityType"),
                        data: this.model.get("values"),
                        emptyValue: formatter.I18n.getText('admin.permission.types.application.role.any')
                    });

                    var appRoleSelect = new SingleSelect({
                        element: $(appRoleSelectTemplate),
                        itemAttrDisplayed: "label",
                        showDropdownButton: true,
                        revertOnInvalid: true,
                        ajaxOptions: {
                            data: function data(query) {
                                return {
                                    query: query
                                };
                            },
                            query: true,
                            formatResponse: function formatResponse(data) {
                                var formattedData = rolepicker.formatResponse(data);
                                formattedData.unshift(new ItemDescriptor({
                                    value: '',
                                    label: formatter.I18n.getText('admin.permission.types.application.role.any'),
                                    highlighted: true
                                }));
                                return formattedData;
                            }
                        }
                    });
                    appRoleSelect.model.$element.bind("selected", _.bind(this.handleParamSelect, this));
                    this.model.set("securityTypeParamVal", appRoleSelect.model.$element.val());

                    appRoleSelect.$container.hide();
                    renderedItem = appRoleSelect;
                    break;
                case SecurityTypes.GROUP:
                    var groupSelectTemplate = JIRA.Templates.AddProjectPermission.renderSelect({
                        id: this.model.get("securityType"),
                        emptyValue: formatter.I18n.getText('admin.common.words.anyone')
                    });

                    var groupSelect = new SingleSelect({
                        element: $(groupSelectTemplate),
                        itemAttrDisplayed: "label",
                        showDropdownButton: true,
                        revertOnInvalid: true,
                        ajaxOptions: {
                            data: function data(query) {
                                return {
                                    query: query
                                };
                            },
                            url: wrmContextPath() + "/rest/api/2/groups/picker",
                            query: true,
                            formatResponse: function formatResponse(data) {
                                var formattedData = GroupPickerUtil.formatResponse(data);
                                formattedData.unshift(new ItemDescriptor({
                                    value: '',
                                    label: formatter.I18n.getText('admin.common.words.anyone'),
                                    highlighted: true
                                }));
                                return formattedData;
                            }
                        }
                    });
                    groupSelect.model.$element.bind("selected", _.bind(this.handleParamSelect, this));
                    this.model.set("securityTypeParamVal", groupSelect.model.$element.val());

                    groupSelect.$container.hide();
                    renderedItem = groupSelect;
                    break;
                case SecurityTypes.SINGLE_USER:
                    var templateInput;
                    var selectElement;

                    var help = this.model.get("help");

                    if (help) {
                        templateInput = $(JIRA.Templates.AddProjectPermission.renderSelectWithInfo({
                            id: this.model.get("securityType"),
                            infoText: help.infoText,
                            helpText: help.helpText,
                            helpUrl: help.helpUrl
                        }));
                        selectElement = templateInput.find("select");
                    } else {
                        templateInput = $(JIRA.Templates.AddProjectPermission.renderSelect({
                            id: this.model.get("securityType")
                        }));
                        selectElement = templateInput;
                    }

                    var userSelect = new SingleSelect({
                        element: selectElement,
                        submitInputVal: true,
                        errorMessage: formatter.I18n.getText("user.picker.invalid.user", "'{0}'"),
                        revertOnInvalid: true,
                        ajaxOptions: {
                            url: wrmContextPath() + "/rest/api/latest/user/picker",
                            query: true, // keep going back to the sever for each keystroke
                            data: {
                                showAvatar: true
                            },
                            formatResponse: UserPickerUtil.formatResponse
                        }
                    });
                    userSelect.model.$element.bind("selected", _.bind(this.handleParamSelect, this));
                    this.model.set("securityTypeParamVal", userSelect.model.$element.val());

                    if (help) {
                        renderedItem = templateInput;
                        renderedItem.hide();
                    } else {
                        renderedItem = userSelect;
                        renderedItem.$container.hide();
                    }
            }
            return renderedItem;
        },

        handleSelect: function handleSelect(e) {
            this.model.set("selected", true);
        },

        toggleSecurityType: function toggleSecurityType() {
            if (this.inputView) {
                this.model.get("selected") ? this.inputView.show() : this.inputView.hide();
            }
        }
    });
});

define('jira/project/permissions/addgrantcollectionview', ['backbone', 'underscore', 'jira/project/permissions/addgrantview'], function (Backbone, _, AddGrantView) {
    "use strict";

    return Backbone.View.extend({
        tagName: "fieldset",
        className: "group security-type-list-content",
        initialize: function initialize() {
            var self = this;
            this._addGrantViews = [];
            this.collection.each(function (grantModel) {
                self._addGrantViews.push(new AddGrantView({
                    model: grantModel
                }));
            });

            this.listenTo(this.collection, "change:selected", this.handleSelect);
        },
        render: function render() {
            var self = this;
            this.$el.append(JIRA.Templates.AddProjectPermission.grantLegend());
            _.each(this._addGrantViews, function (addGrantView) {
                self.$el.append(addGrantView.render().$el);
            });
            return this;
        },

        isSelectedVisible: function isSelectedVisible() {
            return this.$el.find('.radio > input[type=radio]:checked').is(':visible');
        },
        handleSelect: function handleSelect(model, selected) {
            if (selected) {
                this.collection.each(function (grantModel) {
                    if (model !== grantModel) {
                        grantModel.set("selected", false);
                    }
                });
            }
        }
    });
});