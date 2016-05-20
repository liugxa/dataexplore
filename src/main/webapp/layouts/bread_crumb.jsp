<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags"%>

<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" id="bc_layoutContainer" class="bc_layoutContainer">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'left'" id="bc_title_layoutContainer" class="bc_title_layoutContainer" style="background-color: #f2f2f2;">
		<div id="bc_title_container" class="bc_title_container">
			<s:text name="pac.dataexplore.breadcrumb.title.data"/>
		</div>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'center'" id="bc_toolbar_layoutContainer" class="bc_toolbar_layoutContainer" style="background-color: #f2f2f2;">
		<div id="bc_toolbar_container" class="bc_toolbar_container"></div>
		<div id="bc_textbox_container" class="bc_textbox_container"></div>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'right'" id="bc_search_layoutContainer" class="bc_search_layoutContainer" style="background-color: #f2f2f2;">
		<div id="bc_search_container" class="bc_search_container">
			<input type="text" id="bc_search_input" class="bc_search_input" name="searchInput" value=""
			data-dojo-type="dijit/form/TextBox" data-dojo-props="trim:true,placeHolder:'<s:text name='pac.dataexplore.submitjobs.sf.button.search'/>'"/>
			<button data-dojo-type="dijit/form/Button" id="bc_search_btn" type="button" data-dojo-props="baseClass:'',iconClass:'searchIcon'"/>
		</div>
	</div>	
</div>