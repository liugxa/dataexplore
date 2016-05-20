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
		"gridx/modules/IndirectSelect",
		"gridx/modules/select/Row",
		"gridx/modules/RowHeader",
		"gridx/modules/VirtualVScroller",
		"gridx/modules/Sort",
		"gridx/modules/ColumnResizer",
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
		"gridx/allModules"
	],function(cfg, declare, request, on, keys, json, dom, JsonRest , Observable, Memory, ObjectStore, 
		Cache, Grid, Async, IndirectSelect, Row, RowHeader, VirtualVScroller,Sort,ColumnResizer,CellWidget,Focus,
		Button, Dialog, ConfirmDialog, ContentPane,registry, topic) {
		
		/*
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
		*/

		function _getTarget(_context, _appName){
			var params = "appName=" + "";
			if(_appName != undefined && _appName != "") params = "appName=" + _appName;

			var target = request.appendCsrfTokenToURL(_context.urlContext + "/doGetAllForms.action?rnd=" + (new Date()).getTime() + "&" + params).value;
			return target;
		}
		
		function _refresh(_context, _grid, _appName){
			var target = _getTarget(_context, _appName);
			var store = new JsonRest({
				target: target,
				sortParam: "sortBy",
			});
			_grid.model.clearCache();
			_grid.setStore(store);
			_grid.body.refresh();
		}

		function createGrid(_context){
			var target = _getTarget(_context, "");
			var store = new JsonRest({
				target: target,
				sortParam: "sortBy",
			});
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

			var grid = new Grid({
				id: 'fd_formList_gridX',
				cacheClass: Async,
				store: store,
				structure: structure,
				selectRowMultiple: false,
				modules:[
					"gridx/modules/IndirectSelect",
					"gridx/modules/select/Row",
					"gridx/modules/RowHeader",
					"gridx/modules/VirtualVScroller",
					"gridx/modules/Sort",
					"gridx/modules/ColumnResizer",
					/*"gridx/modules/Pagination",*/
					/*"gridx/modules/pagination/PaginationBar",*/
					"gridx/modules/CellWidget",
					"gridx/modules/Focus",
				]
			});

			on(dom.byId("fd_formList_search_input"),'keypress',function(evt){
				if(evt.keyCode == 13) _refresh(_context, grid, this.value);
			});

			on(dom.byId("fd_formList_search_btn"), "click", function(){
				var searchInput = dom.byId("fd_formList_search_input");
				var searchValue = searchInput.value;
				_refresh(_context, grid, searchValue);
			})

			on(registry.byId("fd_formList_ok_btn"), "click", function(){
				var selectId = grid.select.row.getSelected();
				var row = grid.row(selectId, true);

				var rowData = row.rawData();
				//console.log(rowData);
				window.toSubmissionForm(rowData.type, rowData.appName, rowData.name, rowData.owner, []);
			});

			on(registry.byId("fd_formList_dialog"), "hide", function(){
				grid.destroy();
			});

			return grid;
		}

		return declare('dataexplore.FormListDialog', null, {
			constructor: function (_container, _context) {
				this.container = (_container != null) ? _container : "fd_formList_container";
				this.context = _context;
			},
			startup: function (){
				this.grid = createGrid(this.container, this.context);
				this.grid.placeAt(this.container);
				this.grid.startup();
			},
			destroy: function(){
				this.grid.destroy();
			},
		});
	});