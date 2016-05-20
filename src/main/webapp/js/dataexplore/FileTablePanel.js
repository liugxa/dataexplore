define([
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
		"gridx/core/model/cache/Async",
		"gridx/modules/IndirectSelect",
		"gridx/modules/extendedSelect/Row",
		"gridx/modules/RowHeader",
		"gridx/modules/VirtualVScroller",
		"gridx/modules/Sort",
		"gridx/modules/ColumnResizer",
		"gridx/modules/HiddenColumns",
		/*"gridx/modules/Pagination",*/
		/*"gridx/modules/pagination/PaginationBar",*/
		"gridx/modules/CellWidget",
		"gridx/modules/Focus",
		//Form elements
		"dijit/form/Button",
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dijit/layout/ContentPane",
		"dijit/registry",
		"dojo/topic",
		"dojo/domReady!"
	],function(cfg, declare, request, on, json, dom, domClass, domAttr,JsonRest , Observable, Memory, ObjectStore, 
		Cache, Grid, Async, IndirectSelect, Row, RowHeader, VirtualVScroller,Sort,ColumnResizer,HiddenColumns,CellWidget,Focus,
		Button, Dialog, ConfirmDialog, ContentPane,registry, topic) {
		
		function _getTarget(_context, _host, _path, _filters){
			var params = "host=" + _host + "&path=" + _path;
			if(_filters != undefined && _filters != "") params = "host=" + _host + "&path=" + _path + "&fileName=" + _filters.fileName;
			var target = request.appendCsrfTokenToURL(_context.urlContext + "/doGetIncludeFiles.action?rnd=" + (new Date()).getTime() + "&" + params).value;
			return target;
		}

		function _refresh(_context, _grid, _host, _path, _filters){
			var target = _getTarget(_context, _host, _path, _filters);
			var store = new JsonRest({
				target: target,
				sortParam: "sortBy",
			});
			
			if (null != _filters && "" != _filters && "" != _filters.fileName) {
				_grid.hiddenColumns.add("type");
				_grid.hiddenColumns.remove("path");
			} else {
				_grid.hiddenColumns.add("path");
				_grid.hiddenColumns.remove("type");
			}
			_grid.model.clearCache();
			_grid.setStore(store);
			_grid.body.refresh();
		}

		function createGrid(_container, _context, _id, _host, _path, _filters, _decorateName){
			var target = _getTarget(_context, _host, _path, _filters);
			var store = new JsonRest({
				target: target,
				sortParam: "sortBy",
			});
			
			var structure = [
				{ id: 'name', field: 'name', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.name'], width: '250px', widgetsInCell: true, decorator: nameDecorator, setCellValue: nameCellValue},
				{ id: 'type', field: 'type', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.type'], width: '80px', decorator: typeDecorator},
				{ id: 'path', field: 'path', name: 'Location', width: '120px'},
				{ id: 'size', field: 'size', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.size'], width: '80px', decorator: sizeDecorator},
				{ id: 'owner', field: 'owner', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.owner'], width: '80px', decorator: ownerDecorator},
				{ id: 'permission', field: 'permission', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.permission'], width: '80px'},
				{ id: 'modifyTimeStr', field: 'modifyTimeStr', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.modify.time'], width: '140px'},	
			];

			var grid = new Grid({
				id: (_container + '_gridX'),
				cacheClass: Async,
				store: store,
				structure: structure,
				/*selectRowMultiple: false,*/
				modules:[
					"gridx/modules/IndirectSelect",
					"gridx/modules/extendedSelect/Row",
					"gridx/modules/RowHeader",
					"gridx/modules/VirtualVScroller",
					"gridx/modules/Sort",
					"gridx/modules/ColumnResizer",
					"gridx/modules/HiddenColumns",
					/*"gridx/modules/Pagination",*/
					/*"gridx/modules/pagination/PaginationBar",*/
					"gridx/modules/CellWidget",
					"gridx/modules/Focus",
				]
			});
			
			function nameDecorator(cellData, rowId, rowIndex){
				//Generate cell widget template string
				return [
					'<table width="100%">',
						'<tr>',
							'<td>',
								'<button  style="text-align: left;" data-dojo-type="dijit.form.Button"',
									'data-dojo-attach-point="openBtn" ',
									"data-dojo-props=\"baseClass:'sp_submissionForms_openBtn'\"",
								'></button>',
							'</td>',
							'<td style="width:30px">',
								'<button data-dojo-type="dijit.form.Button"',
									'data-dojo-attach-point="addBtn" ',
								'></button>',
							'</td>',
							'<td style="width:5px" aligh="right">',
								'<button style="width:16px;height:22px" data-dojo-type="dijit.form.Button"',
									'data-dojo-attach-point="favBtn" ',
									"data-dojo-props=\"baseClass:''\"",
								'></button>',
							'</td>',
						'</tr>',
					'</table>'
				].join('');
			}

			function nameCellValue(gridData, storeData, widget){
				var rowData = widget.cell.row.rawData();
				
				var iconClass = "fileIcon";
				if(rowData.type == "d" || rowData.type == "l") iconClass = "folderIcon";

				//if the name's length > 20 characters, showing the truncated value
				var label = gridData;
				if(gridData.length > 20){
					label = gridData.substring(0, 20) + " ... ";
				}

				//click the name
				this.openBtn.set("label", label);
				this.openBtn.set("title", gridData);
				this.openBtn.set("iconClass", iconClass);
				this.openBtn.set("onClick", function(){
					//take the file table to the new path
					//console.log("rowData.absolutePath=" + rowData.absolutePath);
					topic.publish(grid.id + "@event.item.click", _id, rowData);
				});

				//mark as input file
				this.addBtn.set("label", Platform.messages["pac.dataexplore.submitjobs.if.button.add"]);
				this.addBtn.set("class", "inputFileHollowIcon");
				this.addBtn.set("style", "display:none");
				this.addBtn.set("onClick", function(){
					//add the file to the submission panel
					//var file = {name: rowData.name, host: rowData.host, type: rowData.type, path: rowData.path};
					var btnClass = widget.addBtn.get("class");
					if(btnClass != "inputFileSolidIcon"){
						widget.addBtn.set("class", "inputFileSolidIcon");
						widget.addBtn.set("label", Platform.messages["pac.dataexplore.submitjobs.if.button.input"]);
						topic.publish(grid.id + "@event.item.mark.file", _id, rowData);
					}
					/* in this release, the "Job Input" button is un-clickable.
					else{
						widget.addBtn.set("class", "inputFileHollowIcon");
						widget.addBtn.set("label", "Add to job");
						topic.publish(grid.id + "@event.item.unmark.file", _id, rowData);
					}
					*/
				});

				//if the file has been marked, show it
				if(rowData.inputFile == true){
					widget.addBtn.set("class", "inputFileSolidIcon");
					widget.addBtn.set("label", Platform.messages["pac.dataexplore.submitjobs.if.button.input"]);
					widget.addBtn.set("style", "display:block");
				}

				//mark as favorite
				this.favBtn.set("iconClass", "");
				//in this release, the favorite is only for the "folder"
				if(rowData.type != "f"){
					this.favBtn.set("onClick", function(){
						//add the file to the submission panel
						//var file = {name: rowData.name, host: rowData.host, type: rowData.type, path: rowData.path};
						var iconClass = widget.favBtn.get("iconClass");
						if(iconClass != "favoriteSolidIcon"){
							widget.favBtn.set("iconClass", "favoriteSolidIcon");
							topic.publish(grid.id + "@event.item.mark.favorite", _id, rowData);
						}else{
							widget.favBtn.set("iconClass", "favoriteHollowIcon");
							topic.publish(grid.id + "@event.item.unmark.favorite", _id, rowData);
						}
					});

					//if the has been marked as favorite, show it
					if(rowData.favorite == true){
						widget.favBtn.set("iconClass", "favoriteSolidIcon");
					}
				}
			}
			
			function typeDecorator(cellData, rowId, rowIndex){
				var s = Platform.messages["pac.dataexplore.submitjobs.if.grid.type.file"];
				if(cellData != null && cellData != 'f') s = Platform.messages["pac.dataexplore.submitjobs.if.grid.type.directory"];
				return s;
			}

			function sizeDecorator(cellData, rowId, rowIndex){
				var rowData = grid.row(rowId).rawData();
				var s = "-";
				
				if(cellData != -1) s = rowData.sizeExp;
				return s;
			}

			function ownerDecorator(cellData, rowId, rowIndex){
				var s = "-";
				if(cellData != null && cellData != '') s = cellData;
				return s;
			}

			if(_decorateName == true){
				grid.connect(grid, "onRowMouseOver", function(evt){
					var row = grid.row(evt.rowId);
					if(row != null){
						var widget = grid.row(evt.rowId).cell("name").widget();

						//if the input file had been marked, don't close the rowAction
						var btnClass = widget.addBtn.get("class");
						if(btnClass != "inputFileSolidIcon"){
							widget.addBtn.set("style", "display:block");
						}
						
						//in this release, the favorite is only for the "folder"
						if(row.rawData().type != "f"){
							//if the favorite had been marked, don't close the favAction
							var iconClass = widget.favBtn.get("iconClass");
							if(iconClass != "favoriteSolidIcon"){
								widget.favBtn.set("iconClass", "favoriteHollowIcon");
							}
						}
					}
				});

				grid.connect(grid, "onRowMouseOut", function(evt){
					var row = grid.row(evt.rowId);
					if(row != null){
						var widget = grid.row(evt.rowId).cell("name").widget();
						
						//if the input file had been marked, don't close the rowAction
						var btnClass = widget.addBtn.get("class");
						if(btnClass != "inputFileSolidIcon"){
							widget.addBtn.set("style", "display:none");
						}

						//if the favorite had been marked, don't close the favAction
						var iconClass = widget.favBtn.get("iconClass");
						if(iconClass != "favoriteSolidIcon"){
							widget.favBtn.set("iconClass", "");
						}
					}
				});
			}
			grid.connect(grid.select.row, "onSelectionChange", function(newSelects, oldSelects){
				topic.publish(grid.id + "@event.row.selected", _id, newSelects);
			});
			/*
			grid.connect(grid.select.row, "onDeselected", function(row, rowId){
				topic.publish(grid.id + "@event.row.selected", _id, rowId);
			});
			*/
			grid.hiddenColumns.add("path");
			return grid;
		}


		return declare('dataexplore.FileTablePanel', null, {
			constructor: function(_container, _context, _id, _host, _path, _filters, _decorateName){
				this.container = (_container != null) ? _container : "fb_fileTable_container";
				this.context = _context; this.id = _id;
				this.host = _host; this.path = _path; this.filters = _filters;

				//by default, there don't needs decorate the name column
				this.decorateName = (_decorateName != undefined) ? _decorateName : false;
			},
			startup: function(){
				this.grid = createGrid(this.container, this.context, this.id, this.host, this.path, this.filters, this.decorateName);
				this.grid.placeAt(this.container);
				this.grid.startup();
			},
			isShow: function(){
				var r = false;
				var style = this.grid.domNode.style.display;
				if(style == "" || style == "block") r = true;
				return r;
			},
			show: function(){
				dom.byId(this.container).style.display = "block";
				this.grid.domNode.style.display = "block";
			},
			hidden: function(){
				this.grid.domNode.style.display = "none";
				dom.byId(this.container).style.display = "none";
			},
			destroy: function(){
				this.grid.destroy();
			},
			getEventPrefix: function(){
				return (this.container + "_gridX");
			},
			getSelected: function(){
				return this.grid.select.row.getSelected();
			},
			getRowData: function(_rowId){
				return this.grid.row(_rowId).rawData();
			},
			reload: function(){
				this.destroy();
				this.startup();
			},
			refresh: function(_host, _path, _filters){
				this.host = _host; this.path = _path; this.filters = _filters;
				_refresh(this.context, this.grid, _host, _path, _filters);
			},
			getHost: function(){
				return this.host;
			},
			getPath: function(){
				return this.path;
			},
			getFilters: function(){
				return this.filters;
			}
		});
	});