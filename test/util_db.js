// test util/db.js
// also check some basic mongo / mongoskin fucntionality to make sure we have connectivity

var expect = require('expect.js');

describe('util/db tests', function() {
  it('check some syntax of expect.js', function(done) {
    var f = function(){};
    expect(f).to.be.an('function');
    expect(f.doesnotexist).to.not.be.an('function'); // should fail
    expect(f.bind).to.be.an('function'); // Function.prototype.bind()
		done();
  })

  it('can we open a DB from mongoskin directly?', function(done){
		var mongo = require('mongoskin');
		var db = mongo.db('mongodb://localhost:27017/test');
		// console.log(db);
    expect(db).to.an('object');
		expect(db.bind).to.be.an('function');
		db.bind('testcollection');
		expect(db.testcollection).to.be.an('object');
		expect(db.testcollection.find).to.be.an('function');
		db.testcollection.find().toArray(function(err, items) {
			expect(err).to.not.be.ok();
			expect(items).to.be.an('array');
			done();
		});
	});

	it('can we open a DB via MONGOLAG_URI in util/db.js?', function(done) {
		process.env.MONGOLAB_URI = 'mongodb://localhost:27017/test';
		var db = require('../util/db');
    expect(db).to.be.an('object');
		expect(db.bind).to.be.an('function');
		db.bind('testcollection');
		expect(db.testcollection).to.be.an('object');
		expect(db.testcollection.find).to.be.an('function');
		db.testcollection.find().toArray(function(err, items) {
			expect(err).to.not.be.ok();
			expect(items).to.be.an('array');
			done();
		});
	});  

	it('can we open a DB via default connection in util/db.js?', function() {
		delete process.env.MONGOLAB_URI;
		var db = require('../util/db');
    expect(db).to.be.an('object');
		expect(db.bind).to.be.an('function');
		db.bind('testcollection');
		expect(db.testcollection).to.be.an('object');
		expect(db.testcollection.find).to.be.an('function');
		db.testcollection.find().toArray(function(err, items) {
			expect(err).to.not.be.ok();
			expect(items).to.be.an('array');
			done();
		});
	});  
});
 
