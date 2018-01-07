require(['jira/dialog/form-dialog', 'jira/dropdown/dropdown-factory', 'jquery'], function (FormDialog, Dropdowns, $) {
    "use strict";

    // Bind delete / edit / change interaction events.

    function bindEventHandlers() {
        $("a.delete-filter, a.edit-filter, a.change-owner").each(function () {
            var linkId = this.id;
            new FormDialog({
                trigger: "#" + linkId,
                autoClose: true
            });
        });
    }

    // Bind search sorting interaction events.
    $(document).on("click", "#mf_browse tr:first a", function (e) {
        $.ajax({
            method: "get",
            dataType: "html",
            url: $(this).attr("href") + "&decorator=none&contentOnly=true&Search=Search",
            success: function success(result) {
                $("#shared-filter-search-results").html(result);
                Dropdowns.bindGenericDropdowns($("#shared-filter-search-results"));
                bindEventHandlers();
            }
        });

        e.preventDefault();
        e.stopPropagation();
    });

    $(bindEventHandlers);
});