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
		expect(mq.get).to.be.an('function');
		mq.init();
		process.env.CLOUDAMQP_URL = amqp_url;
		done();
	});

  it('open mq with environment var', function(done){
		process.env.CLOUDAMQP_URL = process.env.TEST_RABBITMQ_URL;
		expect(process.env.TEST_RABBITMQ_URL).to.be.an('string');
		expect(process.env.CLOUDAMQP_URL).to.be.an('string');
		var mq = require('../util/mq');
		expect(mq).to.be.an('object');
		expect(mq.publish).to.be.an('function');
		expect(mq.consume).to.be.an('function');
		expect(mq.get).to.be.an('function');
		mq.init();
		process.env.CLOUDAMQP_URL = amqp_url;
		done();
	});

  it('publish obj to mq' , function(done){
		process.env.CLOUDAMQP_URL = process.env.TEST_RABBITMQ_URL;
		expect(process.env.TEST_RABBITMQ_URL).to.be.an('string');
		expect(process.env.CLOUDAMQP_URL).to.be.an('string');
		console.log('TEST_RABBITMQ_URL: ' + process.env.TEST_RABBITMQ_URL);
		var mq = require('../util/mq');
		expect(mq).to.be.an('object');
		expect(mq.publish).to.be.an('function');
		expect(mq.consume).to.be.an('function');
		expect(mq.get).to.be.an('function');
		mq.init();
		var msg = { description: "test" };
	  mq.publish(msg, function(err,res){
			expect(err).to.not.be.ok();
			expect(res).to.be.an('object');
			expect(res.rc).to.eql(true);
			process.env.CLOUDAMQP_URL = amqp_url;
			done();
		});
	});

});
 
