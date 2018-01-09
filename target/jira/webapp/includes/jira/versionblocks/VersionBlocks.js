define('jira/versionblocks/version-blocks', ['jquery'], function ($) {
    'use strict';

    var VersionBlocks = {
        ClassNames: {
            VERSION_LIST: "versions-list",
            VERSION_CONTAINER: "version-block-container",
            EXPANDED_CONTENT_CONTAINER: "version-issue-table"
        },
        init: function init() {
            var classNames = VersionBlocks.ClassNames;
            var dataElement = $("." + classNames.VERSION_LIST).first();
            var urlEndpoint = getUrl();

            $(document).on("click", "a[data-version-block]", function (e) {
                var $a = $(this);
                var $root = $a.closest("." + classNames.VERSION_CONTAINER);
                var isActive = $root.data("expanded");
                var $container = $root.find("." + classNames.EXPANDED_CONTENT_CONTAINER);
                var $spinner = $("<span class='icon loading'></span>");

                if (!$container.size()) {
                    $container = $("<div/>").addClass(classNames.EXPANDED_CONTENT_CONTAINER).hide().appendTo($root);
                }

                // Tell the server about the state we want this version to be in now
                var extraParams = {};
                extraParams[isActive ? "collapseVersion" : "expandVersion"] = $root.find('[data-version-id]').data("version-id");

                // Make our request for data
                var request = $.ajax({
                    url: urlEndpoint,
                    data: getUrlParams(extraParams),
                    dataType: "json",
                    beforeSend: function beforeSend() {
                        $a.closest("ul").append($("<li/>").append($spinner));
                    }
                });

                request.always(function () {
                    $spinner.parent("li").remove();
                });

                // Handle any errors in transmission or translation
                request.fail(function (jqXHR, textStatus, errorThrown) {
                    console.log("Failed to load issues for version. User-facing error to do, sorry :(", arguments);
                });

                // Update our DOM with the result of the toggle
                if (!isActive) {
                    request.done(function (data, textStatus, jqXHR) {
                        var html = $("<div/>").html(data.content);
                        var content = html.find("." + classNames.EXPANDED_CONTENT_CONTAINER);
                        $container.hide().replaceWith(content).show();
                    });
                } else {
                    request.done(function () {
                        $container.hide();
                    });
                }

                // Toggle our state
                request.done(function () {
                    $root.data("expanded", !isActive);
                });

                e.preventDefault();
            });

            /**
             * The URL we need to hit to get the list of issues we want, sans parameters.
             * Ideally this would be a REST endpoint and it'd return an array of issues.
             * Unfortunately I'm stuck with hitting a crappy overloaded URL that gets its
             * data crappily and renders crappy markup.
             * @private
             */
            function getUrl() {
                var href;
                href = window.document.location.href;
                href = href.replace(window.document.location.hash, "");
                href = href.replace(window.document.location.search, "");

                return href;
            }

            function getUrlParams(opts) {
                var params = {
                    decorator: "none",
                    contentOnly: true,
                    noTitle: true,
                    selectedTab: getSelectedTab(),
                    pid: dataElement.data("project-id"),
                    component: dataElement.data("component-id")
                };

                return $.extend(params, opts);
            }

            function getSelectedTab() {
                var selectedTab = dataElement.data("selected-tab");
                var paramString = "" + window.document.location.search + window.document.location.hash;
                if (paramString.indexOf("selectedTab=") > -1) {
                    selectedTab = paramString.replace(/^.*selectedTab=(.*?)(?:&.*$|$)/, "$1"); // a regex-ish substringer -- basically, discard everything before and after the value of the selectedTab param.
                    selectedTab = decodeURIComponent(selectedTab);
                }
                return selectedTab;
            }
        }
    };
    return VersionBlocks;
});

AJS.namespace('JIRA.VersionBlocks', null, require('jira/versionblocks/version-blocks'));