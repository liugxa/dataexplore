package com.platform.gui.dataexplore.util;

import java.io.File;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.SystemUtils;
import com.platform.gui.dataexplore.model.FileItem;

public class FileUtil {
	
	public static List<FileItem> findItems(String host, String path) throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		
		if(isOSWindows() == true){
			//list all of the drivers
			if(path != null && path.equals("/")){
				r = getDrivers(host, path);
			}else{
				r = getFiles(host, path);
			}
		}else{
			r = getFiles(host, path);
		}
		return r;
	}
	
	public static List<FileItem> getDrivers(String host, String path) throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		String localHost = getLocalHostName();
		File[] drivers = getFileDrivers();
		for(File driver : drivers){
			FileItem item = new FileItem();
			item.setName(driver.toString());
			item.setId(localHost + ":" + driver.toString());
			item.setHasItems(true);
			r.add(item);
		}
		return r;
	}
	
	public static List<FileItem> getFiles(String host, String path){
		List<FileItem> r = new ArrayList<FileItem>();
		File file = new File(path);
		File[] subFiles = file.listFiles();
		if(subFiles != null){
			for(int i=0;i<subFiles.length;i++){
				File f = subFiles[i];
				FileItem item = new FileItem();
				
				item.setName(f.getName());
				item.setId(host + ":" + f.getAbsolutePath());
				
				item.setHasItems(false);
				if(f.isDirectory()) item.setHasItems(true);
				
				r.add(item);
			}
		}
		return r;
	}
	
	public static List<FileItem> getHosts() throws Exception{
		List<FileItem> r = new ArrayList<FileItem>();
		//only focus on the local host where the web server started
		//you are free to get the hosts from the properties file or others.
		String localHost = getLocalHostName();
		FileItem item = new FileItem();
		item.setName(localHost);
		item.setId(localHost + ":" + "/");
		item.setHasItems(true);
		r.add(item);
		return r;
	}
	
	public static String getLocalHostName() throws Exception{
		return InetAddress.getLocalHost().getHostName();
	}
	
	public static File[] getFileDrivers() throws Exception{
		return File.listRoots();
	}
	
	public static Boolean isOSWindows() throws Exception{
		return SystemUtils.IS_OS_WINDOWS;
	}
	
	public static void main(String[] args) throws Exception{
		String localHost = getLocalHostName();
		System.out.println(localHost);
		
		List<FileItem> items = FileUtil.findItems("localhost", "c:\\workspace\\dataexplore");
		System.out.println(items);
		
		// returns pathnames for files and directory
		File[] paths = getFileDrivers();
		
		// for each pathname in pathname array
		for(File path:paths){
			// prints file and directory paths
			System.out.println("Drive Name: "+ path);
			
			//FileSystemView fsv = FileSystemView.getFileSystemView();
			//System.out.println("Description: "+ fsv.getSystemTypeDescription(path));
		}
	}
}