var logger = require('../util/logger');
var express = require('express');
var router = express.Router();



/* Loop auth callback. */
router.get('/callback', function(req, res) {
  logger.info('route GET auth/callback');
  res.render('pages/authcallback', { title: 'Loopnav Auth Callback' } );
});

/* show the login page  - TOD: need to authenticate before rendering */
router.get('/login', function(req, res) {
  logger.info('route GET auth/login');
	res.render('pages/authlogin', { title: 'loopnav: connect with loop' } );
});

/* POST from the login page */
router.post('/login', function(req, res) {
  logger.info('route POST auth/login');
	res.render('pages/index', { title: 'POST - this should be the login page' } );
});

module.exports = router;
