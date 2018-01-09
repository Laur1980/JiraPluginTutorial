define('jira/dialog/init-profile-dialogs', ['jira/ajs/layer/layer-constants', 'jira/versionblocks/version-blocks', 'jira/dialog/user-profile-dialog', 'jira/dialog/edit-profile-dialog', 'jira/dialog/edit-preferences-dialog', 'jira/ajs/dropdown/dropdown', 'jquery', 'exports'], function (LayerConstants, VersionBlocks, UserProfileDialog, EditProfileDialog, EditPreferencesDialog, Dropdown, jQuery, exports) {
    'use strict';

    function initQuickLinks() {
        var $quicklinks = jQuery("#quicklinks");
        Dropdown.create({
            trigger: $quicklinks.find(".aui-dd-link"),
            content: $quicklinks.find(".aui-list"),
            alignment: LayerConstants.RIGHT
        });
    }

    exports.init = function () {
        initQuickLinks();
        VersionBlocks.init();

        new EditProfileDialog({
            trigger: "#edit_profile_lnk",
            autoClose: true
        });

        new UserProfileDialog({
            trigger: "#view_change_password",
            autoClose: true
        });

        new UserProfileDialog({
            trigger: "#view_clear_rememberme",
            autoClose: true
        });

        new EditPreferencesDialog({
            trigger: "#edit_prefs_lnk",
            autoClose: true
        });

        if (window.location.hash === "#change_password_now") {
            jQuery("#view_change_password").click();
        }
    };
});

require(['jira/dialog/init-profile-dialogs', 'jquery'], function (profileDialogs, jQuery) {
    'use strict';

    jQuery(function () {
        profileDialogs.init();
    });
});