define("jira/ajs/select/multi-select/lozenge-group",["jira/ajs/group"],function(t){"use strict";return t.extend({keys:{Left:function(){this.index>0&&this.shiftFocus(-1)},Right:function(){this.index===this.items.length-1?this.items[this.index].trigger("blur"):this.shiftFocus(1)},Backspace:function(){var t=this.index;t>0?this.shiftFocus(-1):this.items.length>1&&this.shiftFocus(1),this.items[t].trigger("remove")},Return:function(){this.items[this.index].trigger("blur")},Del:function(){var t=this.index;t+1<this.items.length&&this.shiftFocus(1),this.items[t].trigger("remove")}}})}),AJS.namespace("AJS.MultiSelect.LozengeGroup",null,require("jira/ajs/select/multi-select/lozenge-group"));