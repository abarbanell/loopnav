// test util/mq.js
// also check some basic rabbitmq fucntionality to make sure we have connectivity

var expect = require('expect.js');

describe('util/mq tests', function() {

	var amqp_url = process.env.CLOUDAMQP_URL;

  it('open mq without environment var', function(done){
		delete process.env.CLOUDAMQP_URL;
		var mq = require('../util/mq');
		mq.init();
		expect(mq).to.be.an('object');
		expect(mq.publish).to.be.an('function');
		expect(mq.consume).to.be.an('function');
		expect(mq.get).to.be.an('function');
		process.env.CLOUDAMQP_URL = amqp_url;
		done();
	});

  it('open mq with environment var', function(done){
		expect(process.env.CLOUDAMQP_URL).to.be.an('string');
		var mq = require('../util/mq');
		mq.init();
		expect(mq).to.be.an('object');
		expect(mq.publish).to.be.an('function');
		expect(mq.consume).to.be.an('function');
		expect(mq.get).to.be.an('function');
		done();
	});

  it('publish obj to mq' , function(done){
		expect(process.env.CLOUDAMQP_URL).to.be.an('string');
		console.log('CLOUDAMQP_URL: ' + process.env.CLOUDAMQP_URL);
		var mq = require('../util/mq');
		mq.init();
		expect(mq).to.be.an('object');
		expect(mq.publish).to.be.an('function');
		expect(mq.consume).to.be.an('function');
		expect(mq.get).to.be.an('function');
		var msg = { description: "test" };
	  mq.publish(msg, function(err,res){
			expect(err).to.not.be.ok();
			expect(res).to.be.an('object');
			expect(res.rc).to.eql(true);
			done();
		});
	});

});
 
