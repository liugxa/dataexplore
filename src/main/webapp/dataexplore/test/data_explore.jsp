<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-actions.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme' style="background-color: white">
	<%@include file="/pac/dataexplore/includes/include-panels.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-submissions.jsp"%>

	<div id="dataExplorePanelContainer"></div>
	<style type="text/css">
		#dataExplorePanelContainer{
			width: 100%;
			height: 100%;
		}
	</style>

	<script>
		require([
			"paccommon/request",
			"dataexplore/DataExplorePanel",
			"dojo/domReady!"
		],
		function(request, DataExplorePanel){
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
				var dataExplorePanel = new DataExplorePanel("dataExplorePanelContainer", context);
				dataExplorePanel.startup();
			}
		});
	</script>
</body>
</html>
