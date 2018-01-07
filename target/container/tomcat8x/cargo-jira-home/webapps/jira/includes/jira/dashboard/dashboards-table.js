define('jira/dashboard/dashboards-table', ['jira/common/page', 'jira/field/favourite-picker', 'jira/autocomplete/user-autocomplete', 'jira/dialog/form-dialog', 'jira/tabs/tab-manager', 'jira/tables/legacy-table-utils', 'wrm/context-path', 'jquery'], function (Page, FavouritePicker, UserAutoComplete, FormDialog, TabManager, TableUtils, wrmContextPath, jQuery) {
    "use strict";

    var DashboardsTable = {};

    function ajaxSearchRequest(url) {
        jQuery.ajax({
            method: "get",
            dataType: "html",
            url: url + "&decorator=none&contentOnly=true&Search=Search",
            success: function success(result) {
                Page.mainContentElement().html(result);
                favouriteHandler();
                searchHandler();
            }
        });
    }

    function searchHandler() {
        var searchForm = jQuery('#pageSearchForm');
        UserAutoComplete.init(searchForm);
        searchForm.submit(function () {
            var contextPath = wrmContextPath();
            ajaxSearchRequest(contextPath + "/secure/ConfigurePortalPages!default.jspa?" + jQuery(this).serialize());
            return false;
        });
    }

    function favouriteHandler() {
        FavouritePicker.init(jQuery("#content"));
    }

    function dialogInitializer() {
        new FormDialog({
            trigger: "#content a.delete_dash"
        });
    }

    DashboardsTable.init = function dashboardsTableInit() {
        TabManager.navigationTabs.addLoadEvent("favourite-dash-tab", favouriteHandler);
        TabManager.navigationTabs.addLoadEvent("favourite-dash-tab", dialogInitializer);
        TabManager.navigationTabs.addLoadEvent("my-dash-tab", favouriteHandler);
        TabManager.navigationTabs.addLoadEvent("my-dash-tab", dialogInitializer);
        TabManager.navigationTabs.addLoadEvent("search-dash-tab", favouriteHandler);
        TabManager.navigationTabs.addLoadEvent("search-dash-tab", searchHandler);
        TabManager.navigationTabs.addLoadEvent("popular-dash-tab", favouriteHandler);

        dialogInitializer();
        searchHandler();

        jQuery(document).on("click", "#pp_browse tr:first a, .filterPaging a", function (e) {
            ajaxSearchRequest(jQuery(this).attr("href"));
            e.preventDefault();
            e.stopPropagation();
        });

        jQuery(document).on("click", "#content .dash-reorder a", function (e) {
            e.preventDefault();
            var $this = jQuery(this);

            jQuery.ajax({
                method: "get",
                dataType: "html",
                url: $this.attr("href") + "&decorator=none&contentOnly=true",
                success: function success(result) {
                    Page.mainContentElement().html(result);
                    favouriteHandler();
                    TableUtils.recolourSimpleTableRows($this.closest('table').attr('id'));
                }
            });
        });
    };

    return DashboardsTable;
});