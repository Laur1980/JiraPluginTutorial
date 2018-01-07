define('jira/ajs/select/security/default-comment-security-level-control', ['jira/util/formatter', 'jira/ajs/select/security/default-comment-security-level-model', 'jira/ajs/ajax/smart-ajax', 'jira/dialog/form-dialog', 'jira/lib/class', 'jquery', "underscore", "wrm/data"], function (formatter, DefaultCommentSecurityLevelModel, SmartAjax, FormDialog, Class, jQuery, _, wrmData) {
    'use strict';

    var helpLink = wrmData.claim('jira.webresources:default-comment-security-level.DefaultCommentSecurityLevelHelpLink');

    /**
     * Manages behaviour of default security level control
     *
     * @class DefaultCommentSecurityLevelControl
     * @extends Class
     */
    return Class.extend({

        /**
         * This is created to handle initial behaviour when default security level is loading
         *
         * @inner
         * @private
         * @class _InitialLoadDefaultLevelView
         */
        _InitialLoadDefaultLevelView: Class.extend({

            /**
             * Initialization method called during object creation
             *
             * @param {jQuery} $containerSpan - span that is managed by the view control {@see _createContainer}
             * @constructs
             * @see Class
             */
            init: function init($containerSpan) {
                this.$containerSpan = $containerSpan;
            },

            startLoading: function startLoading() {
                this.$containerSpan.html(JIRA.Templates.CommentSecurityLevel.initialLoadDefaultStart());
                this.$containerSpan.find('.default-comment-level-spinner').spin({ top: '0px', left: '0px' });
            },

            endLoading: function endLoading() {
                this.$containerSpan.find('.default-comment-level-load').addClass('hidden');
            }
        }),

        /**
         * Created to handle save operation of default security level
         * Manages animations and user interaction events as well as
         *
         * @inner
         * @private
         * @class _SaveDefaultLevelControl
         */
        _SaveDefaultLevelControl: Class.extend({

            /**
             * Initialization method called during object creation.
             * Puts UI controls for user actions (link to set default, help link).
             *
             * @param {jQuery} $containerSpan - container span to be used for view control {@see _createContainer}
             * @param {DefaultCommentSecurityLevelModel} defaultLevelModel - model for default level data management
             * @param {LvlObj} currentSelection - object containing current level selection
             * @constructs
             * @see Class
             */
            init: function init($containerSpan, defaultLevelModel, currentSelection) {
                this.$containerSpan = $containerSpan;
                this.defaultLevelModel = defaultLevelModel;
                this.currentSelection = currentSelection;

                this._putLinkToSetDefault();
                this._putHelpLink();
            },

            /**
             * Applies the link button for default level changing to $containerSpan {@see _createContainer}
             *
             * @private
             */
            _putLinkToSetDefault: function _putLinkToSetDefault() {
                this.$containerSpan.append(JIRA.Templates.CommentSecurityLevel.linkToSetDefault());
                this.$containerSpan.find('.default-comment-level-switch').bind('click', function (e) {
                    e.preventDefault();
                    this._onUpdateBegin();
                    this.defaultLevelModel.updateDefault(this.currentSelection, this._onUpdateSuccess.bind(this), this._onUpdateFail.bind(this));
                }.bind(this));
            },

            /**
             * Puts into $containerSpan the help link icon that on hover shows tooltip
             *
             * @private
             */
            _putHelpLink: function _putHelpLink() {
                this.$containerSpan.append(JIRA.Templates.Links.helpLink(helpLink));

                var helpElem = this.$containerSpan.find('.default-comment-level-help');
                helpElem.attr('title', formatter.I18n.getText('security.level.default.set.current.tooltip'));
                helpElem.tooltip({ trigger: 'hover', gravity: 'nw', fade: false });
            },

            /**
             * @callback StatusSpanData
             * @param {String} text - text to show in span
             * @param {String} status - status to put in span data argument
             * @param {String} span_classes - 1 line classes string appended to container span
             * @param {String} icon_classes - 1 line classes string appended to icon span
             * @param {String} text_classes - 1 line classes string appended to text span
             */

            /**
             * @param {StatusSpanData} data - information to put into status span (see type for details)
             * @private
             */
            _putStatusSpan: function _putStatusSpan(data) {
                this.$containerSpan.html(JIRA.Templates.CommentSecurityLevel.defaultLevelStatus(data));
                var $defaultLevelMessageStatus = this.$containerSpan.find('.default-comment-level-status');
                $defaultLevelMessageStatus.attr('status', data.status);
                setTimeout(function () {
                    $defaultLevelMessageStatus.addClass('fade-out');
                }, 2000);
            },

            /**
             * Called when save begins (button was clicked)
             * disables the link button and spins the spinner
             *
             * @private
             */
            _onUpdateBegin: function _onUpdateBegin() {
                this.$containerSpan.find('.default-comment-level-switch').addClass('disabled-link');
                if (this.$containerSpan.find('.default-comment-level-spinner').length === 0) {
                    this.$containerSpan.prepend(JIRA.Templates.CommentSecurityLevel.defaultLevelSpinner());
                    this.$containerSpan.find('.default-comment-level-spinner').spin();
                }
            },

            /**
             * Handles successful default level save event with green "done" word status messages that will fade out
             * Overwrites spinner
             *
             * @private
             */
            _onUpdateSuccess: function _onUpdateSuccess() {
                this._putStatusSpan({
                    text: formatter.I18n.getText('common.words.done'),
                    status: 'success',
                    span_classes: '',
                    icon_classes: 'aui-icon aui-icon-small aui-iconfont-approve',
                    text_classes: 'default-saved-message'
                });
            },

            /**
             * Shows error dialog on default level save fail event
             * Stops spinner spinning
             *
             * @param xhr
             * @private
             */
            _onUpdateFail: function _onUpdateFail(xhr) {
                new FormDialog({
                    content: SmartAjax.buildDialogErrorContent(xhr)
                }).show();
                this.$containerSpan.find('.default-comment-level-spinner').remove();
                this.$containerSpan.find('.default-comment-level-switch').removeClass('disabled-link');
            }
        }),

        /** @type {boolean} */enabled: true,
        /** @type {String} */projectId: null,
        /** @type {jQuery} */$rootSpan: null,
        /** @type {jQuery} */$errorSpan: null,
        /** @type {SecuritySelectAdapter} */selectionSpi: null,
        /** @type {DefaultCommentSecurityLevelModel} */defaultLevelModel: null,

        /**
         * Initialization method called during object creation
         *
         * @param {jQuery} $defaultCommentLevelSpan
         * @param {jQuery} $errorSpan
         * @param {SecuritySelectAdapter} selectionSpi
         * @constructs
         * @see Class
         */
        init: function init($defaultCommentLevelSpan, $errorSpan, selectionSpi) {
            this.$rootSpan = $defaultCommentLevelSpan;
            this.$errorSpan = $errorSpan;
            this.projectId = $defaultCommentLevelSpan.data('project-id');

            if (!_.isNumber(this.projectId)) {
                this.enabled = false;
                return;
            }

            this.selChanged = false;

            this.selectionSpi = selectionSpi;

            this.defaultLevelModel = new DefaultCommentSecurityLevelModel(this.projectId);
        },

        /**
         * After selection change by user we expect it to not overwrite by users default
         */
        selectionChanged: function selectionChanged() {
            this.selChanged = true;
        },

        /**
         * Starts to load default security level and applies it when success response comes back
         * Handles special cases like when user changes selection before default is applied
         *
         * @param {Boolean} apply - provides option to not apply the default level to selection (save button will still appear selection change)
         */
        loadAndApplyDefault: function loadAndApplyDefault(apply) {
            if (apply) {
                this.selectionSpi.selectUnavailble(formatter.I18n.getText('common.words.unknown'));
            }
            var $defaultCommentLevelContainer = this._createContainer();
            var initDefaultView = new this._InitialLoadDefaultLevelView($defaultCommentLevelContainer);
            initDefaultView.startLoading();
            this.defaultLevelModel.getDefault(function success(lvlObj) {
                if (!apply) {
                    this.selectionSpi.repickSelection(); // to refresh view
                } else if (!this.selChanged) {
                    this._applyDefaultToSelection(lvlObj);
                }
                initDefaultView.endLoading();
            }.bind(this), function error(xhr) {
                new FormDialog({
                    content: SmartAjax.buildDialogErrorContent(xhr)
                }).show();
                initDefaultView.endLoading();
            }.bind(this));
        },

        /**
         * Called to restore the selection view control to initial state
         * Applies default save button if current security level selection is different
         *
         * @param {ItemDescriptor} selectionDescriptor - descriptor selected with selection control (see implementation for details)
         */
        flushViewWithNewControl: function flushViewWithNewControl(selectionDescriptor) {
            var defaultLevel = this.defaultLevelModel.getCurrentDefault();
            if (defaultLevel && selectionDescriptor.value() != defaultLevel.level && selectionDescriptor.value() != 'none') {

                var $defaultCommentLevelContainer = this._createContainer();

                var currentSelection = new this.defaultLevelModel.LvlObj(selectionDescriptor.value(), selectionDescriptor.label());
                new this._SaveDefaultLevelControl($defaultCommentLevelContainer, this.defaultLevelModel, currentSelection);
            } else {
                this.$rootSpan.empty();
            }
            this.$errorSpan.empty();
        },

        /**
         * Changes selection of selection control by using its spi {@see selectionSpi}
         *
         * @param {LvlObj} lvlObj - object representing selection that should be applied as default
         * @private
         */
        _applyDefaultToSelection: function _applyDefaultToSelection(lvlObj) {
            if (!this.selectionSpi.hasSecurityLevel(lvlObj.level)) {
                this.selectionSpi.selectUnavailble(lvlObj.levelName);

                this.$errorSpan.html(JIRA.Templates.CommentSecurityLevel.unavailable({ 'name': lvlObj.levelName }));
            } else {
                this.selectionSpi.selectLevel(lvlObj.level);

                var presentLevelName = this.selectionSpi.getSelectedLevelName();

                if (presentLevelName != lvlObj.levelName) {
                    lvlObj.levelName = presentLevelName;
                    this.defaultLevelModel.updateDefault(lvlObj, function () {}, function () {});
                }
            }
        },

        /**
         * Creates new container element to hold inner managed by event handlers controls
         * This way we can remove it and don't care what was in it anymore
         *
         * @returns {jQuery}
         * @private
         */
        _createContainer: function _createContainer() {
            var $container = jQuery(JIRA.Templates.CommentSecurityLevel.defaultLevelContainer());
            this.$rootSpan.html($container);
            return $container;
        }

    });
});