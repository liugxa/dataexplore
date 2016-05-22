package com.platform.gui.dataexplore.action;

import com.platform.gui.dataexplore.model.DataExploreContext;

public class DataExploreAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private DataExploreContext context;
	
	public String doGetDataExploreContext() throws Exception{
 		context = new DataExploreContext();
 		context.setNameSpace("/dataexplore");
 		context.setContextPath(this.servletRequest.getContextPath());
 		context.setUrlContext(context.getContextPath() + context.getNameSpace());
 		return SUCCESS;
	}
	
	public DataExploreContext getContext() {
		return context;
	}
	public void setContext(DataExploreContext context) {
		this.context = context;
	}
}
