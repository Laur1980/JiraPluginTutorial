define('jira/project/browse/paginationview', ['marionette', 'jquery', 'underscore', 'jira/util/navigation'], function (Marionette, $, _, Navigation) {
    'use strict';

    return Marionette.ItemView.extend({
        template: JIRA.Templates.Project.Browse.pagination,
        ui: {
            page: "li a",
            previous: "li.aui-nav-previous a",
            next: "li.aui-nav-next a"
        },
        events: {
            "click @ui.page": "clickPage",
            "click @ui.previous": "clickPrevious",
            "click @ui.next": "clickNext"
        },
        collectionEvents: {
            reset: "render"
        },
        modelEvents: {
            change: "render"
        },
        onRender: function onRender() {
            this.unwrapTemplate();
        },
        serializeData: function serializeData() {
            var url = Navigation.getRoot() + this.model.getQueryParams();
            var data = _.extend({
                url: url
            }, this.collection.state);
            data.firstPage = Math.max(data.currentPage - 5, data.firstPage);
            data.totalPages = data.lastPage;
            data.lastPage = Math.min(data.currentPage + 5, data.lastPage);
            return data;
        },
        clickPage: function clickPage(e) {
            e.preventDefault();
            var pageNumber = +$(e.target).attr("data-page");
            if (pageNumber) {
                this.collection.getPage(pageNumber);
                this.trigger("navigate", pageNumber);
            }
        },
        clickPrevious: function clickPrevious() {
            this.trigger("navigate-previous");
        },
        clickNext: function clickNext() {
            this.trigger("navigate-next");
        }
    });
});