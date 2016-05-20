<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>

	<button id="refreshFormTablePanelBtn" type="button">Refresh form table</button>
	<button id="isShowBtn" type="button">Show/Hidden</button>
	
	<div id="formTablePanelContainer"></div>

	<style type="text/css">
		#formTablePanelContainer{
			width: 900px;
			height: 300px;
			overflow: auto;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dataexplore/FormTablePanel",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/domReady!"
		],
		function(Button, FormTablePanel, dom, topic, request){
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
				var formTablePanel = new FormTablePanel("formTablePanelContainer", context);
				formTablePanel.startup();
				
				var refreshFormTablePanelBtn = new Button({
					onClick: function(){
						formTablePanel.refresh();
					}
				}, "refreshFormTablePanelBtn");
				
				var isShowBtn = new Button({
					onClick: function(){
						//console.log("formTablePanel.isShow():" + formTablePanel.isShow());
						if(formTablePanel.isShow() == true){
							formTablePanel.hidden();
						}else{
							formTablePanel.show();
						}
					}
				}, "isShowBtn");

				topic.subscribe(formTablePanel.getEventPrefix() + "@event.item.click", function (item){
					console.log("get the event.item.click event!");
					console.log(item);
				});

				topic.subscribe(formTablePanel.getEventPrefix() + "@event.item.mark.submit", function (item){
					console.log("get the event.item.mark.submit event!");
					console.log(item);
				});
			};
		});
	</script>
</body>
</html>
