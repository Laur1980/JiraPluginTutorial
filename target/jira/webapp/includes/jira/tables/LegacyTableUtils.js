define('jira/tables/legacy-table-utils', ['exports', 'jquery'], function (exports, jQuery) {
    /** @deprecated */
    exports.recolourTableRows = function recolourTableRows(tableId, rowNormal, rowAlternate, emptyTableId) {
        var tbl = document.getElementById(tableId);
        var emptyTable = document.getElementById(emptyTableId);

        var alternate = false;
        var rowsFound = 0;
        var rows = tbl.rows;
        var firstVisibleRow = null;
        var lastVisibleRow = null;

        if (jQuery(tbl).hasClass('aui')) {
            rowNormal = '';
            rowAlternate = 'zebra';
        }

        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            if (row.style.display !== "none") {
                if (!alternate) {
                    row.className = rowNormal;
                } else {
                    row.className = rowAlternate;
                }
                rowsFound++;
                alternate = !alternate;
            }

            if (row.style.display !== "none") {
                if (firstVisibleRow == null) {
                    firstVisibleRow = row;
                }
                lastVisibleRow = row;
            }
        }
        if (firstVisibleRow != null) {
            firstVisibleRow.className = firstVisibleRow.className + " first-row";
        }
        if (lastVisibleRow != null) {
            lastVisibleRow.className = lastVisibleRow.className + " last-row";
        }

        if (emptyTable) {
            if (rowsFound === 0) {

                tbl.style.display = "none";
                emptyTable.style.display = "";
            } else {
                tbl.style.display = "";
                emptyTable.style.display = "none";
            }
        }
    };

    /** @deprecated */
    exports.recolourSimpleTableRows = function recolourSimpleTableRows(tableId) {
        recolourTableRows(tableId, "rowNormal", "rowAlternate", tableId + "_empty");
    };
});