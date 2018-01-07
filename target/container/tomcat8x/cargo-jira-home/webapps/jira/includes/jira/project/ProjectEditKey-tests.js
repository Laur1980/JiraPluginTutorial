AJS.test.require(["jira.webresources:edit-project-details"], function () {

    var $ = require('jquery');
    var _ = require('underscore');
    var ProjectEditKey = require('jira/project/project-edit-key');
    var ORIGINAL_KEY = "HSP5";

    module("JIRA.Project.ProjectEditKey", {
        setup: function setup() {
            this.$field = $(createField());
            $('#qunit-fixture').append(this.$field);
            this.createUnitUnderTest = function () {
                return new ProjectEditKey(this.$field, {
                    flagShowDelay: 0
                });
            };
        },

        teardown: function teardown() {
            $("#aui-flag-container").remove();
            $("#projectTypeKey-suggestions").parent().remove();
        }
    });

    function flagShowing() {
        var flag = $("#aui-flag-container").find(".aui-flag");

        return flag && flag.attr('aria-hidden') === "false";
    }

    function cancelFlag() {
        $("#aui-flag-container").find(".aui-flag a.cancel").click();
    }

    function closeFlag() {
        $("#aui-flag-container").find(".aui-icon.icon-close").click();
    }
    var PROJECT_TYPE_OPTIONS = ['business', 'software', 'service_desk'];

    function createField() {
        return '<div>' + '<input class="text" type="text" name="key" id="project-edit-key" value="' + ORIGINAL_KEY + '" maxlength="10">' + '<input type="hidden" id="edit-project-original-key" name="originalKey" value="' + ORIGINAL_KEY + '">' + '<input type="hidden" id="edit-project-key-edited" name="keyEdited" value="false">' + '</div>';
    }

    function projectTypeFlagShowing() {
        var flag = $("#aui-flag-container").find(".aui-flag");

        return flag && flag.attr('aria-hidden') === "false";
    }

    test("Initialise with different key, will show warning flag", function () {
        this.$field.find('#edit-project-original-key').val("HSP");
        var pek = this.createUnitUnderTest();
        ok(flagShowing(), "When having different project-key values during initialisation, shall show the warning flag");
    });

    test("Initialise with original key, does not show any flags", function () {
        var pek = this.createUnitUnderTest();
        ok(!flagShowing(), "No flag when the project-key value is the original one");
    });

    test("Change the key in the dialogue will pop the flag", function () {
        var pek = this.createUnitUnderTest();
        this.$field.find('#project-edit-key').val("lll");
        pek.checkModified();
        ok(flagShowing(), "Flag showing after changing the project key");
        equal(this.$field.find('#edit-project-key-edited').val(), "true", "mark the project-key as edited");
    });

    test("Change the key to its original value will remove the flag ", function () {
        var pek = this.createUnitUnderTest();
        this.$field.find('#project-edit-key').val("lll");
        pek.checkModified();
        ok(flagShowing(), "Flag showing after changing the project key");
        this.$field.find('#project-edit-key').val(ORIGINAL_KEY);
        pek.checkModified();
        ok(!flagShowing(), "No flag when the project-key value is the original one");
        equal(this.$field.find('#edit-project-key-edited').val(), "false", "mark the project-key as edited");
    });

    test("Closing the flag will not show up again even when matching the original key", function () {
        var pek = this.createUnitUnderTest();
        this.$field.find('#project-edit-key').val("lll");
        pek.checkModified();
        ok(flagShowing(), "Flag showing after changing the project key");
        closeFlag();
        this.$field.find('#project-edit-key').val("ORIGINAL_KEY");
        pek.checkModified();
        ok(!flagShowing(), "No flag when the project-key value is the original one");
        this.$field.find('#project-edit-key').val("HS");
        pek.checkModified();
        ok(!flagShowing(), "No flag when it has been dismissed by user");
    });

    test("Change the key in the dialogue will pop the flag", function () {
        var pek = this.createUnitUnderTest();
        this.$field.find('#project-edit-key').val("lll");
        pek.checkModified();
        ok(flagShowing(), "Flag showing after changing the project key");
        equal(this.$field.find('#edit-project-key-edited').val(), "true", "mark the project-key as edited");
        cancelFlag();
        pek.checkModified();
        equal(this.$field.find('#edit-project-key-edited').val(), "false", "now the project-key is not marked as modified after flag-reset-value");
        equal(this.$field.find('#project-edit-key').val(), ORIGINAL_KEY, "the project key has the original value after flag-reset-value");
        ok(!flagShowing(), "No flag when the project-key value is the original one");
    });
});