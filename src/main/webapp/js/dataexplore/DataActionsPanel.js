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
		"dataexplore/BreadCrumbPanel",
		"dataexplore/SearchPanel",
		"datautil/EventProxy",
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
		"dojo/date/locale",
	],function(lang, cfg, declare, has, registry, request, Memory, ObjectStoreModel, JsonRest, Tree, 
		ContentPane, dom, domConstruct, topic, aspect, on, HostTreePanel, FileTablePanel, BreadCrumbPanel, SearchPanel, EventProxy, Dialog, ConfirmDialog, Button, ProgressBar, Toolbar, ToolbarSeparator, DropDownButton, DropDownMenu, MenuItem, locale){
	
		/**
		* the copy from action
		*/
		function copyFromActionHandle(_container, _context, _fileTablePanel){
			var search; var breadCrumb;
			var fileTable; var hostTree;
			var eventProxy;
			
			//copy from
			on(registry.byId("da_copyFromMenuItem"), "click", function(){
				var cHost = _context.copyFromHost;
				var cPath = _context.copyFromPath;
				
                //if((_context.lastCopyFrom && _context.lastCopyFrom != 'null')){
                //   cPath = _context.lastCopyFrom;
                //}
				search = new SearchPanel("de_dialog_copyFrom_search", _context, "copyFrom", cHost, cPath);
				search.startup();
				
				breadCrumb = new BreadCrumbPanel("de_dialog_copyFrom_breadCrumb", _context, "copyFrom", cHost, cPath);
				breadCrumb.startup();
				
				hostTree = new HostTreePanel("de_dialog_copyFrom_tree", _context, "copyFrom", cHost);
				hostTree.startup();
				
				fileTable = new FileTablePanel("de_dialog_copyFrom_grid", _context, "copyFrom", cHost, cPath);
				fileTable.startup();

				var dialog = registry.byId("de_dialog_copyFrom");
				dialog.show();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.showOverLayer();
				
				var panels = {"hostTreePanel": hostTree, "fileTablePanel": fileTable, "breadCrumbPanel": breadCrumb, "searchPanel": search};
				eventProxy  = new EventProxy(_context, panels);
				eventProxy.startup();
			});

			on(registry.byId("de_dialog_copyFrom_okBtn"), "click", function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				//get all select files
				var rowDatas = _getSelectRowDatas(fileTable);
                //if(rowDatas.length == 0){
                //   registry.byId("de_dialog_copyFrom").hide();
                //    return;
                //}
				var files = [];
				for(var i=0;i<rowDatas.length;i++){
					files.push(rowDatas[i].host + ":" + rowDatas[i].absolutePath);
				}
				
				//get the desert path
				var destPath = encodeURIComponent(cHost + ":" + cPath);
				
				var url = _context.contextPath + '/webservice/pac/data/action/remoteCopyMove?rnd=' + (new Date()).getTime();
				var postData = 'dataAction=copyFrom&selectedFiles=' + files + '&destPath=' + destPath;
				request.post(url, {
					data : postData
				}).then(function(data) {
						var dialog = registry.byId("de_dialog_copyFrom");
						if(data != null && data != ""){
							dialog.hide();
							showMessage(data);
						}else{
							//close the dialog and refrsh the file table
							_fileTablePanel.refresh(cHost, cPath);
							dialog.hide();
						}
                        //_context.lastCopyFrom = fileTable.getPath();   
					}, function(err) {
						console.log(err);
					}, function(evt) {
						//console.log(evt);
				});
			});
			on(registry.byId("de_dialog_copyFrom"), "hide", function(){
				breadCrumb.destroy(); search.destroy();
				hostTree.destroy(); fileTable.destroy();
				eventProxy.destroy();
				
				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.hiddenOverLayer();
			});
		}

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

		/*
		* the rename action
		*/
		function renameActionHandle(_container, _context, _fileTablePanel){
			on(registry.byId("da_renameMenuItem"), "click", function(){
				var rowData = _getSelectedRowData(_fileTablePanel);

				//set the old name
				dom.byId("de_dialog_rename_fileName_label").innerHTML = rowData.name;

				var dialog = registry.byId("de_dialog_rename");
				dialog.show();
			});

			//rename
			on(registry.byId("de_dialog_rename_okBtn"), "click", function(){
				var rowData = _getSelectedRowData(_fileTablePanel);
				var inputValue = registry.byId("de_dialog_rename_input").value;
				
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var oldName = encodeURIComponent(cPath + "/" + rowData.name);
				var newName = encodeURIComponent(cPath + "/" + inputValue);

				var url = _context.contextPath + "/webservice/pac/data/action/rename?rnd=" + (new Date()).getTime();
				var postData = "oldFilePath=" + oldName + "&newFilePath=" + newName + "&hostName=" + cHost;

				request.post(url, {
					data : postData
				}).then(function(data) {
						var dialog = registry.byId("de_dialog_rename");
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
	
		/*
		* the copy to action
		*/
		function copyToActionHandle(_container, _context, _fileTablePanel){
			//for the limitation for LSF - don't support to copy/move folder to another host
			//so, the copyTo/moveTo/copyFrom only occurs on the current host
			var hostTree;
			
			//copy to
			on(registry.byId("da_copyToBtn"), "click", function(){
				hostTree = new HostTreePanel("de_dialog_copyTo_tree", _context, _fileTablePanel.getHost());
				hostTree.startup();
				
				var dialog = registry.byId("de_dialog_copyTo");
				dialog.show();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.showOverLayer();
			});

			on(registry.byId("de_dialog_copyTo_okBtn"), "click", function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var item = hostTree.getSelected();
				if(item != null){
					var destPath = encodeURIComponent(item.id);
					var files = [];

					var rowDatas = _getSelectRowDatas(_fileTablePanel);
                    if(rowDatas.length == 0){
                        return;
                    }
					for(var i=0;i<rowDatas.length;i++){
						files.push(rowDatas[i].host + ":" + rowDatas[i].absolutePath);
					}

					var url = _context.contextPath + '/webservice/pac/data/action/remoteCopyMove?rnd=' + (new Date()).getTime();
					var postData = 'dataAction=copyTo&selectedFiles=' + files + '&destPath=' + destPath;

					request.post(url, {
						data : postData
					}).then(function(data) {
							var dialog = registry.byId("de_dialog_copyTo");
							if(data != null && data != ""){
								dialog.hide();
								showMessage(data);
							}else{
								//close the dialog and refrsh the file table
								_fileTablePanel.refresh(cHost, cPath);
								dialog.hide();
							}
						}, function(err){
							console.log(err);
						}, function(evt){
							//console.log(evt);
					});
				}
			});
			on(registry.byId("de_dialog_copyTo"), "hide", function(){
				hostTree.destroy();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.hiddenOverLayer();
			});
		}

		/*
		* the move to action
		*/
		function moveToActionHandle(_container, _context, _fileTablePanel){
			var hostTree;

			//move to
			on(registry.byId("da_moveToBtn"), "click", function(){
				hostTree = new HostTreePanel("de_dialog_moveTo_tree", _context, _fileTablePanel.getHost());
				hostTree.startup();
				
				var dialog = registry.byId("de_dialog_moveTo");
				dialog.show();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.showOverLayer();
			});

			on(registry.byId("de_dialog_moveTo_okBtn"), "click", function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var item = hostTree.getSelected();
				if(item != null){
					var destPath = encodeURIComponent(item.id);
					var files = [];

					var rowDatas = _getSelectRowDatas(_fileTablePanel);
                    if(rowDatas.length == 0){
                        return;
                    }
					for(var i=0;i<rowDatas.length;i++){
						files.push(rowDatas[i].host + ":" + rowDatas[i].absolutePath);
					}

					var url = _context.contextPath + '/webservice/pac/data/action/remoteCopyMove?rnd=' + (new Date()).getTime();
					var postData = 'dataAction=moveTo&selectedFiles=' + files + '&destPath=' + destPath;

					request.post(url, {
						data : postData
					}).then(function(data) {
							var dialog = registry.byId("de_dialog_moveTo");
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
				}
			});
			on(registry.byId("de_dialog_moveTo"), "hide", function(){
				hostTree.destroy();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.hiddenOverLayer();
			});
		}

		/*
		* the delete action
		*/
		function deleteActionHandle(_container, _context, _fileTablePanel){
			//delete
			on(registry.byId("da_deleteMenuItem"), "click", function(){
				var dialog = registry.byId("de_dialog_delete");
				dialog.show();
			});

			on(registry.byId("de_dialog_delete_okBtn"), "click", function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();
				
				var files = [];
				var rowDatas = _getSelectRowDatas(_fileTablePanel);
                if(rowDatas.length == 0){
                    return;
                }
				for(var i=0;i<rowDatas.length;i++){
					files.push(rowDatas[i].absolutePath);
				}

				var url = _context.contextPath + "/webservice/pac/data/action/delete?rnd=" + (new Date()).getTime();
				var postData = "directories=" + [] + "&filePath=" + files + "&hostName=" + cHost; 
				
				request.post(url, {
					data : postData
				}).then(function(data) {
						var dialog = registry.byId("de_dialog_delete");
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
	
		/*
		* the compress action
		*/
		function compressActionHandle(_container, _context, _fileTablePanel){
			//compress
			on(registry.byId("da_compressMenuItem"), "click", function(){
				// Show archive name input
				var archiveNameTr = document.getElementById("de_dialog_compress_tr");
				archiveNameTr.style.display = "";
				
				var compressSelect = registry.byId("de_dialog_compress_select");
				var selectedValue = compressSelect.value;
				
				var rowDatas = _getSelectRowDatas(_fileTablePanel);
				if(rowDatas.length > 1){
                    // Disable gzip option and set default selection to first one if current selection is gzip
					compressSelect.removeOption(compressSelect.options[3]);
					// Add one option
					compressSelect.addOption({"value": "gzip", "label": "gzip", "disabled": true});
					
					if ("gzip" == selectedValue) {
						compressSelect.options[3].selected = false;
						compressSelect.options[0].selected = true;
					}
                } else {
                	if ("gzip" == selectedValue) {
                		// Hide archive name input
    					archiveNameTr.style.display = "none";
                	} else {
                		// By default, for 1 selected row, enable gzip option
                    	compressSelect.removeOption(compressSelect.options[3]);
    					// Add one option
    					compressSelect.addOption({"value": "gzip", "label": "gzip"});
    					
                		archiveNameTr.style.display = "";
                	}
                }
				
				on(registry.byId("de_dialog_compress_select"), "change", function(){
					var archiveNameTr = document.getElementById("de_dialog_compress_tr");
					var compressSelect = registry.byId("de_dialog_compress_select");
					var selectedValue = compressSelect.value;
					if ("gzip" == selectedValue) {
                		// Hide archive name input
    					archiveNameTr.style.display = "none";
                	} else {
                		archiveNameTr.style.display = "";
                	}
				});
				
				var dialog = registry.byId("de_dialog_compress");
				dialog.set("style", "width: 300px");
				dialog.show();

				on(registry.byId("de_dialog_compress_okBtn"), "click", function(){
					var cHost = _fileTablePanel.getHost();
					var cPath = _fileTablePanel.getPath();
					
					//get all selected files
					var files = [];
					var rowDatas = _getSelectRowDatas(_fileTablePanel);
					for(var i=0;i<rowDatas.length;i++){
						files.push(rowDatas[i].name);
					}
					
					var selectValue = registry.byId("de_dialog_compress_select").value;
					var inputObj = registry.byId("de_dialog_compress_input");
					var inputValue = inputObj.value;
					inputValue = (selectValue != "gzip") ? inputValue : files[0];
					
					//don't input anythin?
					if ('' == inputValue && selectValue != 'gzip') {
						inputObj.focus();
						return false;
					}
					
					var url = _context.contextPath + "/webservice/pac/data/action/compress?rnd=" + (new Date()).getTime();
					var postData = "dataPath=" + encodeURIComponent(cPath) + "&archiveName=" + inputValue + "&hostName=" + cHost + "&selectedFiles=" + files + "&compressType=" + selectValue;
					
					request.post(url, {
						data : postData
					}).then(function(data) {
							var dialog = registry.byId("de_dialog_compress");
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
			});
		}
	
		/*
		* the un-compress action
		*/
		function unCompressActionHandle(_container, _context, _fileTablePanel){
			on(registry.byId("da_unCompressMenuItem"), "click", function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var rowData = _getSelectedRowData(_fileTablePanel);
				var runCommand = _getUnCompressCommand(rowData);
				
				var url = _context.contextPath + "/webservice/pac/data/action/uncompress?rnd=" + (new Date()).getTime();
				var postData = "commands=" + runCommand + "&hostName=" + cHost;

				request.post(url, {
					data : postData
				}).then(function(data) {
						var dialog = registry.byId("de_dialog_compress");
						if(data != null && data != ""){
							showMessage(data);
						}else{
							//close the dialog and refrsh the file table
							_fileTablePanel.refresh(cHost, cPath);
						}
					}, function(err) {
						console.log(err);
					}, function(evt) {
						//console.log(evt);
				});
			});

			function _getUnCompressCommand(_rowData){
				var name = encodeURIComponent(_rowData.name) + "";
				var path = encodeURIComponent(_rowData.path);
				var commands = "cd '" + path + "'";
				if (path.charAt(path.length -1) != '/') {
					path += '/';
		        }
				
				// If not this type compressed file, won't uncompress it and show warning message
				var reg = new RegExp('^.*?\.(gz|zip|tar|bz2|bz|tgz)$','gi');
				if(!reg.test(name)){
					showMessage(Platform.messages['pac.dataexplore.dialog.uncompress.warning.msg'], 
							Platform.messages['pac.dataexplore.dialog.uncompress.warning.title']);
	                return false;
	            }

				var tarDir = " -C '" + path + "'";
				reg = new RegExp('^.*?\.(gz)$', 'gi');
	            if(reg.test(name)){
	                reg = new RegExp('^.*?\.(tar.gz|tgz)$', 'gi');
	                if(reg.test(name)){
	                    commands = "tar " + tarDir + " -zxvf \'" + path + name + "\'";
	                }else{
	                    commands = commands + ";gzip -d \'" + name + "\'";
	                }
	            }
	            reg = new RegExp('^.*?\.(zip)$', 'gi');
	            if(reg.test(name)){
	                commands = commands + ";unzip -o \'" + name + "\'";
	            }
	            reg = new RegExp('^.*?\.(tar)$', 'gi');
	            if(reg.test(name)){
	                commands = "tar " + tarDir + " -xf \'" + name + "\'";
	            }
	            reg = new RegExp('^.*?\.(bz2|bz)$', 'gi');
	            if(reg.test(name)){
	                commands = "tar " + tarDir + " -jxf \'" + path + name+ "\'";
	            }
				
				return commands;
			}
		}

		/*
		* the unload action
		*/
		function uploadActionHandle(_container, _context, _fileTablePanel){
			on(registry.byId("da_uploadMenuItem"), "click", function(){
				var form = dom.byId("upload4IEForm");
				if(has("ie") < 10){
					resetUploadDialog();
					dijit.byId('dialogUpload4IE').show();
				}else{
					dom.byId('fileName').click();
					//dijit.byId('dialogUpload4IE').show();
				}
			});
			
			//For IE (< 10) only
			on(dom.byId('firstFile'), "change", fileInputChangeEvent);
			on(dijit.byId('dialogUpload4IE_submit'), "click",  function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var form = dom.byId("upload4IEForm");
				form.action = _context.contextPath + "/dataexplore/filebrowsing/upload-file4IE?rnd=" + (new Date()).getTime();

				//<!-- <input type="hidden" name="destination" id="destination"/> -->
				//console.log("create input text");
				var destination = dom.byId("destination");
				destination.value = (cHost + ":" + cPath);

				form.action = parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(form.action);
				form.submit();
				var timer = setInterval(function(){
					//check the result value.
					//if its value is "DONE", refresh the file list table
					var iframeTarget = dom.byId("uploadFilesTarget");
					var iframeDoc = iframeTarget.contentWindow.document;
					
					//var result = iframeDoc.getElementById("submitResult");
					var result = iframeDoc.getElementById("resultMessage");
					if(result != null && result.innerHTML == "DONE"){
						//close the interval
						clearInterval(timer);

						//close the dialog and refrsh the file list table
						dijit.byId('dialogUpload4IE').hide();
						_fileTablePanel.refresh(cHost, cPath);
					}
				}, 2000);
			});

			function resetUploadDialog(){
				var div = dom.byId("uploadFiles");
				div.innerHTML = "";

				var firstFile = dom.byId("firstFile");
				firstFile.value = "";

				var destination = dom.byId("destination");
				destination.value = "";
			}

			function fileInputChangeEvent(e){
				var fileName = this.name;
				var fileIndex = parseInt(fileName.substring(fileName.indexOf('[') + 1, fileName.indexOf(']')));

				var div = dom.byId("uploadFiles");
				var inputs = div.getElementsByTagName("input");

				//to create the new file element by click the last one
				if(fileIndex == inputs.length){
					//create new file
					var fileInput = domConstruct.create('input',{type:'file', name:'files['+ (inputs.length + 1) + ']'}, div);
					on(fileInput, 'change', fileInputChangeEvent);
				}
			}

			//For Firefox which supports the HTML5 file upload
			//for firfox, it support to upload multi files in each time
			on(dom.byId('fileName'),'change',function(){
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var fileName = dom.byId('fileName');
				var selectFiles = fileName.files;
				sendFiles(_fileTablePanel, _context, selectFiles, cHost, cPath);
			});
		}


		/*
		* the properties action
		*/
		function propertiesActionHandle(_container, _context, _fileTablePanel){
			on(registry.byId("da_propertiesMenuItem"), "click", function(){
				var rowData = _getSelectedRowData(_fileTablePanel);
				_showRowData(rowData);
				
				var dialog = registry.byId("de_dialog_properties");
				dialog.show();
			});

			function _showRowData(_rowData){
				dom.byId("de_dialog_properties_fileName_value").innerHTML = _rowData.name;
				dom.byId("de_dialog_properties_fileSize_value").innerHTML = _rowData.size;
				dom.byId("de_dialog_properties_location_value").innerHTML = _rowData.absolutePath;
				dom.byId("de_dialog_properties_owner_value").innerHTML = _rowData.owner;
				dom.byId("de_dialog_properties_userGroup_value").innerHTML = _rowData.group;
				dom.byId("de_dialog_properties_permissions_value").innerHTML = _rowData.permission;
				dom.byId("de_dialog_properties_date_value").innerHTML = _rowData.modifyTimeStr;
				dom.byId("de_dialog_properties_fileType_value").innerHTML = _rowData.type;
			}
		}
		
		/*
		* regist the event handle for buttons
		*/
		var buttons = ["tail", "edit", "download", "copyTo", "moveTo", "moreActions"];
		var menuItems = ["newFolder", "delete", "rename", "properties", "copyFrom", "upload", "compress", "unCompress"];
		function registEventsHandle(_container, _context, _id, _fileTablePanel){
			for(var i=0;i<buttons.length;i++) _eventHandle(_container, _context, _fileTablePanel, buttons[i]);
			for(var i=0;i<menuItems.length;i++) _eventHandle(_container, _context, _fileTablePanel, menuItems[i]);
			
			/*
			* to deal with the event
			*/
			function _eventHandle(_container, _context, _fileTablePanel, _button){
				switch(_button){
					case "tail":
						on(registry.byId("da_tailBtn"), "click", function(){
							var rowDatas = _getSelectRowDatas(_fileTablePanel);
                            if(rowDatas.length == 0){
                                return;
                            }
							window.tail(_context, rowDatas);
						});
						break;
					case "edit":
						on(registry.byId("da_editBtn"), "click", function(){
							var rowDatas = _getSelectRowDatas(_fileTablePanel);
                            if(rowDatas.length == 0){
                                return;
                            }
							window.edit(_context, rowDatas);
						});
						break;
					case "download":
						on(registry.byId("da_downloadBtn"), "click", function(){
							var rowData = _getSelectedRowData(_fileTablePanel);
                            if(rowData.length == 0){
                                return;
                            }   
							window.download(_context, rowData);
						});
						break;
					case "properties":
						propertiesActionHandle(_container, _context, _fileTablePanel);
						break;
					case "copyTo":
						copyToActionHandle(_container, _context, _fileTablePanel);
						break;
					case "moveTo":
						moveToActionHandle(_container, _context, _fileTablePanel);
						break;
					case "copyFrom":
						copyFromActionHandle(_container, _context, _fileTablePanel);
						break;
					case "newFolder":
						newFolderActionHandle(_container, _context, _fileTablePanel);
						break;
					case "delete":
						deleteActionHandle(_container, _context, _fileTablePanel);
						break;
					case "rename":
						renameActionHandle(_container, _context, _fileTablePanel);
						break;
					case "compress":
						compressActionHandle(_container, _context, _fileTablePanel);
						break;
					case "unCompress":
						unCompressActionHandle(_container, _context, _fileTablePanel);
						break;
					case "upload":
						uploadActionHandle(_container, _context, _fileTablePanel);
						break;
				}
			}
		}

		function initCustomActions(_container, _context, _id, _fileTablePanel){
			var menuItems = [];

			//custom actions
			request.post(_context.urlContext + "/doGetJobDataActions.action?rnd=" + (new Date()).getTime(),{
					data: "",
					handleAs: "json",
				}).then(function(data){
					var buttons = createDropDownButtons(menuItems, data);
					for(var i=0;i<buttons.length;i++){
						buttons[i].startup();
						dom.byId("dropDownButtonContainer").appendChild(buttons[i].domNode);
					}

					//if there add too many menu items, publish the event to resze the top panel size
					var buttonSize = 6 + buttons.length;
					topic.publish((_container + "_dataAction") + "@event.resize", _id, (buttonSize/11));
				}, function(err){
					// handle an error condition
				}, function(evt){
					// handle a progress event
					//alert("evt:" + evt);
			});

			//jdags = job data action groups
			function createDropDownButtons(_menuItems, _actionGroups){
				var r = [];
				for(var i=0;i<_actionGroups.length;i++){
					var actionGroup = _actionGroups[i];
					
					//initialize the menu item
					var menu = new DropDownMenu();
					var actionItems = actionGroup.actionItems;
					for(var j=0;j<actionItems.length;j++){
						var actionItem = actionItems[j];
						// Arrange tooltip (description + special message) for every drop down button.
						var menuTooltip = Platform.messages['pac.dataexplore.buttons.custom.tooltip.no.file'].replace("_ACTION_", actionItem.name.replace(/&apos;/g,"'").replace(/&#92;/g,"\\").replace(/&quot;/g,'"'));
						var menuItem = new MenuItem({
							id: (actionGroup.id + "_" + actionItem.id),
							label: actionItem.name,
							value: actionItem,
							title: menuTooltip,
							onClick: function(evt){
								topic.publish((_container + "_customAction") + "@event.item.click", this.value);
							}
						});
						//set disabled for all menu items
						menuItem.set("disabled", true);
						menu.addChild(menuItem);

						//put it into the array
						_menuItems.push(menuItem);
					}
					
					//initialize the drop down button
					var dropDownBtn = new DropDownButton({
						id: actionGroup.id,
						label: actionGroup.name,
						dropDown: menu,
					});
					r.push(dropDownBtn);
				}
				return r;
			}

			function isSupported(_menuItem, _postfix){
				var r = false;
				var enableType = _menuItem.value.enableType;
				if(enableType != "ALL"){
					var fileTypes = enableType.split(",");
					for(var i=0;i<fileTypes.length;i++){
						if(_checkFileType(fileTypes[i], _postfix)){
							r = true;
							break;
						}
					}
				}else{
					r = true;
				}
				return r;
			}
			function _checkFileType(_fileType, _postfix){
				var r = false;
				//the file's type, *.html, *.c, *.c.a
				var pf = _fileType.substring(_fileType.lastIndexOf("."));
				if(pf == _postfix) r = true;
				return r;
			}

			function _getLocalTime(){
				var dateStr = locale.format(new Date(),{
					selector: "date",
					datePattern: "y-MM-d H:m:s"
				});
				return dateStr.replace(/[\/\.\-\:\s]/g,'');
			}

			function getOutputFile(_item){
				var localTime = _getLocalTime();
				var fileName = _item.name.replace(/ /g,'_');
				fileName = fileName.replace(/&apos;/g,"_").replace(/&#92;/g,"_").replace(/&quot;/g,'_') + "_" + localTime;
				// Get spooler path from Repository.xml
				return _context.spoolerPath + "/" + fileName;
			}

			function closeMenuItems(_menuItems){
				for(var i=0;i<_menuItems.length;i++){
					_menuItems[i].set("disabled", true);
				}
			}
			
			function replaceSpecialChar(data) {
				return data.replace(/&apos;/g,"'").replace(/&#92;/g,"\\").replace(/&quot;/g,'"');
			}

			//listen the file table list's selected event
			topic.subscribe(_fileTablePanel.getEventPrefix() + "@event.row.selected", function(id, rowId){
				var selectedRows = _fileTablePanel.getSelected();
				//console.log("selected rows: " + selectedRows);
				var menuTooltip = "";
				//by default, close all menu items
				closeMenuItems(menuItems);

				//open the menu item which supported all of the selected files
				if(selectedRows.length > 1){
					for(var i=0;i<menuItems.length;i++){
						var menuItem = menuItems[i];

						//only service for the items which support multi files
						if(menuItem.value.enableMulti == "true"){
							var r = false;
							// If there is one supported file in selected files, enable button.
							for(var j=0;j<selectedRows.length;j++){
								var rowData = _fileTablePanel.getRowData(selectedRows[j]);
								
								//check all of the menu items, which supports the file postfix
								var fileName = rowData.name;
								var postfix = fileName.substring(fileName.lastIndexOf("."));
								if(isSupported(menuItem, postfix)){
									r = true; break;
								}
							}
							
							if(r == true) {
								menuItem.set("disabled", false);
								menuItem.set("title", replaceSpecialChar(menuItem.value.description));
							} else {
								menuItem.set("disabled", true);
								// No proper files selected
								menuItem.set("title", Platform.messages['pac.dataexplore.buttons.custom.tooltip.no.filetype'].replace("_ACTION_", replaceSpecialChar(menuItem.label)).replace("_TYPE_", menuItem.value.enableType) );
							}
						} else {
							menuItem.set("disabled", true);
							menuItem.set("title", Platform.messages['pac.dataexplore.buttons.custom.tooltip.multifile'].replace("_ACTION_", replaceSpecialChar(menuItem.label)) );
						}
					}
				}else{
					for(var i=0;i<menuItems.length;i++){
						// No selected files and reset the tooltip
						if (0 == selectedRows.length) {
							menuTooltip = Platform.messages['pac.dataexplore.buttons.custom.tooltip.no.file'].replace("_ACTION_", replaceSpecialChar(menuItem.label) );
							menuItem.set("title", menuTooltip);
							continue;
						}
						var menuItem = menuItems[i];
						var r = false;
						var rowData = _fileTablePanel.getRowData(selectedRows[0]);
						
						//check all of the menu items, which supports the file postfix
						var fileName = rowData.name;
						var postfix = fileName.substring(fileName.lastIndexOf("."));
						if(isSupported(menuItem, postfix)){
							r = true;
						}
						
						if(r == true) {
							menuItem.set("disabled", false);
							// One proper file selected
							menuItem.set("title", replaceSpecialChar(menuItem.value.description));
						} else {
							menuItem.set("disabled", true);
							// No proper files selected
							menuItem.set("title", Platform.messages['pac.dataexplore.buttons.custom.tooltip.no.filetype'].replace("_ACTION_", replaceSpecialChar(menuItem.label)).replace("_TYPE_", menuItem.value.enableType) );
						}
					}
				}
			});


			//listen the custom drop down list click event
			topic.subscribe((_container + "_customAction") + "@event.item.click", function(item){
				function _createContent(item){
					var table = domConstruct.create("table", {id: "sp_summary_table"});

					var tr_0 = domConstruct.create("tr", {}, table);
					var tx_0 = Platform.messages['pac.dataexplore.buttons.custom.message.action'].replace("{0}", "&#60;" + item.name + "&#62;");
					var td_0 = domConstruct.create("td", {innerHTML: tx_0}, tr_0);
					
					var tr_1 = domConstruct.create("tr", {}, table);
					var tx_1 = Platform.messages['pac.dataexplore.buttons.custom.message.desc'].replace("{0}", item.description);
					var td_1 = domConstruct.create("td", {innerHTML: tx_1}, tr_1);
					
					var tr_2 = domConstruct.create("tr", {}, table);
					var jobdataaction_fileType = item.enableType
					if (jobdataaction_fileType.toUpperCase() == "ALL" ){
						jobdataaction_fileType = Platform.messages['pac.dataexplore.buttons.custom.message.alltype'];
					}
					var tx_2 = Platform.messages['pac.dataexplore.buttons.custom.message.filetype'].replace("{0}", jobdataaction_fileType);
					var td_2 = domConstruct.create("td", {innerHTML: tx_2}, tr_2);

					var tr_3 = domConstruct.create("tr", {}, table);
					var _outputFile = getOutputFile(item);
					var fileName = _outputFile.substring(_outputFile.lastIndexOf("/") + 1);
					var tx_3 = Platform.messages['pac.dataexplore.buttons.custom.message.output'].replace("{0}", fileName);
					var td_3 = domConstruct.create("td", {innerHTML: tx_3}, tr_3);

					return table;
				}

				function _doAction(_context, _item, _files, _host, _path, _outputFile){
					var fileName = _outputFile.substring(_outputFile.lastIndexOf("/") + 1);

					var url = _context.contextPath + "/webservice/pac/data/action/doaction?rnd=" + (new Date()).getTime();
					var postData = "commands=" + _item.cmdValue + "&filePath=" + _files + "&actionName=" + _item.name + "&fileName=" + fileName + "&execHost=" + _host;
					
					request.post(url, {
						data : postData
					}).then(function(data) {
							if (data != "") {
								showMessage(data);
							}
							_fileTablePanel.refresh(_host, _path);
						}, function(err) {
							console.log(err);
						}, function(evt) {
							//console.log(evt);
					});
				}
				
				var dialog = new ConfirmDialog({
					title: item.name,
					/*style: "width:400px;height:180px",*/
					content: _createContent(item),
					onExecute: function(event){
						//get current host & path
						var cHost = _fileTablePanel.getHost();
						var cPath = _fileTablePanel.getPath();

						//get all select files
						var rowDatas = _getSelectRowDatas(_fileTablePanel);
						var files = [];
						for(var i=0;i<rowDatas.length;i++){
							files.push(rowDatas[i].absolutePath);
						}
						var vaildFileEscapePathStr = [];
						for(var fNum = 0; fNum < files.length; fNum++){
							var fType = files[fNum].substring(files[fNum].lastIndexOf(".")+1);
							if (item.enableType.toUpperCase() == "ALL" || (-1 != item.enableType.toUpperCase().indexOf("*."+fType.toUpperCase()) && fType != "")) {
								vaildFileEscapePathStr[vaildFileEscapePathStr.length] = files[fNum];
							}
						}
						
						//get output file
						var outputFile = getOutputFile(item);
						
						//check the item's console
						var itemConsole = item.console;
						switch(itemConsole){
							case "VNC":
								window.openVNC(_context, item, vaildFileEscapePathStr, cHost, cPath, outputFile);
								break;
							default:
								_doAction(_context, item, vaildFileEscapePathStr, cHost, cPath, outputFile);
						}
					},
					onHide: function(){this.destroyRecursive(false);}
				});
				
				//check the item's console
				var itemConsole = item.console;
				if (itemConsole != null && itemConsole != 'false' && itemConsole != 'VNC') {
					// Console type is not supported in jobdataaction.xml
					showMessage(itemConsole + ": " + Platform.messages['pac.dataexplore.buttons.custom.message.console.type.not.supported']);
				} else {
					dialog.show();
				}
			});
		}
        
        //TODO for build open with buttons
        function initOpenWithActions(_container, _context, _id, _fileTablePanel, _host, _path){
            var fileExtMap = [];
            var appOptions = [];
            var menuItems = [];
            var selectedFile;

            request.get(_context.contextPath + "/ws/applicationIconView/assocApps?files=*&from=pac&_type=json",{
                    data: "",
                    handleAs: "json",
                }).then(function(data){
                    var buttons = buildOpenWithButtons(menuItems, data);
                    for(var i=0;i<buttons.length;i++){
                        buttons[i].startup();
                        dom.byId("dropDownButtonContainer").appendChild(buttons[i].domNode);
                    }

                    //if there add too many menu items, publish the event to resize the top panel size
                    var buttonSize = 6 + buttons.length;
                    topic.publish((_container + "_openApp") + "@event.resize", _id, (buttonSize/11));
                }, function(err){
                    // handle an error condition
                }, function(evt){
                    // handle a progress event
                    //alert("evt:" + evt);
            });

            //jdags = job data action groups
            function buildOpenWithButtons(_menuItems, appData){
                var r = [];
                if(appData.SortedAssociatedApps!=""){
                    var appList = appData.SortedAssociatedApps.list;
					if(!appList.length){
						var appItemId = appList['@id'];
						var viewApps = appList.IconViewApps;
                        if(!viewApps.length){
                            var appItemName = viewApps['@name'];
                            if(appItemName!=null){
								pushFileAppMapping(appItemId, appItemName);
							}
                        } else {
                            for(var j=0; j<viewApps.length; j++){
                                var appItemName = viewApps[j]['@name'];
                                if(!appItemName){
                                    continue;
                                }
                                pushFileAppMapping(appItemId, appItemName);
                            }
                        }
					} else {
	                    for(var i=0; i<appList.length; i++){
	                    	var appItemId = appList[i]['@id'];
	                        var viewApps = appList[i].IconViewApps;
	                        if(!viewApps.length){
	                            var appItemName = viewApps['@name'];
	                            if(appItemName!=null){
									pushFileAppMapping(appItemId, appItemName);
								}
	                        } else {
	                            for(var j=0; j<viewApps.length; j++){
	                                var appItemName = viewApps[j]['@name'];
	                                if(!appItemName){
	                                    continue;
	                                }
	                                pushFileAppMapping(appItemId, appItemName);
	                            }
	                        }
	                    }
					}
                }

                //initialize the menu item
                var menu = new DropDownMenu();
                for(var i=0;i<appOptions.length;i++){
                    var optItem = appOptions[i];
                    var menuItem = new MenuItem({
                        id: "openApp_" + optItem.value,
                        label: optItem.text,
                        value: optItem.value,
                        title: optItem.text,
                        onClick: function(evt){
                            topic.publish((_container + "_openApp") + "@event.item.click", this.value);
                        }
                    });
                    //set disabled for all menu items
                    menuItem.set("disabled", true);
                    menu.addChild(menuItem);

                    //put it into the array
                    _menuItems.push(menuItem);
                }
                //initialize the drop down button
                var dropDownBtn = new DropDownButton({
                    id: "openWith",
                    label: Platform.messages['pac.dataexplore.buttons.openwith.mainmenu'],
                    dropDown: menu,
                });
                r.push(dropDownBtn);
                return r;
            }

            function pushFileAppMapping(newItemId, newItemName){
            	var extItem = {fileExt: newItemId, appName: newItemName};
            	fileExtMap.push(extItem);
            	var exitOpt = false;
            	if(!appOptions.length){
            		if("openApp_" + newItemName == appOptions.value){
            			exitOpt = true;
            		}
            	} else {
            		for(var m=0; m<appOptions.length; m++){
            			if("openApp_" + newItemName == appOptions[m].value){
            				exitOpt = true;
            				break;
            			}
            		}
            	}
            	if(!exitOpt){
            		var itemText = Platform.messages['pac.dataexplore.buttons.openwith.menuitem'];
            		if(itemText){
            			itemText = itemText.replace("_APPNAME_", newItemName);
            		}
            		var optItem = {value: "openApp_" + newItemName, text: itemText, disabled: true}
            		appOptions.push(optItem);
            	}
            }
            
            function isSupported(_menuItem, _postfix){
                var r = false;
                for(var i=0; i<fileExtMap.length; i++){
                    if(_postfix == fileExtMap[i].fileExt){
                        if(_menuItem.value == "openApp_" + fileExtMap[i].appName){
                            r = true;
                        }
                    }
                }
                return r;
            }

            function closeMenuItems(_menuItems){
                for(var i=0;i<_menuItems.length;i++){
                    _menuItems[i].set("disabled", true);
                }
            }

            function replaceSpecialChar(data) {
                return data.replace(/&apos;/g,"'").replace(/&#92;/g,"\\").replace(/&quot;/g,'"');
            }

            //listen the file table list's selected event
            topic.subscribe(_fileTablePanel.getEventPrefix() + "@event.row.selected", function(id, rowId){
                var menuTooltip = "";
                var selectedRows = _fileTablePanel.getSelected();
                //by default, close all menu items
                closeMenuItems(menuItems);

                //open the menu item which supported all of the selected files
                if(selectedRows.length > 1){
                    for(var i=0;i<menuItems.length;i++){
                        var menuItem = menuItems[i];
                        menuItem.set("disabled", true);
                        menuItem.set("title", menuItem.label);
                    }
                }else{
                    for(var i=0;i<menuItems.length;i++){
                        // No selected files and reset the tooltip
                        var r = false;
                        var menuItem = menuItems[i];
                        if (0 == selectedRows.length) {
                            menuTooltip = menuItem.label;
                            menuItem.set("title", menuTooltip);
                            continue;
                        }

                        //check all of the menu items, which supports the file postfix
                        var selectRow = selectedRows[0];
                        var rowData = _fileTablePanel.getRowData(selectRow);
                        var fileName = rowData.name;
                        selectedFile = rowData.absolutePath;
                        var postfix = fileName.substring(fileName.lastIndexOf("."));
                        if(isSupported(menuItem, postfix)){
                            r = true;
                        }

                        if(r == true) {
                            menuItem.set("disabled", false);
                            // One proper file selected
                            menuItem.set("title", menuItem.label);
                        } else {
                            menuItem.set("disabled", true);
                            // No proper files selected
                            menuItem.set("title", menuItem.label);
                        }
                    }
                }
            });

            //listen the custom drop down list click event
            topic.subscribe((_container + "_openApp") + "@event.item.click", function(item){
                var pos = item.indexOf("_");
                var selectedApp = item.substring(pos+1);
                var progressBar = new ProgressBar({id: "openwithProgress", style: "width: 300px"});
                progressBar.startup();
                //dom.byId('progressHolder').appendChild(progressBar.domNode);
                var url = _context.contextPath + "/ws/applicationIconView/runAppAndDownloadVNCFile?appName=" + selectedApp + "&fileName=" + selectedFile;
                request.get(url).then(function(data) {
                    if(progressBar!=null){
                        progressBar.destroy(false);
                    }
                    if (data != "") {
                        var startPos = data.indexOf("Content-ID");
                        startPos = data.indexOf("<", startPos);
                        var endPos = data.indexOf(">", startPos);
                        var filePath = data.substring(startPos+1, endPos);
                        window.downFile(_context, _host, filePath);
                    }
                }, function(err) {
                    if(progressBar!=null){
                        progressBar.destroy(false);
                    }
                    console.log(err);
                    alert(Platform.messages["pac.dataexplore.buttons.openwith.fail"]);
                }, function(evt) {
                    if(progressBar!=null){
                        progressBar.destroy(false);
                    }
                    //console.log(evt);
                });
            });
        }

		/*
		* the drag drop event handle 
		*/
		function registDragDropEvents(_container, _context, _id, _fileTablePanel){
			function preventEvent(e) {
				e = e || window.event;
				e.stopPropagation();
				if (e.preventDefault) e.preventDefault(); // required by FF + Safari
				e.dataTransfer.dropEffect = 'copy'; // tells the browser what drop effect is allowed here
				return false; // required by IE
			}

			function dropAction(e){
				preventEvent(e);
				var cHost = _fileTablePanel.getHost();
				var cPath = _fileTablePanel.getPath();

				var selectFiles = e.dataTransfer.files || e.target.files;
				sendFiles(_fileTablePanel, _context, selectFiles, cHost, cPath);
			}

			if(has("ie") < 10){
				//Don't support to upload file by drag drop
			}else{
				//the drag drop container
				var ddc = dom.byId(_fileTablePanel.container);
				if(ddc.addEventListener){
					ddc.addEventListener("dragenter", preventEvent, false);
					ddc.addEventListener("dragover", preventEvent, false);
					ddc.addEventListener("dragleave", preventEvent, false);
					ddc.addEventListener("drop", dropAction, false);
				} else {
					ddc.attachEvent("ondragenter", preventEvent);
					ddc.attachEvent("ondragover", preventEvent);
					ddc.attachEvent("ondragleave", preventEvent);
					ddc.attachEvent("ondrop", dropAction);
				}
			}
		}

		/*
		* to deal with the events
		*/
		function eventsHandle(_container, _context, _id, _fileTablePanel){
			//deal with the file table events
			topic.subscribe(_fileTablePanel.getEventPrefix() + "@event.row.selected", function(id, rowId){
				var selectedRows = _fileTablePanel.getSelected();

				if(selectedRows.length == 0){
					disableButtons(["tail", "edit", "download", "copyTo", "moveTo"]);
					disableMenuItems(["delete", "rename", "properties", "compress", "unCompress"]);
				} else {
					enableButtons(buttons);
					enableMenuItems(menuItems);
				}

				//case 1: select multi files
				//disable the tail/edit/download buttons
				if(selectedRows.length > 1){
					disableButtons(["download"]);
					disableMenuItems(["rename", "properties", "unCompress"]);
				}
				
				//case 2: select one file, checking the file type
				if(selectedRows.length == 1){
					var rowData = _fileTablePanel.getRowData(selectedRows[0]);
					//don't support to execute the "newFolder", "Delete", "Rename", "copyFrom", 
					//"upload", "compress", "un-compress" action in remote host

					//for folder
					if(rowData.type == "d"){
						disableButtons(["tail", "edit", "download"]);
						enableButtons(["copyTo", "moveTo"]);
						enableMenuItems(menuItems);
					}
					//for file
					if(rowData.type == "f"){
						enableButtons(buttons);
						enableMenuItems(menuItems);
					}
					//TODO: for the soft/hard link file
				}
			});
		}


		
		function disableButtons(_buttonNames){
			for(var i=0;i<_buttonNames.length;i++){
				disableButton(_buttonNames[i]);
			}
		}
		function enableButtons(_buttonNames){
			for(var i=0;i<_buttonNames.length;i++){
				enableButton(_buttonNames[i]);
			}
		}
		function disableButton(_buttonName){
			var button = registry.byId("da_" + _buttonName + "Btn");
			button.set("disabled", true);
		}

		function enableButton(_buttonName){
			var button = registry.byId("da_" + _buttonName + "Btn");
			button.set("disabled", false);
		}

		//execute menu items
		function disableMenuItems(_menuItemNames){
			for(var i=0;i<_menuItemNames.length;i++){
				disableMenuItem(_menuItemNames[i]);
			}
		}
		function enableMenuItems(_menuItemNames){
			for(var i=0;i<_menuItemNames.length;i++){
				enableMenuItem(_menuItemNames[i]);
			}
		}
		function disableMenuItem(_menuItemName){
			var menuItem = registry.byId("da_" + _menuItemName + "MenuItem");
			menuItem.set("disabled", true);
		}

		function enableMenuItem(_menuItemName){
			var menuItem = registry.byId("da_" + _menuItemName + "MenuItem");
			menuItem.set("disabled", false);
		}

		function _getSelectedRowData(_fileTablePanel){
			var selectedRows = _fileTablePanel.getSelected();
			return _fileTablePanel.getRowData(selectedRows[0]);
		}

		function _getSelectRowDatas(_fileTablePanel){
			var r = [];
			var selectedRows = _fileTablePanel.getSelected();
			for(var i=0;i<selectedRows.length;i++){
				var rowData = _fileTablePanel.getRowData(selectedRows[i]);
				r.push(rowData);
			}
			return r;
		}

		/*
		* the helpful function for upload action
		* the drag drop's action are also using these functions
		*/
		function sendFiles(_fileTablePanel, _context, _selectFiles, _host, _path) {
			function checkPermission(_context, _host, _path, _function){
				var postData = "hostName=" + _host + "&filePath=" + _path;
				request.post(_context.contextPath + "/webservice/pac/data/checkWritePermission/file?rnd=" + (new Date()).getTime(),{
					data: postData,
				}).then(function(data){
					if(data != ""){
						showMessage(Platform.messages["pac.dataexplore.messages.failure.access.dir"]);
					}else{
						_function();
					}
				}, function(err){
					// handle an error condition
				}, function(evt){
					// handle a progress event
				});
			}

			checkPermission(_context, _host, _path, function(){
				for(var i=0; i< _selectFiles.length; i++){
					var file = _selectFiles[i];
					if(file.isDirectory != true){
						//create progress bar and shown
						var progressBar = createProgressBar(file.name + "_progressBar"); 
						progressBar.startup();
						dom.byId('progressHolder').appendChild(progressBar.domNode);
						
						//split the file and send it
						var CHUNK_SIZE = 1024 * 1024 * 5;
						var SIZE = file.size;

						var chunkLength = Math.floor(SIZE / CHUNK_SIZE);
						if ((SIZE % CHUNK_SIZE) != 0) {
							chunkLength += 1;
						}

						var start = 0;
						var end = CHUNK_SIZE;
						var chunkIndex = 0;
						while (start < SIZE) {
							var chunkFile;
							if ('mozSlice' in file) {
								chunkFile = file.mozSlice(start, end);
							} else {
								chunkFile = file.slice(start, end);
							}
							sendFile(_fileTablePanel, _context, _selectFiles, chunkFile, chunkIndex, chunkLength, file.name, _host, _path);
							
							start = end;
							end = start + CHUNK_SIZE;
							chunkIndex++;
						};
					}else{
						alert("Don't support to upload the file directroy....");
					}
				}
			});

			function createProgressBar(_id){
				var r = new ProgressBar({
					id: _id,
					style: "width: 300px"
				});
				return r;
			}

			function destroyProgressBars(_selectFiles){
				for(var i=0;i<_selectFiles.length;i++){
					var progressBar = getProgressBar(_selectFiles[i].name);
					if(progressBar != null) progressBar.destroy(false);
				}
			}

			function isDone(_selectFiles){
				var r = true;
				for(var i=0;i<_selectFiles.length;i++){
					var progressBar = getProgressBar(_selectFiles[i].name);
					if(progressBar != null && progressBar.get("value") != 100){
						r = false;
						break;
					}
				}
				return r;
			}

			function sendFile(_fileTablePanel, _context, _selectFiles, _chunkFile, _chunkIndex, _chunkLength, _fileName, _host, _path) {
				// prepare FormData
				var formData = new FormData();
				formData.append('file', _chunkFile);
				formData.append('chunkIndex', _chunkIndex);
				formData.append('chunkLength', _chunkLength);
				formData.append('fileName', _fileName);
				formData.append('hostName', _host);
				formData.append('dest', _path);

				//
				var xhr = new XMLHttpRequest();
				xhr.open('POST', parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(_context.contextPath + "/dataexplore/filebrowsing/upload-file?rnd=" + (new Date()).getTime()), true);
				xhr.onerror = function(){};
				xhr.upload.onloadstart = function(event) {
					showProgressDialog();
				}
				xhr.onreadystatechange = function(e) {
					if (this.readyState == 4 && this.status == 200){
						try{
							var progressBar = getProgressBar(_fileName);
							var responseText = xhr.responseText;
							if (responseText == "DONE") {
								progressBar.set({value: 100});

								//if the other progress had been done, close the progress dialog
								//and refresh the file table list
								if(isDone(_selectFiles) == true){
									//refresh the file table list
									_fileTablePanel.refresh(_host, _path);

									//destroy all progress bars
									destroyProgressBars(_selectFiles);
									hideProgressDialog();
								}
							}
							else if(responseText.indexOf("PROCESSING") != -1){
								var percentChunk = 100.00 / _chunkLength;
								
								var pValue = progressBar.get("pValue");
								pValue = (pValue != null) ? pValue : 0;
								
								pValue = (pValue + percentChunk);
								var sValue = Math.floor(pValue * 100) / 100;

								//set progress's p value
								progressBar.set("pValue", pValue);

								//set progress's s value
								progressBar.set({value: sValue});
							}else{
								showMessage(xhr.responseText);

								//the below code is a hack method, to showing an over layer on the parent page
								//in the current stage, there is no method to transfer information between in the difference pages.
								window.hiddenOverLayer();
							}
						}catch(e){
							console.log("exception:" + e);

							//the below code is a hack method, to showing an over layer on the parent page
							//in the current stage, there is no method to transfer information between in the difference pages.
							window.hiddenOverLayer();
						}
					}
				};
				xhr.send(formData);
			}

			function showProgressDialog(){
				dom.byId('progressHolder').style.display = "block";
				dijit.byId('uploadFileProgressDialog').show();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.showOverLayer();
			}
			
			function hideProgressDialog(){
				dom.byId('progressHolder').style.display = "none";
				dijit.byId('uploadFileProgressDialog').hide();

				//the below code is a hack method, to showing an over layer on the parent page
				//in the current stage, there is no method to transfer information between in the difference pages.
				window.hiddenOverLayer();
			}
		}

		function getProgressBar(_fileName){
			return dijit.byId(_fileName + "_progressBar");
		}

		function showMessage(_message, title){
			var dialog = new Dialog({
				title: Platform.messages['pac.dataexplore.buttons.custom.message'],
				style: "width:300px;height:100px",
				content: _message,
				onHide: function(){this.destroyRecursive(false);}
			});
			dialog.show();
		}
		
		/*
		* create the content panel
		*/
		function createContent(_container, _context, _id, _fileTablePanel){
			var host = _fileTablePanel.getHost();
			var path = _fileTablePanel.getPath();
			
			//Create the content panel
			var url = _context.urlContext + "/toDataActions.action?rnd=" + (new Date()).getTime();
			url = request.appendCsrfTokenToURL(url).value;
			var content = new ContentPane({
				href: url,
				style: "width:100%;height:100%",
				onHide: function(){this.destroyRecursive(false);},
				onDownloadEnd: function () {
					// initialize the custom actions
					initCustomActions(_container, _context, _id, _fileTablePanel);
					initOpenWithActions(_container, _context, _id, _fileTablePanel, host, path);
					
					// initialize the file browser and submission panel.
					registEventsHandle(_container, _context, _id, _fileTablePanel);

					// regist the drag drop events
					registDragDropEvents(_container, _context, _id, _fileTablePanel);

					//execute the event
					eventsHandle(_container, _context, _id, _fileTablePanel);
				}
			});
			return content;
		}
		
		return declare('dataexplore.DataActionsPanel', null, {
			constructor: function (_container, _context, _id, _fileTablePanel){
				this.container = (_container != null) ? _container : "da_dataActions_container";
				this.context = _context;  this.id = _id;
				this.fileTablePanel = _fileTablePanel;
			},
			startup: function() {
				this.content = createContent(this.container, this.context, this.id, this.fileTablePanel);
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
				return (this.container + "_dataAction");
			}
		});
});
