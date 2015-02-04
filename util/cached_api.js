var db = require('./db.js');

var cached_api = function() {

  var api = require('./api');
  var logger = require('./logger');
  var cacheHit = 0;
  var cacheMiss = 0;

  db.collection('apicache').ensureIndex([['url', 1]], 
        true, function(err, replies){});
  db.bind('apicache');

  // get data from API call
  var get = function(options, callback) {
    var cached_callback = function(err, result) {
      logger.info('cached_api.cached_callback');
      if (err) {
        logger.error('cached_api.cached_callback err:' + JSON.stringify(err));
        return callback(err, result);
      }
      logger.info('cached_api.cached_callback payload:' + result);
      var d = new Date();
      var jsondate = d.toJSON();
      db.apicache.insert({
        url: options,
        payload: result,
        retrieved: jsondate,
      }, function(err) {
        logger.info('apicache insert - err: ' + err);
        callback(err,result);
      });
    }
    logger.info('cached_api.get: ' + options);
    
    if (options === options.toString()) {
      db.apicache.findOne({url: options}, function(err, cachedApi) {
        if (err || !cachedApi) {
          cacheMiss++;
          logger.info('apicache_log.get: CACHE MISS ' + cacheMiss);
          api.get(options, cached_callback);
        } else {
          cacheHit++;
          logger.info('cached_api.get: CACHE HIT ' + cacheHit);
          callback(null, cachedApi.payload);
        }
      }); 
    } else {
      logger.info('cached_api.get: CACHE BYPASS');
      api.get(options, callback);
    }
  };

	var post = function(options, callback) {
    logger.info('cached_api.post: ' + options);
		api.post(options, callback);
	}

	return {
		get: get,
		post: post
	}

}();

module.exports = cached_api;
