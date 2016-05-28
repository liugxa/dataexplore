define([
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		"dojo/has",
		"dijit/registry",
		"dojo/dom",
		"dojo/dom-construct",
		"dojo/topic",
		"dojo/aspect",
		"dojo/on",
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dijit/form/Button",
		"dijit/ProgressBar",
		"dojo/date/locale",
		//Help moudules
		"paccommon/request",
	],function(lang, cfg, declare, has, registry, dom, domConstruct, topic, aspect, on, Dialog, ConfirmDialog, Button, ProgressBar, locale, request){

		function createProgressDialog(){
			var dialog = new Dialog({
				title: 'Upload Progress',
				style: "width:300px;height:100px",
				onHide: function(){this.destroyRecursive(false);}
			});
			return dialog;
		}
		
		function createProgressBar(_file){
			var progressBar = new ProgressBar({
				id: _file.name + "_progressBar",
				style: "width: 280px"
			});
			return progressBar;
		}
				
		function getProgressBar(_file){
			return registry.byId(_file.name + "_progressBar");
		}
	
		function destroyProgressBars(_files){
			for(var i=0;i<_files.length;i++){
				var progressBar = getProgressBar(_files[i]);
				if(progressBar != null) progressBar.destroy(false);
			}
		}
		
		function isDone(_files){
			var r = true;
			for(var i=0;i<_files.length;i++){
				var progressBar = getProgressBar(_files[i]);
				if(progressBar != null && progressBar.get("value") != 100){
					r = false;
					break;
				}
			}
			return r;
		}
		
		function showMessage(_message){
			var dialog = new Dialog({
				title: 'Message',
				style: "width:300px;height:100px",
				content: _message,
				onHide: function(){this.destroyRecursive(false);}
			});
			dialog.show();
		}
		
		//send multi files
		function sendFiles(_this, _files) {
			_this.progressDialog = createProgressDialog();
			_this.progressDialog.show();
			
			for(var i=0; i< _files.length; i++){
				var file = _files[i];
				if(file.isDirectory != true){
					var progressBar = createProgressBar(file);
					_this.progressDialog.addChild(progressBar);
			
					//split the file into the piece of blocks
					var BLOCK_SIZE = 1024 * 1024 * 1;
					var bLength = Math.floor(file.size / BLOCK_SIZE);
					if ((file.size % BLOCK_SIZE) != 0) bLength += 1;
					
					//send the block file
					for(var j=0;j<bLength;j++){
						var start = BLOCK_SIZE * j;
						var end = start + BLOCK_SIZE;
						
						var bFile = file.slice(start, end);
						if('mozSlice' in file) bFile = file.mozSlice(start, end);
						
						var blockFile = {"name": file.name, "file": bFile, "index": j, "length": bLength};
						sendFile(_this, _files, blockFile);
					};
				}else{
					showMessage("Don't support to upload the file directroy....");
				}
			}
		}
		
		//send an single file
		function sendFile(_this, _files, _blockFile) {
			// prepare FormData
			var formData = new FormData();
			formData.append('uploadFile.file', _blockFile.file);
			formData.append('uploadFile.index', _blockFile.index);
			formData.append('uploadFile.length', _blockFile.length);
			formData.append('uploadFile.name', _blockFile.name);
			formData.append('uploadFile.host', _this.host);
			formData.append('uploadFile.path', _this.path);
			
			//send the file
			var xhr = new XMLHttpRequest();
			xhr.open('POST', _this.context.urlContext + "/doUploadFile.action?rnd=" + (new Date()).getTime(), true);
			
			xhr.onerror = function(){};
			xhr.upload.onloadstart = function(event){}
			xhr.onreadystatechange = function(e){
				if (this.readyState == 4 && this.status == 200){
					try{
						var progressBar = getProgressBar(_blockFile);
						var responseText = xhr.responseText;
						
						if (responseText == "DONE") {
							progressBar.set({value: 100});

							//if the other progress had been done, close the progress dialog
							//and refresh the file table list
							if(isDone(_files) == true){
								//destroy all progress bars
								//destroyProgressBars(_files);
								//console.log(_this.progressDialog);
								//_this.progressDialog.hide();
								
							}
						}else{
							var percentChunk = 100.00 / _blockFile.length;
							
							var pValue = progressBar.get("pValue");
							pValue = (pValue != null) ? pValue : 0;
							
							pValue = (pValue + percentChunk);
							var sValue = Math.floor(pValue * 100) / 100;

							//set progress's p value
							progressBar.set("pValue", pValue);

							//set progress's s value
							progressBar.set({value: sValue});
						}
					}catch(e){
						console.log("exception:" + e);
					}
				}
			};
			xhr.send(formData);
		}
		
		/*
		* the drag drop event handle 
		*/
		function _startup(_this){
			function preventEvent(e) {
				e = e || window.event;
				e.stopPropagation();
				
				// required by FF + Safari
				if (e.preventDefault) e.preventDefault(); 
				
				// tells the browser what drop effect is allowed here
				e.dataTransfer.dropEffect = 'copy'; 
				
				// required by IE
				return false; 
			}
			
			function dropAction(e){
				preventEvent(e);
				
				var selectFiles = e.dataTransfer.files || e.target.files;
				sendFiles(_this, selectFiles);
			}

			if(has("ie") < 10){
				//Don't support to upload file by drag drop
			}else{
				//the drag drop container
				var container = dom.byId(_this.container);
				if(container.addEventListener){
					container.addEventListener("dragenter", preventEvent, false);
					container.addEventListener("dragover", preventEvent, false);
					container.addEventListener("dragleave", preventEvent, false);
					container.addEventListener("drop", dropAction, false);
				} else {
					container.attachEvent("ondragenter", preventEvent);
					container.attachEvent("ondragover", preventEvent);
					container.attachEvent("ondragleave", preventEvent);
					container.attachEvent("ondrop", dropAction);
				}
			}
		}
		
		return declare('dataexplore.FileUploadPanel', null, {
			constructor: function (_container, _context, _id, _host, _path){
				this.container = (_container != null) ? _container : "de_fileDragDrop_container";
				this.context = _context;  this.id = _id;
				this.host = _host; this.path = _path;
			},
			startup: function() {
				_startup(this);
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
				return (this.container + "_fileDragDrop");
			}
		});
});
