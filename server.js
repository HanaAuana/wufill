var http = require("http");
var url  = require("url");

function start(route, handle){
	function onRequest(request, response){
		var path = url.parse(request.url).pathname;

		console.log("Request for "+path+" received");

		route(path, handle, request, response);
	}

	http.createServer(onRequest).listen(80);
	console.log("Server started");
}

exports.start = start;

