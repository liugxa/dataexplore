<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html >
<head>
	<c:import url="/dataexplore/includes/include-styles.jsp"/>
	<c:import url="/dataexplore/includes/include-dojo.jsp"/>
	<c:import url="/dataexplore/includes/include-scripts.jsp"/>
</head>

<body class='claro myTheme'>
	<button id="showBtn" type="button">Show/Hidden bread crumb</button>
	<input id="refrTextBox" />
	<button id="refrBtn" type="button">Refresh bread crumb</button>
	<div id="breadCrumbPanelContainer"></div>
	

	
	<style type="text/css">
		#breadCrumbPanelContainer{
			width: 100%;
			height: 30px;			
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dijit/form/TextBox",
			"dataexplore/BreadCrumbPanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/on",
			"dojo/domReady!"
		],
		function(Button, TextBox, BreadCrumbPanel, dom, topic, request, on){
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

			function main(_context){
				var host = "xa8603"; var path = "/home/gliu/temp";
				
				var breadCrumbPanel = new BreadCrumbPanel("breadCrumbPanelContainer", _context, "breadCrumb", host, path);
				breadCrumbPanel.startup();
				
				var showBtn = new Button({
					onClick: function(){
						if(breadCrumbPanel.isShow() == true){
							breadCrumbPanel.hidden();
						}else{
							breadCrumbPanel.show();
						}
					}
				}, "showBtn");
				
				var refrTextBox = new TextBox({
					name: "refrTextBoxName",
					value: "xa8603:/home/gliu/workspace/dataexplore",
					placeHolder: "type in your location"
				}, "refrTextBox");
				
				var refrBtn = new Button({
					onClick: function(){
						var textValue = refrTextBox.value;
						var host = textValue.substring(0, textValue.indexOf(":"));
						var path = textValue.substring(textValue.indexOf(":") + 1);
						breadCrumbPanel.refresh(host, refrTextBox.value);
					}
				}, "refrBtn");
				
				//resolve the bread crumb events
				topic.subscribe(breadCrumbPanel.getEventPrefix() + "@event.item.click", function(id, host, path){
					breadCrumbPanel.refresh(host, path);
				});
				
				topic.subscribe(breadCrumbPanel.getEventPrefix() + "@event.up.click", function(id, host, path){
					breadCrumbPanel.refresh(host, path);
				});
				
				topic.subscribe(breadCrumbPanel.getEventPrefix() + "@event.input.change", function(id, host, path){
					breadCrumbPanel.refresh(host, path);
				});
			};
		});
	</script>
</body>
</html>
