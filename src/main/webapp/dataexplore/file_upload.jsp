<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html >
<head>
	<c:import url="/dataexplore/includes/include-styles.jsp"/>
	<c:import url="/dataexplore/includes/include-dojo.jsp"/>
	<c:import url="/dataexplore/includes/include-scripts.jsp"/>
</head>

<body class='claro myTheme'>	
	<div id="fileUploadPanelContainer">Drag file to there</div>
	<style type="text/css">
		#fileUploadPanelContainer{
			width: 400px;
			height: 300px;
			overflow: auto;
			border-style: dashed;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/FileUploadPanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/domReady!"
		],
		function(Button, FileUploadPanel, dom, topic, request){
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
				var fileUploadPanel = new FileUploadPanel("fileUploadPanelContainer", context, "fileUpload");
				fileUploadPanel.startup();
			};
		});
	</script>
</body>
</html>
