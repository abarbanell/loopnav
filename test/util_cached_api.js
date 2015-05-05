// test that we have successful api calls

var expect = require('expect.js');
var nock = require('nock');
var sinon = require('sinon');

var api = require('../util/cached_api');

describe('cached api tests', function() {

	it('check required api object', function(done){
    expect(api.get).to.be.an('function');
    expect(api.post).to.be.an('function');
		done();
  });

	it('check api.get', function(done){
		// need to mock out three functions: 
		// db.api.findOne() -- checking cache
		var dbMock = {};
		dbMock.api = {};
		dbMock.api.findOne = sinon.stub.withArgs(options, callback).returns(callback(null, {rc: "stub callback"}));
		// util/api.get (or the http get inside this) 
		// db.api.insert() -- inserting into mongo cache 
		nock('http://loop.frontiersin.org').get('/api/v1/users/79/main-info').reply(200, { data: 'OK' });
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


});
 
