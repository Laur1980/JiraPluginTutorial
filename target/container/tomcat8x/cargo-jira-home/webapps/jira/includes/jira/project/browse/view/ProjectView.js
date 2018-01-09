define('jira/project/browse/projectview', ['marionette'], function (Marionette) {
    "use strict";

    return Marionette.ItemView.extend({
        template: JIRA.Templates.Project.Browse.projectRow,
        ui: {
            'name': 'td.cell-type-name a',
            'leadUser': 'td.cell-type-user a',
            'category': 'td.cell-type-category a',
            'url': 'td.cell-type-url a'
        },
        events: {
            'click @ui.name': function clickUiName() {
                this.trigger('project-view.click-project-name', this.model);
            },
            'click @ui.leadUser': function clickUiLeadUser() {
                this.trigger('project-view.click-lead-user', this.model);
            },
            'click @ui.category': function clickUiCategory() {
                this.trigger('project-view.click-category', this.model);
            },
            'click @ui.url': function clickUiUrl() {
                this.trigger('project-view.click-url', this.model);
            }
        },
        onRender: function onRender() {
            this.unwrapTemplate();
        }
    });
});