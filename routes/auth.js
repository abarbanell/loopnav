var logger = require('../util/logger');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var oauth2Strategy = require('passport-oauth2').Strategy;


/* Loop auth callback. */
router.get('/callback', function(req, res) {
  res.render('pages/authcallback', { title: 'Loopnav Auth Callback' } );
});

/* show the login page */
router.get('/login', function(req, res) {
	res.render('pages/index', { title: 'GET - this should be the login page' } );
});

/* POST from the login page */
router.post('/login', function(req, res) {
	res.render('pages/index', { title: 'POST - this should be the login page' } );
});

module.exports = router;
