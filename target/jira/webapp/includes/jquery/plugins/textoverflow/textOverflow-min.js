/**
 * @preserve jQuery Text Overflow v0.7.4
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2011, Bram Stein
 * All rights reserved.
 */
!function(e){var t=document.documentElement.style,n="textOverflow"in t||"OTextOverflow"in t,o=function(e){return e.replace(/\s+$/g,"")},i=function(t,n,i){var d=0,l=[];return l.push(t.cloneNode(!1)),function e(t){var a,r=0,h=0;if(!(d>n))for(r=0;r<t.length;r+=1)1===t[r].nodeType?(a=t[r].cloneNode(!1),l[l.length-1].appendChild(a),l.push(a),e(t[r].childNodes),l.pop()):3===t[r].nodeType?(d+t[r].length<n?l[l.length-1].appendChild(t[r].cloneNode(!1)):(a=t[r].cloneNode(!1),h=n-d,i.wholeWord&&(h=Math.min(n-d,a.textContent.substring(0,n-d).lastIndexOf(" "))),a.textContent=i.trim?o(a.textContent.substring(0,h)):a.textContent.substring(0,h),l[l.length-1].appendChild(a)),d+=t[r].length):l.appendChild(t[r].cloneNode(!1))}(t.childNodes),e(l.pop().childNodes)};e.extend(e.fn,{textOverflow:function(t){var o=e.extend({str:"&#x2026;",autoUpdate:!1,trim:!0,title:!1,className:void 0,wholeWord:!1},t);return n?this:this.each(function(){var t=e(this),n=t.clone(),d=t.clone(),l=t.text(),a=t.width(),r=0,h=0,s=l.length,p=function(){a!==t.width()&&(t.replaceWith(d),t=d,d=t.clone(),t.textOverflow(e.extend({},o,{autoUpdate:!1})),a=t.width())};if(t.after(n.hide().css({position:"absolute",width:"auto",overflow:"visible","max-width":"inherit","min-width":"inherit"})),n.width()>a){for(;r<s;)h=Math.floor(r+(s-r)/2),n.empty().append(i(d.get(0),h,o)).append(o.str),n.width()<a?r=h+1:s=h;r<l.length&&(t.empty().append(i(d.get(0),r-1,o)).append(o.str),o.title&&t.attr("title",l),o.className&&t.addClass(o.className))}n.remove(),o.autoUpdate&&setInterval(p,200)})}})}(jQuery);