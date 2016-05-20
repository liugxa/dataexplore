define([
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		//Help moudules
		"paccommon/request",
		"dojo/on",
		"dojo/json",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-attr",
		"dojo/topic",
		//Form elements
		"dijit/registry",
		"dijit/layout/ContentPane",
		"dataexplore/FormTablePanel",
		"dataexplore/InputFileListPanel",
		"dataexplore/FormListPanel",
		"dojo/domReady!"
	], function(lang, cfg, declare, request, on, json, dom, domClass, domAttr, topic,
		registry, ContentPane, FormTablePanel, InputFileListPanel, FormListPanel) {
		
		function createContent(_container, _context, _id, _formTablePanel, _inputFileListPanel){
			var url = _context.urlContext + "/toSubmissions.action?rnd=" + (new Date()).getTime();
			url = request.appendCsrfTokenToURL(url).value;
			var content = new ContentPane({
				href: url,
				onHide: function(){this.destroyRecursive(false);},
				style: "width:100%;height:100%",
				onDownloadEnd: function () {
					var formList;

					//initialize the input file list at first
					_inputFileListPanel.startup();
					_formTablePanel.startup();
					
					on(dom.byId("sp_submissionForms_view_link"), "click", function() {
						//console.log("view linke");
						formList = new FormListPanel("fd_formList_grid_container", _context);
						formList.startup();

						var dialog = registry.byId("fd_formList_dialog");
						dialog.show();
					});

					on(dom.byId("sp_submissionForms_view_output"), "click", function() {
						request.get(_context.urlContext + "/doGetOutputMessage.action?rnd=" + (new Date()).getTime(),{
								handleAs: "json",
							}).then(function(data){
								topic.publish((_container + "_SubmissionsPanel") + "@event.view.output", _id, data);
							}, function(err){
								// handle an error condition
								console.log(err);
							}, function(evt){
								// handle a progress event
								//console.log(evt);
						});
					});
				}
			});
			return content
		}

		return declare('dataexplore.SubmissionsPanel', null, {
			constructor: function (_container, _context, _id) {
				this.container = (_container != null) ? _container : "sp_submissionForms_container";
				this.context = _context; this.id = _id;

				this.inputFileListPanel = new InputFileListPanel("sp_inputFiles_list", _context, _id);
				this.formTablePanel = new FormTablePanel("sp_submissionForms_grid_container", _context, _id);
			},
			startup: function() {
				this.content = createContent(this.container, this.context, this.id, this.formTablePanel, this.inputFileListPanel);
				this.content.placeAt(this.container);
				this.content.startup();
			},
			isShow: function(){
				var r = false;
				var style = this.content.domNode.style.display;
				if(style == "" || style == "block") r = true;
				return r;
			},
			show: function(){
				this.content.domNode.style.display = "block";
				dom.byId(this.container).style.display = "block";
			},
			hidden: function(){
				this.content.domNode.style.display = "none";
				dom.byId(this.container).style.display = "none";
			},
			destroy: function(){
				this.content.destroy();
			},
			getEventPrefix: function(){
				return (this.container + "_SubmissionsPanel");
			},
		});
});
