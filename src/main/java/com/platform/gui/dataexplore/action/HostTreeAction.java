package com.platform.gui.dataexplore.action;

import java.util.LinkedList;
import java.util.List;

import com.platform.gui.dataexplore.model.FileItem;
import com.platform.gui.dataexplore.util.FileUtil;

public class HostTreeAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;

	private String id;
	
	private FileItem fileItem;
	
	private List<FileItem> fileItems;
	
	public String doGetHostRoot() throws Exception{
		fileItem = new FileItem("hosts", "Hosts");
		return SUCCESS;
	}
	
	public String doGetHostFiles() throws Exception{
		fileItems = new LinkedList<FileItem>();
		if(id != null && id.equalsIgnoreCase("hosts")){
			//get the hosts list
			fileItems = FileUtil.getHosts();
		}else{
			//get the files for special host
			String host = id.substring(0, id.indexOf(":"));
			String path = id.substring(id.indexOf(":") + 1);
			fileItems = FileUtil.findItems(host, path);
		}
		return SUCCESS;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public FileItem getFileItem() {
		return fileItem;
	}

	public void setFileItem(FileItem fileItem) {
		this.fileItem = fileItem;
	}

	public List<FileItem> getFileItems() {
		return fileItems;
	}

	public void setFileItems(List<FileItem> fileItems) {
		this.fileItems = fileItems;
	}
}
