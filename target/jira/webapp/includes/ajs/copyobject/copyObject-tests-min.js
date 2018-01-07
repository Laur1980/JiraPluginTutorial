AJS.test.require(["jira.webresources:util-lite"],function(){var e=require("jira/util/objects").copyObject;test("simple object",function(){var t={a:"def",b:1,c:1.3,d:null,e:NaN,f:!1,g:!0};deepEqual(e(t),t,"simple object with various types")}),test("nested object",function(){var t={a:"def",b:{c:"ghi"},e:!0};deepEqual(e(t),t,"nested object with siblings"),t={a:"def",b:{c:"ghi"}},deepEqual(e(t),t,"nested object with previous sibling"),t={b:{c:"ghi"},a:"def"},deepEqual(e(t),t,"nested object with following sibling"),t={b:{c:"ghi"}},deepEqual(e(t),t,"nested object with no siblings"),t={b:{c:"ghi"},d:{e:1}},deepEqual(e(t),t,"nested objects"),t={b:{c:{d:"ghi"}}},deepEqual(e(t),t,"deep nested object"),t={b:{c:{d:{e:"ghi"}}}},deepEqual(e(t),t,"deep deep nested object")}),test("nested object with deep===false",function(){var t={a:"def",b:1,c:1.3,d:null,e:NaN,f:!1,g:!0};deepEqual(e(t,!1),t,"simple object with various types"),deepEqual(e({a:"def",b:{c:"ghi"},e:!0},!1),{a:"def",e:!0},"nested object")}),test("nested arrays",function(){var t={a:[1,2,3]};deepEqual(e(t),t,"nested array"),t={a:[1,{b:{c:"def"}},3]},deepEqual(e(t),t,"nested array with object"),t={a:[1,{b:{c:[4,5,6]}},3]},deepEqual(e(t),t,"nested array with nested array"),t=[],t[0]=1,t[9]=9,t={a:t},deepEqual(e(t),t,"nested array with gap")}),test("array object",function(){var t=[1,2,3];deepEqual(e(t),t,"simple array")}),test("nested array with deep===false",function(){deepEqual(e({a:"def",b:[1,2,3],e:!0},!1),{a:"def",e:!0},"nested array")})});