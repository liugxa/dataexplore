package com.platform.gui.dataexplore.action;

import java.util.List;

import com.platform.gui.dataexplore.model.InputFile;

public class IncludeFilesAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private String host;
	
	private String path;
	
	private String fileName;
	
	private String sortBy;
	
	private List<InputFile> includeFiles;
	
	/**
	 * Showing the include files page
	 * @return
	 * @throws Exception
	 */
	public String toIncludeFiles() throws Exception{
		return SUCCESS;
	}
	
	/**
	 * Get the include files data.
	 * @return
	 * @throws Exception
	 */
	//TODO, transfer the InputFile object!
	public String doGetIncludeFiles() throws Exception{
		return SUCCESS;
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

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public List<InputFile> getIncludeFiles() {
		return includeFiles;
	}

	public void setIncludeFiles(List<InputFile> includeFiles) {
		this.includeFiles = includeFiles;
	}
}
