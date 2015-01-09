

var cached_api = function() {

  var api = require('./api');
  var mongo = require('mongoskin');
  var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27107/loopnav';
  var db = mongo.db(mongourl);

  db.collection('apicache').ensureIndex([['url', 1]], 
        true, function(err, replies){});
  db.bind('apicache');

  console.log('mongoskin initialized for: ' + mongourl);

  // get data from API call
  var get = function(options, callback) {
    var cached_callback = function(err, result) {
      console.log('cached_api.cache_callback');
      var d = new Date();
      var jsondate = d.toJSON();
      db.apicache.insert({
        url: options,
        payload: result,
        retrieved: jsondate,
      }, function(err) {
        console.log('apicache insert - err: ' + err);
        callback(err,result);
      });
    }
    console.log('cached_api.get: ' + options);
    console.log('cached_api.get: options is string? ' 
        + (options === options.toString()));
    
    if (options === options.toString()) {
      console.log('cached_api.get: eligible for caching');
      db.apicache.findOne({url: options}, function(err, cachedApi) {
        if (err || !cachedApi) {
          console.log('apicache.findOne - error:' + err);
          console.log('apicache.findOne - result:' + cachedApi);
          api.get(options, cached_callback);
        } else {
          console.log('cached_api.get: found, NOT checking for expiry.');
          callback(null, cachedApi.payload);
        }
      }); 
    } else {
      api.get(options, callback);
    }
  };

	var post = function(options, callback) {
    console.log('cached_api.post: ' + options);
		api.post(options, callback);
	}

	return {
		get: get,
		post: post
	}

}();

module.exports = cached_api;
