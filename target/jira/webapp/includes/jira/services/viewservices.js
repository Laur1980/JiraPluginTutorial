require(["jira/util/formatter", "aui/inline-dialog", "aui/message", "wrm/context-path", "jquery"], function (formatter, InlineDialog, Messages, wrmContextPath, $) {
    "use strict";

    var contextPath = wrmContextPath();

    $(function () {
        $("#show-services").click(function (e) {
            e.preventDefault();

            var servicesDiv = document.getElementById("builtinServices");
            var servicesArrow = document.getElementById("builtinServicesArrow");
            if (servicesDiv.style.display === 'none') {
                servicesDiv.style.display = '';
                servicesArrow.src = contextPath + "/images/icons/navigate_down.gif";
            } else {
                servicesDiv.style.display = 'none';
                servicesArrow.src = contextPath + "/images/icons/navigate_right.gif";
            }
        });

        $(".set-service").click(function (e) {
            e.preventDefault();

            $("#serviceClass").val($(this).attr("data-service-type"));
            $("#serviceName").focus();
        });

        var fillToolTip = function fillToolTip(contents, trigger, showPopup) {
            contents.html($("#obsolete-settings-message").html());
            showPopup();
        };

        var $obsSettingsEl = $(".obsolete-settings-hover");

        if ($obsSettingsEl.length > 0) {
            new InlineDialog($obsSettingsEl, "obsolete-settings-popup", fillToolTip, {
                width: 450,
                onHover: true,
                onTop: true,
                hideDelay: 0
            });

            Messages.warning($("#obsolete-settings-warning"), {
                body: formatter.I18n.getText("jmp.viewservices.obsolete.options"),
                shadowed: false,
                closeable: false
            });
        }
    });
});