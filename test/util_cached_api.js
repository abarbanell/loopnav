// test that we have successful api calls

var expect = require('expect.js');
var nock = require('nock');
nock.enableNetConnect(); // we do not use nock in this file yet.
var api = require('../util/cached_api');

describe('cached api tests', function() {

	it('check required api object', function(done){
    expect(api.get).to.be.an('function');
    expect(api.post).to.be.an('function');
		done();
  });

	it('check api.get', function(done){
		// we do not yet use nock
		var scope = nock("http://loop.frontiersin.org", { allowUnmocked: true });
    expect(api.get).to.be.an('function');
		var options = "http://loop.frontiersin.org/api/v1/users/79/main-info";
		var obj = api.get(options, function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
      done();
		});
  });

	it('check api.post should return error - not implemented', function(done){
    expect(api.post).to.be.an('function');
		var options = "http://loop.frontiersin.org/api/v1/users/79/main-info";
		var obj = api.post(options, function(err, res) {
			expect(err).to.be.ok();
			expect(res).to.not.be.ok();
      done();
		});
  });

	it('check api.get with Cache MISS', function(done){
		console.log('Cache Miss test not implemented');
		done();
	});

	it('check api.get with Cache EXPIRY', function(done){
		console.log('Cache Expiry test not implemented');
		done();
	});

	it('check api.get with Cache HIT', function(done){
		console.log('Cache HIT test not implemented');
		done();
	});

	it('check api.get with Cache BYPASS', function(done){
		console.log('Cache BYPASS test not implemented');
		done();
	});

	it('check api.get with Mongo Success', function(done){
		console.log('Mongo Success test not implemented');
		done();
	});

	it('check api.get with Mongo Error', function(done){
		console.log('Mongo Error test not implemented');
		done();
	});

});
 
