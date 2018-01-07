require(['jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jira/autocomplete/user-autocomplete', 'jira/common/page', 'jira/tabs/tab-manager', 'jira/dialog/form-dialog', 'jira/field/favourite-picker', 'wrm/context-path', 'jquery'], function (Events, Types, Reasons, UserAutoComplete, Page, TabManager, FormDialog, FavouritePicker, wrmContextPath, $) {
    "use strict";

    var contextPath = wrmContextPath();

    var opts = {
        customInit: function customInit() {
            var $container = Page.mainContentElement();

            var favouriteHandler = function favouriteHandler() {
                FavouritePicker.init($container);
            };

            var searchHandler = function searchHandler() {
                var ajaxRequest = function ajaxRequest(url) {
                    $("#filter_search_results").empty();
                    $.ajax({
                        method: "get",
                        dataType: "html",
                        url: url + "&decorator=none&contentOnly=true&Search=Search",
                        success: function success(result) {
                            $container.html(result);
                            Events.trigger(Types.NEW_CONTENT_ADDED, [$container, Reasons.filtersSearchRefreshed]);
                            favouriteHandler();
                            searchHandler();
                            $("#mf_browse tr:first a, .filterPaging a").click(function (e) {
                                ajaxRequest($(this).attr("href"));
                                e.preventDefault();
                                e.stopPropagation();
                            });
                        }
                    });
                };

                var filterSearchForm = $("#filterSearchForm");
                UserAutoComplete.init(filterSearchForm);
                filterSearchForm.submit(function () {
                    ajaxRequest(contextPath + "/secure/ManageFilters.jspa?" + $(this).serialize());
                    return false;
                });
            };

            var dialogInitializer = function dialogInitializer() {
                $container.find("a.delete-filter").each(function () {
                    var linkId = this.id;
                    new FormDialog({
                        trigger: "#" + linkId,
                        autoClose: true
                    });
                });
                $container.find("a.edit-filter").each(function () {
                    var linkId = this.id;
                    new FormDialog({
                        trigger: "#" + linkId,
                        autoClose: true
                    });
                });
            };

            TabManager.navigationTabs.addLoadEvent("my-filters-tab", favouriteHandler);
            TabManager.navigationTabs.addLoadEvent("fav-filters-tab", favouriteHandler);
            TabManager.navigationTabs.addLoadEvent("popular-filters-tab", favouriteHandler);
            TabManager.navigationTabs.addLoadEvent("search-filters-tab", favouriteHandler);
            TabManager.navigationTabs.addLoadEvent("search-filters-tab", searchHandler);

            TabManager.navigationTabs.addLoadEvent("my-filters-tab", dialogInitializer);
            TabManager.navigationTabs.addLoadEvent("fav-filters-tab", dialogInitializer);

            dialogInitializer();
            searchHandler();
        }
    };

    $(function () {
        TabManager.navigationTabs.init(opts);
    });
});