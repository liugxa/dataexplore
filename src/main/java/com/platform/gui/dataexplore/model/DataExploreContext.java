package com.platform.gui.dataexplore.model;

public class DataExploreContext {
	
	//static properties
	private String userName;
	
	private String hostName;
	
	private String contextPath;
	
	private String nameSpace;
	
	private String urlContext;
	
	private String spoolerPath;
	
	//dynamic parameters
	private String splitterExpand;
	
	private String host;
	
	private String path;
	
	private String copyFromHost;
	
	private String copyFromPath;
	
	public DataExploreContext(){}
	
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getHostName() {
		return hostName;
	}

	public void setHostName(String hostName) {
		this.hostName = hostName;
	}

	public String getContextPath() {
		return contextPath;
	}

	public void setContextPath(String contextPath) {
		this.contextPath = contextPath;
	}

	public String getSpoolerPath() {
		return spoolerPath;
	}

	public void setSpoolerPath(String spoolerPath) {
		this.spoolerPath = spoolerPath;
	}
	
	public String getSplitterExpand() {
		return splitterExpand;
	}

	public void setSplitterExpand(String splitterExpand) {
		this.splitterExpand = splitterExpand;
	}

	public String getNameSpace() {
		return nameSpace;
	}

	public void setNameSpace(String nameSpace) {
		this.nameSpace = nameSpace;
	}

	public String getUrlContext() {
		return urlContext;
	}

	public void setUrlContext(String urlContext) {
		this.urlContext = urlContext;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getCopyFromHost() {
		return copyFromHost;
	}

	public void setCopyFromHost(String copyFromHost) {
		this.copyFromHost = copyFromHost;
	}

	public String getCopyFromPath() {
		return copyFromPath;
	}

	public void setCopyFromPath(String copyFromPath) {
		this.copyFromPath = copyFromPath;
	}
}
