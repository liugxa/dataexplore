<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>

	<div id="dataActionsPanelContainer"></div>
	<div id="fileTablePanelContainer"></div>
	<style type="text/css">
		#dataActionsPanelContainer{
			width: 100%;
			height: 40px;
		}
		#fileTablePanelContainer{
			width: 100%;
			height: 600px;
		}
		#fileTablePanelContainer_gridX{
			height: 100%;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/DataActionsPanel",
			"dataexplore/FileTablePanel",
			"datautil/EventProxy",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/store/JsonRest",
			"dojo/domReady!"
		],
		function(Button, DataActionsPanel, FileTablePanel, EventProxy, dom, topic, request, JsonRest){
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

			function main(context){
				var host = "xa8603"; var path = "/home/gliu/temp";
				
				var fileTablePanel = new FileTablePanel("fileTablePanelContainer", context, host, path, "", true);
				var dataActionsPanel = new DataActionsPanel("dataActionsPanelContainer", context, fileTablePanel);
				
				fileTablePanel.startup();
				dataActionsPanel.startup();
				
				var panels = {"dataActionsPanel": dataActionsPanel, "fileTablePanel": fileTablePanel};
				var eventProxy = new EventProxy(context, panels);
				eventProxy.startup();
			};
		});
	</script>

	<%@include file="/pac/dataexplore/includes/include-panels.jsp"%>
</body>
</html>
