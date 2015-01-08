var express = require('express');
var router = express.Router();
var loop_api = require('../util/loop_api');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('pages/index', { title: 'loopnav' });
});

router.get('/user/:id', function(req, res) {
	loop_api.main_info(req.params.id, function(err, result) {
		console.log('api call returned.');
		if (err) {
			res.render('pages/error', { title: 'loopnav error', message: 'API call error' , error: {status: JSON.stringify(err), stack: 'no stack information available'}});
		} else {
			console.log('result: ' + result);
			res.render('pages/user', { title: 'loopnav', user: result });
		}
	});
});

router.get('/about', function(req, res) {
  res.render('pages/about', { title: 'about loopnav' });
});

module.exports = router;
