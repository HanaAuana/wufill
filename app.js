var express = require('express');
var wunode = require("./wunode");
var wuform = require("./wuform");
var querystring = require('querystring');
var url = require('url');
require('newrelic');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

app.get("/", function(req, res){
    console.log("Request handler for 'start' ");

    res.render('index', { title: 'Wufill' });
});

app.get("/start", function(req, res){
    console.log("Request handler for 'start' ");

    res.render('index', { title: 'Wufill' });
});

app.post("/rebuild", function(req,res){
    console.log("Request handler for 'rebuild' ");
    var rawBody = "";

    req.on("data", function(chunk){
        console.log("Got chunk");
        rawBody += chunk.toString();
    });

    req.on("end", function(){

        var decodedBody = querystring.parse(rawBody);
        console.log(decodedBody);

        var subdomain = wunode.parseSubdomain(decodedBody.formID);
        console.log("SUB "+subdomain);
        var formID = wunode.parseFormURL(decodedBody.formID);
        var apiKey = decodedBody.apiKey;

        wunode.setSubdomain(subdomain);
        wunode.setApiKey(apiKey);

        var fields;
        wunode.getFields(formID, false, false, function(result){
            //console.log(result);
            var redirectBody = "";
            if(result === "ERROR"){
                console.log("ERROR");
            }
            else{
                fields = result.Fields;
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
    console.log("Done");
});

app.post("/results", function(req, res){
    console.log("Request handler for 'results' ");
    var rawBody = "";
    req.on("data", function(chunk){
        rawBody += chunk.toString();
    });

    req.on("end", function(){
        //Get POST values //TODO
        console.log(rawBody);
        var decodedBody = querystring.parse(rawBody);
        //console.log(decodedBody);

        //Extract Subdomain and formID from POST //TODO
        var subdomain = decodedBody.subdomain;
        var formID = decodedBody.formID;

        //Loop through POST values and parse into key/value pairs //TODO
        var parsedBody;
        for (var property in decodedBody) { //Need to get POST values into object format, iterate
            if(property.indexOf("Field") > -1){
                console.log("Property: "+property+" and value: "+decodedBody[property]);
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

        res.render('results', { moddedURL: fullBody });
    });
        
});
app.set('port', process.env.PORT || 8888);

var server = app.listen(app.get('port'), function(){

    var host = server.address().address;
    var port = server.address().port;

    console.log("Server listening at http://%s:%s", host, port);
});


// module.exports = app;
