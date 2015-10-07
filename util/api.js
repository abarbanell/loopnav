
var api = function() {

	var http = require('http');
  var logger = require('./logger');
  
  // get data from API call
  var get = function(options, callback) {
  	var start = Date.now();
    var request = http.get(options, function (response) {
			console.log("Got response: " + response.statusCode);
      // data is streamed in chunks from the server
      // so we have to handle the "data" event    
      var buffer = "";

      response.on("data", function (chunk) {
          buffer += chunk;
      }); 

      response.on("end", function () {
          // finished transferring data
          // dump the raw data
					if (buffer.length) {
						var data = JSON.parse(buffer);
						logger.info('api call {' + options + '} returned - ' + (Date.now()-start) + ' ms' );
						callback(null, data);
					} else {
						callback({
							error: "Empty response"
						}, null);
					}
      }); 

    }); 
		request.on('error', function(err) {
			callback({ error: 'connection error' }, null);
		});

  };

	var post = function(options, callback) {
		logger.info('api.post - call to non-implemented function');
		callback({err: 'not implemented'}, null);
	}

	return {
		get: get,
		post: post
	}

}();

module.exports = api;
