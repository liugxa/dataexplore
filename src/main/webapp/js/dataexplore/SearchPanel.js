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
		"dijit/form/TextBox",
		"dojo/date/locale",
	],function(lang, cfg, declare, has, registry, request, Memory, ObjectStoreModel, JsonRest, Tree, 
		ContentPane, dom, domConstruct, topic, aspect, on, HostTreePanel, FileTablePanel,
		Dialog, ConfirmDialog, Button, ProgressBar, Toolbar, ToolbarSeparator, DropDownButton, DropDownMenu, MenuItem, TextBox, locale){
		
		function createTextBox(_this){
			var textBox = new TextBox();
			textBox.set("class", "bc_search_input");
			return textBox;
		}
		
		function createSearchBtn(_this){
			var searchBtn = new Button({
				baseClass:"",
				iconClass: "searchIcon"
			});
			return searchBtn;
		}
		function initElements(_this){
			_this.textBox.startup();
			_this.textBox.placeAt(_this.container);
			
			_this.searchBtn.startup();
			_this.searchBtn.placeAt(_this.container);
			
			//register the search event
			on(_this.searchBtn, "click", function(){
				var value = _this.textBox.get("value");
				topic.publish(_this.eventPrefix + "@event.search", _this.id, _this.host, _this.path, value);
			});

			//listener the key press event for search text
			on(_this.textBox, "keyPress", function(evt){
				if(evt.keyCode == 13){
					var value = this.get("value");
					topic.publish(_this.eventPrefix + "@event.search", _this.id, _this.host, _this.path, value);
				}
			});
		}
		
		return declare('dataexplore.SearchPanel', null, {
			constructor: function (_container, _context, _id, _host, _path){
				this.container = (_container != null) ? _container : "bc_search_container";
				this.context = _context; this.id = _id;
				this.host = _host; this.path = _path;
				this.eventPrefix = this.container + "_search";
			},
			startup: function() {
				this.textBox = createTextBox(this); 
				this.searchBtn = createSearchBtn(this);			
				initElements(this);
			},
			isShow: function(){
				var r = false;
				var style = dom.byId(this.container).style.display
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
				this.textBox.destroy();
				this.searchBtn.destroy();
			},
			getEventPrefix: function(){
				return this.eventPrefix;
			}
		});
});
