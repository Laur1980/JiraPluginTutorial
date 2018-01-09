require(['jquery'], function ($) {
    'use strict';

    $(function () {
        var $buttons = $('#show-remaining-projects, #hide-remaining-projects');
        $buttons.on('click', function (e) {
            e.preventDefault(); // prevent the jump on click of <a>
            var show = this.id === 'show-remaining-projects' ? false : true;
            var $this = $(this);
            $this.addClass('hidden');
            $this.prevAll('ul.projects').find('li:gt(3)').toggleClass('hidden', show);
            $buttons.not(this).removeClass('hidden');
        });
    });
});