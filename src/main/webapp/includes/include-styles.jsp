<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- Use claro theme -->
<link rel="stylesheet" href="<c:url value='/scripts/dojokit/dijit/themes/claro/claro.css'/>" media="screen">
<link rel="stylesheet" href="<c:url value='/scripts/dojokit/dijit/themes/claro/document.css'/>" media="screen">

<!-- Import the main CSS file of Gridx -->
<link rel="stylesheet" href="<c:url value='/scripts/dojokit/gridx/resources/claro/Gridx.css'/>" media="screen">

<!-- Import dnd cass for drag drog -->
<link rel="stylesheet" href="<c:url value='/scripts/dojokit/dojo/resources/dnd.css'/>" media="screen">

<!-- <link rel="stylesheet" href="<c:url value='/pac/dataexplore/css/file_type.css'/>" media="screen"> -->
<link rel="stylesheet" href="<c:url value='/pac/dataexplore/css/include-styles.css'/>" media="screen">

<style type="text/css">
/* the common Gridx style */
.includeIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_include.png'/>);
	background-repeat: no-repeat;
	width: 14px;
	height: 14px;
	text-align: center;
}
.infoIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_info.png'/>);
	background-repeat: no-repeat;
	width: 14px;
	height: 14px;
	text-align: center;
}
.deleteIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_delete.png'/>);
	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	text-align: center;
}
.fileIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_file.png'/>);
	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	text-align: center;
}
.folderIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_folder.png'/>);
	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	text-align: center;
}
.hostIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_host.png'/>);
	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	text-align: center;
}
.favoriteIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_icons.png'/>);
	background-position: left -44px;
	background-repeat: no-repeat;
	width: 16px;
	height: 22px;
	text-align: center;
}
.favoriteSolidIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_icons.png'/>);
	background-position: left -44px;
	background-repeat: no-repeat;
	width: 16px;
	height: 22px;
	text-align: center;
}
.favoriteHollowIcon {
	background-image:  url(<c:url value='/pac/dataexplore/images/image_icons.png'/>);
	background-position: left -22px;
	background-repeat: no-repeat;
	width: 16px;
	height: 22px;
	text-align: center;
}
.searchIcon{
	background-image: url(<c:url value='/pac/dataexplore/images/image_icons.png'/>);
	background-position: left -110px;
	background-repeat: no-repeat;
	width: 16px;
	height: 22px;
	text-align: center;
}
.breadcrumbInputIcon{
	background-image: url(<c:url value='/pac/dataexplore/images/image_icons.png'/>);
	background-position: left -66px;
	background-repeat: no-repeat;
	width: 16px;
	height: 22px;
	text-align: center;
}
.breadcrumbUpIcon{
	background-image: url(<c:url value='/pac/dataexplore/images/image_icons.png'/>);
	background-position: left -88px;
	background-repeat: no-repeat;
	width: 16px;
	height: 22px;
	text-align: center;
}
.claro .breadCrumbDropDownIcon{
	background-image: url(<c:url value='/pac/dataexplore/images/collapsedPath.png'/>);
	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	text-align: center;
}
.claro .breadCrumbSeparator{ 
	background-image:  url(<c:url value='/pac/dataexplore/images/image_breadcrumb_separator.png'/>);
	background-repeat: no-repeat;
	width: 15px;
	height: 15px;
	text-align: center;
}
.claro .dijitButtonNode{
	transition-duration: 0.3s;
	transition-property: background-color;
	border-width:0;
}
</style>
