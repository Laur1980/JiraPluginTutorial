/**
 * Provides API to perform and listen for drag-and-drops in the IssueTable.
 * Mostly useful for code responsible for subtasks representation.
 */
define("jira/issuetable", ["jquery", "backbone", "jira/skate", "jira/featureflags/feature-manager", "jira/deprecator", "underscore"], function ($, Backbone, Skate, featureManager, deprecator, _) {

    var dragger = function dragger(table) {
        return {
            enable: function enable() {
                if (featureManager.isFeatureEnabled("com.atlassian.jira.issuetable.draggable")) {
                    //if Dark Feature enabled
                    var position = {
                        original: -1,
                        current: -1
                    };

                    $(table.element).children("tbody").sortable("destroy");

                    var tbody = $(table.element).find("tbody");

                    if (tbody.sortable('instance') !== undefined) {
                        tbody.sortable('destroy');
                    }

                    tbody.sortable({ // we're enabling drag-n-drop support
                        items: "> tr",
                        appendTo: "parent",
                        helper: "clone",
                        start: function start(event, ui) {
                            var row = ui.item[0];
                            position.original = table.idx(row);

                            table.trigger(table.Events.ROW_DRAG_STARTED, {
                                row: row,
                                position: position
                            });
                        },
                        stop: function stop(event, ui) {
                            var row = ui.item[0];
                            position.current = table.idx(row);
                            table.trigger(table.Events.ROW_DRAG_COMPLETED, {
                                row: row,
                                position: position
                            });
                        }
                    });
                    $(table.element).find("tbody tr").addClass("issue-table-draggable");
                }
            },
            disable: function disable() {
                $(table.element).children("tbody").sortable("destroy");
            },
            cancel: function cancel() {
                $(table.element).children("tbody").sortable("cancel");
            }
        };
    };

    var table = function table(element) {
        var table = _.extend({
            element: element,

            Events: {
                ROW_DRAG_STARTED: "jira-issuetable-web-component-row-drag-started",
                ROW_DRAG_COMPLETED: "jira-issuetable-web-component-row-drag-completed",
                ROW_DRAG_CANCELED: "jira-issuetable-web-component-row-drag-canceled"
            },

            idx: function idx(row) {
                return $(row).index();
            },


            dragging: null
        }, Backbone.Events);

        table.dragging = dragger(table);
        return table;
    };

    var api = _.extend({
        tables: [],
        Events: {
            ATTACHED: "jira-issuetable-web-component-attached",
            DETACHED: "jira-issuetable-web-component-detached"
        },

        onTable: function onTable(listener) {
            this.tables.forEach(listener);

            this.on(this.Events.ATTACHED, listener);
        },
        cancelDragging: function cancelDragging() {
            //canceling dragging for all existing tables to maintain compatibility

            this.tables.forEach(function (table) {
                table.dragging.cancel();
            });
        }
    }, Backbone.Events);

    deprecator.prop(api, "cancelDragging", { sinceVersion: '7.5', removeInVersion: '7.6' });

    var impl = {
        attach: function attach(table) {
            api.tables.push(table);
            api.trigger(api.Events.ATTACHED, table);
        },
        detach: function detach(table) {
            api.tables.forEach(function (item, idx) {
                if (table === item) {
                    api.tables.splice(idx);
                    api.trigger(api.Events.DETACHED, item);
                }
            });
        }
    };

    Skate("issuetable-web-component", {
        attached: function attached(elem) {
            elem.table = table(elem);
            impl.attach(elem.table);
        },

        detached: function detached(elem) {
            if (elem.table) {
                impl.detach(elem.table);
            } else {
                throw new Error("IssueTable hasn't been properly initialized");
            }
        }
    });

    return api;
});