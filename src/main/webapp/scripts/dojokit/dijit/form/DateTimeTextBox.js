define([
	"dojo/_base/declare", // declare
	"./_DateTimeTextBoxPopup",
	"./_DateTimeTextBox"
], function(declare, _DateTimeTextBoxPopup, _DateTimeTextBox){

	return declare("dijit.form.DateTimeTextBox", _DateTimeTextBox, {
		baseClass: "dijitTextBox dijitComboBox platformDateTimeBox",
		popupClass: _DateTimeTextBoxPopup,
		_selector: "datetime"
	});
});
