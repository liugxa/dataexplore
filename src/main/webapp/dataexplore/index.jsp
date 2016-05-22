<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme' style="background-color: white">
	<%@include file="/pac/dataexplore/includes/include-panels.jsp"%>
	
	<div id="dataExplorePanelContainer"></div>
	<style type="text/css">
		#dataExplorePanelContainer{
			width: 100%;
			height: 100%;
		}
        #de_dialog_copyFrom_content{
            width: 100%;
			height: 100%;
        }
        #inner_cf_borderContainer{
            width: 100%;
			height: 100%;            
        }
	</style>
	<script>
		var urlContext = "<c:url value='/pac/dataexplore'/>";

		require([
			"paccommon/request",
			"dataexplore/DataExplorePanel",
			"dojo/domReady!"
		],
		function(request, DataExplorePanel){
			request.get(urlContext + "/doGetDataExploreContext.action?rnd=" + (new Date()).getTime(),{
				handleAs: "json",
			}).then(function(data){
				var dataExplorePanel = new DataExplorePanel("dataExplorePanelContainer", data);
				dataExplorePanel.startup();
			}, function(err){
				// handle an error condition
			}, function(evt){
				// handle a progress event
			});
		});
		window.parent.document.getElementById("mainContentArea").style.backgroundColor="#f2f2f2";
	</script>
</body>
</html>
