<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags"%>

<div data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'sidebar', gutters:true, liveSplitters:true" id="de_layoutContainer" class="de_layoutContainer" style="background-color: #f2f2f2;">

	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'top'" class="de_breadCrumb_pane" style="background-color: #f2f2f2;">
		<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" class="de_breadCrumb_layoutContainer">
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'left'" class="de_breadCrumb_title_pane" style="background-color: #f2f2f2;">
				<div id="de_breadCrumb_title" class="de_breadCrumb_title">
					<s:text name="pac.dataexplore.breadcrumb.title.data"/>
				</div>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'center'" class="de_breadCrumb_content_pane" style="background-color: #f2f2f2;">
				<div id="de_breadCrumb_container" class="de_breadCrumb_container"></div>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'right'" class="de_breadCrumb_search_pane" style="background-color: #f2f2f2;">
				<div id="de_search_container" class="de_search_container"></div>
			</div>	
		</div>
	</div>

	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'top'" id="de_dataActions_pane" class="de_dataActions_pane" style="background-color: #f2f2f2;">
		<div id="de_dataActions_container" class="de_dataActions_container"></div>
	</div>

	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:true,region:'center'" id="de_fileBrowsing_pane" class="de_fileBrowsing_pane" style="background-color: #f2f2f2;">
		<div data-dojo-type="dijit/layout/BorderContainer" data-dojo-props="design:'sidebar', gutters:true, liveSplitters:true">
			<div data-dojo-type="dijit/layout/ContentPane" class="de_tree_pan" data-dojo-props="splitter:true,region:'left'" style="width:20%;background-color: #f2f2f2;overflow:auto">
				<div id="de_favoriteTree_container" class="de_favoriteTree_container"></div>
				<div id="de_hostTree_container" class="de_hostTree_container"></div>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" class="de_fileTable_pane" data-dojo-props="splitter:true,region:'center'" style="background-color: white;">
				<div id="de_fileTable_container" class="de_fileTable_container" style="background-color:#f2f2f2"></div>
			</div>
		</div>
	</div>

	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:true,region:'bottom'" id="de_submissions_pane" class="de_submissions_pane" style="background-color: white;">
		<div id="de_summary_container" class="de_summary_container"></div>
		<div id="de_submissions_container" class="de_submissions_container"></div>
	</div>

</div>