// test that we have connectivity with http module

var expect = require('expect.js');

var http = require('http');
var nock = require('nock');

describe('http unit tests', function() {

	it('check required http object', function(done){
    expect(http.get).to.be.an('function');
		done();
  });

	it('check http.get mock', function(done) {
		nock('http://www.abarbanell.de').get('/').reply(200, 'OK');

		var options = "http://www.abarbanell.de";
		var request = http.get(options, function(response) {
			console.log("Got response: " + response.statusCode);
			expect(response).to.be.ok();
			expect(response.on).to.be.an('function');
			response.on('data', function(data) {
				console.log("Got data. ");
				expect(data.toString()).to.eql('OK');
			});
			response.on('error', function(err) {
				console.log("Got error: " + e.message);
				expect(err).to.no.be.ok();
				done();
			});
			response.on('end', function(err) {
				expect(err).to.not.be.ok();
				expect(response).to.be.ok();
				done();
			});
		});
	});

});


describe('http INTEGRATION tests', function() {
	if (process.env.TEST_LEVEL != "integration") {
		return;
	}

	it('INTEGRATION: check http.get', function(done){
    expect(http.get).to.be.an('function');
		var options = "http://www.abarbanell.de";
		var request = http.get(options, function(response) {
			console.log("Got response: " + response.statusCode);
			expect(response).to.be.ok();
			expect(response.on).to.be.an('function');
			response.on('data', function(data) {
				console.log("Got data. ");
			});
			response.on('error', function(err) {
				console.log("Got error: " + e.message);
				expect(err).to.no.be.ok();
				done();
			});
			response.on('end', function(err) {
				expect(err).to.not.be.ok();
				done();
			});
		});
  });


});
 
