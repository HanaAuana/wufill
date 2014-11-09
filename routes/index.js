var express = require('express');
var router = express.Router();
var wuform= require('../wuform');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/start');
});

//GET start page
router.get('/start', function(req, res){
	res.render('start');
});

//POST Rebuild
router.post('/rebuild', function(req, res){
	//Set local wunode instance
	var wunode = req.wunode;

	//Get form values
	var formID = wunode.parseFormURL(req.body.formID);
	var apiKey = req.body.apiKey;
	//console.log(formID);
	wunode.setSubdomain(subdomain);
	wunode.setApiKey(apiKey);

	var subdomain = wunode.parseSubdomain(req.body.formID);

	wunode.setSubdomain(subdomain);
    wunode.setApiKey(apiKey);

	var fields;
	wunode.getFields(formID, false, false, function(result){
		var redirectBody = "";
		if(result === "ERROR"){

		}
		else{
			fields = result.Fields;
			//Create form using fields, and wuform.buildForm logic
			//Render form
			redirectBody = "<!DOCTYPE html>"+
                                    "<html>"+
                                        "<head>"+
                                        "</head>"+
                                        "<body>"+

                                            "<form 'application/x-www-form-urlencoded' action='/results' method='post'>"+
                                                "<input type='hidden' name=subdomain value="+subdomain+">"+
                                                "<input type='hidden' name=formID value="+formID+">";

                redirectBody += wuform.buildForm(fields);
                redirectBody +=                 "<input type='submit' value='Submit' />"+
                                            "</form>"+
                                        "</body>"+
                                    "</html>";
                res.send(redirectBody);
		}
	});

});

router.post("/results", function(req, res){
    //console.log(req.body);

    //Get POST values //TODO
    var decodedBody = req.body;
    //console.log(decodedBody);

    //Extract Subdomain and formID from POST //TODO
    var subdomain = decodedBody.subdomain;
    var formID = decodedBody.formID;

    //Loop through POST values and parse into key/value pairs //TODO
    var parsedBody;
    for (var property in decodedBody) { //Need to get POST values into object format, iterate
        if(property.indexOf("Field") > -1){
            parsedBody += property+"="+encodeURIComponent(decodedBody[property])+"&";
        }
    }
    //Remove the last &
    parsedBody = parsedBody.slice(0, -1);
    //TEMP FIX //TODO
    parsedBody = parsedBody.substring(9);
    //Use parsedBody instead
    var fullBody = "https://"+subdomain+".wufoo.com/forms/"+formID+"/def/"+parsedBody;
    //console.log(rawBody);

    res.render('results', { sub: subdomain, form: formID, body: parsedBody });

        
});
module.exports = router;
