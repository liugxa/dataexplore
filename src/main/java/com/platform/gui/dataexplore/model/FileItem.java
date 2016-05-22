package com.platform.gui.dataexplore.model;

import java.util.List;

public class FileItem{
	
	private String id;
	
	private String name;
	
	private Boolean hasItems;
	
	private List<FileItem> fileItems;
	
	public FileItem(){}
	
	public FileItem(String id, String name){
		this.id = id;
		this.name = name;
		this.hasItems = true;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getHasItems() {
		return hasItems;
	}

	public void setHasItems(Boolean hasItems) {
		this.hasItems = hasItems;
	}

	public List<FileItem> getFileItems() {
		return fileItems;
	}

	public void setFileItems(List<FileItem> fileItems) {
		this.fileItems = fileItems;
	}
}
