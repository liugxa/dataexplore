/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2010, 2012 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

define(["dojo/_base/declare",
	    "dijit/_Widget",
		"dijit/_TemplatedMixin",
		"dojo/string",
		"dojo/has",
		"dojo/_base/lang",
		"dojo/query",
		"dojo/NodeList-dom",
		"dojo/dom-construct",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/fx",
		"dojo/_base/array",
		"dojo/has!dojo-bidi?../bidi/widget/Toaster",
		"dojo/text!./templates/Toaster.html",
		"dojo/text!./templates/_ToasterMessage.html",
		"dojo/i18n!./nls/Toaster"],
		function (declare,
				  _Widget,
				  _TemplatedMixin,
				  str,
				  has,
				  lang,
				  query,
				  NodeListDom,
				  domConstruct,
				  domClass,
				  domStyle,
				  fx,
				  array,
				  bidiExtension,
				  template,
				  msgTmpl,
				  nlsBundle){
	var iMessaging = lang.getObject("idx.oneui.messaging", true); // for backward compatibility with IDX 1.2
				  
	/**
	 * Create new idx.widget.Toaster
	 * @name idx.widget.Toaster
	 * @class Toaster widget for displaying user messages in a pop-up style at 
     * the bottom corner of the screen. Messages should stack on top of each
     * other, until we hit the maxMsgCount limit, at which point the oldest
     * message should be pushed off-screen. 
     *
     * When hidden messages exist, we show a link to direct the user to the global
     * message view. 
     *
     * Messages disappear after five seconds by default, with the widget closing when its message
     * list is empty. It can also be manually closed by clicking the icon in the right
     * hand corner.
     *
     * When a user hovers over the message box, pause any remove animations to allow
     * the user to read that message.
	 * @augments dijit.messaging.Toaster
	 */
	var baseClassName = has("dojo-bidi")? "idx.widget.Toaster_" : "idx.widget.Toaster";
	iMessaging.Toaster = declare(baseClassName, [_Widget, _TemplatedMixin], {
		/**@lends idx.widget.Toaster*/
		
	    /** 
	     * Widget's HTML template
	     *
	     * @type String
	     */ 
	    templateString: template, 
	
	    /**
	     * Running count of the total number of available messages.
	     *
	     * @type Number
	     */ 
	    msgCount: 0,
	
		
		/**
		* Maximum height in pixel of message should be visible
		* 
		* @type Number
		*/
		maxMsgHeight: 600,
	
	    /**
	     * Milliseconds that a message should be visible for.
	     *
	     * @type Number
	     */ 
	    messageTimeout: 5000,
	
	    /**
	     * This value controls whether the message removal animations 
	     * are executed or queued. 
	     *
	     * @type Boolean
	     */ 
	    persistMessages: false,
		
		_messages: null,
	
	    /**
	     * Template node binding, overflow message count.
	     *
	     * @type Object
	     */ 
	    _setOverflowMsgCountAttr: {
	        node: "overflowCountNode",
	        type: "innerHTML"
	    },
	    /**
	     * Default message details, fills in missing
	     * attributes on new messages.
	     *
	     * @type Object
	     */ 
	    defaultMessage: {
	        type: "success", 
	        content: "",
	        msg_id: "",
	        timestamp: ""
	    },
	    
		postMixInProperties: function(){
			var _nlsResources = nlsBundle;
			this._viewAll = _nlsResources.viewAll;
		},
	    /**
	     * Create animation queue and set up attribute binding, so we 
	     * monitor changes to the message count.
	     *
	     * @function
	     * @public
	     */  
	    postCreate: function () {
	        this._animQueue = [];
	        this.watch("msgCount", lang.hitch(this, "_onMessageCountChange"));
			document.body.appendChild(this.toasterNode);
			domStyle.set(this.messageList, "maxHeight", this.maxMsgHeight + "px");
	    },
	    
	    /**
	     * Override to ensure the toaster node gets destroyed since it is a child of the body.
	     */
	    destroy: function() {
	    	// move the toaster node back to being a child of this widget
	    	this.domNode.appendChild(this.toasterNode);
	    	
	    	// let the base method do the cleanup
	    	this.inherited(arguments);
	    },
	
	    /** Public API methods below... */
	
	    /**
	     * Display a new toaster message, contains the optional attributes
	     * "status", "content", "datetime" & "msg_id". Toaster automatically 
	     * shown with the first message.
	     * 
	     * New messages are wiped in from the top.
	     * 
	     * @param {Object} message - User message
	     */ 
	    add: function (message) {
	        domClass.remove(this.toasterNode, "dijitHidden");
	        var msgNode = this._displayMsg(message);
	        fx.wipeIn({node:msgNode, onEnd: lang.hitch(this, "_onMessageDisplayed", msgNode)}).play();
	    }, 
	
	    /**
	     * Remove a toaster message referenced by the <li> DOM node.
	     * If element is present in the list, wipe out the node and remove
	     * once hidden.
	     *
	     * @param {DOMNode} msgNode - List element
	     */       
	    remove: function (msgNode, wipeOut) {
	        if (!this._isNodeInList(msgNode)) {
	            return;
	        }
			this._messages.pop();
			var index = array.indexOf(this._animQueue, wipeOut)
			if(index >= 0){
				this._animQueue.splice(index, 1)[0].play();
			}
	    },
	
	    /**
	     * Reset the message list, clearing out any current messages.
	     */
	    reset: function () {
	        this.set("msgCount", 0);
			this._animQueue = [];
			this._messages = [];
	        query("li", this.toasterNode).orphan();
	    },
	
	    /** Custom event handlers below... */
	
	    /**
	     * When the number of messages in the list changes, we need to check....
	     *
	     *  - If the list is full, show the "More Messages" link.
	     *  - If the list is full and a new message has been added, increase the overflow 
	     *    message count. 
	     *  - If the list is empty, hide the toaster and reset the overflow message count.
	     *
	     * @param {String} prop - Property name changed
	     * @param {Object} oldVal - Previous value
	     * @param {Object} newVal - New value
	     * @private
	     */ 
	    _onMessageCountChange: function (prop, oldVal, newVal) {
			if (this._isListEmpty()) {
	            domClass.replace(this.toasterNode, "dijitHidden", "overflow");
	            this.set("overflowMsgCount", 0);
	        }else if (this._isListFull()) {
	            domClass.add(this.toasterNode, "overflow");
	            if (newVal > oldVal) {
	                this.set("overflowMsgCount", newVal);
	            }
	        }
	    },
	
	    /**
	     * Event handler when a new message has been wiped in, 
	     * increment the global mesage count and set out the timer
	     * for removal. 
	     *
	     * @param {DOMNode} msgNode - Message node displayed
	     * @private
	     */
	    _onMessageDisplayed: function (msgNode) {
	        this.set("msgCount", this.msgCount + 1);
			var wipeOut = fx.wipeOut({node:msgNode, onEnd: lang.hitch(this, "_onMessageRemoved", msgNode)});
			this._animQueue.push(wipeOut);
			if(!this.persistMessages){
			    setTimeout(lang.hitch(this, "remove", msgNode, wipeOut), this.messageTimeout);
			}
	    },
	
	    /**
	     * Event handler when a message has been removed from the
	     * list. Destroy the node in the DOM and reduce the current
	     * message count.
	     *
	     * @param {DOMNode} msgNode - Message node removed 
	     * @private
	     */
	    _onMessageRemoved: function (msgNode) {
	        domConstruct.destroy(msgNode);
			this._messages.shift();
	        this.set("msgCount", this.msgCount - 1);
	    },
	
	    /**
	     * When a user hovers over the toaster, 
	     * pause any remove animations that occur until 
	     * the mouse is moved off. 
	     *
	     * @private
	     */  
	    _onMouseOver: function () {
	        if (this.handler) {
	            window.clearTimeout(this.handler);
	            this.handler = null;
	        }
	    }, 
	
	    /**
	     * When mouse moves off the toaster, play any queued 
	     * up remove animations. Use a setTimeout to allow event
	     * bubbling to occur, i.e. if the user moves into an inner
	     * element, we get a onMouseOut followed immediately by onMouseOver
	     * as the event bubbles from child node to parent container.
	     * Using setTimeout we push execution to the back of the event loop.
	     *
	     * @private
	     */ 
	    _onMouseOut: function () {
			if(this.persistMessages){
		        this.handler = setTimeout(lang.hitch(this, "_playAnimQueue"));
			}
	    },
	
	    /** Private utility methods below... */
	
	    /**
	     * Loop through all queued animations and start them off.
	     *
	     * @private
	     */
	    _playAnimQueue: function () {
			while(this._animQueue.length){
				this._animQueue.pop().play();
			}
	    },
	
	    /**
	     * Is the node a current message list item?
	     * 
	     * @param {DOMNode} node - Possible message node
	     * @return {Boolean} Message is present in the message list
	     * @private
	     */ 
	    _isNodeInList: function (node) {
	        return node.parentNode === this.messageList;
	    },
	
	    /**
	     * Add a new toaster message to the list, generating template
	     * from message details.
	     *
	     * @param {Object} message - Message details
	     * @return {DOMNode} Attached DOM node for this message
	     * @private
	     */ 
	    _displayMsg: function (message) {
	        return domConstruct.place(this._createMessageHTML(message), this.messageList, "first");
	    },
	
	    /**
	     * Is the message list empty?
	     *
	     * @return {Boolean} List is empty
	     * @private
	     */ 
	    _isListEmpty: function () {
	        return this.msgCount === 0;
	    },
	
	    /**
	     * Does the message list contains more messages
	     * that maxMsgCount?
	     *
	     * @return {Boolean} List is full
	     * @private
	     */
	    _isListFull: function () {
			return domStyle.get(this.toasterNode, "height") >= this.maxMsgHeight;
	    },
	
	    /**
	     * Generate HTML fragment for a new list item,
	     * substituting in the template values.
	     *
	     * @param {Object} message - Message details
	     * @return {String} HTML fragment with message values
	     * @private
	     */
	    _createMessageHTML: function (message) {
			var newMessage = lang.mixin(false, this.defaultMessage, message);
			if(!this._messages){this._messages = [];}
			this._messages.push(newMessage);
	        return str.substitute(msgTmpl, newMessage);
	    },
		_onViewAll: function(){
			this.onViewAll(this._messages);
		},
		/**
		 * Click "view all..." link to trigger this one, it should be overriden by user.
		 * @param {Array} messages - Current messages
		 * @protected
		 */
		onViewAll: function(messages){
			
		}
	});
	return has("dojo-bidi")? declare("idx.widget.Toaster",[iMessaging.Toaster,bidiExtension]) : iMessaging.Toaster;
});
