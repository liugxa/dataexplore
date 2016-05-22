define([
		"dojo/_base/lang",
		'dojo/_base/config',
		'dojo/_base/declare',
		"dijit/Dialog",
		"dijit/ConfirmDialog",
		"dojo/text!./filePropertyTemplate.html", 
		"dojo/string", 
		"dojo/dom-construct",
		"paccommon/request"
	],function(lang, cfg, declare, Dialog, ConfirmDialog, 
		filePropertyTemplate, stringUtil, domConstruct, request) {

		return declare('dataexplore.FilePropertyDialog', null, {
			constructor: function (_context, _host, _path, _name) {
				this.context = _context;
				this.host = _host; this.path = _path; this.name = _name;
			},
			show: function () {
				var dialog = new Dialog({
					title: "File Properties",
					style: "width:400px;height:200px",
					onHide: function(){this.destroyRecursive(false);},
				});

				//send request
				var params = {"hostName": this.host, "path": this.path, "fileName": this.name};
				request.post(this.context.urlContext + "/doGetInputFile.action?rnd=" + (new Date()).getTime(),{
						data: params,
						handleAs: "json",
					}).then(function(data){
						// do something with handled data
						var content = stringUtil.substitute(filePropertyTemplate, data);
						dialog.set("content", domConstruct.toDom(content));
						dialog.show();
					}, function(err){
						// handle an error condition
					}, function(evt){
						// handle a progress event
						//alert("evt:" + evt);
				});
			}
		});
	});