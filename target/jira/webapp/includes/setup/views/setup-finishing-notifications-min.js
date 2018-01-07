define("jira/setup/setup-finishing-notifications-view",["wrm/context-path","jquery","marionette","underscore"],function(t,e,i,s){var r=function(t){return s.bind(function(e,i,s){"abort"!=i&&("error"==i&&0==e.readyState||t.call(this,e,i,s))},this)},n=function(t){return s.bind(function(e,i,s){if(e.status>=500)return void this._navigateToErrorPage();t.call(this,e,i,s)},this)};return i.ItemView.extend({el:".jira-setup-finishing-notifications-view",template:JIRA.Templates.Setup.Finishing.notificationsView,ui:{errorMessage:".jira-setup-finishing-error",notificationsItem:".jira-setup-finishing-notifications-item",refreshLink:".jira-setup-finishing-refresh",timeoutWarning:".jira-setup-finishing-timeout-warning"},_allowedStatuses:["awaiting","pending","success","failure"],_lagTimeout:null,_jqXhrInFlight:null,_setupLevel:"waitingToStart",initialize:function(){this._showTimeoutWarning=!1,this._errorMessage=null,this._steps=[{key:"database",text:this.$el.data("database-label"),status:"pending"},{key:"plugins",text:this.$el.data("plugins-label"),status:"awaiting"},{key:"environment",text:this.$el.data("environment-label"),status:"awaiting"},{key:"finishing",text:this.$el.data("finishing-label"),status:"awaiting"}],this.bindUIElements()},serializeData:function(){return s.extend({},{errorMessage:this._errorMessage,steps:this._steps,timeoutWarning:this._showTimeoutWarning})},_navigateToErrorPage:function(){window.onbeforeunload=null,window.location.href=t()+"/secure/errors.jsp"},_requestErrorHandlerWrapper:function(t){return r.call(this,n.call(this,t))},triggerSetup:function(){this._setupLevel="triggering",this._jqXhrInFlight=e.ajax({timeout:6e4,url:t()+"/secure/SetupFinishing!triggerSetup.jspa",type:"POST",dataType:"json",success:s.bind(this._triggerSetupSuccessHandler,this),error:this._requestErrorHandlerWrapper(this._triggerSetupErrorHandler)})},_triggerSetupSuccessHandler:function(){this._setupLevel="triggeringComplete",this.bootstrapStatePulling()},_triggerSetupErrorHandler:function(){this._errorMessage=this._ajaxErrorLabel(),this._setupLevel="triggeringError",s.each(this._steps,function(t){t.status="awaiting"}),this.render()},_dismissLagMessage:function(){s.each(this._steps,function(t){delete t.hasLag})},_showLagMessage:function(){var t=!1;this._dismissLagMessage(),s.each(this._steps,function(e){t||"pending"!==e.status||(e.hasLag=!0,t=!0)}),this.render()},bootstrapStatePulling:function(){switch(clearTimeout(this._lagTimeout),this._lagTimeout=null,this._jqXhrInFlight&&(this._jqXhrInFlight.abort(),this._jqXhrInFlight=null),this._setupLevel){case"waitingToStart":case"triggering":this.triggerSetup();break;case"triggeringComplete":case"pullingState":this._pullState();break;case"finishing":this._makeRequestFinishingSetup()}},_pullState:function(){this._lagTimeout=setTimeout(s.bind(this._showLagMessage,this),15e3),this._setupLevel="pullingState",this._pullStateWithoutLagTimeout()},_pullStateWithoutLagTimeout:function(){this._findCurrentlyPendingStep()&&(this._jqXhrInFlight=e.ajax({timeout:3e5,url:t()+"/setupprogress",type:"GET",data:{askingAboutStep:this._findCurrentlyPendingStep().key},dataType:"json",success:s.bind(this._pullStateSuccessHandler,this),error:this._requestErrorHandlerWrapper(this._pullStateErrorHandler)}))},_pullStateSuccessHandler:function(t){clearTimeout(this._lagTimeout),this._dismissLagMessage(),this._showTimeoutWarning=!1,this._updateStepsWithNewStatuses(t.steps),t.errorMessage?this._errorMessage=t.errorMessage:this._findCurrentlyPendingStep()?setTimeout(s.bind(function(){this._pullState()},this),0):this._makeRequestFinishingSetup(),this.render()},_makeRequestFinishingSetup:function(){this._setupLevel="finishing",this._jqXhrInFlight=e.ajax({timeout:6e4,url:t()+"/secure/SetupFinishing!setupFinished.jspa",type:"POST",dataType:"json",success:s.bind(this._makeRequestFinishingSetupSuccessHandler,this),error:this._requestErrorHandlerWrapper(this._makeRequestFinishingSetupErrorHandler)})},_makeRequestFinishingSetupSuccessHandler:function(t){this._jqXhrInFlight=null,this._setupLevel="complete",this.trigger("setup-complete",{redirectUrl:t.redirectUrl,SEN:t.SEN})},_makeRequestFinishingSetupErrorHandler:function(){this._errorMessage=this._ajaxErrorLabel(),this._setupLevel="finishingError",this.render()},_updateStepsWithNewStatuses:function(t){var e=this._allowedStatuses;s.each(this._steps,function(i){var r=t[i.key];s.contains(e,r)&&(i.status=r)})},_pullStateErrorHandler:function(t,e){"timeout"===e?(clearTimeout(this._lagTimeout),this._dismissLagMessage(),this._showTimeoutWarning=!0,setTimeout(s.bind(function(){this._pullStateWithoutLagTimeout()},this),0),this.render()):(clearTimeout(this._lagTimeout),this._dismissLagMessage(),this._errorMessage=this._ajaxErrorLabel(),this._showTimeoutWarning=!1,setTimeout(s.bind(function(){this._pullStateWithoutLagTimeout()},this),1e4),this.render())},_findCurrentlyPendingStep:function(){return s.find(this._steps,function(t){return"pending"===t.status})},_ajaxErrorLabel:function(){return this.$el.data("error-ajax-label")}})});