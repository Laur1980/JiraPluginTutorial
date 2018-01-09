AJS.test.require(["jira.webresources:edit-project-details"], function () {

    var $ = require('jquery');
    var _ = require('underscore');
    var EditProjectDetails = require('jira/project/edit/project-category-field');

    var PROJECT_CATEGORY_OPTIONS = ["a", "b", "c", "d"];

    function createField() {
        var html = '<div><select class="select" name="projectCategoryId" id="project-category-selector">';

        _.each(PROJECT_CATEGORY_OPTIONS, function (option) {
            html += '<option value="' + option + '">' + option + "</option>";
        });

        html += "</select></div>";
        return html;
    }

    module("JIRA.Project.ProjectTypeField", {
        setup: function setup() {
            this.$field = $(createField());
            $('#qunit-fixture').append(this.$field);

            new EditProjectDetails({
                el: this.$field
            });

            this.changeProjectCategory = function (value) {
                this.$field.find(".drop-menu").click();
                $("#projectTypeKey-suggestions").find("li.aui-list-item-li-" + value).click();
            };
        },

        teardown: function teardown() {
            $("#project-category-selector-suggestions").parent().remove();
        }
    });

    test("Converts the project type select to a SingleSelect", function () {
        ok(this.$field.find("#project-category-selector-field"), "Should have created it's own single select field");
        ok(this.$field.find("#project-category-selector").hasClass("aui-ss-select"), "Should have modified the original select box");
    });
});