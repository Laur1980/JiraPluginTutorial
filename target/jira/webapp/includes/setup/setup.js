define("jira/setup/init-setup-page", ["jira/ajs/select/single-select", "jira/ajs/list/item-descriptor", "underscore", "jquery"], function (SingleSelect, ItemDescriptor, _, $) {
    "use strict";

    var _gaq = window._gaq = window._gaq || [];

    function initPage() {
        var setupTracker = require("jira/setup/setup-tracker");
        setupTracker.insert();

        // code in this file will be eventually replaced by Backbone views once
        // JIRA 7.0 setup refactor is finished
        if ($("body").hasClass("jira-setup-database-page")) {
            return;
        }

        // gather data about mail configuration
        function getMailConfigurationAnalyticsData() {
            var isSkipped = $("#jira-setupwizard-email-notifications-disabled").is(":checked");
            var params = { "emailProvider": "none" };

            if (isSkipped) {
                return params;
            }

            var provider = function () {
                var v = $("select[name='serviceProvider']").val();
                return $.isArray(v) ? v[0] : v;
            }();

            $.extend(params, { "emailProvider": provider });

            if (provider === "custom") {
                var isSMTP = $("#jira-setupwizard-email-notifications-smtp").is(":checked");

                if (isSMTP) {
                    var hostname = function () {
                        var hostname = $("input[name='serverName']").val();
                        return ["mail", "smtp", "exchange"].indexOf(hostname) !== -1 ? hostname : "";
                    }();

                    var hostnameExt = function () {
                        var hostname = $("input[name='serverName']").val().toLowerCase();
                        var pos = hostname.indexOf(".");

                        hostname = pos !== -1 ? hostname.substr(0, pos) : hostname;

                        return ["mail", "smtp", "exchange", "mx", "localhost"].indexOf(hostname) !== -1 ? hostname : "";
                    }();
                    $.extend(params, {
                        "emailHostname": hostname,
                        "emailHostnameExt": hostnameExt,
                        "emailPort": $("input[name='port']").val(),
                        "emailProtocol": function () {
                            var v = $("select[name='protocol']").val();
                            return $.isArray(v) ? v[0] : v;
                        }()
                    });
                }

                $.extend(params, { "emailIsSMTP": isSMTP });
            }

            return params;
        }

        // Generic submit helper for all steps of the setup process
        // Prevent double submitting of the form and handle the other buttons
        $("#jira-setupwizard").submit(function (e) {
            var idsToDisable = ["#jira-setupwizard-submit", "#jira-setupwizard-test-connection", "#jira-setupwizard-test-mailserver-connection", "#jira-setupwizard-submit-instant", "#jira-setupwizard-submit-classic"];

            var isMailConfiguration = $("body").hasClass("jira-setup-page-mail-notifications");

            // show spinners and disable buttons, but prevent sending form
            if (isMailConfiguration && !$(this).data("intercepted")) {
                e.preventDefault();
                $(this).data("intercepted", true);

                setTimeout(function () {
                    setupTracker.sendMailConfigurationEvent(getMailConfigurationAnalyticsData()).always(function () {
                        $("#jira-setupwizard").submit();
                    });
                }, 0);
            }
            // submission already intercepted, just send the form
            else if (isMailConfiguration) {
                    return true;
                }

            $(idsToDisable.join(", ")).attr('disabled', 'disabled');

            //JRADEV-6428: Disable the language flags while PICO is starting up. If we don't we can get deadlock if the
            //user clicks "next" on the DB screen and then clicks on a flag while the db is being setup.
            var serverLanguageSelectList = $("#jira-setupwizard-server-language");
            if (serverLanguageSelectList.length > 0) {
                serverLanguageSelectList.attr('disabled', 'disabled');
            }

            $('input[name=nextStep]').val("true");
            showSubmitSpinners();
        });

        function showSubmitSpinners() {
            if ($('input[name=changingLanguage]').val() == "false" && $('input[name=testingConnection]').val() == "testconnection" || $('input[name=testingMailConnection]').val() == "true") {
                $('#test-connection-throbber').removeClass('hidden');
            } else if ($('input[name=changingLanguage]').val() === "false" || $('input[name=testingMailConnection]').val() === "false") {
                $('#submit-throbber').removeClass('hidden');
            }

            $('.throbber-message').removeClass('hidden');
        }

        // Step 1 of 4 - setup-db.jsp

        // Internal/External Database toggle
        $('input[name=databaseOption]').change(function () {
            var isExternal = $(this).val() == "EXTERNAL";
            var testbutton = $('#jira-setupwizard-test-connection');
            var externalFields = $('#setup-db-external');

            if (isExternal) {
                externalFields.removeClass('hidden');
                testbutton.removeClass('hidden');
            } else {
                externalFields.addClass('hidden');
                testbutton.addClass('hidden');
            }
        });

        // Used to prefill fields on the page depending on the databaseType option selected
        var dbPrefills = { ports: {}, schemas: {} };

        dbPrefills.ports['postgres72'] = '5432';
        dbPrefills.schemas['postgres72'] = 'public';

        dbPrefills.ports['mysql'] = '3306';
        dbPrefills.schemas['mysql'] = '';

        dbPrefills.ports['oracle10g'] = '1521';
        dbPrefills.schemas['oracle10g'] = '';

        dbPrefills.ports['mssql'] = '1433';
        dbPrefills.schemas['mssql'] = 'dbo';

        // Set the initial show/hide state of the fields - for cases where the page posts back (validation failed, test connection, language change, etc)
        if ($('input[name=databaseOption]:checked').val() == "EXTERNAL") {
            $('#setup-db-external, #jira-setupwizard-test-connection').removeClass('hidden');
        }

        function showDbFields() {
            var db = $('select[name=databaseType]').val();
            if (db != "") {
                $('.setup-fields').addClass('hidden');
                $('.db-option-' + db).removeClass('hidden');
            }
        }
        function showDbTypeDescription() {
            var $dbTypeSelect = $('select[name=databaseType]');
            var $descriptionDiv = $dbTypeSelect.parent().find(".description").empty();
            var db = $dbTypeSelect.val();
            if (db != "") {
                $dbTypeSelect.parent().find(".descriptions ." + db).clone().appendTo($descriptionDiv);
            }
        }
        showDbFields();
        showDbTypeDescription();

        // Database Type toggle
        $('select[name=databaseType]').change(function () {
            var selectedDatabase = $(this).val();
            var jdbcField = $("input[name='jdbcPort']");
            var schemaField = $("input[name='schemaName']");

            jdbcField.val(dbPrefills.ports[selectedDatabase]);
            schemaField.val(dbPrefills.schemas[selectedDatabase]);

            showDbFields();
            showDbTypeDescription();
        });

        // For testing the connection
        $("#jira-setupwizard-test-connection").click(function () {
            $("input[name=changingLanguage]").val("false");
            $("input[name=testingConnection]").val("true");
            $("#jira-setupwizard").submit();
        });

        // For changing the language
        $('#jira-setupwizard-server-language').change(function () {
            var lang = $(this).val();
            $("input[name=language]").val(lang);
            $("input[name=changingLanguage]").val("true");
            $("#jira-setupwizard").submit();
        });

        // Step 2 of 4 - setup-application-properties.jsp

        // Handle the fetch license link which sends them off to my.atlassian.com
        $("#fetchLicense").click(function () {
            var formValues = $("#jira-setupwizard").serializeArray();
            var url = $(this).attr("data-url");
            $.post(url, formValues, function () {
                return false;
            });
        });

        // Configure Atlassian Analytics
        var $enableAnalytics = $('#enableAnalytics');
        if ($enableAnalytics.length == 1) {
            var yesPlease = $(".analytics-yes-please");
            var noThanks = $(".analytics-no-thanks");

            var optInToAnalytics = function optInToAnalytics(enableAnalytics) {
                return function (event) {
                    event.preventDefault();

                    $enableAnalytics.val(enableAnalytics);
                    $(this).closest('form').submit();
                };
            };

            yesPlease.click(optInToAnalytics(true));
            noThanks.click(optInToAnalytics(false));

            // JRADEV-23613: don't preselect "Yes"
            _.defer(function () {
                yesPlease.blur();
            });
        }

        // Set 4 of 4 - setup-mail-notifications.jsp
        var analyticsEnabled = $('input[name="analytics-enabled"]');
        // For now we'll only be firing analytics if the use choose to opt-in
        if (analyticsEnabled.length > 0 && analyticsEnabled.val() === "true") {
            var ga = document.createElement('script');ga.type = 'text/javascript';ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga, s);

            _gaq.push(['_setAccount', 'UA-20272869-4']);
            _gaq.push(['_setDomainName', "none"]);
            _gaq.push(['_setDetectTitle', false]);
            var enabled = analyticsEnabled.val() === "true" ? 1 : 0; // Set to 1 if they said yes, 0 if they said no
            _gaq.push(['_trackEvent', 'btf.analytics', enabled ? 'enable' : 'disable', 'JIRA', 0]);
        }

        // Hide any leftover test-connection messages
        $('#test-connection-messages').hide();

        // Enable/Disable Notifications toggle
        $('input[name=noemail]').change(function () {
            var isEnabled = $(this).val() == "false";
            var notificationFields = $('#setup-notification-fields');
            var testButton = $('#jira-setupwizard-test-mailserver-connection');

            if (isEnabled) {
                notificationFields.removeClass('hidden');
                testButton.removeClass('hidden');
            } else {
                notificationFields.addClass('hidden');
                testButton.addClass('hidden');
            }
        });

        // Set the initial show/hide state of the fields - for cases where the page posts back (validation failed, test connection, etc)
        if ($('input[name=noemail]:checked').val() == "false") {
            $('#setup-notification-fields, #jira-setupwizard-test-mailserver-connection').removeClass('hidden');
        }

        // SMTP/JNDI toggle
        $('input[name=mailservertype]').change(function () {
            var type = $(this).val();
            var fields = $('.setup-fields');

            if (type == "smtp") {
                fields.addClass('hidden');
                $('#email-notifications-smtp-fields').removeClass('hidden');
            } else {
                fields.addClass('hidden');
                $('#email-notifications-jndi-fields').removeClass('hidden');
            }
        });

        // Set the initial show/hide state of the fields - for cases where the page posts back (validation failed, test connection, language change, etc)
        var $servertype = $('input[name=mailservertype]:checked');
        if ($servertype.val() == "smtp") {
            $('.setup-fields').addClass('hidden');
            $('#email-notifications-smtp-fields').removeClass('hidden');
        } else if ($servertype.val() == "jndi") {
            $('.setup-fields').addClass('hidden');
            $('#email-notifications-jndi-fields').removeClass('hidden');
        }

        // For testing the connection
        $("#jira-setupwizard-test-mailserver-connection").click(function () {
            var action = "VerifySmtpServerConnection!setup.jspa";

            $("input[name=testingMailConnection]").val("true");
            $("#jira-setupwizard").attr('action', action).submit();
        });

        // Import Existing Data
        $("#reimport").click(function (e) {
            e.preventDefault();
            //set the form to import with default paths
            $('input[name=useDefaultPaths]').val("true");
            $("#jira-setupwizard").submit();
        });

        // Acknowledge downgrade error
        var ackDowngradeSelector = '#acknowledgeDowngradeError';
        $(ackDowngradeSelector).click(function (e) {
            e.preventDefault();

            // hide the warning. then set the 'downgradeAnyway' form param
            $('#acknowledgeDowngradeError').parent().parent().fadeOut();
            $('input[name=downgradeAnyway]').val("true");
        });

        var $serviceProvider = $("select[name=serviceProvider]");
        if ($serviceProvider.length > 0) {
            var smtps = new ItemDescriptor({
                value: "smtps",
                label: "SECURE_SMTP"
            });

            var knownServiceProviders = {
                "gmail-smtp": { protocol: smtps, serverName: "smtp.gmail.com", port: "465" },
                "yahooplus-smtp": { protocol: smtps, serverName: "plus.smtp.mail.yahoo.com", port: "465" }
            };

            new SingleSelect({
                element: $serviceProvider
            });

            var protocol = new SingleSelect({
                element: $("select[name=protocol]")
            });

            $serviceProvider.change(function (protocol) {
                return function () {
                    var val = $(this).val();
                    var showFields = false;
                    var serverName = $("input[name=serverName]");
                    var port = $("input[name=port]");
                    var tls = $("input[name=tlsRequired]");
                    var provider = knownServiceProviders[val];
                    if (provider) {
                        protocol.setSelection(provider.protocol);
                        serverName.val(provider.serverName);
                        port.val(provider.port);
                    } else {
                        showFields = true;
                    }

                    protocol.$container.parent(".field-group").toggle(showFields);
                    serverName.parent(".field-group").toggle(showFields);
                    port.parent(".field-group").toggle(showFields);
                    tls && tls.parent(".field-group").toggle(showFields);
                };
            }(protocol)).change();
        } else {
            $(".select").each(function () {
                new SingleSelect({
                    element: this
                });
            });
        }
    }

    return initPage;
});