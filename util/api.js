
var api = function() {

	var http = require('http');

  // get data from API call
  var get = function(options, callback) {
  	var start = Date.now();
    var request = http.get(options, function (response) {
      // data is streamed in chunks from the server
      // so we have to handle the "data" event    
      var buffer = "";

      response.on("data", function (chunk) {
          buffer += chunk;
      }); 

      response.on("end", function (err) {
          // finished transferring data
          // dump the raw data
					if (err) {
						callback(err, null);
					} else { 
						if (buffer.length) {
							var data = JSON.parse(buffer);
							console.log('api call returned - ' + (Date.now()-start) + ' ms' );
							callback(null, data);
						} else {
							callback({err: 'empty response'}, null);
						}
					}
      }); 

    }); 
  };

	var post = function(options, callback) {
		callback({err: 'not implemented'}, null);
	}

	return {
		get: get,
		post: post
	}

}();

module.exports = api;
