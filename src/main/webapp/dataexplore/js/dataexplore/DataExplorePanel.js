define([
		"dojo/_base/lang",
		"dojo/_base/config",
		"dojo/_base/declare",
		"dijit/registry",
		//Help moudules
		"paccommon/request",
		//Host Tree
		"dojo/store/Memory",
		"dijit/tree/ObjectStoreModel", 
		"dojo/store/JsonRest",
		"dijit/Tree",
		"dataexplore/FavoriteTreePanel",
		"dataexplore/HostTreePanel",
		"dataexplore/BreadCrumbPanel",
		"dataexplore/SearchPanel",
		"dataexplore/DataActionsPanel",
		"dataexplore/FileTablePanel",
		"dataexplore/SubmissionsPanel",
		"dataexplore/SummaryPanel",
		"datautil/EventProxy",
		//Content Panel
		"dijit/layout/ContentPane",
		"dojo/dom",
		"dojo/dom-construct",
		"dojo/topic",
		"dojo/aspect",
		"dojo/on",
		"dijit/Dialog",
	], function(lang, cfg, declare, registry, request, Memory, ObjectStoreModel, JsonRest, Tree, 
	FavoriteTreePanel, HostTreePanel, BreadCrumbPanel, SearchPanel, DataActionsPanel, FileTablePanel, SubmissionsPanel, SummaryPanel, EventProxy,
	ContentPane, dom, domConstruct, topic, aspect, on, Dialog){
	
		function rockContainerPanel(){
			dijit.byId("de_layoutContainer").resize();
		}

		function resizeTopPanel(_step){
			if(_step > 1){
				var ceil = Math.ceil(_step);
				var height = 45 * ceil + "px";

				dojo.style(dijit.byId("de_dataActions_pane").domNode, "height", height);
				rockContainerPanel();
			}
		}

		function resizeBottomPanel(_height){
			dojo.style(dijit.byId("de_submissions_pane").domNode, "height", _height);
			rockContainerPanel();
		}

		function showSubmissionsPanel(_submissionsPanel, _summaryPanel){
			_submissionsPanel.show();
			_summaryPanel.hidden();
			resizeBottomPanel("320px");
		}

		function showSummaryPanel(_submissionsPanel, _summaryPanel){
			_submissionsPanel.hidden();
			
			var inputFiles = _submissionsPanel.inputFileListPanel.getFiles();
			_summaryPanel.refresh(inputFiles.length);
			_summaryPanel.show();

			resizeBottomPanel("30px");
		}

		function initElements(_container, _context, _id, _panels){
			//initialize the bread crumb & data actions panel
			_panels.searchPanel.startup();
			_panels.breadCrumbPanel.startup();
			
			_panels.fileTablePanel.startup();
			_panels.dataActionsPanel.startup();
			
			//initialize the tree panel
			_panels.favoriteTreePanel.startup();
			_panels.hostTreePanel.startup();

			_panels.submissionsPanel.startup();
			_panels.summaryPanel.startup();
			
			//initialize the submission panel. 
			//By default, showing the summary panel at begining.
			//_panels.submissionsPanel.hidden();

			//after get the inputFileListPanel's load success event, and then 
			//refresh the summary panel content
			topic.subscribe(_panels.submissionsPanel.inputFileListPanel.getEventPrefix() + "@event.inputfiles.load.success", function(){
				if(_context.splitterExpand == "true"){
					showSubmissionsPanel(_panels.submissionsPanel, _panels.summaryPanel);
				}else{
					showSummaryPanel(_panels.submissionsPanel, _panels.summaryPanel);
				}
			});

			//hack, resize the broder container
			rockContainerPanel();
		}

		function eventsHandle(_container, _context, _id, _panels){
			// Splitter drag-drop event
			var splitter = registry.byId("de_layoutContainer").getSplitter("bottom");
			
			//by default, the splitter will be expanded automantially.
			var autoExpand = true;
			on(splitter, "click", function(evt){
				if(_panels.submissionsPanel.isShow()){
					showSummaryPanel(_panels.submissionsPanel, _panels.summaryPanel);
					_context.splitterExpand = false;
				}else{
					showSubmissionsPanel(_panels.submissionsPanel, _panels.summaryPanel);
					_context.splitterExpand = true;
				}
				//if there appears the click event for "splitter", close the auto expand function
				autoExpand = false;
				topic.publish((_container + "_dataExplore") + "@event.splitter.expand", _id, !autoExpand);
			});
			
			//regist the events
			var eventProxy  = new EventProxy(_context, _panels);
			eventProxy.startup();
			
			//regist the special event
			topic.subscribe(_panels.dataActionsPanel.getEventPrefix() + "@event.resize", function(id, step){
				resizeTopPanel(step);
			});
			
			topic.subscribe(_panels.fileTablePanel.getEventPrefix() + "@event.item.mark.file", function(id, file){
				//if the submission panel had been hidden, don't shown it.
				if(autoExpand == true) showSubmissionsPanel(_panels.submissionsPanel, _panels.summaryPanel);
			});			
		}

		function createContent(_container, _context, _id, _panels){
			//Create the content panel
			var url =  _context.urlContext + "/toDataExplore.action?rnd=" + (new Date()).getTime() ; 
			url = request.appendCsrfTokenToURL(url).value;
			var content = new ContentPane({
				href:url,
				style: "width:100%;height:100%",
				onHide: function(){this.destroyRecursive(false);},
				onDownloadEnd: function () {
					// Initialize the file browser and submission panel.
					initElements(_container, _context, _id, _panels);

					//event handle
					eventsHandle(_container, _context, _id, _panels);
				}
			});
			return content
		}
		
		return declare('dataexplore.DataExplorePanel', null, {
			constructor: function (_container, _context) {
				this.container = (_container != null) ? _container : "de_fileBrowsing_container";
				this.context = _context; var host = _context.host; var path = _context.path;
				
				this.breadCrumbPanel = new BreadCrumbPanel("de_breadCrumb_container", _context, "dataExplore", host, path);
				this.searchPanel = new SearchPanel("de_search_container", _context, "dataExplore", host, path);
				
				this.fileTablePanel = new FileTablePanel("de_fileTable_container", _context, "dataExplore", host, path, "", true);
				this.dataActionsPanel = new DataActionsPanel("de_dataActions_container", _context, "dataExplore", this.fileTablePanel, host, path);
				
				this.favoriteTreePanel = new FavoriteTreePanel("de_favoriteTree_container", _context, "dataExplore");
				this.hostTreePanel  = new HostTreePanel("de_hostTree_container", _context, "dataExplore");
				
				this.submissionsPanel = new SubmissionsPanel("de_submissions_container", _context, "dataExplore");
				this.summaryPanel = new SummaryPanel('de_summary_container', _context, "dataExplore");
			},
			startup: function() {
				this.content = createContent(this.container, this.context, this.id, this.getPanels());
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
			getEventPrefix: function(){
				return this.container + "_dataExplore";
			},
			getPanels: function(){
				var panels = {
					"searchPanel": this.searchPanel,
					"breadCrumbPanel": this.breadCrumbPanel,
					"fileTablePanel": this.fileTablePanel, 
					"dataActionsPanel": this.dataActionsPanel,
					"favoriteTreePanel": this.favoriteTreePanel,
					"hostTreePanel": this.hostTreePanel,
					"submissionsPanel": this.submissionsPanel,
					"summaryPanel": this.summaryPanel,
					"dataExplorePanel": this
				};
				return panels;
			}
		});
});