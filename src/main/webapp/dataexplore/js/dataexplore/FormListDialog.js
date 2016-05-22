define([
		"dojo/_base/config", 
		"dojo/_base/declare",
		//Help moudules
		"paccommon/request",
		"dojo/on",
		"dojo/keys",
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
	],function(cfg, declare, request, on, keys, json, dom, JsonRest , Observable, Memory, ObjectStore, 
		Cache, Grid, Async, Button, Dialog, ConfirmDialog, ContentPane,registry, topic) {
		
		function _doResetGridData(_grid, _data){
			_grid.model.clearCache();
			_grid.model.store.setData(_data);
			_grid.body.refresh();
		}

		// Using xhr.get, as no information is being sent -- only requesting
		function doSearch(_context, _grid, _searchStr) {
			request.post(_context.urlContext + "/doSearch.action?rnd=" + (new Date()).getTime(),{
				data: "appName=" + _searchStr,
				handleAs: "json",
			}).then(function(data){
				// do something with handled data
				//alert(json.stringify(data));
				_doResetGridData(_grid , data)
			}, function(err){
				// handle an error condition
				_doResetGridData(_grid, {});
			}, function(evt){
				// handle a progress event
				//alert("evt:" + evt);
			});
		};

		function sendRequest(_context, _grid){
			request.get(_context.urlContext + "/doGetAllForms.action?rnd=" + (new Date()).getTime(),{
					handleAs: "json",
				}).then(function(data){
					// do something with handled data
					_doResetGridData(_grid, data)
				}, function(err){
					// handle an error condition
					_doResetGridData(_grid, {})
				}, function(evt){
					// handle a progress event
			});
		}

		function initElements(_context, _grid){
			// Create a button programmatically:
			var searchBtn = new Button({
				onClick: function(){
					// Do something:
					var searchInput = dom.byId("fd_formList_search_input");
					var searchValue = searchInput.value;
					doSearch(_context, _grid, searchValue);
				}
			}, "fd_formList_search_btn");

			var okBtn = new Button({
				onClick: function(){
					var selectId = _grid.select.row.getSelected();
					var row = _grid.row(selectId, true);

					var rowData = row.rawData();
					//console.log(rowData);
					window.toSubmissionForm(rowData.type, rowData.appName, rowData.name, rowData.owner, []);
				}
			}, "fd_formList_ok_btn");

			var cancelBtn = new Button({
				onClick: function(){
					registry.byId("fd_formList_confirmDialog").destroyRecursive(false);
				}
			}, "fd_formList_cancel_btn");

			on(dom.byId("fd_formList_search_input"),'keypress',function(evt){
				if(evt.keyCode == 13){
					doSearch(_context, _grid, this.value);
				}
			});

			_grid.placeAt('fd_formList_grid_container');
			_grid.startup();
		}

		function createDialog(_context){
			var structure = [
				{ id: 'name', field: 'name', name: Platform.messages['pac.dataexplore.submitjobs.sf.grid.column.form.name']},
				{ id: 'appName', field: 'appName', name: Platform.messages['pac.dataexplore.submitjobs.sf.grid.column.application']},
				{ id: 'owner', field: 'owner', name: Platform.messages['pac.dataexplore.submitjobs.sf.grid.column.owner'], decorator: ownerDecorator},
			];

			function ownerDecorator(cellData, rowId, rowIndex){
				var s = "-";
				if(cellData != null && cellData != '') s = cellData;
				return s;
			}

			var store = new Memory({});
			var grid = new Grid({
				id: 'fd_formList_gridX',
				cacheClass: Async,
				store: store,
				structure: structure,
				selectRowMultiple: false,
				modules:[
					"gridx/modules/Sort",
					"gridx/modules/ColumnResizer",
					"gridx/modules/select/Row",
					"gridx/modules/IndirectSelectColumn",
					"gridx/modules/TouchVScroller",
				]
			});

			var url = _context.urlContext + "/toViewAllForms.action?rnd=" + (new Date()).getTime();
			url = request.appendCsrfTokenToURL(url).value;
			var content = new ContentPane({
				href: url,
				onHide: function(){this.destroyRecursive(false);},
				onDownloadEnd: function () {
					//initialize elements
					initElements(_context, grid);

					//send request to get dat
					sendRequest(_context, grid);
				},
				onLoad: function(data){/**console.log("Get the data:" + data);**/}
			});

			var dialog = new Dialog({
				id: "fd_formList_confirmDialog",
				title: Platform.messages['pac.dataexplore.submitjobs.sf.title.view'],
				style: "width:800px;height:400px",
				content: content,
				onHide: function(){this.destroyRecursive(false);}
			});
			return dialog;
		}

		return declare('dataexplore.FormListDialog', null, {
			constructor: function (_context) {
				this.context = _context;
			},
			show: function (){
				this.dialog = createDialog(this.context);
				this.dialog.show();
			}
		});
	});