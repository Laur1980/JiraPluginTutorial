AJS.test.require(["jira.webresources:viewissue-watchers-and-voters"], function () {
    require(['jquery', 'jira/viewissue/watchers-voters/views/watchers-inline-dialog-view'], function (jQuery, WatchersInlineDialogView) {
        module("WatchersInlineDialogView", {
            setup: function setup() {
                jQuery('body').append('<div id="#watching-toggle" /> <div class=".icon" />');

                this.$el = jQuery('<div id="inline-dialog-watchers"><div class="aui-inline-dialog-contents"></div></div>');
                this.el = this.$el.get(0);

                this.watcher = new WatchersInlineDialogView({
                    el: this.el
                });
            }
        });

        test("When cancel is triggered it should hide the dialog", function () {
            this.watcher.contents('<div class="cancel"></div>');
            this.el.setAttribute('open', ''); // Let's pretend the Inline Dialog is open

            // trigger click on .cancel element
            this.$el.find('.cancel').click();

            ok(this.watcher.el.hasAttribute('open') === false, "After hide is called AUI Inline Dialog open property should be false");
        });

        test("When show is called it should change the open property to true", function () {
            this.el.removeAttribute('open'); // Ensure it's closed

            this.watcher.show();

            ok(this.watcher.el.hasAttribute('open') === true, "AUI Inline Dialog open property should be true");
        });

        test("When hide is called it should change the open property to false", function () {
            this.el.setAttribute('open', ''); // Let's pretend the Inline Dialog is open

            this.watcher.hide();

            ok(this.el.hasAttribute('open') === false, "AUI Inline Dialog open property should be false");
        });
    });
});