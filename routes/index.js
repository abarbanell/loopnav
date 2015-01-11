var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('pages/index', { title: 'loopnav' });
});

router.get('/about', function(req, res) {
  res.render('pages/about', { title: 'about loopnav' });
});


module.exports = router;
