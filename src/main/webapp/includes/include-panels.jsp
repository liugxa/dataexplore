<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- Dialog for Copy -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_copyTo" title="<s:text name='pac.dataexplore.dialog.title.copyto'/>" id="de_dialog_copyTo" class="de_dialog_copyTo" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<div id="de_dialog_copyTo_tree" class="de_dialog_copyTo_tree" style="overflow:auto"></div>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_copyTo_okBtn">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_copyTo_cancelBtn" data-dojo-props="onClick:function(){de_dialog_copyTo.hide();}">
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->

<!-- Dialog for Move -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_moveTo" title="<s:text name='pac.dataexplore.dialog.title.moveto'/>" id="de_dialog_moveTo" class="de_dialog_moveTo" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<div id="de_dialog_moveTo_tree" class="de_dialog_moveTo_tree"></div>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_moveTo_okBtn">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_moveTo_cancelBtn" data-dojo-props="onClick:function(){de_dialog_moveTo.hide();}">
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->


<!-- Dialog for Copy from -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_copyFrom" title="<s:text name='pac.dataexplore.dialog.title.copyfrom'/>" id="de_dialog_copyFrom" class="de_dialog_copyFrom" style="display:none;background-color: #f2f2f2;">

	<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar', gutters:true, liveSplitters:true" class="de_dialog_copyFrom_layoutContainer" style="background-color: #f2f2f2;">		
		<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'top'" class="de_dialog_copyFrom_bcbreadCrumb_pane" style="background-color: #f2f2f2;">
			<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" class="de_dialog_copyFrom_bcbreadCrumb_layoutContainer">
				<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'left'" class="de_dialog_copyFrom_bcbreadCrumb_title_pane" style="background-color: #f2f2f2;">
					<div class="de_dialog_copyFrom_title">
						<s:text name="pac.dataexplore.breadcrumb.title.data"/>
					</div>
				</div>
				<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'center'" class="de_dialog_copyFrom_bcbreadCrumb_content_pane" style="background-color: #f2f2f2;">
					<div id="de_dialog_copyFrom_breadCrumb" class="de_dialog_copyFrom_breadCrumb"></div>
				</div>
				<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:false,region:'right'" class="de_dialog_copyFrom_bcbreadCrumb_search_pane" style="background-color: #f2f2f2;">
					<div id="de_dialog_copyFrom_search" class="de_dialog_copyFrom_search"></div>
				</div>	
			</div>
		</div>
		
		<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="splitter:true,region:'center'" class="de_dialog_copyFrom_fileBrowsing_pane" style="background-color: #f2f2f2;">
			<div data-dojo-type="dijit/layout/LayoutContainer" class="de_dialog_copyFrom_fileBrowsing_layoutContainer" data-dojo-props="design:'sidebar', gutters:true, liveSplitters:true">
				<div data-dojo-type="dijit/layout/ContentPane" class="de_dialog_copyFrom_fileBrowsing_tree_pane" data-dojo-props="splitter:false,region:'left'" style="overflow:hidden">
					<div id="de_dialog_copyFrom_tree" class="de_dialog_copyFrom_tree" ></div>
				</div>
				<div data-dojo-type="dijit/layout/ContentPane" class="de_dialog_copyFrom_fileBrowsing_grid_pane" data-dojo-props="splitter:false,region:'center'" style="overflow:hidden">
					<div id="de_dialog_copyFrom_grid" class="de_dialog_copyFrom_grid" style="background-color:#f2f2f2;overflow:auto;"></div>
				</div>
			</div>
		</div>
	
		<div data-dojo-type="dijit/layout/ContentPane" class="de_dialog_copyFrom_btn_pane" data-dojo-props="splitter:false,region:'bottom'" style="background-color:f2f2f2;">
			<div style="width:100%;float:right;text-align: right;">
				<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_copyFrom_okBtn">
					 <s:text name="pac.dataexplore.buttons.ok"/>
				</button>
				<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_copyFrom_cancelBtn" data-dojo-props="onClick:function(){de_dialog_copyFrom.hide();}">
					<s:text name="pac.dataexplore.buttons.cancel"/>
				</button>
			</div>
		</div>
    </div>
</div>
    
    
<!-- dialog end -->

<!-- Dialog for New_Folder -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_newFolder" title="<s:text name='pac.dataexplore.dialog.title.newfolder'/>" id="de_dialog_newFolder" class="de_dialog_newFolder" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<table>
			<tr>
				<td align="right"><s:text name="pac.dataexplore.dialog.title.newfolder"/></td>
				<td style="10px;"></td>
				<td><input type="text" name="de_dialog_newFolder_dirName" id="de_dialog_newFolder_dirName" required="true" data-dojo-type="dijit/form/ValidationTextBox"/></td>
			</tr>
		</table>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_newFolder_okBtn">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_newFolder_cancelBtn" data-dojo-props="onClick:function(){de_dialog_newFolder.hide();}">
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->


<!-- Dialog for Delete -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_delete" title="<s:text name='pac.dataexplore.dialog.title.delete'/>" id="de_dialog_delete" class="de_dialog_delete" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<s:text name="pac.dataexplore.dialog.delete.message"/>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_delete_okBtn">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_delete_cancelBtn" data-dojo-props="onClick:function(){de_dialog_delete.hide();}">
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->

<!-- Dialog for Rename -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_rename" title="<s:text name='pac.dataexplore.dialog.title.rename'/>" id="de_dialog_rename" class="de_dialog_rename" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<table>
			<tr>
				<td align="right"><s:text name="pac.dataexplore.dialog.rename.old.name"/></td>
				<td style="10px;"></td>
				<td><label id="de_dialog_rename_fileName_label"></label></td>
			</tr>
			<tr colspan="3"></tr>
			<tr>
				<td align="right"><s:text name="pac.dataexplore.dialog.rename.new.name"/></td>
				<td style="10px;"></td>
				<td><input type="text" name="de_dialog_rename_input" id="de_dialog_rename_input" required="true" data-dojo-type="dijit/form/ValidationTextBox"/></td>
			</tr>
		</table>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_rename_okBtn">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_rename_cancelBtn" data-dojo-props="onClick:function(){de_dialog_rename.hide();}">
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->

<!-- Dialog for Properties -->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_properties" title="<s:text name='pac.dataexplore.dialog.title.properties'/>" id="de_dialog_properties" class="de_dialog_properties" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<table class="de_dialog_properties_table" style="width:85%;">
			<tbody>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_fileName_label">
							<s:text name="pac.dataexplore.dialog.properties.filename"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_fileName_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_fileSize_label">
							<s:text name="pac.dataexplore.dialog.properties.filesize"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_fileSize_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_fileType_label">
							<s:text name="pac.dataexplore.dialog.properties.filetype"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_fileType_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_location_label">
							<s:text name="pac.dataexplore.dialog.properties.location"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_location_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_owner_label">
							<s:text name="pac.dataexplore.dialog.properties.owner"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_owner_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_userGroup_label">
							<s:text name="pac.dataexplore.dialog.properties.usergroup"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_userGroup_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_permissions_label">
							<s:text name="pac.dataexplore.dialog.properties.permission"/>
						</div>
					</th>
					<td>
						<div id="de_dialog_properties_permissions_value" style="font-weight:bold;"></div>
					</td>
				</tr>
				<tr>
					<td align="right">
						<div id="de_dialog_properties_date_label">
							<s:text name="pac.dataexplore.dialog.properties.datamodified"/>
						</div>
					</td>
					<td>
						<div id="de_dialog_properties_date_value" style="font-weight:bold;"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="dijitDialogPaneActionBar">	
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_properties_okBtn" data-dojo-props="onClick:function(){de_dialog_properties.hide();}">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
	</div>
</div>


<!-- Dialog for Compress-->
<!-- dialog start -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="de_dialog_compress" title="<s:text name='pac.dataexplore.dialog.title.compress'/>" id="de_dialog_compress" class="de_dialog_compress" data-dojo-props="closable:true" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<table>
			<tr id="de_dialog_compress_tr">
				<td align="right"><s:text name="pac.dataexplore.dialog.compress.archive.name"/></td>
				<td style="10px;"></td>
				<td><input type="text" name="de_dialog_compress_input" id="de_dialog_compress_input" required="true" data-dojo-type="dijit/form/ValidationTextBox"/></td>
			</tr>
			<tr>
				<td align="right"><s:text name="pac.dataexplore.dialog.compress.archive.format"/></td>
				<td style="10px;"></td>
				<td>
					<select name="de_dialog_compress_select" id="de_dialog_compress_select" data-dojo-id="de_dialog_compress_select" data-dojo-type="dijit/form/Select">
						<option value="tar.gz" selected="selected">tar.gz</option>
						<option value="tar.bz2">tar.bz2</option>
						<option value="zip">zip</option>
						<option value="gzip">gzip</option>
					</select>
				</td>
			</tr>
		</table>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_compress_okBtn">
			<s:text name="pac.dataexplore.buttons.ok"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="de_dialog_compress_cancelBtn" data-dojo-props="onClick:function(){de_dialog_compress.hide();}">
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->

<!-- Form for Download-->
<!-- form start -->
<form action="/platform/job/dataDownloadAction.action" method="post" id='downloadActionForm' style="display:none">
	<jsp:include page="/framework/plugin/plugin_csrfToken.jsp" />
	<input type="text" name="hostName" id="downloadActionForm_hostName"/>
	<input type="text" name="filePath" id="downloadActionForm_filePath"/>
</form>
<!-- form end -->

<!-- Form for Upload-->
<!-- form start -->
<form id="form1" enctype="multipart/form-data" method="post" action="" style="display:none"  style="display:none">
	<input type="file" name="fileName" id="fileName" multiple/>
</form>

<!-- Dialog for uploadfile in IE(8|9)-->
<div data-dojo-type="dijit/Dialog" data-dojo-id="dialogUpload4IE" id="dialogUpload4IE" class=" dialogUpload4IE" style="width:300px;height:260px;display:none" title="<s:text name='pac.dataexplore.dialog.title.upload'/>">
	<div class="dijitDialogPaneContentArea">
		<iframe id="uploadFilesTarget" name="uploadFilesTarget" style="display:none"></iframe>
		<form method="post" action="./upload-file4IE" id="upload4IEForm" enctype="multipart/form-data" style="height:180px;" target="uploadFilesTarget">
			<input type="hidden" name="destination" id="destination"/>
			<input name="files[0]" type="file" id="firstFile">
			<div id="uploadFiles"></div>
		</form>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="dialogUpload4IE_submit">
			<s:text name="pac.dataexplore.buttons.submit"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="dialogUpload4IE_cancel" data-dojo-props="onClick:function(){dialogUpload4IE.hide();}" >
			<s:text name="pac.dataexplore.buttons.cancel"/>
		</button>
	</div>
</div>
<!-- dialog end -->

<!-- upload dialog -->
<div data-dojo-type="dijit/Dialog" data-dojo-id="uploadFileProgressDialog" id="uploadFileProgressDialog" class="uploadFileProgressDialog" data-dojo-props="closable:false,title:'Upload Progress'" >
	<div data-dojo-type="dijit/layout/ContentPane" id="progressHolder"></div>
</div>
<!-- form end -->


<div data-dojo-type="dijit/Dialog" data-dojo-id="fd_formList_dialog" title="<s:text name='pac.dataexplore.dialog.title.viewallform'/>" id="fd_formList_dialog" class="fd_formList_dialog" style="display:none">
	<div class="dijitDialogPaneContentArea">
		<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" id="fd_formList_layoutContainer" class="fd_formList_layoutContainer">
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top'">
				<label id="fd_formList_search_label" class="fd_formList_search_label">
					<s:text name="pac.dataexplore.submitjobs.sf.title.search"/>
				</label>
				
				<input type="text" id="fd_formList_search_input" class="fd_formList_search_input" name="searchInput" value=""
					data-dojo-type="dijit/form/TextBox" data-dojo-props="trim:true"/>
				
				<button data-dojo-type="dijit/form/Button" type="button" id="fd_formList_search_btn">
					<s:text name="pac.dataexplore.submitjobs.sf.button.search"/>
				</button>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'" id="fd_formList_grid_layoutContainer" style="padding-left:10px;padding-top: 10px;padding-right:10px;overflow:hidden;width:30%">
				<div id="fd_formList_grid_container" class="fd_formList_grid_container"></div>
			</div>
		</div>
	</div>
	<div class="dijitDialogPaneActionBar">
		<button data-dojo-type="dijit/form/Button" type="button" id="fd_formList_ok_btn">
			<s:text	name="pac.dataexplore.submitjobs.sf.button.open"/>
		</button>
		<button data-dojo-type="dijit/form/Button" type="button" id="fd_formList_cancel_btn" data-dojo-props="onClick:function(){fd_formList_dialog.hide();}">
			<s:text name="pac.dataexplore.submitjobs.sf.button.cancel"/>
		</button>
	</div>
</div>