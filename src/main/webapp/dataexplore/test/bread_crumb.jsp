<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>

	<button id="refrBtn" type="button">Refresh bread crumb</button>
	<button id="showBtn" type="button">Show/Hidden bread crumb</button>
	
	<div id="breadCrumbPanelContainer"></div>
	<div id="searchPanelContainer"></div>
	<div id="fileTablePanelContainer"></div>
	<style type="text/css">
		#breadCrumbPanelContainer{
			width: 100%;
			height: 30px;			
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/BreadCrumbPanel",
			"dataexplore/SearchPanel",
			"dataexplore/FileTablePanel",
			"datautil/EventProxy",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/on",
			"dojo/domReady!"
		],
		function(Button, BreadCrumbPanel, SearchPanel, FileTablePanel, EventProxy, dom, topic, request, on){
			var urlContext = "<c:url value='/pac/dataexplore'/>";
			
			request.get(urlContext + "/doGetDataExploreContext.action?rnd=" + (new Date()).getTime(),{
				handleAs: "json",
			}).then(function(data){
				main(data);
			}, function(err){
				// handle an error condition
			}, function(evt){
				// handle a progress event
			});

			function main(_context){
				var host = "xa8603"; var path = "/home/gliu/temp";
				
				var breadCrumbPanel = new BreadCrumbPanel("breadCrumbPanelContainer", _context, host, path);
				var searchPanel = new SearchPanel("searchPanelContainer", _context, host, path);
				var fileTablePanel = new FileTablePanel("fileTablePanelContainer", _context, host, path, "", true);
				
				searchPanel.startup();
				breadCrumbPanel.startup();
				fileTablePanel.startup();
				
				var panels = {"breadCrumbPanel": breadCrumbPanel, "fileTablePanel": fileTablePanel, "searchPanel": searchPanel};
				var eventProxy = new EventProxy(_context, panels);
				eventProxy.startup();
				
				var refrBtn = new Button({
					onClick: function(){
						var host = "xa8603"; var path = "/home/gliu/temp";
						breadCrumbPanel.refresh(host, path);
					}
				}, "refrBtn");
				
				var showBtn = new Button({
					onClick: function(){
						if(breadCrumbPanel.isShow() == true){
							breadCrumbPanel.hidden();
							searchPanel.hidden();
						}else{
							breadCrumbPanel.show();
							searchPanel.show();
						}
					}
				}, "showBtn");
			};
		});
	</script>
</body>
</html>
