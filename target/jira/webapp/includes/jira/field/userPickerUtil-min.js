define("jira/field/user-picker-util",["jira/ajs/list/item-descriptor","jira/ajs/list/group-descriptor","jquery"],function(e,i,r){return{formatResponse:function(t){var a=[];return r(t).each(function(t,l){var s=new i({weight:t,label:l.footer});r(l.users).each(function(){s.addItem(new e({value:this.name,label:this.displayName,html:this.html,icon:this.avatarUrl,allowDuplicate:!1,highlighted:!0}))}),a.push(s)}),a}}}),AJS.namespace("JIRA.UserPickerUtil",null,require("jira/field/user-picker-util"));