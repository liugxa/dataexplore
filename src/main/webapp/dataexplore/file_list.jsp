<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html >
<head>
	<c:import url="/dataexplore/includes/include-styles.jsp"/>
	<c:import url="/dataexplore/includes/include-dojo.jsp"/>
	<c:import url="/dataexplore/includes/include-scripts.jsp"/>
</head>

<body class='claro myTheme'>
	<button id="addFileBtn" type="button" >Add File</button>
	<button id="delFileBtn" type="button" >Delete File</button>
	<button id="addFilesBtn" type="button" >Add Multi Files</button>
	<button id="delFilesBtn" type="button" >Delete All Files</button>
	
	<button id="getFilesBtn" type="button" >Get Files</button>
	<button id="reloadBtn" type="button" >Reload</button>
	<button id="isShowBtn" type="button">Show/Hidden</button>
	

	
	<div id="fileListPanelContainer">
		<table id="fileListPanelTable"></table>
	</div>

	<style type="text/css">
		#fileListPanelContainer{
			width: 400px;
			height: 300px;
			overflow: auto;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/FileListPanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/domReady!"
		],
		function(Button, FileListPanel, dom, topic, request){
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
				var fileListPanel = new FileListPanel("fileListPanelTable", context, "fileList");
				fileListPanel.startup();
				
				//add/remove/get single file
				var addFileBtn = new Button({
					onClick: function(){
						var file = {name: "License.txt", type: "f", host: "xa8603", path: "c:\\home\\gliu\\application\\dataexplore", location: "c:\\home\\gliu\\application\\dataexplore\\License.txt"};
						fileListPanel.add(file);
					}
				}, "addFileBtn");

				var delFileBtn = new Button({
					onClick: function(){
						var file = {name: "License.txt", type: "f", host: "xa8603", path: "c:\\home\\gliu\\application\\dataexplore", location: "c:\\home\\gliu\\application\\dataexplore\\License.txt"};
						fileListPanel.remove(file);
					}
				}, "delFileBtn");

				var reloadBtn = new Button({
					onClick: function(){
						fileListPanel.reload();
					}
				}, "reloadBtn");

				//add/remove/get multi files
				var addFilesBtn = new Button({
					onClick: function(){
						var files = [
							//normal file
							{name: "License.txt", type: "f", host: "xa8603", path: "c:\\home\\gliu\\application\\dataexplore", location: "c:\\home\\gliu\\application\\dataexplore\\License.txt"},
							
							//include files
							{name: "backup", type: "d", host: "xa8603", path: "c:\\", location: "c:\\backup"},
						];						
						
						fileListPanel.addFiles(files);
					}
				}, "addFilesBtn");

				var delFilesBtn = new Button({
					onClick: function(){
						fileListPanel.deleteAll();
					}
				}, "delFilesBtn");
				
				var getFilesBtn = new Button({
					onClick: function(){
						var r = fileListPanel.getFiles();
						console.log("get all of the files");
						console.log(r);
					}
				}, "getFilesBtn");

				var isShowBtn = new Button({
					onClick: function(){
						if(fileListPanel.isShow() == true){
							fileListPanel.hidden();
						}else{
							fileListPanel.show();
						}
					}
				}, "isShowBtn");

				topic.subscribe(fileListPanel.getEventPrefix() + "@event.inputfiles.add.success", function(id, file){
					console.log("get the event.inputfiles.add.success!");
				});
				
				topic.subscribe(fileListPanel.getEventPrefix() + "@event.inputfiles.remove.success", function(id, file){
					console.log("get the event.inputfiles.remove.success!");
				});

				topic.subscribe(fileListPanel.getEventPrefix() + "@event.inputfiles.reload.success", function(id, files){
					console.log("get the event.inputfiles.reload.success!");
				});
			};
		});
	</script>
</body>
</html>
