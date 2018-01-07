define('jira/project/project-edit-key', ['jira/analytics', 'jira/util/key-code', 'jira/util/formatter', 'jira/lib/class', 'jquery', 'aui/flag', 'underscore',
// Needed for the inline dialog help
'aui/inline-dialog2'], function (analytics, keyCode, formatter, Class, jQuery, flag, _) {
    /**
     * @class ProjectEditKey
     * @extends Class
     */
    return Class.extend({
        init: function init(form, options) {
            this.options = _.defaults(options || {}, {
                flagShowDelay: 600
            });
            var $form = jQuery(form);
            var context = this;
            this.warningFlag = null;
            this.$input = $form.find("#project-edit-key");
            this.$initialKey = $form.find('#edit-project-original-key');
            this.$keyEdited = $form.find('#edit-project-key-edited');
            this.updateFlagDebounced = _.throttle(this.updateFlag, this.options.flagShowDelay, {
                leading: false,
                trailing: true
            });
            this.updateFlag();
            $form.find('#project-edit-key').on("remove", function () {
                context.cleanupFlag();
            });
        },
        checkModified: function checkModified() {
            this.updateFlagDebounced();
            this.$keyEdited.val(this._hasBeenModified().toString());
        },
        updateFlag: function updateFlag() {
            if (this._hasBeenModified()) {
                if (this.warningFlag == null) {
                    this.createFlag();
                }
            } else {
                this.cleanupFlag();
            }
        },
        cleanupFlag: function cleanupFlag() {
            if (this.warningFlag != null) {
                this.warningFlag.close();
                this.warningFlag = null;
            }
        },
        createFlag: function createFlag() {
            this.warningFlag = flag({
                type: 'warning',
                title: '',
                body: JIRA.Templates.Project.ChangeTriggeredFlag.fieldRevertWarning({
                    message: formatter.I18n.getText('admin.projects.edit.project.key.warning.message'),
                    revertMessage: formatter.I18n.getText("admin.projects.edit.project.warning.cancel")
                })
            });
            var context = this;
            jQuery(this.warningFlag).find('.cancel').click(function (event) {
                event.preventDefault();
                context._revert();
            });
            jQuery(this.warningFlag).find('.icon-close').click(function () {
                context.updateFlagDebounced = function () {};
                context.warningFlag = null;
            });
            jQuery(this.warningFlag).find('.icon-close').keypress(function (e) {
                if (e.which === keyCode.ENTER || e.which === keyCode.SPACE) {
                    context.updateFlagDebounced = function () {};
                    context.warningFlag = null;
                }
            });
        },
        _hasBeenModified: function _hasBeenModified() {
            return this.$initialKey.val() !== this.$input.val();
        },
        _revert: function _revert() {
            this.$input.val(this.$initialKey.val());
            this.updateFlag();

            analytics.send({
                name: "jira.administration.projectdetails.projectkeyupdate.cancelled"
            });
        }
    });
});

AJS.namespace('ProjectEditKey', null, require('jira/project/project-edit-key'));