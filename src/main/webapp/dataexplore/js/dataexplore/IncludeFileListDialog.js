define([
		"dojo/_base/config", 
		"dojo/_base/declare",
		//Help moudules
		"paccommon/request",
		"dojo/on", 
		"dojo/json", 
		"dojo/dom", 
		//DataStore
		"dojo/store/JsonRest",
		"dojo/store/Observable",
		"dojo/store/Memory",
		"dojo/data/ObjectStore",
		//Gridx module
		"gridx/core/model/cache/Sync",
		"gridx/Grid",
		"gridx/core/model/cache/Async",
		//Form elements
		"dijit/form/Button",
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dijit/layout/ContentPane",
		"dijit/registry",
		"dojo/topic",
		"gridx/allModules"
	],function(cfg, declare, request, on, json, dom, JsonRest , Observable, Memory, ObjectStore, 
		Cache, Grid, Async, Button, Dialog, ConfirmDialog, ContentPane,registry, topic) {
		
		function _doResetGridData(_grid, _data){
			_grid.model.clearCache();
			_grid.model.store.setData(_data);
			_grid.body.refresh();
		}

		function sendRequest(_this, _grid){
			var params = "fileItem.host=" + _this.host + "&fileItem.path=" + _this.path;
			request.post(_this.context.urlContext + "/doGetIncludeFiles.action?rnd=" + (new Date()).getTime(),{
					data: params,
					handleAs: "json",
				}).then(function(data){
					// do something with handled data
					_doResetGridData(_grid, data)
				}, function(err){
					// handle an error condition
					//console.log(err);
				}, function(evt){
					// handle a progress event
					//console.log(evt);
			});
		}

		function initElements(_this, _grid){
			_grid.placeAt('if_includeFiles_grid_container');
			_grid.startup();
		}

		function createDialog(_this){
			var structure = [
				{ id: 'name', field: 'name', name: "Name"},
				{ id: 'size', field: 'size', name: 'Size', decorator: sizeDecorator},
				{ id: 'modifyTime', field: 'modifyTime', name: 'ModifyTime'},	
				{ id: 'permission', field: 'permission', name: 'Permission'},
				{ id: 'group', field: 'group', name: 'Group'},
				{ id: 'owner', field: 'owner', name: 'Owner', decorator: ownerDecorator},
			];

			function ownerDecorator(cellData, rowId, rowIndex){
				var s = "-";
				if(cellData != null && cellData != '') s = cellData;
				return s;
			}
			
			function sizeDecorator(cellData, rowId, rowIndex){
				var s = "-";
				var rowData = grid.row(rowId).rawData();
				if(cellData != -1) s = rowData.size;
				return s;
			}

			var store = new Memory({});
			var grid = new Grid({
				id: 'if_includeFiles_gridX',
				cacheClass: Async,
				store: store,
				structure: structure,
				/*selectRowMultiple: false,*/
				modules:[
					"gridx/modules/Sort",
					"gridx/modules/ColumnResizer",
					"gridx/modules/Pagination",
					"gridx/modules/pagination/PaginationBar"
					/*"gridx/modules/select/Row",*/
					/*"gridx/modules/IndirectSelectColumn",*/
					/*"gridx/modules/TouchVScroller",*/
				]
			});

			var url = _this.context.urlContext + "/toIncludeFiles.action?rnd=" + (new Date()).getTime();
			var content = new ContentPane({
				href: url,
				onHide: function(){this.destroyRecursive(false);},
				onDownloadEnd: function () {
					//initialize elements
					initElements(_this, grid);
					
					//send request to get data					
					sendRequest(_this, grid);
				}
			});

			var dialog = new Dialog({
				title: 'Contained Files',
				style: "width:800px;height:400px",
				content: content,
				closeButtonLabel: "Close",
				onHide: function(){this.destroyRecursive(false);}
			});
			return dialog;
		}

		return declare('dataexplore.IncludeFileListDialog', null, {
			constructor: function (_context, _host, _path) {
				this.context = _context;
				this.host = _host; this.path = _path;
			},
			show: function (){
				this.dialog = createDialog(this);
				this.dialog.show();
			}
		});
});