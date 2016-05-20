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
		//Form elements
		"dijit/form/Button",
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dijit/layout/ContentPane",
		"dojo/dnd/Source",
		"dijit/registry",
		"dataexplore/FormListDialog",
		"dataexplore/IncludeFileListDialog",
		"dataexplore/FilePropertyDialog",
		"dataexplore/SubmissionsPanel",
		"dojo/topic",
		"dojo/on",
		"dojo/string",
		"dojo/dom-construct",
		"dijit/TooltipDialog",
		"dojo/domReady!"
	],function(lang, cfg, declare, request, on, json, dom, domClass, domAttr, JsonRest , 
		Observable, Memory, ObjectStore, Cache, Grid, Async, Button, Dialog, ConfirmDialog, ContentPane,
		Source, registry, FormListDialog, IncludeFileListDialog, FilePropertyDialog, SubmissionsPanel,
		topic, on, stringUtil, domConstruct, TooltipDialog) {

		function createContent(_container, _context, _id){
			var content = new ContentPane({
				id: (_container) + "_sp_summary_panel",
				//class: "sp_summary_panel",
				title: Platform.messages['pac.dataexplore.submitjobs.ss.title'],
				style: "width:100%;height:100%",
				onHide: function(){this.destroyRecursive(false);},
				onShow: function(){
					var table = domConstruct.create("table", {id: "sp_summary_table"});
					//var table = domConstruct.create("table", {id: "sp_summary_table", class:"sp_summary_table"});
					domClass.add(table, "sp_summary_table");
					var tr = domConstruct.create("tr", {}, table);

					var td_0 = domConstruct.create("td", {style: "width:10%"}, tr);

					var td_1 = domConstruct.create("td", {style: "width:60%"}, tr);
					var text_1 = Platform.messages['pac.dataexplore.submitjobs.ss.title.submit'];
					//var label_1 = domConstruct.create("label", {id: "sp_summary_label_1", class: "sp_summary_label_1", innerHTML: text_1}, td_1);
					var label_1 = domConstruct.create("label", {id: "sp_summary_label_1", innerHTML: text_1}, td_1);
					domClass.add(label_1, "sp_summary_label_1");

					var td_2 = domConstruct.create("td", {style: "width:30%"}, tr);
					var text_2 = "0" + " " + Platform.messages['pac.dataexplore.submitjobs.ss.title.input.files'];
					//var label_2 = domConstruct.create("label", {id: "sp_summary_label_2", class: "sp_summary_label_2", innerHTML: text_2}, td_2);
					var label_2 = domConstruct.create("label", {id: "sp_summary_label_2", innerHTML: text_2}, td_2);
					domClass.add(label_2, "sp_summary_label_2");

					this.set("content", table);
				}
			});
			return content;
		}

		return declare('dataexplore.SummaryPanel', null, {
			constructor: function (_container, _context, _id) {
				this.container = (_container != null)?_container:"sp_summary_container";
				this.context = _context; this.id = _id;
			},
			startup: function() {
				this.content = createContent(this.container, this.context, this.id);
				this.content.placeAt(this.container);
				this.content.startup();
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
			refresh: function(_data){
				var text_2 = _data + " " + Platform.messages['pac.dataexplore.submitjobs.ss.title.input.files'];
				domAttr.set(dom.byId("sp_summary_label_2"), "innerHTML", text_2);
			}
		});
});
