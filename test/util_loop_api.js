// test that we have successful api calls

var expect = require('expect.js');
var nock = require('nock');
nock.enableNetConnect(); // we do not use nock in this file yet.
var rewire = require('rewire');
var loop_api = rewire('../util/loop_api');

describe('loop api tests', function() {

	it('check required api object', function(done){
    expect(loop_api.main_info).to.be.an('function');
    expect(loop_api.co_authors).to.be.an('function');
		done();
  });

	it('check loop_api.main_info', function(done){
		// we do not yet use nock
		var scope = nock("http://loop.frontiersin.org", { allowUnmocked: true });
    expect(loop_api.main_info).to.be.an('function');
		var id = 74;
		var obj = loop_api.main_info(id, function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
      done();
		});
  });

	it('check loop_api.co_authors', function(done){
		// we do not yet use nock
		var scope = nock("http://loop.frontiersin.org", { allowUnmocked: true });
    expect(loop_api.co_authors).to.be.an('function');
		var id = 74;
		var obj = loop_api.co_authors(id, function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
      done();
		});
  });

	it('check loop_api with default URL prefix', function(done){
		// we do not use nock here
		var scope = nock("http://loop.frontiersin.org", { allowUnmocked: false });
		delete process.env.LOOP_API_PREFIX;
		expect(process.env.LOOP_API_PREFIX).to.not.be.ok();
		var api2 = rewire('../util/loop_api');
    expect(api2.co_authors).to.be.an('function');
		var id = 1; // this user does not exist so it will not be incache? 
		nock('http://loop.frontiersin.org').get('/api/v1/users/1/main-info')
			.reply(200, {     data: 'OK' });
		var obj = api2.main_info(id, function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			expect(res.data).to.be.eql('OK');
			nock.cleanAll();
      done();
		});
  });


});
 
