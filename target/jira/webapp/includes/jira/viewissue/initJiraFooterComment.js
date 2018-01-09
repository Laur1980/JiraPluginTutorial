define('jira/viewissue/init-comment-areas', ['require'], function (require) {
    var commentForm = require('jira/viewissue/comment/comment-form');
    var footerComment = require('jira/viewissue/comment/footer-comment');
    var IssueApi = require('jira/issue');
    var $ = require('jquery');
    var parseUri = require('jira/libs/parse-uri');

    var oldBeforeUnload = window.onbeforeunload;

    var commentArea = {};

    commentArea.openFooterComment = function openFooterComment() {
        footerComment.show();

        commentForm.getForm().find('#commentLevel').bind('change', function () {
            commentForm.setSubmitState();
        });
        commentForm.setSubmitState();
    };

    $(document)
    // issue comments are always ajax submitted
    .delegate("#addcomment #issue-comment-add", "submit", function (e) {
        footerComment.ajaxSubmit();
        e.preventDefault();
    })
    // show/hide of comment in header
    .delegate(".issue-header #comment-issue", "click", function (e) {
        footerComment.show();
        e.preventDefault();
    })
    // show/hide of comment in footer
    .delegate("#footer-comment-button", "click", function (e) {
        commentArea.openFooterComment();
        e.preventDefault();
    })
    // Cancel comment in footer
    .delegate("#addcomment .cancel", "click", function (e) {
        e.preventDefault();
        footerComment.hide(true);
    }).delegate("#issue-comment-add", "submit", function () {
        window.setTimeout(function () {
            // JRADEV-11111 - IE8 requires a timeout
            commentForm.disable();
        }, 0);
    }).delegate("#issue-comment-add #comment", "input", function () {
        commentForm.setSubmitState();
    }).delegate("#issue-comment-add input[type='submit']", "click", function (e) {
        if (commentForm.showNoCommentMsg()) {
            e.preventDefault();
        }
    }).bind("showWikiInput", function () {
        footerComment.setPreviewMode(false);
        var $commentField = commentForm.getField();
        if ($commentField.is(":visible:enabled")) {
            IssueApi.getStalker().trigger("stalkerHeightUpdated");
            if ($commentField.length > 0) {
                $commentField.focus();
            }
            commentForm.setCaretAtEndOfCommentField();
        }
    }).bind("showWikiPreview", function () {
        footerComment.setPreviewMode(true);
        IssueApi.getStalker().trigger("stalkerHeightUpdated");
    });

    // Why not just use jQuery I hear you say?? Well it doesn't work for IE!
    // JRADEV-11612
    window.onbeforeunload = function () {
        var oldResult = undefined;
        if ($.isFunction(oldBeforeUnload)) {
            oldResult = oldBeforeUnload.apply(this, arguments);
        }
        return oldResult || commentForm.handleBrowseAway.apply(this, arguments);
    };

    /**
     * Check for add-comment anchor and open the bottom comment box
     */
    $(function () {
        if (parseUri(window.location.href).anchor === "add-comment") {
            commentArea.openFooterComment();
        }
    });
});

define('jira/viewissue/invoke-comment-trigger', ['jquery'], function ($) {
    /**
     * Invoke the most appropriate comment trigger on page.
     * If the header toolbar trigger is present then invoke that.
     * Otherwise invoke the first link with ".add-issue-comment" class (needed for adding comments in Issue Nav list view).
     *
     * @note Used by keyboard shortcuts on the view issue page.
     *       Specifically, the 'm' keyboard shortcut.
     *
     */
    return function invokeCommentTrigger() {
        var addIssueComment = $(".add-issue-comment");
        if (addIssueComment.length === 0) {
            return;
        }

        var toolbarTrigger = addIssueComment.filter(".toolbar-trigger");
        if (toolbarTrigger.length > 0) {
            // Click issue page toolbar trigger if it's present.
            toolbarTrigger.click();
        } else {
            // Otherwise click the first link on page (needed for Issue Nav list view).
            addIssueComment.click();
        }
    };
});

(function () {
    var commentForm = require('jira/viewissue/comment/comment-form');
    AJS.namespace('JIRA.Issue.CommentForm', null, commentForm);
    AJS.namespace('JIRA.Issue.getDirtyCommentWarning', null, commentForm.handleBrowseAway);
    AJS.namespace('JIRA.Issue.invokeCommentTrigger', null, require('jira/viewissue/invoke-comment-trigger'));
})();