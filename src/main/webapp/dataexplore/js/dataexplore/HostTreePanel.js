define([
		//base modules
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		"dojo/topic",
		//request moudules
		"paccommon/request",
		//tree modules
		"dojo/store/Memory",
		"dijit/tree/ObjectStoreModel", 
		"dojo/store/JsonRest",
		"dijit/Tree",
		//panel module
		"dijit/layout/ContentPane",
	], function(dom, domClass, domAttr,lang, cfg, declare, topic, request, 
		Memory, ObjectStoreModel, JsonRest, Tree, ContentPane){

		function createTree(_container, _context, _id){
			var url = _context.urlContext + "/doGetHostFiles.action?rnd=" + (new Date()).getTime();
			var store = new JsonRest({
				target: url,
				mayHaveChildren: function(object){
					// see if it has a children property
					//return "subNodes" in object;
					return object.hasItems;
				},
				getChildren: function(object, onComplete, onError){
					// retrieve the full copy of the object
					this.query({id: object.id}).then(function(fullObject){
						// copy to the original object so it has the children array as well.
						// now that full object, we should have an array of children
						onComplete(fullObject);
					}, onError);
				},
				getRoot: function(onItem, onError){
					var target = _context.urlContext + "/doGetHostRoot.action?rnd=" + (new Date()).getTime();
					var rStore = new JsonRest({target: target});
					// get the root object, we will do a get() and callback the result
					return rStore.query().then(onItem, onError);
				},
				getLabel: function(object){
					// just get the name
					return object.name;
				}
			});

			// Create the Tree.
			var tree = new Tree({
				id: (_container + "_tree"),
				model: store,
				/*persist: true,*/
				autoExpand: false,
				getIconClass: function(item, opened) {
					var r = (opened ? "dijitFolderOpened" : "dijitFolderClosed");
					var itemId = item.id;

					//get the path
					var path = "";
					if(itemId.indexOf(":") != -1) path = itemId.substring(itemId.indexOf(":") + 1);

					//showing the host icon for the root node or the node which's path is "/"
					if(item.id == "hosts" || path == "/") r = "hostIcon";
					return r;
				},
				onClick: function(item, node, evt) {
					//publish the event
					//console.log("publish the host tree event." + (tree.id + "@event.item.click"));
					topic.publish(tree.id + "@event.item.click", _id, item.id);
				},
				getTooltip: function(item){
					return item.id;
				}
			});
			return tree;
		}

		//var tree;
		return declare('dataexplore.HostTreePanel', null, {
			constructor: function (_container, _context, _id) {
				this.container = (_container != null) ? _container : "fb_hostTree_container";
				this.context = _context; this.id = _id;
			},
			startup: function() {
				this.tree = createTree(this.container, this.context, this.id);
				this.tree.placeAt(this.container);
				this.tree.startup();
			},
			isShow: function(){
				var r = false;
				var style = this.tree.domNode.style.display;
				if(style == "" || style == "block") r = true;
				return r;
			},
			show: function(){
				this.tree.domNode.style.display = "block";
				dom.byId(this.container).style.display = "block";
			},
			hidden: function(){
				this.tree.domNode.style.display = "none";
				dom.byId(this.container).style.display = "none";
			},
			destroy: function(){
				this.tree.destroy();
			},
			getEventPrefix: function(){
				return (this.container + "_tree");
			},
			reload: function(){
				this.tree.destroy();
				this.startup();
			},
			blur: function(){
				var curNode = this.getCurNode();
				if(curNode != null) curNode.setSelected(false);
			},
			getSelected: function(){
				return this.tree.selectedItem;
			},
			getCurNode: function(){
				var r = null;
				var item = this.tree.selectedItem;
				if(item != null) r = this.tree.getNodesByItem(item)[0];
				return r;
			},
			expandPath: function(_path){
				var node = this.tree.getNodesByItem(_path)[0];
				this.tree._expandNode(node);
			}
		});
	});