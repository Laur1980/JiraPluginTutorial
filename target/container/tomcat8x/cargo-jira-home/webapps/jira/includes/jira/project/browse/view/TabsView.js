define('jira/project/browse/tabsview', ['marionette', 'jquery'], function (Marionette, $) {
    'use strict';

    return Marionette.ItemView.extend({
        template: JIRA.Templates.Project.Browse.tabs,
        events: {
            'click a': 'categoryClick'
        },
        collectionEvents: {
            'change': 'render'
        },
        onRender: function onRender() {
            this.unwrapTemplate();
        },
        categoryClick: function categoryClick(e) {
            var $link = $(e.currentTarget);
            var id = $link.attr('rel');

            e.preventDefault();
            this.trigger('category-change', id);
        }
    });
});