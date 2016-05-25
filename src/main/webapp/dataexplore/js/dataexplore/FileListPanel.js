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
		//DataStore
		"dojo/store/JsonRest",
		"dojo/store/Observable",
		"dojo/store/Memory",
		"dojo/data/ObjectStore",
		//Gridx module
		"gridx/core/model/cache/Sync",
		"gridx/Grid",
		"gridx/modules/SingleSort",
		"gridx/modules/VScroller",
		"gridx/core/model/cache/Async",
		//Form elements
		"dijit/form/Button",
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dijit/layout/ContentPane",
		"dojo/dnd/Source",
		"dijit/registry",
		"dojo/topic",
		"dojo/on",
		"dojo/string",
		"dojo/dom-construct",
		"dojo/json",
		//IncludeFileListDialog
		"dataexplore/IncludeFileListDialog",
		"dojo/domReady!"
	], function(lang, cfg, declare, request, on, json, dom, domClass, domAttr, JsonRest , Observable, Memory, 
		ObjectStore, Cache, Grid, SingleSort, VScroller, Async, Button, Dialog, ConfirmDialog, 
		ContentPane, Source, registry,  topic, on, stringUtil, domConstruct, JSON, IncludeFileListDialog) {
	
		function _addFiles(_this, _files){
			_this.source.insertNodes(true, _files, true, null);
			//_this.source.forInItems(function(item, id, map){
			//	domClass.add(id, item.type[0]);
			//});
			_this.source.selectNone();
		}
		
		function _getFiles(_source){
			var r = [];
			_source.forInItems(function(item, id, map){
				r.push(item.data);
			});
			return r;
		}

		function _transfer(_jsonData){
			var r = [];
			for(var i=0;i<_jsonData.length;i++){
				var obj = {};
				obj.name = _jsonData[i].name;
				obj.type = _jsonData[i].type;
				obj.host = _jsonData[i].host;
				obj.path = _jsonData[i].path;
				r.push(obj);
			}
			return r;
		}

		function createSource(_this){
			var source  = new Source(_this.container, {creator: catalogNodeCreator});
			_this.source = source;
			
			function catalogNodeCreator(item, hint){
				//file image icon
				//if the file is deck or folder, showing the "include files" icon
				var imageIcon = "image_file.png";
				if(item.type == "d" || item.type == "folder" || item.type == "l" || item.type == "link") imageIcon = "image_folder.png";
				
				//file information icon
				var deleteIcon = "image_delete.png";
				var infoIcon = "image_info.png";

				//var tr_div = domConstruct.create("div", {class:"sp_inputFiles_list_tr_div"});
				var tr_div = domConstruct.create("div");
				domClass.add(tr_div, "sp_inputFiles_list_tr_div");
				var tr = domConstruct.create("tr", {}, tr_div);

				//image td
				var imageHTML = "<image src='" + _this.context.urlContext + "/images/" + imageIcon + "'/>";
				var imageTd = domConstruct.create("td", {innerHTML: imageHTML}, tr);
				
				//name td
				var nameTd = domConstruct.create("td", {innerHTML: item.name, title: item.path}, tr);
				
				/*
				//info td
				var infoTd = domConstruct.create("td", {}, tr);
				var infoButton = new Button({
					baseClass:"myIconButton",
					iconClass: "infoIcon",
					onClick: function(){
						var fd = new filePropertyDialog(item.host, item.path, item.name);
						fd.show();
					}
				});
				infoButton.placeAt(infoTd, "last");
				*/

				//delete td
				var deleteTd = domConstruct.create("td", {id:"delId", style:  "vertical-align: top"  }, tr);
				//var deleteTd = domConstruct.toDom("<td style:'vertical-align:top;'></td>");
				var deleteButton = new Button({
					baseClass:"myIconButton",
					iconClass: "deleteIcon",
					onClick: function(){
						_remove(_this, item);
					}
				});
				deleteButton.placeAt(deleteTd, "last");

				//if the file type is the "deck/folder", there shouuld show two <tr>. 
				//one of the lays is to showing the words - "Includes xxx files"/"Contains xxx files".
				if(item.type != "f" && item.type != "file"){
					var params = {"fileItem.host": item.host, "fileItem.path": item.path};
					request.post(_this.context.urlContext + "/doGetIncludeFiles.action?rnd=" + (new Date()).getTime(),{
							data: params,
							handleAs: "json",
						}).then(function(data){
							// do something with handled data
							var tr_1 = domConstruct.create("tr", {}, tr_div);
							var td_0 = domConstruct.create("td", {}, tr_1);

							//set include files number
							var includeStr = "Contains " + data.length + "files";
							var td_1 = domConstruct.create("td", {}, tr_1);

							var link = domConstruct.create("a", {innerHTML: includeStr}, td_1);
							on(link, "click", function(evt){
								//console.log(params);
								var dialog = new IncludeFileListDialog(_this.context, item.host, item.path);
								dialog.show();
							});

							var td_2 = domConstruct.create("td", {}, tr_1);
						}, function(err){
							// handle an error condition
						}, function(evt){
							// handle a progress event
					});
				}
				return {node: tr_div, data: item, type: item.type};
			}
			
			//below code is to disable the copying in dojo.dnd
			//reference: http://stackoverflow.com/questions/4595726/disabling-copying-in-dojo-dnd
			//and how to using the dojo.extend
			//reference: http://dojotoolkit.org/reference-guide/1.7/dojo/extend.html
			lang.extend(Source, {
				copyState: function( keyPressed, self ){return false;}
			});

			var url = _this.context.urlContext + "/doGetFileList.action?rnd=" + (new Date()).getTime();
			request.get(url ,{
				handleAs: "json",
				}).then(function(data){
					if(data != "null") _addFiles(_this, _transfer(data));
					
					//publish success event
					topic.publish(_this.getEventPrefix() + "@event.inputfiles.load.success", _this.id, _transfer(data));
				}, function(err){
					//console.log(err);
				}, function(evt){
					//console.log(evt);
			});
			return source;
		}

		function _add(_this, _file){
			//save the input file into properties file
			var url = _this.context.urlContext + "/doAddFileItem.action?rnd=" + (new Date()).getTime();
			var postData = "fileItem.host=" + _file.host + "&" + "fileItem.type=" + _file.type + "&" + 
							 "fileItem.path=" + _file.path + "&" + "fileItem.name=" + _file.name + "&" + 
							 "fileItem.location=" + _file.location;
			request.post(url, {
				data : postData
			}).then(function(data){
					//publish success event
					_addFiles(_this, [_file]);
					topic.publish(_this.getEventPrefix() + "@event.inputfiles.add.success", _this.id, _file);
				}, function(err){
					//console.log(err);
				}, function(evt){
					//console.log(evt);
			});
		}
		
		function _remove(_this, _file){
			//remove the item from properties file
			var url = _this.context.urlContext + "/doRemoveFileItem.action?rnd=" + (new Date()).getTime();
			var postData = "fileItem.host=" + _file.host + "&" + "fileItem.type=" + _file.type + "&" + 
							 "fileItem.path=" + _file.path + "&" + "fileItem.name=" + _file.name + "&" + 
							 "fileItem.location=" + _file.location;
			request.post(url, {
				data : postData
				}).then(function(data){
					//publish success event
					_this.source.delItem(_this.source.deleteSelectedNodes());
					topic.publish(_this.getEventPrefix() + "@event.inputfiles.remove.success", _this.id, _file);
				}, function(err){
					//console.log(err);
				}, function(evt){
					//console.log(evt);
			});
		}

		function _reload(_this, _source){
			_this.source.selectAll();
			_this.source.deleteSelectedNodes();
			
			var url = _this.context.urlContext + "/doGetFileList.action?rnd=" + (new Date()).getTime();
			request.get(url ,{
					handleAs: "json",
				}).then(function(data){
					if(data != "null") _addFiles(_this, _transfer(data));
					//publish success event
					topic.publish(_this.getEventPrefix() + "@event.inputfiles.reload.success", _this.id, _transfer(data));
				}, function(err){
					//console.log(err);
				}, function(evt){
					//console.log(evt);
			});
		}

		return declare('dataexplore.InputFileListPanel', null, {
			constructor: function (_container, _context, _id) {
				this.container = (_container != null) ? _container : "sp_inputFiles_list";
				this.context = _context; this.id = _id;
			},
			startup: function() {
				this.source = createSource(this);
			},
			isShow: function(){
				var r = false;
				var style = dom.byId(this.container).style.display;
				if(style == "" || style == "block") r = true;
				return r;
			},
			show: function(){
				dom.byId(this.container).style.display = "block";
			},
			hidden: function(){
				dom.byId(this.container).style.display = "none";
			},
			destroy: function(){
				this.source.destroy();
			},
			getEventPrefix: function(){
				return (this.container);
			},
			add: function(_file){
				_add(this, _file);
			},
			remove: function(_file){
				_remove(this, _file);
			},
			reload: function(){
				_reload(this);
			},
			addFiles: function(_files){
				_addFiles(this, _files);
			},
			getFiles: function(){
				return _getFiles(this.source);
			},
			deleteAll: function(){
				this.source.selectAll();
				this.source.deleteSelectedNodes();
			},
		});
});
