require(['jquery', 'underscore', 'aui/restful-table', 'wrm/context-path', 'jira/util/formatter', 'jira/ajs/ajax/ajax-util', 'jira/ajs/ajax/smart-ajax', 'jira/dialog/error-dialog', 'jira/workflows/workflow-transition-properties'], function (jQuery, _, RestfulTable, wrmContextPath, formatter, AjaxUtil, SmartAjax, ErrorDialog, WorkflowTransitionProperties) {
    'use strict';

    jQuery(function () {
        var transitionPropertiesResource = wrmContextPath() + "/rest/api/2/workflow/transitions/";
        var propertyTable = jQuery("#workflow-transition-properties-table");
        var workflowTransition = propertyTable.attr('data-workflowTransition');
        var workflowNameEncoded = encodeURIComponent(propertyTable.attr('data-workflowName'));
        var workflowModeEncoded = encodeURIComponent(propertyTable.attr('data-workflowMode'));
        var keyHeaderText = propertyTable.attr('data-key-header');
        var valueHeaderText = propertyTable.attr('data-value-header');
        var isEditable = propertyTable.attr('data-workflow-editable') === "true";

        var safeTrim = function safeTrim(obj) {
            return _.isString(obj) ? jQuery.trim(obj) : obj;
        };

        var TransitionPropertyModel = RestfulTable.EntryModel.extend({
            //Overwrite so we can use OUR URL which is not RESTFul. (i.e. the properties ain't in the URL). We need this
            //in the COTR because restful table calls TransitionPropertyModel.extend({url:...}) when it creates
            //the model for the create row.
            initialize: function initialize() {
                this.url = function () {
                    var key = this.get("key") || "";
                    return transitionPropertiesResource + workflowTransition + "/properties?workflowName=" + workflowNameEncoded + "&workflowMode=" + workflowModeEncoded + "&key=" + key;
                };
                RestfulTable.EntryModel.prototype.initialize.apply(this, arguments);
            },

            destroy: function destroy(options) {
                //This needs to be empty so that params don't get added to the URL in the RESTFul table
                options = _.extend({}, options, {
                    data: {}
                });

                RestfulTable.EntryModel.prototype.destroy.call(this, options);
            },

            changedAttributes: function changedAttributes(newAttributes) {
                var result = {};

                _.each(newAttributes, function (item, key) {
                    item = safeTrim(item);
                    if (this.get(key) !== item) {
                        result[key] = item;
                    }
                }, this);

                return !_.isEmpty(result) ? result : false;
            },

            defaults: {
                value: ""
            }
        });

        new RestfulTable({
            autoFocus: true,
            el: propertyTable,
            resources: {
                all: transitionPropertiesResource + workflowTransition + "/properties?workflowName=" + workflowNameEncoded + "&workflowMode=" + workflowModeEncoded,
                self: transitionPropertiesResource + workflowTransition + "/properties?workflowName=" + workflowNameEncoded + "&workflowMode=" + workflowModeEncoded
            },
            columns: [{
                id: "key",
                header: keyHeaderText,
                styleClass: "workflow-transition-properties-key-col",
                readView: WorkflowTransitionProperties.KeyView,
                createView: WorkflowTransitionProperties.CreateKeyView,
                editView: WorkflowTransitionProperties.EditKeyView,
                allowEdit: false
            }, {
                id: "value",
                header: valueHeaderText,
                styleClass: "workflow-transition-properties-value-col",
                readView: WorkflowTransitionProperties.ValueView
            }],
            model: TransitionPropertyModel,
            allowEdit: isEditable,
            allowCreate: isEditable,
            allowDelete: isEditable,
            reverseOrder: true,
            noEntriesMsg: formatter.I18n.getText("admin.workflowtransition.no.entries.set")
        });

        /**
         * Global error handler because RESTFul table does *NOT* trigger errors for AJAX requests in any way that is
         * useful.
         */
        jQuery(document).ajaxError(function (e, xhr, ajaxOptions) {
            //- 400 errors are handled in the RESTFul table so ignore them.
            //- Only handle errors for our resource (we are listening globally).
            if (xhr.status !== 400 && ajaxOptions.url.indexOf(transitionPropertiesResource) >= 0) {
                if (AjaxUtil.isWebSudoFailure(xhr)) {
                    //We have a websudo error. Pop open the websudo dialog and retry the request.
                    SmartAjax.handleWebSudoError(ajaxOptions);
                } else {
                    ErrorDialog.openErrorDialogForXHR(xhr);
                }
            }
        });
    });
});