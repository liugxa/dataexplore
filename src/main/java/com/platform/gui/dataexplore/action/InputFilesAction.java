package com.platform.gui.dataexplore.action;

import java.util.List;

import com.platform.gui.dataexplore.model.InputFile;

public class InputFilesAction extends AbstractActionSupport{
	
	private static final long serialVersionUID = 1L;
	
	private InputFile inputFile;
	
	private List<InputFile> inputFiles;
	
	/**
	 * Get the input file by unique location (hostName + path + fileName)
	 * @return
	 * @throws Exception
	 */	
	public String doGetInputFile() throws Exception{
		return SUCCESS;
	}
	
	public String doGetInputFiles() throws Exception{
		return SUCCESS;
	}
	
	public String doAddInputFile() throws Exception{
		return NONE;
	}
	
	public String doRemoveInputFile() throws Exception{
		return NONE;
	}
	
	public InputFile getInputFile() {
		return inputFile;
	}

	public void setInputFile(InputFile inputFile) {
		this.inputFile = inputFile;
	}

	public List<InputFile> getInputFiles() {
		return inputFiles;
	}

	public void setInputFiles(List<InputFile> inputFiles) {
		this.inputFiles = inputFiles;
	}
}
