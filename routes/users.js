var logger = require('../util/logger');
var express = require('express');
var router = express.Router();
var loop_api = require('../util/loop_api');
// var mq = require('../util/mq');
var users = require('../model/users.js');
// mq.consume(getUserCallback);
var lowestGap = 0;

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

// called for each MQ message
// function getUserCallback(jsonMsg) {
// 	console.log('MQ callback response: ' + JSON.stringify(jsonMsg));
	// console.log('MQ callback payload:' + jsonMsg.content.toString());
  // var obj = JSON.parse(jsonMsg.content.toString());
	// var userId = obj.base || 1;
	// var count = obj.count || 3;
	// users.load(userId, count, function(err, res) {
		// console.log('users.load.callback() - err=' + JSON.stringify(err) + ', res=' + JSON.stringify(res)); 
	// });
// }

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('Not Implemented - respond with a resource');
});

router.get('/:id', function(req, res) {
	loop_api.main_info(parseInt(req.params.id, 10), function(err, minfo) {
		logger.info('main-info api call returned.');
		if (err) {
			logger.error('error in main-info call: ' + err);
			res.render('pages/error', { 
				title: 'loopnav error', 
				message: 'API call error' , 
				error: {
					status: JSON.stringify(err), 
					stack: 'no stack information available'
				}
			});
		} else {
			logger.info('result: ' + minfo);
			loop_api.co_authors(req.params.id, function(err, coauth) {
				logger.info('co-authors api call returned.');
				if (err) {
					logger.error('error in co-author call: ' + err);
					res.render('pages/error', { 
						title: 'loopnav error', 
						message: 'API call error' , 
						error: {
							status: JSON.stringify(err), 
							stack: 'no stack information available'
						}
					});
				} else {
					logger.info('co-author api call result: ' + coauth);
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

var tableRoute = function(req, res) {
  var baseId = parseInt(req.params.id, 10) || 1;
  var pageSize = 4;

	users.get(baseId, function(err, result) {
		logger.info('users.get: err = ' + JSON.stringify(err) + ', res = ' + JSON.stringify(result));
		if (!err && ! result) {
			// not found
			// mq.publish('{"base": ' + baseId + ', "count": ' + pageSize + '}');
			// should redirect to refresh page
		}
	});

  // get urls for all users from baseId to (baseid + pagesize -1) 

  var userTable = [];
	logger.info('router.users.constructUserTable: ' + baseId + ', ' + pageSize);
	users.getMultiWithPic(baseId, pageSize, function(err, resultArray) {
		logger.info('router.users.constructUserTable - got pics: ' + resultArray.length);
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
		if (resultArray.length < pageSize) {
			// not enough results...
			// mq.publish('{"base": ' + baseId + ', "count": ' + pageSize + '}');
			// ... but lets continue with the partial results.
		}
		if (!resultArray.length) {
			// no results at all - need to wait for MQ
			// mq.publish('{"base": ' + baseId + ', "count": ' + pageSize + '}');
	    res.render('pages/refresh', { 
  	    title: 'loopnav refresh', 
    	  refreshTime: 5
    	});
		} else {
			resultArray.forEach(function(item, i, list) {
				logger.info('item '+i+' = ' + JSON.stringify(item));
				userTable.push(item);
				if (i==(list.length-1)) {
					//done, render the page
					res.render('pages/faces', { 
  	    		title: 'loopnav faces', 
    	  		users: userTable, 
      			prevPage: baseId - pageSize, 
      			nextPage: userTable[userTable.length-1].userId + 1,
      			autopilot: req.params.autopilot
    			});
				}
			});
		}
		if (req.params.autopilot) {
			// prefetch next page
			var nextpage = parseInt(baseId,10) + parseInt(pageSize, 10);
			// mq.publish('{"base": ' + nextpage + ', "count": ' + pageSize + '}');
		} else {
			prefetch(); 
		}
	});
	

	var prefetch = function() {
	  logger.info('route.users.prefetch: ' + lowestGap);
		users.get(lowestGap, function(err, result) {
		logger.info('users.get: err = ' + JSON.stringify(err) + ', res = ' + JSON.stringify(result));
		if (!err && ! result) {
			logger.info('route.users.prefetch: MQ message ' + lowestGap);
			// mq.publish('{"base": ' + lowestGap + ', "count": ' + 50 + '}');
			lowestGap += 50;
		} else {
			lowestGap++;
		}
		
	});	
	}
};

module.exports = router;
