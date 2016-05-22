define([
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		"dojo/topic",
		//Help moudules
		"paccommon/request",
		//Host Tree
		"dojo/store/Memory",
		"dijit/tree/ObjectStoreModel", 
		"dojo/store/JsonRest",
		"dijit/Tree",
		//Content Panel
		"dijit/layout/ContentPane",
	],function(dom, domClass, domAttr,lang, cfg, declare, topic, request, Memory, 
		ObjectStoreModel, JsonRest, Tree, ContentPane){
	
		function createTree(_container, _context, _id){
			var store = new JsonRest({
				target: request.appendCsrfTokenToURL(_context.urlContext + "/doGetFavorites.action?rnd=" + (new Date()).getTime()).value,
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
					var url = request.appendCsrfTokenToURL(_context.urlContext + "/doGetFavoriteRoot.action?rnd=" + (new Date()).getTime()).value
					var rStore = new JsonRest({target: url});
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
					if(item.id == "favorites") r = "favoriteIcon";
					return r;
				},
				onClick: function(item, node, evt) {
					//publish the event
					topic.publish(tree.id + "@event.item.click", _id, item.id);
				},
				getTooltip: function(item){
					return item.id;
				}
			});
			return tree;
		}

		return declare('dataexplore.FavoriteostTreePanel', null, {
			constructor: function (_container, _context, _id) {
				this.container = (_container != null) ? _container : "fb_favoriteTree_container";
				this.context = _context; this.id = _id;
			},
			startup: function() {
				this.tree = createTree(this.container, this.context, this.id);
				this.tree.placeAt(this.container);
				this.tree.startup();
			},
			isShow: function(){
				var r = false;
				var style = tree.domNode.style.display;
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
			add: function(_favorite){
				var store = new JsonRest({
					target: request.appendCsrfTokenToURL(this.context.urlContext + "/doAddFavorite.action?rnd=" + (new Date()).getTime()).value,
				});
				store.query({"favorite" : _favorite});
			},
			remove: function(_favorite){
				var store = new JsonRest({
					target: request.appendCsrfTokenToURL(this.context.urlContext + "/doRemoveFavorite.action?rnd=" + (new Date()).getTime()).value,
				});
				store.query({"favorite" : _favorite});
			},
			reload: function(){
				this.tree.destroy();
				this.startup();
				this.show();
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
		});
});