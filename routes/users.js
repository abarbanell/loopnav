var express = require('express');
var router = express.Router();
var loop_api = require('../util/loop_api');
var mq = require('../util/mq');
var users = require('../model/users.js');
mq.consume(getUserCallback);

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

function getUserCallback(jsonMsg) {
	console.log('MQ callback response: ' + JSON.stringify(jsonMsg));
	console.log('MQ callback payload:' + jsonMsg.content.toString());
  var obj = JSON.parse(jsonMsg.content.toString());
	var userId = obj.base || 1;
	var count = obj.count || 3;
	users.load(userId, count, function(err, res) {
		console.log('users.load.callback() - err=' + JSON.stringify(err) + ', res=' + JSON.stringify(res)); 
	});
}

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/:id', function(req, res) {
  // TODO: check that id is numeric
	loop_api.main_info(req.params.id, function(err, minfo) {
		console.log('main-info api call returned.');
		if (err) {
			res.render('pages/error', { 
				title: 'loopnav error', 
				message: 'API call error' , 
				error: {
					status: JSON.stringify(err), 
					stack: 'no stack information available'
				}
			});
		} else {
			console.log('result: ' + minfo);
			loop_api.co_authors(req.params.id, function(err, coauth) {
				console.log('co-authors api call returned.');
				if (err) {
					res.render('pages/error', { 
						title: 'loopnav error', 
						message: 'API call error' , 
						error: {
							status: JSON.stringify(err), 
							stack: 'no stack information available'
						}
					});
				} else {
					console.log('result: ' + coauth);
					res.render('pages/user', { title: 'loopnav', user: minfo, co_authors: coauth });
				}
			});
		}
	});
});

router.get('/table/:id', function(req, res) {
	req.params.autopilot=false;
	return tableRoute(req, res);
});

router.get('/table/:id/auto', function(req, res) {
	req.params.autopilot = true;
	return tableRoute(req, res);
});

function tableRoute(req, res) {
  var baseId = 1;
  var pageSize = 5;
  if (req.params.id > 1) {
    baseId = parseInt(req.params.id);
    console.log('router.get: set baseId to ' + baseId);
  }

	users.get(baseId, function(err, result) {
		console.log('users.get: err = ' + JSON.stringify(err) + ', res = ' + JSON.stringify(result));
		if (!err && ! result) {
			// not found
			mq.publish('{"base": ' + baseId + ', "count": ' + pageSize + '}');
			// should redirect to refresh page
		}
	});

  // get urls for all users from baseId to (baseid + pagesize -1) 

  var userTable = [];
  constructUserTable(userTable, baseId, pageSize, req, res, function(req,res) {
    console.log('user table filled: ' + JSON.stringify(userTable));
    res.render('pages/faces', { 
      title: 'loopnav faces', 
      users: userTable, 
      prevPage: baseId - pageSize, 
      nextPage: baseId + pageSize,
      autopilot: req.params.autopilot
    });
  });
}

var constructUserTable = function(u, b, p, req, res, callback) {
	console.log('router.users.constructUserTable: ' + b + ', ' + p);
	users.getMultiWithPic(b, p, function(err, resultArray) {
		console.log('router.users.constructUserTable - got pics: ' + resultArray.length);
		if (err) {
					res.render('pages/error', { 
						title: 'loopnav error', 
						message: 'Error while retrieving userTable' , 
						error: {
							status: JSON.stringify(err), 
							stack: 'no stack information available'
						}
					});
		}
		resultArray.forEach(function(item, i, list) {
			console.log('item '+i+' = ' + JSON.stringify(item));
			u.push(item);
		});
		return callback(req, res);
	});
};

module.exports = router;
