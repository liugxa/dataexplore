package com.platform.gui.dataexplore.action;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import com.platform.gui.dataexplore.util.UploadFile;

public class FileUploadAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private UploadFile uploadFile;
	
	private InputStream inputStream;
	
	public String doUploadFile(){
		//save the file into session
		this.saveUploadFile(uploadFile);
		Map<Integer, UploadFile> uploadFiles = this.getUploadFiles(uploadFile.getName());
		
		String status = "PROGRESS";
		if(uploadFile.getLength() == uploadFiles.size()){
			//the file had been uploaded successfully
			status = "DONE";
			
			String uplodFilesName = "uploadFiles_session_" + uploadFile.getName();
			this.session.removeAttribute(uplodFilesName);
		}
		
		inputStream = new ByteArrayInputStream(status.getBytes());
		return SUCCESS;
	}
	
	
	@SuppressWarnings("unchecked")
	private Map<Integer, UploadFile> getUploadFiles(String fileName){
		String uplodFilesName = "uploadFiles_session_" + fileName;
		Object obj = this.session.getAttribute(uplodFilesName);
		
		if(obj == null) obj = new HashMap<Integer, UploadFile>();
		return (Map<Integer, UploadFile>) obj;
	}
	
	private void saveUploadFile(UploadFile file){
		Map<Integer, UploadFile> r = this.getUploadFiles(file.getName());
		r.put(file.getIndex(), file);
		
		String uplodFilesName = "uploadFiles_session_" + file.getName();
		this.session.setAttribute(uplodFilesName, r);
	}
	
	public UploadFile getUploadFile() {
		return uploadFile;
	}
	
	public void setUploadFile(UploadFile uploadFile) {
		this.uploadFile = uploadFile;
	}
	
	public InputStream getInputStream() {
		return inputStream;
	}
	
	public void setInputStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}
}
