function route(path, handle, request, response){
	console.log("Routing request for "+ path);

	//If there exists a handler for this path
	if( typeof handle[path] === 'function'){
		handle[path](request, response);
	}
	else{
		console.log("No handler found for "+path);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not Found");
		response.end();
	}
}

exports.route = route;