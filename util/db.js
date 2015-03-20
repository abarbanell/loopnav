
var mongo = require('mongoskin');
var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/loopnav';
var db = mongo.db(mongourl);

module.exports = db;
