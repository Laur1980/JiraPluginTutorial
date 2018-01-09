AJS.test.require(["jira.webresources:dialogs"],function(){function e(e){var a=e.context||l;l.showWebSudoDialog(e);var s=n;e.beforeShow&&(ok(e.beforeShow.calledOnce,"Before show called."),ok(e.beforeShow.firstCall.calledOn(a),"Show called with correct context.")),ok(s.show.calledOnce,"Dialog was shown."),e.beforeShow&&ok(e.beforeShow.calledBefore(s.show),"beforeShow called before show."),e.show&&(ok(e.show.calledOnce,"Show called."),ok(e.show.firstCall.calledOn(a),"Show called with correct context."),ok(e.show.calledAfter(s.show),"Show called after dialog shown."));var o=s.options.submitHandler,i=t.Event();i.target=t("<form></form>").attr("action","url").append("<input name='jack' value='jill'/>");var d=this.sandbox.spy(),r=this.sandbox.stub(l,"makeRequest");o(i,d),ok(i.isDefaultPrevented(),"Default operation prevented."),ok(r.calledOnce,"Made the request for the websudo dialog.");var c=r.firstCall.args[0];equal(c.url,i.target.attr("action"),"Correct Action"),equal(c.data,i.target.serialize(),"Correct Data"),equal(c.type,"POST","Correct type");var u=c.complete,h={getResponseHeader:this.sandbox.stub(),responseText:"callback"};u(h),ok(!d.called,"Close callback should not be called."),ok(!s.hide.called,"Dialog should not be closed."),e.success&&ok(!e.success.called,"Success function should not have been called."),ok(s._setContent.calledWith(h.responseText,!0),"Dialog content reset."),h.getResponseHeader.withArgs("X-Atlassian-WebSudo").returns("Has-Authentication"),u(h),e.success&&(ok(e.success.calledOnce,"Success called."),ok(!d.called,"Close callback should not be called."),ok(!s.hide.called,"Dialog should not be closed."),e.success.firstCall.args[0]()),ok(d.calledOnce,"Close callback should be called."),ok(s.hide.calledOnce,"Dialog should be closed.")}var t=require("jquery"),a=require("jira/dialog/dialog"),s=require("jira/dialog/form-dialog"),o=require("jira/util/browser"),l=require("jira/ajs/ajax/smart-ajax"),n=null;module("SmartAjax.showWebSudoDialog",{teardown:function(){this.sandbox.restore()},setup:function(){var e=this;n=null,this.sandbox=sinon.sandbox.create(),this.sandbox.stub(o,"reloadViaWindowLocation"),this.sandbox.stub(s.prototype,"show"),this.sandbox.stub(s.prototype,"hide"),this.sandbox.stub(s.prototype,"_setContent"),this.sandbox.stub(s.prototype,"init",function(e){this.options=e||{},n=this}),s.prototype.triggerHide=function(a){t(this).trigger("Dialog.hide",[{find:function(){return{attr:function(){return e.href}}}},a])}}}),test("not success callback",function(){e.call(this,{})}),test("beforeShow and show success callback",function(){e.call(this,{beforeShow:this.sandbox.stub(),show:this.sandbox.stub()})}),test("beforeShow and show success callback with context",function(){e.call(this,{beforeShow:this.sandbox.stub(),show:this.sandbox.stub(),context:{}})}),test("success callback with context",function(){e.call(this,{success:this.sandbox.stub(),context:{}})}),test("success callback without context",function(){e.call(this,{success:this.sandbox.stub()})}),test("all callbacks without context",function(){e.call(this,{beforeShow:this.sandbox.stub(),show:this.sandbox.stub(),success:this.sandbox.stub()})}),test("all callbacks with context",function(){e.call(this,{beforeShow:this.sandbox.stub(),show:this.sandbox.stub(),success:this.sandbox.stub(),context:{}})}),test("aborted no cancel",function(){l.showWebSudoDialog({});var e=n;ok(e.show.calledOnce,"Dialog was shown."),e.triggerHide(a.HIDE_REASON.cancel),e.triggerHide(a.HIDE_REASON.escape)});var i=function(e){o.reloadViaWindowLocation.reset(),this.href="i love web sudo";var t=this.sandbox.spy(),a={};l.showWebSudoDialog({cancel:t,context:a});var s=n;ok(s.show.calledOnce,"Dialog was shown."),s.triggerHide(e),ok(t.calledOnce,"Cancel trigger should be called once."),ok(t.alwaysCalledOn(a),"Called on right context."),ok(o.reloadViaWindowLocation.calledWithExactly(this.href))};test("aborted with cancel",function(){i.call(this,a.HIDE_REASON.cancel)}),test("aborted with escape",function(){i.call(this,a.HIDE_REASON.escape)}),test("can prevent redirect by e.preventDefault()",function(){o.reloadViaWindowLocation.reset(),l.showWebSudoDialog({cancel:function(e){e.preventDefault()}}),ok(!o.reloadViaWindowLocation.called)}),test("can prevent redirect by returning false",function(){o.reloadViaWindowLocation.reset(),l.showWebSudoDialog({cancel:function(){return!1}}),ok(!o.reloadViaWindowLocation.called)}),module("SmartAjax.handleWebSudoError",{teardown:function(){this.sandbox.restore()},setup:function(){this.sandbox=sinon.sandbox.create(),this.webSudo=require("jira/ajs/ajax/smart-ajax/web-sudo"),this.dialog=this.sandbox.stub(this.webSudo,"showWebSudoDialog"),this.makeRequest=this.sandbox.stub(l,"makeRequest")}}),test("success without delegating handler",function(){var e={},a={},s={};this.webSudo.handleWebSudoError(e,void 0,a,"something",s),ok(this.dialog.calledOnce,"Delgate to showWebSudoDialog");var o=this.dialog.args[0][0];ok(t.isFunction(o.success),"Provided success."),ok(t.isFunction(o.cancel),"Provided cancel.");var l=this.sandbox.spy();o.success.call(void 0,l),ok(l.calledOnce,"Make sure we close the dialog by default."),ok(this.makeRequest.calledOnce,"Make the request again, it might just work this time."),ok(this.makeRequest.calledWithExactly(e),"Make the request again, it might just work this time.")}),test("success with delegating handler",function(){var e=this.sandbox.spy(),a={},s={},o={};this.webSudo.handleWebSudoError(a,{success:e},s,"something",o),ok(this.dialog.calledOnce,"Delgate to showWebSudoDialog");var l=this.dialog.args[0][0];ok(t.isFunction(l.success),"Provided success."),ok(t.isFunction(l.cancel),"Provided cancel.");var n=this.sandbox.spy();l.success.call(void 0,n),ok(!n.calledOnce,"With a callback we don't close the dialog."),ok(this.makeRequest.calledOnce,"Make the request again, it might just work this time."),ok(this.makeRequest.calledWithExactly(a),"Make the request again, it might just work this time."),ok(e.calledOnce,"The success handler should have been called."),e.args[0][0](),ok(n.calledOnce,"The callback has now closed the dialog.")}),test("cancel wihtout handler",function(){var e={},a={},s={};this.webSudo.handleWebSudoError(e,void 0,a,"something",s),ok(this.dialog.calledOnce,"Delgate to showWebSudoDialog");var o=this.dialog.args[0][0];ok(t.isFunction(o.success),"Provided success."),ok(t.isFunction(o.cancel),"Provided cancel."),o.cancel.call(void 0)}),test("cancel with dialog Handler",function(){var e=this.sandbox.spy(),a={},s={},o={},l={};this.webSudo.handleWebSudoError(a,{cancel:e},s,"something",o),ok(this.dialog.calledOnce,"Delgate to showWebSudoDialog");var n=this.dialog.args[0][0];ok(t.isFunction(n.success),"Provided success."),ok(t.isFunction(n.cancel),"Provided cancel."),n.cancel.call(l),ok(e.calledOnce,"Cancel called on the dialog options."),ok(e.alwaysCalledOn(l),"Called with the right context.")}),test("cancel with ajax handler Handler",function(){var e=this.sandbox.spy(),a={complete:e},s={},o={},l={};this.webSudo.handleWebSudoError(a,{cancel:""},s,"something",o),ok(this.dialog.calledOnce,"Delgate to showWebSudoDialog");var n=this.dialog.args[0][0];ok(t.isFunction(n.success),"Provided success."),ok(t.isFunction(n.cancel),"Provided cancel."),n.cancel.call(l),ok(e.calledOnce,"Cancel called on the dialog options."),ok(e.alwaysCalledOn(l),"Called with the right context."),ok(e.alwaysCalledWithExactly(s,"something",o),"Called with right arguments.")}),module("SmartAjax.makeWebSudoRequest",{teardown:function(){this.sandbox.restore()},setup:function(){this.sandbox=sinon.sandbox.create(),this.makeRequest=this.sandbox.stub(l,"makeRequest"),this.webSudo=require("jira/ajs/ajax/smart-ajax/web-sudo")}}),test("makeWebSudoRequest with non 401 status code.",function(){var e=this.sandbox.spy(),t=this.sandbox.spy();this.webSudo.makeWebSudoRequest({error:e,copy:"me"}).fail(t),ok(this.makeRequest.calledOnce,"makeRequest called.");var a=this.makeRequest.getCall(0).args;equal(a.length,1,"makeRequest called with 1 argument.");var s=a[0];equal(s.copy,"me","Make sure non-error options copied.");var o={status:38,responseText:"ignored"},l="rehsjfhdskjfhsdkhgtiu4y4";s.error(o,"sjdjakdjakda","4897589475893754983",l),ok(e.calledOnce,"Called Original Error"),ok(e.getCall(0).calledWithExactly(o,"sjdjakdjakda","4897589475893754983",l),"Called error with correct arguments."),ok(t.calledOnce,"Called Original Error"),ok(t.getCall(0).calledWithExactly(o,"sjdjakdjakda","4897589475893754983",l),"Called error with correct arguments.")}),test("makeWebSudoRequest with 401 status code but not WebSudo failure.",function(){var e=this.sandbox.spy(),t=this.sandbox.spy();this.webSudo.makeWebSudoRequest({error:e,copy:"me"}).fail(t),ok(this.makeRequest.calledOnce,"makeRequest called.");var a=this.makeRequest.getCall(0).args;equal(a.length,1,"makeRequest called with 1 argument.");var s=a[0];equal(s.copy,"me","Make sure non-error options copied.");var o={status:401,responseText:"ignored"},l="rehsjfhdskjfhsdkhgtiu4y4";s.error(o,"sjdjakdjakda","4897589475893754983",l),ok(e.calledOnce,"Called Original Error Again"),ok(e.getCall(0).calledWithExactly(o,"sjdjakdjakda","4897589475893754983",l),"Called error."),ok(t.calledOnce,"Called Original Error Again"),ok(t.getCall(0).calledWithExactly(o,"sjdjakdjakda","4897589475893754983",l),"Called error.")}),test("makeWebSudoRequest with websudo dialog & success",function(){this.sandbox.stub(this.webSudo,"handleWebSudoError");var e=this.sandbox.spy(),t=this.sandbox.spy(),a=this.sandbox.spy(),s=this.sandbox.spy(),o=this.sandbox.spy();this.webSudo.makeWebSudoRequest({error:o,success:e,complete:a,copy:"me"}).fail(s).done(t),ok(this.makeRequest.calledOnce,"makeRequest called.");var l=this.makeRequest.getCall(0).args;equal(l.length,1,"makeRequest called with 1 argument.");var n=l[0];equal(n.copy,"me","Make sure non-error options copied.");var i={status:401,responseText:"websudo"};n.error(i,"sjdjakdjakda","4897589475893754983","rehsjfhdskjfhsdkhgtiu4y4"),n.complete(),ok(!e.called,"Nothing should be called while websudo detected open."),ok(!t.called,"Nothing should be called while websudo detected open."),ok(!a.called,"Nothing should be called while websudo detected open."),ok(!s.called,"Nothing should be called while websudo detected open."),ok(!o.called,"Nothing should be called while websudo detected open."),ok(this.webSudo.handleWebSudoError.called,"Make sure we open the websudo dialog.");var d=this.webSudo.handleWebSudoError.args[0][0],r={},c={},u={};d.success.call(u,r),d.complete.call(u,c),ok(e.called,"Success should now be called."),ok(e.alwaysCalledWithExactly(r),"Called with correct arguments."),ok(e.alwaysCalledOn(u,r),"Called with correct context."),ok(t.called,"Promise success should now be called."),ok(t.alwaysCalledWithExactly(r),"Called with correct arguments."),ok(t.alwaysCalledOn(u,r),"Called with correct context."),ok(a.called,"Complete should now be called."),ok(a.alwaysCalledWithExactly(c),"Called with correct arguments."),ok(a.alwaysCalledOn(u,c),"Called with correct context."),ok(!s.called,"Error should never have been called."),ok(!o.called,"Error should never have been called.")}),module("SmartAjax test sending X-AUSERNAME header",{setup:function(){this.username="someusername",this.meta={},this.meta.get=sinon.stub(),this.meta.get.withArgs("remote-user").returns("someusername"),this.mockedContext=AJS.test.mockableModuleContext(),this.mockedContext.mock("jira/util/data/meta",this.meta),this.sandbox=sinon.sandbox.create({useFakeServer:!0})},teardown:function(){this.sandbox.restore()}}),test("ajax request include 'X-AUSERNAME' header",function(){this.mockedContext.require("jira/ajs/ajax/smart-ajax").makeRequest({url:"http://someurl",data:"some_data",type:"POST"}),equal(this.sandbox.server.requests.length,1,"There should be 1 request"),equal(this.sandbox.server.requests[0].requestHeaders["X-AUSERNAME"],this.username,"username should be sent as a header")}),module("SmartAjax test sending undefined X-AUSERNAME header",{setup:function(){this.meta={},this.meta.get=sinon.stub(),this.meta.get.withArgs("remote-user").returns(void 0),this.mockedContext=AJS.test.mockableModuleContext(),this.mockedContext.mock("jira/util/data/meta",this.meta),this.sandbox=sinon.sandbox.create({useFakeServer:!0})},teardown:function(){this.sandbox.restore()}}),test("ajax request include undefined 'X-AUSERNAME' header",function(){this.mockedContext.require("jira/ajs/ajax/smart-ajax").makeRequest({url:"http://someurl",data:"some_data",type:"POST"}),equal(this.sandbox.server.requests.length,1,"There should be 1 request");var e=this.sandbox.server.requests[0].requestHeaders["X-AUSERNAME"];equal(e,"undefined",'"undefined" username should be sent as a header when no username is provided')}),module("SmartAjax test sending empty X-AUSERNAME header",{setup:function(){this.meta={},this.meta.get=sinon.stub(),this.meta.get.withArgs("remote-user").returns(""),this.mockedContext=AJS.test.mockableModuleContext(),this.mockedContext.mock("jira/util/data/meta",this.meta),this.sandbox=sinon.sandbox.create({useFakeServer:!0})},teardown:function(){this.sandbox.restore()}}),test("ajax request include empty 'X-AUSERNAME' header",function(){this.mockedContext.require("jira/ajs/ajax/smart-ajax").makeRequest({url:"http://someurl",data:"some_data",type:"POST"}),equal(this.sandbox.server.requests.length,1,"There should be 1 request");var e=this.sandbox.server.requests[0].requestHeaders["X-AUSERNAME"];equal(e,"","empty string should be sent as a header when empty username is provided")})});