require(['jira/dialog/form-dialog', 'jira/dropdown/dropdown-factory', 'jquery'], function (FormDialog, Dropdowns, $) {
    "use strict";

    // Bind delete / change interactions.

    function bindEventHandlers() {
        $("a.delete-dashboard, a.change-owner").each(function () {
            var linkId = this.id;
            new FormDialog({
                trigger: "#" + linkId,
                autoClose: true
            });
        });
    }

    // Bind sorting interactions.
    $(document).on("click", "#pp_browse tr:first a", function (e) {
        $.ajax({
            method: "get",
            dataType: "html",
            url: $(this).attr("href") + "&decorator=none&contentOnly=true&Search=Search",
            success: function success(result) {
                $("#shared-dashboard-search-results").html(result);
                Dropdowns.bindGenericDropdowns($("#shared-dashboard-search-results"));
                bindEventHandlers();
            }
        });

        e.preventDefault();
        e.stopPropagation();
    });

    $(bindEventHandlers);
});