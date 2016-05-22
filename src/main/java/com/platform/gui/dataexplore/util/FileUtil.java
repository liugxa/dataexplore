package com.platform.gui.dataexplore.util;

import java.io.File;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.platform.gui.dataexplore.model.FileItem;

public class FileUtil {
	
	public static Map<String, String> systemMap = getSystemProperties();
	
	public static List<FileItem> findItems(String host, String path) throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		
		File file = new File(path);
		File[] subFiles = file.listFiles();
		for(int i=0;i<subFiles.length;i++){
			File f = subFiles[i];
			FileItem item = new FileItem();
			
			item.setName(f.getName());
			item.setId(host + ":" + f.getAbsolutePath());
			
			item.setHasItems(false);
			if(f.isDirectory()) item.setHasItems(true);
			
			r.add(item);
		}
		return r;
	}
	
	public static List<FileItem> getHosts() throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		
		FileItem item = new FileItem();
		item.setName(getHostName());
		item.setId(getHostName() + ":" + "c:\\");
		item.setHasItems(true);
		r.add(item);
		
		return r;
	}
	
	public static String getHostName() throws Exception{
		return InetAddress.getLocalHost().getHostName();
	}
	
	public static Map<String, String> getSystemProperties(){
		Map<String, String> map = new HashMap<String, String>();
		map.put("os.name", System.getProperty("os.name"));
		map.put("os.version", System.getProperty("os.version"));
		map.put("path.separator", System.getProperty("path.separator"));
		map.put("user.dir", System.getProperty("user.dir"));
		map.put("user.home", System.getProperty("user.home"));
		map.put("user.name", System.getProperty("user.name"));
		map.put("os.arch", System.getProperty("os.arch"));
		map.put("line.separator", System.getProperty("line.separator"));
		map.put("java.version", System.getProperty("java.version"));
		map.put("java.vendor.url", System.getProperty("java.vendor.url"));
		map.put("java.vendor", System.getProperty("java.vendor"));
		map.put("java.home", System.getProperty("java.home"));
		map.put("java.class.path", System.getProperty("java.class.path"));
		map.put("file.separator", System.getProperty("file.separator"));
		return map;
	}
	public static void main(String[] args) throws Exception{
		String hostName = FileUtil.getHostName();
		
		System.out.println(hostName);
		
		List<FileItem> items = FileUtil.findItems("localhost", "c:\\workspace\\dataexplore");
		System.out.println(items);
	}
}