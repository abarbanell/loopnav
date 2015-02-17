// test that we have connectivity with http module

var expect = require('expect.js');

var http = require('http');

describe('http tests', function() {

	it('check required http object', function(done){
    expect(http.get).to.be.an('function');
		done();
  });

	it('check http.get', function(done){
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
			});
			response.on('end', function(err) {
				expect(err).to.not.be.ok();
				done();
			});
		});
  });


});
 
