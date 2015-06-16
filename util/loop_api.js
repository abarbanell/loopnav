
var loop_api = function() {
	var logger = require('./logger');
	var api = require('./cached_api.js');
	var prefix = process.env.LOOP_API_PREFIX || "http://loop.frontiersin.org/api/v1/";

	logger.info('loop_api URL prefix = ' + prefix);
	
	var main_info = function(id, callback) {
		var url = prefix + 'users/' + id + '/main-info';
		api.get(url, callback);
	}

	var co_authors = function(id, callback) {
		var url = prefix + 'users/' + id + '/co-authors';
		api.get(url, callback);
	}

	return {
		main_info: main_info,
		co_authors: co_authors
	}
}();

module.exports = loop_api;

