define([
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		"paccommon/request",
		"dojo/topic",
		"dojo/aspect",
		"dojo/on",
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dojo/date/locale"
	],function(lang, cfg, declare, request, topic, aspect, on, Dialog, ConfirmDialog, local){
	
		function persistData(_context, _host, _path, _splitterExpand, _copyFromHost, _copyFromPath){
			var url = _context.urlContext + "/doSaveDataExploreContext.action?rnd=" + (new Date()).getTime();
			var postData = "dataExploreContext.host=" + _host + 
					"&" + "dataExploreContext.path=" + _path + 
					"&" + "dataExploreContext.splitterExpand=" + _splitterExpand + 
					"&" + "dataExploreContext.copyFromHost="+ _copyFromHost + 
					"&" + "dataExploreContext.copyFromPath="+_copyFromPath;
			request.post(url ,{
					data: postData,
				}).then(function(data){
					//change the context value together
					_context.host = _host; _context.path = _path;
					_context.splitterExpand = _splitterExpand;
					_context.copyFromHost = _copyFromHost; 
					_context.copyFromPath = _copyFromPath;
					console.log(_context);
				}, function(err){
					//console.log(err);
				}, function(evt){
					//console.log(evt);
			});
		}
		
		function persistLocation(_context, _id, _host, _path){
			if(_id == "dataExplore"){
				persistData(_context, _host, _path, _context.splitterExpand, _context.copyFromHost, _context.copyFromPath);
			}else{
				persistData(_context, _context.host, _context.path, _context.splitterExpand, _host, _path);
			}
		}
		
		function persistSplitterExpand(_context, _splitterExpand){
			persistData(_context, _context.host, _context.path, _splitterExpand, _context.copyFromHost, _context.copyFromPath);
		}
				
		function showMessage(_message){
			var dialog = new Dialog({
				title: "Message",
				style: "width:300px;height:100px",
				content: _message,
				onHide: function(){this.destroyRecursive(false);}
			});
			dialog.show();
		}

		function checkPermission(_context, _host, _path, _function){
			var postData = "hostName=" + _host + "&filePath=" + _path;
			var url = _context.contextPath + "/webservice/pac/data/checkPermission/file?rnd=" + (new Date()).getTime();
			request.post(url,{
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
		
		return declare('dataexplore.EventProxy', null, {
			constructor: function (_context, _panels){
				this.context = _context;
				this.panels = _panels;
				this.events = [];
			},
			startup: function(){
				if(this.panels.dataExplorePanel) this.registDataExploreEvents(this.context, this.panels, this.events);
				if(this.panels.searchPanel) this.registSearchEvents(this.context, this.panels, this.events);
				if(this.panels.breadCrumbPanel) this.registBreadCrumbEvents(this.context, this.panels, this.events);
				if(this.panels.dataActionsPanel) this.registDataActionsEvents(this.context, this.panels, this.events);
				
				if(this.panels.hostTreePanel) this.registHostTreeEvents(this.context, this.panels, this.events);
				if(this.panels.favoriteTreePanel) this.registFavoriteTreeEvents(this.context, this.panels, this.events);
				
				if(this.panels.fileTablePanel) this.registFiletableEvents(this.context, this.panels, this.events);
				if(this.panels.submissionsPanel) {
					this.registSubmissionsEvents(this.context, this.panels, this.events);
					this.registInputFileListEvents(this.context, this.panels, this.events);
				}
			},
			destroy: function(){
				for(var i=0;i<this.events.length;i++){
					this.events[i].remove();
				}
			},
			registDataExploreEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.dataExplorePanel.getEventPrefix();
				var splitterExpandEvent = topic.subscribe(eventPrefix + "@event.splitter.expand", function(id, splitterExpand){
					persistSplitterExpand(_context, splitterExpand);
				});	
				splitterExpandEvent.name = "dataexplore.splitter.expand";
				_events.push(splitterExpandEvent);				
			},
			registSearchEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.searchPanel.getEventPrefix();
				var searchChangeEvent = topic.subscribe(eventPrefix + "@event.search", function(id, host, path, fileName){
					if(_panels.fileTablePanel){
						var filters = {"fileName": fileName};
						_panels.fileTablePanel.refresh(host, path, filters);
					}
				});	
				searchChangeEvent.name = "breadcrumb.search.change";
				_events.push(searchChangeEvent);
			},
			registBreadCrumbEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.breadCrumbPanel.getEventPrefix();
				
				//resolve the bread crumb events
				var itemClickEvent = topic.subscribe(eventPrefix + "@event.item.click", function(id, host, path){
					_panels.breadCrumbPanel.refresh(host, path);
					if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(host, path);
					//persist the location
					persistLocation(_context, id, host, path);
				});
				itemClickEvent.name = "breadcrumb.item.click";
				_events.push(itemClickEvent);
				
				var upClickEvent = topic.subscribe(eventPrefix + "@event.up.click", function(id, host, path){
					_panels.breadCrumbPanel.refresh(host, path);
					if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(host, path);
					
					//persist the location
					persistLocation(_context, id, host, path);
				});
				upClickEvent.name = "breadcrumb.up.click";
				_events.push(upClickEvent);
				
				var inputChangeEvent = topic.subscribe(eventPrefix + "@event.input.change", function(id, host, path){
					checkPermission(_context, host, path, function(){
						_panels.breadCrumbPanel.refresh(host, path);
						if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(host, path);
						//persist the location
						persistLocation(_context, id, host, path);
					});
				});
				inputChangeEvent.name = "breadcrumb.input.change";
				_events.push(inputChangeEvent);
			},
			registHostTreeEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.hostTreePanel.getEventPrefix();
				var itemClickEvent = topic.subscribe(eventPrefix + "@event.item.click", function(id, item){
					if(item != "hosts"){
						var host = item.substring(0, item.indexOf(':'));
						var path = item.substring(item.indexOf(':') + 1);

						checkPermission(_context, host, path, function(){
							//refrsh file table
							if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(host, path);
							
							//refresh bread crumb
							if(_panels.breadCrumbPanel) _panels.breadCrumbPanel.refresh(host, path);
							
							//persist the location
							persistLocation(_context, id, host, path);
						});
					}
					if(_panels.favoriteTreePanel) _panels.favoriteTreePanel.blur();
				});
				itemClickEvent.name = "hosttree.item.click";
				_events.push(itemClickEvent);
			},
			registFavoriteTreeEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.favoriteTreePanel.getEventPrefix();
				var itemClickEvent = topic.subscribe(eventPrefix + "@event.item.click", function(id, item){
					if(item != "favorites"){
						var host = item.substring(0, item.indexOf(":"));
						var path = item.substring(item.indexOf(":") + 1);
						
						checkPermission(_context, host, path, function(){
							//refrsh file table
							if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(host, path);

							//refresh bread crumb
							if(_panels.breadCrumbPanel) _panels.breadCrumbPanel.refresh(host, path);
							
							//persist the location
							persistLocation(_context, id, host, path);
						});
					}
					if(_panels.hostTreePanel) _panels.hostTreePanel.blur();
				});
				itemClickEvent.name = "favorite.item.click";
				_events.push(itemClickEvent);
			},
			registFiletableEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.fileTablePanel.getEventPrefix();
				
				//the file table panel events
				var itemClickEvent = topic.subscribe(eventPrefix + "@event.item.click", function(id, file){
					checkPermission(_context, file.host, file.absolutePath, function(){
						//only for the folder
						if(file.type == "d"){
							//refrsh file table
							if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(file.host, file.absolutePath);

							//refresh bread crumb
							if(_panels.breadCrumbPanel) _panels.breadCrumbPanel.refresh(file.host, file.absolutePath);
							
							//persist the location
							persistLocation(_context, id, file.host, file.absolutePath);
						}else{
							window.download(_context, file);
						}
					});
				});
				itemClickEvent.name = "filetable.item.click";
				_events.push(itemClickEvent);
				
				var itemMarkEvent = topic.subscribe(eventPrefix + "@event.item.mark.file", function(id, file){
					//add the file to the panel of input file list
					if(_panels.submissionsPanel){
						_panels.submissionsPanel.inputFileListPanel.add(file);
						
						//refresh the summary panel
						var inputFiles = _panels.submissionsPanel.inputFileListPanel.getFiles();
						_panels.summaryPanel.refresh(inputFiles.length);
					}
				});
				itemMarkEvent.name = "filetable.item.mark.file";
				_events.push(itemMarkEvent);

				var itemMarkFavoriteEvent = topic.subscribe(eventPrefix + "@event.item.mark.favorite", function(id, file){
					if(_panels.favoriteTreePanel){
						var item = (file.host + ":" + file.absolutePath);
						_panels.favoriteTreePanel.add(item);
						_panels.favoriteTreePanel.reload();
					}
					
					//refrsh file table
					_panels.fileTablePanel.refresh(file.host, file.path);
				});
				itemMarkFavoriteEvent.name = "filetable.item.mark.favorite";
				_events.push(itemMarkFavoriteEvent);
				
				var itemUnMarkFavoriteEvent = topic.subscribe(eventPrefix + "@event.item.unmark.favorite", function(id, file){
					if(_panels.favoriteTreePanel){
						var item = (file.host + ":" + file.absolutePath);
						_panels.favoriteTreePanel.remove(item);
						_panels.favoriteTreePanel.reload();
					}
					
					//refrsh file table
					_panels.fileTablePanel.refresh(file.host, file.path);
				});
				itemUnMarkFavoriteEvent.name = "filetable.item.unmark.favorite";
				_events.push(itemUnMarkFavoriteEvent);
			},
			registSubmissionsEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.submissionsPanel.getEventPrefix();
				var viewOutputEvent = topic.subscribe(eventPrefix + "@event.view.output", function(id, data){
					var host = data.substring(0, data.indexOf(':'));
					var path = data.substring(data.indexOf(':') + 1);

					//refrsh file table
					if(_panels.fileTablePanel) _panels.fileTablePanel.refresh(host, path);

					//refresh bread crumb
					if(_panels.breadCrumbPanel) _panels.breadCrumbPanel.refresh(host, path);
				});
				viewOutputEvent.name = "submissions.view.output";
				_events.push(viewOutputEvent);
			},
			registInputFileListEvents: function(_context, _panels, _events){
				var eventPrefix = _panels.submissionsPanel.inputFileListPanel;
				var removeSuccessEvent = topic.subscribe(eventPrefix + "@event.inputfiles.remove.success", function(id, file){
					if(_panels.fileTablePanel){
						var cHost = _panels.fileTablePanel.getHost();
						var cPath = _panels.fileTablePanel.getPath();

						//check the file table is still in the current location
						if((cHost == file.host) && (cPath == file.path)) _panels.fileTablePanel.refresh(cHost, cPath);
					}
					
					if(_panels.submissionsPanel){
						var inputFiles = _panels.submissionsPanel.inputFileListPanel.getFiles();
						_panels.submissionsPanel.formTablePanel.refresh(inputFiles);
					}					
				});
				removeSuccessEvent.name = "inputfiles.remove.success";
				_events.push(removeSuccessEvent);

				var addSuccessEvent = topic.subscribe(eventPrefix + "@event.inputfiles.add.success", function(id, file){
					if(_panels.fileTablePanel){
						var cHost = _panels.fileTablePanel.getHost();
						var cPath = _panels.fileTablePanel.getPath();

						//refresh file table
						if((cHost == file.host) && (cPath == file.path)) _panels.fileTablePanel.refresh(cHost, cPath);
					}
					
					if(_panels.submissionsPanel){
						var inputFiles = _panels.submissionsPanel.inputFileListPanel.getFiles();
						_panels.submissionsPanel.formTablePanel.refresh(inputFiles);
					}
				});
				addSuccessEvent.name = "inputfiles.add.success";
				_events.push(addSuccessEvent);
				
				var loadSuccessEvent = topic.subscribe(eventPrefix + "@event.inputfiles.load.success", function(id, _files){
					if(_panels.submissionsPanel){
						var inputFiles = _panels.submissionsPanel.inputFileListPanel.getFiles();
						_panels.submissionsPanel.formTablePanel.refresh(inputFiles);
					}
				});
				loadSuccessEvent.name = "inputfiles.load.success";
				_events.push(loadSuccessEvent);
				
				var reloadSuccessEvent = topic.subscribe(eventPrefix + "@event.inputfiles.reload.success", function(id, _file){
					if(_panels.submissionsPanel){
						var inputFiles = _panels.submissionsPanel.inputFileListPanel.getFiles();
						_panels.submissionsPanel.formTablePanel.refresh(inputFiles);
					}
				});				
				reloadSuccessEvent.name = "inputfiles.reload.success";
				_events.push(loadSuccessEvent);
			},
			registDataActionsEvents: function(_context, _panels, _events){

			}
		});
	});