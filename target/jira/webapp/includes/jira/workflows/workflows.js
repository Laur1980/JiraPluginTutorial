require(['jquery', 'wrm/context-path', 'jira/dialog/form-dialog'], function (jQuery, wrmContextPath, FormDialog) {
    jQuery(function () {
        var MODE_DIAGRAM = 'diagram';
        var MODE_TEXT = 'text';
        var PREFERENCE_NAME = 'workflow-mode';

        var contextPath = wrmContextPath();

        function sanitiseMode(mode) {
            return mode === MODE_TEXT ? MODE_TEXT : MODE_DIAGRAM;
        }

        function saveMode(mode) {
            jQuery.ajax({
                url: contextPath + "/rest/api/2/mypreferences?key=" + PREFERENCE_NAME,
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                data: sanitiseMode(mode)
            });
        }

        function switchMode(mode) {
            var $trigger = jQuery('#workflow-' + mode);
            if (!$trigger.hasClass('active')) {
                jQuery('.workflow-view-toggle').each(function () {
                    var $link = jQuery(this);
                    if ($trigger.is($link)) {
                        $link.addClass('active');
                    } else {
                        $link.removeClass('active');
                    }
                });
                jQuery('.workflow-view').addClass('hidden');
                jQuery($trigger.attr('href')).removeClass('hidden').trigger(jQuery.Event('show'));
                jQuery(document.documentElement).css('overflow-y', '');
            }
        }

        //If there are toggle links then we are in view mode.
        var $workflowViewToggles = jQuery('.workflow-view-toggle');
        jQuery(document).on("click", ".workflow-view-toggle", function (e) {
            e.preventDefault();

            //only do something if real change
            var $el = jQuery(this);

            var mode;
            if (!$el.hasClass("active")) {
                mode = sanitiseMode($el.data('mode'));
                saveMode(mode);
                switchMode(mode);
            }
        });

        //else edit mode.
        if (!$workflowViewToggles.length) {
            //Save the current mode by looking for the workflow designer.
            saveMode(jQuery('#jwd').length > 0 ? MODE_DIAGRAM : MODE_TEXT);
        }

        new FormDialog({
            id: 'edit-workflow-dialog',
            trigger: '#edit-workflow-trigger'
        });
    });
});