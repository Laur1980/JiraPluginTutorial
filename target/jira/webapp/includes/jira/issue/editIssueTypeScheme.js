/**
 * JIRA.Issue.editIssueTypeScheme
 * @author Scott Harwood
 *
 * Functionality for Issue Types Scheme page
 * - handles drag and drop sortable
 * - serialising form action
 */
require(['jira/analytics', 'jira/dialog/form-dialog', 'aui/params', 'underscore', 'jquery'], function (analytics, FormDialog, params, _, jQuery) {
    'use strict';

    var PARAMS = [{ selector: "#issue-type-scheme-name", name: "schemeName" }, { selector: "#issue-type-scheme-description", name: "schemeDescription" }, { selector: "input[name='fieldId']", name: "fieldId" }, { selector: "input[name='schemeId']", name: "schemeId" }, { selector: "input[name='projectId']", name: "projectId" }, { selector: "#default-issue-type-select", name: "defaultOption" }];

    var isEditMode = undefined;

    /**
     * Serialises selected issue types and their order into a valid POST string
     * @private
     * @returns {String}
     */
    var getSelectedOptions = function getSelectedOptions() {
        var s = jQuery("#selectedOptions").sortable("serialize", { key: "selectedOptions" });
        if (s === '') {
            return 'selectedOptions=';
        } else {
            return s;
        }
    };

    /**
     * Sets form action to include serialised selected issue types
     * @private
     * @returns {Boolean} lets form continue with submission
     */
    var submitForm = function submitForm(eButton) {
        eButton.form.action = 'ConfigureOptionSchemes.jspa?' + getSelectedOptions();
        return true;
    };

    /**
     * Sets the URL on the add issue type link.
     */
    var updateAddIssueTypeUrl = function updateAddIssueTypeUrl() {
        var s = 'AddNewIssueTypeToScheme!input.jspa?' + getSelectedOptions();

        var values = {};
        for (var i = 0; i < PARAMS.length; i++) {
            var $el = jQuery(PARAMS[i].selector);
            values[PARAMS[i].name] = $el.val();
        }

        s = s + "&" + jQuery.param(values);
        jQuery("#add-new-issue-type-to-scheme").attr("href", s);
    };

    /**
     * Updates default issue type select box options
     * @private
     */
    var restrictOptions = function restrictOptions() {

        var queryString = getSelectedOptions().replace(/selectedOptions=/g, "");
        var selectedOptions = queryString.split('&');
        var sel2 = document.getElementById("default-issue-type-select");

        jQuery.each(sel2.options, function (i, opt) {

            if (opt.value === "" || jQuery.inArray(opt.value, selectedOptions) > -1) {
                jQuery(opt).css({ display: "", color: "#000", textDecoration: "none" }).removeAttr("disabled");
            } else {

                if (opt.selected) {
                    opt.selected = false;
                    sel2.options[0].selected = true;
                }

                jQuery(opt).css({ display: "none", color: "#ffcccc", textDecoration: "line-through" }).attr("disabled", "disabled");
            }
        });
        updateAddIssueTypeUrl();
    };

    /**
     * Will move all list nodes from one list to another
     * @private
     * @param {String} fromList - id of list to move all child list nodes from
     * @param {String} toList - id of list to move all child list nodes to
     */
    var moveAll = function moveAll(fromList, toList) {
        jQuery("#" + fromList).find("li").appendTo(document.getElementById(toList));
        restrictOptions();
    };

    var sendAnalyticsEvent = function sendAnalyticsEvent(name) {
        if (_.isUndefined(isEditMode)) {
            isEditMode = jQuery("input[name=schemeId]").val();
            if (!isEditMode) {
                isEditMode = false;
            }
        }
        // Only fire analytics if we're editing an Issue Type Scheme
        if (isEditMode) {
            analytics.send({
                name: "administration.issuetypeschemes.issuetype." + name + ".global"
            });
        }
    };

    function editIssueTypeScheme() {

        // add handler to remove all buttons
        jQuery("#selectedOptionsRemoveAll").click(function (e) {
            moveAll("selectedOptions", "availableOptions");
            // don't follow link
            e.preventDefault();
        });

        // add handler to add all buttons
        jQuery("#selectedOptionsAddAll").click(function (e) {
            moveAll("availableOptions", "selectedOptions");
            e.preventDefault();
        });

        // add sortable behaviour
        jQuery("#selectedOptions").sortable({
            opacity: 0.7,
            // allow dragging between ul#availableOptions also
            connectWith: [document.getElementById("availableOptions")],
            update: function update(event, ui) {
                if (!ui.sender && ui.item.parent()[0].id !== "availableOptions") {
                    sendAnalyticsEvent("reordered");
                }
            },
            receive: function receive() {
                sendAnalyticsEvent("added");
            },
            remove: function remove() {
                sendAnalyticsEvent("removed");
            }
        });

        // add sortable behaviour
        if (params.allowEditOptions) {
            jQuery("#availableOptions").sortable({
                update: restrictOptions,
                opacity: 0.7,
                // allow dragging between ul#selectedOptions also
                connectWith: [document.getElementById("selectedOptions")]
            });
        }

        jQuery("#submitSave").click(function () {
            submitForm(this);
        });

        jQuery("#submitReset").click(function (e) {
            if (params.resetUrl) {
                jQuery(this).removeDirtyWarning();
                window.location = params.resetUrl;
            }
            e.preventDefault();
        });

        jQuery("#issue-type-scheme-name, #issue-type-scheme-description, #default-issue-type-select").change(updateAddIssueTypeUrl);

        new FormDialog({
            trigger: "#add-new-issue-type-to-scheme",
            id: "add-new-issue-type-to-scheme-dialog",
            ajaxOptions: {
                data: {
                    decorator: "dialog",
                    inline: "true"
                }
            },
            onSuccessfulSubmit: function onSuccessfulSubmit(data) {
                var $template = jQuery("<div>").html(data).find("#add-issue-type-template");
                $template.find("li").appendTo("#selectedOptions");

                var $newSelect = $template.find("select");
                if ($newSelect.length > 0) {
                    jQuery("#default-issue-type-select").unbind().replaceWith($newSelect);
                    $newSelect.attr("id", "default-issue-type-select").change(updateAddIssueTypeUrl);
                }

                restrictOptions();

                analytics.send({
                    name: "administration.issuetypeschemes.issuetype.created.global"
                });
            },
            onDialogFinished: function onDialogFinished() {
                this.hide();
            }
        });

        restrictOptions();
    }

    // initialise onload to be sure that all html nodes are available
    jQuery(editIssueTypeScheme);
});