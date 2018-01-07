define('jira/viewissue/watchers-voters/views/abstract-watchers-view', ['require'], function (require) {
    var AuiMessages = require('aui/message');
    var Backbone = require('backbone');
    var _ = require('underscore');
    var jQuery = require('jquery');

    var Deferred = require('jira/jquery/deferred');

    var formatter = require('jira/util/formatter');

    /**
     * Views for watchers
     * @class AbstractWatchersView
     * @extends Backbone.View
     * @abstract
     */
    return Backbone.View.extend({
        $empty: undefined,

        renderNoWatchers: function renderNoWatchers() {
            if (this.$(".recipients li").length === 0) {
                this.$empty = AuiMessages.info({
                    closeable: false,
                    body: formatter.I18n.getText("watcher.manage.nowatchers")
                });
                this.$("fieldset").append(this.$empty);
            } else if (this.$empty) {
                this.$empty.remove();
            }
        },

        /**
         * Goes to server to get watchers before rendering contents
         *
         * @return {jQuery.Deferred}
         */
        render: function render() {
            var deferred = Deferred();
            this.collection.fetch().done(_.bind(function () {
                this._render();
                this.renderNoWatchers();
                deferred.resolve(this.$el);
                setTimeout(_.bind(function () {
                    this.focus();
                }, this), 0);
            }, this));
            return deferred.promise();
        },

        watch: function watch() {
            jQuery("#watching-toggle").text(formatter.I18n.getText("issue.operations.simple.stopwatching"));
        },

        unwatch: function unwatch() {
            jQuery("#watching-toggle").text(formatter.I18n.getText("issue.operations.simple.startwatching"));
        },

        /**
         * Focuses input field
         * @abstract
         * @function
         */
        focus: jQuery.noop,

        /**
         * Increments watcher count by 1
         * @private
         */
        _incrementWatcherCount: function _incrementWatcherCount() {
            var $el = jQuery("#watcher-data");
            var currentCount = parseInt($el.text(), 10);
            $el.text(currentCount + 1);
            this.renderNoWatchers();
        },

        /**
         * Decrements watcher count by 1
         * @private
         */
        _decrementWatcherCount: function _decrementWatcherCount() {
            var $el = jQuery("#watcher-data");
            var currentCount = parseInt($el.text(), 10);
            $el.text(currentCount - 1);
            this.renderNoWatchers();
        }
    });
});