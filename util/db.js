

var logger = require('./logger');
var mongo = require('mongoskin');
var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27107/loopnav';
var db = mongo.db(mongourl);

logger.info('db - mongoskin initialized for: ' + mongourl);

module.exports = db;
