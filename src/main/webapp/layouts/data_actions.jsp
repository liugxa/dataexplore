<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags"%>

<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar', gutters:true, liveSplitters:true" id="da_layoutContainer" class="da_layoutContainer">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'top'" id="da_buttons_layoutContainer" class="da_buttons_layoutContainer">
		<button data-dojo-type="dijit/form/Button" id="da_tailBtn" type="button" disabled>
			<s:text name="pac.dataexplore.dataactions.buttons.tail"/>
		</button>
		<button data-dojo-type="dijit/form/Button" id="da_editBtn" type="button" disabled>
			<s:text name="pac.dataexplore.dataactions.buttons.edit"/>
		</button>
		<button data-dojo-type="dijit/form/Button" id="da_downloadBtn" type="button" disabled>
			<s:text name="pac.dataexplore.dataactions.buttons.download"/>
		</button>
		<button data-dojo-type="dijit/form/Button" id="da_copyToBtn" type="button" disabled>
			<s:text name="pac.dataexplore.dataactions.buttons.copyto"/>
		</button>
		<button data-dojo-type="dijit/form/Button" id="da_moveToBtn" type="button" disabled>
			<s:text name="pac.dataexplore.dataactions.buttons.moveto"/>
		</button>
		<div data-dojo-type="dijit/form/DropDownButton" id="da_moreActionsBtn" label="<s:text name='pac.dataexplore.dataactions.buttons.moreactions'/>">
			<div data-dojo-type="dijit/Menu" id="da_moreActionsMenu">
				<div data-dojo-type="dijit/MenuItem" id="da_newFolderMenuItem" label="<s:text name='pac.dataexplore.dataactions.buttons.newfolder'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_deleteMenuItem" disabled label="<s:text name='pac.dataexplore.dataactions.buttons.delete'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_renameMenuItem" disabled label="<s:text name='pac.dataexplore.dataactions.buttons.rename'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_propertiesMenuItem" disabled label="<s:text name='pac.dataexplore.dataactions.buttons.properties'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_copyFromMenuItem" label="<s:text name='pac.dataexplore.dataactions.buttons.copyfrom'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_uploadMenuItem" label="<s:text name='pac.dataexplore.dataactions.buttons.upload'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_compressMenuItem" disabled label="<s:text name='pac.dataexplore.dataactions.buttons.compress'/>"></div>
				<div data-dojo-type="dijit/MenuItem" id="da_unCompressMenuItem" disabled label="<s:text name='pac.dataexplore.dataactions.buttons.uncompress'/>"></div>
			</div>
		</div>
		<span id="dropDownButtonContainer"></span>
	</div>
</div>