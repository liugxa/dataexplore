<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>
	<%@include file="/pac/dataexplore/includes/include-submissions.jsp"%>

	<button id="isShowSubmissionsPanelBtn" type="button">Show/Hidden submission paenl</button>
	<button id="addNewFilesBtn" type="button" >Add New Files</button>

	<button id="isShowSummaryPanelBtn" type="button">Show/Hidden summary panel</button>
	<button id="refreshSummaryPanelBtn" type="button">Refresh summary panel</button>

	<div id="submissionsPanelContainer"></div>
	<div id="summaryPanelContainer"></div>

	<style type="text/css">
		#submissionsPanelContainer{
			width: 100%;
			height: 80%;
			#background-color: white;
		}

		#summaryPanelContainer{
			#background-color: white;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/SubmissionsPanel",
			"dataexplore/SummaryPanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/domReady!"
		],
		function(Button, SubmissionsPanel, SummaryPanel, dom, topic, request){
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
				var submissionsPanel = new SubmissionsPanel("submissionsPanelContainer", context);
				var summaryPanel = new SummaryPanel('summaryPanelContainer', context);
				
				submissionsPanel.startup();
				summaryPanel.startup();

				var isShowSubmissionsPanelBtn = new Button({
					onClick: function(){
						if(submissionsPanel.isShow()){
							submissionsPanel.hidden();
						}else{
							submissionsPanel.show();
						}
					}
				}, "isShowSubmissionsPanelBtn");

				var isShowSummaryPanelBtn = new Button({
					onClick: function(){
						if(summaryPanel.isShow()){
							summaryPanel.hidden();
						}else{
							summaryPanel.show();
						}
					}
				}, "isShowSummaryPanelBtn");

				var refreshSummaryPanelBtn = new Button({
					onClick: function(){
						var files = submissionsPanel.inputFileListPanel.getFiles();
						summaryPanel.refresh(files.length);
					}
				}, "refreshSummaryPanelBtn");

				var addNewFilesBtn = new Button({
					onClick: function(){
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
							{name: "License.txt",	type: "f", host: "xa8603", path: "/home/gliu/backup/application/generic"},
							{name: "Benchmark.def",	type: "f", host: "xa8603", path: "/home/gliu/backup/application/generic"},
							{name: ".pulse",	type: "d", host: "xa8603", path: "/home/gliu/backup/application/generic"},

							//FLUENT
							//{name: "fluent-test.cas.gz",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/fluent"},
							//{name: "fluent-test.jou",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/fluent"},
							//{name: "fluent-test.txt",	type: "file", host: "pac-1.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/fluent"},
						];

						//var file = {name: "License.txt",type: "f", host: "xa8603.eng.platformlab.ibm.com", path: "/home/gliu/backup/application/generic"};
						var file = {name: ".pulse",	type: "d", host: "xa8603", path: "/home/gliu/backup/application/generic"};
						submissionsPanel.inputFileListPanel.add(file);
					}
				}, "addNewFilesBtn");
			};
		});
	</script>
</body>
</html>
