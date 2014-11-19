var request = require("request");

function Wufoo(subdomain, apiKey){
	this.subdomain = subdomain;
	this.apiKey = apiKey;
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
	try {
		request(options, function(error, response, body){
			if (!error && response.statusCode === 200){
				callback(body);
			}
			else{
				console.log("CODE "+response.statusCode);
				callback("ERROR");
			}
		});
	} catch (error) {
		console.log("ERROR caught");
		callback("ERROR");
	}
	
};

//Pass a JSON containing an array of Forms in JSON format to the callback argument
Wufoo.prototype.getForms = function(callback){
	var path = "forms";
	var format = ".json";
	var reqMethod = "GET";

	var resource = this.buildResource(path, format);
	
	var options = this.buildOptions(reqMethod, resource);

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

//Given a URL for a form, get the form hash or form name for identifying the correct form
Wufoo.prototype.parseFormURL = function(formURL){
	if(formURL === ''){
		return '';
	}
	var start = formURL.indexOf("/forms/");
	if (start === -1){
		return formURL;
	}

	return formURL.substring(start+7, formURL.length-1);
};

//Given a URL for a form, get the subdomain
Wufoo.prototype.parseSubdomain = function(formURL){
	if(formURL === ''){
		return '';
	}
	var start = formURL.indexOf("//");
	var end = formURL.indexOf(".wufoo.com/forms/");
	if (start === -1 || end === -1){
		return formURL;
	}

	return formURL.substring(start+2, end);
};
module.exports = new Wufoo("fishbowl",  "AOI6-LFKL-VM1Q-IEX9");