<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html >
<head>
	<c:import url="/dataexplore/includes/include-styles.jsp"/>
	<c:import url="/dataexplore/includes/include-dojo.jsp"/>
	<c:import url="/dataexplore/includes/include-scripts.jsp"/>
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
					value: context.host + ":" + context.path,
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
