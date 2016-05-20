<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-actions.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>

	<button id="refreshFileTablePanelBtn" type="button">Refresh file table</button>
	<button id="getSelectedFileBtn" type="button">Get selected file</button>

	<button id="isShowBtn" type="button">Show/Hidden</button>
	<button id="isOverBtn" type="button">Show/Hidden (Over Layer)</button>
	
	<button id="getPermissionBtn" type="button">Get permission</button>

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
				//var host = "xa8603"; var path = "/home/gliu/temp";
				var host = _context.hostName; var path = _context.spoolerPath;

				if(_context.currentHost != null) host = _context.currentHost;
				if(_context.currentPath != null) path = _context.currentPath;

				var fileTablePanel = new FileTablePanel("fileTablePanelContainer", _context, host, path, "", true);
				fileTablePanel.startup();

				var refreshFileTablePanelBtn = new Button({
					onClick: function(){
						var host = "xa8603"; var path = "/home/gliu"; var filters = {fileName: "scratch"};
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

				var isOverBtn = new Button({
					onClick: function(){
						//console.log(parent.isOverLayerShow());
						if(window.isOverLayerShow() != true){
							window.showOverLayer();
						}else{
							window.hiddenOverLayer();
						}
					}
				}, "isOverBtn");

				var getPermissionBtn = new Button({
					onClick: function(){
						var url = _context.contextPath + "/webservice/pac/data/checkWritePermission/file?rnd=" + (new Date()).getTime();
						var postData = "hostName=" + "xa8603.eng.platformlab.ibm.com" + "&filePath=" + "/home/gliu/temp/testresult";
						request.post(url ,{
							data: postData,
						}).then(function(data){
							console.log(data);
						}, function(err){
							// handle an error condition
						}, function(evt){
							// handle a progress event
						});
					}
				}, "getPermissionBtn");

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.click", function (file){
					console.log("get the event.item.click event!");
					if(file.type == "d"){
						fileTablePanel.refresh(file.host, file.absolutePath);
						/*
						checkPermission(_context, file.host, file.absolutePath, function(){
							//refrsh file table
							fileTablePanel.refresh(file.host, file.absolutePath);
						});
						*/
					}else{
						window.download(context, file);
					}
				});
				
				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.row.selected", function (rowId){
					console.log("get the event.row.selected event!");
					console.log(rowId);
				});

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.mark.file", function (file){
					//save the input file into properties file
					var url = _context.urlContext + "/doAddInputFile.action?rnd=" + (new Date()).getTime();
					var postData = "inputFile.host=" + file.host + "&" + "inputFile.type=" + file.type + "&" + "inputFile.path=" + file.path + "&" + "inputFile.name=" + file.name;
					
					request.post(url, {data : postData}).then(function(data){});

					fileTablePanel.refresh();
				});

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.mark.favorite", function (file){
					var favorite = (file.host + ":" + file.absolutePath);
					var url = _context.urlContext + "/doAddFavorite.action?rnd=" + (new Date()).getTime();
					request.post(url, {data : "favorite=" + favorite}).then(function(data){});

					fileTablePanel.refresh();
				});

				topic.subscribe(fileTablePanel.getEventPrefix() + "@event.item.unmark.favorite", function (file){
					var favorite = (file.host + ":" + file.absolutePath);
					var url = _context.urlContext + "/doRemoveFavorite.action?rnd=" + (new Date()).getTime();
					request.post(url, {data : "favorite=" + favorite}).then(function(data){});

					fileTablePanel.refresh();
				});

				on(window, "beforeunload", function(){
					var url = _context.urlContext + "/doSaveDataExploreContext.action?rnd=" + (new Date()).getTime();
					_context.currentHost="xa8603";
					_context.currentPath = "/home/gliu/temp";
					var postData = "dataExploreContext.currentHost=" + _context.currentHost + "&" + "dataExploreContext.currentPath=" + _context.currentPath;
					request.post(url ,{
							data: postData,
						}).then(function(data){
							//console.log("successfuly save the context!");
						}, function(err){
							//console.log(err);
						}, function(evt){
							//console.log(evt);
					});
				});
			};
		});
	</script>
</body>
</html>
