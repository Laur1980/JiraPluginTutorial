define('jira/field/init-log-work-controls', ['jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery'], function (Events, Types, Reasons, jQuery) {

    function toggleTimeTrackingContainer(context, activate) {
        var $logWorkContainer = jQuery(context).find("#worklog-logworkcontainer");
        var $timeTrackingContainer = jQuery(context).find("#worklog-timetrackingcontainer");
        var $logWorkCheckbox = jQuery(context).find("#log-work-activate");

        if (activate) {
            $logWorkContainer.removeClass("hidden");
            $timeTrackingContainer.addClass("hidden");
            $logWorkCheckbox.prop("checked", true);
        } else {
            $logWorkContainer.addClass("hidden");
            $timeTrackingContainer.removeClass("hidden");
            $logWorkCheckbox.prop("checked", false);
        }
    }

    function applyLogworkControls(context) {

        jQuery('#log-work-adjust-estimate-new-value, #log-work-adjust-estimate-manual-value', context).attr('disabled', 'disabled');

        jQuery('#log-work-adjust-estimate-' + jQuery('input[name=worklog_adjustEstimate]:checked,input[name=adjustEstimate]:checked', context).val() + '-value', context).removeAttr('disabled');
        jQuery('input[name=worklog_adjustEstimate],input[name=adjustEstimate]', context).change(function () {
            jQuery('#log-work-adjust-estimate-new-value,#log-work-adjust-estimate-manual-value', context).attr('disabled', 'disabled');
            jQuery('#log-work-adjust-estimate-' + jQuery(this).val() + '-value', context).removeAttr('disabled');
        });

        jQuery("#delete-log-work-adjust-estimate-new-value").change(function () {
            jQuery("#delete-log-work-adjust-estimate-new").prop("checked", true);
        });
        jQuery("#delete-log-work-adjust-estimate-manual-value").change(function () {
            jQuery("#delete-log-work-adjust-estimate-manual").prop("checked", true);
        });

        jQuery(context).find("#log-work-activate").change(function () {
            toggleTimeTrackingContainer(context, jQuery(this).is(":checked"));
        });
    }

    // In Quick Edit/Create we need to ensure the container is visible to append error messages
    Events.bind(Types.VALIDATE_TIMETRACKING, function (e, context) {
        toggleTimeTrackingContainer(context, true);
    });

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason !== Reasons.panelRefreshed) {
            applyLogworkControls(context);
        }
    });
});