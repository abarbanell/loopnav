
var cached_api = function() {

  var api = require('./api');
  var logger = require('./logger');
  var cacheHit = 0;
  var cacheMiss = 0;
  var cacheExpiry = process.env.CACHE_EXPIRY || 60*60*24*7*1000; // in milliseconds, equals 7 days

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
        if (err) {
          logger.error('apicache.get CACHE ERROR: ' + err);
          return api.get(options, cached_callback);
        }
        if (!cachedApi) {
          cacheMiss++;
          logger.info('apicache.get: CACHE MISS ' + cacheMiss);
          return api.get(options, cached_callback);
        } else {
          var now = new Date();
          var apidate = new Date(cachedApi.retrieved);
          logger.info('now: ' + now);
          logger.info('apidate: ' + apidate);
          logger.info('expiry' + cacheExpiry);
          logger.info('cache age: ' + (now - apidate));
          if (cachedApi.retrieved && ((now-apidate) < cacheExpiry)) {
            cacheHit++;
            logger.info('cached_api.get: CACHE HIT ' + cacheHit);
            return callback(null, cachedApi.payload);
          } else {
            logger.info('cached_api.get: expired or no retrieve date set');
            return api.get(options, cached_callback);
          }
        }
      }); 
    } else {
      logger.info('cached_api.get: CACHE BYPASS');
      return api.get(options, callback);
    }
  };

	var post = function(options, callback) {
    logger.info('cached_api.post: ' + options);
		api.post(options, callback);
	};

  // need to return this after db connection is established
	var lrc = { 
		get: get,
		post: post
	};


  // connect to DB
  var db = require('./db.js')(function(err, result){
    if (err) {
      logger.error('cached_api - could not open db: ' + err);
    } else {
      db.bind('apicache');
      db.collection('apicache').ensureIndex([['url', 1]], 
        true, function(err, replies){
          if (err) {
            logger.error('db.apicache.ensureIndex error: ' + err);
          } else {
            return (null, lrc);
          }
      });
    } 
  });


}();

module.exports = cached_api;
