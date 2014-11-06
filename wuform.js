var wunode = require("./wunode");

// Utility functions for creating a standard HTML from from an array of Wufoo fields

var buildForm = function(fieldsArray){
	//Create "intro": <form> tag etc
	var formHTML = "<form>";
	//Loop through fields
	//Only need input fields, see following for example of this check in an entry:
	// for (var property in entry) {
	// 	if(property.indexOf("Field") > -1){
	// 		If the property has a "Field" property, it's an input field
	// 	}
	// }
	var fields = fieldsArray.Fields;
	for (var i = 1; i < fields.length; i++) {

		//Determine type of field, and extract necessary info
		var fieldType = fields[i].Type;
		var fieldLabel = fields[i].Title;
		var fieldID = fields[i].ID;

		if(fieldLabel === "Date Created" ||fieldLabel === "Created By" || fieldLabel === "Last Updated" || fieldLabel === "Updated By"){
			continue;
		}
		//Call appropriate helper method to build HTML for this field
		switch (fieldType) { 
			case "text":
				formHTML += buildText(fieldLabel, fieldID);
				break; 
			case "number":
				formHTML += buildNumber(fieldLabel, fieldID);
				break;
			case "textarea":
				formHTML += buildParagraph(fieldLabel, fieldID);
				break;
			case "checkbox":
				formHTML += buildCheckbox(fieldLabel, fieldID);
				break;
			case "radio":
				formHTML += buildMultipleChoice(fieldLabel, fieldID);
				break;
			case "select":
				formHTML += buildDropdown(fieldLabel, fieldID);
				break;
			case "shortname":
				formHTML += buildName(fieldLabel, fieldID);
				break;
			case "file":
				formHTML += buildFile(fieldLabel, fieldID);
				break;
			case "address":
				formHTML += buildAddress(fieldLabel, fieldID);
				break;
			case "date":
				formHTML += buildDate(fieldLabel, fieldID);
				break;
			case "email":
				formHTML += buildEmail(fieldLabel, fieldID);
				break;
			case "time":
				formHTML += buildTime(fieldLabel, fieldID);
				break;
			case "phone":
				formHTML += buildPhone(fieldLabel, fieldID);
				break;
			case "url":
				formHTML += buildWebsite(fieldLabel, fieldID);
				break;
			case "money":
				formHTML += buildPrice(fieldLabel, fieldID);
				break;
			case "likert":
				formHTML += buildLikert(fieldLabel, fieldID);
				break;
			case "rating":
				formHTML += buildRating(fieldLabel, fieldID);
				break;
			default:
				console.log("Found "+fieldType); 
				break; 
		}
		formHTML+= "</br>";
	};

	//Add "outro": </form>, etc
	formHTML += "</form>";
	//Return string containing HTML for the form
	return formHTML;
}

var buildText = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}

var buildNumber = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='number'  name="+fieldID+">";
	return fieldHTML;
}

var buildParagraph = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<textarea name="+fieldID+"></textarea>";
	return fieldHTML;
}

var buildCheckbox = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}

var buildMultipleChoice = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}

var buildDropdown = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}

var buildName = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	fieldHTML += "<label for='' >First</label>"
	fieldHTML += "<input type='text'  name="+(fieldID+1)+">";
	fieldHTML += "<label for='' >Last</label>"
	return fieldHTML;
}

var buildFile = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='file'  name="+fieldID+">";
	return fieldHTML;
}

var buildAddress = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}

var buildDate = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='date'  name="+fieldID+">";
	return fieldHTML;
}

var buildEmail = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='email'  name="+fieldID+">";
	return fieldHTML;
}

var buildTime = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='time'  name="+fieldID+">";
	return fieldHTML;
}

var buildPhone = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='phone'  name="+fieldID+">";
	return fieldHTML;
}

var buildWebsite = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='url'  name="+fieldID+">";
	return fieldHTML;
}

var buildPrice = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='money'  name="+fieldID+">";
	return fieldHTML;
}

var buildLikert = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}

var buildRating = function(fieldLabel, fieldID){
	var fieldHTML = "<label for="+fieldID+">"+fieldLabel+"</label>";
	fieldHTML += "<input type='text'  name="+fieldID+">";
	return fieldHTML;
}
wunode.setSubdomain("michaellimsm");
wunode.setApiKey("M8X9-0MP5-63FD-EUG8");
wunode.getFields("papqekz17234pt", false, false, function(fields){

	console.log(buildForm(fields));

});

