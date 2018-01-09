define('jira/ajs/avatarpicker/avatar-picker', ['jira/util/logger', 'jira/util/formatter', 'jira/util/strings', 'jira/ajs/avatarpicker/avatar-picker/image-editor', 'jira/ajs/ajax/smart-ajax', 'jira/dialog/dialog', 'jira/ajs/control', 'aui/message', 'jquery'], function (logger, formatter, strings, ImageEditor, SmartAjax, Dialog, Control, AuiMessage, jQuery) {
    'use strict';

    /**
     * Creates/Renders avatar picker
     *
     * @class JIRA.AvatarPicker
     */

    return Control.extend({

        /**
         * @constructor
         * @param {Object} options
         * ... {JIRA.AvatarManager or something that implements same interface} avatarManager
         * ... {JIRA.AvatarPicker.Avatar or something that implements same interface} avatarRenderer
         * ... {JIRA.Avatar.LARGE | JIRA.Avatar.MEDIUM | JIRA.Avatar.SMALL} size
         */
        init: function init(options) {
            this.avatarManager = options.avatarManager;
            this.avatarRenderer = options.avatarRenderer;
            this.imageEditor = options.imageEditor;
            this.size = options.size;
            this.selectCallback = options.select;
            this.cropperDialog = null;
            this.initialSelection = options.initialSelection;
        },

        /**
         * Renders avatar picker
         *
         * @param {Function} ready - a callback function that will be called when rendering is complete, the first
         * argument of this function will be the contents of the avatar picker. You can then append this element to wherever you
         * want the picker displayed
         */
        render: function render(ready) {

            var instance = this;

            // we need to go to the server and get all the avatars first
            this.avatarManager.refreshStore({

                success: function success() {
                    if (instance.cropperDialog instanceof Dialog) {
                        instance.cropperDialog.hide();
                        delete instance.cropperDialog;
                    }
                    instance.element = jQuery('<div id="jira-avatar-picker" />');

                    instance.element.html(JIRA.Templates.AvatarPicker.picker({
                        avatars: instance.avatarManager.getAllAvatarsRenderData(instance.size)
                    }));

                    instance._assignEvents("selectAvatar", instance.element.find(".jira-avatar button"));
                    instance._assignEvents("deleteAvatar", instance.element.find(".jira-delete-avatar"));
                    instance._assignEvents("uploader", instance.element.find("#jira-avatar-uploader"));

                    if (undefined !== instance.initialSelection) {
                        instance.getAvatarElById(instance.initialSelection).addClass("jira-selected-avatar");
                    }

                    // we are finished, call with picker contents
                    ready(instance.element);
                },
                error: function error(xhr, _error, textStatus, smartAjaxResult) {
                    instance.appendErrorContent(instance.element, smartAjaxResult);
                    ready(instance.element);
                }
            });
        },

        /**
         *
         * Gets the most useful error response from a smartAjaxResponse and appends it to the picker
         *
         * @param el
         * @param smartAjaxResult
         */
        appendErrorContent: function appendErrorContent(el, smartAjaxResult) {
            try {
                var errors = JSON.parse(smartAjaxResult.data);

                if (errors && errors.errorMessages) {
                    jQuery.each(errors.errorMessages, function (i, message) {
                        AuiMessage.error(el, {
                            body: strings.escapeHtml(message),
                            closeable: false,
                            shadowed: false
                        });
                    });
                } else {
                    el.append(SmartAjax.buildDialogErrorContent(smartAjaxResult, true));
                }
            } catch (e) {
                el.append(SmartAjax.buildDialogErrorContent(smartAjaxResult, true));
            }
        },

        /**
         * Saves temporary avatar and invokes cropper
         *
         * @param {HTMLElement} field
         */
        uploadTempAvatar: function uploadTempAvatar(field) {

            var instance = this;

            this.avatarManager.createTemporaryAvatar(field, {

                success: function success(data) {

                    if (data.id) {
                        // We have an avatar and don't need to crop
                        instance.render(function () {
                            instance.selectAvatar(data.id);
                        });
                    } else {
                        field.val("");

                        instance.cropperDialog = new Dialog({
                            id: "project-avatar-cropper",
                            width: 560,
                            content: function content(ready) {
                                var $el = instance.imageEditor.render(data);
                                function disableSubmitButton() {
                                    var $button = $el.find("input[type=submit]");
                                    var $loader = jQuery("<span class='icon throbber loading'></span>");
                                    $button.attr("aria-disabled", "true").attr("disabled", "");
                                    $button.before($loader);
                                    return function () {
                                        $loader.remove();
                                        $button.removeAttr("aria-disabled").removeAttr("disabled");
                                    };
                                }

                                instance.imageEditor.edit({
                                    confirm: function confirm(instructions) {
                                        var reEnableSubmit = disableSubmitButton();
                                        instance.avatarManager.createAvatarFromTemporary(instructions, {
                                            success: function success(data) {
                                                instance.render(function () {
                                                    instance.selectAvatar(data.id);
                                                });
                                            },
                                            error: reEnableSubmit
                                        });
                                    }
                                });
                                $el.find(".cancel").click(function () {
                                    instance.cropperDialog.hide();
                                });
                                ready($el);
                            }
                        });
                        instance.cropperDialog.bind("dialogContentReady", function () {
                            jQuery(instance).trigger(ImageEditor.LOADED);
                        });
                        instance.cropperDialog.bind("Dialog.hide", function () {
                            jQuery(instance).trigger(ImageEditor.DISMISSED);
                        });

                        instance.cropperDialog.show();
                    }
                },
                error: function error() {
                    logger.log(arguments);
                }
            });
        },

        /**
         * Gets avatar HTML element based on it's database id
         *
         * @param {String} id
         * @return {$}
         */
        getAvatarElById: function getAvatarElById(id) {
            return this.element.find(".jira-avatar[data-id='" + id + "']");
        },

        /**
         * Selects avatar
         *
         * @param {String} id - avatar id
         */
        selectAvatar: function selectAvatar(id) {
            var avatar = this.avatarManager.getById(id);
            var instance = this;

            this.avatarManager.selectAvatar(this.avatarManager.getById(id), {
                error: function error() {},
                success: function success() {

                    instance.getAvatarElById(id).remove();

                    if (instance.selectCallback) {
                        instance.selectCallback.call(instance, avatar, instance.avatarManager.getAvatarSrc(avatar, instance.size));
                    }
                }
            });
        },

        /**
         * Deletes avatar, shows confirmation before hand
         *
         * @param {String} id - avatar id
         */
        deleteAvatar: function deleteAvatar(id) {

            var instance = this;

            if (confirm(formatter.I18n.getText("avatarpicker.delete.avatar"))) {
                this.avatarManager.destroy(this.avatarManager.getById(id), {
                    error: function error() {},
                    success: function success() {
                        var selectedAvatar = instance.avatarManager.getSelectedAvatar();
                        var $avatar = instance.getAvatarElById(id);

                        $avatar.fadeOut(function () {
                            $avatar.remove();
                        });

                        // if the avatar we have deleted is the selected avatar, then we want to set the selected avatar to be
                        // the default. This is done automagically in AvatarStore.
                        if (selectedAvatar.getId() !== id) {

                            instance.getAvatarElById(selectedAvatar.getId()).addClass("jira-selected-avatar");

                            instance.selectCallback.call(instance, selectedAvatar, instance.avatarManager.getAvatarSrc(selectedAvatar, instance.size), true);
                        }
                    }
                });
            }
        },

        _events: {
            uploader: {
                change: function change(e, el) {
                    this.uploadTempAvatar(el);
                }
            },
            deleteAvatar: {
                click: function click(e, el) {
                    this.deleteAvatar(el.attr("data-id"));
                }
            },
            selectAvatar: {
                click: function click(e, el) {
                    // Don't select avatar if we click an overlay, such as delete icon
                    if (el[0].id === "select-avatar-button") {
                        this.selectAvatar(el.attr("data-id"));
                    }
                }
            }
        }
    });
});

define('jira/ajs/avatarpicker/avatar-picker/image-editor', ['jira/ajs/control', 'jquery'], function (Control, jQuery) {
    'use strict';

    /**
     * Handles cropping of avatar
     *
     * @class JIRA.AvatarPicker.ImageEditor
     *
     */

    var ImageEditor = Control.extend({
        /**
         * Renders cropper
         *
         * @param {Object} data
         * ... {Number} cropperOffsetX
         * ... {Number} cropperOffsetY
         * ... {Number} cropperWidth
         */
        render: function render(data) {
            this.element = jQuery('<div id="avatar-picker-image-editor"/>').html(JIRA.Templates.AvatarPicker.imageEditor(data));
            return this.element;
        },

        /**
         * Initializes cropper
         *
         * @param {Object} options
         * ... {Function} confirm
         * ... {Function} cancel
         * ... {Function} ready
         */
        edit: function edit(options) {
            var instance = this;
            var avator = this.element.find(".avataror");

            options = options || {};

            avator.unbind();
            avator.bind("AvatarImageLoaded", function () {
                if (options.ready) {
                    options.ready();
                }
            });

            avator.find("img").load(function () {
                avator.avataror({
                    previewElement: instance.element.find(".jira-avatar-cropper-header"),
                    parent: instance.element
                });
            });

            this.element.find("#avataror").submit(function (e) {

                e.preventDefault();

                if (options.confirm) {
                    options.confirm({
                        cropperOffsetX: jQuery("#avatar-offsetX").val(),
                        cropperOffsetY: jQuery("#avatar-offsetY").val(),
                        cropperWidth: jQuery("#avatar-width").val()
                    });
                }
            }).find(".cancel").click(function (e) {
                e.preventDefault();
                if (options.cancel) {
                    options.cancel();
                }
            });
        }

    });

    /**
     * Name of event fired when the image editor dialog is loaded and ready.
     */
    ImageEditor.LOADED = "imageEditorLoaded";

    /**
     * Name of event fired when the image editor dialog is dismissed/actioned and unloaded.
     */
    ImageEditor.DISMISSED = "imageEditorDismissed";

    return ImageEditor;
});

define('jira/ajs/avatarpicker/avatar-picker-factory', ['jira/util/browser', 'jira/util/formatter', 'jira/ajs/avatarpicker/avatar-picker', 'jira/ajs/avatarpicker/avatar-picker/image-editor', 'jira/ajs/avatarpicker/avatar-manager-factory', 'jira/ajs/avatarpicker/avatar/sizes', 'jira/dialog/form-dialog', 'wrm/context-path', 'wrm/data', 'jquery', 'exports'], function (browser, formatter, AvatarPicker, ImageEditor, AvatarManagerFactory, AvatarSize, FormDialog, wrmContextPath, wrmData, jQuery, exports) {
    'use strict';

    /**
     * Creates project avatar picker
     *
     * @param options
     * ... {String} projectKey
     *
     * @return JIRA.AvatarPicker
     */

    exports.createUniversalAvatarPicker = function createUniversalAvatarPicker(options) {
        return new AvatarPicker({
            avatarManager: AvatarManagerFactory.createUniversalAvatarManager({
                projectKey: options.projectKey,
                projectId: options.projectId,
                defaultAvatarId: options.defaultAvatarId,
                avatarType: options.avatarType
            }),
            initialSelection: options.initialSelection,
            imageEditor: new ImageEditor(),
            size: options.hasOwnProperty('avatarSize') ? options.avatarSize : AvatarSize.LARGE,
            select: options.select
        });
    };

    /**
     * Creates project avatar picker
     *
     * @param options
     * ... {String} projectKey
     *
     * @return JIRA.AvatarPicker
     */
    exports.createProjectAvatarPicker = function createProjectAvatarPicker(options) {
        return new AvatarPicker({
            avatarManager: AvatarManagerFactory.createProjectAvatarManager({
                projectKey: options.projectKey,
                projectId: options.projectId,
                defaultAvatarId: options.defaultAvatarId
            }),
            imageEditor: new ImageEditor(),
            size: AvatarSize.LARGE,
            select: options.select
        });
    };

    /**
     * Creates user avatar picker
     *
     * @param {Object} options
     * @param {String} options.username
     *
     * @return JIRA.AvatarPicker
     */
    exports.createUserAvatarPicker = function createUserAvatarPicker(options) {
        return new AvatarPicker({
            avatarManager: AvatarManagerFactory.createUserAvatarManager({
                username: options.username,
                defaultAvatarId: options.defaultAvatarId
            }),
            imageEditor: new ImageEditor(),
            size: AvatarSize.LARGE,
            select: options.select
        });
    };

    /**
     * Creates a project avatar picker dialog
     *
     * @param {Object} options
     * @param {HTMLElement | String} options.trigger - element that when clicked will bring up dialog
     * @param {String} options.projectKey
     * @param {String} options.projectId
     */
    exports.createUniversalAvatarPickerDialog = function createUniversalAvatarPickerDialog(options) {
        var lastSelection = options.initialSelection || options.defaultAvatarId;

        var projectAvatarDialog = new FormDialog({
            trigger: options.trigger,
            id: "project-avatar-picker",
            width: 600,
            stacked: true,
            content: function content(ready) {
                var avatarPicker;
                var $dialogWrapper;

                $dialogWrapper = jQuery('<div id="projectavatar-content-wrapper"/>');

                jQuery("<h2 />").text(options.title || formatter.I18n.getText('avatarpicker.project.title')).appendTo($dialogWrapper);

                avatarPicker = exports.createUniversalAvatarPicker({
                    projectKey: options.projectKey,
                    projectId: options.projectId,
                    defaultAvatarId: options.defaultAvatarId,
                    initialSelection: lastSelection,
                    avatarType: options.avatarType,
                    avatarSize: options.avatarSize,
                    select: function select(avatar, src, implicit) {
                        lastSelection = String(avatar.getId());

                        if (options.select) {
                            options.select.apply(this, arguments);
                        }
                        if (!implicit) {
                            projectAvatarDialog.hide();
                        }
                    }
                });

                avatarPicker.render(function (content) {
                    $dialogWrapper.append(content);
                    ready($dialogWrapper);
                });
            }
        });

        projectAvatarDialog._focusFirstField = function () {};
    };

    /**
     * Creates a project avatar picker dialog
     *
     * @param {Object} options
     * @param {HTMLElement | String} options.trigger - element that when clicked will bring up dialog
     * @param {String} options.projectKey
     * @param {String} options.projectId
     */
    exports.createProjectAvatarPickerDialog = function createProjectAvatarPickerDialog(options) {
        var projectAvatarDialog = new FormDialog({
            trigger: options.trigger,
            id: "project-avatar-picker",
            width: 600,
            stacked: true,
            content: function content(ready) {
                var avatarPicker;
                var $dialogWrapper;

                $dialogWrapper = jQuery('<div id="projectavatar-content-wrapper"/>');

                jQuery("<h2 />").text(formatter.I18n.getText('avatarpicker.project.title')).appendTo($dialogWrapper);

                avatarPicker = exports.createProjectAvatarPicker({
                    projectKey: options.projectKey,
                    projectId: options.projectId,
                    defaultAvatarId: options.defaultAvatarId,
                    select: function select(avatar, src, implicit) {
                        if (options.select) {
                            options.select.apply(this, arguments);
                        }
                        if (!implicit) {
                            projectAvatarDialog.hide();
                        }
                    }
                });

                avatarPicker.render(function (content) {
                    $dialogWrapper.append(content);
                    ready($dialogWrapper);
                });
            }
        });

        projectAvatarDialog._focusFirstField = function () {};
    };

    var avatarPickerData = wrmData.claim("jira.webresources:avatar-picker.data");

    /**
     * Creates a project avatar picker dialog
     *
     * @param {Object} options
     * @param {HTMLElement | String} options.trigger - element that when clicked will bring up dialog
     * @param {String} options.projectKey
     * @param {String} options.projectId
     */
    exports.createUserAvatarPickerDialog = function createUserAvatarPickerDialog(options) {

        if (avatarPickerData && avatarPickerData.isEnabled) {
            // SW-1977 - Defer and redirect to the Atlassian ID version.
            jQuery(options.trigger).click(function (e) {
                var href = wrmContextPath() + avatarPickerData.url;
                var separator = href.indexOf("?") > -1 ? "&" : "?";
                href += separator + "continue=" + encodeURIComponent(window.location.href);
                e.preventDefault();
                e.stopPropagation();
                browser.reloadViaWindowLocation(href);
            });
            return;
        }

        var userAvatarDialog = new FormDialog({
            trigger: options.trigger,
            id: "user-avatar-picker",
            width: 600,
            stacked: true,
            content: function content(ready) {
                var avatarPicker;
                var $dialogWrapper;

                $dialogWrapper = jQuery('<div id="useravatar-content-wrapper"/>');

                jQuery("<h2 />").text(formatter.I18n.getText('avatarpicker.user.title')).appendTo($dialogWrapper);

                avatarPicker = exports.createUserAvatarPicker({
                    username: options.username,
                    defaultAvatarId: options.defaultAvatarId,
                    select: function select(avatar, src, implicit) {

                        if (options.select) {
                            options.select.apply(this, arguments);
                        }

                        jQuery(".avatar-image").attr("src", src);

                        if (!implicit) {
                            userAvatarDialog.hide();
                        }
                    }
                });

                avatarPicker.render(function (content) {
                    $dialogWrapper.append(content);
                    ready($dialogWrapper);
                });
            }
        });
    };
});