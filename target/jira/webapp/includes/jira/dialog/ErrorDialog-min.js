define("jira/dialog/error-dialog",["jira/util/formatter","jira/dialog/dialog","jira/ajs/ajax/ajax-util","jira/lib/class","jira/util/browser","jquery"],function(r,o,e,i,a,n){var t=i.extend({init:function(e){var i,t=e.message||r.I18n.getText("common.forms.ajax.servererror");i=!e.mode||["warning","error","info"].indexOf(e.mode)<0?"error":e.mode,this.dialog=new o({id:"error-dialog",content:function(r){var o=n(JIRA.Templates.ErrorDialog.serverErrorModalDialog({message:t,mode:i}));o.find(".error-dialog-refresh").click(function(r){r.preventDefault(),a.reloadViaWindowLocation()}),r(o)}}),this.dialog.addHeading(r.I18n.getText("common.words.error")),this.dialog.handleCancel=n.noop},hide:function(){return this.dialog.hide(),this},show:function(){return this.dialog.show(),this}});return t.openErrorDialogForXHR=function(r){return new t({message:e.getErrorMessageFromXHR(r)}).show()},t}),AJS.namespace("JIRA.ErrorDialog",null,require("jira/dialog/error-dialog"));