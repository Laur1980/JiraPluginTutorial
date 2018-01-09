define('jira/viewissue/comment/comment-form', ['jira/util/formatter', 'jira/util/events', 'jira/util/events/types', 'jira/ajs/ajax/smart-ajax', 'jira/issue', 'jira/dialog/form-dialog', 'wrm/context-path', 'jira/jquery/deferred', 'jquery'], function (formatter, Events, Types, SmartAjax, IssueApi, FormDialog, wrmContextPath, Deferred, $) {
    var contextPath = wrmContextPath();

    var commentForm = {
        /**
         * Cancels a comment. This means clearing the text area, resetting the
         * dirty state for the closes form, and collapsing the comment box.
         *
         * If comment preview mode is enabled, this function disables it before
         * attempting to clear the comment textarea.
         */
        setCaretAtEndOfCommentField: function setCaretAtEndOfCommentField() {
            var $field = this.getField();
            var field = $field[0];
            var length;
            if ($field.length) {
                length = $field.val().length;
                $field.scrollTop($field.attr("scrollHeight"));
                if (field.setSelectionRange && length > 0) {
                    field.setSelectionRange(length, length);
                }
            }
        },

        /**
         * When we submit disable all the fields to avoid mods and double submit
         */
        disable: function disable() {
            this.getForm().find("textarea").attr("readonly", "readonly");
            this.getForm().find("input[type=submit]").attr("disabled", "disabled");
        },

        /**
         * Check if value has changed
         *
         * @return {Boolean}
         */
        isDirty: function isDirty() {
            var field = this.getField();
            if (field.length) {
                return field[0].value !== field[0].defaultValue;
            }
            return false;
        },

        /**
         * Construct a dirty comment warning if the comment form is dirty.
         *
         * @returns {string|undefined} A dirty comment warning or undefined.
         */
        handleBrowseAway: function handleBrowseAway() {
            // If the form isn't dirty, no point continuing.
            if (!commentForm.isDirty()) return;

            // If the form isn't visible, then don't show a dirty warning. This
            // is particularly important for the issue search single-page-app.
            var form = commentForm.getForm();
            var isVisible = form.length && form.is(":visible");

            if (isVisible) {
                return formatter.I18n.getText("common.forms.dirty.comment");
            }
        },

        isVisibilityAvailble: function isVisibilityAvailble() {
            return this.getForm().find("#commentLevel :selected").val() != 'none';
        },

        setSubmitState: function setSubmitState() {
            if ($.trim(this.getField().val()).length > 0 && this.isVisibilityAvailble()) {
                this.getForm().find("#issue-comment-add-submit").removeAttr("disabled");
            } else {
                this.getForm().find("#issue-comment-add-submit").attr("disabled", "disabled");
            }
        },

        /**
         * Enables the comment form
         */
        enable: function enable() {
            this.getForm().find("textarea").removeAttr("readonly");
            this.getForm().find("input[type=submit]").removeAttr("disabled");
        },

        /**
         * Get comment visibility permission.
         *
         * @return {Object} -- null if no value has been selected
         */
        getCommentVisibility: function getCommentVisibility() {
            var visibility = this.getForm().find("#commentLevel :selected").val();
            if (visibility) {
                var split_v = visibility.split(':');
                return {
                    "type": split_v[0],
                    "value": this.getForm().find("#commentLevel :selected").text()
                };
            }
            return null;
        },

        /**
         * Submits comments via ajax, used in kickass
         * @returns {$.Deferred}
         */
        ajaxSubmit: function ajaxSubmit() {
            var $loading = $('<span class="icon throbber loading"></span>');
            var issueId = IssueApi.getIssueId();
            var issueKey = IssueApi.getIssueKey();
            var restURL = contextPath + "/rest/api/2/issue/" + issueKey + "/comment";
            //build rest request
            var newComment = {
                // set line ending to CRLF for consistency with other comment methods
                // for example: add comment in new tab (midlde click), add comment in edit issue, or edit comment - they all use CRLF
                "body": this.getField()[0].value.replace(/\r?\n/g, "\r\n")
            };
            var visibility = this.getCommentVisibility();
            if (visibility) {
                newComment["visibility"] = visibility;
            }

            var updateDone = Deferred();
            var result = $.ajax({
                url: restURL,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(newComment),
                success: function success(data) {
                    Events.trigger(Types.UNLOCK_PANEL_REFRESHING, ["addcommentmodule"]);
                    Events.trigger(Types.REFRESH_ISSUE_PAGE, [issueId, {
                        complete: function complete() {
                            //highlight comment, set anchor
                            var newCommentId = "comment-" + data.id;
                            //Do not append the hash to the url (to let browser scroll the element into view)
                            //Appending the hash will add a new history point and as of 6.0 it will be incompatible,
                            //as back/forward button will be navigation between issues, instead of the states in the current issue.
                            //Instead manually scroll the element into view
                            $("#" + newCommentId).scrollIntoView({
                                marginBottom: 200,
                                marginTop: 200
                            });
                            //remove the focusing from any other comments
                            var $focusedTabs = $("#issue_actions_container > .issue-data-block.focused");
                            $focusedTabs.removeClass("focused");
                            var $newfocusedTab = $("#" + newCommentId);
                            //assume only one focused comment
                            $newfocusedTab.addClass("focused");
                            $loading.remove();
                            // Re-enable the comment form after successful complete in preparation for future use.
                            commentForm.enable();
                            // Signal the update was successful
                            updateDone.resolve();
                        }
                    }]);
                },
                error: function error(xhr) {
                    function buildErrorDialog(errorMessage) {
                        var errorContent = '<h2>' + formatter.I18n.getText("common.words.error") + '</h2>' + '<div class="ajaxerror">' + '<div class="aui-message error">' + '<span class="aui-icon icon-warning"/>' + errorMessage + '</div>' + '</div>';
                        return $(errorContent);
                    }

                    var response = $.parseJSON(xhr.responseText);
                    var content;
                    if (response && response.errors && response.errors.comment) {
                        content = buildErrorDialog(response.errors.comment);
                    } else {
                        content = SmartAjax.buildDialogErrorContent(xhr);
                    }
                    new FormDialog({
                        content: content
                    }).show();
                    $loading.remove();
                    commentForm.enable();
                    updateDone.reject();
                }
            });
            var $buttonContainer = this.getForm().find("input[type=submit]").parent();
            if ($buttonContainer.is(".wiki-button-bar-content")) {
                $loading.css("margin-right", "10px").prependTo($buttonContainer);
            } else {
                $loading.appendTo($buttonContainer);
            }

            return $.when(result, updateDone);
        },

        /**
         * Gets form from dom or cached one
         *
         * @return {jQuery}
         */
        getForm: function getForm() {
            var $form = $("form#issue-comment-add");
            if ($form.length === 1) {
                // on page load or panels have been refeshed and we have another comment form
                this.$form = $form;
            }
            return this.$form || $();
        },

        /**
         * Gets the comment textarea
         * @return {jQuery}
         */
        getField: function getField() {
            return this.getForm().find("#comment");
        },

        getSubmitButton: function getSubmitButton() {
            return this.getForm().find("#issue-comment-add-submit");
        },

        /**
         * Hides form by removing it from dom
         *
         * @param cancel
         */
        hide: function hide(cancel) {
            if (cancel) {
                this.cancel();
            }
            this.getForm().detach();
            if (Types.UNLOCK_PANEL_REFRESHING) {
                // disable panel refreshing in kickass
                Events.trigger(Types.UNLOCK_PANEL_REFRESHING, ["addcommentmodule"]);
            }
        },

        /**
         * Focuses form
         */
        show: function show() {
            this.focus();
            if (Types.LOCK_PANEL_REFRESHING) {
                // disable panel refreshing in kickass
                Events.trigger(Types.LOCK_PANEL_REFRESHING, ["addcommentmodule"]);
            }
        },

        /**
         * Focuses field and puts cursor at end of text
         */
        focus: function focus() {
            this.focusField();
            this.setCaretAtEndOfCommentField();
        },

        focusField: function focusField() {
            this.getField().focus().trigger("keyup");

            this.getSubmitButton().scrollIntoView({
                marginBottom: 200
            });
        },

        /**
         *
         * @param e
         * @return {Boolean} - Did it show message or not
         */
        showNoCommentMsg: function showNoCommentMsg(e) {
            if (this.getField().val() === "") {
                $("#emptyCommentErrMsg").show();
                return true;
            }
        },
        /**
         * Cancels comment, removing the value from the textarea
         */
        cancel: function cancel() {
            var instance = this;
            // now clear the input value.  Need to do this in a timeout since FF 3.0 otherwise doesn't
            //clear things.
            setTimeout(function () {
                instance.getField().val('');
            }, 100);
            // JRADEV-3411: disable preview if necessary so the comment gets cleared properly
            $('#comment-preview_link.selected').click();
        }
    };

    return commentForm;
});

define('jira/viewissue/comment/footer-comment', ['jira/viewissue/comment/comment-form', 'jquery'], function (commentForm, $) {
    /**
     * This is used to control the logic of showing confirmation dialog.
     * If the comment form is being submitted, there should be no confirmation dialog appearing at all.
     * Its value will be changed when successfully submitting the form and start opening a new form.
     * @type {boolean}
     */
    var commentFormIsBeingSubmitted = false;
    var isInPreviewMode = false;

    var footerComment = {
        /**
         * Gets comment module
         * @return {jQuery}
         */
        getModule: function getModule() {
            return $("#addcomment");
        },
        /**
         * Is the comment area visible
         * @return {*}
         */
        isActive: function isActive() {
            return this.getModule().hasClass("active");
        },
        /**
         * Hides comment area
         *
         * @param cancel - clear textarea
         */
        hide: function hide(cancel) {
            if (this.isActive()) {
                var dirtyMessage = commentForm.handleBrowseAway();
                if (isInPreviewMode || commentFormIsBeingSubmitted || !dirtyMessage || confirm(dirtyMessage)) {
                    this.getModule().removeClass("active");
                    commentForm.hide(cancel);
                }
            }
        },
        ajaxSubmit: function ajaxSubmit() {
            commentFormIsBeingSubmitted = true;
            commentForm.ajaxSubmit().then(function () {
                footerComment.hide(true);
            });
        },
        /**
         * Shows comment area
         */
        show: function show() {
            if (!this.isActive()) {
                commentFormIsBeingSubmitted = false;
                this.getModule().addClass("active");
                this.appendForm();
                commentForm.show();
            } else {
                commentForm.focusField();
            }
        },
        /**
         * Appends form to correct location
         */
        appendForm: function appendForm() {
            this.getModule().find(".mod-content").append(commentForm.getForm());
        }
    };

    footerComment.setPreviewMode = function (isEnabled) {
        isInPreviewMode = Boolean(isEnabled);
    };

    return footerComment;
});