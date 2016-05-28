<!-- Form for Upload-->
<!-- form start -->
<form id="form1" enctype="multipart/form-data" method="post" action="" style="display:none">
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