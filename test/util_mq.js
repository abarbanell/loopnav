// test util/mq.js
// also check some basic rabbitmq fucntionality to make sure we have connectivity

var expect = require('expect.js');

describe('util/mq tests', function() {

	var amqp_url = process.env.CLOUDAMQP_URL;

  it('open mq without environment var', function(done){
		delete process.env.CLOUDAMQP_URL;
		var mq = require('../util/mq');
		expect(mq).to.be.an('object');
		expect(mq.publish).to.be.an('function');
		expect(mq.consume).to.be.an('function');
		process.env.CLOUDAMQP_URL = amqp_url;
		done();
	});

});
 
