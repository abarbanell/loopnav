var express = require('express');
var router = express.Router();
var loop_api = require('../util/loop_api');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('pages/index', { title: 'loopnav' });
});

router.get('/user/:id', function(req, res) {
	loop_api.main_info(req.params.id, function(err, result) {
		console.log('result: ' + result);
		res.render('pages/user', { title: 'loopnav', user: result });
	});
});

router.get('/about', function(req, res) {
  res.render('pages/about', { title: 'about loopnav' });
});

module.exports = router;
