package com.platform.gui.dataexplore.action;

import java.net.InetAddress;

import com.platform.gui.dataexplore.model.DataExploreContext;

public class DataExploreAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private DataExploreContext context;
	
	public String doGetDataExploreContext() throws Exception{
 		context = new DataExploreContext();
 		context.setUserName(System.getProperty("user.name"));
 		
 		context.setHost(InetAddress.getLocalHost().getHostName());
 		context.setPath(System.getProperty("user.home"));
 		
 		context.setUserHost(InetAddress.getLocalHost().getHostName());
 		context.setUserPath(System.getProperty("user.dir"));
 		
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
