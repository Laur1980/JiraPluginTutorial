define('jira/admin/init/admin', ['jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery'], function (Events, Types, Reasons, $) {
    "use strict";

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            context.find('.jira-iconpicker-trigger').click(function (e) {
                e.preventDefault();
                var $this = $(this);
                var url = $this.attr('href');
                var $iconPickerTarget = $this.prev('input.text');
                if ($iconPickerTarget.length) {
                    var popup = window.open(url, 'IconPicker', 'status=no,resizable=yes,top=100,left=200,width=580,height=650,scrollbars=yes');
                    popup.focus();
                }
            });
        }
    });

    $(function () {
        // Ensure hitting Enter when focused in one of the <select> elements does the correct action.
        // Need to add hidden fields because when in a dialog the buttons are disabled and the Action is using them
        var submitForOperation = function submitForOperation($form, action) {
            $('<input type="hidden" />').attr({ name: action, value: action }).appendTo($form);
            //Passing extra parameter to mark that we already added action name
            $form.trigger('submit', { operationNameSet: true });
        };

        var setOperationName = function setOperationName(e) {
            var $trigger = $(e.target);
            var $form = $trigger.closest("form");
            var action = "";
            if ($trigger.attr('name').toLowerCase().indexOf('join') > -1) {
                action = "join";
            } else {
                action = "leave";
            }
            submitForOperation($form, action);
        };
        $(document.body).on('keypress', "#userGroupPicker select", function (e) {
            if (e.which === 13) {
                setOperationName.apply(this, arguments);
            }
        }).on('click', "#userGroupPicker .aui-button", function (event) {
            event.preventDefault();
            setOperationName.apply(this, arguments);
        }).on('submit', '#user-edit-groups', function (event, extraParameters) {
            //we catch all submit operations and add action name when it has been added yet
            var operationSet = extraParameters && extraParameters.operationNameSet;
            if (!operationSet) {
                //it is coming from MultiSelect, because we have covered other submit methods
                var $form = $(event.target);
                event.preventDefault();
                submitForOperation($form, 'join');
            }
        });
    });
});