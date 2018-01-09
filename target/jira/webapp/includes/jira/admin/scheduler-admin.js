require(['jira/util/formatter', 'jquery', 'jira/dialog/form-dialog'], function (formatter, $, FormDialog) {
    "use strict";

    $(function () {
        $('.actions a.delete').each(function () {
            new FormDialog({
                trigger: '#' + this.id,
                autoClose: true
            });
        });
    });

    $(document).on("click", '.runners .actions .show-details', function () {
        var $this = $(this);
        var $rows = $('.job-details[data-runner-id="' + $this.data('runner-id') + '"]');

        if ($rows.length > 0) {
            if ($($rows[0]).hasClass('hidden')) {
                $rows.removeClass('hidden');
                $this.text(formatter.I18n.getText('common.words.show.less'));
            } else {
                $rows.addClass('hidden');
                $this.text(formatter.I18n.getText('common.words.show.more'));
            }
        }
    });
});