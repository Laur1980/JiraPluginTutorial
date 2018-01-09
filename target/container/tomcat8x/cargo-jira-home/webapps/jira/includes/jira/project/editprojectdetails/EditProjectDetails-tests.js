AJS.test.require(["jira.webresources:edit-project-details"], function () {

    var $ = require('jquery');
    var _ = require('underscore');

    var EditProjectDetails;

    module("JIRA.Project.EditProjectDetails", {
        setup: function setup() {
            this.$container = $(createForm());
            this.$form = this.$container.find("form");
            $('#qunit-fixture').append(this.$container);

            var context = AJS.test.mockableModuleContext();

            this.mockMetrics = {
                start: sinon.spy(),
                end: sinon.spy()
            };
            context.mock('internal/browser-metrics', this.mockMetrics);

            fixMocking(context);

            EditProjectDetails = context.require('jira/project/edit-project-details');
        }
    });

    test("Browser metrics are triggered for loading the editProjectDetails", function () {
        ok(!this.mockMetrics.start.called, "Metrics start should not have been called");

        var editProjectDetails = new EditProjectDetails({
            el: this.$form
        });

        ok(this.mockMetrics.start.calledOnce, "Metrics start should now have been called");
        deepEqual(this.mockMetrics.start.args[0], [{
            key: editProjectDetails.LOADED_METRICS_KEY,
            isInitial: true
        }], "Metric arguments for start are correct");

        ok(this.mockMetrics.end.calledOnce, "Metrics end should now have been called");
        deepEqual(this.mockMetrics.end.args[0], [{
            key: editProjectDetails.LOADED_METRICS_KEY
        }], "Metric arguments for end are correct");
    });

    test("If in dialog browser metrics are not triggered", function () {
        this.$container.addClass('jira-dialog');
        new EditProjectDetails({
            el: this.$form
        });

        ok(!this.mockMetrics.start.called, "Metrics start should not have been called in a dialog");
        ok(!this.mockMetrics.end.called, "Metrics end should not have been called in a dialog");
    });

    var PROJECT_TYPE_OPTIONS = ['business', 'software', 'service_desk'];

    function createForm() {
        var html = '<div id="container"><form><div><select class="project-type-select select" name="projectTypeKey" id="projectTypeKey">';

        _.each(PROJECT_TYPE_OPTIONS, function (option) {
            html += '<option value="' + option + '">' + option + "</option>";
        });

        html += "</select></div></form></div>";
        return html;
    }

    /**
     * This is a known problem where content retriever used by the SingleSelect doesn't mock well as it does an
     * instanceof check. Doing this fixes this problem.
     */
    function fixMocking(context) {
        //For some reason not mocking this screwed up with skate.
        context.mock('jira/project/edit/project-type-field', require('jira/project/edit/project-type-field'));
        context.mock('jira/project/edit/project-category-field', require('jira/project/edit/project-category-field'));

        //Use the default implementation as SingleSelect seems to like being gotten out of the test context
        var ContentRetriever = require('jira/ajs/contentretriever/content-retriever');
        context.mock('jira/ajs/contentretriever/content-retriever', ContentRetriever);
    }
});