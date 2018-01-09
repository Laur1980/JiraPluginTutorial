require(['jira/util/formatter', 'jira/util/logger', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jira/ajs/ajax/smart-ajax', 'jquery'], function (formatter, logger, Events, Types, Reasons, SmartAjax, $) {
    $(document).on('simpleClick', '.collapsed-comments', function (e) {
        e.preventDefault();

        var collapsedLink = $(this);
        var collapsedLinkBlock = collapsedLink.closest('.message-container');
        var container = collapsedLink.closest('.issuePanelContainer');
        var module = collapsedLink.closest('.module');
        var numCommentsBefore = collapsedLinkBlock.prevAll('.activity-comment').length;
        var numCollapsed = collapsedLink.find('.show-more-comments').data('collapsed-count');

        showLoading();
        makeRequest();

        function showLoading() {
            collapsedLink.find('.show-more-comments').text(formatter.I18n.getText('common.concepts.loading'));
        }

        function makeRequest() {
            var url = collapsedLink.attr('href');
            SmartAjax.makeRequest({
                url: url,
                method: 'GET',
                headers: { "X-PJAX": true // needed for the ViewIssue action to return only the activity panel
                } }).done(showCollapsed);
        }

        function showCollapsed(html) {
            var commentsToShow = $(html).find('.activity-comment').slice(numCommentsBefore, numCommentsBefore + numCollapsed);
            collapsedLinkBlock.replaceWith(commentsToShow);
            logger.trace("jira.issue.comment.expanded");
            Events.trigger(Types.NEW_CONTENT_ADDED, [module, Reasons.panelRefreshed]);

            // Expand the twixi for the first comment
            container.find('.activity-comment:first').removeClass('collapsed').addClass('expanded');
        }
    });
});