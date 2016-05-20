<!DOCTYPE html>
<html >
<head>
	<%@include file="/pac/dataexplore/includes/include-styles.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-dojo-scripts.jsp"%>
	<%@include file="/pac/dataexplore/includes/include-scripts.jsp"%>
	<%@include file="/framework/messages.jsp" %>
</head>

<body class='claro myTheme'>

	<button id="reloadFavoriteTreePanelBtn" type="button">Reload favorite tree</button>
	<div id="favoriteTreePanelContainer"></div>

	<input id="favoriteTextBox" />
	<button id="addFavoriteBtn" type="button">Add favorite</button>
	<button id="delFavoriteBtn" type="button">Delete favorite</button>

	<style type="text/css">
		#favoriteTreePanelContainer{
			width: 300px;
			height: 200px;
			overflow: auto;
		}
	</style>

	<script>
		require([
			"dijit/form/Button",
			"dijit/form/TextBox",
			"dataexplore/FavoriteTreePanel",
			"dijit/registry",
			"dojo/dom",
			"dojo/topic",
			"paccommon/request",
			"dojo/domReady!"
		],
		function(Button, TextBox, FavoriteTreePanel, registry, dom, topic, request){
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
				var favoriteTreePanel = new FavoriteTreePanel("favoriteTreePanelContainer", context);
				favoriteTreePanel.startup();
				
				//test favorite tree panel
				var reloadFavoriteTreePanelBtn = new Button({
					onClick: function(){
						favoriteTreePanel.reload();
					}
				}, "reloadFavoriteTreePanelBtn");

				var favoriteTextBox = new TextBox({
					name: "favoriteName",
					value: "xa8603:/home/gliu/build",
					placeHolder: "type in your favorite"
				}, "favoriteTextBox");

				var addFavoriteBtn = new Button({
					onClick: function(){
						favoriteTreePanel.add(favoriteTextBox.value);
						favoriteTreePanel.reload();
					}
				}, "addFavoriteBtn");

				var delFavoriteBtn = new Button({
					onClick: function(){
						favoriteTreePanel.remove(favoriteTextBox.value);
						favoriteTreePanel.reload();
					}
				}, "delFavoriteBtn");
				
				topic.subscribe(favoriteTreePanel.getEventPrefix() + "@event.item.click", function (item){
					console.log("get the favorite tree item click event!");
					console.log(item);
				});
			};
		});
	</script>
</body>
</html>
