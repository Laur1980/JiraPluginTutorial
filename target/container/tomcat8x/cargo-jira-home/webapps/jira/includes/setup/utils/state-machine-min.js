/*!
 @license
 Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

 Copyright (c) 2012, 2013, 2014, Jake Gordon and contributors

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 -----------------------------------------------------------------------------

 With changes from Atlassian:
 - wrapped as AMD module
 */
define("jira/state-machine",[],function(){var t={VERSION:"2.3.3",Result:{SUCCEEDED:1,NOTRANSITION:2,CANCELLED:3,PENDING:4},Error:{INVALID_TRANSITION:100,PENDING_TRANSITION:200,INVALID_CALLBACK:300},WILDCARD:"*",ASYNC:"async",create:function(n,e){var r="string"==typeof n.initial?{state:n.initial}:n.initial,a=n.terminal||n.final,i=e||n.target||{},o=n.events||[],u=n.callbacks||{},c={},s=function(n){var e=n.from instanceof Array?n.from:n.from?[n.from]:[t.WILDCARD];c[n.name]=c[n.name]||{};for(var r=0;r<e.length;r++)c[n.name][e[r]]=n.to||e[r]};r&&(r.event=r.event||"startup",s({name:r.event,from:"none",to:r.state}));for(var f=0;f<o.length;f++)s(o[f]);for(var l in c)c.hasOwnProperty(l)&&(i[l]=t.buildEvent(l,c[l]));for(var l in u)u.hasOwnProperty(l)&&(i[l]=u[l]);return i.current="none",i.is=function(t){return t instanceof Array?t.indexOf(this.current)>=0:this.current===t},i.can=function(n){return!this.transition&&(c[n].hasOwnProperty(this.current)||c[n].hasOwnProperty(t.WILDCARD))},i.cannot=function(t){return!this.can(t)},i.error=n.error||function(t,n,e,r,a,i,o){throw o||i},i.isFinished=function(){return this.is(a)},r&&!r.defer&&i[r.event](),i},doCallback:function(n,e,r,a,i,o){if(e)try{return e.apply(n,[r,a,i].concat(o))}catch(e){return n.error(r,a,i,o,t.Error.INVALID_CALLBACK,"an exception occurred in a caller-provided callback function",e)}},beforeAnyEvent:function(n,e,r,a,i){return t.doCallback(n,n.onbeforeevent,e,r,a,i)},afterAnyEvent:function(n,e,r,a,i){return t.doCallback(n,n.onafterevent||n.onevent,e,r,a,i)},leaveAnyState:function(n,e,r,a,i){return t.doCallback(n,n.onleavestate,e,r,a,i)},enterAnyState:function(n,e,r,a,i){return t.doCallback(n,n.onenterstate||n.onstate,e,r,a,i)},changeState:function(n,e,r,a,i){return t.doCallback(n,n.onchangestate,e,r,a,i)},beforeThisEvent:function(n,e,r,a,i){return t.doCallback(n,n["onbefore"+e],e,r,a,i)},afterThisEvent:function(n,e,r,a,i){return t.doCallback(n,n["onafter"+e]||n["on"+e],e,r,a,i)},leaveThisState:function(n,e,r,a,i){return t.doCallback(n,n["onleave"+r],e,r,a,i)},enterThisState:function(n,e,r,a,i){return t.doCallback(n,n["onenter"+a]||n["on"+a],e,r,a,i)},beforeEvent:function(n,e,r,a,i){if(!1===t.beforeThisEvent(n,e,r,a,i)||!1===t.beforeAnyEvent(n,e,r,a,i))return!1},afterEvent:function(n,e,r,a,i){t.afterThisEvent(n,e,r,a,i),t.afterAnyEvent(n,e,r,a,i)},leaveState:function(n,e,r,a,i){var o=t.leaveThisState(n,e,r,a,i),u=t.leaveAnyState(n,e,r,a,i);return!1!==o&&!1!==u&&(t.ASYNC===o||t.ASYNC===u?t.ASYNC:void 0)},enterState:function(n,e,r,a,i){t.enterThisState(n,e,r,a,i),t.enterAnyState(n,e,r,a,i)},buildEvent:function(n,e){return function(){var r=this.current,a=e[r]||e[t.WILDCARD]||r,i=Array.prototype.slice.call(arguments);if(this.transition)return this.error(n,r,a,i,t.Error.PENDING_TRANSITION,"event "+n+" inappropriate because previous transition did not complete");if(this.cannot(n))return this.error(n,r,a,i,t.Error.INVALID_TRANSITION,"event "+n+" inappropriate in current state "+this.current);if(!1===t.beforeEvent(this,n,r,a,i))return t.Result.CANCELLED;if(r===a)return t.afterEvent(this,n,r,a,i),t.Result.NOTRANSITION;var o=this;this.transition=function(){return o.transition=null,o.current=a,t.enterState(o,n,r,a,i),t.changeState(o,n,r,a,i),t.afterEvent(o,n,r,a,i),t.Result.SUCCEEDED},this.transition.cancel=function(){o.transition=null,t.afterEvent(o,n,r,a,i)};var u=t.leaveState(this,n,r,a,i);return!1===u?(this.transition=null,t.Result.CANCELLED):t.ASYNC===u?t.Result.PENDING:this.transition?this.transition():void 0}}};return t});