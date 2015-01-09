
var loop_api = function() {

	var api = require('./cached_api.js');

	var main_info = function(id, callback) {
		var url = "http://loop.frontiersin.org/api/v1/users/" + id + "/main-info";
		console.log('url: ' + url);
		api.get(url, callback);
	}

	var co_authors = function(id, callback) {
		var url = "http://loop.frontiersin.org/api/v1/users/" + id + "/co-authors";
		console.log('url: ' + url);
		api.get(url, callback);
	}

	return {
		main_info: main_info,
		co_authors: co_authors
	}
}();

module.exports = loop_api;

