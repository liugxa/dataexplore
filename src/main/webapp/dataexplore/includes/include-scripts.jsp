<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/javascript">
	var userName = "${userName}";
	
	var appContext = "<c:url value='/application'/>";
	var expContext = "<c:url value='/pac/dataexplore'/>";
	
	function deleteCallBack(_item){
		if(window.jobInputLabelRemove){
			jobInputLabelRemove(_item.host+'?p='+_item.path +'/'+ _item.name);
		}
	}

	function toSubmissionForm(_formType, _appName, _formName, _owner, _inputFiles){
		var parameters = _transferParameters(_formType, _appName, _formName, _owner, _inputFiles);
		showSubmitPage(parameters);
	}

	function showSubmitPage(_parameters){
		if(parent.OpenWindowManager){
			var url = appContext + "/loadApplicationForm.action";
			var title = Platform.messages['pac.dataexplore.submitjobs.submit.dialog.title'];

			//Set the window's tile with the spaces character will be not working on IE9 browser.
			parent.OpenWindowManager.open(url + "?" + _parameters, "","width=1000,height=600,top=155,left=240,scrollbars=yes,resizable=yes");
		}
	}

	//the working flow to submit a job, we have to call the loadApplicationForm method 
	//because the doSubmitApplicationJob method had be bounded together with the method tightly!
	//_doEnableSubmit() - >  -> _doLoadApplication() -> _doSubmitJob() 
	function doSubmitJob(_formType, _appName, _formName, _owner, _inputFiles){
		var parameters = _transferParameters(_formType, _appName, _formName, _owner, _inputFiles);
		//show waiting message
		showWaitingMessage();

		//call the work flow
		_doEnableSubmit(parameters, _doSubmitJob);
	}

	function _doEnableSubmit(_parameters, _f){
		var beforeUrl = expContext + "/doEnableSubmit.action";
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : beforeUrl + "?" + (_parameters),
			callback : {
				"onSuccess" : function(m){
					var result = m[1];
					if(result == "true"){
						_f(_parameters, _doGetSubmitResult);
					}else{
						showMessage(Platform.messages['pac.dataexplore.submitjobs.submit.invalid.message']);
						showSubmitPage(_parameters);
					}
				},
				"onFailure" : function(m){
					showMessage(m);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}


	function _doLoadApplication(_parameters, _f){
		var loadUrl = appContext + "/loadApplicationForm.action";
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : loadUrl + "?" + (_parameters),
			callback : {
				"onSuccess" : function(m){
					_f(_parameters, _doGetSubmitResult);
				},
				"onFailure" : function(m){
					showMessage(m);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}

	function _doSubmitJob(_parameters, _f){
		var appUrl = appContext + "/doSubmitApplicationJob.action";
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : appUrl + "?" + _parameters,
			callback : {
				"onSuccess" : function(m){
					_f(_parameters);
				},
				"onFailure" : function(m){
					showMessage(m);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}

	function _doGetSubmitResult(_parameters){
		var appUrl = expContext + "/doGetSubmitResult.action";
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : appUrl + "?" + _parameters,
			callback : {
				"onSuccess" : function(m){
					var message = JSON.parse(m[1]);
					showMessage(message);
					
					//if there can't find oud the job id from message
					//open the submit page to user
					var jobId = _getJobIdFromMessage(message);
					if(jobId == "") showSubmitPage(_parameters);
				},
				"onFailure" : function(m){
					showMessage(m);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}

	//don't remove the below method, it will be called by the pop-up job submission page.
	function showActionMessage(_message){
		var message = (_message.success);

		var message_view_result = document.getElementById("sp_message_view_result");
		message_view_result.innerHTML = message;
		message_view_result.style.color = "#036";
		//don't show the "View ites output folder"
		var message_view_output = document.getElementById("sp_message_view_output");
		message_view_output.style.display = "block";

		var jobId = _getJobIdFromMessage();
		if(jobId == "") message_view_output.style.display = "none";
		
		var message_div = document.getElementById("sp_message_div");
		message_div.style.display = "block";
	}

	function showMessage(_message){
		var message = (_message);	
		if(message != null){
			//the message's handles
			var message_div = document.getElementById("sp_message_div");
			var message_view_result = document.getElementById("sp_message_view_result");
			var message_view_output = document.getElementById("sp_message_view_output");

			//set the message
			if(message.length > 100) message = message.substring(0, 100) + " ... ";
			message_view_result.innerHTML = message;
			message_view_result.title = _message;

			//by default, showing the "view output" link.
			message_view_output.style.display = "block";
			
			//if can not get the job id, don't showing the link
			var jobId = _getJobIdFromMessage();
			if(jobId == "") message_view_output.style.display = "none";
			
			//showing the message element
			message_div.style.display = "block";
		}
	}

	function showWaitingMessage(){
		var message_div = document.getElementById("sp_message_div");
		message_div.style.display = "block";

		var message_view_output = document.getElementById("sp_message_view_output");
		message_view_output.style.display = "none";

		var message_view_result = document.getElementById("sp_message_view_result");
		message_view_result.innerHTML = Platform.messages['pac.dataexplore.submitjobs.submit.wait.message'];
	}

	function toViewMyJobs(){
		var userName = window.userName;
		var _tree = parent.parent.ConsoleManager.treeManager;
		_tree.getNode("workload").handler.param= "&userName=" + userName;
		_tree.nodeLabelClick(_tree.getNode("workload"));
	}

	function toViewOutputFolder(){
		var url = expContext + "/doGetOutputMessage.action";
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : url,
			callback : {
				"onSuccess" : function(m){
					var message = JSON.parse(m[1]);
					
					var host = message.substring(0, message.indexOf(':'));
					var file = message.substring(message.indexOf(':') + 1);
					var url = "ls/" + host + "?p=" + file;
					
					if(window.locateDataTable){
						window.locateDataTable(url);
						
					}
				},
				"onFailure" : function(m){
					showMessage(m, false);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}

	/*
	function toViewSubmittedForm(_appName, _jobId, _jobData){
		//example
		_appName = "generic:generic";
		_jobId = "636";
		_jobData = "/home/gliu/generic_1417242713360pEu4y/";
		
		var params = "refreshTree=false&appName=" + _appName + 
		"&jobId=" + _jobId +
		"&baseFolder=" + encodeURIComponent(_jobData);
		
		var _others = "&toEdit=false&isResubmit=true&relativePath=&fromJobs=false" + 
		"&data=" + "&datatime" + (new Date()).getTime();

		var url = appContext + "/loadApplicationForm.action"
		var parameters = params + _others;
		
		parent.OpenWindowManager.open(url + "?" + parameters, Platform.messages['pac.dataexplore.submitjobs.submit.dialog.title'], "scrollbars=yes, resizable=yes, width=800, height=600");
	}
	*/

	function _getJobIdFromMessage(){
		var jobId = "";
		var message = document.getElementById("sp_message_view_result").innerHTML;
		
		var start = message.indexOf("&lt;");
		if(start != -1){
			var end = message.indexOf("&gt;");
			jobId = message.substring(start + 4, end);
		}
		return jobId;
	}

	function _transferParameters(_formType, _appName, _formName, _owner, _inputFiles){
		var params = "formType=" + _formType + "&formName=" + _formName + "&appName=" + _appName + "&owner=" + _owner;
		var relativePath = "published/" + _formName;

		var parameters = "&relativePath=" + relativePath + "&fromJobs=true&fromDataExplore=true";
		if(_formType == "CUSTOM"){
			var relativePath = "published/" + _appName;
			var data = "published/" + _owner + "/" + _appName + "/" + _formName + ".properties";
			
			parameters = "&relativePath=" + relativePath + "&data=" + data + "&fromJobs=true&fromDataExplore=true";
		}
		return (params + "&" + parameters);
	}

	function isOverLayerShow(){
		return parent.isOverLayerShow();
	}

	function showOverLayer(){
		window.parent.showOverLayer();
	}

	function hiddenOverLayer(){
		window.parent.hiddenOverLayer();
	}

	function tail(_context, _rowDatas){
		for(var i=0;i<_rowDatas.length;i++){
			var rowData = _rowDatas[i];
			var path = encodeURIComponent(rowData.absolutePath);
			var host = rowData.host;
			
			var time = (new Date()).getTime();
			var url = parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(context+"/job/tailContentAction.action?dataPath=" + path + "&hostName=" + host + "&time=" + time);
			//var winName = "tail" + _path.replace(/[\/\.\-\:\s]/g);

			var top = 50 + 10 * i;
			var left = 50 + 10 * i;
			var params = "height=600, width=520, top=" + top + ", left=" + left + ", toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no";
			if(parent.OpenWindowManager){
				var win = parent.OpenWindowManager.open(url, "tail"+path.replace(/[\/\.\-\:\s]/g,''), params);
				win.focus();
			}else{
				var win = window.open(url, "tail"+path.replace(/[\/\.\-\:\s]/g,''), params);
				win.focus();
			}
		}
	}

	function edit(_context, _rowDatas){
		for(var i=0;i<_rowDatas.length;i++){
			var rowData = _rowDatas[i];

			var path = encodeURIComponent(rowData.absolutePath);
			var host = rowData.host;
			var size = rowData.size;

			if(/^\d+B$/.test(size)){ // Byte
				size = parseInt(size.replace(/B/g,""));
			}
			if(/^\d+K$/.test(size)){ // KB
				size = parseInt(size.replace(/K/g,""));
				size = size * 1024;
			}
			if(/^\d+M$/.test(size)){ // MB
				size = parseInt(size.replace(/M/g,""));
				size = size * 1024 * 1024;
			}
			if(/^\d+G$/.test(size)){ // GB
				size = parseInt(size.replace(/G/g,""));
				size = size * 1024 * 1024 * 1024;
			}

			var time = (new Date()).getTime();
			var url = parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(_context.contextPath + "/job/openContentAction.action?dataPath=" + path + "&hostName=" + host + "&fileSize=" + size + "&time=" + time);
			//var winName = "view"+selected[j].replace(/[\/\.\-\:\s]/g,'');

			var top = 100 + 10 * i;
			var left = 50 + 10 * i;
			var params = "height=600, width=900, top=" + top + ", left=" + left + ", toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no"
			if(parent.OpenWindowManager){
				var win = parent.OpenWindowManager.open(url, "view"+path.replace(/[\/\.\-\:\s]/g,''), params);
				win.focus();
			}else{
				var win = window.open(url, "view"+path.replace(/[\/\.\-\:\s]/g,''), params);
				win.focus();
			}
		}
	}

	function download(_context, _rowData){
		var path = encodeURIComponent(_rowData.absolutePath);
		var host = _rowData.host;

		var form = document.getElementById("downloadActionForm");
		var hostElement = document.getElementById("downloadActionForm_hostName");
		var pathElement = document.getElementById("downloadActionForm_filePath");
		
		hostElement.value = host;
		pathElement.value = _rowData.absolutePath;

		form.action = _context.contextPath + "/job/dataDownloadAction.action"
		form.action = parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(form.action);
		form.submit();
	}

    function downFile(_context, host, path){
        var form = document.getElementById("downloadActionForm");
        var hostElement = document.getElementById("downloadActionForm_hostName");
        var pathElement = document.getElementById("downloadActionForm_filePath");
        
        hostElement.value = host;
        pathElement.value = path;

        form.action = _context.contextPath + "/job/dataDownloadAction.action";
        form.action = parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(form.action);
        form.submit();
    }

	function _openFilesWithCustomApp(_context, _data, _item, _files, _host, _path, _outputFile){
		var v = _data.split(";");
		var sid = v[0];
		var pid = v[1];
		var vncInfoTempFile = v[2];
		
		var url = _context.contextPath + "/dataexplore/vnc/openFilesWithCustomApp/" + _host;
		var postData = "sid="+sid+"&pid="+pid+"&command="+_item.cmdValue+"&files2Open="+_files+"&sessionFile="+vncInfoTempFile;

		parent.PLATFORM.widget.ConnectionMgr.send({
			url : url,
			callback : {
				"onSuccess" : function(m){
					//showResultMessage("_openFilesWithCustomApp.success:" + m);
				},
				"onFailure" : function(m){
					//showResultMessage("_openFilesWithCustomApp.faliure:" + m);
				}
			},
			method : "Post",
			timeout : 10000,
			async : true,
			postData : postData,
			contents : ""
		});
	}

	function closeVNC(_data, _item, _files, _host, _path, _outputFile){
		var v = _data.split(";");
		var sid = v[0];
		var pid = v[1];
		var vncInfoTempFile = v[2];

		var url = context+"/dataexplore/vnc/closeVNCConsole/"+_host+"?pid="+pid+"&vncInfoFile="+vncInfoTempFile;
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : url,
			callback : {
				"onSuccess" : function(m){
					//showResultMessage("closeVNC.success:" + m);
				},
				"onFailure" : function(m){
					//showResultMessage("closeVNC.success:" + m);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}

	function openVNC(_context, _item, _files, _host, _path, _outputFile){
		var url = _context.contextPath + "/dataexplore/vnc/startVNCConsole/" + _host + "?vncInfoFile=" + _outputFile;
		parent.ConsoleManager.showLoadingPane();

		parent.PLATFORM.widget.ConnectionMgr.send({
			url : url,
			callback : {
				"onSuccess" : function(m){
					var data = m[1];

					parent.ConsoleManager.hideLoadingPane();
					_openFilesWithCustomApp(_context, data,_item, _files, _host, _path, _outputFile);

					var v = data.split(";");
					var sid = v[0];
					var pid = v[1];
					var vncInfoTempFile = v[2];
				
					if(parent.OpenWindowManager){
						var _url = _context.contextPath + "/dataexplore/vnc/openVNCConsole/" + _host + "?vncInfoFile="+vncInfoTempFile+"&sid="+sid+"&pid="+pid+"&command="+_item.cmdValue+"&files2Open="+_files+"&date="+(new Date()).getTime();
					
						var _win = parent.OpenWindowManager.open(_url, sid, "resizable=yes,scrollbars=yes,height=768,width=1024");
						_win.onbeforeunload = function(){
							_win.onunload=function(){
								closeVNC(_context, data,_item, _files, _host, _path, _outputFile);
							}
							return "hello";
						};
						_win.focus();
					}else{
						var _url = parent.PLATFORM.lang.csrf.appendCsrfTokenToURL(_context.contextPath + "/dataexplore/vnc/openVNCConsole/"+_host+"?vncInfoFile="+vncInfoTempFile+"&sid="+sid+"&pid="+pid+"&command="+command+"&files2Open="+_files+"&date="+(new Date()).getTime());

						var _win = window.open(_url, sid, "resizable=yes,scrollbars=yes,height=768,width=1024");
						_win.onbeforeunload = function(){
							_win.onunload=function(){
								closeVNC(_context, data,_item, _files, _host, _path, _outputFile);
							}
							return "hello";
						};
						_win.focus();
					}

				},
				"onFailure" : function(m){
					//showResultMessage("here?!" + m);
				}
			},
			method : "Get",
			timeout : 10000,
			async : true,
			postData : "",
			contents : ""
		});
	}

	function showResultMessage(_message){
		if(_message[1] != "") alert(_message[1]);
	}

	/*
	function doAction(_item, _files, _host, _path, _outputFile){
		var fileName = _outputFile.substring(_outputFile.indexOf("/") + 1);

		var url = context + "/webservice/pac/data/action/doaction";
		var postdata = "commands=" + _item.cmdValue + "&filePath=" + _files + "&actionName=" + _item.name + "&fileName=" + fileName + "&execHost=" + _host;
		
		parent.PLATFORM.widget.ConnectionMgr.send({
			url : url,
			callback : {
				"onSuccess" : function(m){
					showResultMessage(m);
				},
				"onFailure" : function(m){
					showResultMessage(m);
				}
			},
			method : "Post",
			timeout : 10000,
			async : true,
			postData : postdata,
			contents : ""
		});
	}
	*/
</script>