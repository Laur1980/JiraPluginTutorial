(function () {
    'use strict';

    var jQuery = require('jquery');
    var parseOptionsFromFieldset = require('jira/data/parse-options-from-fieldset');
    var Events = require('jira/util/events');
    var Reasons = require('jira/util/events/reasons');
    var Types = require('jira/util/events/types');
    var IssueAutoComplete = require('jira/autocomplete/issue-autocomplete');
    var UserAutoComplete = require('jira/autocomplete/user-autocomplete');
    var wrmContextPath = require('wrm/context-path');
    var contextPath = wrmContextPath();

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            UserAutoComplete.init(context);
            IssueAutoComplete.init(context);
        }
    });

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            jQuery("fieldset.user-searcher-params", context).each(function () {
                var params = parseOptionsFromFieldset(jQuery(this));
                var $container = jQuery("#" + params.fieldId + "_container", context);

                if (params.userPickerEnabled === true) {
                    var autocompleter = UserAutoComplete({
                        fieldID: params.fieldId,
                        delimChar: params.multiSelect === true ? "," : undefined,
                        ajaxData: {
                            fieldName: params.fieldName
                        }
                    });
                }

                var setupFields = function setupFields(related) {
                    var field = jQuery("#" + params.fieldId, context);
                    var userImage = jQuery("#" + params.fieldId + "Image", context);
                    var groupImage = jQuery("#" + params.fieldId + "GroupImage", context);
                    var fieldDesc = jQuery("#" + params.fieldId + "_desc", context);
                    if (related === "select.list.none") {
                        field.val("").attr("disabled", "true");
                        userImage.hide();
                        groupImage.hide();
                        fieldDesc.hide();
                    } else {
                        field.removeAttr("disabled");
                        if (related === "select.list.group") {
                            userImage.hide();
                            groupImage.show();
                            if (params.userPickerEnabled === true) {
                                autocompleter.disable();
                                fieldDesc.hide();
                            }
                        } else {
                            userImage.show();
                            groupImage.hide();
                            if (params.userPickerEnabled === true) {
                                autocompleter.enable();
                                fieldDesc.show();
                            }
                        }
                    }
                };

                jQuery("#" + params.userSelect, context).change(function () {
                    var related = jQuery(this).find("option:selected").attr("rel");
                    setupFields(related);
                }).find("option:selected").each(function () {
                    setupFields(jQuery(this).attr("rel"));
                });

                $container.find("a.user-popup-trigger").click(function (e) {
                    var url = contextPath + '/secure/popups/UserPickerBrowser.jspa?';
                    url += 'formName=' + params.formName + '&';
                    url += 'multiSelect=' + params.multiSelect + '&';
                    url += 'decorator=popup&';
                    url += 'element=' + params.fieldId;

                    var vWinUsers = window.open(url, 'UserPicker', 'status=yes,resizable=yes,top=100,left=100,width=800,height=750,scrollbars=yes');
                    vWinUsers.opener = self;
                    vWinUsers.focus();
                    e.preventDefault();
                });

                $container.find("a.group-popup-trigger").click(function (e) {
                    var url = contextPath + '/secure/popups/GroupPickerBrowser.jspa?';
                    url += 'formName=' + params.formName + '&';
                    url += 'multiSelect=' + params.multiSelect + '&';
                    url += 'decorator=popup&';
                    url += 'element=' + params.fieldId;

                    var vWinUsers = window.open(url, 'GroupPicker', 'status=yes,resizable=yes,top=100,left=100,width=800,height=750,scrollbars=yes');
                    vWinUsers.opener = self;
                    vWinUsers.focus();
                    e.preventDefault();
                });
            });
        }
    });
})();