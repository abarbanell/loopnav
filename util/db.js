
var mongo = require('mongoskin');
var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27107/loopnav';
var db = mongo.db(mongourl);

console.log('mongoskin initialized for: ' + mongourl);

module.exports = db;
