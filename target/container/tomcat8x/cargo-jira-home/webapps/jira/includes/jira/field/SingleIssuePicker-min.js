define("jira/field/single-issue-picker",["wrm/context-path","jira/util/formatter","jira/ajs/select/single-select","jira/ajs/list/group-descriptor","jira/ajs/list/item-descriptor","jira/ajs/ajax/smart-ajax","jira/libs/parse-uri","jquery"],function(t,e,s,r,i,n,a,o){"use strict";return s.extend({_formatResponse:function(e){var s=[],n=function(){var t=a(window.location);return t.protocol+"://"+t.authority}();if(e&&e.sections){var u=!1;o(e.sections).each(function(t,e){"hs"===e.id&&e.issues&&e.issues.length>0&&(u=!0)}),o(e.sections).each(function(e,a){if("cs"!==a.id||!u){var h=new r({weight:e,label:a.label,description:a.sub});a.issues&&a.issues.length>0&&o(a.issues).each(function(){h.addItem(new i({highlighted:!0,value:this.key,label:this.key+" - "+this.summaryText,icon:this.img?n+t()+this.img:null,html:this.keyHtml+" - "+this.summary}))}),s.push(h)}})}return s},_getDefaultOptions:function(){return o.extend(!0,this._super(),{ajaxOptions:{formatResponse:this._formatResponse.bind(this),error:function(){this.showErrorMessagePlain(this.buildHttpErrorMessage(arguments[3]))}.bind(this)}})},_createFurniture:function(t){this._super(t),this.$container.addClass("jira-issue-picker"),this.$container.addClass("hasIcon")},_setOptions:function(t){this._super(t);var e=this.options.skipKeys||"";this.options.ajaxOptions.data.currentJQL="",""!==e&&(this.options.ajaxOptions.data.currentJQL="issuekey not in ("+this.options.skipKeys+")")},setCurrentProjectId:function(t){this.options.ajaxOptions.data.currentProjectId=t},getQueryVal:function(){return o.trim(this.$field.val())},showErrorMessagePlain:function(t){var e=this.$container.parent(".field-group");return this.hideErrorMessage(),this.$errorMessage.text(t),1===e.length?void e.append(this.$errorMessage):(0===e.length&&(e=this.$container.parent(".frother-control-renderer")),1===e.length?void this.$errorMessage.prependTo(e):void(0===e.length&&this.$container.parent().append(this.$errorMessage)))},buildHttpErrorMessage:function(t){return t.statusText===n.SmartAjaxResult.TIMEOUT?e.I18n.getText("common.forms.ajax.timeout"):401===t.status?e.I18n.getText("common.forms.ajax.unauthorised.alert"):t.hasData?e.I18n.getText("common.forms.ajax.servererror"):e.I18n.getText("common.forms.ajax.commserror")}})});