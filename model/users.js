
var db = require('../util/db');
db.bind('user');
db.user.ensureIndex([['userId', 1]], true, function(err, replies){});

var user = function() {

	var get = function(id, callback) {
		db.user.findOne({userId: id}, callback);
	}	

	return {
		get: get
	}
}();

module.exports = user;
