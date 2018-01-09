define('jira/ajs/avatarpicker/avatar-util', ['jira/util/urls', 'jira/util/logger', 'jira/attachment/inline-attach', 'jquery'], function (urls, logger, InlineAttach, jQuery) {
    var AvatarUtil = {

        uploadUsingIframeRemoting: function uploadUsingIframeRemoting(url, field, options) {
            options = options || {};

            var fileName = field.val();
            var form = new InlineAttach.Form(new InlineAttach.FileInput(field, false));
            var progress = form.addStaticProgress(fileName);

            //Add a new "File Input" to the form. We use the old input as part of a hidden form that we can submit to the
            //server in the background.
            var $oldInput = form.cloneFileInput();

            form.fileSelector.clear();

            //We only show progress after we are sure the upload will take longer than AJS.InlineAttach.DISPLAY_WAIT.
            var timer = new InlineAttach.Timer(function () {
                !this.cancelled && progress.show();
            }, this);

            var upload = new InlineAttach.FormUpload({
                $input: $oldInput,
                url: url,
                params: jQuery.extend({}, options.params, {
                    filename: fileName,
                    atl_token: urls.atl_token()
                }),
                scope: this,
                before: function before() {
                    !this.cancelled && progress.start();
                },
                success: function success(val, status) {
                    if (val.errorMessages && val.errorMessages.length) {
                        form.addErrorWithFileName(val.errorMessages[0], fileName, AvatarUtil.getErrorTarget(form));
                    } else if (options.success) {
                        options.success(val, status);
                    }
                },
                error: function error(text) {

                    logger.log(text);

                    if (this.cancelled) {
                        return;
                    }

                    if (text.indexOf("SecurityTokenMissing") >= 0) {
                        form.addError(InlineAttach.Text.tr("upload.xsrf.timeout", fileName), AvatarUtil.getErrorTarget(form));
                    } else {
                        form.addError(InlineAttach.Text.tr("upload.error.unknown", fileName), AvatarUtil.getErrorTarget(form));
                    }
                },
                after: function after() {

                    timer.cancel();
                    progress.remove();

                    if (!this.cancelled) {
                        form.enable();
                    }
                }
            });

            progress.onCancel(function () {
                upload.abort();
            });

            upload.upload();
        },

        uploadUsingFileApi: function uploadUsingFileApi(url, field, options) {
            var timer;
            var upload;
            var cancelled;
            var file = field[0].files[0];
            var form = new InlineAttach.Form(new InlineAttach.FileInput(field, false));
            var _progress = form.addProgress(file);

            options = options || {};

            //We only show progress after we are sure the upload will take longer than AJS.InlineAttach.DISPLAY_WAIT.
            timer = new InlineAttach.Timer(function () {
                if (!cancelled) {
                    _progress.show();
                }
            });

            upload = new InlineAttach.AjaxUpload({
                file: file,
                params: jQuery.extend({}, options.params, {
                    filename: file.name,
                    size: file.size,
                    atl_token: urls.atl_token()
                }),
                scope: this,
                url: url,
                before: function before() {
                    field.hide();
                    !cancelled && _progress.start();
                },
                progress: function progress(val) {
                    _progress.progress.$progress.parent().parent().show();
                    !cancelled && _progress.update(val);
                },
                success: function success(val, status) {

                    if (cancelled) {
                        return;
                    }

                    if (val.errorMessages && val.errorMessages.length) {
                        form.addErrorWithFileName(val.errorMessages[0], file.name, AvatarUtil.getErrorTarget(form));
                    } else if (status === 201) {
                        options.success(val, status);
                    }
                },
                error: function error(text, status) {

                    if (status < 0) {
                        //This is a client error so just render it.
                        form.addError(text, AvatarUtil.getErrorTarget(form));
                    } else {
                        form.addError(InlineAttach.Text.tr("upload.error.unknown", file.name), AvatarUtil.getErrorTarget(form));
                    }

                    if (options.error) {
                        options.error(text, status);
                    }
                },
                after: function after() {
                    timer.cancel();
                    _progress.finish().remove();
                    field.val("").show();
                }
            });

            upload.upload();

            _progress.onCancel(function () {
                upload.abort();
            });
        },

        getErrorTarget: function getErrorTarget(form) {
            return {
                $element: form.$form.find(".error")
            };
        },

        /**
         * Uploads temporary avatar using progress bars (if file API supported)
         *
         * @param {String} url - url to upload to, must accept any type, multipart etc
         * @param {HTMLElement} field - file input field containing file path
         * @param options
         * ... {Function} success
         * ... {Function} error
         * ... {Object} params additional query params to use in the upload request
         */
        uploadTemporaryAvatar: function uploadTemporaryAvatar(url, field, options) {
            if (InlineAttach.AjaxPresenter.isSupported(field)) {
                this.uploadUsingFileApi(url, field, options);
            } else {
                this.uploadUsingIframeRemoting(url, field, options);
            }
        }
    };

    return AvatarUtil;
});