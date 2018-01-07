/*!
 * parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 * MODIFIED BY ATLASSIAN
 */
define("jira/libs/parse-uri",function(){function r(e){for(var o=r.options,s=o.parser[o.strictMode?"strict":"loose"].exec(e),t={},i=14;i--;)t[o.key[i]]=s[i]||"";return t[o.q.name]={},t[o.key[12]].replace(o.q.parser,function(r,e,s){e&&(t[o.q.name][e]=s)}),t}return r.options={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},r}),AJS.namespace("parseUri",null,require("jira/libs/parse-uri"));