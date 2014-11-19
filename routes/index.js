var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/start');
});

//GET start page
router.get('/start', function(req, res){
	res.render('start',  {tryFailed: false});
});

//GET tryagain page
router.get('/tryagain', function(req, res){
    res.render('start', {tryFailed: true});
});

//POST Rebuild
router.post('/rebuild', function(req, res){
    if(req.body.formID === '' || req.body.email === '' || req.body.password === ''){
        res.redirect('/tryagain');
        next();
    }
	//Set local wunode instance
	var wunode = req.wunode;
    //Get Wufoo login info from request body
    var formID = wunode.parseFormURL(req.body.formID);
    var subdomain = wunode.parseSubdomain(req.body.formID);
    
    wunode.setSubdomain(subdomain);
    //Make Wufoo Login API call to get API key
    wunode.getLoginAPI(process.env.LoginKey, req.body.email, req.body.password, subdomain, function(loginResult){
        var apiKey = loginResult.ApiKey;
        wunode.setSubdomain(subdomain);
        wunode.setApiKey(apiKey);

        var formFields;
        wunode.getFields(formID, false, false, function(result){
            var redirectBody = "";
            if(result === "ERROR"){
                res.redirect('/tryagain');
            }
            else{
                formFields = result.Fields;
                //Create form using jade template
                //Render form
                res.render('rebuild', {fields:formFields, sub:subdomain, form:formID});
            }
        });
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
            var sanitized = decodedBody[property].replace(/#/g, "").replace(/&/g, "").replace(/\+/g, "").replace(/\/\//g, "");
            parsedBody += property+"="+encodeURIComponent(sanitized)+"&";
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
