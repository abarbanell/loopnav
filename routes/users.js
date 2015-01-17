var express = require('express');
var router = express.Router();
var loop_api = require('../util/loop_api');


if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
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
  var pageSize = 25;
  if (req.params.id > 1) {
    baseId = req.params.id - (req.params.id % pageSize) + 1;
    console.log('router.get: set baseId to ' + baseId);
  }

  if (baseId != req.params.id) {
    console.log('table called with non-aligned base id ' + req.params.id + ', redirecting to ' + baseId);
    return res.redirect('/users/table/'+baseId);
  }

  console.log('table called for correct base id (' + baseId + '), filling table now.');

  // get urls for all users from baseId to (baseid + pagesize -1) 

  var users = [];
  constructUserTable(users, baseId, pageSize, req, res, function(req,res) {
    console.log('users table filled: ' + JSON.stringify(users));
    res.render('pages/faces', { 
      title: 'loopnav faces', 
      users: users, 
      prevPage: baseId - pageSize, 
      nextPage: baseId + pageSize,
      autopilot: req.params.autopilot
    });
  });
}

var constructUserTable = function(u, b, p, req, res, callback) {
  if (u.length >= p) {
    return callback(req,res);
  }
  loop_api.main_info(b, function(err, result) {
    if (err) { 
      u.push({ userId: b, status: 'missing' })
    } else {
      if (result.hasOwnProperty('ProfilePicture') && result.ProfilePicture.toString().contains('Thumb_203_203')) {
        u.push({ userId: b, status: 'ok-with-pic', ProfilePicture: result.ProfilePicture });
      } else {
        u.push({ userId: b, status: 'no-pic' });
      }
    }
    return constructUserTable(u, b+1, p, req, res, callback); 
  });
}

module.exports = router;
