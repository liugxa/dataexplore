package com.platform.gui.dataexplore.action;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.json.JSONObject;

import com.platform.gui.dataexplore.model.FileItem;
import com.platform.gui.dataexplore.util.FileUtil;

public class FileListAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private FileItem fileItem;
	
	private List<FileItem> fileItems;
	
	public String doGetFileList() throws Exception{
		Properties properties = this.getFileListProperties();
		fileItems = this.getFileList(properties);
		return SUCCESS;
	}
	
	public String doAddFileItem() throws Exception{
		Properties properties = this.getFileListProperties();
		fileItem.setId(fileItem.getHost() + ":" + fileItem.getLocation());
		properties.put(fileItem.getId(), this.toJSONObject(fileItem));
		return NONE;
	}
	
	public String doRemoveFileItem() throws Exception{
		Properties properties = this.getFileListProperties();
		fileItem.setId(fileItem.getHost() + ":" + fileItem.getLocation());
		properties.remove(fileItem.getId());
		return NONE;
	}
	
	public String toIncludeFiles() throws Exception{
		return SUCCESS;
	}
	
	public String doGetIncludeFiles() throws Exception{
		if(fileItem != null) fileItems = FileUtil.findItems(fileItem.getHost(), fileItem.getPath());
		return SUCCESS;
	}
	
	private Properties getFileListProperties(){
		Object obj = this.session.getAttribute("filelist.properties");
		if(obj == null) {
			obj = new Properties();
			this.session.setAttribute("filelist.properties", obj);
		}
		return (Properties)obj;
	}
	
	private List<FileItem> getFileList(Properties properties) throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		
		if(properties != null){
			Set<String> keySet = properties.stringPropertyNames();
			Iterator<String> iterator = keySet.iterator();
			while(iterator.hasNext()){
				String key = iterator.next();
				String value = properties.getProperty(key);
				
				FileItem item = this.toFileItem(value);
				r.add(item);
			}
		}
		return r;
	}
	
	private FileItem toFileItem(String value) throws Exception{
		FileItem r = new FileItem();
		JSONObject object = new JSONObject(value);
		
		Object id = object.get("id");
		if(id != null) r.setId(id.toString());
		
		Object type = object.get("type");
		if(type != null) r.setType(type.toString());
		
		Object host = object.get("host");
		if(host != null) r.setHost(host.toString());
		
		Object path = object.get("path");
		if(path != null) r.setPath(path.toString());
		
		Object name = object.get("name");
		if(name != null) r.setName(name.toString());
		
		Object location = object.get("location");
		if(location != null) r.setLocation(location.toString());
		
		return r;
	}
	
	private JSONObject toJSONObject(FileItem fileItem) throws Exception{
		JSONObject object = new JSONObject();
		object.put("id", fileItem.getId());
		object.put("type", fileItem.getType());
		object.put("host", fileItem.getHost());
		object.put("path", fileItem.getPath());
		object.put("name", fileItem.getName());
		object.put("location", fileItem.getLocation());
		return object;
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
