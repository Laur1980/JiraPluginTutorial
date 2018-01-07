AJS.test.require(["jira.webresources:edit-project-details"], function () {

    var $ = require('jquery');
    var _ = require('underscore');
    var ProjectTypeField = require('jira/project/edit/project-type-field');

    var PROJECT_TYPE_OPTIONS = ['business', 'software', 'service_desk'];

    function createField() {
        var html = '<div><select class="project-type-select select" name="projectTypeKey" id="projectTypeKey">';

        _.each(PROJECT_TYPE_OPTIONS, function (option) {
            html += '<option value="' + option + '">' + option + "</option>";
        });

        html += "</select></div>";
        return html;
    }

    module("JIRA.Project.ProjectTypeField", {
        setup: function setup() {
            this.$field = $(createField());
            $('#qunit-fixture').append(this.$field);

            new ProjectTypeField({
                el: this.$field
            });

            this.changeProjectType = function (value) {
                this.$field.find(".drop-menu").click();
                $("#projectTypeKey-suggestions").find("li.aui-list-item-li-" + value).click();
            };
        },

        teardown: function teardown() {
            $("#aui-flag-container").remove();
            $("#projectTypeKey-suggestions").parent().remove();
        }
    });

    function projectTypeFlagShowing() {
        var flag = $("#aui-flag-container").find(".aui-flag");

        return flag && flag.attr('aria-hidden') === "false";
    }

    test("Converts the project type select to a SingleSelect", function () {
        ok(this.$field.find("#projectTypeKey-field"), "Should have created it's own single select field");
        ok(this.$field.find("#projectTypeKey").hasClass("aui-ss-select"), "Should have modified the original select box");
    });

    test("Changing to a different project type opens a flag, checking warnable working for it", function () {
        this.changeProjectType(PROJECT_TYPE_OPTIONS[1]);

        ok(projectTypeFlagShowing(), "Should have a flag with the message");
    });
});