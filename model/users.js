
var db = require('../util/db');
db.bind('user');
db.user.ensureIndex([['userId', 1]], true, function(err, replies){});

var user = function() {

	var get = function(id, callback) {
		db.user.findOne({userId: id}, callback);
	}	

	var load = function(base, count, callback) {
    console.log('model.users.load(): base=' + base + ', count=' + count);
		for (var id = base; id < base + count; id++) {
			db.user.findOne({userId: id}, function(err, res) {
		        if (!res) {
		          console.log('model.users.load(): need to fetch ' + id + ' from loop_api');
		        }
		    });
		}
	}	

	return {
		get: get,
		load: load
	}
}();

module.exports = user;
