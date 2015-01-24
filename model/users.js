
var db = require('../util/db');
db.bind('user');
db.user.ensureIndex([['userId', 1]], true, function(err, replies){});
var loop_api = require('../util/loop_api');

var user = function() {

	var get = function(id, callback) {
		db.user.findOne({userId: id}, callback);
	};	

	var getMultiWithPic = function(base, count, callback) {
		db.user.find({ $and: [{ userId: { $gte: base }}, {status: 'ok-with-pic' }] }, null, {
		    limit: count,
    		sort: {
      			'userId': 1
    		}
  		}, function (err, resultCursor) {
  			//map cursor to array.
  			resultCursor.toArray(callback);
  		});
	}
	
	
	var load = function(base, count, callback) {
	  loadOne(base, count, callback);
	};
	  
	var loadOne = function(base, count, callback) {
 	  console.log('model.users.load(): base=' + base + ', count=' + count);
	  if (count <= 0) {
		console.log('model.users.loadOne - done');
		return (callback()); //TODO do we need to pass err and result?
	  } else {
	  	db.user.findOne({userId: base}, function(err, res) {
		  if (err) {
		  	return callback(err, null);
		  }
		  if (res) {
		    console.log('model.users.load(): found ' + base);
		    console.log('model.users.load(): res = ' + JSON.stringify(res));
		    //TODO: check for picture and decide next step
		    if (res.status == 'ok-with-pic') {
		    		count--;
		    }
		    return loadOne(base+1, count, callback);
		  } else {
		    console.log('model.users.load(): not found ' + base);
		    // here we try to get the data from api call
		    loop_api.main_info(base, function(err, result) {
		   	  console.log('model.users.loadOne: api result = ' + JSON.stringify(result)) 	
    		  var obj = {userId: base};
    		  if (err || !result) {
    		    // not found
    			obj.status = 'not-found';
    		  } else {
        	    if (result.hasOwnProperty('ProfilePicture') && result.ProfilePicture.toString().contains('Thumb_203_203')) {
          		  obj.status = 'ok-with-pic';
        	      obj.ProfilePicture = result.ProfilePicture;
        	      count--;
      			} else {
        		  obj.status = 'no-pic';
    			}
    	      }  
    	      console.log('model.users.loadOne: status=' + obj.status + ' for id=' + obj.userId);
    	      db.user.save(obj, function(err, res) {
    		    if (err) {
    			  return callback(err, null);
    			} else {
    			  return loadOne(base+1, count, callback);
    			}	
    	      });
  			});
		  }
		});
	  }
	}; 	

	return {
		get: get,
		getMultiWithPic: getMultiWithPic,
		load: load
	}
}();

module.exports = user;
