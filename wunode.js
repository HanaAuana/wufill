var request = require("request");
var util = require("util");
var fs = require('fs');

function Wufoo(subdomain, apiKey, entryKey){
	this.subdomain = subdomain;
	this.apiKey = apiKey;
	this.entryKey = entryKey;
}

Wufoo.prototype.setSubdomain = function(newSubdomain){
	this.subdomain = newSubdomain;
};

Wufoo.prototype.setApiKey = function(newApiKey){
	this.apiKey = newApiKey;
};

Wufoo.prototype.buildResource = function(path, format){
	return "https://"+this.subdomain+".wufoo.com/api/v3/"+path+format;
};

Wufoo.prototype.buildOptions = function(verb, resource){
	var options = {
		method: verb,
		uri: resource,
		json: true,
		auth: {
			user: this.apiKey,
			pass: "footastic"
		}
	};
	return options;
};

Wufoo.prototype.request = function(options, callback){
	request(options, function(error, response, body){
		if (!error && response.statusCode === 200){
			callback(body);
		}
		else{
			console.log("CODE "+response.statusCode);
			console.log("ERROR "+ error);
			callback("ERROR");
		}
	});
};

//Pass a JSON containing an array of Forms in JSON format to the callback argument
Wufoo.prototype.getForms = function(callback){
	var path = "forms";
	var format = ".json";
	var reqMethod = "GET";

	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

	//console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

//Pass a JSON containing an array of Fields in JSON format from the formID to the callback argument
//Passing true for "pretty" will break parsing, so should be avoided
Wufoo.prototype.getFields = function(formID, pretty, system, callback){
	var path = "forms/"+formID+"/fields";
	var format = ".json";
	var extras = "";
	if( (pretty || system) ){
		extras += "?";
		if( pretty ){
			extras += "pretty=true";
		}
		if( system ){
			extras += "system=true";
		}
	}
	format += extras;
	var reqMethod = "GET";
	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

	//console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

//Pass a JSON containing an array of Entries in JSON format from the formID to the callback argument
//Passing true for "pretty" will break parsing, so should be avoided
Wufoo.prototype.getEntriesForm = function(formID, pretty, callback){
	var path = "forms/"+formID+"/entries";
	var format = ".json";
	var extras = "";
	if( pretty ){
		extras = "pretty=true";
	}
	format += extras;
	var reqMethod = "GET";
	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

	console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

//Pass a username and password, and receive the user's API Key
//Passing true for "pretty" will break parsing, so should be avoided
Wufoo.prototype.getLoginAPI = function(integrationKey, email, password, domain, callback){
	var path = "login";
	var format = ".json";
	var reqMethod = "POST";
	var resource = "https://wufoo.com/api/v3/"+path+format;
	//var resource = "https://dpma2633wfn5.runscope.net";
	var options = {
		method: "POST",
		uri: resource,
		json: true,
		'form':'integrationKey='+integrationKey+'&email='+encodeURIComponent(email)+'&password='+encodeURIComponent(password)+'&subdomain='+domain
		//}
	};

	console.log(reqMethod+": "+resource);
	//Make call to helper Wufoo.request method
	this.request(options, callback);
};

Wufoo.prototype.getFormURL = function(formID, defaultValues){
	var url =  "https://"+this.subdomain+".wufoo.com/forms/"+formID;
	if(defaultValues){
		url += "/def/"+defaultValues;
	}
	return url;
};

//Given a form ID and an entryID, return a URL that will recreate the entry in a new form
Wufoo.prototype.refillEntry = function(formID, entryID, callback){
	var that = this;
	//console.log("Refilling entry "+entryID+" from form "+formID);
	var entryKeyField;
	//Find the right fieldID for our entryKey
	this.getFields(formID, false, true, function(fieldsList){
		var fields = fieldsList.Fields;
		for (var i = 0; i < fields.length; i++) {
			if(fields[i].Title === that.entryKey){
				entryKeyField = fields[i].ID;
			}
		}

		that.getEntriesForm(formID, false, function(entries){
			var entry;
			var found = false;
			console.log("Verifying on "+that.entryKey+" which should be "+entryKeyField);
			for (var i = 0; i < entries.Entries.length; i++) {
				
				if(entries.Entries[i][entryKeyField] == entryID){
					console.log("Found entry");
					entry = entries.Entries[i];
					found = true;
				}
			}
			if(found === false){
				callback("ERROR");

			}
			else{
				var defaultValues = "";
				for (var property in entry) {
					if(property.indexOf("Field") > -1){
						defaultValues += property+"="+encodeURIComponent(entry[property])+"&";
					}
				}
				//Remove the last &
				defaultValues = defaultValues.slice(0, -1);

				callback(that.getFormURL(formID, defaultValues));
			}
			
		});
	});
	
};

//Given an array of fields, construct the HTML to create that form. Returns string containing HTML
Wufoo.prototype.rebuildForm = function(fields){
	var form =	'<!DOCTYPE html>'+
					'<html>'+
						'<head>'+
						'</head>'+
						'<body>'+
							'<form>';
								for (var i = 0; i < fields.length; i++) {
									redirectBody+= '<p>'+fields[i].Title+'</p>';
								}
					form +=	'</form>'>+
						'</body>'+
					'</html>';

};

//Take a JSON Wufoo form and ouput a pretty version
Wufoo.prototype.parseForm = function(form){
	console.log("Name: "+ form.Name);
	console.log("Hash: "+ form.Hash);
	console.log("Fields: "+ form.LinkFields);
};

//Take an array of forms, and output pretty version
Wufoo.prototype.parseForms = function(forms){
	for (var i = 0; i < forms.length; i++) {
		this.parseForm(forms[i]);
		console.log();
	}
};

//Take a JSON Wufoo field and ouput a pretty version
Wufoo.prototype.parseField = function(field){
	console.log("Title: "+ field.Title);
	console.log("ID: "+ field.ID);
	console.log("Type: "+ field.Type);
};

//Take an array of fields, and output pretty version
Wufoo.prototype.parseFields = function(fields){
	for (var i = 0; i < fields.length; i++) {
		this.parseField(fields[i]);
		console.log();
	}
};

//Take a JSON Wufoo entry and ouput a pretty version
Wufoo.prototype.parseEntry = function(entry){
	console.log("Entry Id: "+ entry.EntryId);
	for (var property in entry) {

		if(property.indexOf("Field") > -1){
			console.log(property+": "+ entry[property]);
		}
	}
};

//Take an array of entries, and output pretty version
Wufoo.prototype.parseEntries = function(entries){
	for (var i = 0; i < entries.length; i++) {
		this.parseEntry(entries[i]);
		console.log();
	}
};

//Given a URL for a form, get the form hash or form name for identifying the correct form
Wufoo.prototype.parseFormURL = function(formURL){
	var start = formURL.indexOf("/forms/");
	if (start === -1){
		return formURL;
	}
	//console.log(formURL.substring(start+7, formURL.length-1));
	return formURL.substring(start+7, formURL.length-1);
};

//Given a URL for a form, get the subdomain
Wufoo.prototype.parseSubdomain = function(formURL){
	var start = formURL.indexOf("//");
	var end = formURL.indexOf(".wufoo.com/forms/");
	if (start === -1 || end === -1){
		return formURL;
	}
	//console.log("Subdomain:"+formURL.substring(start+2, end));
	return formURL.substring(start+2, end);
};
module.exports = new Wufoo("fishbowl",  "AOI6-LFKL-VM1Q-IEX9", "secretCode");