package com.platform.gui.dataexplore.action;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import com.platform.gui.dataexplore.model.FileItem;

public class FavoriteTreeAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;

	private String favorite;
	
	private FileItem fileItem;
	
	private List<FileItem> fileItems;
	
	public String doGetFavoriteRoot() throws Exception{
		fileItem = new FileItem("favorites", "Favorites");
		return SUCCESS;
	}
	
	public String doGetFavorites() throws Exception{
		return SUCCESS;
	}
	
	public String doAddFavorite() throws Exception{
		return NONE;
	}
	public String doRemoveFavorite() throws Exception{
		return NONE;
	}
	public List<FileItem> getFavorites(Properties properties) throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		
		if(properties != null){
			Set<String> keySet = properties.stringPropertyNames();
			Iterator<String> iterator = keySet.iterator();
			while(iterator.hasNext()){
				String key = iterator.next();
				String value = properties.getProperty(key);
				
				FileItem item = new FileItem(key, value);
				item.setHasItems(false);
				
				r.add(item);
			}
		}
		return r;
	}

	public String getFavorite() {
		return favorite;
	}

	public void setFavorite(String favorite) {
		this.favorite = favorite;
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
