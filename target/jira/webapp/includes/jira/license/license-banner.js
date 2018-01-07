define("jira/license-banner", ['jira/util/logger', 'jira/analytics', "jquery", "underscore", "jira/flag", "aui/banner", 'wrm/context-path'], function (logger, analytics, $, _, flag, banner, wrmContextPath) {
    "use strict";

    var contextPath = wrmContextPath();

    var rest = function rest(resource, trace) {
        return $.ajax({
            type: "POST",
            url: contextPath + "/rest/internal/1.0/licensebanner/" + resource,
            contentType: "application/json"
        }).always(function () {
            logger.trace(trace);
        });
    };

    var slideUpAndRemove = function slideUpAndRemove($el) {
        $el.slideUp(function () {
            $el.remove();
        });
    };

    var sendAnalyticsEvent = function sendAnalyticsEvent(action, messageType, $body) {
        var days = $body.find("div[data-days]").attr("data-days");
        var notificationType = $body.find("[data-subscription]").attr("data-subscription") === "false" ? "maintenance" : "subscription";
        var eventName = "jira.expiry-notification." + notificationType + "." + messageType + "." + action;
        analytics.send({
            name: eventName,
            data: _.omit({ "days_pre_expiry": days }, _.isEmpty)
        });
    };

    var getRemindLater = function getRemindLater(type, $body) {
        return function () {
            rest("remindlater", "license-later-done");
            sendAnalyticsEvent("close", type, $body);
        };
    };

    var clickTrack = function clickTrack(type, $body) {
        $body.find("[data-action]").on("click", function () {
            sendAnalyticsEvent("click." + $(this).attr("data-action"), type, $body);
        });
    };

    function showLicenseFlag(content) {
        if (content && content.length) {
            var licenseFlag = flag.showWarningMsg(null, content);
            if (licenseFlag) {
                var $licenseFlag = $(licenseFlag);
                var remindLater = _.once(getRemindLater("flag", $licenseFlag));

                $licenseFlag.on('aui-flag-close', remindLater);

                $("#license-flag-later").click(function (e) {
                    e.preventDefault();
                    $licenseFlag[0].close();
                    remindLater();
                });

                sendAnalyticsEvent("show", "flag", $licenseFlag);
                clickTrack("flag", $licenseFlag);
            }
        }
        logger.trace("license-flag-checked");
    }

    function showLicenseBanner(content) {
        if (content && content.length) {
            var $banner = $(banner({ body: content }));
            var remindLater = _.once(getRemindLater("banner", $banner));

            $("#license-banner-later").click(function (e) {
                e.preventDefault();

                slideUpAndRemove($banner);
                remindLater();
            });

            sendAnalyticsEvent("show", "banner", $banner);
            clickTrack("banner", $banner);
        }
        logger.trace("license-banner-checked");
    }

    return {
        showLicenseFlag: showLicenseFlag,
        showLicenseBanner: showLicenseBanner
    };
});