(function () {
    var $ = require('jquery');
    var sizes = require('jira/ajs/avatarpicker/avatar/sizes');
    var AvatarFactory = require('jira/ajs/avatarpicker/avatar-factory');
    var AvatarManagerFactory = require('jira/ajs/avatarpicker/avatar-manager-factory');
    var AvatarPickerFactory = require('jira/ajs/avatarpicker/avatar-picker-factory');
    var GravatarUtil = require('jira/ajs/avatarpicker/gravatar-util');

    AJS.namespace('JIRA.Avatar', null, require('jira/ajs/avatarpicker/avatar'));

    AJS.namespace('JIRA.Avatar.createCustomAvatar', null, AvatarFactory.createCustomAvatar);
    AJS.namespace('JIRA.Avatar.createSystemAvatar', null, AvatarFactory.createSystemAvatar);

    AJS.namespace('JIRA.Avatar.getSizeObjectFromName', null, sizes.getSizeObjectFromName);
    AJS.namespace('JIRA.Avatar.LARGE', null, sizes.LARGE);
    AJS.namespace('JIRA.Avatar.MEDIUM', null, sizes.MEDIUM);
    AJS.namespace('JIRA.Avatar.SMALL', null, sizes.SMALL);

    AJS.namespace('JIRA.AvatarManager', null, require('jira/ajs/avatarpicker/avatar-manager'));

    AJS.namespace('JIRA.AvatarManager.createUniversalAvatarManager', null, AvatarManagerFactory.createUniversalAvatarManager);
    AJS.namespace('JIRA.AvatarManager.createProjectAvatarManager', null, AvatarManagerFactory.createProjectAvatarManager);
    AJS.namespace('JIRA.AvatarManager.createUserAvatarManager', null, AvatarManagerFactory.createUserAvatarManager);

    AJS.namespace('JIRA.AvatarPicker', null, require('jira/ajs/avatarpicker/avatar-picker'));
    AJS.namespace('JIRA.AvatarPicker.ImageEditor', null, require('jira/ajs/avatarpicker/avatar-picker/image-editor'));

    AJS.namespace('JIRA.AvatarPicker.createUniversalAvatarPicker', null, AvatarPickerFactory.createUniversalAvatarPicker);
    AJS.namespace('JIRA.AvatarPicker.createProjectAvatarPicker', null, AvatarPickerFactory.createProjectAvatarPicker);
    AJS.namespace('JIRA.AvatarPicker.createUserAvatarPicker', null, AvatarPickerFactory.createUserAvatarPicker);
    AJS.namespace('JIRA.createUniversalAvatarPickerDialog', null, AvatarPickerFactory.createUniversalAvatarPickerDialog);
    AJS.namespace('JIRA.createProjectAvatarPickerDialog', null, AvatarPickerFactory.createProjectAvatarPickerDialog);
    AJS.namespace('JIRA.createUserAvatarPickerDialog', null, AvatarPickerFactory.createUserAvatarPickerDialog);

    AJS.namespace('JIRA.AvatarStore', null, require('jira/ajs/avatarpicker/avatar-store'));
    AJS.namespace('JIRA.AvatarUtil', null, require('jira/ajs/avatarpicker/avatar-util'));

    AJS.namespace('JIRA.GravatarUtil.showGravatarHelp', null, GravatarUtil.showGravatarHelp);

    $(function initAllAvatarPickerBehaviour() {
        // initialize user picker dialog
        AvatarPickerFactory.createUserAvatarPickerDialog({
            trigger: "#user_avatar_image",
            username: $("#avatar-owner-id").text(),
            defaultAvatarId: $("#default-avatar-id").text()
        });

        // Initialise gravatar help
        if ($('#gravatar_help_params')) {
            GravatarUtil.displayGravatarHelp();
        }
    });
})();