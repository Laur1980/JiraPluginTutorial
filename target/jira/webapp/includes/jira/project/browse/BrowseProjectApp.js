define('jira/project/browse/app', ['require'], function (require) {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var Layout = require('jira/project/browse/layout');
    var TabsView = require('jira/project/browse/tabsview');
    var ProjectTypesTabsView = require('jira/project/browse/projecttypestabsview');
    var ProjectCollection = require('jira/project/browse/projectcollection');
    var ProjectCollectionView = require('jira/project/browse/projectcollectionview');
    var PaginationView = require('jira/project/browse/paginationview');
    var FilterModel = require('jira/project/browse/filtermodel');
    var FilterView = require('jira/project/browse/filterview');
    var Navigation = require('jira/util/navigation');
    var CategoryCollection = require('jira/project/browse/categorycollection');
    var ProjectTypeCollection = require('jira/project/browse/projecttypecollection');
    var User = require('jira/util/users/logged-in-user');

    var application = new Marionette.Application();

    application.on('start', function (options) {
        var $el = options.container;

        this.categories = new CategoryCollection(options.categories);
        this.availableProjectTypes = new ProjectTypeCollection(options.availableProjectTypes);
        this.projects = new ProjectCollection(options.projects, {
            mode: 'client',
            state: {
                pageSize: 25,
                currentPage: 1
            },
            categories: this.categories
        });

        this.categories.selectCategory(options.selectedCategory);

        if (options.availableProjectTypes) {
            //JC-430: If an invalid project is specified in the URL just go back to 'all'
            if (!this.availableProjectTypes.selectProjectType(options.selectedProjectType)) {
                this.availableProjectTypes.selectProjectType("all");
            }
            this.filter = new FilterModel({
                category: this.categories.getSelected().toJSON(),
                projectType: this.availableProjectTypes.getSelected().toJSON()
            }, {
                pageableCollection: this.projects
            });
        } else {

            this.filter = new FilterModel({
                category: this.categories.getSelected().toJSON()
            }, {
                pageableCollection: this.projects
            });
        }

        this.layout = new Layout({
            el: $el
        });

        this.projectCollectionView = new ProjectCollectionView({
            model: this.filter,
            collection: this.projects
        });

        var categoryChange = function categoryChange(categoryId) {
            var category = application.categories.selectCategory(categoryId);

            if (category) {
                application.filter.changeCategory(category);
            }
        };

        if (User.username() !== '' || this.categories.length > 1) {
            this.tabsView = new TabsView({
                collection: this.categories
            });
            this.tabsView.on('category-change', categoryChange);

            this.layout.categoryNav.show(this.tabsView);
        } else {
            this.layout.$el.find(this.layout.categoryNav.el).addClass('hidden');
        }

        var projectTypeChange = function projectTypeChange(projectTypeId) {
            var projectType = application.availableProjectTypes.selectProjectType(projectTypeId);
            if (projectType) {
                application.filter.changeProjectType(projectType);
            }
        };
        if (this.availableProjectTypes.length > 0) {
            this.projectTypesTabsView = new ProjectTypesTabsView({
                collection: this.availableProjectTypes
            });
            this.projectTypesTabsView.on('project-type-change', projectTypeChange);
            this.layout.projectTypeNav.show(this.projectTypesTabsView);
        } else {
            this.layout.$el.find(".project-type-nav").addClass('hidden');
        }

        this.projectCollectionView.on('project-view.click-category', function (project) {
            categoryChange(project.attributes.projectCategoryId);
        });

        this.layout.content.show(this.projectCollectionView);
        this.layout.pagination.show(new PaginationView({
            collection: this.projects,
            model: this.filter
        }));
        this.layout.filter.show(new FilterView({
            model: this.filter
        }));

        this.layout.pagination.currentView.on('navigate', function (pageNumber) {
            var params = _.extend(application.filter.getQueryParams(false), {
                'page': pageNumber
            });
            Navigation.navigate(params);
        });
        this.filter.on('filter', function (params) {
            Navigation.navigate(params);
        });

        var router = new (Backbone.Router.extend({
            initialize: function initialize() {
                this.route(/(.*)/, 'every');
            }
        }))();

        router.on('route:every', function () {
            var page = +Navigation.getParam('page', true) || 1;
            var contains = Navigation.getParam('contains', true) || '';
            var categoryId = Navigation.getParam('selectedCategory') || '';
            var category = application.categories.selectCategory(categoryId);
            var projectTypeId = Navigation.getParam('selectedProjectType') || '';
            var projectType = application.availableProjectTypes.selectProjectType(projectTypeId);

            application.filter.set('contains', contains, { silent: true });
            if (category !== false) {
                application.filter.set('category', category.toJSON(), { silent: true });
            }
            if (projectType !== false) {
                application.filter.set('projectType', projectType.toJSON(), { silent: true });
            }
            application.filter.filterCollection();
            application.projects.getPage(page);
            application.layout.filter.currentView.render();
        });

        if (!Backbone.History.started) {
            Backbone.history.start({
                pushState: Navigation.pushStateSupported,
                root: Navigation.getBackboneHistoryRoot()
            });
        }

        //rewrite old-style url to new style one:
        if (window.location.hash) {
            var categoryId = window.location.hash.substring(1);
            var category = this.categories.get(categoryId);
            if (category) {
                categoryChange(categoryId);
            }
        }

        // Expose events for analytics (or any other consumer) - make sure we guard against components such as
        // projectTypesTabView which are only defined conditionally.
        this.listenTo(this.projectCollectionView, {
            'project-view.click-project-name': function projectViewClickProjectName(project, position) {
                this.trigger('browse-projects.project-view.click-project-name', project, position);
            },
            'project-view.click-lead-user': function projectViewClickLeadUser(project, position) {
                this.trigger('browse-projects.project-view.click-lead-user', project, position);
            },
            'project-view.click-category': function projectViewClickCategory(project, position) {
                this.trigger('browse-projects.project-view.click-category', project, position);
            },
            'project-view.click-url': function projectViewClickUrl(project, position) {
                this.trigger('browse-projects.project-view.click-url', project, position);
            }
        });

        if (typeof this.projectTypesTabsView !== 'undefined') {
            this.listenTo(this.projectTypesTabsView, {
                'project-type-change': function projectTypeChange(projectType) {
                    this.trigger('browse-projects.project-type-change', projectType);
                }
            });
        }

        if (typeof this.tabsView !== 'undefined') {
            this.listenTo(this.tabsView, {
                'category-change': function categoryChange(category) {
                    this.trigger('browse-projects.category-change', category);
                }
            });
        }

        this.listenTo(this.filter, {
            'filter': function filter() {
                var numberOfProjects = application.projects.length;
                this.trigger('browse-projects.projects-render', numberOfProjects);
            }
        });

        this.listenTo(this.layout.pagination.currentView, {
            'navigate': function navigate(page) {
                this.trigger('browse-projects.navigate-to-page', page);
            },
            'navigate-previous': function navigatePrevious() {
                this.trigger('browse-projects.navigate-to-previous');
            },
            'navigate-next': function navigateNext() {
                this.trigger('browse-projects.navigate-to-next');
            }
        });
    });

    return application;
});