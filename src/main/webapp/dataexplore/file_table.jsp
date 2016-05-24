<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html >
<head>
	<c:import url="/dataexplore/includes/include-styles.jsp"/>
	<c:import url="/dataexplore/includes/include-dojo.jsp"/>
	<c:import url="/dataexplore/includes/include-scripts.jsp"/>
</head>

<body class='claro myTheme'>
	<button id="refreshFileTablePanelBtn" type="button">Refresh file table</button>
	<button id="getSelectedFileBtn" type="button">Get selected file</button>

	<button id="isShowBtn" type="button">Show/Hidden</button>
	<div id="fileTablePanelContainer"></div>
	<style type="text/css">
		#fileTablePanelContainer{
			width: 800px;
			#height: 200px;
			overflow: auto;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/FileTablePanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/on",
			"dojo/domReady!"
		],
		function(Button, FileTablePanel, dom, topic, request, on){
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
				var host = _context.host; var path = _context.path;
				
				var fileTablePanel = new FileTablePanel("fileTablePanelContainer", _context, "fileTable", host, path);
				fileTablePanel.startup();

				var refreshFileTablePanelBtn = new Button({
					onClick: function(){
						var host = _context.host; var path = _context.path; var filters = {fileName: "scratch"};
						fileTablePanel.refresh(host, path, filters);
					}
				}, "refreshFileTablePanelBtn");

				var getSelectedFileBtn = new Button({
					onClick: function(){
						var selected = fileTablePanel.getSelected();
						console.log(selected);
					}
				}, "getSelectedFileBtn");
				
				var isShowBtn = new Button({
					onClick: function(){
						//console.log("fileTablePanel.isShow():" + fileTablePanel.isShow());
						if(fileTablePanel.isShow() == true){
							fileTablePanel.hidden();
						}else{
							fileTablePanel.show();
						}
					}
				}, "isShowBtn");

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.click", function(id, rowData){
					if(rowData.type == "d"){
						fileTablePanel.refresh(rowData.host, rowData.path);
					}else{
						//window.download(context, rowData);
					}
				});
				
				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.row.selected", function(id, rowId){
					console.log("get the row.selected event!");
				});

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.mark.file", function(id, rowData){
					console.log("get the item.mark.file event!");
				});

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.mark.favorite", function(id, rowData){
					console.log("get the item.mark.favorite event!");
				});

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.unmark.favorite", function(id, rowData){
					console.log("get the item.unmark.favorite event!");
				});
			};
		});
	</script>
</body>
</html>
