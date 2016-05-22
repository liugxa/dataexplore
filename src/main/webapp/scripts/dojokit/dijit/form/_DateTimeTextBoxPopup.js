define([
	"dojo/date", // date date.compare
	"dojo/date/locale", // locale.regexp
	"dojo/date/stamp", // stamp.fromISOString stamp.toISOString
	"dojo/_base/declare", // declare
	"dojo/_base/lang", // lang.getObject
	"./TimeTextBox",
	"../Calendar",
	"../_Widget",
	"../_TemplatedMixin"
], function(date, locale, stamp, declare, lang, TimeTextBox, Calendar,  _Widget, _TemplatedMixin){

	var _DateTimeTextBoxPopup = declare("dijit.form._DateTimeTextBoxPopup", [_Widget, _TemplatedMixin], {
	
		baseClass: "dijitTextBox dijitComboBox  dijitDateTextBox platfromCalendar",

		templateString: "<div><div width=\"100%\" data-dojo-attach-point=\"calander\"></div><div width=\"100%\" data-dojo-attach-point=\"timepicker\"></div></div>",
		
		_args : {},
		
		_calendarComponent : null,
		
		_timePickerComponent : null,
		
		constructor: function(args){
			this._args = args;		
		},
		
		value : null,
		
		postCreate: function(){	
			if(this._calendarComponent){
				this._calendarComponent.destory();
			}
			if(this._timePickerComponent){
				this._timePickerComponent.destory();
			}
		
			this._calendarComponent = new Calendar({				
				dir: this._args.dir,
				lang: this._args.lang,
				value: this._args.value,
				currentFocus: this._args.currentFocus,
				constraints: this._args.constraints,
				datePackage: this._args.datePackage,
				isDisabledDate:this._args.isDisabledDate
			}, this.calander);
			this._timePickerComponent = new TimeTextBox({				
				dir: this._args.dir,
				lang: this._args.lang,
				value: this._args.value,
				currentFocus: this._args.currentFocus,
				constraints: { 
					selector : "time",
					fullYear : true,
					timePattern : this._args.constraints.timePattern,
					visibleIncrement : this._args.constraints.visibleIncrement,
					visibleRange : this._args.constraints.visibleRange,
					clickableIncrement : this._args.constraints.clickableIncrement				
				},
				filterString: this._args.filterString,
				isDisabledDate:this._args.isDisabledDate
			}, this.timepicker);
			
			this._calendarComponent.domNode.style.width = '100%';
			this._timePickerComponent.domNode.style.width = '100%';
						
			dojo.connect(this._calendarComponent, 'onChange', this, '_updateValue');
			this.inherited(arguments);
		},
		_updateValue:function(value){
			this.value = new Date(value);
			var time = this._timePickerComponent.get("value");
			if (time) {
				this.value.setHours(time.getHours());
				this.value.setMinutes(time.getMinutes());
				this.value.setSeconds(time.getSeconds());
			}
			
			this.onChange(this.value);
		},		
		onChange:function(){		
		}
		
	});

	return _DateTimeTextBoxPopup;
});

