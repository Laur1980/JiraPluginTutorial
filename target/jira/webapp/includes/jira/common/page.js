define('jira/common/page', ['jira/util/logger', 'jquery'], function (logger, $) {
    var legacyPage = {
        relatedContentCssSelector: ".content-container > .content-related",
        mainContentCssSelector: ".content-container > .content-body"
    };

    var auiPage = {
        relatedContentCssSelector: ".aui-page-panel > .aui-page-panel-inner > .aui-page-panel-nav",
        mainContentCssSelector: ".aui-page-panel > .aui-page-panel-inner > .aui-page-panel-content"
    };

    var findEl = function findEl(prop) {
        var $el = $(legacyPage[prop]);
        if ($el.size()) {
            logger.log("This page is using a deprecated page layout markup pattern. It should be updated to use AUI page layout.");
        } else {
            $el = $(auiPage[prop]);
        }

        return $el;
    };

    var oldGlobal = JIRA && JIRA.Page;

    return $.extend({}, oldGlobal, legacyPage, auiPage, {
        relatedContentElement: function relatedContentElement() {
            return findEl('relatedContentCssSelector');
        },

        mainContentElement: function mainContentElement() {
            return findEl('mainContentCssSelector');
        }
    });
});

AJS.namespace('JIRA.Page', null, require('jira/common/page'));