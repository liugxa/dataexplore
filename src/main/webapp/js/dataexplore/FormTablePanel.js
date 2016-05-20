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
		"gridx/core/model/cache/Async",
		"gridx/modules/IndirectSelect",
		"gridx/modules/select/Row",
		"gridx/modules/RowHeader",
		"gridx/modules/VirtualVScroller",
		"gridx/modules/Sort",
		"gridx/modules/SingleSort",
		"gridx/modules/ColumnResizer",
		/*"gridx/modules/Pagination",*/
		/*"gridx/modules/pagination/PaginationBar",*/
		"gridx/modules/CellWidget",
		"gridx/modules/Focus",
		//Form elements
		"dijit/form/Button",
		"dijit/registry",
		"dojo/topic",
		"dojo/on",
		"dojo/domReady!"
	], function(lang, cfg, declare, request, on, json, dom, domClass, domAttr, JsonRest , Observable, Memory, ObjectStore, 
		Cache, Grid, Async, IndirectSelect, Row, RowHeader, VirtualVScroller,Sort, SingleSort, ColumnResizer,CellWidget,Focus, Button, registry, topic, on) {
		
		function _transferData(_files){
			var r = {};
			if(_files != undefined){
				for(var i=0;i<_files.length;i++){
					var host = "inputFiles[" + i + "].host";
					var path = "inputFiles[" + i + "].path";

					var name = "inputFiles[" + i + "].name";
					var type = "inputFiles[" + i + "].type";

					r[host] = _files[i].host;
					r[path] = _files[i].path;
					r[name] = _files[i].name;
					r[type] = _files[i].type;
				}
			}
			return r;
		}

		function _refresh(_context, _grid, _files){
			//console.log(_files);
			var _data = _transferData(_files);
			//send request
			request.post(_context.urlContext + "/doGetSubmissionForms.action?rnd=" + (new Date()).getTime(),{
					data: _data,
					handleAs: "json",
				}).then(function(data){
					// do something with handled data
					//console.log(json.stringify(data));
					_refreshStroe(_grid, data);
				}, function(err){
					// handle an error condition
					console.log(err);
				}, function(evt){
					// handle a progress event
					//console.log(evt);
			});
		}

		function _refreshStroe(_grid, _store){
			_grid.model.clearCache();
			_grid.model.store.setData(_store);
			_grid.body.refresh();
		}

		function createGrid(_container, _context, _id, _inputFiles){
			var store = new Memory({});

			var structure = [
				{ id: 'index', field: 'id', name: '', width: '12px',decorator: indexDecorator,widgetsInCell: true, setCellValue: indexColorCellValue},
				{ id: 'name', field: 'name', name: Platform.messages['pac.dataexplore.submitjobs.sp.grid.column.formname'], width: '300px', widgetsInCell: true, decorator: nameDecorator, setCellValue: nameCellValue},
				{ id: 'appName', field: 'appName', name: Platform.messages['pac.dataexplore.submitjobs.sp.grid.column.application']},
				{ id: 'owner', field: 'owner', name: Platform.messages['pac.dataexplore.submitjobs.sp.grid.column.owner'], decorator: ownerDecorator},
			];

			//Create grid widget.
			var grid = new Grid({
				id: (_container + '_gridX'),
				cacheClass: Async,
				store: store,
				structure: structure,
				selectRowTriggerOnCell: true,
				modules: [
					/*"gridx/modules/IndirectSelect",*/
					/*"gridx/modules/select/Row",*/
					/*"gridx/modules/RowHeader",*/
					"gridx/modules/VirtualVScroller",
					"gridx/modules/Sort",
					"gridx/modules/ColumnResizer",
					/*"gridx/modules/Pagination",*/
					/*"gridx/modules/pagination/PaginationBar",*/
					"gridx/modules/CellWidget",
					"gridx/modules/Focus",
				]
			});

			function ownerDecorator(cellData, rowId, rowIndex){
				var s = "-";
				if(cellData != null && cellData != '') s = cellData;
				return s;
			}

			function descDecorator(cellData, rowId, rowIndex){
				var s = "-";
				if(cellData != null && cellData != '') s = cellData;
				return s;
			}

			function indexDecorator(cellData, rowId, rowIndex){ 
				return "<span data-dojo-attach-point='colorRow'  class='sp_relevance_icon'></span>";
			}

			function nameDecorator(cellData, rowId, rowIndex){
				//Generate cell widget template string
				return [
					'<table width="100%">',
						'<tr>',
							'<td>',
								'<button style="text-align: left;" data-dojo-type="dijit.form.Button"',
									'data-dojo-attach-point="openBtn" ',
									"data-dojo-props=\"baseClass:'sp_submissionForms_openBtn'\"",
								'></button>',
							'</td>',
							'<td style="width:60px" aligh="right">',
								'<button style="width:16px;height:22px" data-dojo-type="dijit.form.Button"',
									'data-dojo-attach-point="btn" ',
								'></button>',
							'</td>',
						'</tr>',
					'</table>'
				].join('');
			}

			function indexColorCellValue(gridData, storeData, widget){
				var rowData = widget.cell.row.rawData();
				var weight = rowData.weight;
				
				var rgbValue = "rgb(235,235,235)";
				if(weight >= 0.8){
					rgbValue = "rgb(0,109,44)";
				}else if(weight >= 0.6){
					rgbValue = "rgb(49,163,84)";
				}else if(weight >= 0.4){
					rgbValue = "rgb(116,196,118)";
				}else if(weight >= 0.2){
					rgbValue = "rgb(186,228,179)";
				}
				this.colorRow.style.backgroundColor=rgbValue;
			}

			function nameCellValue(gridData, storeData, widget){
				var rowData = widget.cell.row.rawData();
				
				//click the form name, to show the submission page
				this.openBtn.set("label", gridData);
				this.openBtn.set("onClick", function(){
					//clear the message section
					window.toSubmissionForm(rowData.type, rowData.appName, rowData.name, rowData.owner, inputFiles);
					topic.publish(grid.id + "@event.item.click", _id, rowData);
				});
				
				//click the submit button, to submit application directly
				this.btn.set("style", "display:none");
				this.btn.set("label", Platform.messages['pac.dataexplore.submitjobs.sp.button.submit']);
				this.btn.set("onClick", function(){
					//clear the message section
					window.doSubmitJob(rowData.type, rowData.appName, rowData.name, rowData.owner, inputFiles);
					topic.publish(grid.id + "@event.item.mark.submit", _id, rowData);
				});
			}

			grid.connect(grid, "onRowMouseOver", function(evt){
				var row = grid.row(evt.rowId);
				if(row != null){
					var widget = grid.row(evt.rowId).cell("name").widget();
					widget.btn.set("style", "display:block");
				}
			});

			grid.connect(grid, "onRowMouseOut", function(evt){
				var row = grid.row(evt.rowId);
				if(row != null){
					var widget = grid.row(evt.rowId).cell("name").widget();
					widget.btn.set("style", "display:none");
				}
			});

			//send request
			var inputFiles = [];
			if(_inputFiles != undefined) inputFiles = _inputFiles;
			
			_refresh(_context, grid, inputFiles);
			return grid;
		}

		return declare('dataexplore.FormTablePanel', null, {
			constructor: function (_container, _context, _id) {
				this.container = (_container != null) ? _container : "sp_formTable_container";
				this.context = _context; this.id = _id;
			},
			startup: function(_inputFiles) {
				this.grid = createGrid(this.container, this.context, this.id, _inputFiles);
				this.grid.placeAt(this.container);
				this.grid.startup();
				this.show();
			},
			isShow: function(){
				var r = false;
				var style = this.grid.domNode.style.display;
				if(style == "" || style == "block") r = true;
				return r;
			},
			show: function(){
				this.grid.domNode.style.display = "block";
				dom.byId(this.container).style.display = "block";
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
			refresh: function(_files){
				_refresh(this.context, this.grid, _files);
			},
		});
});
