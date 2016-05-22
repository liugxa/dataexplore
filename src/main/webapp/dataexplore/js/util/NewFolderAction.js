define([
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		"dojo/has",
		"dijit/registry",
		//Help moudules
		"paccommon/request",
		//Host Tree
		"dojo/store/Memory",
		"dijit/tree/ObjectStoreModel", 
		"dojo/store/JsonRest",
		"dijit/Tree",
		//Content Panel
		"dijit/layout/ContentPane",
		"dojo/dom",
		"dojo/dom-construct",
		"dojo/topic",
		"dojo/aspect",
		"dojo/on",
		"dataexplore/HostTreePanel",
		"dataexplore/FileTablePanel",
		//Upload file
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dijit/form/Button",
		"dijit/ProgressBar",
		"dijit/Toolbar",
		"dijit/ToolbarSeparator",
		"dijit/form/DropDownButton",
		"dijit/DropDownMenu",
		"dijit/MenuItem",
		"dijit/form/TextBox",
		"dojo/date/locale",
	],function(lang, cfg, declare, has, registry, request, Memory, ObjectStoreModel, JsonRest, Tree, 
		ContentPane, dom, domConstruct, topic, aspect, on, HostTreePanel, FileTablePanel,
		Dialog, ConfirmDialog, Button, ProgressBar, Toolbar, ToolbarSeparator, DropDownButton, DropDownMenu, MenuItem, TextBox, locale){
		
		/**
		* the new folder action
		*/
		function newFolderActionHandle(_container, _context, _fileTablePanel){
			on(registry.byId("da_newFolderMenuItem"), "click", function(){
				var dialog = registry.byId("de_dialog_newFolder");
				dialog.show();
			});

			//new folder
			on(registry.byId("de_dialog_newFolder_okBtn"), "click", function(){
				var inputValue = registry.byId("de_dialog_newFolder_dirName").value;
				
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();
				
				var url = _context.contextPath + "/webservice/pac/data/action/mkdir?rnd=" + (new Date()).getTime();
				var path = encodeURIComponent(cPath + "/" + inputValue);
				var postData = "filePath=" + path + "&hostName=" + cHost;

				request.post(url, {
					data : postData
				}).then(function(data) {
						var dialog = registry.byId("de_dialog_newFolder");
						if(data != null && data != ""){
							dialog.hide();
							showMessage(data);
						}else{
							//close the dialog and refrsh the file table
							_fileTablePanel.refresh(cHost, cPath);
							dialog.hide();
						}
					}, function(err) {
						console.log(err);
					}, function(evt) {
						//console.log(evt);
				});
			});
		}
		
		return declare('dataexplore.NewFolderAction', null, {
			constructor: function (_container, _context, _host, _path){
				this.container = (_container != null) ? _container : "bc_breadCrumb_container";
				this.context = _context;
				this.host = _host; this.path = _path;
				this.eventPrefix = this.container + "_breadCrumb";
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
				return this.eventPrefix;
			},
			refresh: function(_host, _path){
				this.host = _host; this.path = _path;
				refreshToolBar(this);
			}
		});
});