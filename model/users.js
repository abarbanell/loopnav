
var db = require('../util/db');
db.bind('user');
db.user.ensureIndex([['userId', 1]], true, function(err, replies){});

var user = function() {

	var get = function(id, callback) {
		db.user.findOne({userId: id}, callback);
	}	

	var load = function(base, count, callback) {
		for (id = base; id < base + count; id++) {
			db.user.findOne({userId: id}, callback);
		}
	}	

	return {
		get: get,
		load: load
	}
}();

module.exports = user;
