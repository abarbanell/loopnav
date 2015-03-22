var logger = require('./logger');

var q = 'profilepic';
var url = process.env.CLOUDAMQP_URL || "amqp://localhost";

var amqp = require('amqplib/callback_api');
var connection = null;
var channel = null; 


function bail(err, conn) {
	logger.error(err);
	if (conn) {
		conn.close( function() { 
			logger.error('mq connection closed')
		});
	};
};

var mq = function() {

  var publish = function(msg) {

			if (connection && channel) {
				channel.sendToQueue(q, Buffer(msg));
				return;
			}

			amqp.connect(function(err, conn) {
				if (err) {
					bail(err);
					return;
				};
				connection = conn;

				function on_channel_open(err, ch) {
					if (err) {
						bail(err, conn);	
						return;
					}
					channel = ch;
					ch.AssertQueue(q, {durable: false}, function(err, ok) {
						if (err) bail(err, conn);
						ch.sendToQueue(q, Buffer(msg));
						logger.info('[MQ] sent: ' + msg);
					});
				};
				conn.CreateChannel(on_channel_open);
			});
	};

  var consume = function(callback) {
    logger.error('mq.get - not implemented');
		callback({err: 'mq.get - not implemented'}, null);
  };

  var get = function(callback) {
    logger.error('mq.get - not implemented');
		callback({err: 'mq.get - not implemented'}, null);
  };

  return {
    publish: publish,
    consume: consume,
    get: get
  };
}();

module.exports = mq;
