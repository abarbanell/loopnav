
var dbfunc = function(callback) {
    var logger = require('./logger');
    var mongo = require('mongoskin');
    var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27107/loopnav';
    var db = mongo.db(mongourl);
    var lrc = null;
    db.open(function(err, lrc) {
        if (err) {
            logger.error('db.js: could not open db: ' + err);
        } else {
            logger.info('db - mongoskin initialized for: ' + mongourl);
        }
        return callback(err, lrc);
    })
};

module.exports = dbfunc;
