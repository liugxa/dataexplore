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

		//create the tool bar
		function createToolBar(_this){
			var toolBar = new Toolbar();
			
			//if the path's length > 20, showing the bread-crumb by using the drop down menu
			var paths = _this.path.split('/');
			if(paths.length < 5){
				//append the host value
				var hostBtn = createButton(_this.host, _this.host, "/");
				toolBar.addChild(hostBtn);

				//add separator
				var separator = new ToolbarSeparator({
					baseClass:'breadCrumbSeparator',
				});
				toolBar.addChild(separator);

				var _location = "";
				for(var i=0;i<paths.length;i++){
					if(paths[i] != ''){
						var _location = _location + "/" + paths[i];
						var btn = createButton(paths[i], _this.host, _location);
						toolBar.addChild(btn);

						//don't append the separator in the last one
						if(i != (paths.length -1)){
							//add separator
							var separator = new ToolbarSeparator({
								baseClass:'breadCrumbSeparator',
							});
							toolBar.addChild(separator);
						}
					}
				}
			}else{
				//append the host value
				var hostBtn = createButton(_this.host, _this.host, "/");
				toolBar.addChild(hostBtn);

				//add separator
				var separator = new ToolbarSeparator({
					baseClass: 'breadCrumbSeparator',
				});
				toolBar.addChild(separator);

				//drop down menu
				var dropDownBtn = new DropDownButton({
					iconClass: 'breadCrumbDropDownIcon',
					dropDown: createDropDownMenu(_this.host, paths),
				});
				toolBar.addChild(dropDownBtn);;

				//add separator
				var separator = new ToolbarSeparator({
					baseClass: 'breadCrumbSeparator',
				});
				toolBar.addChild(separator);

				//last path
				var lastPathBtn = createButton(paths[paths.length - 1], _this.host, _this.path);
				toolBar.addChild(lastPathBtn);
			}
			
			//the input button
			var editBtn = new Button({
				baseClass: "",
				iconClass: "breadcrumbInputIcon",
				onClick: function(evt){
					_this.toolBar.set("style", "display:none");
					_this.textBox.set("style", "display:block");
					_this.textBox.set("value", (_this.host + ":" + _this.path));
					_this.textBox.focus();	
				}
			});
			toolBar.addChild(editBtn);

			//the up button
			var upBtn = new Button({
				baseClass: "",
				iconClass: "breadcrumbUpIcon",
				onClick: function(evt){
					var upPath = _this.path.substring(0, _this.path.lastIndexOf("/"));
					upPath = (upPath == "") ? "/" : upPath;	
					topic.publish(_this.eventPrefix + "@event.up.click", _this.id, _this.host, upPath);
				}
			});
			toolBar.addChild(upBtn);
			
			function createDropDownMenu(_host, _paths){
				var menu = new DropDownMenu({style: "display: none;"});
				var _path = "";
				for(var i=0;i<_paths.length;i++){
					//don't append the root path and the last one
					if(_paths[i] != '' && i != (_paths.length -1)) {
						var _path = _path + "/" + _paths[i];
						var menuItem = new MenuItem({
							label: _paths[i],
							host: _host,
							path: _path,
							onClick: function(evt){
								topic.publish(_this.eventPrefix + "@event.item.click", _this.id, this.host, this.path);
							}
						});
						menu.addChild(menuItem);
					}
				}
				return menu;
			}

			function createButton(_label, _host, _path){
				var r = new Button({
					label: _label,
					host: _host,
					path: _path,
					baseClass: "breadCrumbText",
					onClick: function(evt){
						topic.publish(_this.eventPrefix + "@event.item.click", _this.id, this.host, this.path);
					}
				});
				return r;
			}
			
			return toolBar;
		}
		
		function createTextBox(_this){
			var textBox = new TextBox();
			textBox.set("style", "width:60%;display:none");
			textBox.set("value", (_this.host) + ":" + _this.path);
			return textBox;
		}
		
		function initElements(_this){
			_this.toolBar.placeAt(_this.container);
			_this.toolBar.startup();
			
			//show the text box					
			_this.textBox.placeAt(_this.container);
			_this.textBox.startup();
			
			//register the event
			//key press event
			on(_this.textBox, "keyPress", function(evt){
				if(evt.keyCode == 13){
					var value = this.get("value");
					if(value.indexOf(":") != -1){
						var host = value.substring(0, value.indexOf(":"));
						var path = value.substring(value.indexOf(":") + 1);
						
						_this.toolBar.set("style", "display:block");
						_this.textBox.set("style", "display:none");
						topic.publish(_this.eventPrefix + "@event.input.change", _this.id, host, path);
					}else{
						showMessage("Invalide path! using the pattern - [host]:[path]");
					}
				}
			});
			
			//blur event
			on(_this.textBox, "blur", function(evt){
				_this.toolBar.set("style", "display:block");
				_this.textBox.set("style", "display:none");
			});
			
			console.log("refresh bread crumb: " +  _this.host + ":" + _this.path);
		}
		
		function refreshToolBar(_this){
			//replace the tool bar with an new one
			_this.toolBar.destroy();
			
			_this.toolBar = createToolBar(_this);
			_this.toolBar.placeAt(_this.container);
			_this.toolBar.startup();
		}
		
		return declare('dataexplore.BreadCrumbPanel', null, {
			constructor: function (_container, _context, _id, _host, _path){
				this.container = (_container != null) ? _container : "bc_breadCrumb_container";
				this.context = _context; this.id = _id;
				this.host = _host; this.path = _path;
				this.eventPrefix = this.container + "_breadCrumb";
			},
			startup: function() {
				this.toolBar = createToolBar(this); 
				this.textBox = createTextBox(this);
				initElements(this);
			},
			isShow: function(){
				var r = false;
				var style = dom.byId(this.container).style.display;
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
				this.toolBar.destroy();
				this.textBox.destroy();
			},
			getEventPrefix: function(){
				return this.eventPrefix;
			},
			refresh: function(_host, _path){
				this.host = _host; this.path = _path;
				refreshToolBar(this);
			}
		});
});
