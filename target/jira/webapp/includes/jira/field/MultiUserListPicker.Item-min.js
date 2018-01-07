define("jira/field/multi-user-list-picker/item",["jira/util/data/meta","jira/util/strings","jira/ajs/control","jquery"],function(e,t,i,n){"use strict";return i.extend({init:function(e){this._setOptions(e),this.$lozenge=this._render("item"),this.$removeButton=this.$lozenge.find(".remove-recipient"),this._assignEvents("instance",this),this._assignEvents("lozenge",this.$lozenge),this._assignEvents("removeButton",this.$removeButton),this.$lozenge.prependTo(this.options.container)},_getDefaultOptions:function(){return{label:null,title:null,container:null,focusClass:"focused"}},_renders:{item:function(){var i,s=this.options.descriptor;return!0!==s.noExactMatch()?(i={escape:!1,username:s.value(),icon:s.icon(),displayName:t.escapeHtml(s.label())},n(JIRA.Templates.Fields.recipientUsername(i))):(i={email:s.value(),icon:e.get("default-avatar-url")},n(JIRA.Templates.Fields.recipientEmail(i)))}},_events:{instance:{remove:function(){this.$lozenge.remove()}},removeButton:{click:function(e){e.stopPropagation(),this.trigger("remove")}}}})});