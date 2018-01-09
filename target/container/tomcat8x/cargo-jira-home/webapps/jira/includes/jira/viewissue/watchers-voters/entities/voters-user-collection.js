define('jira/viewissue/watchers-voters/entities/voters-user-collection', ['jira/viewissue/watchers-voters/entities/user-collection'], function (WatchersAndVoterUsers) {

    return WatchersAndVoterUsers.extend({
        initialize: function initialize(issueKey) {
            // add options for the underlying Collection
            var options = { issueKey: issueKey, endpoint: "votes", modelKey: "voters" };
            // super initialize
            WatchersAndVoterUsers.prototype.initialize.apply(this, [options]);
        },

        vote: function vote() {
            return this.ajax({ type: "POST" });
        },

        unvote: function unvote() {
            return this.ajax({ type: "DELETE" });
        }
    });
});