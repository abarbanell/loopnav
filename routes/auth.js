var logger = require('../util/logger');
var express = require('express');
var router = express.Router();
// var users = require('../model/users.js');

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

/* Loop auth callback. */
router.get('/callback', function(req, res) {
  res.render('pages/authcallback', { title: 'Loopnav Auth Callback' } );
});

module.exports = router;
