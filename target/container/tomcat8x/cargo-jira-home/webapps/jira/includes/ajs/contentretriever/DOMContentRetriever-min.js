define("jira/ajs/contentretriever/dom-content-retriever",["jira/ajs/contentretriever/content-retriever","jquery"],function(e,t){return e.extend({init:function(e){this.$content=t(e)},content:function(e){return t.isFunction(e)&&e(this.$content),this.$content}})}),AJS.namespace("AJS.DOMContentRetriever",null,require("jira/ajs/contentretriever/dom-content-retriever"));