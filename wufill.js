var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandler");

var handle = {};
handle["/"] = requestHandler.start;
handle["/start"] = requestHandler.start;
handle["/rebuild"] = requestHandler.rebuild;
handle["/results"] = requestHandler.results;

server.start(router.route, handle);