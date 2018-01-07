require(['wrm/data', 'jquery', 'jira/project/browse/app', 'jira/project/browse/projecttypesservice', 'jira/project/browse/analytics'], function (wrmData, $, App, ProjectTypesService, Analytics) {
    $(function () {
        var $browseContainer = $('#browse-projects-page');
        if ($browseContainer.length) {
            ProjectTypesService.init(wrmData.claim('com.atlassian.jira.project.browse:projectTypes'));
            App.start({
                projects: wrmData.claim('com.atlassian.jira.project.browse:projects'),
                categories: wrmData.claim('com.atlassian.jira.project.browse:categories'),
                selectedCategory: wrmData.claim('com.atlassian.jira.project.browse:selectedCategory'),
                availableProjectTypes: wrmData.claim('com.atlassian.jira.project.browse:availableProjectTypes'),
                selectedProjectType: wrmData.claim('com.atlassian.jira.project.browse:selectedProjectType'),
                container: $browseContainer
            });

            var analytics = new Analytics({ target: App });
            analytics.startListening();
        }
    });
});