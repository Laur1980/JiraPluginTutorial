/*global AJS*/
AJS.test.require('jira.webresources:browseprojects', function () {
    'use strict';

    var Marionette = require('marionette');
    var mockSend;

    module('Analytics', {
        setup: function setup() {
            this.application = new Marionette.Application();
            this.application.start();

            mockSend = sinon.stub();

            var context = AJS.test.mockableModuleContext();
            context.mock('marionette', Marionette);
            context.mock('jira/analytics', { send: mockSend });
            var Analytics = context.require('jira/project/browse/analytics');

            var analytics = new Analytics({ target: this.application });
            analytics.startListening();

            this.mockProject = {
                attributes: {
                    id: 'PROJT',
                    projectTypeKey: 'Test'
                }
            };
        }
    });

    test('project type changed to business', function () {
        var projectType = 'business';
        this.application.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.types.business'
        });
    });

    test('project type changed to software', function () {
        var projectType = 'software';
        this.application.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.types.software'
        });
    });

    test('project type changed to service desk', function () {
        var projectType = 'service_desk';
        this.application.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.types.servicedesk'
        });
    });

    test('project type changed to all', function () {
        var projectType = 'all';
        this.application.trigger('browse-projects.project-type-change', projectType);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.types.all'
        });
    });

    test('category changed to all', function () {
        var category = 'all';
        this.application.trigger('browse-projects.category-change', category);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.categories.all'
        });
    });

    test('category changed to recent', function () {
        var category = 'recent';
        this.application.trigger('browse-projects.category-change', category);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.categories.recent'
        });
    });

    test('category changed to user-defined category', function () {
        var category = 'test';
        this.application.trigger('browse-projects.category-change', category);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.categories.select'
        });
    });

    test('project opened', function () {
        var position = 1;
        this.application.trigger('browse-projects.project-view.click-project-name', this.mockProject, position);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.openProject',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('user profile URL clicked', function () {
        var position = 1;
        this.application.trigger('browse-projects.project-view.click-lead-user', this.mockProject, position);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.openProfile',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('project URL clicked', function () {
        var position = 1;
        this.application.trigger('browse-projects.project-view.click-url', this.mockProject, position);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.openURL',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('project category clicked', function () {
        var position = 1;
        this.application.trigger('browse-projects.project-view.click-category', this.mockProject, position);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.openCategory',
            data: {
                projectId: this.mockProject.attributes.id,
                projectType: this.mockProject.attributes.projectTypeKey,
                position: position
            }
        });
    });

    test('navigate to page', function () {
        var pageNumber = 1;
        this.application.trigger('browse-projects.navigate-to-page', pageNumber);
        sinon.assert.calledWith(mockSend, {
            name: 'projects.browse.pagination.goto',
            data: { pageNumber: pageNumber }
        });
    });

    test('navigate to previous page', function () {
        this.application.trigger('browse-projects.navigate-to-previous');
        sinon.assert.calledWith(mockSend, { name: 'projects.browse.pagination.previous' });
    });

    test('navigate to next page', function () {
        this.application.trigger('browse-projects.navigate-to-next');
        sinon.assert.calledWith(mockSend, { name: 'projects.browse.pagination.next' });
    });
});