define('jira/field/status-category-single-select', ['jira/ajs/select/single-select', 'jquery'], function (SingleSelect, jQuery) {

    function getStatusCategoryIcon(descriptor) {
        var $icon = jQuery();
        var statusCategory;

        if (descriptor && descriptor.model) {
            statusCategory = jQuery.extend({}, descriptor.model().data());
            delete statusCategory['descriptor'];

            $icon = jQuery(JIRA.Template.Util.Issue.Status.issueStatus({
                issueStatus: {
                    name: descriptor.label(),
                    statusCategory: statusCategory
                },
                isCompact: true
            })).removeClass("jira-issue-status-lozenge-tooltip").removeAttr("title").removeAttr("data-tooltip");
        }

        return $icon;
    }

    return SingleSelect.extend({
        _hasIcon: function _hasIcon() {
            return this.$field.val() && this.$field.val() !== this.model.placeholder;
        },
        setSelection: function setSelection(descriptor) {
            this._super(descriptor);
            this.$container.find(".fake-ss-icon").remove();
            this.$container.append(getStatusCategoryIcon(descriptor).addClass("fake-ss-icon aui-ss-entity-icon"));
        },
        init: function init(options) {
            this._super(options);
            var oldRenderer = this.listController._renders.suggestion;
            this.listController._renders.suggestion = function hackyStatusCategorySuggestionRenderer(descriptor) {
                var listElem = oldRenderer.apply(this, arguments);
                listElem.find("a").prepend("&nbsp;").prepend(getStatusCategoryIcon(descriptor));
                return listElem;
            };
        },
        _renders: {
            entityIcon: function hackyStatusCategoryEntityIcon(descriptor) {
                return jQuery(); // no-op.
            }
        }
    });
});

AJS.namespace('JIRA.StatusCategorySingleSelect', null, require('jira/field/status-category-single-select'));