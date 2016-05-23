<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html >
<head>
	<c:import url="/dataexplore/includes/include-styles.jsp"/>
	<c:import url="/dataexplore/includes/include-dojo.jsp"/>
	<c:import url="/dataexplore/includes/include-scripts.jsp"/>
</head>

<body class='claro myTheme'>
	<button id="reloadHostTreePanelBtn" type="button">Reload host tree</button>
	<button id="clearFocusHostTreePanelBtn" type="button">Clear focus</button>
	<button id="isShowBtn" type="button">Show/Hidden</button>
	
	<input id="expandHostTreeTextBox" />
	<button id="expandHostTreePanelBtn" type="button">Expand host tree</button>
	
	<div id="hostTreePanelContainer"></div>
	<style type="text/css">
		#hostTreePanelContainer{
			width: 300px;
			height: 600px;
			overflow: auto;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/HostTreePanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dijit/Dialog",
			"dojo/domReady!"
		],
		function(Button, HostTreePanel, dom, topic, request, Dialog){
			var urlContext = "<c:url value='/dataexplore'/>";
			
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
				var hostTreePanel  = new HostTreePanel("hostTreePanelContainer", context, "hostTree", "xa8603");
				hostTreePanel.startup();

				//test the host tree panel
				var reloadHostTreePanelBtn = new Button({
					onClick: function(){
						hostTreePanel.reload();
					}
				}, "reloadHostTreePanelBtn");

				var expandHostTreePanelBtn = new Button({
					onClick: function(){
						var textValue =  expandHostTreeTextBox.value;
						hostTreePanel.expandPath(textValue);
					}
				}, "expandHostTreePanelBtn");


				var clearFocusHostTreePanelBtn = new Button({
					onClick: function(){
						hostTreePanel.
						blur();
					}
				}, "clearFocusHostTreePanelBtn");

				var isShowBtn = new Button({
					onClick: function(){
						//console.log("hostTreePanel.isShow():" + hostTreePanel.isShow());
						if(hostTreePanel.isShow() == true){
							hostTreePanel.hidden();
						}else{
							hostTreePanel.show();
						}
					}
				}, "isShowBtn");
				
				topic.subscribe(hostTreePanel.getEventPrefix() + "@event.item.click", function (item){
					console.log("get the host tree item click event!" + item);
				});
			};
		});
	</script>
</body>
</html>
