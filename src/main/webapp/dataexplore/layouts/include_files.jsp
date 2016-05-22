<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags"%>

<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" id="if_includeFiles_layoutContainer" class="if_includeFiles_layoutContainer">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
		<label id="if_includeFiles_grid_title" class="if_includeFiles_grid_title" for="gridContainerX"><s:text name="pac.dataexplore.submitjobs.if.grid.title"/></label>
		<div id="if_includeFiles_grid_container" class="if_includeFiles_grid_container"></div>
	</div>
</div>