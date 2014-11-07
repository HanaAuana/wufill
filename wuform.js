var wunode = require("./wunode");

// Utility functions for creating a standard HTML from from an array of Wufoo fields
function Wuform(){
}

Wuform.prototype.buildForm = function(fields){
	//Create "intro": <form> tag etc
	var formHTML = "";
	//Loop through fields
	//Only need input fields, see following for example of this check in an entry:
	// for (var property in entry) {
	// 	if(property.indexOf("Field") > -1){
	// 		If the property has a "Field" property, it's an input field
	// 	}
	// }
	for (var i = 1; i < fields.length; i++) {

		//Determine type of field, and extract necessary info
		var fieldType = fields[i].Type;
		var fieldLabel = fields[i].Title;
		var fieldID = fields[i].ID;
		var choices;

		if(fieldLabel === "Date Created" ||fieldLabel === "Created By" || fieldLabel === "Last Updated" || fieldLabel === "Updated By"){
			continue;
		}
		if(fieldType === "checkbox" ||fieldType === "radio" || fieldType === "select" || fieldType === "likert"){
			choices = fields[i].Choices;
		}
		//Call appropriate helper method to build HTML for this field
		//For Checkbox, MulipleChoice, Dropdown, pass choices/subfields
		switch (fieldType) {
			case "text":
				formHTML += this.buildText(fieldLabel, fieldID);
				break;
			case "number":
				formHTML += this.buildNumber(fieldLabel, fieldID);
				break;
			case "textarea":
				formHTML += this.buildParagraph(fieldLabel, fieldID);
				break;
			case "checkbox":
				formHTML += this.buildCheckbox(fieldLabel, fieldID, choices);
				break;
			case "radio":
				formHTML += this.buildMultipleChoice(fieldLabel, fieldID, choices);
				break;
			case "select":
				formHTML += this.buildDropdown(fieldLabel, fieldID, choices);
				break;
			case "shortname":
				formHTML += this.buildName(fieldLabel, fieldID);
				break;
			case "file":
				formHTML += this.buildFile(fieldLabel, fieldID);
				break;
			case "address":
				formHTML += this.buildAddress(fieldLabel, fieldID);
				break;
			case "date":
				formHTML += this.buildDate(fieldLabel, fieldID);
				break;
			case "email":
				formHTML += this.buildEmail(fieldLabel, fieldID);
				break;
			case "time":
				formHTML += this.buildTime(fieldLabel, fieldID);
				break;
			case "phone":
				formHTML += this.buildPhone(fieldLabel, fieldID);
				break;
			case "url":
				formHTML += this.buildWebsite(fieldLabel, fieldID);
				break;
			case "money":
				formHTML += this.buildPrice(fieldLabel, fieldID);
				break;
			case "likert":
				formHTML += this.buildLikert(fieldLabel, fieldID);
				break;
			case "rating":
				formHTML += this.buildRating(fieldLabel, fieldID);
				break;
			default:
				console.log("Found "+fieldType); 
				break; 
		}
		formHTML+= "</br>";
	}

	//Add "outro": </form>, etc
	formHTML += "";
	//Return string containing HTML for the form
	return formHTML;
};

Wuform.prototype.buildText = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildNumber = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='number'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildParagraph = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<textarea name="+fieldID+"></textarea>";
	return fieldHTML;
};

Wuform.prototype.buildCheckbox = function(fieldLabel, fieldID, choices){ //TODO check
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='checkbox'  name="+fieldID+">";
	//create checkbox input for each other choice
	for (var i = 0; i < choices.length; i++) {
		fieldHTML += "<label for="+choices[i].fieldID+">"+choices[i].label+"</label>";
		fieldHTML += "<input type='checkbox'  name="+choices[i].label+">";
	}
	return fieldHTML;
};

Wuform.prototype.buildMultipleChoice = function(fieldLabel, fieldID, choices){ //TODO check
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='radio'  name="+fieldID+">";
	//create another radio for each choice, same name, different value (choice.label)
	for (var i = 0; i < choices.length; i++) {
		fieldHTML += "<label for="+fieldID+">"+choices[i].label+"</label>";
		fieldHTML += "<input type='radio'  name="+fieldID+">";
	}
	return fieldHTML;
};

Wuform.prototype.buildDropdown = function(fieldLabel, fieldID, choices){ //TODO check
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<select name="+fieldID+">";
	//add option tag, one for each choice value=choice.label
	for (var i = 0; i < choices.length; i++) {
		fieldHTML += "<option value="+choices[i].label+">";
	}
	fieldHTML += "</select>";
	return fieldHTML;
};

Wuform.prototype.buildName = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	fieldHTML += "<label for='' >First</label>"
	var lastNameID = parseInt(fieldID.substring(5))+1;
	fieldHTML += "<input type='text'  name=Field"+(lastNameID)+">";
	fieldHTML += "<label for='' >Last</label>"
	return fieldHTML;
};

Wuform.prototype.buildFile = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='file'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildAddress = function(fieldLabel, fieldID){ //TODO check
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='address'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildDate = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='date'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildEmail = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='email'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildTime = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='time'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildPhone = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='phone'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildWebsite = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='url'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildPrice = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='money'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildLikert = function(fieldLabel, fieldID){ //TODO
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
};

Wuform.prototype.buildRating = function(fieldLabel, fieldID){ //TODO check
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='rating'  name="+fieldID+">";
	return fieldHTML;
};

// wunode.setSubdomain("michaellimsm");
// wunode.setApiKey("M8X9-0MP5-63FD-EUG8");
// wunode.getFields("papqekz17234pt", false, false, function(fields){

// 	console.log(buildForm(fields));

// });

module.exports = new Wuform();