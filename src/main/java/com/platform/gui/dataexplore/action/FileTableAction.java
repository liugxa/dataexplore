package com.platform.gui.dataexplore.action;

import java.util.Collections;
import java.util.List;

import org.apache.commons.beanutils.BeanComparator;
import org.apache.commons.collections.comparators.ComparatorChain;

import com.platform.gui.dataexplore.model.FileItem;
import com.platform.gui.dataexplore.util.FileUtil;

public class FileTableAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private String host;
	
	private String path;
	
	private String fileName;
	
	private String sortBy;
	
	private List<FileItem> fileItems;
	
	/**
	 * Showing the include files page
	 * @return
	 * @throws Exception
	 */
	public String toFileTable() throws Exception{
		return SUCCESS;
	}
	
	/**
	 * Get the include files data.
	 * @return
	 * @throws Exception
	 */
	public String doGetTableFiles() throws Exception{
		fileItems = FileUtil.findItems(host, path);
		
		//by default, the table be sorted by the file name, and reverse is true
		Boolean reverse = false;
		String sortValue = "name";
		
		//reset the sort properties
		if(sortBy != null){
			sortValue = sortBy.substring(1);
			String reverValue = sortBy.substring(0, 1);
			if(reverValue.equals("-")) reverse = true;
		}
		
		this.sortTableFiles(fileItems, sortValue, reverse);
		
		//set the response header
		this.setResponseHeader(fileItems);
		return SUCCESS;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void sortTableFiles(List<FileItem> fileItems, String sortBy, Boolean reverse){
		ComparatorChain chain = new ComparatorChain();
		
		//sorted by file's type
		BeanComparator typeComparator = new BeanComparator("type");
		
		//sorted by "sortBy" value
		BeanComparator sortByComparator = new BeanComparator(sortBy);
		
		chain.addComparator(typeComparator, reverse);
		chain.addComparator(sortByComparator, reverse);
		
		//sorted the list
		Collections.sort(fileItems, chain);
	}
	
	/*
	 * set the response header
	 */
	private <T> void setResponseHeader(List<T> list){
		//set HTTP header for GridX!
		String contentRange = "items 0-" + list.size() + "/" + list.size(); 
		this.servletResponse.setHeader("Content-Range" , contentRange);
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

	public List<FileItem> getFileItems() {
		return fileItems;
	}

	public void setFileItems(List<FileItem> fileItems) {
		this.fileItems = fileItems;
	}
}
