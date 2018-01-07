define('jira/project/browse/analytics', ['jira/analytics', 'marionette'], function (analytics, Marionette) {
    'use strict';

    return Marionette.Controller.extend({
        initialize: function initialize(options) {
            this.target = options.target;
        },
        startListening: function startListening() {
            this.listenTo(this.target, {
                'browse-projects.projects-render': function browseProjectsProjectsRender(numProjects) {
                    this.triggerProjectsRender(numProjects);
                },
                'browse-projects.project-view.click-project-name': function browseProjectsProjectViewClickProjectName(project, position) {
                    this.triggerProjectOpened(project, position);
                },
                'browse-projects.project-view.click-lead-user': function browseProjectsProjectViewClickLeadUser(project, position) {
                    this.triggerProfileNameClicked(project, position);
                },
                'browse-projects.project-view.click-category': function browseProjectsProjectViewClickCategory(project, position) {
                    this.triggerProjectCategoryClicked(project, position);
                },
                'browse-projects.project-view.click-url': function browseProjectsProjectViewClickUrl(project, position) {
                    this.triggerProjectURLClicked(project, position);
                },
                'browse-projects.project-type-change': function browseProjectsProjectTypeChange(projectType) {
                    this.triggerProjectTypeChanged(projectType);
                },
                'browse-projects.category-change': function browseProjectsCategoryChange(category) {
                    this.triggerCategoryChanged(category);
                },
                'browse-projects.navigate-to-page': function browseProjectsNavigateToPage(page) {
                    this.triggerNavigateToPage(page);
                },
                'browse-projects.navigate-to-previous': function browseProjectsNavigateToPrevious() {
                    this.triggerNavigateToPrevious();
                },
                'browse-projects.navigate-to-next': function browseProjectsNavigateToNext() {
                    this.triggerNavigateToNext();
                }
            });
        },
        triggerProjectTypeChanged: function triggerProjectTypeChanged(projectType) {
            if (projectType === 'business') {
                analytics.send({ name: 'projects.browse.types.business' });
            } else if (projectType === 'software') {
                analytics.send({ name: 'projects.browse.types.software' });
            } else if (projectType === 'service_desk') {
                analytics.send({ name: 'projects.browse.types.servicedesk' });
            } else if (projectType === 'all') {
                analytics.send({ name: 'projects.browse.types.all' });
            }
        },
        triggerCategoryChanged: function triggerCategoryChanged(categoryId) {
            if (categoryId === 'all') {
                analytics.send({ name: 'projects.browse.categories.all' });
            } else if (categoryId === 'recent') {
                analytics.send({ name: 'projects.browse.categories.recent' });
            } else {
                // The specific category can be user-defined, and so will not be recorded due to privacy concerns.
                analytics.send({ name: 'projects.browse.categories.select' });
            }
        },
        triggerProjectsRender: function triggerProjectsRender(numProjects) {
            analytics.send({
                name: 'projects.browse.view',
                data: { numProjects: numProjects }
            });
        },
        triggerProjectOpened: function triggerProjectOpened(project, position) {
            analytics.send({
                name: 'projects.browse.openProject',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerProfileNameClicked: function triggerProfileNameClicked(project, position) {
            analytics.send({
                name: 'projects.browse.openProfile',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerProjectURLClicked: function triggerProjectURLClicked(project, position) {
            analytics.send({
                name: 'projects.browse.openURL',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerProjectCategoryClicked: function triggerProjectCategoryClicked(project, position) {
            analytics.send({
                name: 'projects.browse.openCategory',
                data: {
                    projectId: project.attributes.id,
                    projectType: project.attributes.projectTypeKey,
                    position: position
                }
            });
        },
        triggerNavigateToPage: function triggerNavigateToPage(pageNumber) {
            analytics.send({
                name: 'projects.browse.pagination.goto',
                data: { pageNumber: pageNumber }
            });
        },
        triggerNavigateToPrevious: function triggerNavigateToPrevious() {
            analytics.send({ name: 'projects.browse.pagination.previous' });
        },
        triggerNavigateToNext: function triggerNavigateToNext() {
            analytics.send({ name: 'projects.browse.pagination.next' });
        }
    });
});