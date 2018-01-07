define('jira/field/favourite-picker', ['jira/util/formatter', 'wrm/context-path', 'jquery'], function (formatter, wrmContextPath, $) {
    'use strict';

    var FavouritePicker = function FavouritePicker(options) {
        var entityId = options["entityId"];
        var entityType = options["entityType"];
        var favId = options["tableId"] + "_" + entityType + "_" + entityId;
        var favLink = $("#fav_a_" + favId);
        var enabled = options["enabled"];
        var undoContainer = $("#undo_div");
        var favCountEnabled = $("#fav_count_enabled_" + favId);
        var favCountDisabled = $("#fav_count_disabled_" + favId);
        var relatedDropdown = options.relatedDropdown;
        var urlType;
        if (entityType === "PortalPage") {
            urlType = "dashboards";
        } else if (entityType === "SearchRequest") {
            urlType = "filters";
        }
        var theUrl = wrmContextPath() + "/rest/api/1.0/" + urlType + "/" + entityId + "/favourite";
        var originalOrder = [];

        var initOriginalOrderArray = function initOriginalOrderArray() {
            $("#" + options["tableId"]).find("[id^=fav_div_]").each(function (i, domElem) {
                originalOrder[originalOrder.length] = $(domElem).attr("rel");
            });
        };

        var addUndoAction = function addUndoAction() {
            if (options["undoText"] !== undefined) {
                var undoEntityName = options["undoEntityName"];
                var undoMessage = $("<p/>").html(formatter.format(options["undoText"], undoEntityName));
                var favNode = $("#" + options["removeId"]);
                undoMessage.find("a").attr("id", "fav_undo_a_" + options["removeId"]).click(function (e) {
                    e.preventDefault();

                    var theData = undefined;
                    if (originalOrder.length > 0) {
                        theData = { entries: originalOrder };
                    }
                    $.ajax({
                        url: theUrl,
                        contentType: 'application/json',
                        data: JSON.stringify(theData),
                        type: "POST",
                        success: function success() {
                            undoMessage.remove();
                            enabled = "true";
                            updateLink();
                            favNode.show();
                            if (undoContainer.find("p").length === 0) {
                                undoContainer.addClass("hidden");
                            }
                            recolourSimpleTableRows(options["tableId"]);
                        },
                        error: function error() {
                            /* [alert] */
                            alert($(".favourite-params").find("#errorMsg").val());
                            /* [alert] end */
                        }
                    });
                });
                favNode.hide();
                recolourSimpleTableRows(options["tableId"]);

                undoContainer.append(undoMessage);
                undoContainer.removeClass("hidden");
            }
        };

        var toggleFavourite = function toggleFavourite() {
            if (enabled === "true") {
                $($.ajax({
                    url: theUrl,
                    type: "DELETE",
                    success: function success() {
                        enabled = "false";
                        updateLink();
                        addUndoAction();
                    },
                    error: function error() {
                        /* [alert] */
                        alert($(".favourite-params").find("#errorMsg").val());
                        /* [alert] end */
                    }
                })).throbber({ target: favLink });
            } else {
                $($.ajax({
                    url: theUrl,
                    type: "PUT",
                    success: function success() {
                        enabled = "true";
                        updateLink();
                    },
                    error: function error() {
                        /* [alert] */
                        alert($(".favourite-params").find("#errorMsg").val());
                        /* [alert] end */
                    }
                })).throbber({ target: favLink });
            }
        };

        var invalidateFiltersList = function invalidateFiltersList() {
            if (relatedDropdown) {
                if (JIRA.Dropdown[relatedDropdown]) {
                    JIRA.Dropdown[relatedDropdown].resetCache();
                }
            }
        };

        var updateLink = function updateLink() {
            if (enabled === "true") {
                favLink.addClass("enabled aui-iconfont-star").removeClass("disabled aui-iconfont-unstar").attr("title", options["titleAdd"]).text(options["titleAdd"]);
                favCountEnabled.show();
                favCountDisabled.hide();
            } else {
                favLink.addClass("disabled aui-iconfont-unstar").removeClass("enabled aui-iconfont-star").attr("title", options["titleRemove"]).text(options["titleRemove"]);
                favCountEnabled.hide();
                favCountDisabled.show();
            }
            invalidateFiltersList();
        };

        updateLink();
        favLink.click(function (e) {
            e.preventDefault();
            toggleFavourite();
        });
        initOriginalOrderArray();
    };

    FavouritePicker.NewPicker = function (options) {
        var fieldId = options["fieldId"];
        var favLink = $("#fav_a_" + fieldId);
        var favHidden = $("#fav_new_" + fieldId);
        var enabled = options["enabled"];

        var updateLink = function updateLink() {
            if (enabled === "true") {
                favLink.addClass("enabled aui-iconfont-star").removeClass("disabled aui-iconfont-unstar").attr("title", options["titleAdd"]).find("span").text(options["titleAdd"]);
                favHidden.val("true");
            } else {
                favLink.addClass("disabled aui-iconfont-unstar").removeClass("enabled aui-iconfont-star").attr("title", options["titleRemove"]).find("span").text(options["titleRemove"]);
                favHidden.val("false");
            }
        };

        updateLink();
        favLink.click(function (e) {
            e.preventDefault();
            if (enabled === "true") {
                enabled = "false";
            } else {
                enabled = "true";
            }
            updateLink();
        });
    };

    FavouritePicker.init = function (parent) {
        $(".favourite-params", parent).each(function () {
            var params = {};
            $(this).find("input").each(function () {
                var $this = $(this);
                params[$this.attr("id")] = $this.val();
            });

            if (params["remote"] === "false") {
                FavouritePicker.NewPicker(params);
            } else {
                FavouritePicker(params);
            }
        });
    };

    return FavouritePicker;
});

AJS.namespace('JIRA.FavouritePicker', null, require('jira/field/favourite-picker'));
/** Preserve legacy namespace
 @deprecated jira.widget.favourite */
AJS.namespace("jira.widget.favourite", null, {
    Picker: JIRA.FavouritePicker,
    NewPicker: JIRA.FavouritePicker.NewPicker
});