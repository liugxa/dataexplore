define([
	"dojo/_base/declare",
	"dojo/Deferred",
	"dojo/i18n",
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"idx/form/Select",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	'dijit/_HasDropDown',
	"dojo/date/locale",
	"dojo/text!./templates/DateTimeRangeDropDown.html"
], function(declare, Deferred, i18n, kernel, lange, Select, _WidgetsInTemplateMixin,
			_WidgetBase, _TemplatedMixin, _HasDropDown, locale, template){

	var dropDownClass = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

		templateString: template,

		postMixInProperties: function(){
			this.inherited(arguments);

			var nls = i18n.getLocalization('idx.gridx', 'FilterBar', this.lang);
			this.startLabel = nls.datetimeRangeStart;
			this.endLabel = nls.datetimeRangeEnd;
		}
	});

	// return declare([_WidgetBase, _TemplatedMixin, _HasDropDown], {
	return declare([Select], {

		postCreate: function(){
			// var a = new dropDownClass();
			this.inherited(arguments);
			var dd = this.dropDown = new dropDownClass();
			dd.startup();
			this.connect(dd.startDate, 'onChange', 'onChange');
			this.connect(dd.startTime, '_setValueAttr', 'onChange');
						// this.connect(this.timeTextBox, "_onInput", "_onInput")
									// this.connect(this.timeTextBox, "_setValueAttr", "_updateValueAttr");;
			this.connect(dd.endDate, 'onChange', 'onChange');
			this.connect(dd.endTime, '_setValueAttr', 'onChange');
		},

		onChange: function(){
			var value = this.get('value');
			if(value){
				var start, end, formatedStart, formatedEnd;
				start = value.startDate;
				start.setHours(value.startTime.getHours());
				start.setMinutes(value.startTime.getMinutes());
				formatedStart = locale.format(start, {selector: 'date', datePattern: "yy/M/d H:m:s"});

				end = value.endDate;
				end.setHours(value.endTime.getHours());
				end.setMinutes(value.endTime.getMinutes())
				formatedEnd = locale.format(end, {selector: 'date', datePattern: "yy/M/d H:m:s"});
				this.containerNode.innerHTML = formatedStart + ' to ' + formatedEnd;
			}
		},

		value: '',
		
		_setValueAttr: function(value){
			this._set('value', value);
			if(!value.start || !value.end){
				return;
			}

			var startDateValue = value.start,
				endDateValue = value.end,
				startTimeValue = new Date(value.start);
				endTimeValue = new Date(value.end), 
				dd = this.dropDown;

				startTimeValue.setFullYear(1970);
				startTimeValue.setMonth(0);
				startTimeValue.setDate(1);

				endTimeValue.setFullYear(1970);
				endTimeValue.setMonth(0);
				endTimeValue.setDate(1);

				dd.startDate.set('value', startDateValue);
				dd.endDate.set('value', endDateValue);
				dd.startTime.set('value', startTimeValue);
				dd.endTime.set('value', endTimeValue);
		},
		
		_getValueAttr: function(){
			var dd = this.dropDown,
				startDate = dd.startDate.get('value'),
				startTime = dd.startTime.get('value'),
				endDate = dd.endDate.get('value'),
				endTime = dd.endTime.get('value');

			if(!startDate || !startTime || !endDate || !endTime){
				return null;
			}
			return {
				startDate: dd.startDate.get('value'),
				startTime: dd.startTime.get('value'),
				endDate: dd.endDate.get('value'),
				endTime: dd.endTime.get('value')
			}
		},

		loadDropDown: function(/*Function*/ loadCallback){
			// summary:
			//		Creates the drop down if it doesn't exist, loads the data
			//		if there's an href and it hasn't been loaded yet, and then calls
			//		the given callback.
			// tags:
			//		protected

			// TODO: for 2.0, change API to return a Deferred, instead of calling loadCallback?
			loadCallback();
		},

		isValid: function(){
			return this.get('value');
		}
	});
});
