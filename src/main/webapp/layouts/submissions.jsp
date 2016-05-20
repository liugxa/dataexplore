<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags"%>

<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'" id="sp_layoutContainer" class="sp_layoutContainer">
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'left'" id="sp_inputFiles_layoutContainer" class="sp_inputFiles_layoutContainer" style="padding-left: 10px;padding-top: 10px;padding-right:10px;height:100%">
		<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'">
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top', layoutPriority:1" style="text-align:left;height:30px">
				<label id="sp_inputFiles_title" class="sp_inputFiles_title"><s:text name="pac.dataexplore.submitjobs.sp.title"/></label>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top', layoutPriority:2" style="text-align:left;">
				<image src="<c:url value='/pac/dataexplore/images/image_step_1.png'/>"/>
				<label id="sp_inputFiles_list_title" class="sp_inputFiles_list_title"><s:text name="pac.dataexplore.submitjobs.sp.inputfiles.title"/></label>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
				<div class="sp_inputFiles_list_container">
					<table id="sp_inputFiles_list" class="sp_inputFiles_list"></table>
				</div>
			</div>
		</div>
	</div>
	<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'" id="sp_submissionForms_layoutContainer" class="sp_submissionForms_layoutContainer" style="padding-left:10px;padding-top:10px;padding-right:10px;height:100%">
		<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'">
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top', layoutPriority:1" style="height: 30px">
				<div id="sp_message_div" class="sp_message_div" style="display:none">
					<table>
						<tr>
							<td><div id="sp_message_view_result"></div></td>
							<td>
								<div id="sp_message_view_output">
									<a id="sp_submissionForms_view_output" href="#">
										<s:text name="pac.dataexplore.submitjobs.sp.button.view.output.folder" />
									</a>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'top', layoutPriority:2" style="height:25px;overflow:hidden">
				<div data-dojo-type="dijit/layout/LayoutContainer" data-dojo-props="design:'sidebar'">
					<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'left'" style="width:400px">
						<image src="<c:url value='/pac/dataexplore/images/image_step_2.png'/>"/>
						<label id="sp_submissionForms_grid_title" class="sp_submissionForms_grid_title"><s:text name="pac.dataexplore.submitjobs.sp.grid.title"/></label>
					</div>
					<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'right'" style="width:100px">
						<label><a href="#" onclick="toViewMyJobs()"><s:text name="pac.dataexplore.submitjobs.sp.button.view.myjobs" /></a></label>
					</div>
				</div>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'center'">
				<div id="sp_submissionForms_grid_container" class="sp_submissionForms_grid_container" style="height:220px"></div>
			</div>
			<div data-dojo-type="dijit/layout/ContentPane" data-dojo-props="region:'bottom'">
				<label id="sp_submissionForms_view_label">
					<a id="sp_submissionForms_view_link" href="#"><s:text name="pac.dataexplore.submitjobs.sp.button.view.all.forms"/></a>
				</label>
			</div>
		</div>
	</div>
</div>