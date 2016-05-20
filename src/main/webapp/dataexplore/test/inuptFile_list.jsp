<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>

	<button id="addFileBtn" type="button" >Add File</button>
	<button id="delFileBtn" type="button" >Delete File</button>
	<button id="getFilesBtn" type="button" >Get All Files</button>

	<button id="reloadBtn" type="button" >Reload</button>
	<button id="isShowBtn" type="button">Show/Hidden</button>
	<!--
	<button id="addFilesBtn" type="button" >Add New Files</button>
	<button id="delFilesBtn" type="button" >Delete All Files</button>
	-->

	<div id="inputFileListPanelContainer">
		<table id="inputFileListPanelTable"></table>
	</div>

	<style type="text/css">
		#inputFileListPanelContainer{
			width: 400px;
			height: 300px;
			overflow: auto;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/InputFileListPanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/domReady!"
		],
		function(Button, InputFileListPanel, dom, topic, request){
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
				var inputFileListPanel = new InputFileListPanel("inputFileListPanelTable", context);
				inputFileListPanel.startup();

				var files = [
					//another LSF server host
					//{name: "source.xad8603",	type: "file", host: "pac-2.eng.platformlab.ibm.com", path: "/tmp/gliu"},
					//{name: ".bashrc",	type: "deck", host: "pac-2.eng.platformlab.ibm.com", path: "/tmp/gliu"},
					//{name: "bin",		type: "folder", host: "pac-2.eng.platformlab.ibm.com", path: "/tmp/gliu"},
					
					//long file name
					//{name: "thefoxcatchadogthefoxcatchadog.xad8603",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu"},

					//include files
					//{name: "backup",	type: "folder", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu"},

					//generic
					{name: "License.txt", type: "f", host: "xa8603", path: "/home/gliu/backup/application/generic"},
					{name: "Benchmark.def", type: "f", host: "xa8603", path: "/home/gliu/backup/application/generic"},
					{name: ".pulse", type: "d", host: "xa8603", path: "/home/gliu/backup/application/generic"},

					//FLUENT
					//{name: "fluent-test.cas.gz",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/fluent"},
					//{name: "fluent-test.jou",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/fluent"},
					//{name: "fluent-test.txt",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/fluent"},
				];
				
				//add/remove/get single file
				var file = {name: "License.txt", type: "f", host: "xa8603", path: "/home/gliu/backup/application/generic"};
				var addFileBtn = new Button({
					onClick: function(){
						inputFileListPanel.add(file);
					}
				}, "addFileBtn");

				var delFileBtn = new Button({
					onClick: function(){
						inputFileListPanel.remove(file);
					}
				}, "delFileBtn");

				var reloadBtn = new Button({
					onClick: function(){
						inputFileListPanel.reload();
					}
				}, "reloadBtn");

				//add/remove/get multi files
				/*
				var addFilesBtn = new Button({
					onClick: function(){
						inputFileListPanel.addFiles(files);
					}
				}, "addFilesBtn");

				var delFilesBtn = new Button({
					onClick: function(){
						inputFileListPanel.deleteAll();
					}
				}, "delFilesBtn");
				*/
				var getFilesBtn = new Button({
					onClick: function(){
						var r = inputFileListPanel.getFiles();
						console.log("get all of the files");
						console.log(r);
					}
				}, "getFilesBtn");

				var isShowBtn = new Button({
					onClick: function(){
						if(inputFileListPanel.isShow() == true){
							inputFileListPanel.hidden();
						}else{
							inputFileListPanel.show();
						}
					}
				}, "isShowBtn");

				topic.subscribe(inputFileListPanel.getEventPrefix() + "@event.inputfiles.add.success", function (_file){
					console.log("get the event.inputfiles.add.success!");
					console.log(_file);
				});
				
				topic.subscribe(inputFileListPanel.getEventPrefix() + "@event.inputfiles.remove.success", function (_file){
					console.log("get the event.inputfiles.remove.success!");
					console.log(_file);
				});

				topic.subscribe(inputFileListPanel.getEventPrefix() + "@event.inputfiles.reload.success", function (_files){
					console.log("get the event.inputfiles.reload.success!");
					console.log(_files);
				});
			};
		});
	</script>
</body>
</html>
