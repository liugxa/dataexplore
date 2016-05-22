package com.platform.gui.dataexplore.model;

import java.util.Date;

public class InputFile{

	private int id;
	
	private String name;
	
	private String fullName;
	
	private String type;
	
	private String path;
	
	private Long size;
	
	private String sizeExp;
	
	private Date modifyTime;
	
	private String modifyTimeStr;
	
	private String owner;
	
	private String group;
	
	private String permission;
	
	private String absolutePath;
	
	private String escapeAbsolutePath;
	
	private String host;
	
	private boolean isFavorite;
	
	private boolean isInputFile;
	
	public InputFile() {}
	
	public InputFile(String str){
		if(str != null){
			//example: pac-1@/home/gliu/backup/sample.txt or pac-1:/home/gliu/backup/sample.txt
			int indexOf = str.indexOf("@");
			if(indexOf == -1) indexOf = str.indexOf(":");
			
			if(indexOf != -1){
				this.host = str.substring(0, indexOf);
				String s = str.substring(indexOf + 1);
				
				this.name = s;
				if(s.indexOf("/") != -1){
					this.path = s.substring(0, s.lastIndexOf("/"));
					this.name = s.substring(s.lastIndexOf("/") + 1);
				}
			} else {
				// No host name
				if (str.indexOf(",") != -1) {
					String [] strArray = str.split(",");
					if (strArray.length > 0) {
						this.path = strArray[0].substring(0, strArray[0].lastIndexOf("/"));
						this.name = strArray[0].substring(strArray[0].lastIndexOf("/") + 1);
					}
				}
			}
		}
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	
	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getPermission() {
		return permission;
	}

	public void setPermission(String permission) {
		this.permission = permission;
	}

	public String getAbsolutePath() {
		return absolutePath;
	}

	public void setAbsolutePath(String absolutePath) {
		this.absolutePath = absolutePath;
	}

	public String getModifyTimeStr() {
		return modifyTimeStr;
	}

	public void setModifyTimeStr(String modifyTimeStr) {
		this.modifyTimeStr = modifyTimeStr;
	}

	public String getEscapeAbsolutePath() {
		return escapeAbsolutePath;
	}

	public void setEscapeAbsolutePath(String escapeAbsolutePath) {
		this.escapeAbsolutePath = escapeAbsolutePath;
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

	public boolean isFavorite() {
		return isFavorite;
	}

	public void setFavorite(boolean isFavorite) {
		this.isFavorite = isFavorite;
	}

	public boolean isInputFile() {
		return isInputFile;
	}

	public void setInputFile(boolean isInputFile) {
		this.isInputFile = isInputFile;
	}

	public String getSizeExp() {
		return sizeExp;
	}

	public void setSizeExp(String sizeExp) {
		this.sizeExp = sizeExp;
	}
}
