<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags"%>
<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" id="fd_formList_layoutContainer" class="fd_formList_layoutContainer">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top'" align="right">
		<label id="fd_formList_search_label" class="fd_formList_search_label"><s:text name="pac.dataexplore.submitjobs.sf.title.search"/></label>
		<input type="text" id="fd_formList_search_input" class="fd_formList_search_input" name="searchInput" value=""
			data-dojo-type="dijit/form/TextBox"
			data-dojo-props="trim:true"/>
		<button id="fd_formList_search_btn" class="fd_formList_search_btn" type="button"><s:text name="pac.dataexplore.submitjobs.sf.button.search"/></button>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'" id="fd_formList_grid_layoutContainer">
		<div id="fd_formList_grid_container" class="fd_formList_grid_container"></div>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'bottom'" id="fd_formList_button_container">
		<button id="fd_formList_ok_btn" class="fd_formList_ok_btn" type="button"><s:text	name="pac.dataexplore.submitjobs.sf.button.open"/></button>
		<button id="fd_formList_cancel_btn" class="fd_formList_cancel_btn" type="button"><s:text name="pac.dataexplore.submitjobs.sf.button.cancel"/></button>
	</div>
</div>