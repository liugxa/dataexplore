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

		function sendRequest(_context, _grid, _data){
			request.post(_context.urlContext + "/doGetIncludeFiles.action?rnd=" + (new Date()).getTime(),{
					data: _data,
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

		function initElements(_context, _grid){
			_grid.placeAt('if_includeFiles_grid_container');
			_grid.startup();
		}

		function createDialog(_context, _host, _path){
			var structure = [
				{ id: 'name', field: 'name', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.name']},
				{ id: 'size', field: 'size', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.size'], decorator: sizeDecorator},
				{ id: 'modifyTimeStr', field: 'modifyTimeStr', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.modify.time']},	
				{ id: 'permission', field: 'permission', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.permission']},
				{ id: 'group', field: 'group', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.group']},
				{ id: 'owner', field: 'owner', name: Platform.messages['pac.dataexplore.submitjobs.if.grid.owner'], decorator: ownerDecorator},
			];

			function ownerDecorator(cellData, rowId, rowIndex){
				var s = "-";
				if(cellData != null && cellData != '') s = cellData;
				return s;
			}
			
			function sizeDecorator(cellData, rowId, rowIndex){
				var rowData = grid.row(rowId).rawData();
				var s = "-";
				
				if(cellData != -1) s = rowData.sizeExp;
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

			var url = _context.urlContext + "/toIncludeFiles.action?rnd=" + (new Date()).getTime();
			url = request.appendCsrfTokenToURL(url).value;
			var content = new ContentPane({
				href: url,
				onHide: function(){this.destroyRecursive(false);},
				onDownloadEnd: function () {
					//initialize elements
					initElements(_context, grid);

					//send request to get dat
					var data = {"host": _host, "path": _path};
					sendRequest(_context, grid, data);
				},
				onLoad: function(data){/**console.log("Get the data:" + data);**/}
			});

			var dialog = new Dialog({
				title: Platform.messages['pac.dataexplore.submitjobs.if.title.view'],
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
				this.dialog = createDialog(this.context, this.host, this.path);
				this.dialog.show();
			}
		});
});