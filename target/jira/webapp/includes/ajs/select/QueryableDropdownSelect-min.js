define("jira/ajs/select/queryable-dropdown-select",["jira/util/formatter","jira/jquery/deferred","jira/ajs/control","jira/ajs/select/suggestions/default-suggest-handler","jira/ajs/layer/inline-layer-factory","jira/ajs/list/list","jira/util/key-code","jira/util/navigator","jira/util/assistive","jquery","underscore"],function(t,e,i,n,s,o,r,a,l,d,h){"use strict";var u=0;return i.extend({INVALID_KEYS:{Shift:!0,Esc:!0,Right:!0},init:function(t){this.suggestionsVisible=!1,this._setOptions(t),this._createFurniture(),this._createDropdownController(),this._createSuggestionsController(),this._createListController(),this._assignEventsToFurniture(),this.options.width&&this.setFieldWidth(this.options.width),this.options.loadOnInit&&this.requestSuggestions(!0)},_createDropdownController:function(){var t=this;this.options.dropdownController?this.dropdownController=this.options.dropdownController:this.dropdownController=s.createInlineLayers({offsetTarget:this.$field,width:this.$field.innerWidth(),content:this.options.element}),this.dropdownController.onhide(function(){t.hideSuggestions()})},_createSuggestionsController:function(){var t=this.options.suggestionsHandler?this.options.suggestionsHandler:n;this.suggestionsHandler=new t(this.options)},_createListController:function(){var e=this;this.listController=new o({containerSelector:this.options.element,groupSelector:"ul.aui-list-section",matchingStrategy:this.options.matchingStrategy,eventTarget:this.$field,selectionHandler:function(){return e.$field.val(t.I18n.getText("common.concepts.loading")).css("color","#999"),e.hideSuggestions(),!0}})},_onItemFocus:function(t,e){var i=this.$field,n=e&&e.id?e.id:"null";l.wait(function(){i.attr("aria-activedescendant",n)})},setFieldWidth:function(t){this.$container.css({width:t,minWidth:t})},showErrorMessage:function(e){var i=this.$container.parent(".field-group");return this.hideErrorMessage(),this.$errorMessage.text(t.format(this.options.errorMessage,e||this.getQueryVal())),1===i.length?void i.append(this.$errorMessage):(0===i.length&&(i=this.$container.parent(".frother-control-renderer")),1===i.length?void this.$errorMessage.prependTo(i):void(0===i.length&&this.$container.parent().append(this.$errorMessage)))},hideErrorMessage:function(){this.$errorMessage&&this.$errorMessage.remove(),this.$container.parent().find(".error").remove()},_getDefaultOptions:function(){return u+=1,{id:u,keyInputPeriod:75,localListLiveUpdateLimit:25,localListLiveUpdateDelay:150}},_createFurniture:function(){this.$container=this._render("container").insertBefore(this.options.element),this.suggestionsContainerId=this.options.id+"-suggestions",this.$field=this._render("field").appendTo(this.$container),this.$dropDownIcon=this._render("dropdownAndLoadingIcon",this._hasDropdownButton()).appendTo(this.$container),this.options.overlabel&&(this.$overlabel=this._render("overlabel").insertBefore(this.$field),this.$overlabel.overlabel())},_hasDropdownButton:function(){return this.options.showDropdownButton||this.options.ajaxOptions&&0===this.options.ajaxOptions.minQueryLength},_assignEventsToFurniture:function(){var t=this;this._assignEvents("ignoreBlurElement",this.dropdownController.$layer),this._assignEvents("container",this.$container),this._hasDropdownButton()&&(this._assignEvents("ignoreBlurElement",this.$dropDownIcon),this._assignEvents("dropdownAndLoadingIcon",this.$dropDownIcon)),setTimeout(function(){t._assignEvents("field",t.$field),t._assignEvents("keys",t.$field)},15),this.listController.bind("itemFocus",this._onItemFocus.bind(this))},requestSuggestions:function(t){var i=this,n=new e;return this.outstandingRequest=this.suggestionsHandler.execute(this.getQueryVal(),t).done(function(t,e){e===i.getQueryVal()&&n.resolve(t,e)}),"resolved"!==this.outstandingRequest.state()&&(window.clearTimeout(this.loadingWait),this.loadingWait=window.setTimeout(function(){"pending"===i.outstandingRequest.state()&&i.showLoading()},150),this.outstandingRequest.always(function(){i.hideLoading()})),n},showLoading:function(){return this.$dropDownIcon.addClass("loading").removeClass("noloading"),this.$dropDownIcon.data("spinner")||this.$dropDownIcon.spin(),this.$field.attr("aria-busy","true"),this},hideLoading:function(){return this.$dropDownIcon.removeClass("loading").addClass("noloading"),this.$dropDownIcon.spinStop(),this.$field.attr("aria-busy","false"),this},_setSuggestions:function(t){t?(this.listController.generateListFromJSON(t,this.getQueryVal()),this.showSuggestions()):this.hideSuggestions(),this.$container.attr("data-query",this.getQueryVal())},disable:function(){this.disabled||(this.$container.addClass("aui-disabled"),this.$disabledBlanket=this._render("disabledBlanket").appendTo(this.$container),this.$field.attr("disabled",!0),this.dropdownController.hide(),this.disabled=!0)},enable:function(){this.disabled&&(this.$container.removeClass("aui-disabled"),this.$disabledBlanket.remove(),this.$field.attr("disabled",!1),this.disabled=!1)},getQueryVal:function(){return d.trim(this.$field.val())},_isValidInput:function(t){return this.$field.is(":visible")&&!("aui:keydown"===t.type&&this.INVALID_KEYS[t.key])},_handleCharacterInput:function(t){this.getQueryVal().length>=1||t?this.requestSuggestions(t).done(h.bind(function(t){this._setSuggestions(t)},this)):this.hideSuggestions()},_handleDown:function(t){this.suggestionsVisible||(this.listController._latestQuery="",this._handleCharacterInput(!0)),t.preventDefault()},_rejectPendingRequests:function(){this.outstandingRequest&&this.outstandingRequest.reject()},showSuggestions:function(){this.suggestionsVisible||(this.suggestionsVisible=!0,this.dropdownController.show(),this.dropdownController.setWidth(this.$field.innerWidth()),this.dropdownController.setPosition(),this.listController.enable(),this.$field.attr("aria-expanded","true"),this.$field.attr("aria-controls",this.suggestionsContainerId))},hideSuggestions:function(){this.suggestionsVisible&&(this._rejectPendingRequests(),this.suggestionsVisible=!1,this.$dropDownIcon.addClass("noloading"),this.dropdownController.hide(),this.listController.disable(),this.$field.removeAttr("aria-activedescendant"),this.$field.attr("aria-expanded","false"),this.$field.removeAttr("aria-controls"))},_deactivate:function(){this.hideSuggestions()},_handleEscape:function(t){this.suggestionsVisible&&(t.stopPropagation(),"keyup"===t.type&&(this.hideSuggestions(),a.isIE()&&a.majorVersion()<12&&this.$field.focus()))},acceptFocusedSuggestion:function(){var t=this.listController.getFocused();0!==t.length&&t.is(":visible")&&this.listController._acceptSuggestion(t)},keys:{Down:function(t){this._hasDropdownButton()&&this._handleDown(t)},Up:function(t){t.preventDefault()},Return:function(t){t.preventDefault()}},onEdit:function(){this._handleCharacterInput()},_events:{dropdownAndLoadingIcon:{click:function(t){this.suggestionsVisible?this.hideSuggestions():(this._handleDown(t),this.$field.focus()),t.stopPropagation()}},container:{disable:function(){this.disable()},enable:function(){this.enable()}},field:{blur:function(){this.ignoreBlurEvent?this.ignoreBlurEvent=!1:this._deactivate()},click:function(t){t.stopPropagation()},"keydown keyup":function(t){t.keyCode===r.ESCAPE&&this._handleEscape(t)}},keys:{"aui:keydown input":function(t){this._handleKeyEvent(t)}},ignoreBlurElement:{mousedown:function(t){if(a.isIE()&&a.majorVersion()<12){d(t.target)[0]==d(this.dropdownController.$layer)[0]&&(this.ignoreBlurEvent=!0)}t.preventDefault()}}},_renders:{disabledBlanket:function(){return d("<div class='aui-disabled-blanket' />").height(this.$field.outerHeight())},overlabel:function(){return d("<span class='overlabel' />").text(this.options.overlabel).attr({"data-target":this.options.id+"-field",id:this.options.id+"-overlabel"})},baseField:function(t){var e=document.createElement(t||"input");return d(e).attr({autocomplete:"off",role:"combobox","aria-autocomplete":"list","aria-haspopup":"true","aria-expanded":"false"})},field:function(){return this._render("baseField").attr({class:"text",id:this.options.id+"-field",type:"text"})},container:function(){return d("<div class='queryable-select' />").attr("id",this.options.id+"-queryable-container")},dropdownAndLoadingIcon:function(t){return d('<span class="icon noloading"><span>More</span></span>').toggleClass("drop-menu",!!t)},suggestionsContainer:function(t){return d("<div />").attr({class:"aui-list",id:t+"-suggestions",tabindex:"-1",role:"listbox"})}}})}),AJS.namespace("AJS.QueryableDropdown",null,require("jira/ajs/select/queryable-dropdown-select")),AJS.namespace("AJS.QueryableDropdownSelect",null,require("jira/ajs/select/queryable-dropdown-select"));