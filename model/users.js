
var db = require('../util/db');

var user = function() {

	var get = function(id, callback) {
		return callback({err: 'not implemented'}, null);	
	}	

	return {
		get: get
	}
}();

module.exports = user;
